using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

using Serilog;

using Shop.ApiModels;
using Shop.Data;
using Shop.Misc;

using Stripe;
using Stripe.Checkout;

namespace Shop.Service;

public class StripePaymentService
{
    private IOptions<AppOptions> _appOptions;
    private ShopDbContext _context;
    private string _currency;
    private readonly List<string> _allowedPaymentMethods = new List<string> { "card", "paypal", "alipay" };

    public StripePaymentService(IOptions<AppOptions> appOptions, ShopDbContext context)
    {
        _appOptions = appOptions;
        _context = context;
        _currency = _appOptions.Value.StripeCurrency!;

        StripeConfiguration.ApiKey = _appOptions.Value.StripePrivateKey;
    }

    public async Task<Session> CreateCheckoutSession(CartModel model, long orderId)
    {
        var frontendBaseUrl = _appOptions.Value.FrontendBaseUrl;

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
        var webhookSecret = _appOptions.Value.StripeWebhookSecret;
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

    private List<SessionLineItemOptions> ConvertCheckoutCartItems(CartModel model)
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
                    Quantity = item.Amount,
                });
            }
        }
        return lineItems;
    }
}