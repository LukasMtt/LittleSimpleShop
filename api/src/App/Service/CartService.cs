using Shop.Data;
using Shop.Data.DataModels;
using Shop.Data.Enums;
using Shop.Misc;

namespace Shop.Service;

public class CartService
{
    private ShopDbContext _context;

    public CartService(ShopDbContext context)
    {
        _context = context;
    }

    public virtual ServiceResult<string> CreateCartToken()
    {
        return new ServiceResult<string>
        {
            IsSuccess = true,
            ResultData = Guid.NewGuid().ToString()
        };
    }

    public virtual async Task<ServiceResult<bool>> ArchiveCart(Cart cart)
    {
        cart.State = CartLifecycleState.Archived;
        var isSuccess = await _context.SaveChangesAsync() == 1;
        return new ServiceResult<bool>
        {
            IsSuccess = isSuccess,
            ResultData = isSuccess,
            ErrorMessage = isSuccess ? "" : "Could not archive the cart."
        };
    }
}