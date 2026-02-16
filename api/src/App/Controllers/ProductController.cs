using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shop.ApiModels;
using Shop.Data;

namespace App.Controllers;

[ApiController]
public class ProductController : ShopBaseController
{
    private IMapper _mapper;
    private ShopDbContext _context;

    public ProductController(IMapper mapper, ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService)
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

    [HttpGet]
    public List<ProductModel> GetAllProducts(int pageOffset, int pageSize)
    {
        return _context.Product
            .OrderBy(x => x.Category!.Name)
            .Skip(pageOffset * pageSize)
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
            .OrderBy(x => x.Category!.Name)
            .Skip(pageOffset * pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .ToList();
    }

    [HttpGet]
    public List<ProductModel> GetAllProductsByCategoryId(long categoryId, int pageOffset, int pageSize)
    {
        return _context.Product
            .Where(x => x.Category!.Id == categoryId)
            .OrderBy(x => x.Id)
            .Skip(pageOffset * pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => _mapper.Map<ProductModel>(x))
            .ToList();
    }

    [HttpGet]
    public ProductModel? GetProductById(long productId)
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
            .Where(x => x.Category!.Id == categoryId)
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