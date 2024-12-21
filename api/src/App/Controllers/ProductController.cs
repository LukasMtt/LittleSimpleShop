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
    public List<ProductModel> GetAllProducts(int pageOffset, int pageSize)
    {
        return _context.Product
            .OrderBy(x => x.Category.Name)
            .Skip(pageOffset*pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .ToList();
    }

        [HttpGet]
    public List<ProductModel> GetAllProductsInSale(int pageOffset, int pageSize)
    {
        return _context.Product
            .Where(x => x.IsInSale)
            .OrderBy(x => x.Category.Name)
            .Skip(pageOffset*pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
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
            .Count();
    }

    [HttpGet]
    public int GetAllProductsCount()
    {
        return _context.Product.Count();
    }

    [HttpGet]
    public int GetAllProductsInSaleCount()
    {
        return _context.Product
            .Where(x => x.IsInSale)
            .Count();
    }
    
    //todo not good style to use post here
    [HttpPost]
    public List<ProductModel> GetProductsByIds([FromBody] List<long> productIdList)
    {
        return _context.Product
            .Where(x => productIdList.Contains(x.Id))
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .ToList()
            .OrderBy(x => x.Id)
            .ToList();
    }
}