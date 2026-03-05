namespace Shop.ApiModels;

public class OrderSummaryModel
{
    public required string State { get; set; }
    public required string OrderDate { get; set; }
    public required string OrderEstimatedDeliveryDate { get; set; }
    public required string ShippingProvider { get; set; }
    public string? ShippingProviderOrderId { get; set; }
    public string? ShippingProviderTrackingLink { get; set; }
    public CartModel? Cart { get; set; }
    public CheckoutModel? ShipmentTarget { get; set; }
}