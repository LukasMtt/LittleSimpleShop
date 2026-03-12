using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

using Shop.Data.Enums;

namespace Shop.Data.DataModels;

[Table("Product")]
public class Product : Entity
{
    public string? Name { get; set; }
    public string? ShortDescription { get; set; }
    [NotMapped]
    public List<string> HighlightDescriptions
    {
        get
        {
            if (string.IsNullOrEmpty(HighlightDescriptionsJson))
            {
                return new List<string>();
            }
            return JsonSerializer.Deserialize<List<string>>(HighlightDescriptionsJson) ?? new List<string>();
        }
        set { HighlightDescriptionsJson = JsonSerializer.Serialize(value); }
    }
    public string? HighlightDescriptionsJson { get; set; }
    public string? DetailDescription { get; set; }
    public string? SafetyUsageDescription { get; set; }
    public decimal Price { get; set; }
    public ICollection<PublicImage> Images { get; set; } = new List<PublicImage>();
    public long CategoryId { get; set; }
    public Category? Category { get; set; }
    public bool IsInSale { get; set; }
    public ProductLifecycleState LifecycleState { get; set; }
    public int AmountInStock { get; set; }
    [NotMapped]
    public bool IsInStock
    {
        get
        {
            return AmountInStock > 0;
        }
        private set
        {
        }
    }

}