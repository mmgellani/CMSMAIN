using System;
using System.Net.Mail;
using System.Threading.Tasks;
using Cms360.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MailKit;
using MimeKit;
using Microsoft.Extensions.Options;
using Cms360.Server;
using Newtonsoft.Json;
using Cms360.Data.Model;

namespace Cms360.Server
{
    public class EmailService : IEmailService
    {
        private string FromParameterName = "Campus Managment System";

        private string FromParameterNameHadaf = "Hadaf Group Of Colleges";

        private string FromParameterNameStep = "STEP by CMS";
        private string FromParameterAddress = "webmaster@cms.edu.pk";
        private string FromParameterAddressEx = "onlineadmissions@cms.edu.pk";

        private string FromParameterAddressStep = "admissions@step.cms.edu.pk";
        private string FromParameterAddressHadaf = "admissions@hadaf.edu.pk";

        public EmailService()
        {
        }

        public MimeMessage GetMessageObjForAuthLoginEmail(string emailID, string emailWording)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterName, FromParameterAddress));
            message.To.Add(new MailboxAddress(emailID));
            message.Subject = "Email From CMS";
            message.Body = new TextPart("Plain") { Text = emailWording };

            return message;
        }

        public MimeMessage GetMessageObjForEmail(string emailID)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterName, FromParameterAddress));
            message.To.Add(new MailboxAddress(emailID));

            return message;
        }

        public MimeMessage GetMessageObjForAuthLoginEmailEx(string emailID, string emailWording)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterName, FromParameterAddressEx));
            message.To.Add(new MailboxAddress(emailID));
            message.Subject = "Email From CMS";
            message.Body = new TextPart("Plain") { Text = emailWording };

            return message;
        }

        public MimeMessage GetMessageObjForEmailEx(string emailID)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterName, FromParameterAddressEx));
            message.To.Add(new MailboxAddress(emailID));

            return message;
        }

         public MimeMessage GetMessageObjForAuthLoginEmailHadaf(string emailID, string emailWording)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterNameHadaf, FromParameterAddressHadaf));
            message.To.Add(new MailboxAddress(emailID));
            message.Subject = "Thank you for your application";
            message.Body = new TextPart("Plain") { Text = emailWording };

            return message;
        }

        public MimeMessage GetMessageObjForEmailHadaf(string emailID)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterNameHadaf, FromParameterAddressHadaf));
            message.To.Add(new MailboxAddress(emailID));

            return message;
        }

        public MimeMessage GetMessageObjForAuthLoginEmailStep(string emailID, string emailWording)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterNameStep, FromParameterAddressStep));
            message.To.Add(new MailboxAddress(emailID));
            message.Subject = "Confirmation of Registration";
            message.Body = new TextPart("Plain") { Text = emailWording };

            return message;
        }

        public MimeMessage GetMessageObjForEmailStep(string emailID)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromParameterNameStep, FromParameterAddressStep));
            message.To.Add(new MailboxAddress(emailID));

            return message;
        }
    }
}