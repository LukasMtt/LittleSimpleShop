public static class FrontendHelper
{
    private static readonly string _paymentSuccessUrl = "checkout-success";
    private static readonly string _paymentCancelUrl = "checkout-trail/(checkout:payment)";

    public static string GetPaymentSuccessUrl(string baseUrl)
    {
        return GetFrontendUrl(baseUrl, _paymentSuccessUrl);
    }

    public static string GetPaymentCancelUrl(string baseUrl)
    {
        return GetFrontendUrl(baseUrl, _paymentCancelUrl);
    }

    private static string GetFrontendUrl(string baseUrl, string path)
    {
        return $"{baseUrl}/{path}";
    }
}