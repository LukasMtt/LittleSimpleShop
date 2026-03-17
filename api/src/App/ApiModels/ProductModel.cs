using Shop.Data.Enums;

namespace Shop.ApiModels;

public class ProductModel : BaseApiModel
{
    public required string Name { get; set; }
    public required string ShortDescription { get; set; }
    public List<string> HighlightDescriptions { get; set; } = new List<string>();
    public string? DetailDescription { get; set; }
    public string? SafetyUsageDescription { get; set; }
    public decimal Price { get; set; }
    public ICollection<PublicImageModel> Images { get; set; } = new List<PublicImageModel>();
    public bool IsInSale { get; set; }
    public ProductLifecycleState LifecycleState { get; set; }
    public bool IsInStock { get; set; }
}