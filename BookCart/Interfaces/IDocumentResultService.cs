using BookCart.Models;
using System.Collections.Generic;

namespace BookCart.Interfaces
{
    public interface IDocumentResultService
    {
        List<Document> GetAllBooks(string userOwner);
        int AddBook(Document book);
        int UpdateBook(Document book);
        Document GetBookData(int documentId);
        string DeleteBook(int documentId);
        List<Categories> GetCategories();
        List<Document> GetSimilarBooks(int documentId);
    }
}
