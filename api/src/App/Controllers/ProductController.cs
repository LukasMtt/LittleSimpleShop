using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
    public ProductModel GetProduct()
    {
        var exampleProduct = _context.Product.ToList().First();
        var model = _mapper.Map<ProductModel>(exampleProduct);
        return model;
    }
}