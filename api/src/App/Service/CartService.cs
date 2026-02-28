namespace Shop.Service;

public class CartService
{
    public CartService()
    {
    }

    public string CreateCartToken()
    {
        return Guid.NewGuid().ToString();
    }
}