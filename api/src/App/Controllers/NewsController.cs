using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Interfaces;

namespace Shop.Controllers;

[ApiController]
public class NewsController : ShopBaseController
{
    private ShopDbContext _context;

    public NewsController(ShopDbContext context, IFileStorageService fileStorageService) : base(fileStorageService)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<NewsModel>>> GetAllNews()
    {
        var dateTimeToday = DateTime.Today;
        var mapper = new NewsMapper();

        return await _context.News
            .Where(x => x.ValidFrom <= dateTimeToday && x.ValidTo >= dateTimeToday)
            .Select(x => mapper.NewsToNewsModel(x))
            .ToListAsync();
    }
}
