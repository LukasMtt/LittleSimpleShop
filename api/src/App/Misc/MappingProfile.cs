using AutoMapper;
using Shop.ApiModels;
using Shop.Data.DataModels;

public class MappingProfile : Profile {
     public MappingProfile() {
         CreateMap<ProductEntity, ProductModel>().ReverseMap();
         CreateMap<CategoryEntity, CategoryModel>().ReverseMap();
         CreateMap<ImageEntity, ImageModel>().ReverseMap();
     }
 }