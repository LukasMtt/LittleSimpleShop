using Shop.Data.DataModels;
using Shop.Service;

namespace AppTest.Services;

[TestFixture]
public class CartServiceTest : BaseTest
{
    private CartService _cartService;

    [SetUp]
    public void Setup()
    {
        _cartService = new CartService(DbContext!);
    }

    [Test]
    public async Task CreateCartToken_ReturnsCorrectly()
    {
        var result = _cartService.CreateCartToken();

        Assert.That(result.IsSuccess);  
        Assert.That(!string.IsNullOrEmpty(result.ResultData));    
    }

    [Test]
    public async Task ArchiveCart_ReturnsCorrectly()
    {
        var cart = new Cart
        {
            CartToken = "abc123"
        };
        DbContext!.Set<Cart>().Add(cart);
        DbContext.SaveChanges();

        var result = await _cartService.ArchiveCart(cart);

        Assert.That(result.IsSuccess);   
    }
}