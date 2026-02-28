namespace Shop.ApiModels;

public class CartModel
{
    public IList<CartItemModel> CartItems { get; set; } = new List<CartItemModel>();
}