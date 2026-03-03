using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("ShipmentAddress")]
public class ShipmentAddress : Entity
{
    public required string Number { get; set; }
    public string? Addition { get; set; }
    public required string Street { get; set; }
    public required string Zip { get; set; }
    public required string City { get; set; }
    public required Country Country { get; set; }
}