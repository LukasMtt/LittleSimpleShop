using System.Globalization;

using Fluid;

using Shop.Data;
using Shop.Data.DataModels;

namespace Shop.Service;

public class InvoiceService
{
    private IFileStorageService _fileStorageService;
    private IPdfConverterService _pdfConverterService;
    private ShopDbContext _context;
    private FluidParser _fluidParser;

    private static readonly string _invoiceContentType = "application/pdf";

    public InvoiceService(IFileStorageService fileStorageService, IPdfConverterService pdfConverterService, ShopDbContext context, FluidParser fluidParser)
    {
        _fileStorageService = fileStorageService;
        _pdfConverterService = pdfConverterService;
        _context = context;
        _fluidParser = fluidParser;
    }

    public async Task<byte[]?> CreateInvoice(Order order)
    {
        var documentTemplate = _context.Document.FirstOrDefault(x => x.DocumentType == DocumentType.InvoiceTemplate);
        if (documentTemplate == null || documentTemplate.FileExtension != "html")
        {
            return null;
        }
        var documentTemplateFileContent = await _fileStorageService.GetFileAsync(documentTemplate.FileId ?? "");
        if (documentTemplateFileContent == null)
        {
            return null;
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
                TotalPrice = order.OrderProducts.Sum(x => x.Product?.Price ?? 0m).ToString("C", CultureInfo.CurrentCulture)
            };
            var context = new TemplateContext(model, templateOptions);
            var filledTemplate = template.Render(context);

            var result = await _pdfConverterService.ConvertHtmlToPdfFileAsync(filledTemplate);
            if (result == null)
            {
                return null;
            }
            var pdfResult = await result.ReadAsByteArrayAsync();
            if (pdfResult == null)
            {
                Serilog.Log.Error($"Error while reading pdf file as byte array.");
                return null;
            }
            var invoiceDocumentFileId = await _fileStorageService.PostFileAsync(pdfResult, _invoiceContentType);
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
            return pdfResult;
        }
        else
        {
            Serilog.Log.Error($"Error while parsing for email body: {error}");
            return null;
        }
    }

    public string CreateInvoiceNumber()
    {
        return $"IN-{Guid.NewGuid()}";
    }
}