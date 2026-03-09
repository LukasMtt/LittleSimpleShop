public interface IPdfConverterService
{
    public Task<HttpContent?> ConvertHtmlToPdfFileAsync(string html);
}