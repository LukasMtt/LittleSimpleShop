using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Shop.ApiModels;

namespace App.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public class ProductController : ShopBaseController
{
    private IMapper _mapper;

    public ProductController(IMapper mapper) : base() {
        _mapper = mapper;
    }

    [HttpGet]
    public ProductModel GetProduct()
    {
        var exampleProduct = Context.Product.ToList().First();
        var model = _mapper.Map<ProductModel>(exampleProduct);
        return model;
    }
}
