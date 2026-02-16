using App.Controllers;
using Microsoft.AspNetCore.Mvc;
using Shop.Data;
using Shop.Data.DataModels;

public class PublicImageController : ShopBaseController
{
    private ShopDbContext _context;

    public PublicImageController(ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPublicImage(long imageId, string fileId)
    {
        var image = _context.PublicImage
            .FirstOrDefault(x => x.Id == imageId && x.FileId == fileId);

        return await GetFileAsync(image);
    }

    [NonAction]
    private async Task<IActionResult> GetFileAsync(PublicImage? image)
    {
        if (image?.FileId == null)
        {
            return NotFound();
        }

        var fileContentResult = await GetFileAsync(image.FileId);
        if (fileContentResult == null)
        {
            return NotFound();
        }

        return fileContentResult;
    }
}