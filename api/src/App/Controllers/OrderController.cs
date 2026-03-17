using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Data.Enums;
using Shop.Interfaces;
using Shop.Service;

namespace Shop.Controllers;

[ApiController]
public class OrderController : ShopBaseController
{
    private ShopDbContext _context;
    private ShippingService _shippingService;

    public OrderController(ShopDbContext context, ShippingService shippingService, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _context = context;
        _shippingService = shippingService;
    }

    [HttpGet]
    public async Task<ActionResult<bool>> GetOrderExists(string orderToken)
    {
        var entity = _context.Order.FirstOrDefault(x => x.OrderToken == orderToken);
        return entity == null ? Ok(false) : Ok(true);

    }

    [HttpGet]
    public async Task<ActionResult<OrderSummaryModel>> GetOrderInformation(string orderToken)
    {
        var entity = _context.Order.IgnoreQueryFilters()
            .Where(x => x.OrderToken == orderToken)
            .Include(x => x.Cart).ThenInclude(x => x!.CartItems)
            .Include(x => x.ShipmentTarget).ThenInclude(x => x!.Address)
            .FirstOrDefault();

        if (entity == null || entity.State == OrderState.Removed || entity.State == OrderState.IssuePending)
        {
            return Problem("Could not display order.", statusCode: 400);
        }

        var mapper = new OrderMapper();
        var model = mapper.OrderToOrderSummaryModel(entity);
        model.OrderDate = entity.OrderDate.ToShortDateString();
        model.State = entity.State.ToString();
        model.OrderEstimatedDeliveryDate = (await _shippingService.GetDeliveryDate(entity)).ResultData.ToShortDateString();
        model.ShippingProvider = entity.ShippingProvider?.ToString() ?? "";
        model.ShippingProviderOrderId = (await _shippingService.GetShippingId(entity)).ResultData;
        model.ShippingProviderTrackingLink = (await _shippingService.GetShippingTrackingLink(entity)).ResultData;

        return Ok(model);
    }
}
