using Microsoft.EntityFrameworkCore;

using Shop.Data.DataModels;
using Shop.Misc.Interfaces;

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

    private IAppSettingsConfigurationService _appSettingsConfigurationService;

    public ShopDbContext(IAppSettingsConfigurationService appSettingsConfigurationService) : base()
    {
        _appSettingsConfigurationService = appSettingsConfigurationService;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_appSettingsConfigurationService.GetAppSettingsConfiguration()["ConnectionString"]);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>().HasQueryFilter(p => p.LifecycleState != ProductLifecycleState.Archived);
    }
}