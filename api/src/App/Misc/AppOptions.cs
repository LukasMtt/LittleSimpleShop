namespace Shop.Misc;

public sealed class AppOptions
{
  public required string ConnectionString { get; set; }
  public required string FrontendBaseUrl { get; set; }
  public required string StripePrivateKey { get; set; }
  public required string StripeCurrency { get; set; }
  public required string StripeWebhookSecret { get; set; }
  public required SeaweedFsOptions SeaweedFs { get; set; }
  public required PdfConverterOptions PdfConverter { get; set; }
  public required EMailOptions Email { get; set; }
}

public class SeaweedFsOptions
{
  public required string FileUrl { get; set; }
  public required string AssignUrl { get; set; }
}

public class PdfConverterOptions
{
  public required string Url { get; set; }
}

public class EMailOptions
{
  public required string FromAddress { get; set; }
  public required string FromName { get; set; }
  public required string SmtpServer { get; set; }
  public required int? SmtpPort { get; set; }
  public required string SmtpUser { get; set; }
  public required string Password { get; set; }
}