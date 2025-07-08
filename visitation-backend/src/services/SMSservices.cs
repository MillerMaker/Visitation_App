using System;
using System.Collections.Generic;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public class SMSservices
{
    private readonly string _baseFrontendUrl;
    private readonly string _twilioAccountSid;
    private readonly string _twilioAuthToken;
    public SMSservices(IConfiguration configuration)
    {
        _baseFrontendUrl = configuration.GetSection("AppSettings")["BaseFrontendURL"] ?? throw new ArgumentNullException("BaseFrontendUrl configuration is missing");
        _twilioAccountSid = configuration.GetSection("Twilio")["AccountSid"] ?? throw new ArgumentNullException("Twilio:AccountSid configuration is missing.");
        _twilioAuthToken = configuration.GetSection("Twilio")["AuthToken"] ?? throw new ArgumentNullException("Twilio:Authtoken configuration is missing.");
    }
    public async Task sendInviteSMS(string phoneNumber, Guid token, string baseFrontendUrl)
    {
        TwilioClient.Init(_twilioAccountSid, _twilioAuthToken);

        var urlWithToken = $"{baseFrontendUrl}/auth/{token}";

        var messageOptions = new CreateMessageOptions(new PhoneNumber($"{phoneNumber}"));
        messageOptions.From = new PhoneNumber("+18335840803");
        messageOptions.Body = $"You've been invited to join Highways and Hedges, Click to register: {urlWithToken}";


        var message = await MessageResource.CreateAsync(messageOptions);
        Console.WriteLine(message.Body);
    }
}