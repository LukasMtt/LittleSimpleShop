using App.Misc;

public interface IPdfConverterService
{
    public Task<ServiceResult<HttpContent?>> ConvertHtmlToPdfFileAsync(string html);
}