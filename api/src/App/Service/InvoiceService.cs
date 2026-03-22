using System.Globalization;

using Fluid;

using Shop.Data;
using Shop.Data.DataModels;
using Shop.Data.Enums;
using Shop.Interfaces;
using Shop.Misc;
using Shop.Templates;

namespace Shop.Service;

public class InvoiceService
{
    private IFileStorageService _fileStorageService;
    private IPdfConverterService _pdfConverterService;
    private ShopDbContext _context;
    private FluidParser _fluidParser;
    private ILogger<InvoiceService> _logger;

    private static readonly string _invoiceContentType = "application/pdf";

    public InvoiceService(IFileStorageService fileStorageService, IPdfConverterService pdfConverterService, ShopDbContext context, FluidParser fluidParser, ILogger<InvoiceService> logger)
    {
        _fileStorageService = fileStorageService;
        _pdfConverterService = pdfConverterService;
        _context = context;
        _fluidParser = fluidParser;
        _logger = logger;
    }

    public async Task<ServiceResult<byte[]>> CreateInvoice(Order order)
    {
        var documentTemplate = _context.Document.FirstOrDefault(x => x.DocumentType == DocumentType.InvoiceTemplate);
        if (documentTemplate == null || documentTemplate.FileExtension != "html")
        {
            return new ServiceResult<byte[]>
            {
                IsSuccess = false,
                ErrorMessage = "Could not create invoice"
            };
        }
        var documentTemplateFileContent = (await _fileStorageService.GetFileAsync(documentTemplate.FileId ?? "")).ResultData;
        if (documentTemplateFileContent == null)
        {
            return new ServiceResult<byte[]>
            {
                IsSuccess = false,
                ErrorMessage = "Could not create invoice"
            };
        }
        if (_fluidParser.TryParse(await documentTemplateFileContent.ReadAsStringAsync(), out var template, out var error))
        {
            var templateOptions = new TemplateOptions();
            templateOptions.MemberAccessStrategy.Register<OrderItem>();
            var model = new OrderInvoiceTemplate
            {
                Name = $"{order.ShipmentTarget?.FirstName ?? ""} {order.ShipmentTarget?.LastName ?? ""}",
                StreetAndNumber = $"{order.ShipmentTarget?.Address?.Street ?? ""} {order.ShipmentTarget?.Address?.Number ?? ""}",
                ZipAndCity = $"{order.ShipmentTarget?.Address?.Zip ?? ""} {order.ShipmentTarget?.Address?.City ?? ""}",
                Country = order.ShipmentTarget?.Address?.Country.ToString() ?? "",
                InvoiceNumber = order.InvoiceNumber,
                OrderItems = order.OrderProducts.Select(x => new OrderItem
                {
                    Name = x.Product.Name ?? "",
                    Amount = x.Quantity.ToString(),
                    Price = x.Product.Price.ToString("C", CultureInfo.CurrentCulture)
                }).ToList(),
                ShippingCost = order.ShippingCost.ToString("C", CultureInfo.CurrentCulture),
                TotalPrice = (order.OrderProducts.Sum(x => (x.Product?.Price ?? 0m) * x.Quantity) + order.ShippingCost).ToString("C", CultureInfo.CurrentCulture)
            };
            var context = new TemplateContext(model, templateOptions);
            var filledTemplate = template.Render(context);

            var result = (await _pdfConverterService.ConvertHtmlToPdfFileAsync(filledTemplate)).ResultData;
            if (result == null)
            {
                return new ServiceResult<byte[]>
                {
                    IsSuccess = false,
                    ErrorMessage = "Could not create invoice"
                };
            }
            var pdfResult = await result.ReadAsByteArrayAsync();
            if (pdfResult == null)
            {
                _logger.LogError("Error while reading pdf file as byte array.");
                return new ServiceResult<byte[]>
                {
                    IsSuccess = false,
                    ErrorMessage = "Could not create invoice"
                };
            }
            var invoiceDocumentFileId = (await _fileStorageService.PostFileAsync(pdfResult, _invoiceContentType)).ResultData;
            var invoiceDocument = new Document
            {
                FileId = invoiceDocumentFileId,
                DocumentType = DocumentType.Invoice,
                FileExtension = "pdf",
                OrderId = order.Id,
                Order = order
            };
            order.OrderDocuments.Add(invoiceDocument);
            await _context.SaveChangesAsync();
            return new ServiceResult<byte[]>
            {
                IsSuccess = true,
                ResultData = pdfResult
            };
        }
        else
        {
            _logger.LogError($"Error while parsing for email body: {error}");
            return new ServiceResult<byte[]>
            {
                IsSuccess = false,
                ErrorMessage = "Could not create invoice"
            };
        }
    }

    public ServiceResult<string> CreateInvoiceNumber()
    {
        return new ServiceResult<string>
        {
            IsSuccess = true,
            ResultData = $"IN-{Guid.NewGuid()}"
        };
    }
}