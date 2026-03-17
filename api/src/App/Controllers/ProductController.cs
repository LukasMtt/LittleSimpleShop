using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Interfaces;

namespace Shop.Controllers;

[ApiController]
public class ProductController : ShopBaseController
{
    private ShopDbContext _context;

    public ProductController(ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<List<ProductModel>> GetAllProducts(int pageOffset, int pageSize)
    {
        var mapper = new ProductMapper();

        return _context.Product
            .AsNoTracking()
            .OrderBy(x => x.Category!.Name)
            .Skip(pageOffset * pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => mapper.ProductToProductModel(x))
            .ToList();
    }

    [HttpGet]
    public ActionResult<List<ProductModel>> GetAllProductsInSale(int pageOffset, int pageSize)
    {
        var mapper = new ProductMapper();

        return _context.Product
            .AsNoTracking()
            .Where(x => x.IsInSale)
            .OrderBy(x => x.Category!.Name)
            .Skip(pageOffset * pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => mapper.ProductToProductModel(x))
            .ToList();
    }

    [HttpGet]
    public ActionResult<List<ProductModel>> GetAllProductsByCategoryId(long categoryId, int pageOffset, int pageSize)
    {
        var mapper = new ProductMapper();

        return _context.Product
            .AsNoTracking()
            .Where(x => x.Category!.Id == categoryId)
            .OrderBy(x => x.Id)
            .Skip(pageOffset * pageSize)
            .Take(pageSize)
            .Include(x => x.Images)
            .Select(x => mapper.ProductToProductModel(x))
            .ToList();
    }

    [HttpGet]
    public ActionResult<ProductModel?> GetProductById(long productId)
    {
        var mapper = new ProductMapper();

        return _context.Product
            .Where(x => x.Id == productId)
            .Include(x => x.Images)
            .Select(x => mapper.ProductToProductModel(x))
            .FirstOrDefault();
    }

    [HttpGet]
    public ActionResult<bool> IsProductInStock(long productId)
    {
        return _context.Product
            .Where(x => x.Id == productId && x.AmountInStock > 0)
            .Any();
    }

    [HttpGet]
    public ActionResult<int> GetProductsByCategoryIdCount(long categoryId)
    {
        return _context.Product
            .Where(x => x.Category!.Id == categoryId)
            .Count();
    }

    [HttpGet]
    public ActionResult<int> GetAllProductsCount()
    {
        return _context.Product.Count();
    }

    [HttpGet]
    public ActionResult<int> GetAllProductsInSaleCount()
    {
        return _context.Product
            .Where(x => x.IsInSale)
            .Count();
    }

    [HttpPost]
    public ActionResult<List<ProductModel>> GetProductsByIds([FromBody] List<long> productIdList)
    {
        var mapper = new ProductMapper();

        return _context.Product
            .Where(x => productIdList.Contains(x.Id))
            .Include(x => x.Images)
            .Select(x => mapper.ProductToProductModel(x))
            .ToList()
            .OrderBy(x => x.Id)
            .ToList();
    }
}