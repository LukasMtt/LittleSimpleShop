using Riok.Mapperly.Abstractions;

using Shop.ApiModels;
using Shop.Data.DataModels;

[Mapper]
public partial class NewsMapper
{
    public partial NewsModel NewsToNewsModel(News news);
}