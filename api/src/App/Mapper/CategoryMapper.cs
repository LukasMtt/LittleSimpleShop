using Riok.Mapperly.Abstractions;

using Shop.ApiModels;
using Shop.Data.DataModels;

[Mapper]
public partial class CategoryMapper
{
    public partial CategoryModel CategoryToCategoryModel(Category category);
}