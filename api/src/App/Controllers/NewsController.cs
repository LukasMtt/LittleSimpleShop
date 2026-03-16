using AutoMapper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Interfaces;

namespace Shop.Controllers;

[ApiController]
public class NewsController : ShopBaseController
{
    private IMapper _mapper;
    private ShopDbContext _context;

    public NewsController(IMapper mapper, ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _mapper = mapper;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<NewsModel>>> GetAllNews()
    {
        var dateTimeToday = DateTime.Today;

        return await _context.News
            .Where(x => x.ValidFrom <= dateTimeToday && x.ValidTo >= dateTimeToday)
            .Select(x => _mapper.Map<NewsModel>(x))
            .ToListAsync();
    }
}
