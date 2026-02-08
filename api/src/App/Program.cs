using AutoMapper;
using FluentMigrator.Runner;
using Microsoft.Extensions.Http.Resilience;
using Polly;
using Serilog;
using Shop.Data;
using Shop.Data.Migrations;
using Shop.Misc;
using Shop.Misc.Interfaces;
using Shop.Service;
using System.Text.Json.Serialization;

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
            app.UseCors("CorsPolicy");

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
        services.AddCors(options =>
        {
            options.AddPolicy(name: "CorsPolicy",
                builder => builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader()
            );
        });
        services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddSingleton(ConfigureMappings());
        services.AddSerilog();

        services.AddDbContext<ShopDbContext>();

        services.AddTransient<IAppSettingsConfigurationService, AppSettingsConfigurationService>();
        services.AddTransient<StripePaymentService>();
        services.AddTransient<OrderService>();

        services.AddHttpClient<IFileStorageService, SeaweedFsService>(client =>
        {
            client.BaseAddress = new Uri(services.BuildServiceProvider().GetService<IAppSettingsConfigurationService>()!.GetAppSettingsConfiguration()["SeaweedFs:Url"]!);
        })
        .AddResilienceHandler("default", builder =>
        {
            builder.AddTimeout(TimeSpan.FromSeconds(30));
            builder.AddRetry(new HttpRetryStrategyOptions
            {
                MaxRetryAttempts = 3,
                BackoffType = DelayBackoffType.Linear,
                Delay = TimeSpan.FromMilliseconds(20), 
                UseJitter = true
            });
        });
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

    //todo maybe refactor cause does not seem too elegant?
    private static void MigrateDatabase(IServiceCollection services) {
        var appSettingsConfig = services.BuildServiceProvider().GetService<IAppSettingsConfigurationService>()!.GetAppSettingsConfiguration();
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