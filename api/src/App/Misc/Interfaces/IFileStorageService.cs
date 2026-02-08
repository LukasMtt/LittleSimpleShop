public interface IFileStorageService
{
    Task<HttpContent?> GetFileAsync(string fileId);
}