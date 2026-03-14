using Shop.Data.Enums;

namespace Shop.ApiModels;

public class CheckoutModel : BaseApiModel
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? CompanyName { get; set; }
    public required string Email { get; set; }
    public bool IsNewsletterActivated { get; set; }
    public string? Phone { get; set; }
    public required CheckoutAddressModel Address { get; set; }
    public string? DiscountCode { get; set; }
    public ShippingProvider ShippingProvider { get; set; }
}