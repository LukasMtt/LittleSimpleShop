namespace Shop.ApiModels;

public class CategoryModel : BaseApiModel {
    public string Name { get; set; }
    public ICollection<ImageModel> Images { get; set; }
    public ICollection<ProductModel> ProductList { get; set; }
}