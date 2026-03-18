using EntityFrameworkCore.Testing.NSubstitute.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NSubstitute;
using Shop.Data;
using Shop.Misc;

namespace AppTest;

public abstract class BaseTest
{
    protected ShopDbContext? DbContext;
    protected IOptions<AppOptions>? Options;

    [SetUp]
    public void SetupBase()
    {        
        Options = Substitute.For<IOptions<AppOptions>>();
        var appOptions = new AppOptions
        {
            ConnectionString = "",
            FrontendBaseUrl = "",
            CultureCode = "",
            StripePrivateKey = "",
            StripeWebhookSecret = "",
            SeaweedFs = new SeaweedFsOptions
            {
                FileUrl = "",
                AssignUrl = ""
            },
            PdfConverter = new PdfConverterOptions
            {
                Url = ""
            },
            Email = new EMailOptions
            {
                FromAddress = "",
                FromName = "",
                SmtpPort = 1, 
                SmtpServer = "",
                SmtpUser = "",
                Password = ""
            }
        };
        Options.Value.Returns(appOptions);

        var dbContextOptions = new DbContextOptionsBuilder<ShopDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        var dbContextToMock = new ShopDbContext(Options, dbContextOptions, true);
        DbContext = new MockedDbContextBuilder<ShopDbContext>().UseDbContext(dbContextToMock).UseConstructorWithParameters(Options, dbContextOptions, true).MockedDbContext;
    }

    [TearDown]
    public void TearDownBase()
    {
        DbContext?.Dispose();
    }
}