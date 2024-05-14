using Microsoft.EntityFrameworkCore;
using Shop.Data.DataModels;
using Shop.Misc;

namespace Shop.Data;

public class ShopDbContext : DbContext {
    public DbSet<ProductEntity> Product { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        var appSettingsConfig = AppSettingsConfigurationProxy.GetAppSettingConfiguration();
        optionsBuilder.UseSqlServer(appSettingsConfig["ConnectionString"]);
    }
}