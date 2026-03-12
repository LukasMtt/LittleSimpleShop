using AutoMapper;

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
    private IMapper _mapper;
    private ShopDbContext _context;

    public CategoryController(IMapper mapper, ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _mapper = mapper;
        _context = context;
    }

    [HttpGet]
    public List<CategoryModel> GetAllCustomCategories()
    {
        return _context.Category
            .Where(x => x.CategoryType == CategoryType.Custom)
            .Include(x => x.ProductList)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<CategoryModel>(x))
            .ToList()
            .OrderBy(x => x.Id)
            .ToList();
    }

    [HttpGet]
    public CategoryModel? GetSaleCategory()
    {
        return _context.Category
            .Where(x => x.CategoryType == CategoryType.Sale)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<CategoryModel>(x))
            .FirstOrDefault();
    }

    [HttpGet]
    public CategoryModel? GetAllCategory()
    {
        return _context.Category
            .Where(x => x.CategoryType == CategoryType.All)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<CategoryModel>(x))
            .FirstOrDefault();
    }
}