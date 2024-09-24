namespace Shop.ApiModels;

public class ProductModel : BaseApiModel {
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<ImageModel> Images { get; set; }
    public CategoryModel Category { get; set; }
}