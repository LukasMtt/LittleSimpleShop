using AutoMapper;

using Microsoft.AspNetCore.Mvc;

using Shop.ApiModels;
using Shop.Data;

namespace App.Controllers;

[ApiController]
public class MetadataController : ShopBaseController
{
    private readonly ShopDbContext _dbContext;
    private IMapper _mapper;

    public MetadataController(IFileStorageService fileStorageService, ShopDbContext dbContext, IMapper mapper) : base(fileStorageService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    [HttpGet]
    public MetadataModel? GetMetadata()
    {
        var metadata = _dbContext.Metadata.FirstOrDefault();
        return metadata != null ? _mapper.Map<MetadataModel>(metadata) : null;
    }
}
