using Shop.ApiModels;
using Shop.Data;
using Shop.Misc.Interfaces;
using Stripe;
using Stripe.Checkout;

namespace Shop.Misc;

public class StripePaymentService
{
    private IAppSettingsConfigurationService _appSettingsConfigurationService;
    private ShopDbContext _context;
    private string _currency;
    private readonly List<string> _allowedPaymentMethods = new List<string> { "card", "paypal" };

    public StripePaymentService(IAppSettingsConfigurationService appSettingsConfigurationService, ShopDbContext context)
    {
        _appSettingsConfigurationService = appSettingsConfigurationService;
        _context = context;
        _currency = _appSettingsConfigurationService.GetAppSettingsConfiguration()["StripeCurrency"];
    }

    public async Task<Session> CreateCheckoutSession(CheckoutCartModel model)
    {
        StripeConfiguration.ApiKey = _appSettingsConfigurationService.GetAppSettingsConfiguration()["StripePrivateKey"];
        var frontendBaseUrl = _appSettingsConfigurationService.GetAppSettingsConfiguration()["FrontendBaseUrl"];

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = _allowedPaymentMethods ,
            LineItems = ConvertCheckoutCartItems(model),
            Mode = "payment",
            SuccessUrl = FrontendHelper.GetPaymentSuccessUrl(frontendBaseUrl),
            CancelUrl = FrontendHelper.GetPaymentCancelUrl(frontendBaseUrl),
        };

        var service = new SessionService();
        return await service.CreateAsync(options);
    }

    private List<SessionLineItemOptions> ConvertCheckoutCartItems(CheckoutCartModel model)
    {
        var lineItems = new List<SessionLineItemOptions>();
        foreach (var item in model.CartItems)
        {
            var product = _context.Product.FirstOrDefault(x => x.Id == item.ProductId);
            if (product != null)
            {
                lineItems.Add(new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = _currency,
                        UnitAmountDecimal = product.Price * 100,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = product.Name,
                        },
                    },
                    Quantity = item.Count,
                });  
            }
        }
        return lineItems;
    }
}