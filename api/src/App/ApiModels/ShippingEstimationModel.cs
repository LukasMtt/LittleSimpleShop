namespace Shop.ApiModels;

public class ShippingEstimationModel
{
    public required int MinDays { get; set; }
    public required int MaxDays { get; set; }
}