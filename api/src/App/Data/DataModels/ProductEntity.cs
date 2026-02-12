using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Product")]
public class Product : Entity
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public ICollection<PublicImage> Images { get; set; } = new List<PublicImage>();
    public long CategoryId { get; set; }
    public Category? Category { get; set; }
    public bool IsInSale { get; set; }
    public ProductLifecycleState LifecycleState { get; set; }
}