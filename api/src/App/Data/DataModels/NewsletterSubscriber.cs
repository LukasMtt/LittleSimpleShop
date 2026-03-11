using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("NewsletterSubscriber")]
public class NewsletterSubscriber : Entity
{
    public required string Email { get; set; }
    public bool IsActive { get; set; }
}