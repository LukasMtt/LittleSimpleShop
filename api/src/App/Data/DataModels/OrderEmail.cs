using System.ComponentModel.DataAnnotations.Schema;

using Shop.Data.Enums;

namespace Shop.Data.DataModels;

[Table("OrderEmail")]
public class OrderEmail : Entity
{
    public required long OrderId { get; set; }
    public required Order Order { get; set; }
    public required OrderEMailType OrderEMailType { get; set; }
    public required DateTime SendDate { get; set; }
}