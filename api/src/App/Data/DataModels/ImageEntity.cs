using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Image")]
public class Image : Entity {
    public string? FileId { get; set; }
    public required string Description { get; set; }
    public required string FileExtension { get; set; }
    public long? CategoryId { get; set; }
    public long? ProductId { get; set; }
}