using AutoMapper;
using FluentMigrator.Runner;
using Serilog;
using Shop.ApiModels;
using Shop.Data.DataModels;
using Shop.Data.Migrations;
using Shop.Misc;

class Program
{
    static void Main(string[] args)
    {
        var appSettingsConfig = AppSettingsConfigurationProxy.GetAppSettingConfiguration();

        ConfigureSerilog();

        try
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSingleton(ConfigureMappings());

            if (appSettingsConfig != null)
                using (var serviceProvider = CreateFluentMigratorServices(appSettingsConfig))
                using (var scope = serviceProvider.CreateScope())
                    UpdateDatabase(scope.ServiceProvider);

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

    private static IMapper ConfigureMappings()
    {
        var mapperConfig = new MapperConfiguration(mc =>
        {
             mc.AddProfile(new MappingProfile());
        });
        IMapper mapper = mapperConfig.CreateMapper();
        return mapper;
    }
}