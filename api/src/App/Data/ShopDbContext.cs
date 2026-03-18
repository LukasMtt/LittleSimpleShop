using EntityFramework.Exceptions.SqlServer;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using Shop.Data.DataModels;
using Shop.Data.Enums;
using Shop.Misc;

namespace Shop.Data;

public class ShopDbContext : DbContext
{
    public virtual DbSet<Product> Product { get; set; }
    public virtual DbSet<Category> Category { get; set; }
    public virtual DbSet<PublicImage> PublicImage { get; set; }
    public virtual DbSet<News> News { get; set; }
    public virtual DbSet<Order> Order { get; set; }
    public virtual DbSet<OrderProduct> OrderProduct { get; set; }
    public virtual DbSet<Metadata> Metadata { get; set; }
    public virtual DbSet<Cart> Cart { get; set; }
    public virtual DbSet<CartItem> CartItem { get; set; }
    public virtual DbSet<Document> Document { get; set; }
    public virtual DbSet<NewsletterSubscriber> NewsletterSubscriber { get; set; }

    private IOptions<AppOptions> _options;
    private bool _isForTesting;

    public ShopDbContext(IOptions<AppOptions> options, DbContextOptions<ShopDbContext> dbContextOptions, bool isForTesting = false) : base(dbContextOptions)
    {
        _options = options;
        _isForTesting = isForTesting;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!_isForTesting)
        {
            optionsBuilder.UseSqlServer(_options.Value.ConnectionString);
        }
        optionsBuilder.UseExceptionProcessor();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>().HasQueryFilter(p => p.LifecycleState != ProductLifecycleState.Archived);
        modelBuilder.Entity<Cart>().HasQueryFilter(p => p.State != CartLifecycleState.Archived);
    }
}