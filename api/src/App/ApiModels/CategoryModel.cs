namespace Shop.ApiModels;

public class CategoryModel : BaseApiModel {
    public string Name { get; set; }
    public ImageModel Image { get; set; }
    public ICollection<ProductModel> ProductList { get; set; } = new List<ProductModel>();
}