using Microsoft.EntityFrameworkCore;
using Shop.Data.DataModels;
using Shop.Misc.Interfaces;

namespace Shop.Data;

public class ShopDbContext : DbContext {
    public DbSet<ProductEntity> Product { get; set; }
    public DbSet<CategoryEntity> Category { get; set; }
    public DbSet<ImageEntity> Image { get; set; }

    private IAppSettingsConfigurationService _appSettingsConfigurationService;

    public ShopDbContext(IAppSettingsConfigurationService appSettingsConfigurationService) : base() {
        _appSettingsConfigurationService = appSettingsConfigurationService;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        optionsBuilder.UseSqlServer(_appSettingsConfigurationService.GetAppSettingsConfiguration()["ConnectionString"]);
    }
}