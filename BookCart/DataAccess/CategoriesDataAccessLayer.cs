using BookCart.Interfaces;
using BookCart.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace BookCart.DataAccess
{
    public class CategoriesDataAccessLayer : ICategoryService
    {
        readonly BookDBContext _dbContext;

        public CategoriesDataAccessLayer(BookDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Categories> GetAllCategories()
        {
            try
            {
                return _dbContext.Categories.AsNoTracking().ToList();
            }
            catch
            {
                throw;
            }
        }

        public int AddCategory(Categories catgegory)
        {
            try
            {
                _dbContext.Categories.Add(catgegory);
                _dbContext.SaveChanges();

                return 1;
            }
            catch
            {
                throw;
            }
        }

        public int UpdateCategory(Categories category)
        {
            try
            {
                Categories oldCategoryData = GetCategoryData(category.CategoryId);
                oldCategoryData.CategoryName = category.CategoryName;
                _dbContext.Entry(oldCategoryData).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return 1;
            }
            catch
            {
                throw;
            }
        }

        public Categories GetCategoryData(int categoryId)
        {
            try
            {
                Categories category = _dbContext.Categories.FirstOrDefault(x => x.CategoryId == categoryId);
                if (category != null)
                {
                    _dbContext.Entry(category).State = EntityState.Detached;
                    return category;
                }
                return null;
            }
            catch
            {
                throw;
            }
        }

        public string DeleteCategory(int categoryId)
        {
            try
            {
                Categories category = _dbContext.Categories.Find(categoryId);
                _dbContext.Categories.Remove(category);
                _dbContext.SaveChanges();

                return (category.CategoryName);
            }
            catch
            {
                throw;
            }
        }

    }
}
