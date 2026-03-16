using Microsoft.AspNetCore.Mvc;

using Shop.Data.Enums;
using Shop.Interfaces;

namespace Shop.Controllers;

public class CountryController : ShopBaseController
{

    public CountryController(IFileStorageService fileStorageService) : base(fileStorageService)
    {
    }

    [HttpGet]
    public async Task<ActionResult<string>> GetCountries()
    {
        return Ok(Enum.GetValues<Country>().Select(x => x.ToString()));
    }
}