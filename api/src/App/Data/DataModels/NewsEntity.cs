using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("News")]
public class News : Entity {
    public required string ShortText { get; set; }
    public required string LongText { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}