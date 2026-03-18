using App.Middlewares;
using HttpContextMoq;
using HttpContextMoq.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using NSubstitute;

namespace AppTest.Middleware;

[TestFixture]
public class AntiForgeryTokenMiddlewareTest : BaseTest
{
    private AntiForgeryTokenMiddleware _antiForgeryTokenMiddleware;

    private RequestDelegate _next;

    [SetUp]
    public void Setup()
    {
        _next = Substitute.For<RequestDelegate>();
        _antiForgeryTokenMiddleware = new AntiForgeryTokenMiddleware(_next, false);
    }

    [TestCase("Post", false)]
    [TestCase("Put", false)]
    [TestCase("Patch", false)]
    [TestCase("Delete", false)]
    [TestCase("Get", true)]
    [TestCase("Head", true)]
    public async Task Invoke_ReturnsCorrectly_WhenCookieAndHeaderNotPresent(string method, bool pipelineContinues)
    {
        var httpContextMock = new HttpContextMock()
            .SetupRequestMethod(method);

        await _antiForgeryTokenMiddleware.InvokeAsync(httpContextMock);

        _next.Received(pipelineContinues ? 1 : 0);        
    }

    [TestCase("Post")]
    [TestCase("Put")]
    [TestCase("Patch")]
    [TestCase("Delete")]
    [TestCase("Get")]
    [TestCase("Head")]
    public async Task Invoke_ReturnsCorrectly_WhenCookieAndHeaderTokenMatch(string method)
    {
        var httpContextMock = new HttpContextMock()
            .SetupRequestCookies(new Dictionary<string, string>
            {
                {"XSRF-TOKEN", "abc"}
            })
            .SetupRequestHeaders(new Dictionary<string, StringValues>
            {
                {"X-Xsrf-Header", "abc"}
            })
            .SetupRequestMethod(method);

        await _antiForgeryTokenMiddleware.InvokeAsync(httpContextMock);

        _next.Received(1);        
    }

    [TestCase("Post", false)]
    [TestCase("Put", false)]
    [TestCase("Patch", false)]
    [TestCase("Delete", false)]
    [TestCase("Get", true)]
    [TestCase("Head", true)]
    public async Task Invoke_ReturnsCorrectly_WhenCookieAndHeaderDoNotMatch(string method, bool pipelineContinues)
    {
        var httpContextMock = new HttpContextMock()
        .SetupRequestCookies(new Dictionary<string, string>
        {
            {"XSRF-TOKEN", "abc"}
        })
        .SetupRequestHeaders(new Dictionary<string, StringValues>
        {
            {"X-Xsrf-Header", "xyz"}
        })
        .SetupRequestMethod(method);

        await _antiForgeryTokenMiddleware.InvokeAsync(httpContextMock);

        _next.Received(pipelineContinues ? 1 : 0);        
    }
}