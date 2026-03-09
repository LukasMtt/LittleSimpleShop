using Microsoft.Extensions.Options;

using Shop.ApiModels;
using Shop.Misc;

public class SeaweedFsService : IFileStorageService
{
    private readonly HttpClient _httpClient;
    private readonly IOptions<AppOptions> _appOptions;

    private static readonly string _assignEndpoint = "dir/assign";

    public SeaweedFsService(HttpClient httpClient, IOptions<AppOptions> options)
    {
        _httpClient = httpClient;
        _appOptions = options;
    }

    public async Task<HttpContent?> GetFileAsync(string fileId)
    {
        var baseAddressFileUrl = _appOptions.Value.SeaweedFs.FileUrl;
        if (string.IsNullOrEmpty(baseAddressFileUrl))
        {
            throw new InvalidOperationException("SeaweedFsFileUrl is not configured.");
        }
        using var cts = new CancellationTokenSource();
        try
        {
            var response = await _httpClient.GetAsync($"{baseAddressFileUrl}/{fileId}", cts.Token);
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

    public async Task<string?> PostFileAsync(byte[] fileContent, string contentType)
    {
        var baseAddressAssignUrl = _appOptions.Value.SeaweedFs.AssignUrl;
        if (string.IsNullOrEmpty(baseAddressAssignUrl))
        {
            throw new InvalidOperationException("SeaweedFsAssignUrl is not configured.");
        }
        var baseAddressFileUrl = _appOptions.Value.SeaweedFs.FileUrl;
        if (string.IsNullOrEmpty(baseAddressFileUrl))
        {
            throw new InvalidOperationException("SeaweedFsFileUrl is not configured.");
        }

        using var cts = new CancellationTokenSource();
        try
        {
            var fileId = await AssignAndGetNewFileId(baseAddressAssignUrl, cts);
            if (fileId == null)
            {
                return null;
            }
            var byteArrayContent = new ByteArrayContent(fileContent);
            byteArrayContent.Headers.Add("Content-Type", contentType);
            var responsePost = await _httpClient.PostAsync($"{baseAddressFileUrl}/{fileId}", byteArrayContent, cts.Token);
            responsePost.EnsureSuccessStatusCode();
            return fileId;
        }
        catch (OperationCanceledException)
        {
            Serilog.Log.Warning("Timeout occurred while posting file to SeaweedFS or getting a file id for this post.");
            return null;
        }
        catch (HttpRequestException ex)
        {
            Serilog.Log.Error(ex, "HTTP error occurred while posting file to SeaweedFS or getting a file id for this post.");
            return null;
        }
        catch (Exception ex)
        {
            Serilog.Log.Error(ex, "Error occurred while posting file to SeaweedFS or getting a file id for this post.");
            return null;
        }
    }

    private async Task<string?> AssignAndGetNewFileId(string baseAddressAssignUrl, CancellationTokenSource cts)
    {
        var responseAssign = await _httpClient.GetAsync($"{baseAddressAssignUrl}/{_assignEndpoint}", cts.Token);
        responseAssign.EnsureSuccessStatusCode();
        var assignModel = await responseAssign.Content.ReadFromJsonAsync<SeaweedFsAssignModel>();
        var fileId = assignModel?.Fid;
        if (string.IsNullOrEmpty(fileId))
        {
            Serilog.Log.Error("Empty file id assigned by SeaweedFs.");
            return null;
        }
        return fileId;
    }
}