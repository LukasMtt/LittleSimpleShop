using Shop.Misc;

namespace Shop.Interfaces;

public interface IFileStorageService
{
    Task<ServiceResult<HttpContent?>> GetFileAsync(string fileId);
    Task<ServiceResult<string>> PostFileAsync(byte[] fileContent, string contentType);
}