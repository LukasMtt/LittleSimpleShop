using Microsoft.AspNetCore.Mvc;
using Shop.Data;

namespace App.Controllers;

[ApiController]
public abstract class ShopBaseController : ControllerBase
{
    protected ShopDbContext Context;

    public ShopBaseController() {
        Context = new ShopDbContext();
    }
}
