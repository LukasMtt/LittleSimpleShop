using Microsoft.AspNetCore.Mvc;
using Shop.ApiModels;

namespace App.Controllers;

[ApiController]
public class MetadataController : ShopBaseController
{
    public MetadataController(IFileStorageService fileStorageService) : base(fileStorageService)
    {
    }

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
