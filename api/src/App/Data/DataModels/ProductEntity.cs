using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Product")]
public class ProductEntity : BaseEntity {
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<ImageEntity> Image { get; set; } = new List<ImageEntity>();
    public long CategoryId { get; set; }
    public CategoryEntity Category { get; set; }
}