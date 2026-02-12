using App.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Shop.ApiModels;
using Shop.Service;
using Stripe.Checkout;

[ApiController]
public class PaymentController : ShopBaseController
{
    private StripePaymentService _stripePaymentService;
    private OrderService _orderService;

    public PaymentController(StripePaymentService stripePaymentService, OrderService orderService, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _stripePaymentService = stripePaymentService;
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<ActionResult> CreateCheckoutSession([FromBody] CheckoutCartModel model)
    {
        var result = await _orderService.CreateAndSaveOrder(model);
        if (!result.IsSuccess)
        {
            return Problem("Failed to create order before checkout.", statusCode: 500);
        }
        Session session = await _stripePaymentService.CreateCheckoutSession(model, (long)result.ResultData!);
        return Ok(new { id = session.Id });
    }

    [HttpPost]
    public async Task<IActionResult> PersistSuccessfulStripePaymentResult()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        StringValues signatureHeader = Request.Headers["Stripe-Signature"];
        return _stripePaymentService.HandleStripeWebhookEvent(json, signatureHeader) ? Ok() : Problem(statusCode: 400);
    }
}
