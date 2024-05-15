using System.ComponentModel.DataAnnotations;

namespace Shop.Data.DataModels;

public class BaseDataModel {
    [Key]
    public long Id { get; set; }
}