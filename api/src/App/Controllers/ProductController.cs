using Microsoft.AspNetCore.Mvc;
using Serilog;
using Shop.Data;

namespace App.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public class ProductController : ShopBaseController
{
    [HttpGet]
    public IEnumerable<string> GetProductList()
    {
        Log.Information("list of Hello world");
        // var context = new ShopDbContext();
        // var prods = context.Product.ToList();
        return new List<string> { "hellow word" };
    }

    [HttpGet]
    public string GetProduct()
    {
        Log.Information("Hello world");
        return "hello world";
    }
}
