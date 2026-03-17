using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using Shop.ApiModels;
using Shop.Data;
using Shop.Interfaces;
using Shop.Misc;
using Shop.Service;

namespace Shop.Controllers;

[ApiController]
public class MetadataController : ShopBaseController
{
    private readonly ShopDbContext _dbContext;
    private IOptions<AppOptions> _options;
    private StripePaymentService _paymentService;

    public MetadataController(IFileStorageService fileStorageService, ShopDbContext dbContext, IOptions<AppOptions> options, StripePaymentService paymentService) : base(fileStorageService)
    {
        _dbContext = dbContext;
        _options = options;
        _paymentService = paymentService;
    }

    [HttpGet]
    public async Task<ActionResult<MetadataModel?>> GetMetadata()
    {
        var mapper = new MetadataMapper();
        var metadata = await _dbContext.Metadata.FirstOrDefaultAsync();
        if (metadata != null)
        {
            var model = mapper.MetadataToMetadataModel(metadata);
            model.Currency = _paymentService.GetCurrencyFromCultureCode(_options.Value.CultureCode).ResultData!.ToUpper();
            return model;
        }
        return NotFound();
    }
}
