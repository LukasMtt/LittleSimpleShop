using System.ComponentModel.DataAnnotations;

namespace Shop.Data.DataModels;

public class Entity {
    [Key]
    public long Id { get; set; }
}