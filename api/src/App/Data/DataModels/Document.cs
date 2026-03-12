using System.ComponentModel.DataAnnotations.Schema;

using Shop.Data.Enums;

namespace Shop.Data.DataModels;

[Table("Document")]
public class Document : Entity
{
    public string? FileId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string? Description { get; set; }
    public required string FileExtension { get; set; }
    public long? OrderId { get; set; }
    public Order? Order { get; set; }
}