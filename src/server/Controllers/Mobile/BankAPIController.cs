using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Cms360.Contract;
using Cms360.Contract.Security;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Service;
using Cms360.Service.Model;
using Cms360.Service.Security;
using Dapper;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Microsoft.AspNetCore.Cors;
using MailKit.Net.Smtp;
using MimeKit;
using Hangfire;
using Hangfire.MemoryStorage;
using System.ComponentModel.DataAnnotations;


namespace Cms360.Server.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("AllowPolicy")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    public class BankAPIController : Controller
    {
        private readonly IUserLogService log;
        private DbContextBase dbc;
        private IEmailService email;

        public BankAPIController(IUserLogService log, DbContextBase dbc, IEmailService email)
        {
            this.log = log;
            this.dbc = dbc;
            this.email = email;
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult Payment([FromBody] Payment param)
        {

            IDbConnection connection = dbc.Database.GetDbConnection();

            // string json = JsonConvert.SerializeObject(param);
            var Data = this.log.GetLog();


            string json = String.Format("SELECT \"Fee\".\"APICheckChallanStatusFrenchise\"('{0}','{1}',{2},'{3}','{4}','{5}') as ProvidedString", param.p_ChallanNumber, param.p_TransactionId, param.p_Amount, Data, param.p_UserName, param.p_Password);




            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var jsonResult = connection.QueryFirstOrDefault<string>(json);

            RTVExt rtv = null;

            if (!string.IsNullOrEmpty(jsonResult))
            {
                // Deserialize directly to RTV
                rtv = JsonConvert.DeserializeObject<RTVExt>(jsonResult);

                if (rtv?.ReturnValue == "0")
                {
                    BackgroundJob.Enqueue(() => this.SendEamilJK(param.p_ChallanNumber));
                }
            }

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv ?? new RTVExt { ReturnValue = "1", ReturnMessage = "EXCEPTION" });
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult Inquiry([FromBody] Inquiry param)
        {
            var Data = this.log.GetLog();
            IDbConnection connection = dbc.Database.GetDbConnection();

            try
            {
                string json = String.Format("SELECT \"Fee\".\"APICheckChallanFr\"('{0}','{1}','{2}','{3}') as ProvidedString", param.p_ChallanNumber, Data, param.p_UserName, param.p_Password);

                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                var result = connection.QueryFirstOrDefault<string>(json);
                var returnValue = result ?? "1"; // Default to SYSTEM_ERROR if null

                // Map return value to message
                // Replace the switch expression with a traditional switch statement
                string returnMessage;
                switch (returnValue)
                {
                    case "0":
                        returnMessage = "SUCCESS";
                        break;
                    case "1":
                        returnMessage = "SYSTEM_ERROR";
                        break;
                    case "2":
                        returnMessage = "INVALID_USERNAME_OR_PASSWORD";
                        break;
                    case "3":
                        returnMessage = "INCORRECT_CHALLAN_NO";
                        break;
                    case "4":
                        returnMessage = "ALREADY_PAID";
                        break;
                    case "9":
                        returnMessage = "INACTIVE_ACCOUNT";
                        break;
                    case "10":
                        returnMessage = "CLOSED_ACCOUNT";
                        break;
                    default:
                        returnMessage = "SYSTEM_ERROR";
                        break;
                }

                if (returnValue == "0" || returnValue == "4")
                {
                    var response = GetResponseFromDBFr(param, Convert.ToInt16(returnValue));

                    return Ok(response);
                }
                else
                {
                    var errorResponse = new InquiryResponseFr
                    {
                        p_StudentName = null,
                        p_ReferenceNo = null,
                        p_ChallanNumber = param.p_ChallanNumber,
                        p_Amount = 0,
                        p_DueDate = null,
                        p_BillingMonth = null,
                        p_CampusName = null,
                        p_CompanyName = null,
                        p_CustomerCode = null,
                        p_AccountNo = null,
                        p_RoyaltyPercentage = 0,
                        ReturnValue = returnValue,
                        ReturnMessage = returnMessage
                    };
                    return Ok(errorResponse);
                }
            }
            catch (Exception ex)
            {
                return Ok(new InquiryResponseFr
                {
                    ReturnValue = "1",
                    ReturnMessage = "SYSTEM_ERROR",
                    p_ChallanNumber = param.p_ChallanNumber
                });
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }


        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IList<InquiryResponseFr> GetResponseFromDBFr([FromBody] Inquiry param, Int16 code)
        {
            string sql = String.Format(@"select * from  ""Fee"".""APIFrenchiseData""({0},'{1}')", code, param.p_ChallanNumber);
            // Console.WriteLine(sql);
            return this.dbc.InquiryResponseFr.FromSql(sql).ToList<InquiryResponseFr>();
        }

        public class RTVExt
        {
            [JsonProperty("returnValue")]
            public string ReturnValue { get; set; }

            [JsonProperty("returnMessage")]
            public string ReturnMessage { get; set; }
        }





        public void SendEamilJK(string v1)
        {

            string jsonq = String.Format("SELECT * from  \"Fee\".\"CheckChallan\"('{0}')", v1);


            var data = this.dbc.ChQuery.FromSql(jsonq).ToList();
            if (data[0].FullName != "NAN")
            {
                var messageEx = "<!DOCTYPE html    PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"https://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\"    xmlns:o=\"urn:schemas-microsoft-com:office:office\"><head>    <title>CMS EMAIL</title>    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">    <meta name=\"format-detection\" content=\"telephone=no\">    <style type=\"text/css\">        * {            margin: 0;            font-family: Arial, Helvetica, sans-serif;        }        body {            margin: 0 !important;            padding: 0 !important;            -webkit-text-size-adjust: 100% !important;            -ms-text-size-adjust: 100% !important;            -webkit-font-smoothing: antialiased !important;        }        .em_body {            width: 100%;            height: auto;            background-color: #fafafa;        }        .logo-img {            padding: 20px;        }        .side-img {            height: 90vh;        }        .content {            padding: 0 28px 0 40px;            font-size: 12px;        }        table {            width: 100%;            border-collapse: collapse;        }        .em_main_table {            width: 100%;        }        @media only screen and (min-width:480px) and (max-width:699px) {            .em_main_table {                width: 90% !important;            }        }    </style></head><body class=\"em_body\">    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">        <tr>            <td style=\"max-height:100%;\">                <img src=\"https://onlineadmissions.cms.edu.pk/logocms.png\" class=\"logo-img\" width=\"150px\">                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"em_main_table\">                    <tr>                        <td class=\"content\">                            <!-- <h3 style=\"margin-bottom: 0; color: #fff; padding: 0 20px 0 0; margin-bottom: 15px;\">                                Thank you for                                Registering</h3> -->                            <div style=\"margin-bottom: 14px;\">                                <span style=\"color: #fff;\"> Dear</span>                                <h3 style=\"display: inline-block; color: #fff;\">" + data[0].FullName + "</h3>,                            </div>                            <p style=\"color: #fff; word-wrap: break-word;padding: 0 20px 0 0; margin:14px 0;\">                                We have received your payment and you have successfully completed the admission process.                                You will be contacted by the admissions office with further details of your admission.                            </p>                            <p style=\"color: #fff; word-wrap: break-word; padding: 0 20px 0 0; margin-bottom: 14px;\">                                In case you need help at any point, please call our helpline at 0800-78608 (8 a.m to 8 p.m) for                                assistance.                            </p>                            <h3 style=\"color: #fff;margin:15px 0;\">Good Luck!</h3>                            <h3 style=\"color: #fff; margin-bottom:0;\">Admissions office</h3>                            <h3 style=\"color: #fff; margin: 0;\">Campus Management</h3>                        </td>                    </tr>                </table>            </td>            <td width=10% style=\"vertical-align: top;\" style=\"max-height:100%; width:10%;\">                <img src=\"https://onlineadmissions.cms.edu.pk/mainbg.png\" class=\"side-img\">            </td>        </tr>        <tr>            <td colspan=\"2\">                <a href=\"https://www.youtube.com/watch?v=AxlPvTwlroY\">                    <img src=\"https://onlineadmissions.cms.edu.pk/emailpost.png\" style=\"width:100%\" alt=\"\">                </a>            </td>        </tr>        <tr>            <td colspan=\"2\">                <div style=\"padding: 1em 0;                      background: #fff;\">                    <ul style=\" margin: 0; padding: 0; list-style-type: none; text-align: center;\">                        <li style=\" display: inline-block; margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <a href=\"https://www.facebook.com/CMSWorld\"><img style=\" width: 30px; height: 30px;\"                                        src=\"https://onlineadmissions.cms.edu.pk/ic_facebook.png\" alt=\"\"></a>                                <a href=\"https://www.twitter.com/CMSWorld\"><img style=\" width: 30px;                     height: 30px;\" src=\"https://onlineadmissions.cms.edu.pk/ic_twitter.png\" alt=\"\"></a>                                <a href=\"https://www.instagram.com/CMSWorld\"><img style=\" width: 30px;                         height: 30px;\" src=\"https://onlineadmissions.cms.edu.pk/ic_insta.png\" alt=\"\"></a>                                <a href=\"https://www.youtube.com/CMSWorld\"><img style=\" width: 30px;                         height: 30px;\" src=\"https://onlineadmissions.cms.edu.pk/ic_youtube.png\" alt=\"\"></a>                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">/CMSWORLD</div>                        </li>                        <li style=\" display: inline-block;            margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <img src=\"https://admissions.cms.edu.pk/ic_call.png\" width=\"30\" alt=\"\">                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">0800-78608</div>                        </li>                        <li style=\" display: inline-block;            margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <img src=\"https://admissions.cms.edu.pk/ic_web.png\" width=\"30\" alt=\"\">                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">www.cms.edu                            </div>                        </li>                        <li style=\" display: inline-block;            margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <img src=\"https://admissions.cms.edu.pk/ic_address.png\" width=\"30\" alt=\"\">                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">123-C, Block E1, Hali Road Gulberg III, Lahore                            </div>                        </li>                    </ul>                </div>            </td>        </tr>    </table></body></html>";

                var message = this.email.GetMessageObjForAuthLoginEmailEx(data[0].Email, messageEx);
                message.Subject = "Payment received";
                message.Body = new TextPart("html")
                {
                    Text = messageEx
                };

                using (var client = new SmtpClient())
                {
                    client.Connect("smtp.office365.com", 587, false);
                    client.Authenticate("onlineadmissions@cms.edu.pk", "P@kist0n123");
                    client.Send(message);
                    client.Disconnect(true);
                }

            }

        }
    }
}

