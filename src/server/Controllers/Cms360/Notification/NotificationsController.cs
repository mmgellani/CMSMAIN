using AppBackend.Models;
using System.Threading.Tasks;
using System.Web;
using System.Net.Http;
using System.Net;
using System.Net.Http.Formatting;
using System.Text;
using System.Runtime.CompilerServices;
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
using Npgsql;




namespace Cms360.Server.Controllers
{

    [Route("api/[controller]")]
    [EnableCors("AllowPolicy")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [ServiceFilter(typeof(Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Filters.ApiExceptionFilter))]

    public class NotificationSenderClass : Controller
    {



        [HttpPost]

        [Route("[action]")]
        public async Task<HttpResponseMessage> Post([FromBody] Predicate model)
        {

            var title = (model.ProvidedString.Split("?")[0]);
            var body = (model.ProvidedString.Split("?")[1]);
            var to_tag = (model.ProvidedString.Split("?")[2]);
            var reciever = (model.ProvidedString.Split("?")[3]);
            //  var user = "local";
            // string[] userTag = new string[2];
            // userTag[0] = "uName:" + to_tag;
            // userTag[1] = "from: Local";

            Microsoft.Azure.NotificationHubs.NotificationOutcome outcome = null;
            HttpStatusCode ret = HttpStatusCode.InternalServerError;

           var alert = "{\"aps\":{\"alert\":{\"title\":\"" + title + "\",\"body\":\"" + body + "\",\"isThisRating\":\"false\",\"isThisSurvey\":\"false\",\"isThisParents\":\"true\"},\"sound\":\"default\"}}";
            Console.WriteLine(alert);
            if(reciever=="Student")
            {
               alert = "{\"aps\":{\"alert\":{\"title\":\"" + title + "\",\"body\":\"" + body + "\",\"isThisRating\":\"false\",\"isThisSurvey\":\"true\",\"isThisParents\":\"false\"},\"sound\":\"default\"}}";
            }

            outcome = await Notifications.Instance.Hub.SendAppleNativeNotificationAsync(alert, to_tag);

            // var notif = "{ \"data\" : {\"message\":\"" + message + "\"}}";

            var notif = "{ \"notification\":{ \"title\":\"" + title + "\", \"body\":\"" + body + "\" },\"data\":{\"onClick\":\"true\", \"userType\":\"" + reciever + "\" }}";
            Console.WriteLine(notif);
           

            outcome = await Notifications.Instance.Hub.SendFcmNativeNotificationAsync(notif, to_tag);
            HttpResponseMessage result = new HttpResponseMessage(ret);


            return result;
        }



        [HttpPost]

        [Route("[action]")]
        public async Task<HttpResponseMessage> PostHadaf([FromBody] Predicate model)
        {

            var title = (model.ProvidedString.Split("?")[0]);
            var body = (model.ProvidedString.Split("?")[1]);
            var to_tag = (model.ProvidedString.Split("?")[2]);
            var reciever = (model.ProvidedString.Split("?")[3]);
            //  var user = "local";
            // string[] userTag = new string[2];
            // userTag[0] = "uName:" + to_tag;
            // userTag[1] = "from: Local";

            Microsoft.Azure.NotificationHubs.NotificationOutcome outcome = null;
            HttpStatusCode ret = HttpStatusCode.InternalServerError;

            var alert = "{\"aps\":{\"alert\":{\"title\":\"" + title + "\",\"body\":\"" + body + "\",\"isThisRating\":\"false\",\"isThisSurvey\":\"false\",\"isThisParents\":\"true\"},\"sound\":\"default\"}}";
            Console.WriteLine(alert);
            if(reciever=="Student")
            {
               alert = "{\"aps\":{\"alert\":{\"title\":\"" + title + "\",\"body\":\"" + body + "\",\"isThisRating\":\"false\",\"isThisSurvey\":\"true\",\"isThisParents\":\"false\"},\"sound\":\"default\"}}";
            }

            outcome = await NotificationsHadaf.Instance.Hub.SendAppleNativeNotificationAsync(alert, to_tag);

            // var notif = "{ \"data\" : {\"message\":\"" + message + "\"}}";

            var notif = "{ \"notification\":{ \"title\":\"" + title + "\", \"body\":\"" + body + "\" },\"data\":{\"onClick\":\"true\", \"userType\":\"" + reciever + "\" }}";
            Console.WriteLine(notif);

            outcome = await NotificationsHadaf.Instance.Hub.SendFcmNativeNotificationAsync(notif, to_tag);
            HttpResponseMessage result = new HttpResponseMessage(ret);


            return result;
        }


    }
}