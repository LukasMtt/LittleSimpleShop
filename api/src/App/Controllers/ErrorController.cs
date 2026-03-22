using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Shop.Controllers;

[ApiController]
public class ErrorController : ControllerBase
{
    private readonly IHostEnvironment _hostEnvironment;
    private readonly ILogger<ErrorController> _logger;

    public ErrorController(IHostEnvironment hostEnvironment, ILogger<ErrorController> logger)
    {
        _hostEnvironment = hostEnvironment;
        _logger = logger;
    }

    [Route("/error")]
    [HttpGet, HttpPost, HttpPut, HttpDelete, HttpOptions, HttpHead, HttpPatch]
    public ActionResult HandleError()
    {
        var exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;
        if (exception != null)
        {
            _logger.LogError(exception, "An error occurred while processing the request.");
            if (_hostEnvironment.IsDevelopment())
            {
                throw exception;
            }
        }
        return Problem("An error occurred while processing the request.", statusCode: 500);
    }
}
