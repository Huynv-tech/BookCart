using BookCart.Interfaces;
using BookCart.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace BookCart.DataAccess
{
    public class DocumentResultDataAccessLayer : IDocumentResultService
    {
        readonly BookDBContext _dbContext;

        public DocumentResultDataAccessLayer(BookDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Document> GetAllBooks(string userOwner)
        {
            try
            {
                if (!string.IsNullOrEmpty(userOwner))
                {
                    return _dbContext.Document.Where(d=>d.Owner == userOwner).AsNoTracking().ToList();
                }
                else
                {
                    return _dbContext.Document.AsNoTracking().ToList();
                }
            }
            catch
            {
                throw;
            }
        }

        public int AddBook(Document book)
        {
            try
            {
                _dbContext.Document.Add(book);
                _dbContext.SaveChanges();

                return 1;
            }
            catch
            {
                throw;
            }
        }

        public int UpdateBook(Document book)
        {
            try
            {
                Document oldBookData = GetBookData(book.DocumentId);

                if (oldBookData.CoverFileName != null)
                {
                    if (book.CoverFileName == null)
                    {
                        book.CoverFileName = oldBookData.CoverFileName;
                    }
                }

                _dbContext.Entry(book).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return 1;
            }
            catch
            {
                throw;
            }
        }

        public Document GetBookData(int documentId)
        {
            try
            {
                Document book = _dbContext.Document.FirstOrDefault(x => x.DocumentId == documentId);
                if (book != null)
                {
                    _dbContext.Entry(book).State = EntityState.Detached;
                    return book;
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public string DeleteBook(int documentId)
        {
            try
            {
                Document book = _dbContext.Document.Find(documentId);
                _dbContext.Document.Remove(book);
                _dbContext.SaveChanges();

                return (book.CoverFileName);
            }
            catch
            {
                throw;
            }
        }

        public List<Categories> GetCategories()
        {
            List<Categories> lstCategories = new List<Categories>();
            lstCategories = (from CategoriesList in _dbContext.Categories select CategoriesList).ToList();

            return lstCategories;
        }

        public List<Document> GetSimilarBooks(int documentId)
        {
            List<Document> lstBook = new List<Document>();
            Document book = GetBookData(documentId);

            lstBook = _dbContext.Document.Where(x => x.Category == book.Category && x.DocumentId != book.DocumentId)
                .OrderBy(u => Guid.NewGuid())
                .Take(5)
                .ToList();
            return lstBook;
        }

    }
}
