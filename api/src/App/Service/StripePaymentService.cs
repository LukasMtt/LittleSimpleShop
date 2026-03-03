using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

using Serilog;

using Shop.Data;
using Shop.Data.DataModels;
using Shop.Misc;

using Stripe;
using Stripe.Checkout;

namespace Shop.Service;

// full power of stripe not used yet (states and various payment methods details) - implement for prod use cases and harden process with more in-depth knowledge of payment flow in stripe
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

    public async Task<Session> CreateCheckoutSession(Cart cart, Order order)
    {
        var frontendBaseUrl = _appOptions.Value.FrontendBaseUrl;

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = _allowedPaymentMethods,
            LineItems = ConvertCheckoutCartItems(cart),
            // entry point to map a discount code to stripe payment process - has to be created within stripe to map the code to value
            // Discounts = new List<SessionDiscountOptions>(),
            Metadata = new Dictionary<string, string>
            {
                { "OrderToken",  order?.OrderToken ?? "" }
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
                    HandleCheckoutSessionCompleted(session);
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

    private void HandleCheckoutSessionCompleted(Session session)
    {
        // if (!await _cartService.ArchiveCart(cart))
        // {
        //     return Problem("Checkout did not succeed.", statusCode: 500);
        // }
        //todo send mail with: link to sub site that tracks your order etc
        //todo update order status to "preparing" zu Beginn
        //todo create document
        //todo hier vlt schon einen Schritt weiter mit order status zu "processing"
    }

    private List<SessionLineItemOptions> ConvertCheckoutCartItems(Cart cart)
    {
        var lineItems = new List<SessionLineItemOptions>();

        foreach (var item in cart.CartItems)
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