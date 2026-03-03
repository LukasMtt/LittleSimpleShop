using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Order")]
public class Order : Entity
{
    public DateTime OrderDate { get; set; }
    public string? DiscountCode { get; set; }
    public OrderState State { get; set; }
    public string? OrderToken { get; set; }
    public Cart? Cart { get; set; }
    public ShipmentTarget? ShipmentTarget { get; set; }
    public List<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
}