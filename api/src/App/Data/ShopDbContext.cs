using EntityFramework.Exceptions.SqlServer;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using Shop.Data.DataModels;
using Shop.Misc;

namespace Shop.Data;

public class ShopDbContext : DbContext
{
    public DbSet<Product> Product { get; set; }
    public DbSet<Category> Category { get; set; }
    public DbSet<PublicImage> PublicImage { get; set; }
    public DbSet<News> News { get; set; }
    public DbSet<Order> Order { get; set; }
    public DbSet<OrderProduct> OrderProduct { get; set; }
    public DbSet<Metadata> Metadata { get; set; }
    public DbSet<Cart> Cart { get; set; }
    public DbSet<CartItem> CartItem { get; set; }

    private IOptions<AppOptions> _options;

    public ShopDbContext(IOptions<AppOptions> options) : base()
    {
        _options = options;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_options.Value.ConnectionString);
        optionsBuilder.UseExceptionProcessor();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>().HasQueryFilter(p => p.LifecycleState != ProductLifecycleState.Archived);
        modelBuilder.Entity<Cart>().HasQueryFilter(p => p.State != CartLifecycleState.Archived);
    }
}