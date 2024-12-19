using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("News")]
public class News : Entity {
    public string ShortText { get; set; }
    public string LongText { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}