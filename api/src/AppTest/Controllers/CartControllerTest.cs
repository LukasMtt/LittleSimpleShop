using Castle.Core.Logging;
using HttpContextMoq;
using HttpContextMoq.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Shop.ApiModels;
using Shop.Controllers;
using Shop.Data.DataModels;
using Shop.Interfaces;
using Shop.Service;

namespace AppTest.Controllers;

[TestFixture]
public class CartControllerTest : BaseTest
{
    private CartController _cartController;
    private CartService _cartService;
    private IWebHostEnvironment _webHostEnvironment;
    private IFileStorageService _fileStorageService;

    [SetUp]
    public void Setup()
    {
        _cartService = Substitute.For<CartService>(DbContext);
        _webHostEnvironment = Substitute.For<IWebHostEnvironment>();
        _fileStorageService = Substitute.For<IFileStorageService>();
        var logger = Substitute.For<ILogger<CartController>>();
        _cartController = new CartController(DbContext!, _fileStorageService, _cartService, _webHostEnvironment, logger);
    }

    [Test]
    public async Task GetCart_ReturnsNotFound_WhenNoCookiePresent()
    {
        var result = await _cartController.GetCart();

        Assert.That(result.Result is NotFoundResult);
    }

    [Test]
    public async Task GetCart_ReturnsNotFoundResult_WhenCookiePresentAndCartNotFound()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>
        {
            {"CartToken", "abc123"}
        });
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cart = Substitute.For<Cart>();
        cart.CartToken = "abc123";

        var result = await _cartController.GetCart();

        Assert.That(result.Result is NotFoundResult);
    }

    [Test]
    public async Task GetCart_ReturnsOkObjectResult_WhenCookiePresentAndCartFound()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>
        {
            {"CartToken", "abc123"}
        });
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cart = Substitute.For<Cart>();
        cart.CartToken = "abc123";
        DbContext!.Set<Cart>().Add(cart);
        DbContext.SaveChanges();

        var result = await _cartController.GetCart();

        Assert.That(result.Result is OkObjectResult);
    }

    [Test]
    public async Task CreateCart_ReturnsOkObjectResult_WhenCartTokenAlreadyPresent()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>
        {
            {"CartToken", "abc123"}
        });
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var result = await _cartController.CreateCart();

        Assert.That(result.Result is OkObjectResult);
    }

    [Test]
    public async Task CreateCart_ReturnsOkObjectResult_WhenCartTokenNotAlreadyPresent()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>{});
        _cartController.ControllerContext.HttpContext = httpContextMock;

        _cartService.CreateCartToken().Returns(new Shop.Misc.ServiceResult<string> { ResultData = "token" });

        var result = await _cartController.CreateCart();

        Assert.That(result.Result is OkObjectResult);
    }

    [Test]
    public async Task PushCart_ReturnsNotFoundResult_WhenCartTokenNotPresent()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>{});
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cartItemModel = new CartItemModel();
        var result = await _cartController.PushCartItem(cartItemModel);

        Assert.That(result.Result is NotFoundResult);
    }

    [Test]
    public async Task PushCart_ReturnsNotFoundResult_WhenCartNotFound()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>
        {
            {"CartToken", "abc123"}
        });
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cartItemModel = new CartItemModel();
        var result = await _cartController.PushCartItem(cartItemModel);

        Assert.That(result.Result is NotFoundResult);
    }

    [Test]
    public async Task PushCart_ReturnsOkObjectResult_WhenCartItemNonExistentInCart()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>
        {
            {"CartToken", "abc123"}
        });
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cart = Substitute.For<Cart>();
        cart.CartToken = "abc123";
        DbContext!.Set<Cart>().Add(cart);
        DbContext.SaveChanges();

        var cartItemModel = new CartItemModel { ProductId = 1, Amount = 1 };
        var result = await _cartController.PushCartItem(cartItemModel);

        Assert.That(result.Result is OkObjectResult);
    }

    [Test]
    public async Task PushCart_ReturnsOkObjectResult_WhenCartItemAlreadyExistentInCart()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>
        {
            {"CartToken", "abc123"}
        });
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cartItem = Substitute.For<CartItem>();
        cartItem.ProductId = 1;
        var cart = Substitute.For<Cart>();
        cart.CartItems = new List<CartItem>
        {
            cartItem
        };
        cart.CartToken = "abc123";
        DbContext!.Set<Cart>().Add(cart);
        DbContext.SaveChanges();
        
        var cartItemModel = new CartItemModel { ProductId = 1, Amount = 1 };
        var result = await _cartController.PushCartItem(cartItemModel);

        Assert.That(result.Result is OkObjectResult);
    }

    [Test]
    public async Task ArchiveCart_ReturnsNotFoundResult_WhenCookieNotPresent()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string> {});
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cart = Substitute.For<Cart>();
        cart.CartToken = "abc123";
        DbContext!.Set<Cart>().Add(cart);
        DbContext.SaveChanges();
        
        var result = await _cartController.ArchiveCart();

        Assert.That(result.Result is NotFoundResult);
    }

    [Test]
    public async Task ArchiveCart_ReturnsOkObjectResult_WhenCartIsFound()
    {
        var httpContextMock = new HttpContextMock().SetupRequestCookies(new Dictionary<string, string>
        {
            {"CartToken", "abc123"}
        });
        _cartController.ControllerContext.HttpContext = httpContextMock;

        var cart = Substitute.For<Cart>();
        cart.CartToken = "abc123";
        DbContext!.Set<Cart>().Add(cart);
        DbContext.SaveChanges();
        
        var result = await _cartController.ArchiveCart();

        Assert.That(result.Result is OkObjectResult);
    }
}