using Microsoft.Extensions.Primitives;
using Serilog;
using Shop.ApiModels;
using Shop.Data;
using Shop.Misc.Interfaces;
using Stripe;
using Stripe.Checkout;

namespace Shop.Service;

public class StripePaymentService
{
    private IAppSettingsConfigurationService _appSettingsConfigurationService;
    private ShopDbContext _context;
    private string _currency;
    private readonly List<string> _allowedPaymentMethods = new List<string> { "card", "paypal", "alipay" };

    public StripePaymentService(IAppSettingsConfigurationService appSettingsConfigurationService, ShopDbContext context)
    {
        _appSettingsConfigurationService = appSettingsConfigurationService;
        _context = context;
        _currency = _appSettingsConfigurationService.GetAppSettingsConfiguration()["StripeCurrency"]!;

        StripeConfiguration.ApiKey = _appSettingsConfigurationService.GetAppSettingsConfiguration()["StripePrivateKey"];
    }

    public async Task<Session> CreateCheckoutSession(CheckoutCartModel model, long orderId)
    {
        var frontendBaseUrl = _appSettingsConfigurationService.GetAppSettingsConfiguration()["FrontendBaseUrl"];

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = _allowedPaymentMethods,
            LineItems = ConvertCheckoutCartItems(model),
            Metadata = new Dictionary<string, string>
            {
                { "InternalOrderId",  orderId.ToString() }
            },
            Mode = "payment",
            SuccessUrl = FrontendHelper.GetPaymentSuccessUrl(frontendBaseUrl!),
            CancelUrl = FrontendHelper.GetPaymentCancelUrl(frontendBaseUrl!),
        };

        var service = new SessionService();
        return await service.CreateAsync(options);
    }

    public bool HandleStripeWebhookEvent(string json, StringValues signatureHeader)
    {
        var webhookSecret = _appSettingsConfigurationService.GetAppSettingsConfiguration()["StripeWebhookSecret"];
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json, signatureHeader, webhookSecret);
            switch (stripeEvent.Type)
            {
                case EventTypes.CheckoutSessionCompleted:
                    var session = stripeEvent.Data.Object as Session;
                    Log.Information("Checkout session completed: {0}", session!.Id);
                    HandleCheckoutSessionCompletedEvent(session);
                    break;
            }
            return true;
        }
        catch (StripeException e)
        {
            Log.Error("Stripe webhook error: {0}", e.Message);
            return false;
        }
    }

    private void HandleCheckoutSessionCompletedEvent(Session session)
    {
        //todo send mail with: link to sub site that tracks your order etc
        //todo update order status 
        //todo create document
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