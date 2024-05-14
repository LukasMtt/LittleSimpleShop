using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Data.DataModels;

[Table("Product")]
public class ProductEntity : BaseDataModel {
    public string ProductName { get; set; }
}