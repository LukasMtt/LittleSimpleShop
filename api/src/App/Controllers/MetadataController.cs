using AutoMapper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using Shop.ApiModels;
using Shop.Data;
using Shop.Misc;
using Shop.Service;

namespace App.Controllers;

[ApiController]
public class MetadataController : ShopBaseController
{
    private readonly ShopDbContext _dbContext;
    private IMapper _mapper;
    private IOptions<AppOptions> _options;
    private StripePaymentService _paymentService;

    public MetadataController(IFileStorageService fileStorageService, ShopDbContext dbContext, IMapper mapper, IOptions<AppOptions> options, StripePaymentService paymentService) : base(fileStorageService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _options = options;
        _paymentService = paymentService;
    }

    [HttpGet]
    public MetadataModel? GetMetadata()
    {
        var metadata = _dbContext.Metadata.FirstOrDefault();
        if (metadata != null)
        {
            var model = _mapper.Map<MetadataModel>(metadata);
            model.Currency = (_paymentService.GetCurrencyFromCultureCode(_options.Value.CultureCode)).ResultData!.ToUpper();
            return model;
        }
        return null;
    }
}
