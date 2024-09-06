using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Category")]
public class CategoryEntity : BaseEntity {
    public string Name { get; set; }
    public ICollection<ImageEntity> Image { get; set; } = new List<ImageEntity>();
    public ICollection<ProductEntity> ProductList { get; set; } = new List<ProductEntity>();
}