using Microsoft.AspNetCore.Mvc;

namespace App.Controllers;

[ApiController]
public abstract class ShopBaseController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;

    public ShopBaseController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    protected async Task<FileContentResult?> GetFileAsync(string fileId)
    {
        var fileContent = await _fileStorageService.GetFileAsync(fileId);
        if (fileContent == null)
        {
            return null;
        }

        return File(await fileContent.ReadAsByteArrayAsync(), fileContent.Headers.ContentType!.ToString());
    }
}
