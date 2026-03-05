using AutoMapper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Service;

namespace App.Controllers;

[ApiController]
public class OrderController : ShopBaseController
{
    private IMapper _mapper;
    private ShopDbContext _context;
    private ShippingService _shippingService;

    public OrderController(IMapper mapper, ShopDbContext context, ShippingService shippingService, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _mapper = mapper;
        _context = context;
        _shippingService = shippingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrderExists(string orderToken)
    {
        var entity = _context.Order.FirstOrDefault(x => x.OrderToken == orderToken);
        return entity == null ? Ok(false) : Ok(true);

    }

    [HttpGet]
    public async Task<IActionResult> GetOrderInformation(string orderToken)
    {
        var entity = _context.Order.IgnoreQueryFilters()
            .Include(x => x.Cart).ThenInclude(x => x!.CartItems)
            .Include(x => x.ShipmentTarget).ThenInclude(x => x!.Address)
            .FirstOrDefault(x => x.OrderToken == orderToken);

        if (entity == null || entity.State == OrderState.Removed || entity.State == OrderState.IssuePending)
        {
            return Problem("Could not display order.", statusCode: 500);
        }

        var model = _mapper.Map<OrderSummaryModel>(entity);
        model.OrderDate = entity.OrderDate.ToShortDateString();
        model.State = entity.State.ToString();
        model.OrderEstimatedDeliveryDate = (await _shippingService.GetDeliveryDate(entity)).ResultData.ToShortDateString();
        model.ShippingProvider = entity.ShippingProvider?.ToString() ?? "";
        model.ShippingProviderOrderId = (await _shippingService.GetShippingId(entity)).ResultData;
        model.ShippingProviderTrackingLink = (await _shippingService.GetShippingTrackingLink(entity)).ResultData;

        return Ok(model);
    }
}
