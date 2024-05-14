using Microsoft.AspNetCore.Mvc;
using Shop.Data;
using Shop.Misc.Interfaces;

namespace App.Controllers;

[ApiController]
public abstract class ShopBaseController : ControllerBase
{
    protected ShopDbContext Context;

    public ShopBaseController(IAppSettingsConfigurationService appSettingsConfigurationService) {
        Context = new ShopDbContext(appSettingsConfigurationService);
    }
}
