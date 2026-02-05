using Microsoft.AspNetCore.Mvc;
using Shop.ApiModels;

namespace App.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public class MetadataController : ShopBaseController
{
    [HttpGet]
    public MetadataShopModel GetMetadata()
    {
        return new MetadataShopModel
        {
            Email = "my.imaginery.shop@contact.com",
            Phone = "0123 1234567"
        };
    }
}
