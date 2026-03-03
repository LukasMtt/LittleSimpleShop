using Shop.Data;
using Shop.Data.DataModels;

namespace Shop.Service;

public class CartService
{
    private ShopDbContext _context;

    public CartService(ShopDbContext context)
    {
        _context = context;
    }

    public string CreateCartToken()
    {
        return Guid.NewGuid().ToString();
    }

    public async Task<bool> ArchiveCart(Cart cart)
    {
        cart.State = CartLifecycleState.Archived;
        return await _context.SaveChangesAsync() == 1;
    }
}