public interface IFileStorageService
{
    Task<HttpContent?> GetFileAsync(string fileId);
    Task<string?> PostFileAsync(byte[] fileContent, string contentType);
}