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
        // store token in the response cookie that gets actually evaluated on the way back within antiforgery filter
        AntiforgeryTokenSet tokens = _antiforgery.GetAndStoreTokens(HttpContext);

        if (tokens.RequestToken != null)
        {
            // this cookie serves as the cookie that can be read client side and based on that the header is generated
            HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions { HttpOnly = false, Path = "/", SameSite = SameSiteMode.Strict, Secure = true });
        }

        return Ok();
    }
}
