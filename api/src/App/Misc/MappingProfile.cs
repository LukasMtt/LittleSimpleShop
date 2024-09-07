using AutoMapper;
using Shop.ApiModels;
using Shop.Data.DataModels;

public class MappingProfile : Profile {
     public MappingProfile() {
         CreateMap<Product, ProductModel>().ReverseMap();
         CreateMap<Category, CategoryModel>().ReverseMap();
         CreateMap<Image, ImageModel>().ReverseMap();
     }
 }