using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BookCart.Interfaces;
using BookCart.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace BookCart.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class DocumentController : Controller
    {
        readonly IWebHostEnvironment _hostingEnvironment;
        readonly IDocumentResultService _bookService;
        readonly IConfiguration _config;
        readonly string coverImageFolderPath = string.Empty;

        public DocumentController(IConfiguration config, IWebHostEnvironment hostingEnvironment, IDocumentResultService bookService)
        {
            _config = config;
            _bookService = bookService;
            _hostingEnvironment = hostingEnvironment;
            coverImageFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "Upload");
            if (!Directory.Exists(coverImageFolderPath))
            {
                Directory.CreateDirectory(coverImageFolderPath);
            }
        }

        /// <summary>
        /// Get the list of available books
        /// </summary>
        /// <returns>List of Book</returns>
        [HttpGet]
        public async Task<List<Document>> Get()
        {
            var userType = User.Claims.FirstOrDefault(c => c.Type == "userTypeId")?.Value;
            if (userType == UserRoles.Contributor)
            {
                var userName = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
                return await Task.FromResult(_bookService.GetAllBooks(userName));
            }
            else
            {
                return await Task.FromResult(_bookService.GetAllBooks(string.Empty));
            }
        }

        /// <summary>
        /// Get the specific book data corresponding to the documentId
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            Document book = _bookService.GetBookData(id);
            if (book != null)
            {
                return Ok(book);
            }
            return NotFound();
        }

        /// <summary>
        /// Get the list of available categories
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCategoriesList")]
        public async Task<IEnumerable<Categories>> CategoryDetails()
        {
            return await Task.FromResult(_bookService.GetCategories());
        }

        /// <summary>
        /// Get the random five books from the category of book whose documentId is supplied
        /// </summary>
        /// <param name="documentId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSimilarBooks/{documentId}")]
        public async Task<List<Document>> SimilarBooks(int documentId)
        {
            return await Task.FromResult(_bookService.GetSimilarBooks(documentId));
        }

        /// <summary>
        /// Add a new book record
        /// </summary>
        /// <returns></returns>
        [HttpPost, DisableRequestSizeLimit]
        [Authorize(Policy = "Manager")]
        public int Post()
        {
            Document book = JsonConvert.DeserializeObject<Document>(Request.Form["documentFormData"].ToString());
            book.Owner = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
            if (Request.Form.Files.Count > 0)
            {
                var file = Request.Form.Files[0];

                if (file.Length > 0)
                {
                    string fileName = Guid.NewGuid() + ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(coverImageFolderPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    book.CoverFileName = fileName;
                }
            }
            else
            {
                book.CoverFileName = _config["DefaultCoverImageFile"];
            }
            return _bookService.AddBook(book);
        }

        /// <summary>
        /// Update a particular book record
        /// </summary>
        /// <returns></returns>
        [HttpPut]
        [Authorize(Policy = "Manager")]
        public int Put()
        {
            Document book = JsonConvert.DeserializeObject<Document>(Request.Form["documentFormData"].ToString());
            book.Owner = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
            if (Request.Form.Files.Count > 0)
            {
                var file = Request.Form.Files[0];

                if (file.Length > 0)
                {
                    string fileName = Guid.NewGuid() + ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(coverImageFolderPath, fileName);
                    bool isFileExists = Directory.Exists(fullPath);

                    if (!isFileExists)
                    {
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                        book.CoverFileName = fileName;
                    }
                }
            }
            return _bookService.UpdateBook(book);
        }

        /// <summary>
        /// Delete a particular book record
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Policy = UserRoles.Admin)]
        public int Delete(int id)
        {
            string coverFileName = _bookService.DeleteBook(id);
            if (coverFileName != _config["DefaultCoverImageFile"])
            {
                string fullPath = Path.Combine(coverImageFolderPath, coverFileName);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            return 1;
        }
    }
}
