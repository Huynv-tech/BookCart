using BookCart.Models;
using System.Collections.Generic;

namespace BookCart.Interfaces
{
    public interface ICategoryService
    {
        List<Categories> GetAllCategories();
        int AddCategory(Categories Category);
        int UpdateCategory(Categories Category);
        Categories GetCategoryData(int CategoryId);
        string DeleteCategory(int CategoryId);
    }
}
