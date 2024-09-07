using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Category")]
public class Category : Entity {
    public string Name { get; set; }
    public ICollection<Image> Image { get; set; } = new List<Image>();
    public ICollection<Product> ProductList { get; set; } = new List<Product>();
}