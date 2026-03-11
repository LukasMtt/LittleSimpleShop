using Shop.Data;
using Shop.Data.DataModels;

namespace Shop.Service;

public class NewsletterService
{
    private ShopDbContext _context;

    public NewsletterService(ShopDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddActiveNewsletterSubscriber(string? email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return false;
        }
        var subscriber = _context.NewsletterSubscriber.FirstOrDefault(x => x.Email == email);
        if (subscriber != null)
        {
            subscriber.IsActive = true;
            return await _context.SaveChangesAsync() == 1;
        }
        var newsletterSubscriber = new NewsletterSubscriber
        {
            Email = email.Trim(),
            IsActive = true
        };
        _context.NewsletterSubscriber.Add(newsletterSubscriber);
        return await _context.SaveChangesAsync() == 1;
    }

    public async Task<bool> DeactivateNewsletterSubscriber(string email)
    {
        var subscriber = _context.NewsletterSubscriber.FirstOrDefault(x => x.Email == email);
        if (subscriber == null)
        {
            return true;
        }
        _context.NewsletterSubscriber.Remove(subscriber);
        return await _context.SaveChangesAsync() == 1;
    }

    //implement mechanism for broadcasting newsletter to subscribers
    public async Task SendNewsletter()
    {
        throw new NotImplementedException();
    }
}