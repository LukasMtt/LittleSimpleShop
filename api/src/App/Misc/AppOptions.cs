namespace Shop.Misc;

public sealed class AppOptions
{
  public required string ConnectionString { get; set; }
  public required string FrontendBaseUrl { get; set; }
  public required string StripePrivateKey { get; set; }
  public required string StripeCurrency { get; set; }
  public required string StripeWebhookSecret { get; set; }
  public required SeaweedFsOptions SeaweedFs { get; set; }
}

public class SeaweedFsOptions
{
  public required string Url { get; set; }
}