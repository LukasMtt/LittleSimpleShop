using Microsoft.AspNetCore.Mvc;

using Shop.ApiModels;
using Shop.Data.Enums;
using Shop.Interfaces;
using Shop.Service;

namespace Shop.Controllers;

public class ShippingController : ShopBaseController
{
    private ShippingService _shippingService;

    public ShippingController(IFileStorageService fileStorageService, ShippingService shippingService) : base(fileStorageService)
    {
        _shippingService = shippingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetShippingTimeEstimation(ShippingProvider shippingProvider)
    {
        /* stub call, params not yet implemented */
        var result = await _shippingService.GetShippingTimeSpanEstimation(shippingProvider, 0, 0);
        return result.IsSuccess
            ? Ok(new ShippingEstimationModel { MinDays = result.ResultData!.MinDays, MaxDays = result.ResultData!.MaxDays })
            : Problem(result.ErrorMessage, statusCode: 500);
    }
}