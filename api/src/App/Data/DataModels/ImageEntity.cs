using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Image")]
public class Image : Entity {
    public byte[] Bytes { get; set; }
    public string Description { get; set; }
    public string FileExtension { get; set; }
    public decimal Size { get; set; }
    public long CategoryId { get; set; }
    public long ProductId { get; set; }
}