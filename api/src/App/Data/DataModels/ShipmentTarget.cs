using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("ShipmentTarget")]
public class ShipmentTarget : Entity
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? CompanyName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public bool IsNewsletterActivated { get; set; }
    public required ShipmentAddress Address { get; set; }
}