using App.Middlewares;

using FluentMigrator.Runner;

using Fluid;

using Microsoft.Extensions.Http.Resilience;

using Polly;

using Serilog;
using Serilog.Events;

using Shop.Data;
using Shop.Data.Migrations;
using Shop.Interfaces;
using Shop.Misc;
using Shop.Service;

using System.Globalization;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

class Program
{
    static void Main(string[] args)
    {
        ConfigureBootstrapSerilog();
        try
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.Configure<AppOptions>(builder.Configuration);
            var options = builder.Configuration.Get<AppOptions>();
            var isDevEnv = builder.Environment.IsDevelopment();

            if (!string.IsNullOrEmpty(options?.CultureCode))
            {
                Thread.CurrentThread.CurrentCulture = new CultureInfo(options.CultureCode);
            }

            RegisterServices(builder, options, isDevEnv);
            MigrateDatabase(options);

            var app = builder.Build();
            app.UseSerilogRequestLogging();
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

    private static void RegisterServices(WebApplicationBuilder builder, AppOptions? appOptions, bool isDevEnv)
    {
        if (isDevEnv)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "CorsPolicy",
                    builder => builder.WithOrigins(appOptions?.FrontendBaseUrl ?? throw new InvalidOperationException("FrontendBaseUrl is not configured.")).AllowAnyMethod().AllowAnyHeader().AllowCredentials()
                );
            });
        }
        builder.Services.AddAntiforgery(options =>
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
        builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
        builder.Services.AddRateLimiter(options => options.AddPolicy("paymentRateLimiterPolicy",
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
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddSerilog((services, loggerConfiguration) => loggerConfiguration
            .ReadFrom.Configuration(builder.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .WriteTo.Console());

        builder.Services.AddDbContext<ShopDbContext>();

        builder.Services.AddSingleton((provider) => new FluidParser());
        builder.Services.AddTransient<StripePaymentService>();
        builder.Services.AddTransient<OrderService>();
        builder.Services.AddTransient<ShippingService>();
        builder.Services.AddTransient<CartService>();
        builder.Services.AddTransient<MailService>();
        builder.Services.AddTransient<InvoiceService>();
        builder.Services.AddTransient<NewsletterService>();

        builder.Services.AddHttpClient<IFileStorageService, SeaweedFsService>()
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

        builder.Services.AddHttpClient<IPdfConverterService, PdfConverterService>(client =>
        {
            client.BaseAddress = new Uri(appOptions?.PdfConverter?.Url ?? throw new InvalidOperationException("PdfConverterBaseUrl is not configured."));
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

    private static void ConfigureBootstrapSerilog()
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .CreateBootstrapLogger();
    }
}