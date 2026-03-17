using Riok.Mapperly.Abstractions;

using Shop.ApiModels;
using Shop.Data.DataModels;

[Mapper]
public partial class CartMapper
{
    public partial CartModel CartToCartModel(Cart cart);
}