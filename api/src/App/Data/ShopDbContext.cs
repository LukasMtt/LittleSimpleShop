using Microsoft.EntityFrameworkCore;
using Shop.Data.DataModels;
using Shop.Misc.Interfaces;

namespace Shop.Data;

public class ShopDbContext : DbContext {
    public DbSet<Product> Product { get; set; }
    public DbSet<Category> Category { get; set; }
    public DbSet<Image> Image { get; set; }

    private IAppSettingsConfigurationService _appSettingsConfigurationService;

    public ShopDbContext(IAppSettingsConfigurationService appSettingsConfigurationService) : base() {
        _appSettingsConfigurationService = appSettingsConfigurationService;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        optionsBuilder.UseSqlServer(_appSettingsConfigurationService.GetAppSettingsConfiguration()["ConnectionString"]);
    }
}