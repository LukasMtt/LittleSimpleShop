namespace Shop.ApiModels;

public class MetadataModel
{
    public string? ShopEmail { get; set; }
    public string? ShopPhone { get; set; }
    public decimal? FreeShippingThreshold { get; set; }
    public int? ShippingReturnThreshold { get; set; }
    public string? ShippingAndReturnPolicyDescription { get; set; }
    public string? FaqText { get; set; }
    public string? ContactText { get; set; }
    public string? AboutText { get; set; }
    public string? ImprintText { get; set; }
}