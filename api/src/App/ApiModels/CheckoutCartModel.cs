namespace Shop.ApiModels;

public class CheckoutCartModel
{
    public IList<CartItemModel> CartItems { get; set; }
}