using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace App.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public class ProductController : ShopBaseController
{
    [HttpGet]
    public IEnumerable<string> GetProductList()
    {
        Log.Information("list of Hello world");
        return new List<string>() {"hello world"};
    }

    [HttpGet]
    public string GetProduct()
    {
        Log.Information("Hello world");
        return "hello world";
    }
}
