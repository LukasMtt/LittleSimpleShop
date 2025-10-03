using Microsoft.AspNetCore.Mvc;
using Shop.ApiModels;
using Shop.Misc;
using Stripe.Checkout;

[ApiController]
[Route("shop/[controller]/[action]")]
public class PaymentController : ControllerBase
{
    private StripePaymentService _stripePaymentService;

    public PaymentController(StripePaymentService stripePaymentService) : base()
    {
        _stripePaymentService = stripePaymentService;
    }

    [HttpPost]
    public async Task<ActionResult> CreateCheckoutSession([FromBody] CheckoutCartModel model)
    {
        Session session = await _stripePaymentService.CreateCheckoutSession(model);
        return Ok(new { id = session.Id });
    }
}
