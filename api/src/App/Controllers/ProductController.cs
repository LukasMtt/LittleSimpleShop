using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shop.ApiModels;
using Shop.Data;
using Shop.Data.DataModels;

namespace App.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public class ProductController : ShopBaseController
{
    private IMapper _mapper;
    private ShopDbContext _context;

    public ProductController(IMapper mapper, ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService) {
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
            .OrderBy(x => x.Category!.Name)
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
            .OrderBy(x => x.Category!.Name)
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
            .Where(x => x.Category!.Id == categoryId)
            .OrderBy(x => x.Id)
            .Skip(pageOffset*pageSize)
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

    [HttpGet]
    public async Task<IActionResult> GetCategoryImage(long categoryId, long imageId)
    {
        var images = _context.Category
            .Where(x => x.Id == categoryId)
            .Include(x => x.Images)
            .SelectMany(x => x.Images);
            
        return await GetFileAsync(images, imageId);
    }

    [HttpGet]
    public async Task<IActionResult> GetProductImage(long productId, long imageId)
    {
        var images = _context.Product
            .Where(x => x.Id == productId)
            .Include(x => x.Images)
            .SelectMany(x => x.Images);
            
        return await GetFileAsync(images, imageId);
    }

    [NonAction]
    private async Task<IActionResult> GetFileAsync(IQueryable<Image> imageQueryable, long imageId)
    {
        var image = imageQueryable.FirstOrDefault(x => x.Id == imageId);
        if (image?.FileId == null)
        {
            return NotFound();
        }

        var fileContentResult = await GetFileAsync(image.FileId);
        if (fileContentResult == null)
        {
            return NotFound();
        }

        return fileContentResult;
    }
}