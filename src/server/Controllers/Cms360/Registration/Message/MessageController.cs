using System.Data.Common;
using System.Security.Cryptography;
/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cms.Data.Model;
using Cms360.Contract;

using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server;
// using Cms360.Server.Hubs;
using Cms360.Server.Model;
using Cms360.Service;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;
using System.IO;
using Hangfire;
using Hangfire.MemoryStorage;
using System.Net.Http;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class MessageController : Controller
    {
        private readonly ISmsRepository sms;
        private readonly IUserLogService log;
        private readonly ISmsAPIRepository smsAPI;
        private readonly ITemplatesRepository messagetemplate;
        // private readonly Chat chat;
        private readonly DbContextBase db;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;

        public MessageController(ISmsRepository sms, IUserLogService log, ISmsAPIRepository smsAPI, ITemplatesRepository messagetemplate, DbContextBase db, IDomainContextResolver Resolver)
        {
            this.sms = sms;
            this.log = log;
            this.smsAPI = smsAPI;
            this.messagetemplate = messagetemplate;
            this.Resolver = Resolver;

            // this.chat = chat;
            this.db = db;
        }


        protected IDomainContext DomainContext
        {
            get
            {
                if (this.domainContext == null)
                    this.domainContext = this.Resolver.Resolve();

                return this.domainContext;
            }
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.smsAPI.All());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVM()
        {
            return Ok(this.messagetemplate.All());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFindByVM()
        {
            return Ok(this.db.Templates.FromSql(String.Format("select * from \"Message\".\"Templates\" where \"Status\"= 1 ")));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOneVM([FromBody] Templates model)
        {
            this.messagetemplate.Add(model);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(model), "Insert", "Message.Templates"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] Templates model)
        {
            this.messagetemplate.Update(model);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(model), "Update", "Message.Templates"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SmsApproval entity)
        {
            try
            {
                //return Ok (sms.Add (entity));
                this.sms.Add(entity);
                // chat.BroadcastMessage("admin"," Hello admin");
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Message"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ADDONE Controller.AddOne()" + ex.Message;
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Add([FromBody] Predicate model)
        {

            var messageNo = new String(model.ProvidedString.Split("?")[0]);
            var messageText = new String(model.ProvidedString.Split("?")[1]);

            string json = String.Format("SELECT \"Message\".\"QuedMessageEx\"('{0}','{1}')", messageNo, messageText);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertSmsBulk([FromBody] Predicate predicate)
        {

            var list = predicate.ProvidedString;
            var Data = this.log.GetLog();



            BackgroundJob.Enqueue(() => this.SendMessage(list, Data));


            return Ok(true);
        }

        public void SendMessage(string v1, string v2)
        {



            string json = String.Format("SELECT \"Message\".\"InsertMessageBulk\"('{0}','{1}')", v1, v2);
            // Console.WriteLine(json);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Save([FromBody] Predicate model)
        {

            var messageText = new String(model.ProvidedString.Split("?$")[0]);
            var msgold = new String(model.ProvidedString.Split("?$")[1]);
            var dte = (model.ProvidedString.Split("?$")[2]);
            var uid = Convert.ToInt32(model.ProvidedString.Split("?$")[3]);
            var data = this.log.GetLog();

            string json = String.Format("SELECT \"Message\".\"MessageEdit\"('{0}','{1}','{2}',{3},'{4}')", messageText, msgold, dte, uid, data);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Approve([FromBody] Predicate model)
        {
            var messageText = new String(model.ProvidedString.Split("?")[0]);
            var dte = (model.ProvidedString.Split("?")[1]);
            var uid = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var data = this.log.GetLog();

            string json = String.Format("SELECT \"Message\".\"MessageApproval\"('{0}','{1}',{2},'{3}')", messageText, dte, uid, data);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult UnApprove([FromBody] Predicate model)
        {
            var messageText = new String(model.ProvidedString.Split("?")[0]);
            var dte = (model.ProvidedString.Split("?")[1]);
            var uid = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var data = this.log.GetLog();


            string json = String.Format("SELECT \"Message\".\"MessageUnApproval\"('{0}','{1}',{2},'{3}')", messageText, dte, uid, data);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFilteredSmsNumbers([FromBody] Predicate predicate)
        {
            Guid g1 = Guid.Empty;
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var sectioncourseId = new Guid(predicate.ProvidedString.Split("?")[4]);
            if (sectioncourseId == g1)
            {
                return Ok(db.VWCustomData.Where(s => s.SessionId == sessionid && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId));

            }

            else
            {
                return Ok(db.VWCustomData.Where(s => s.SessionId == sessionid && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionCourseLinkId == sectioncourseId));


            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSmsMask([FromBody] Predicate predicate)
        {
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[0]);

            return Ok(this.db.SmsAPI.FromSql(String.Format("select * from \"Message\".\"SmsAPI\"  where \"SmsApId\" IN (SELECT (jsonb_array_elements(\"AllowedMask\")->>'id')::uuid FROM \"Role\".\"MaskRightLink\" WHERE \"UserId\" = {0} )", userid)));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSmsApproval([FromBody] Predicate model)
        {
            // var dte = (model.ProvidedString);
            var fromdte = (model.ProvidedString.Split("?")[0]);
            var todte = (model.ProvidedString.Split("?")[1]);
            return Ok(db.MessageApproval.FromSql(String.Format("select * from \"Message\".\"VWSmsApproval\" where \"QuedDate\"::Date between '{0}' and '{1}'", fromdte, todte)));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSmsDeliveryReport([FromBody] Predicate model)
        {
            var dte = (model.ProvidedString);
            return Ok(db.MessageDelivery.FromSql(String.Format(@"select * from ""Message"".""GetSmsDeliveryReport""('{0}',{1})", dte, DomainContext.User.UserId)));

        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSmsReport([FromBody] Predicate model)
        {
            var fromdte = (model.ProvidedString.Split("?")[0]);
            var todte = (model.ProvidedString.Split("?")[1]);
            return Ok(db.MessageApprovalEx1.FromSql(String.Format(@"select * from ""Message"".""GetSmsSummaryReport""('{0}',{1},'{2}')", fromdte, DomainContext.User.UserId, todte)));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationReport([FromBody] Predicate model)
        {
            // var dte = (model.ProvidedString);
            var fromdte = (model.ProvidedString.Split("?")[0]);
            var todte = (model.ProvidedString.Split("?")[1]);
            // var userid = Convert.ToInt32(model.ProvidedString);

            return Ok(db.NotificationReportEx.FromSql(String.Format(@"select * from ""Message"".""GetNotificationDeliveryReport""('{0}','{1}','{2}')", DomainContext.User.UserId, fromdte, todte)));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SendTemplateMsg([FromBody] Predicate predicate)
        {
            Guid g1 = Guid.Empty;
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var templateid = new Guid(predicate.ProvidedString.Split("?")[4]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[5]);
            var sectioncourseId = new Guid(predicate.ProvidedString.Split("?")[6]);
            string query = "";
            if (sectioncourseId == g1)
            {
                query = String.Format(@"SELECT * FROM ""Message"".""BulkMessage""('{0}','{1}','{2}','{3}','{4}',{5})", sessionid, campusId, programDetailId, classId, templateid, userid);


            }

            else
            {
                query = String.Format(@"SELECT * FROM ""Message"".""BulkMessage""('{0}','{1}','{2}','{3}','{4}',{5},'{6}')", sessionid, campusId, programDetailId, classId, templateid, userid, sectioncourseId);


            }


            // Console.WriteLine(query);
            //this.db.Database.ExecuteSqlCommand(query);
            return Ok(this.db.Database.ExecuteSqlCommand(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SendMsgWithoutTemplate([FromBody] Predicate predicate)
        {
            Guid g1 = Guid.Empty;
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var msg = predicate.ProvidedString.Split("?")[4];
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[5]);
            var sectioncourseId = new Guid(predicate.ProvidedString.Split("?")[6]);
            string query = "";

            if (sectioncourseId == g1)
            {
                query = String.Format(@"SELECT * FROM ""Message"".""BulkMessageWithoutTemplate""('{0}','{1}','{2}','{3}','{4}',{5})", sessionid, campusId, programDetailId, classId, msg, userid);


            }

            else
            {
                query = String.Format(@"SELECT * FROM ""Message"".""BulkMessageWithoutTemplate""('{0}','{1}','{2}','{3}','{4}',{5},'{6}')", sessionid, campusId, programDetailId, classId, msg, userid, sectioncourseId);


            }

            // Console.WriteLine(query);
            //this.db.Database.ExecuteSqlCommand(query);
            return Ok(this.db.Database.ExecuteSqlCommand(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BulkNotification([FromBody] Predicate predicate)
        {
            var Data = this.log.GetLog();
            var pstring = predicate.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);
            var msg = predicate.ProvidedString.Split("?")[2];

            var query = String.Format(@"SELECT * FROM ""Message"".""BulkInsertNotification""('{0}','{1}','{2}','{3}')", pstring, userid, msg, Data);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);


        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult BulkNotificationSelection([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            var Data = this.log.GetLog();
            var pstring = predicate.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);
            var msg = predicate.ProvidedString.Split("?")[2];
            string query = String.Format("select   \"Message\".\"BulkInsertNotificationSelection\"('{0}','{1}','{2}','{3}') as \"ProvidedString\"", pstring, userid, msg, Data);

            Console.WriteLine(query);
            IDbConnection connection = db.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ProvidedString = connection.Query<Predicate>(query).FirstOrDefault().ProvidedString;

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj.ProvidedString);


        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult BulkNotificationSelectionList([FromBody] Predicate predicate)
        {

            var fromdate = (predicate.ProvidedString.Split("?")[0]);
            var todate = (predicate.ProvidedString.Split("?")[1]);

            var query = String.Format(@"SELECT * FROM ""Message"".""GetNotificationlist""('{0}','{1}','{2}')", DomainContext.User.UserId, fromdate, todate);
            return Ok(db.BulkNotificationList.FromSql(query));



        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult BulkNotificationSelectionEx([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            var Data = this.log.GetLog();
            var pstring = predicate.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);
            var msg = predicate.ProvidedString.Split("?")[2];
            string query = String.Format("select   \"Message\".\"BulkInsertNotificationSelectionEx\"('{0}','{1}','{2}','{3}') as \"ProvidedString\"", pstring, userid, msg, Data);


            IDbConnection connection = db.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ProvidedString = connection.Query<Predicate>(query).FirstOrDefault().ProvidedString;

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj.ProvidedString);


        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult BulkUpdateNotificationSelection([FromBody] Predicate predicate)
        {
            //    82bfbcb8-419d-487f-8dc6-8bf201c07bc0?
            //      there is testing 5 NNNN?
            //      undefined?
            //      2020/09/14?1814

            var id = predicate.ProvidedString.Split("?")[0];
            var Data = this.log.GetLog();
            var pstring = predicate.ProvidedString.Split("?")[1];
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[2]);


            var query = String.Format(@"SELECT * FROM ""Message"".""BulkUpdateNotificationSelection""('{0}','{1}','{2}','{3}')", id, pstring, userid, Data);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationSelection([FromBody] Predicate predicate)
        {
            var dte = (predicate.ProvidedString);
            return Ok(db.BulkNotificationModel.FromSql(String.Format("select char_length (\"MessageText\")CharCount,TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') AS qDate,(select \"Username\" from \"Role\".\"User\" where \"User\".\"UserId\"=\"BulkNotification\".\"UserId\")AS UserName,* from \"Message\".\"BulkNotification\" where \"Status\"=0 and \"ApprovalStatus\"=0 and TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') = '{0}'", dte)));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationSelectionEx([FromBody] Predicate predicate)
        {
            var fromdate = (predicate.ProvidedString.Split("?")[0]);
            var todate = (predicate.ProvidedString.Split("?")[1]);
            this.db.Database.SetCommandTimeout(100);
            var data = String.Format("select (\"Operation\"->>'image') as \"Url\",(select \"GetSubCityName\"   from  \"Message\".\"GetSubCityName\"(\"BulkNotification\".\"BulkNotificationId\")) as \"SubCity\",(\"Operation\"->>'title') as \"Title\", (select \"NotificationCount\" from \"Message\".\"NotificationCount\"(\"BulkNotification\".\"BulkNotificationId\")),   char_length (\"MessageText\")CharCount,TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') AS qDate,(select \"Username\" from \"Role\".\"User\" where \"User\".\"UserId\"=\"BulkNotification\".\"UserId\")AS UserName,* from \"Message\".\"BulkNotification\" where \"Status\"=1 and \"ApprovalStatus\"=1 and TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') >= '{0}' and TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') <= '{1}'", fromdate, todate);
            Console.WriteLine(data);
            return Ok(db.BulkNotificationModelEx.FromSql(data));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult UnApproveNotification([FromBody] Predicate predicate)
        {
            var bulkNotificationId = new Guid(predicate.ProvidedString);
            return Ok(this.db.Database.ExecuteSqlCommand($"update \"Message\".\"BulkNotification\" set \"ApprovalStatus\"=2 where \"BulkNotificationId\"={bulkNotificationId}"));
            //this.db.BulkNotificationModel.Update(predicate);
            //return Ok(this.db.SaveChanges());
            // return Ok(db.BulkNotificationModelEx.FromSql(String.Format("select (\"Operation\"->>'image') as \"Url\",(select \"GetSubCityName\"   from  \"Message\".\"GetSubCityName\"(\"BulkNotification\".\"BulkNotificationId\")) as \"SubCity\",(\"Operation\"->>'title') as \"Title\", (select \"NotificationCount\" from \"Message\".\"NotificationCount\"(\"BulkNotification\".\"BulkNotificationId\")),   char_length (\"MessageText\")CharCount,TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') AS qDate,(select \"Username\" from \"Role\".\"User\" where \"User\".\"UserId\"=\"BulkNotification\".\"UserId\")AS UserName,* from \"Message\".\"BulkNotification\" where \"Status\"=0 and \"ApprovalStatus\"=0 and TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') = '{0}'", dte)));

        }

        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public IActionResult Hello([FromBody] Predicate predicate)
        {
            var bulkNotificationId = new Guid(predicate.ProvidedString);
            this.db.Remove(new BulkNotificationModel { BulkNotificationId = bulkNotificationId });
            return Ok(this.db.SaveChanges());
            //this.db.BulkNotificationModel.Update(predicate);
            //return Ok(this.db.SaveChanges());
            // return Ok(db.BulkNotificationModelEx.FromSql(String.Format("select (\"Operation\"->>'image') as \"Url\",(select \"GetSubCityName\"   from  \"Message\".\"GetSubCityName\"(\"BulkNotification\".\"BulkNotificationId\")) as \"SubCity\",(\"Operation\"->>'title') as \"Title\", (select \"NotificationCount\" from \"Message\".\"NotificationCount\"(\"BulkNotification\".\"BulkNotificationId\")),   char_length (\"MessageText\")CharCount,TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') AS qDate,(select \"Username\" from \"Role\".\"User\" where \"User\".\"UserId\"=\"BulkNotification\".\"UserId\")AS UserName,* from \"Message\".\"BulkNotification\" where \"Status\"=0 and \"ApprovalStatus\"=0 and TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') = '{0}'", dte)));

        }
        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public IActionResult HelloU([FromBody] Predicate predicate)
        {
            var bulkNotificationId = new Guid(predicate.ProvidedString);
            var model = new BulkNotificationModel { BulkNotificationId = bulkNotificationId, MessageText = "Wow" };
            this.db.Attach(model).Property(x => x.MessageText).IsModified = true;
            return Ok(this.db.SaveChanges());
            //this.db.BulkNotificationModel.Update(predicate);
            //return Ok(this.db.SaveChanges());
            // return Ok(db.BulkNotificationModelEx.FromSql(String.Format("select (\"Operation\"->>'image') as \"Url\",(select \"GetSubCityName\"   from  \"Message\".\"GetSubCityName\"(\"BulkNotification\".\"BulkNotificationId\")) as \"SubCity\",(\"Operation\"->>'title') as \"Title\", (select \"NotificationCount\" from \"Message\".\"NotificationCount\"(\"BulkNotification\".\"BulkNotificationId\")),   char_length (\"MessageText\")CharCount,TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') AS qDate,(select \"Username\" from \"Role\".\"User\" where \"User\".\"UserId\"=\"BulkNotification\".\"UserId\")AS UserName,* from \"Message\".\"BulkNotification\" where \"Status\"=0 and \"ApprovalStatus\"=0 and TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') = '{0}'", dte)));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationSelectionSend([FromBody] Predicate predicate)
        {
            var id = (predicate.ProvidedString);
            return Ok(db.BulkNotificationModel.FromSql(String.Format("select TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') AS qDate,(select \"Username\" from \"Role\".\"User\" where \"User\".\"UserId\"=\"BulkNotification\".\"UserId\")AS UserName,* from \"Message\".\"BulkNotification\" where  \"BulkNotificationId\" = '{0}'", id)));

        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult NotificationSave([FromBody] Predicate predicate)
        // {


        //    var dte = (predicate.ProvidedString);
        //    return Ok(db.BulkNotificationModel.FromSql(String.Format("select * from \"Message\".\"BulkNotification\" where \"Status\"=0 and \"ApprovalStatus\"=0 and TO_CHAR(\"QuedDate\" :: DATE, 'yyyy-mm-dd') = '{0}'", dte)));

        // }
        [HttpPost]
        [Route("[action]")]
        public IActionResult NotificationSave([FromBody] Predicate model)
        {
            // 1bb29f7e-8ad6-4371-84f2-0c28efc6822f?test notification 1 test?test notification 1?2020/09/15?1814
            var id = new String(model.ProvidedString.Split("?")[0]);
            var messageText = new String(model.ProvidedString.Split("?")[1]);
            var msgold = new String(model.ProvidedString.Split("?")[2]);
            var dte = (model.ProvidedString.Split("?")[3]);
            var uid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var data = this.log.GetLog();
            var operation = model.ProvidedString.Split("?")[5];

            string json = String.Format("SELECT \"Message\".\"NotificationEdit\"('{0}','{1}','{2}','{3}',{4},'{5}','{6}')", id, messageText, msgold, dte, uid, data, operation);
            Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult UpLoadFileEx([FromBody] Predicate predicate)
        {
            var serverFilePath = (predicate.ProvidedString.Split("?")[0]);
            var localFilePath = (predicate.ProvidedString.Split("?")[1]);
            localFilePath = (localFilePath.Split("base64,")[1]);
            this.UpLoadFile(serverFilePath, localFilePath);


            return Ok("1");
        }



        public void UpLoadFile(String serverFilePath, string localFilePath)
        {
            String serverFullPath = "ftp://" + "172.23.1.20:21/Notification/" + serverFilePath;
            FtpWebRequest ftp = (FtpWebRequest)FtpWebRequest.Create(serverFullPath);
            ftp.Credentials = new NetworkCredential("emsuploads", "eWs@)pLd$");
            ftp.KeepAlive = true;
            ftp.Method = WebRequestMethods.Ftp.UploadFile;
            ftp.UseBinary = true;

            byte[] buffer = Convert.FromBase64String(localFilePath);
            Stream ftpStream = ftp.GetRequestStream();
            ftpStream.Write(buffer, 0, buffer.Length);
            ftpStream.Flush();
            ftpStream.Close();

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult NotificationApprove([FromBody] Predicate model)
        {
            var id = new String(model.ProvidedString.Split("?")[0]);
            var messageText = new String(model.ProvidedString.Split("?")[1]);
            var dte = (model.ProvidedString.Split("?")[2]);
            var uid = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            var data = this.log.GetLog();

            string json = String.Format("SELECT \"Message\".\"NotificationApproval\"('{0}','{1}','{2}',{3},'{4}')", id, messageText, dte, uid, data);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
            //     var query = String.Format(@"SELECT * FROM ""Message"".""BulkInsertNotification""('{0}','{1}','{2}','{3}')", pstring, userid, msg, Data);
            // //    "Message"."BulkInsertNotification"("providedstring" text, "userid" int4, "messagetext" text)

            //     // Console.WriteLine(query);
            //     //this.db.Database.ExecuteSqlCommand(query);
            //     return Ok(this.db.Database.ExecuteSqlCommand(query));
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsContactExx([FromBody] Predicate predicate)
        {
            var list = predicate.ProvidedString.Split("?")[0];
            var tempId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var smsapid = new Guid(predicate.ProvidedString.Split("?")[2]);
            // var query = String.Format (@"SELECT * FROM ""Message"".""SendToOutsider""('{0}','{1}')", JsonConvert.SerializeObject(list), tempId);
            // Console.WriteLine (query);
            // return Ok (this.db.Database.ExecuteSqlCommand (query));

            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format("SELECT \"Message\".\"SendToPunjabianEx\"('{0}','{1}','{2}') as val", list, tempId, smsapid);

            // var count= db.IntModel.FromSql(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var count = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(count);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsContact([FromBody] Predicate predicate)
        {
            var list = predicate.ProvidedString.Split("?")[0];
            var tempId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var query = String.Format(@"SELECT * FROM ""Message"".""SendToPunjabian""('{0}','{1}')", list, tempId);
            Console.WriteLine(query);
            return Ok(this.db.Database.ExecuteSqlCommand(query));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsContactEx([FromBody] Predicate predicate)
        {
            var list = predicate.ProvidedString.Split("?")[0];
            var tempId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var smsapid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var z = DomainContext.User.UserId;
            var Data = this.log.GetLog();

            // var query = String.Format (@"SELECT * FROM ""Message"".""SendToOutsider""('{0}','{1}')", JsonConvert.SerializeObject(list), tempId);
            // Console.WriteLine (query);
            // return Ok (this.db.Database.ExecuteSqlCommand (query));

            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format("SELECT \"Message\".\"SendToOutsider\"('{0}','{1}','{2}',{3},'{4}') as val", list, tempId, smsapid, z, Data);

            // var count= db.IntModel.FromSql(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var count = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(count);

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SendResetMessage([FromBody] Predicate predicate)
        {
            var destination = (predicate.ProvidedString.Split("?")[0]);
            // var message = ("Dear Student, Thank you for contacting CMS Helpline. As per your request the new password of your Microsoft account is : " + (predicate.ProvidedString.Split("?")[1]));
            var message = (predicate.ProvidedString.Split("?")[1]);
            var smsapid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var mask = (predicate.ProvidedString.Split("?")[3]);


            this.SendSms(destination, mask, message);

            IDbConnection connection = db.Database.GetDbConnection();

            var insertdata = String.Format(@"SELECT * FROM ""Message"".""InsertSms""('{0}','{1}','{2}')", destination, message, smsapid);

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var count = connection.Query<IntModel>(insertdata).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok("1");
        }

        private static string PropegateConnectionZong
        {
            get { return "?loginPassword=TowerTech@24&loginid=923184346316&Destination=@NUMBER&Mask=@MASK&Message=@TEXT&Unicode=@UNICODE&ShortCodePrefered=n"; }
        }

        public void SendSms(string destination, string mask, string message)

        {

            if (mask == "CMS")
            {
                var queryParams = PropegateConnectionZong
                                .Replace("@NUMBER", "92" + destination.Substring(1))
                                .Replace("@MASK", mask)
                                .Replace("@UNICODE", "0")
                                .Replace("@TEXT", message);

                string url = "http://cbs.zong.com.pk/reachrestapi/home/SendQuickSMS";

                using (HttpClient client = new HttpClient())
                {
                    // Set the base address and add the query parameters
                    client.BaseAddress = new Uri(url);
                    HttpResponseMessage response = client.PostAsync(queryParams, null).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response
                        string result = response.Content.ReadAsStringAsync().Result;

                    }

                }
            }
            else
            {
                WebRequest request = WebRequest.Create(string.Format("http://173.45.125.162:8888/push-url/?to={0}&from={1}&unicode=0&text={2}&user=tower&pwd=tower@pc_987&op=network", destination.Substring(1), mask, message));

                WebResponse response = request.GetResponseAsync().Result;

                Console.WriteLine("Sms response ------------" + response);
            }
        }


        // public void SendSms(string destination, string mask, string message)

        // {

        //     WebRequest request = WebRequest.Create(string.Format("http://173.45.125.162:8888/push-url/?to={0}&from={1}&unicode=0&text={2}&user=tower&pwd=tower@pc_987&op=network", destination.Substring(1), mask, message));

        //     WebResponse response = request.GetResponseAsync().Result;

        //     Console.WriteLine("Sms response ------------" + response);

        // }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SendMessageTest([FromBody] Predicate predicate)
        {
            var destination = (predicate.ProvidedString.Split("?")[0]);
            var mask = (predicate.ProvidedString.Split("?")[1]);
            var message = (predicate.ProvidedString.Split("?")[2]);
            WebRequest request = WebRequest.Create(string.Format("http://173.45.125.162:8888/push-url/?to={0}&from={1}&unicode=0&text={2}&user=tower&pwd=tower@pc_987&op=network", destination.Substring(1), mask, message));
            WebResponse response = request.GetResponseAsync().Result;
            Console.WriteLine("Sms response ------------" + response);
            return Ok("1");
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult ssatStudentData([FromBody] Predicate predicate)
        {
            var cityid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var date = predicate.ProvidedString.Split("?")[1];

            string query = String.Format("select * from  \"StepAssesment\".\"SSATDataRequired\"('{0}','{1}')", cityid, date);

            return Ok(this.db.SSATDataRequired.FromSql(query));

        }

    }
}