using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Order")]
public class Order : Entity
{
    public DateTime OrderDate { get; set; }
    public List<OrderProduct> OrderProducts { get; set; }
}