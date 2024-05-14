using Shop.Misc.Interfaces;

namespace Shop.Misc;

public class AppSettingsConfigurationService : IAppSettingsConfigurationService
 {
    public IConfigurationRoot? AppSettingsConfiguration { get; set; }

    public AppSettingsConfigurationService() {
        AppSettingsConfiguration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
    }

    public IConfigurationRoot GetAppSettingsConfiguration() {
        return AppSettingsConfiguration;
    }
}