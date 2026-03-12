namespace Shop.Templates;

public class OrderInvoiceTemplate
{
    public string? Name { get; set; }
    public string? StreetAndNumber { get; set; }
    public string? ZipAndCity { get; set; }
    public string? Country { get; set; }
    public string? InvoiceNumber { get; set; }
    public IList<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public string? TotalPrice { get; set; }
}

public class OrderItem
{
    public string? Name { get; set; }
    public string? Price { get; set; }
    public string? Amount { get; set; }
}