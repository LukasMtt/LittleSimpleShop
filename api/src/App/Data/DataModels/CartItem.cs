
namespace Shop.Data.DataModels;

public class CartItem : Entity
{
    public long? ProductId { get; set; }
    public Product? Product { get; set; }
    public long? CartId { get; set; }
    public Cart? Cart { get; set; }
    public int Amount { get; set; }
}