using MailKit.Net.Smtp;

using Microsoft.Extensions.Options;

using MimeKit;

using Shop.Misc;

namespace Shop.Service;

public class MailService
{
    private IOptions<AppOptions> _appOptions;

    public MailService(IOptions<AppOptions> appOptions)
    {
        _appOptions = appOptions;
    }

    public async Task<ServiceResult<bool>> SendMailAsync(string? destinationAddress, string? destinationName, string? subject, string? body, byte[]? attachmentContent, ContentType? attachmentContentType, string? attachmentFileName, CancellationToken cancellationToken)
    {
        if (!IsMailConfigAndInputValid(destinationAddress, destinationName, subject, body))
        {
            Serilog.Log.Error("Could not send email due to error.");
            return new ServiceResult<bool>
            {
                IsSuccess = false,
                ErrorMessage = "Could not send email"
            };
        }
        try
        {
            var message = GetMessage(destinationName!, destinationAddress!, subject!, body!, attachmentContent, attachmentContentType, attachmentFileName);
            using var client = new SmtpClient();
            client.Connect(_appOptions.Value.Email.SmtpServer, _appOptions.Value.Email.SmtpPort.GetValueOrDefault(), false, cancellationToken);
            if (!string.IsNullOrEmpty(_appOptions.Value.Email.SmtpUser) && !string.IsNullOrEmpty(_appOptions.Value.Email.Password))
            {
                client.Authenticate(_appOptions.Value.Email.SmtpUser, _appOptions.Value.Email.Password, cancellationToken);
            }
            await client.SendAsync(message, cancellationToken);
            client.Disconnect(true, cancellationToken);
            return new ServiceResult<bool>
            {
                IsSuccess = true,
                ResultData = true
            };
        }
        catch (OperationCanceledException)
        {
            Serilog.Log.Warning("Could not send email due to cancellation of the sending process.");
            return new ServiceResult<bool>
            {
                IsSuccess = false,
                ErrorMessage = "Could not send email"
            };
        }
        catch (Exception)
        {
            Serilog.Log.Error("Could not send email due to error.");
            return new ServiceResult<bool>
            {
                IsSuccess = false,
                ErrorMessage = "Could not send email"
            };
        }
    }

    private MimeMessage GetMessage(string destinationName, string destinationAddress, string subject, string body, byte[]? attachmentContent, ContentType? attachmentContentType, string? attachmentFileName)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_appOptions.Value.Email.FromName, _appOptions.Value.Email.FromAddress));
        message.To.Add(new MailboxAddress(destinationName, destinationAddress));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = body
        };
        if (attachmentContent != null && attachmentContentType != null && attachmentFileName != null)
        {
            bodyBuilder.Attachments.Add(attachmentFileName, attachmentContent, attachmentContentType);
        }
        message.Body = bodyBuilder.ToMessageBody();

        return message;
    }

    private bool IsMailConfigAndInputValid(string? destinationAddress, string? destinationName, string? subject, string? body)
    {
        if (string.IsNullOrEmpty(_appOptions.Value.Email.FromAddress)
        || string.IsNullOrEmpty(_appOptions.Value.Email.FromName)
        || _appOptions.Value.Email.SmtpPort == null
        || string.IsNullOrEmpty(_appOptions.Value.Email.SmtpServer))
        {
            return false;
        }
        if (string.IsNullOrEmpty(destinationAddress) || string.IsNullOrEmpty(destinationName) || string.IsNullOrEmpty(subject) || string.IsNullOrEmpty(body))
        {
            return false;
        }
        return true;
    }
}