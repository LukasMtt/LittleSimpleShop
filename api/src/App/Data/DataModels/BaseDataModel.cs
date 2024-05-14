using Microsoft.EntityFrameworkCore;

namespace Shop.Data.DataModels;

[PrimaryKey(nameof(Id))]
public class BaseDataModel {
    public long Id { get; set; }
}