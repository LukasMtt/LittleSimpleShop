using Microsoft.AspNetCore.Mvc;

namespace App.Controllers;

[ApiController]
[Route("[controller]")]
public class InitialTestController : ControllerBase
{
    [HttpGet(Name = "GetTest")]
    public string Get()
    {
        return "Hello World";
    }
}
