using AutoMapper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Data.DataModels;
using Shop.Service;

namespace App.Controllers;

[ApiController]
public class CartController : ShopBaseController
{
    private IMapper _mapper;
    private ShopDbContext _context;
    private CartService _cartService;
    private IWebHostEnvironment _webHostEnvironment;

    public CartController(IMapper mapper, ShopDbContext context, IFileStorageService fileStorageService, CartService cartService, IWebHostEnvironment webHostEnvironment) : base(fileStorageService)
    {
        _mapper = mapper;
        _context = context;
        _cartService = cartService;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet]
    public CartModel? GetCart()
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return null;
        }

        var cart = _context.Cart.Include(c => c.CartItems).FirstOrDefault(c => c.CartToken == cartToken);
        return cart == null ? null : _mapper.Map<CartModel>(cart);
    }

    [HttpPost]
    public bool CreateCart()
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (!string.IsNullOrEmpty(cartToken))
        {
            return true;
        }

        cartToken = _cartService.CreateCartToken();
        var cart = new Cart
        {
            CartToken = cartToken,
            State = CartLifecycleState.Active
        };

        _context.Cart.Add(cart);
        var result = _context.SaveChanges() > 0;

        if (result)
        {
            HttpContext?.Response?.Cookies.Append(CartTokenCookieName, cartToken, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                HttpOnly = false,
                Path = "/",
                Secure = true,
                SameSite = _webHostEnvironment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict
            });
        }

        return result;
    }

    [HttpPost]
    public int PushCartItem(CartItemModel cartItem)
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return 0;
        }

        var cart = _context.Cart.Include(x => x.CartItems).FirstOrDefault(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return 0;
        }

        var existingCartItem = cart.CartItems.FirstOrDefault(item => item.ProductId == cartItem.ProductId);
        if (existingCartItem != null)
        {
            return 0;
        }

        var newCartItem = new CartItem
        {
            ProductId = cartItem.ProductId,
            Amount = cartItem.Amount,
            CartId = cart.Id
        };
        cart.CartItems.Add(newCartItem);
        return _context.SaveChanges();
    }

    [HttpPost]
    public int PopCartItemByProductId(int productId)
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return 0;
        }

        var cart = _context.Cart.Include(x => x.CartItems).FirstOrDefault(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return 0;
        }

        var existingCartItem = cart.CartItems.FirstOrDefault(item => item.ProductId == productId);
        if (existingCartItem == null)
        {
            return 0;
        }

        cart.CartItems.Remove(existingCartItem);
        return _context.SaveChanges();
    }

    [HttpPost]
    public int UpdateCartItemAmountByProductId(int productId, int amount)
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return 0;
        }

        var cart = _context.Cart.Include(c => c.CartItems).FirstOrDefault(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return 0;
        }

        var existingCartItem = cart.CartItems.FirstOrDefault(item => item.ProductId == productId);
        if (existingCartItem == null)
        {
            return 0;
        }

        existingCartItem.Amount = amount;
        return _context.SaveChanges();
    }

    [HttpGet]
    public int AchieveCart()
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return 0;
        }

        var cart = _context.Cart.FirstOrDefault(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return 0;
        }
        cart.State = CartLifecycleState.Archived;
        return _context.SaveChanges();
    }
}
