using Shop.Misc;

namespace Shop.Interfaces;

public interface IPdfConverterService
{
    public Task<ServiceResult<HttpContent?>> ConvertHtmlToPdfFileAsync(string html);
}