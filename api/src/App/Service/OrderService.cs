using AutoMapper;

using EntityFramework.Exceptions.Common;

using Shop.ApiModels;
using Shop.Data;
using Shop.Data.DataModels;
using Shop.Data.Enums;
using Shop.Misc;

namespace Shop.Service;

public class OrderService
{
    private ShopDbContext _context;
    private IMapper _mapper;
    private ShippingService _shippingService;

    public OrderService(ShopDbContext context, IMapper mapper, ShippingService shippingService)
    {
        _context = context;
        _mapper = mapper;
        _shippingService = shippingService;
    }

    public async Task<ServiceResult<Order?>> CreateAndSaveOrder(CheckoutModel model, Cart cart)
    {
        try
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            var shipmentTarget = _mapper.Map<ShipmentTarget>(model);

            var order = new Order
            {
                OrderDate = DateTime.UtcNow,
                DiscountCode = model.DiscountCode,
                OrderToken = CreateOrderToken().ResultData,
                Cart = cart,
                ShipmentTarget = shipmentTarget,
                ShippingProvider = model.ShippingProvider,
                ShippingCost = (await _shippingService.GetShippingCost(model.ShippingProvider)).ResultData,
                State = OrderState.Preparing,
            };

            foreach (var cartItem in cart.CartItems)
            {
                var product = _context.Product.Find(cartItem.ProductId);
                if (product == null)
                {
                    Serilog.Log.Warning("Failed to create order due to non existent product");
                    return new ServiceResult<Order?> { IsSuccess = false, ErrorMessage = "Failed to create order." };
                }
                product.AmountInStock = product.AmountInStock - cartItem.Amount;
                order.OrderProducts.Add(new OrderProduct
                {
                    Product = product,
                    Quantity = cartItem.Amount,
                    Order = order
                });
            }

            _context.Order.Add(order);

            var isSuccess = (await _context.SaveChangesAsync()) > 0;

            if (isSuccess)
            {
                await transaction.CommitAsync();
                return new ServiceResult<Order?> { IsSuccess = true, ResultData = order };
            }
            else
            {
                await transaction.RollbackAsync();
                return new ServiceResult<Order?> { IsSuccess = false, ErrorMessage = "Failed to create order." };
            }
        }
        // ugly, better implementation needed
        catch (ReferenceConstraintException referenceConstraintException) when (referenceConstraintException?.InnerException?.Message.Contains("CHECK") ?? false)
        {
            // handle in frontend with more specific error message?
            Serilog.Log.Error("Product could not be added to order since the amount in stock dropped to zero.");
            return new ServiceResult<Order?> { IsSuccess = false, ErrorMessage = "Failed to create order." };
        }
        catch (Exception)
        {
            Serilog.Log.Error("Could not instantiate order");
            return new ServiceResult<Order?> { IsSuccess = false, ErrorMessage = "Failed to create order." };
        }

    }

    public ServiceResult<string> CreateOrderToken()
    {
        var timePortion = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
        return new ServiceResult<string>
        {
            IsSuccess = true,
            ResultData = $"{Guid.NewGuid()}-{timePortion}"
        };
    }
}