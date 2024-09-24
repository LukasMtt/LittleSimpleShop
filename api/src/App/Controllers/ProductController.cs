using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shop.ApiModels;
using Shop.Data;

namespace App.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public class ProductController : ShopBaseController
{
    private IMapper _mapper;
    private ShopDbContext _context;

    public ProductController(IMapper mapper, ShopDbContext context) : base() {
        _mapper = mapper;
        _context = context;
    }

    [HttpGet]
    public List<CategoryModel> GetAllCategories()
    {
        return _context.Category
            .Include(x => x.ProductList)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<CategoryModel>(x))
            .ToList()
            .OrderBy(x => x.Id)
            .ToList();
    }

    [HttpGet]
    public List<ProductModel> GetAllProducts()
    {
        return _context.Product
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .ToList()
            .OrderBy(x => x.Id)
            .ToList();
    }

    [HttpGet]
    public List<ProductModel> GetAllProductsByCategoryId(long categoryId, int pageOffset, int pageSize)
    {
        return _context.Product
            .Where(x => x.Category.Id == categoryId)
            .OrderBy(x => x.Id)
            .Skip(pageOffset*pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .ToList();
    }

    [HttpGet]
    public ProductModel GetProductById(long productId)
    {
        return _context.Product
            .Where(x => x.Id == productId)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .FirstOrDefault();
    }

    [HttpGet]
    public int GetProductsByCategoryIdCount(long categoryId)
    {
        return _context.Product
            .Where(x => x.Category.Id == categoryId)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .ToList()
            .OrderBy(x => x.Id)
            .Count();
    }
}