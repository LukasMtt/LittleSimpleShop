public class SeaweedFsService : IFileStorageService
{
    private readonly HttpClient _httpClient;

    public SeaweedFsService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<HttpContent?> GetFileAsync(string fileId)
    {
        using var cts = new CancellationTokenSource();
        try
        {
            var response = await _httpClient.GetAsync(fileId, cts.Token);
            response.EnsureSuccessStatusCode();
            return response.Content;
        }
        catch (OperationCanceledException)
        {
            Serilog.Log.Warning("Timeout occurred while fetching file from SeaweedFS with fileId: {FileId}", fileId);
            return null;
        }
        catch (HttpRequestException ex)
        {
            Serilog.Log.Error(ex, "HTTP error occurred while fetching file from SeaweedFS with fileId: {FileId}", fileId);
            return null;
        }
        catch (Exception ex)
        {
            Serilog.Log.Error(ex, "Error occured while fetching file from SeaweedFS with fileId: {FileId}", fileId);
            return null;
        }
    }
}