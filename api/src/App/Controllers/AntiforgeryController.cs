using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace Shop.Controllers;

[ApiController]
[Route("shop/[controller]/[action]")]
public class AntiforgeryController : ControllerBase
{
    private readonly IAntiforgery _antiforgery;

    public AntiforgeryController(IAntiforgery antiforgery) : base()
    {
        _antiforgery = antiforgery;
    }

    [HttpGet]
    public IActionResult GetAntiforgeryToken()
    {
        // only responsible for generating and sending the antiforgery token to the client via cookie at first load of SPA
        // functionality for the form embedded token not used
        _antiforgery.GetAndStoreTokens(HttpContext);
        return Ok();
    }
}
