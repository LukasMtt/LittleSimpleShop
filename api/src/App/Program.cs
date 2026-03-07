using App.Middlewares;

using AutoMapper;

using FluentMigrator.Runner;

using Fluid;

using Microsoft.Extensions.Http.Resilience;

using Polly;

using Serilog;

using Shop.Data;
using Shop.Data.Migrations;
using Shop.Misc;
using Shop.Service;

using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

class Program
{
    static void Main(string[] args)
    {
        ConfigureSerilog();
        try
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.Configure<AppOptions>(builder.Configuration);
            var options = builder.Configuration.Get<AppOptions>();
            var isDevEnv = builder.Environment.IsDevelopment();

            RegisterServices(builder.Services, options, isDevEnv);
            MigrateDatabase(options);

            var app = builder.Build();
            if (isDevEnv)
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors("CorsPolicy");
            app.UseHttpsRedirection();
            app.UseExceptionHandler("/error");
            app.UseAuthorization();
            app.UseAntiforgeryToken();
            app.MapControllers();
            app.UseRateLimiter();

            app.Run();
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Unhandled exception during application startup.");
            Environment.Exit(1);
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    private static void RegisterServices(IServiceCollection services, AppOptions? appOptions, bool isDevEnv)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(name: "CorsPolicy",
                builder => builder.WithOrigins(appOptions?.FrontendBaseUrl ?? throw new InvalidOperationException("FrontendBaseUrl is not configured.")).AllowAnyMethod().AllowAnyHeader().AllowCredentials()
            );
        });
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "X-Xsrf-Header";
            options.Cookie.Name = "XSRF-TOKEN";
            options.Cookie.Path = "/";
            options.Cookie.HttpOnly = false;
            if (isDevEnv)
            {
                options.Cookie.SameSite = SameSiteMode.None;
            }
            else
            {
                options.Cookie.SameSite = SameSiteMode.Strict;
            }
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        });
        services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
        services.AddRateLimiter(options => options.AddPolicy("paymentRateLimiterPolicy",
            httpContext => RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                factory: partition => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 3,
                    QueueLimit = 0,
                    Window = TimeSpan.FromMinutes(1)
                })).RejectionStatusCode = StatusCodes.Status429TooManyRequests
        );
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddSerilog();

        services.AddDbContext<ShopDbContext>();

        services.AddSingleton(ConfigureMappings());

        services.AddSingleton((provider) => new FluidParser());
        services.AddTransient<StripePaymentService>();
        services.AddTransient<OrderService>();
        services.AddTransient<ShippingService>();
        services.AddTransient<CartService>();
        services.AddTransient<MailService>();

        services.AddHttpClient<IFileStorageService, SeaweedFsService>(client =>
        {
            client.BaseAddress = new Uri(appOptions?.SeaweedFs?.Url ?? throw new InvalidOperationException("SeaweedFsBaseUrl is not configured."));
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
        //todo obviously need to add Serilog here - CHANGE
        var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddConsole().AddDebug();
        });
        var mapperConfig = new MapperConfiguration(mc =>
        {
            mc.AddProfile(new MappingProfile());
        }, loggerFactory);
        IMapper mapper = mapperConfig.CreateMapper();
        return mapper;
    }

    private static ServiceProvider CreateFluentMigratorServices(AppOptions appOptions)
    {
        return new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                .AddSqlServer()
                .WithGlobalConnectionString(appOptions.ConnectionString)
                .ScanIn(typeof(AddProductTable).Assembly).For.Migrations())
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            .BuildServiceProvider(false);
    }

    private static void UpdateDatabase(IServiceProvider serviceProvider)
    {
        var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
        runner.MigrateUp();
    }

    private static void MigrateDatabase(AppOptions? appOptions)
    {
        if (appOptions != null)
        {
            using (var serviceProvider = CreateFluentMigratorServices(appOptions))
            {
                using (var scope = serviceProvider.CreateScope())
                {
                    UpdateDatabase(scope.ServiceProvider);

                }
            }
        }
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