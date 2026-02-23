using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("PublicImage")]
public class PublicImage : Entity
{
    public string? FileId { get; set; }
    public required string Description { get; set; }
    public required string FileExtension { get; set; }
    public long? CategoryId { get; set; }
    public long? ProductId { get; set; }
}