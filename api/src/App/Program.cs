using AutoMapper;
using FluentMigrator.Runner;
using Serilog;
using Shop.Data;
using Shop.Data.Migrations;
using Shop.Misc;
using Shop.Misc.Interfaces;

class Program
{
    static void Main(string[] args)
    {
        ConfigureSerilog();
        try
        {
            var builder = WebApplication.CreateBuilder(args);

            RegisterServices(builder.Services);
            MigrateDatabase(builder.Services);
            
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Unhandled exception");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    private static void RegisterServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddSingleton(ConfigureMappings());
        services.AddSerilog();

        services.AddDbContext<ShopDbContext>();

        services.AddSingleton<IAppSettingsConfigurationService, AppSettingsConfigurationService>();
    }

    private static IMapper ConfigureMappings()
    {
        var mapperConfig = new MapperConfiguration(mc =>
        {
             mc.AddProfile(new MappingProfile());
        });
        IMapper mapper = mapperConfig.CreateMapper();
        return mapper;
    }

    private static ServiceProvider CreateFluentMigratorServices(IConfigurationRoot appSettingsConfiguration)
    {
        return new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                .AddSqlServer()
                .WithGlobalConnectionString(appSettingsConfiguration["ConnectionString"])
                .ScanIn(typeof(AddProductTable).Assembly).For.Migrations())
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            .BuildServiceProvider(false);
    }

    private static void UpdateDatabase(IServiceProvider serviceProvider)
    {
        var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
        runner.MigrateUp();
    }

    private static void MigrateDatabase(IServiceCollection services) {
        var appSettingsConfig = services.BuildServiceProvider().GetService<IAppSettingsConfigurationService>().GetAppSettingsConfiguration();
        if (appSettingsConfig != null)
            using (var serviceProvider = CreateFluentMigratorServices(appSettingsConfig))
                using (var scope = serviceProvider.CreateScope())
                    UpdateDatabase(scope.ServiceProvider);
    }

    private static void ConfigureSerilog()
    {
        var logFile = Path.Combine("logs", "log.txt");
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .WriteTo.File(logFile,
                rollingInterval: RollingInterval.Day,
                rollOnFileSizeLimit: true)
            .CreateLogger();
    }
}