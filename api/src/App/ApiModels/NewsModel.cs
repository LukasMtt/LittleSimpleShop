namespace Shop.ApiModels;

public class NewsModel : BaseApiModel {
    public string ShortText { get; set; }
    public string LongText { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}