namespace Shop.ApiModels;

public class CheckoutAddressModel : BaseApiModel
{
  public required string Street { get; set; }
  public required string Number { get; set; }
  public string? Addition { get; set; }
  public required string City { get; set; }
  public required string Country { get; set; }
  public required string Zip { get; set; }
}