using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Category")]
public class CategoryEntity : BaseEntity {
    public string Name { get; set; }
    public ImageEntity Image { get; set; }
    public ICollection<ProductEntity> ProductList { get; set; } = new List<ProductEntity>();
}