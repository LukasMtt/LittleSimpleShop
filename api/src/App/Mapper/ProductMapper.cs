using Riok.Mapperly.Abstractions;

using Shop.ApiModels;
using Shop.Data.DataModels;

[Mapper]
public partial class ProductMapper
{
    public partial ProductModel ProductToProductModel(Product product);
}