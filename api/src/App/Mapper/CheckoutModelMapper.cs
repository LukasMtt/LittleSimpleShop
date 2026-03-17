using Riok.Mapperly.Abstractions;

using Shop.ApiModels;
using Shop.Data.DataModels;

[Mapper]
public partial class CheckoutModelMapper
{
    public partial ShipmentTarget CheckoutModelToShipmentTarget(CheckoutModel checkoutModel);
}