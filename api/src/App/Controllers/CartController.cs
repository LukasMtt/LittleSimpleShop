using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Shop.ApiModels;
using Shop.Data;
using Shop.Data.DataModels;
using Shop.Data.Enums;
using Shop.Interfaces;
using Shop.Service;

namespace Shop.Controllers;

[ApiController]
public class CartController : ShopBaseController
{
    private ShopDbContext _context;
    private CartService _cartService;
    private IWebHostEnvironment _webHostEnvironment;

    public CartController(ShopDbContext context, IFileStorageService fileStorageService, CartService cartService, IWebHostEnvironment webHostEnvironment) : base(fileStorageService)
    {
        _context = context;
        _cartService = cartService;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet]
    public async Task<ActionResult<CartModel?>> GetCart()
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return NotFound();
        }

        var mapper = new CartMapper();
        var cart = await _context.Cart.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.CartToken == cartToken);
        return cart == null ? NotFound() : Ok(mapper.CartToCartModel(cart));
    }

    [HttpPost]
    public async Task<ActionResult<bool>> CreateCart()
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (!string.IsNullOrEmpty(cartToken))
        {
            return Ok(true);
        }

        cartToken = _cartService.CreateCartToken().ResultData;
        if (cartToken == null)
        {
            return NotFound();
        }
        var cart = new Cart
        {
            CartToken = cartToken,
            State = CartLifecycleState.Active
        };

        _context.Cart.Add(cart);
        var result = await _context.SaveChangesAsync() > 0;

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

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> PushCartItem(CartItemModel cartItem)
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return NotFound();
        }

        var cart = await _context.Cart.Include(x => x.CartItems).FirstOrDefaultAsync(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return NotFound();
        }

        var existingCartItem = cart.CartItems.FirstOrDefault(item => item.ProductId == cartItem.ProductId);
        if (existingCartItem != null)
        {
            existingCartItem.Amount += cartItem.Amount;
            return Ok(await _context.SaveChangesAsync());
        }

        var newCartItem = new CartItem
        {
            ProductId = cartItem.ProductId,
            Amount = cartItem.Amount,
            CartId = cart.Id
        };
        cart.CartItems.Add(newCartItem);
        return Ok(await _context.SaveChangesAsync());
    }

    [HttpPost]
    public async Task<ActionResult<int>> PopCartItemByProductId(int productId)
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return NotFound();
        }

        var cart = await _context.Cart.Include(x => x.CartItems).FirstOrDefaultAsync(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return NotFound();
        }

        var existingCartItem = cart.CartItems.FirstOrDefault(item => item.ProductId == productId);
        if (existingCartItem == null)
        {
            return NotFound();
        }

        cart.CartItems.Remove(existingCartItem);
        return Ok(await _context.SaveChangesAsync());
    }

    [HttpPost]
    public async Task<ActionResult<int>> UpdateCartItemAmountByProductId(int productId, int amount)
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return NotFound();
        }

        var cart = await _context.Cart.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return NotFound();
        }

        var existingCartItem = cart.CartItems.FirstOrDefault(item => item.ProductId == productId);
        if (existingCartItem == null)
        {
            return NotFound();
        }

        existingCartItem.Amount = amount;
        return Ok(await _context.SaveChangesAsync());
    }

    [HttpGet]
    public async Task<ActionResult<int>> ArchiveCart()
    {
        var cartToken = HttpContext?.Request?.Cookies?.TryGetValue(CartTokenCookieName, out var token) == true ? token : null;
        if (string.IsNullOrEmpty(cartToken))
        {
            Serilog.Log.Information("No cart token found in cookies.");
            return NotFound();
        }

        var cart = await _context.Cart.FirstOrDefaultAsync(c => c.CartToken == cartToken);
        if (cart == null)
        {
            return NotFound();
        }
        cart.State = CartLifecycleState.Archived;
        return Ok(await _context.SaveChangesAsync());
    }
}
