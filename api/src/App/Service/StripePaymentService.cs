using System.Resources;

using Fluid;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

using MimeKit;

using Serilog;

using Shop.Data;
using Shop.Data.DataModels;
using Shop.Data.Enums;
using Shop.Helper;
using Shop.Misc;
using Shop.Templates;

using Stripe;
using Stripe.Checkout;

namespace Shop.Service;

// full power of stripe not used yet (states and various payment methods details) - implement for prod use cases and harden process with more in-depth knowledge of payment flow in stripe
public class StripePaymentService
{
    private IOptions<AppOptions> _appOptions;
    private ShopDbContext _context;
    private MailService _mailService;
    private InvoiceService _invoiceService;
    private FluidParser _fluidParser;
    private ResourceManager _resourceManager;
    private string _currency;

    private readonly List<string> _allowedPaymentMethods = new List<string> { "card", "paypal", "alipay" };
    private readonly string _metadataOrderToken = "OrderToken";
    private readonly string _frontendBaseUrl;

    public StripePaymentService(IOptions<AppOptions> appOptions, ShopDbContext context, MailService mailService, InvoiceService invoiceService, FluidParser fluidParser)
    {
        _appOptions = appOptions;
        _context = context;
        _currency = GetCurrencyFromCultureCode(_appOptions.Value.CultureCode).ResultData!;
        _mailService = mailService;
        _fluidParser = fluidParser;
        _invoiceService = invoiceService;

        _resourceManager = new ResourceManager("OrderConfirmEmail", typeof(Program).Assembly);

        StripeConfiguration.ApiKey = _appOptions.Value.StripePrivateKey;
        _frontendBaseUrl = _appOptions.Value.FrontendBaseUrl;
    }

    public async Task<ServiceResult<Session>> CreateCheckoutSession(Cart cart, Order order)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = _allowedPaymentMethods,
            LineItems = ConvertCheckoutCartItems(cart),
            // entry point to map integrated shipping info to stripe payment process - has to be created within stripe to map shipment config there to our config
            // ShippingOptions = new List<SessionShippingOptionOptions>(),
            // entry point to map a discount code to stripe payment process - has to be created within stripe to map the code to value
            // Discounts = new List<SessionDiscountOptions>(),
            Metadata = new Dictionary<string, string>
            {
                { _metadataOrderToken,  order?.OrderToken ?? "" }
            },
            Mode = "payment",
            SuccessUrl = $"{FrontendHelper.GetPaymentSuccessUrl(_frontendBaseUrl)}/{order?.OrderToken ?? ""}",
            CancelUrl = FrontendHelper.GetPaymentCancelUrl(_frontendBaseUrl!),
        };

        var service = new SessionService();
        return new ServiceResult<Session>
        {
            IsSuccess = true,
            ResultData = await service.CreateAsync(options)
        };
    }

    // this might handle one case in the variety of stripe return values, but is not enough for a hardened prod work flow with delayed payment, more complex error cases and different payment types
    // task: study stripe API docs regarding use cases of this application and extend accordingly
    public async Task<ServiceResult<bool>> HandleStripeWebhookEvent(string json, StringValues signatureHeader)
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
                    var completeResult = await HandleCheckoutSessionCompleted(session);
                    if (!completeResult.ResultData)
                    {
                        return new ServiceResult<bool>
                        {
                            IsSuccess = false,
                            ErrorMessage = "Could not process webhook"
                        };
                    }
                    break;
            }
            return new ServiceResult<bool>
            {
                IsSuccess = true,
                ResultData = true
            };
        }
        catch (StripeException e)
        {
            Log.Error("Stripe webhook error: {0}", e.Message);
            return new ServiceResult<bool>
            {
                IsSuccess = false,
                ErrorMessage = "Could not process webhook."
            };
        }
    }

    // needs further development
    public ServiceResult<string> GetCurrencyFromCultureCode(string cultureCode)
    {
        if (cultureCode == "de")
        {
            return new ServiceResult<string>
            {
                IsSuccess = true,
                ResultData = "eur"
            };
        }
        return new ServiceResult<string>
        {
            IsSuccess = true,
            ResultData = "usd"
        };
    }

    private async Task<ServiceResult<bool>> HandleCheckoutSessionCompleted(Session session)
    {
        var orderToken = session.Metadata[_metadataOrderToken] ?? "";
        var order = _context.Order.IgnoreQueryFilters()
            .Include(x => x.Cart).ThenInclude(x => x!.CartItems)
            .Include(x => x.ShipmentTarget).ThenInclude(x => x!.Address)
            .Include(x => x.OrderProducts).ThenInclude(x => x.Product)
            .FirstOrDefault(x => x.OrderToken == orderToken);

        if (order == null)
        {
            Serilog.Log.Error("No order found.");
            return new ServiceResult<bool>
            {
                IsSuccess = false,
                ErrorMessage = "No order found"
            };
        }

        order.State = OrderState.Processing;
        order.InvoiceNumber = _invoiceService.CreateInvoiceNumber().ResultData;

        var cancellationTokenSource = new CancellationTokenSource();
        var invoicePdfByteArray = (await _invoiceService.CreateInvoice(order)).ResultData;
        var checkOrderStateLink = $"{FrontendHelper.GetCheckOrderStateUrl(_frontendBaseUrl)}/{order?.OrderToken ?? ""}";
        var bodyEmailRaw = _resourceManager.GetString("body") ?? "";
        var bodyEmailParsed = GetParsedEmailBody(new OrderConfirmTemplate { CustomerName = order!.ShipmentTarget?.FirstName ?? "", CheckOrderStateLink = checkOrderStateLink }, bodyEmailRaw);
        var subjectEmail = _resourceManager.GetString("subject") ?? "";
        var attachmentFileName = $"Invoice_{order.InvoiceNumber ?? ""}.pdf";
        var mailResult = (await _mailService.SendMailAsync(order.ShipmentTarget?.Email ?? "", order.ShipmentTarget?.FirstName ?? "", subjectEmail, bodyEmailParsed, invoicePdfByteArray, new ContentType("application", "pdf"), attachmentFileName, cancellationTokenSource.Token)).ResultData;

        if (mailResult)
        {
            var orderEmail = new OrderEmail
            {
                Order = order,
                OrderId = order.Id,
                OrderEMailType = OrderEMailType.OrderConfirm,
                SendDate = DateTime.Now
            };
            order.OrderEmails.Add(orderEmail);
        }

        var result = await _context.SaveChangesAsync() > 0;
        return new ServiceResult<bool>
        {
            ResultData = result,
            IsSuccess = result,
            ErrorMessage = result ? null : "Could not finalize order."
        };
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

    private string GetParsedEmailBody(OrderConfirmTemplate model, string source)
    {
        if (_fluidParser.TryParse(source, out var template, out var error))
        {
            var context = new TemplateContext(model);
            return template.Render(context);
        }
        else
        {
            Serilog.Log.Error($"Error while parsing for email body: {error}");
            return "";
        }
    }
}