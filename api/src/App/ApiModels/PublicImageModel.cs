namespace Shop.ApiModels;

public class PublicImageModel : BaseApiModel
{
    public long? CategoryId { get; set; }
    public long? ProductId { get; set; }
    public string? FileId { get; set; }
}