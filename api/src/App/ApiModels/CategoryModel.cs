namespace Shop.ApiModels;

public class CategoryModel : BaseApiModel {
    public required string Name { get; set; }
    public ICollection<ImageModel> Images { get; set; } = new List<ImageModel>();
    public ICollection<ProductModel> ProductList { get; set; } = new List<ProductModel>();
}