using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;

using Shop.ApiModels;
using Shop.Data;
using Shop.Interfaces;
using Shop.Service;

using Stripe.Checkout;

namespace Shop.Controllers;

[ApiController]
public class PaymentController : ShopBaseController
{
    private StripePaymentService _stripePaymentService;
    private OrderService _orderService;
    private ShopDbContext _context;
    private NewsletterService _newsletterService;

    public PaymentController(StripePaymentService stripePaymentService, OrderService orderService, ShopDbContext context, NewsletterService newsletterService, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _stripePaymentService = stripePaymentService;
        _orderService = orderService;
        _context = context;
        _newsletterService = newsletterService;
    }

    [HttpPost]
    [EnableRateLimiting("paymentRateLimiterPolicy")]
    public async Task<ActionResult> CreateCheckoutSession([FromBody] CheckoutModel model)
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            return Problem("Checkout did not succeed.", statusCode: 500);
        }
        var cart = _context.Cart.Include(x => x.CartItems).FirstOrDefault(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return Problem("Checkout did not succeed.", statusCode: 500);
        }
        var result = await _orderService.CreateAndSaveOrder(model, cart);
        if (!result.IsSuccess || result.ResultData == null)
        {
            return Problem("Checkout did not succeed.", statusCode: 500);
        }
        Session session = (await _stripePaymentService.CreateCheckoutSession(cart, result.ResultData)).ResultData!;
        if (model.IsNewsletterActivated && !string.IsNullOrEmpty(model.Email))
        {
            await _newsletterService.AddActiveNewsletterSubscriber(model.Email);
        }
        return Ok(new { id = session.Id });
    }

    //webhook method for stripe 
    [HttpPost]
    public async Task<IActionResult> PersistSuccessfulStripePaymentResult()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        StringValues signatureHeader = Request.Headers["Stripe-Signature"];
        return (await _stripePaymentService.HandleStripeWebhookEvent(json, signatureHeader)).ResultData ? Ok() : Problem(statusCode: 400);
    }
}
