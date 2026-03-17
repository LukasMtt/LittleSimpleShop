using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Data.Enums;
using Shop.Interfaces;

namespace Shop.Controllers;

[ApiController]
public class CategoryController : ShopBaseController
{
    private ShopDbContext _context;

    public CategoryController(ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<List<CategoryModel>> GetAllCustomCategories()
    {
        var mapper = new CategoryMapper();

        return _context.Category
            .AsNoTracking()
            .Where(x => x.CategoryType == CategoryType.Custom)
            .Include(x => x.ProductList)
            .Include(x => x.Images)
            .Select(x => mapper.CategoryToCategoryModel(x))
            .ToList()
            .OrderBy(x => x.Id)
            .ToList();
    }

    [HttpGet]
    public ActionResult<CategoryModel?> GetSaleCategory()
    {
        var mapper = new CategoryMapper();

        return _context.Category
            .Where(x => x.CategoryType == CategoryType.Sale)
            .Include(x => x.Images)
            .Select(x => mapper.CategoryToCategoryModel(x))
            .FirstOrDefault();
    }

    [HttpGet]
    public ActionResult<CategoryModel?> GetAllCategory()
    {
        var mapper = new CategoryMapper();

        return _context.Category
            .Where(x => x.CategoryType == CategoryType.All)
            .Include(x => x.Images)
            .Select(x => mapper.CategoryToCategoryModel(x))
            .FirstOrDefault();
    }
}