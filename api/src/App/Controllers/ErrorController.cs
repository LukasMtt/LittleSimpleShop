using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Shop.Controllers;

[ApiController]
public class ErrorController : ControllerBase
{
    private readonly IHostEnvironment _hostEnvironment;

    public ErrorController(IHostEnvironment hostEnvironment)
    {
        _hostEnvironment = hostEnvironment;
    }

    [Route("/error")]
    [HttpGet, HttpPost, HttpPut, HttpDelete, HttpOptions, HttpHead, HttpPatch]
    public ActionResult HandleError()
    {
        var exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;
        if (exception != null)
        {
            Serilog.Log.Error(exception, "An error occurred while processing the request.");
            if (_hostEnvironment.IsDevelopment())
            {
                throw exception;
            }
        }
        return StatusCode(500, "An error occurred while processing the request.");
    }
}
