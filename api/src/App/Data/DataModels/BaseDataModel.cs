using Microsoft.EntityFrameworkCore;

namespace Shop.Data.DataModels;

[PrimaryKey(nameof(Id))]
public class BaseDataModel {
    public int Id { get; set; }
}