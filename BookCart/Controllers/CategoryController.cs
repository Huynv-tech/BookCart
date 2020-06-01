using BookCart.Interfaces;
using BookCart.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CategoryCart.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class CategoryController : Controller
    {
        readonly ICategoryService _categoryService;
        readonly IConfiguration _config;

        public CategoryController(IConfiguration config, ICategoryService categoryService)
        {
            _config = config;
            _categoryService = categoryService;
        }

        /// <summary>
        /// Get the list of available Categorys
        /// </summary>
        /// <returns>List of Category</returns>
        [HttpGet]
        [Authorize(Policy = UserRoles.Admin)]
        public async Task<List<Categories>> Get()
        {
            return await Task.FromResult(_categoryService.GetAllCategories());
        }

        /// <summary>
        /// Get the specific Category data corresponding to the CategoryId
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [Authorize(Policy = UserRoles.Admin)]
        public IActionResult Get(int id)
        {
            Categories Category = _categoryService.GetCategoryData(id);
            if(Category!=null)
            {
                return Ok(Category);
            }
            return NotFound();
        }

        /// <summary>
        /// Add a new Category record
        /// </summary>
        /// <returns></returns>
        [HttpPost, DisableRequestSizeLimit]
        [Authorize(Policy = UserRoles.Admin)]
        public int Post()
        {
            Categories category = JsonConvert.DeserializeObject<Categories>(Request.Form["CategoryFormData"].ToString());
            return _categoryService.AddCategory(category);
        }

        /// <summary>
        /// Update a particular Category record
        /// </summary>
        /// <returns></returns>
        [HttpPut]
        [Authorize(Policy = UserRoles.Admin)]
        public int Put()
        {
            Categories category = JsonConvert.DeserializeObject<Categories>(Request.Form["CategoryFormData"].ToString());
            return _categoryService.UpdateCategory(category);
        }

        /// <summary>
        /// Delete a particular Category record
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Policy = UserRoles.Admin)]
        public int Delete(int id)
        {
            string coverFileName = _categoryService.DeleteCategory(id);
            return 1;
        }
    }
}
