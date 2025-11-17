using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("OrderProduct")]
public class OrderProduct : Entity {
    public Order Order { get; set; }
    public Product Product { get; set; }
    public int Quantity { get; set; }
}