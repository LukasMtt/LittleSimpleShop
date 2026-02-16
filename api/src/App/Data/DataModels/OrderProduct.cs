using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("OrderProduct")]
public class OrderProduct : Entity
{
    public required Order Order { get; set; }
    public required Product Product { get; set; }
    public int Quantity { get; set; }
}