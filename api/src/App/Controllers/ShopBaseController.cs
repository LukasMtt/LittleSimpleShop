using Microsoft.AspNetCore.Mvc;

using Shop.Interfaces;

namespace Shop.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public abstract class ShopBaseController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;

    protected readonly string CartTokenCookieName = "CartToken";

    public ShopBaseController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    protected async Task<FileContentResult?> GetFileAsync(string fileId)
    {
        var fileContent = (await _fileStorageService.GetFileAsync(fileId)).ResultData;
        if (fileContent == null)
        {
            return null;
        }

        return File(await fileContent.ReadAsByteArrayAsync(), fileContent.Headers.ContentType!.ToString());
    }
}
