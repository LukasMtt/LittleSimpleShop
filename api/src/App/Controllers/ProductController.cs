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
        var categoryModelList = _context.Category
                                    .Include(x => x.ProductList)
                                    .Include(x => x.Image)
                                    .Select(x => _mapper.Map<CategoryModel>(x))
                                    .ToList();
        return categoryModelList;
    }

    [HttpGet]
    public List<ProductModel> GetAllProducts()
    {
        var productModelList = _context.Product
                                    .Include(x => x.Image)
                                    .Select(x => _mapper.Map<ProductModel>(x))
                                    .ToList();
        return productModelList;
    }

    [HttpGet]
    public List<ProductModel> GetAllProductsByCategoryId(long categoryId)
    {
        var productModelList = _context.Product
                                    .Where(x => x.Category.Id == categoryId)
                                    .Include(x => x.Image)
                                    .Select(x => _mapper.Map<ProductModel>(x))
                                    .ToList();
        return productModelList;
    }
}