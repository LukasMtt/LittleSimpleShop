using System.ComponentModel.DataAnnotations;

namespace Shop.Data.DataModels;

public class BaseEntity {
    [Key]
    public long Id { get; set; }
}