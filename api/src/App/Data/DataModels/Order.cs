using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Order")]
public class Order : Entity
{
    public DateTime OrderDate { get; set; }
    public string? DiscountCode { get; set; }
    public OrderState State { get; set; }
    public string? OrderToken { get; set; }
    public ShippingProvider? ShippingProvider { get; set; }
    // placeholder for real implementation and usage of mapping to shipping API
    public string? ShippingProviderOrderId { get; set; }
    public Cart? Cart { get; set; }
    public ShipmentTarget? ShipmentTarget { get; set; }
    public string? InvoiceNumber { get; set; }
    public List<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
    public List<OrderEmail> OrderEmails { get; set; } = new List<OrderEmail>();
    public List<Document> OrderDocuments { get; set; } = new List<Document>();

}