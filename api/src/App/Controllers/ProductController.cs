using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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

    public ProductController(IMapper mapper, ShopDbContext context) : base() {
        _mapper = mapper;
        _context = context;
    }

    [HttpGet]
    public List<CategoryModel> GetAllCategories()
    {
        var categoryModelList = _context.Category.Select(x => _mapper.Map<CategoryModel>(x)).ToList();
        return categoryModelList;
    }

    [HttpGet]
    public List<ProductModel> GetAllProducts()
    {
        var productModelList = _context.Product.Select(x => _mapper.Map<ProductModel>(x)).ToList();
        return productModelList;
    }

    [HttpGet]
    public List<ProductModel> GetAllProducts(CategoryEntity category)
    {
        var productModelList = _context.Product.Where(x => x.Category.Id == category.Id).Select(x => _mapper.Map<ProductModel>(x)).ToList();
        return productModelList;
    }

    [HttpGet]
    public List<ProductModel> GetAllProducts(long categoryId)
    {
        var productModelList = _context.Product.Where(x => x.Category.Id == categoryId).Select(x => _mapper.Map<ProductModel>(x)).ToList();
        return productModelList;
    }
}