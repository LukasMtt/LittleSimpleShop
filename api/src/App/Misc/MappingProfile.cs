using AutoMapper;

using Shop.ApiModels;
using Shop.Data.DataModels;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductModel>().ReverseMap();
        CreateMap<Category, CategoryModel>().ReverseMap();
        CreateMap<PublicImage, PublicImageModel>().ReverseMap();
        CreateMap<News, NewsModel>().ReverseMap();
        CreateMap<Metadata, MetadataModel>().ReverseMap();
        CreateMap<CartItem, CartItemModel>().ReverseMap();
        CreateMap<Cart, CartModel>().ReverseMap();
        CreateMap<ShipmentTarget, CheckoutModel>().ReverseMap();
        CreateMap<ShipmentAddress, CheckoutAddressModel>().ReverseMap();
        CreateMap<Order, OrderSummaryModel>().ReverseMap();
    }
}