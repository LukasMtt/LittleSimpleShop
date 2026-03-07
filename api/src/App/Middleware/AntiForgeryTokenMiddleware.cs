namespace App.Middlewares;

public class AntiForgeryTokenMiddleware
{
    private readonly RequestDelegate _next;
    private readonly HashSet<string> _ignoredEndpoints = new HashSet<string>
    {
        "/shop/Payment/PersistSuccessfulStripePaymentResult"
    };

    public AntiForgeryTokenMiddleware(RequestDelegate next)
    {
        _next = next;
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
                Serilog.Log.Warning("Antiforgery token validation failed.");
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsync("Invalid antiforgery token.");
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
