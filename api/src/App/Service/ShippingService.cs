using App.Misc;

using Shop.Data.DataModels;

namespace Shop.Service;

/* A real implementation requires to integrate a shipping providers (or several) APIs (best case - abstract with interface):
    * fetch/use geo location data for estimate
    * return actual info on successful payment/order placement
    * connect to API for adjacent services from shipping provider that are used from within the shop if necessary (track the delivery, attach order stamp/marks to responsible entity/trigger service...)
*/
public class ShippingService
{
    public ShippingService()
    {
    }

    /* only dummy data, not suitable for real production use case! */
    public async Task<ServiceResult<(int MinDays, int MaxDays)>> GetShippingTimeSpanEstimation(ShippingProvider shippingProvider, double latitude, double longitude)
    {
        var result = new ServiceResult<(int MinDays, int MaxDays)>
        {
            IsSuccess = true,
            ResultData = (MinDays: 3, MaxDays: 5)
        };
        return await Task.FromResult(result);
    }

    /* only dummy data, plug in real logic from a shipping provider to fetch a target date (or remove if we just redirect to shipping providers site) */
    public async Task<ServiceResult<DateTime>> GetDeliveryDate(Order order)
    {
        var result = new ServiceResult<DateTime>
        {
            IsSuccess = true,
            ResultData = order.OrderDate.AddDays(5)
        };
        return await Task.FromResult(result);
    }

    /* only dummy data, plug in real logic from a shipping provider to fetch real value (or remove if we just redirect to shipping providers site) */
    public async Task<ServiceResult<string>> GetShippingId(Order order)
    {
        var result = new ServiceResult<string>
        {
            IsSuccess = true,
            ResultData = "Shipping_Track_Id_123"
        };
        return await Task.FromResult(result);
    }

    /* only dummy data, plug in real logic from a shipping provider to fetch real value (or remove if we just redirect to shipping providers site) */
    public async Task<ServiceResult<string>> GetShippingTrackingLink(Order order)
    {
        var result = new ServiceResult<string>
        {
            IsSuccess = true,
            ResultData = "www.link-to-my-shipping-provider.de"
        };
        return await Task.FromResult(result);
    }
}