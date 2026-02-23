using App.Misc;

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
        return new ServiceResult<(int MinDays, int MaxDays)>
        {
            IsSuccess = true,
            ResultData = (MinDays: 3, MaxDays: 5)
        };
    }
}