using Shop.Data;
using Shop.Data.DataModels;
using Shop.Misc;

namespace Shop.Service;

public class NewsletterService
{
    private ShopDbContext _context;

    public NewsletterService(ShopDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<bool>> AddActiveNewsletterSubscriber(string? email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return new ServiceResult<bool>
            {
                IsSuccess = false,
                ErrorMessage = "Could not add newsletter subscriber."
            };
        }
        var subscriber = _context.NewsletterSubscriber.FirstOrDefault(x => x.Email == email);
        if (subscriber != null)
        {
            subscriber.IsActive = true;
            var alreadySubscribedResult = await _context.SaveChangesAsync() == 1;
            return new ServiceResult<bool>
            {
                IsSuccess = alreadySubscribedResult,
                ErrorMessage = alreadySubscribedResult ? null : "Could not add newsletter subscriber.",
                ResultData = alreadySubscribedResult
            };
        }
        var newsletterSubscriber = new NewsletterSubscriber
        {
            Email = email.Trim(),
            IsActive = true
        };
        _context.NewsletterSubscriber.Add(newsletterSubscriber);
        var newlySubscribedResult = await _context.SaveChangesAsync() == 1;
        return new ServiceResult<bool>
        {
            IsSuccess = newlySubscribedResult,
            ErrorMessage = newlySubscribedResult ? null : "Could not add newsletter subscriber.",
            ResultData = newlySubscribedResult
        };
    }

    public async Task<ServiceResult<bool>> DeactivateNewsletterSubscriber(string email)
    {
        var subscriber = _context.NewsletterSubscriber.FirstOrDefault(x => x.Email == email);
        if (subscriber == null)
        {
            return new ServiceResult<bool>
            {
                IsSuccess = true,
                ResultData = true
            };
        }
        _context.NewsletterSubscriber.Remove(subscriber);
        var result = await _context.SaveChangesAsync() == 1;
        return new ServiceResult<bool>
        {
            IsSuccess = result,
            ResultData = result,
            ErrorMessage = result ? null : "Could not deactivate subscriber"
        };
    }

    //implement mechanism for broadcasting newsletter to subscribers
    public async Task SendNewsletter()
    {
        throw new NotImplementedException();
    }
}