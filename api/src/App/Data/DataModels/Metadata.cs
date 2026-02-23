using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Metadata")]
public class Metadata : Entity
{
    public required string ShopEmail { get; set; }
    public required string? ShopPhone { get; set; }
    public required decimal FreeShippingThreshold { get; set; }
    public required string BaseCurrency { get; set; }
    public required int ShippingReturnThreshold { get; set; }
    public required string ShippingAndReturnPolicyDescription { get; set; }
}