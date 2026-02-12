using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Category")]
public class Category : Entity {
    public string? Name { get; set; }
    public CategoryType CategoryType { get; set; }
    public ICollection<PublicImage> Images { get; set; } = new List<PublicImage>();
    public ICollection<Product> ProductList { get; set; } = new List<Product>();
}