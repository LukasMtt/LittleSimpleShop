namespace Shop.ApiModels;

public class CategoryModel : BaseApiModel {
    public required string Name { get; set; }
    public ICollection<PublicImageModel> Images { get; set; } = new List<PublicImageModel>();
    public ICollection<ProductModel> ProductList { get; set; } = new List<ProductModel>();
}