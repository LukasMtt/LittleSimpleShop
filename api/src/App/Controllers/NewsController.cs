using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Shop.ApiModels;
using Shop.Data;

namespace App.Controllers;

[ApiController]
public class NewsController : ShopBaseController
{
    private IMapper _mapper;
    private ShopDbContext _context;

    public NewsController(IMapper mapper, ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService) {
        _mapper = mapper;
        _context = context;
    }

    [HttpGet]
    public List<NewsModel> GetAllNews()
    {
        var dateTimeToday = DateTime.Today;

        return _context.News
            .Where(x => x.ValidFrom <= dateTimeToday && x.ValidTo >= dateTimeToday)
            .Select(x => _mapper.Map<NewsModel>(x))
            .ToList();
    }
}
