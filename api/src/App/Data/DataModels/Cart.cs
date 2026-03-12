
using Shop.Data.Enums;

namespace Shop.Data.DataModels;

public class Cart : Entity
{
    public required string CartToken { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public CartLifecycleState State { get; set; }
}