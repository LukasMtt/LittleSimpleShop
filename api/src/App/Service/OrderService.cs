using App.Misc;

using Shop.ApiModels;
using Shop.Data;
using Shop.Data.DataModels;

namespace Shop.Service;

public class OrderService
{
    private ShopDbContext _context;

    public OrderService(ShopDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult> CreateAndSaveOrder(CheckoutCartModel model)
    {
        var order = new Order
        {
            OrderDate = DateTime.UtcNow
        };

        order.OrderProducts = model.CartItems?.Select(item => new OrderProduct
        {
            Product = _context.Product.Find(item.ProductId)!,
            Quantity = item.Count,
            Order = order
        }).ToList() ?? new List<OrderProduct>();

        _context.Order.Add(order);

        return await _context.SaveChangesAsync() > 0
            ? new ServiceResult { IsSuccess = true, ResultData = order.Id }
            : new ServiceResult { IsSuccess = false, ErrorMessage = "Failed to create order." };
    }
}