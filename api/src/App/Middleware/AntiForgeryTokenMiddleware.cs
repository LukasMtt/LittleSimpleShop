namespace App.Middlewares;

public class AntiForgeryTokenMiddleware
{
    private readonly RequestDelegate _next;
    private readonly bool _writeValidationFailToResponse;
    private readonly ILogger<AntiForgeryTokenMiddleware> _logger;
    private readonly HashSet<string> _ignoredEndpoints = new HashSet<string>
    {
        "/shop/Payment/PersistSuccessfulStripePaymentResult"
    };

    public AntiForgeryTokenMiddleware(RequestDelegate next, ILogger<AntiForgeryTokenMiddleware> logger, bool writeValidationFailToResponse = true)
    {
        _next = next;
        _writeValidationFailToResponse = writeValidationFailToResponse;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if ((HttpMethods.IsPost(context.Request.Method) ||
            HttpMethods.IsPut(context.Request.Method) ||
            HttpMethods.IsDelete(context.Request.Method) ||
            HttpMethods.IsPatch(context.Request.Method))
            && !_ignoredEndpoints.Contains(context.Request.Path.ToString()))
        {
            //own custom validation as implementation of the "double submit approach" against CSRF
            // default validation via IAntiforgery will not work since asp.net implementation expect different setup (form, asymmetrical)
            var cookieToken = context.Request.Cookies["XSRF-TOKEN"];
            var headerToken = context.Request.Headers["X-Xsrf-Header"].FirstOrDefault();

            if (string.IsNullOrEmpty(cookieToken) || string.IsNullOrEmpty(headerToken) || cookieToken != headerToken)
            {
                _logger.LogWarning("Antiforgery token validation failed.");
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                if (_writeValidationFailToResponse)
                {
                    await context.Response.WriteAsync("Antiforgery token validation failed.");
                }
                return;
            }
        }

        await _next(context);
    }
}

public static class AntiforgeryTokenMiddlewareExtensions
{
    public static IApplicationBuilder UseAntiforgeryToken(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AntiForgeryTokenMiddleware>();
    }
}
