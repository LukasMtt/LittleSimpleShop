using Microsoft.Extensions.Options;

using Shop.ApiModels;
using Shop.Interfaces;
using Shop.Misc;

namespace Shop.Service;

public class SeaweedFsService : IFileStorageService
{
    private readonly HttpClient _httpClient;
    private readonly IOptions<AppOptions> _appOptions;
    private ILogger<SeaweedFsService> _logger;

    private static readonly string _assignEndpoint = "dir/assign";

    public SeaweedFsService(HttpClient httpClient, IOptions<AppOptions> options, ILogger<SeaweedFsService> logger)
    {
        _httpClient = httpClient;
        _appOptions = options;
        _logger = logger;
    }

    public async Task<ServiceResult<HttpContent?>> GetFileAsync(string fileId)
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
            return new ServiceResult<HttpContent?>
            {
                IsSuccess = true,
                ResultData = response.Content
            };
        }
        catch (OperationCanceledException operationCanceledException)
        {
            _logger.LogWarning(operationCanceledException, "Timeout occurred while fetching file from SeaweedFS with fileId: {FileId}", fileId);
            return new ServiceResult<HttpContent?>
            {
                IsSuccess = false,
                ErrorMessage = "Could not fetch file from SeaweedFs."
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error occurred while fetching file from SeaweedFS with fileId: {FileId}", fileId);
            return new ServiceResult<HttpContent?>
            {
                IsSuccess = false,
                ErrorMessage = "Could not fetch file from SeaweedFs."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occured while fetching file from SeaweedFS with fileId: {FileId}", fileId);
            return new ServiceResult<HttpContent?>
            {
                IsSuccess = false,
                ErrorMessage = "Could not fetch file from SeaweedFs."
            };
        }
    }

    public async Task<ServiceResult<string>> PostFileAsync(byte[] fileContent, string contentType)
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
                return new ServiceResult<string>
                {
                    IsSuccess = false,
                    ErrorMessage = "Could not post file to SeaweedFs."
                };
            }
            var byteArrayContent = new ByteArrayContent(fileContent);
            byteArrayContent.Headers.Add("Content-Type", contentType);
            var responsePost = await _httpClient.PostAsync($"{baseAddressFileUrl}/{fileId}", byteArrayContent, cts.Token);
            responsePost.EnsureSuccessStatusCode();
            return new ServiceResult<string>
            {
                IsSuccess = true,
                ResultData = fileId!
            };
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("Timeout occurred while posting file to SeaweedFS or getting a file id for this post.");
            return new ServiceResult<string>
            {
                IsSuccess = false,
                ErrorMessage = "Could not post file to SeaweedFs."
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error occurred while posting file to SeaweedFS or getting a file id for this post.");
            return new ServiceResult<string>
            {
                IsSuccess = false,
                ErrorMessage = "Could not post file to SeaweedFs."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while posting file to SeaweedFS or getting a file id for this post.");
            return new ServiceResult<string>
            {
                IsSuccess = false,
                ErrorMessage = "Could not post file to SeaweedFs."
            };
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
            _logger.LogError("Empty file id assigned by SeaweedFs.");
            return null;
        }
        return fileId;
    }
}