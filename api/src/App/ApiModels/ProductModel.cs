namespace Shop.ApiModels;

public class ProductModel : BaseApiModel
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public ICollection<ImageModel> Images { get; set; } = new List<ImageModel>();
    public required CategoryModel Category { get; set; }
    public bool IsInSale { get; set; }
    public ProductLifecycleState LifecycleState { get; set; }
}