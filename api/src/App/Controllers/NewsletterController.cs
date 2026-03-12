using Microsoft.AspNetCore.Mvc;

using Shop.Service;

namespace App.Controllers;

[ApiController]
public class NewsletterController : ShopBaseController
{
    private NewsletterService _newsletterService;

    public NewsletterController(NewsletterService newsletterService, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _newsletterService = newsletterService;
    }

    [HttpPost]
    public async Task<ActionResult> PostNewsletterSubscriber([FromQuery] string email)
    {

        if ((await _newsletterService.AddActiveNewsletterSubscriber(email)).ResultData)
        {
            return Created();
        }
        else
        {
            return Problem("Could not register the email as a newsletter subscriber.", statusCode: 400);
        }
    }
}
