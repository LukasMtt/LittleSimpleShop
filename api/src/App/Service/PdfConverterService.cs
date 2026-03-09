using System.Text;

public class PdfConverterService : IPdfConverterService
{
    private readonly HttpClient _httpClient;

    private static readonly string _convertHtmlChromiumEndpoint = "forms/chromium/convert/html";
    private static readonly string _fileName = "index.html";

    public PdfConverterService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<HttpContent?> ConvertHtmlToPdfFileAsync(string html)
    {
        using var cts = new CancellationTokenSource();
        //is this really THE way to go?
        byte[] bytes = Encoding.UTF8.GetBytes(html);
        try
        {
            var response = await _httpClient.PostAsync(_convertHtmlChromiumEndpoint, CreateMultipartFormDataContent(bytes), cts.Token);
            response.EnsureSuccessStatusCode();
            return response.Content;
        }
        catch (OperationCanceledException)
        {
            Serilog.Log.Warning("Timeout occurred while converting html to pdf via the conversion service.");
            return null;
        }
        catch (HttpRequestException ex)
        {
            Serilog.Log.Error(ex, "HTTP error occurred while converting html to pdf via the conversion service.");
            return null;
        }
        catch (Exception ex)
        {
            Serilog.Log.Error(ex, "Error occurred while converting html to pdf via the conversion service.");
            return null;
        }
    }

    public HttpContent CreateMultipartFormDataContent(byte[] fileContents)
    {
        var formDataContent = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(fileContents);
        formDataContent.Add(fileContent, _fileName, _fileName);
        return formDataContent;
    }
}