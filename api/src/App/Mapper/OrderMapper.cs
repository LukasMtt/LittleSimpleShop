using Riok.Mapperly.Abstractions;

using Shop.ApiModels;
using Shop.Data.DataModels;

[Mapper]
public partial class OrderMapper
{
    public partial OrderSummaryModel OrderToOrderSummaryModel(Order order);
}