namespace Shop.Misc;

public static class AppSettingsConfigurationProxy {
    private static IConfigurationRoot? _appSettingsConfiguration;

    public static IConfigurationRoot GetAppSettingConfiguration() {
        if (_appSettingsConfiguration == null) 
            _appSettingsConfiguration =  new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

        return _appSettingsConfiguration;
    } 
}