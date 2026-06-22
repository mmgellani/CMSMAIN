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
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server;
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
using MailKit.Net.Smtp;
using MimeKit;
using Hangfire;
using Hangfire.MemoryStorage;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AdmissionAdmissionFormController : Controller
    {

        public class RTV
        {
            public Int32 ReturnValue { get; set; }
        }
        public class RTV2
        {
            public string ReturnValue { get; set; }
        }
        private readonly IAdmissionAdmissionFormRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        private DbContextBase dbc;
        private IEmailService email;

        public AdmissionAdmissionFormController(IAdmissionAdmissionFormRepository repository, DbContextBase db, IUserLogService log, IEmailService email)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;
            this.email = email;

        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            try
            {
                return Ok(this.db.AdmissionAdmissionFormVM.Where(s => s.StatusId == 1));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll CONTROLLER.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetStudentAdmitData()
        {

            return Ok(this.db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  where \"StatusId\"= 1")));

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetMarks()
        {

            return Ok(this.db.MarksData.FromSql(String.Format("select * from \"Setup\".\"TotalMarks\" ")));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);

                // return Ok(this.db.AdmissionFormCplVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2));
                return Ok(this.db.AdmissionFormCpl4VM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2).AsNoTracking());

            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GETALLVM CONTROLLER.GetAllVM()" + ex.Message;
                app.Time = DateTime.Now;
                // app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMByProgram([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var campusProgramid = new Guid(model.ProvidedString.Split("?")[2]);

                // return Ok(this.db.AdmissionFormCplVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2));
                return Ok(this.db.AdmissionFormCpl4VM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.CampusProgramId == campusProgramid && s.StatusId != 2));

            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GETALLVM CONTROLLER.GetAllVM()" + ex.Message;
                app.Time = DateTime.Now;
                // app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMBySelectedProgram([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);

                // return Ok(this.db.AdmissionFormCplVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2));
                return Ok(this.db.AdmissionFormCpl4VMWithProgramId.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramId == programid && s.StatusId != 2));

            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GETALLVM CONTROLLER.GetAllVM()" + ex.Message;
                app.Time = DateTime.Now;
                // app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetStudentPromoted([FromBody] Predicate model)

        {
            var searchparam = (model.ProvidedString);

            string json = String.Format(@"select * from ""Admission"".""getStudentsDetailPromoted""('{0}')", searchparam);

            Console.WriteLine(json);
            return Ok(this.db.AdmissionFormPromtedFrom.FromSql(json));
        }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult GetDpData ([FromBody] Predicate model) {
        //     try {
        //         var campusprogramid = new Guid (model.ProvidedString.Split ("?") [0]);

        //         // return Ok(this.db.AdmissionFormCplVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2));
        //         return Ok (this.db.AdmissionFormCpl4VM.Where (s => s.CampusProgramId == campusprogramid));

        //     } catch (Exception ex) {
        //         AppException app = new AppException ();
        //         app.Message = "ERROR IN GetDpData CONTROLLER.GetDpData()" + ex.Message;
        //         app.Time = DateTime.Now;
        //         // app.Data = JsonConvert.SerializeObject(model);
        //         this.db.Add (app);
        //         this.db.SaveChangesAsync ();
        //         return BadRequest (app.Message);
        //     }
        // }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetDpData([FromBody] Predicate model)

        {
            var campusprogramid = new Guid(model.ProvidedString);

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetDelStd""('{0}')", campusprogramid);

            // Console.WriteLine(json);
            return Ok(this.db.DuplicateAdmission.FromSql(json));
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetPreData([FromBody] Predicate model)

        {
            var fromdate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[0]));
            var todate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[1]));

            string json = String.Format(@"select * from ""Dashboard"".""PreAdmission""('{0}','{1}')", fromdate, todate);

            // Console.WriteLine(json);
            return Ok(this.db.PreDashoboard.FromSql(json));
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetElStudent([FromBody] Predicate model)

        {
            var campusprogramid = new Guid(model.ProvidedString);

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetElStudent""('{0}')", campusprogramid);

            // Console.WriteLine(json);
            return Ok(this.db.ElMigrationVM.FromSql(json));
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetElStudentEx([FromBody] Predicate model)

        {
            var campusprogramid = new Guid(model.ProvidedString);

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetElStudentEx""('{0}')", campusprogramid);

            // Console.WriteLine(json);
            return Ok(this.db.ElMigrationVM.FromSql(json));
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetKinshipStudent([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            string json = String.Format(@"select * from ""OnlineAdmission"".""GetKinshipStudent""('{0}','{1}')", sessionid, campusid);

            // Console.WriteLine(json);
            return Ok(this.db.KinshipStudent.FromSql(json));
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetConcessStudent([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetConcessStudent""('{0}','{1}')", sessionid, campusid);

            // Console.WriteLine(json);
            return Ok(this.db.KinshipStudent.FromSql(json));
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetConcessKinsStudent([FromBody] Predicate model)

        {
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderId = new Guid(model.ProvidedString.Split("?")[1]);
            var fromper = Convert.ToDouble(model.ProvidedString.Split("?")[2]);
            var toper = Convert.ToDouble(model.ProvidedString.Split("?")[3]);

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetConcessKinStudent""('{0}','{1}',{2},{3})", campusprogramid, genderId, fromper, toper);

            // Console.WriteLine(json);
            return Ok(this.db.ConcessKinBulkEx.FromSql(json));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetKinshipConcession([FromBody] Predicate model)

        {
            var campusprogramid = new Guid(model.ProvidedString);

            string json = String.Format(@"select * from ""Fee"".""GetKinshipConcession""('{0}')", campusprogramid);

            // Console.WriteLine(json);
            return Ok(this.db.KinshipConcession.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcession([FromBody] Predicate model)

        {
            var campusprogramid = new Guid(model.ProvidedString);

            string json = String.Format(@"select * from ""Fee"".""GetConcession""('{0}')", campusprogramid);

            // Console.WriteLine(json);
            return Ok(this.db.KinshipConcession.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionBulkList([FromBody] Predicate model)
        {
            var campusprogramid = new Guid(model.ProvidedString);

            string json = String.Format(@"select * from ""Fee"".""GetConcessionBulkList""('{0}')", campusprogramid);

            // Console.WriteLine(json);
            return Ok(this.db.KinshipConcession.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertBulkConcess([FromBody] Predicate predicate)
        {
            var obj = new RTV2() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var scholarshipid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var log = this.log.GetLog();
            string json = string.Format("SELECT \"Admission\".\"InsertBulkConcession\"('{0}','{1}','{2}') as \"ReturnValue\" ", list, scholarshipid, log);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV2>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);


        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetApprovalStudent([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetApprovalStudent""('{0}','{1}')", sessionid, campusid);

            // Console.WriteLine(json);
            return Ok(this.db.OnlineApprovalStudent.FromSql(json));
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetAdmissionStatus([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetStatusCount""('{0}','{1}')", sessionid, campusid);

            // Console.WriteLine(json);
            return Ok(this.db.AdmissionStatus.FromSql(json));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult InsertApprovalStudent([FromBody] Predicate predicate)
        // {
        //     try
        //     {
        //         var list = (predicate.ProvidedString);
        //         // Console.WriteLine(String.Format("select * from \"OnlineAdmission\".\"InsertApprovalStudent\" ('{0}') as val", list));
        //         var z = this.db.IntModel.FromSql(String.Format("select * from \"OnlineAdmission\".\"InsertApprovalStudent\" ('{0}') as val", list));
        //         return Ok(z);
        //     }
        //     catch (Exception ex)
        //     {
        //         AppException app = new AppException();
        //         app.Message = "ERROR IN FEE EXEMPTION Controller.InsertApprovalStudent()" + ex.Message;
        //         app.Time = DateTime.Now;
        //         app.Data = predicate.ProvidedString;
        //         this.db.Add(app.Message);
        //         this.db.SaveChanges();
        //         return BadRequest(app.Message);

        //     }

        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertApprovalStudent([FromBody] Predicate predicate)
        {
            //     IDbTransaction transaction = null;
            string json = "";
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var list = (predicate.ProvidedString);
                // List<OnlineApprovalStudent> videogames = JsonConvert.DeserializeObject<List<OnlineApprovalStudent>>(list);

                // // Console.WriteLine(videogames);
                var log = this.log.GetLog();
                //string json=String.Format("SELECT \"Admission\".\"AddAdmissionFormTest\"('{0}','{1}')",predicate.ProvidedString,Data);
                json = String.Format("SELECT * From \"OnlineAdmission\".\"InsertApprovalStudent\"('{0}','{1}')", list, log);
                // Console.WriteLine(json);
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                    //   transaction =  connection.BeginTransaction(IsolationLevel.Serializable);

                    AcceptanceResponse[] obj = connection.Query<AcceptanceResponse>(json).ToArray<AcceptanceResponse>();

                    foreach (var opt in obj)
                    {

                        BackgroundJob.Enqueue(() => this.SendEamilJK(opt));

                    }

                    // var con = connection.Execute(json);

                    // transaction.Commit();
                    connection.Close();
                    connection.Dispose();
                    return Ok("Data Saved");
                }

                return Ok("Connection lost Please Click Save Button Again");
            }
            catch (Exception ex)
            {

                //  transaction.Rollback();
                AppException app = new AppException();
                app.Message = "ERROR IN ADMISSION FORM CONTROLLER.InsertApprovalStudent()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest("Please Hit Save Button Again ! Form Saving in Progress");
            }

        }

        public void SendEamilJK(AcceptanceResponse opt)
        {

            // foreach (var opt in obj)
            // {
            var messageEx = "<!DOCTYPE html    PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"https://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\"    xmlns:o=\"urn:schemas-microsoft-com:office:office\"><head>    <title>CMS EMAIL</title>    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">    <meta name=\"format-detection\" content=\"telephone=no\">    <style type=\"text/css\">        * {            margin: 0;            font-family: Arial, Helvetica, sans-serif;        }        body {            margin: 0 !important;            padding: 0 !important;            -webkit-text-size-adjust: 100% !important;            -ms-text-size-adjust: 100% !important;            -webkit-font-smoothing: antialiased !important;        }        .em_body {            width: 100%;            height: auto;            background-color: #fafafa;        }        .logo-img {            padding: 20px;        }        .side-img {            height: 90vh;        }        .content {            padding: 0 28px 0 40px;            font-size: 12px;        }        table {            width: 100%;            border-collapse: collapse;        }        .em_main_table {            width: 100%;        }        @media only screen and (min-width:480px) and (max-width:699px) {            .em_main_table {                width: 90% !important;            }        }    </style></head><body class=\"em_body\">    <table  border=\"0\" cellpadding=\"0\" cellspacing=\"0\">        <tr>            <td style=\"max-height:100%;\">                <img src=\"https://onlineadmissions.cms.edu.pk/logocms.png\" class=\"logo-img\" width=\"150px\">                <table class=\"em_main_table\"  border=\"0\" cellpadding=\"0\" cellspacing=\"0\">                    <tr>                        <td class=\"content\">                            <!-- <h3 style=\"margin-bottom: 0; color: #fff; padding: 0 20px 0 0; margin-bottom: 15px;\">                                Thank you for                                Registering</h3> -->                            <div style=\"margin-bottom: 14px;\">                                <span style=\"color: #fff;\"> Dear</span>                                <h3 style=\"display: inline-block; color: #fff;\">" + opt.FullName + "</h3>,                            </div>                            <p style=\"color: #fff; word-wrap: break-word;padding: 0 20px 0 0; margin:14px 0;\">                                After careful review of your application and all supporting documents, we are pleased to inform you of your acceptance at Campus Management.</p>                            <p style=\"color: #fff; word-wrap: break-word; padding: 0 20px 0 0; margin-bottom: 14px;\">                                We hereby confirm your application to the program. You can now pay your fee online <a style=\"color:#e13b28 !important; font-weight: 600;\" href=\"pay.cms.edu\">pay online</a> or at any designated bank branch near you. The admissions office will contact you with your program calendar and fee details.</p> <p style=\"color: #fff; word-wrap: break-word; padding: 0 20px 0 0; margin-bottom: 14px;\"> In case you need help at any point, please call our helpline at 0800-78608 (8 a.m to 8 p.m) for assistance.</p>                           <h3 style=\"color: #fff;margin:15px 0;\">Congratulations & Good Luck!</h3>                            <h3 style=\"color: #fff; margin-bottom:0;\">Admissions office</h3>                            <h3 style=\"color: #fff; margin: 0;\">Campus Management</h3>                        </td>                    </tr>                </table>            </td>            <td width=10% style=\"vertical-align: top;\" style=\"max-height:100%; width:10%;\">                <img src=\"https://onlineadmissions.cms.edu.pk/mainbg.png\" class=\"side-img\">            </td>        </tr>        <tr>            <td colspan=\"2\">                <a href=\"https://www.youtube.com/watch?v=AxlPvTwlroY\">                    <img src=\"https://onlineadmissions.cms.edu.pk/emailpost.png\" style=\"width:100%\" alt=\"\">                </a>            </td>        </tr>        <tr>            <td colspan=\"2\">                <div style=\"padding: 1em 0;                      background: #fff;\">                    <ul style=\" margin: 0; padding: 0; list-style-type: none; text-align: center;\">                        <li style=\" display: inline-block; margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <a href=\"https://www.facebook.com/CMSWorld\"><img style=\" width: 30px; height: 30px;\"                                        src=\"https://onlineadmissions.cms.edu.pk/ic_facebook.png\" alt=\"\"></a>                                <a href=\"https://www.twitter.com/CMSWorld\"><img style=\" width: 30px;                     height: 30px;\" src=\"https://onlineadmissions.cms.edu.pk/ic_twitter.png\" alt=\"\"></a>                                <a href=\"https://www.instagram.com/CMSWorld\"><img style=\" width: 30px;                         height: 30px;\" src=\"https://onlineadmissions.cms.edu.pk/ic_insta.png\" alt=\"\"></a>                                <a href=\"https://www.youtube.com/CMSWorld\"><img style=\" width: 30px;                         height: 30px;\" src=\"https://onlineadmissions.cms.edu.pk/ic_youtube.png\" alt=\"\"></a>                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">/CMSWORLD</div>                        </li>                        <li style=\" display: inline-block;            margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <img src=\"https://admissions.cms.edu.pk/ic_call.png\" width=\"30\" alt=\"\">                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">0800-78608</div>                        </li>                        <li style=\" display: inline-block;            margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <img src=\"https://admissions.cms.edu.pk/ic_web.png\" width=\"30\" alt=\"\">                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">www.cms.edu                            </div>                        </li>                        <li style=\" display: inline-block;            margin: 0 1em;\">                            <div style=\"display: inline-block;\">                                <img src=\"https://admissions.cms.edu.pk/ic_address.png\" width=\"30\" alt=\"\">                            </div>                            <div style=\"display: inline-block; padding: 6px 0 0px 0;                vertical-align: top; color:#687281; font-weight: 500;\">123-C, Block E1, Hali Road Gulberg III, Lahore                            </div>                        </li>                    </ul>                </div>            </td>        </tr>    </table></body></html>";


            var message = this.email.GetMessageObjForAuthLoginEmailEx(opt.Email, messageEx);
            message.Subject = "Acceptance";
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


            // }

        }


        public void SendEamilSSATCampus(AcceptanceResponseSSAT opt)
        {
            var messageEx = "<!DOCTYPE html><html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'> <head> <meta charset='UTF-8' /> <meta name='viewport' content='width=device-width,initial-scale=1' /> <meta name='x-apple-disable-message-reformatting' /> <title></title> <!--[if mso]> <noscript> <xml> <o:OfficeDocumentSettings> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript> <![endif]--> <style> table, td, div, h1, p { font-family: Arial, sans-serif; }@media print {body {-webkit-print-color-adjust: exact;}} </style> </head> <body style='margin: 0; padding: 0'><style>@media print {body {-webkit-print-color-adjust: exact;}}</style> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff; ' > <tr> <td align='center' style='padding: 0'> <table role='presentation' style=' width: 602px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left; ' > <tr> <td align='center' style='padding: 20px 0 20px 0; background: #2f3185' > <img src='https://ssat.step.cms.edu/Image/step_logo.png' alt='' width='200' style='height: auto; display: block' /> </td> </tr> <tr> <td style='padding: 36px 30px 42px 30px'> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; ' > <tr> <td style='padding: 0 0 16px 0; color: #153643'> <h1 style=' font-size: 24px; margin: 0 0 20px 0; font-family: Arial, sans-serif; ' > Dear, " + opt.FullName + " </h1> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > Thanks for registering for STEP SSAT ’23. Following are your test details </p> </td> </tr> <tr> <td> <table> <tbody> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Ref. #: </p> </td> <td style='padding: 0 0 0px 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>" + opt.RefferenceNo + "</b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Program: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>" + opt.programdetail + "</b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Date: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>March 19th, 2023. </b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Reporting Time: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>11:00 AM </b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 12px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Test Time: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>12:00 PM to 02:00 PM </b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Location: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 400px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>" + opt.TestCity + " </b></p> </td> </tr> </tbody> </table> </td> </tr> <tr> <td style='padding: 0 0 20px 0; color: #153643'> <p><b>Good luck!</b></p> <p style=' margin: 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > For more information regarding SSAT pattern, instructions and more,  <a href='https://step.cms.edu/blog/step-self-assessment-test-2023/' style='color: #2f3185; text-decoration: underline' >Click here!</a > </p> </td> </tr> <tr> <td style='padding: 0'> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; ' > <tr> <td style=' width: 260px; padding: 0; vertical-align: top; color: #153643;  ' > <p style=' margin: 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > Regards, </p> </td> </tr>  <tr> <td style=' width: 260px; padding: 0; vertical-align: top; color: #153643; ' > <p style=' margin: 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > STEP SSAT Team </p> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td style='padding: 30px; background: #e10f1b'> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; font-size: 9px; font-family: Arial, sans-serif; ' > <tr> <td style='padding: 0; width: 50%' align='left'> <p style=' margin: 0; font-size: 14px; line-height: 16px; font-family: Arial, sans-serif; color: #ffffff; ' > &reg; step@cms.edu<br /> </p> </td> <td style='padding: 0; width: 50%' align='right'> <table role='presentation' style=' border-collapse: collapse; border: 0; border-spacing: 0; ' > <tr> <td style='padding: 0 0 0 10px; width: 38px'> <a href='https://www.twitter.com/stepbycms' style='color: #ffffff' ><img src='https://assets.codepen.io/210284/tw_1.png' alt='Twitter' width='38' style='height: auto; display: block; border: 0' /></a> </td> <td style='padding: 0 0 0 10px; width: 38px'> <a href='https://www.facebook.com/stepbycms' style='color: #ffffff' ><img src='https://assets.codepen.io/210284/fb_1.png' alt='Facebook' width='38' style='height: auto; display: block; border: 0' /></a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </body></html>";


            var message = this.email.GetMessageObjForAuthLoginEmailStep(opt.Email, messageEx);
            message.Subject = "SSAT Registration Acknowledgement";
            message.Body = new TextPart("html")
            {
                Text = messageEx
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("admissions@step.cms.edu.pk", "P@kist0n123");
                client.Send(message);
                client.Disconnect(true);
            }
        }
        public void SendEamilSSATOnline(AcceptanceResponseSSAT opt)
        {
            var messageEx = "<!DOCTYPE html><html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'> <head> <meta charset='UTF-8' /> <meta name='viewport' content='width=device-width,initial-scale=1' /> <meta name='x-apple-disable-message-reformatting' /> <title></title> <!--[if mso]> <noscript> <xml> <o:OfficeDocumentSettings> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript> <![endif]--> <style> table, td, div, h1, p { font-family: Arial, sans-serif; } @media print {body {-webkit-print-color-adjust: exact;}}</style> </head> <body style='margin: 0; padding: 0'><style>@media print {body {-webkit-print-color-adjust: exact;}}</style> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff; ' > <tr> <td align='center' style='padding: 0'> <table role='presentation' style=' width: 602px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left; ' > <tr> <td align='center' style='padding: 20px 0 20px 0; background: #2f3185' > <img src='https://ssat.step.cms.edu/Image/step_logo.png' alt='' width='200' style='height: auto; display: block' /> </td> </tr> <tr> <td style='padding: 36px 30px 42px 30px'> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; ' > <tr> <td style='padding: 0 0 16px 0; color: #153643'> <h1 style=' font-size: 24px; margin: 0 0 20px 0; font-family: Arial, sans-serif; ' > Dear, " + opt.FullName + " </h1> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > Thanks for registering for STEP SSAT ’23. Following are your test details </p> </td> </tr> <tr> <td> <table> <tbody> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Ref. #: </p> </td> <td style='padding: 0 0 0px 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>" + opt.RefferenceNo + "</b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Program: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>" + opt.programdetail + "</b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Date: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>March 19th, 2023. </b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 12px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Test Time: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b>12:00 PM to 02:00 PM </b></p> </td> </tr> <tr> <td style='padding: 0 0 0px 0; color: #153643;width: 120px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' >Mode: </p> </td> <td style='padding: 0 0 0x 0; color: #153643;width: 300px'> <p style=' margin: 0 0 5px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' ><b> Online </b></p> </td> </tr> </tbody> </table> </td> </tr> <tr> <td style='padding: 0 0 20px 0; color: #153643'> <p style=' margin: 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > You will receive your username and password for SSAT Online Test within 2 working days. </p> </td> </tr> <tr> <td style='padding: 0 0 20px 0; color: #153643'> <p><b>Good luck!</b></p> <p style=' margin: 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > For more information regarding SSAT pattern, instructions and more ,<a href='https://step.cms.edu/blog/step-self-assessment-test-2023/' style='color: #2f3185; text-decoration: underline' >Click here!</a > </p> </td> </tr> <tr> <td style='padding: 0'> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; ' > <tr> <td style=' width: 260px; padding: 0; vertical-align: top; color: #153643;   ' > <p style=' margin: 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > Regards, </p> </td> </tr> <tr> <td style=' width: 260px; padding: 0; vertical-align: top; color: #153643; ' > <p style=' margin: 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; ' > STEP SSAT Team </p> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr> <td style='padding: 30px; background: #e10f1b'> <table role='presentation' style=' width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; font-size: 9px; font-family: Arial, sans-serif; ' > <tr> <td style='padding: 0; width: 50%' align='left'> <p style=' margin: 0; font-size: 14px; line-height: 16px; font-family: Arial, sans-serif; color: #ffffff; ' > &reg; step@cms.edu<br /> </p> </td> <td style='padding: 0; width: 50%' align='right'> <table role='presentation' style=' border-collapse: collapse; border: 0; border-spacing: 0; ' > <tr> <td style='padding: 0 0 0 10px; width: 38px'> <a href='https://www.twitter.com/stepbycms' style='color: #ffffff' ><img src='https://assets.codepen.io/210284/tw_1.png' alt='Twitter' width='38' style='height: auto; display: block; border: 0' /></a> </td> <td style='padding: 0 0 0 10px; width: 38px'> <a href='https://www.facebook.com/stepbycms' style='color: #ffffff' ><img src='https://assets.codepen.io/210284/fb_1.png' alt='Facebook' width='38' style='height: auto; display: block; border: 0' /></a> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </body></html>";


            var message = this.email.GetMessageObjForAuthLoginEmailStep(opt.Email, messageEx);
            message.Subject = "SSAT Registration Acknowledgement";
            message.Body = new TextPart("html")
            {
                Text = messageEx
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("admissions@step.cms.edu.pk", "P@kist0n123");
                client.Send(message);
                client.Disconnect(true);
            }
        }

        public void SendEamilSTEPAcademy(AcceptanceResponseSTEPAcademy opt)
        {
            var messageEx = "<!DOCTYPE html><html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><meta charset='UTF-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/><meta name='x-apple-disable-message-reformatting'/><title></title><!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]--><style>table, td, div, h1, p { font-family: Arial, sans-serif; }@media print {body {-webkit-print-color-adjust: exact;}}</style></head><body style='margin:0;padding:0'><style>@media print {body {-webkit-print-color-adjust: exact;}}</style><table role='presentation' style='width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#fff;'><tr><td align='center' style='padding:0'><table role='presentation' style='width:602px;border-collapse:collapse;border:1px solid #ccc;border-spacing:0;text-align:left;'><tr><td align='center' style='padding:20px 0 20px 0;background:#2f3185'> <img src='https://ssat.step.cms.edu/Image/step_logo.png' alt='' width='200' style='height:auto;display:block'/></td></tr><tr><td style='padding:36px 30px 42px 30px'><table role='presentation' style='width:100%;border-collapse:collapse;border:0;border-spacing:0;'><tr><td style='padding:0 0 16px 0;color:#153643'><h1 style='font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;'>Dear, " + opt.FullName + "</h1><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Thanks for registering for STEP PREP WHIZ Scholarship Test 2024. Following are your test details</p></td></tr><tr><td><table><tbody><tr><td style='padding:0;color:#153643;width:120px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Roll. #:</p></td><td style='padding:0;color:#153643;width:300px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'><b>" + opt.RefferenceNo + "</b></p></td></tr><tr><td style='padding:0;color:#153643;width:120px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Test:</p></td><td style='padding:0 0 0x 0;color:#153643;width:300px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'><b>" + opt.Test + "</b></p></td></tr><tr><td style='padding:0;color:#153643;width:120px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Test Syllabus:</p></td><td style='padding:0 0 0x 0;color:#153643;width:300px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'><b>" + opt.TestSyllabus + "</b></p></td></tr><tr><td style='padding:0;color:#153643;width:120px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Test Date:</p></td><td style='padding:0 0 0x 0;color:#153643;width:300px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'><b>" + opt.TestDate + "</b></p></td></tr><tr><td style='padding:0;color:#153643;width:120px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Reporting Time:</p></td><td style='padding:0 0 0x 0;color:#153643;width:300px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'><b>" + opt.ReportingTime + "</b></p></td></tr><tr><td style='padding:0;color:#153643;width:120px'><p style='margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Test Time:</p></td><td style='padding:0 0 0x 0;color:#153643;width:300px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'><b>" + opt.TestTime + "</b></p></td></tr><tr><td style='padding:0;color:#153643;width:120px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Location:</p></td><td style='padding:0 0 0x 0;color:#153643;width:400px'><p style='margin:0 0 5px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'><b>" + opt.Location + "</b></p></td></tr></tbody></table></td></tr><tr><td style='padding:0 0 20px 0;color:#153643'><p><b>Good luck!</b></p><p style='margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>For more information, <a href='https://step.cms.edu/evening-coaching' style='color:#2f3185;text-decoration:underline'>Click here!</a ></p></td></tr><tr><table  style='text-align:left;font-size:11px;'><tr><th></th><th>Instructions:</th></tr><tr><td style='padding-bottom:5px;'></td></tr><tr><td>1</td><td>Please present this roll number slip on the test day.</td></tr><tr><td>2</td><td>This test is completely free of cost.</td></tr><tr><td>3</td><td>Please bring a valid form of identification (e.g., student CNIC/B-Form Registration Slip etc.) along with your passport-size picture for entrance.</td></tr><tr><td>4</td><td>Standard calculators are allowed; however, scientific calculators are not allowed.</td></tr><tr><td>5</td><td>Use blue ballpoint only. Lead pencils and markers not allowed.</td></tr><tr><td>6</td><td>Completely fill the circle. Inappropriate filling will not be read by the optical mark reader.</td></tr><tr><td>7</td><td>Candidates are NOT allowed to carry any textual material, printed or written, bits of paper, envelopes, electronic devices, calculators, mobile devices, or any other aiding material inside the examination center.</td></tr><tr><td>8</td><td>The test day requires adherence to a proper dress code, and shorts are not permitted.</td></tr><tr><td>9</td><td>Answer-Key of the conducted test will be uploaded on the STEP PREP website.</td></tr></table></tr><tr><td style='padding:10px'><table role='presentation' style='width:100%;border-collapse:collapse;border:0;border-spacing:0;'><tr><td style='width:260px;padding:0;vertical-align:top;color:#153643;'><p style='margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>Regards,</p></td></tr><tr><td style='width:260px;padding:0;vertical-align:top;color:#153643;'><p style='margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>STEP PREP Team</p></td></tr></table></td></tr><td style='padding:30px;background:#e10f1b'></td></table></td></tr><tr></tr></table></td></tr></table></td></tr> </table></body></html>";

            var message = this.email.GetMessageObjForAuthLoginEmailStep(opt.Email, messageEx);
            message.Subject = "STEP PREP WHIZ Scholarship Test Registration";
            message.Body = new TextPart("html")
            {
                Text = messageEx
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("admissions@step.cms.edu.pk", "P@kist0n123");
                client.Send(message);
                client.Disconnect(true);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWProgramMult([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);

            string json = String.Format(@"select * from ""Dashboard"".""VWProgramMult""('{0}','{1}',{2})", sessionid, cityid, user);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWProgramDate([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);

            string json = String.Format(@"select * from ""Dashboard"".""VWProgramDate""('{0}','{1}',{2},'{3}','{4}')", sessionid, cityid, user, fromdate, todate);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWShiftDate([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);

            string json = String.Format(@"select * from ""Dashboard"".""VWShiftPie""('{0}','{1}',{2},'{3}','{4}')", sessionid, cityid, user, fromdate, todate);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWCityDate([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);

            string json = String.Format(@"select * from ""Dashboard"".""VWCityDate""('{0}','{1}',{2},'{3}','{4}')", sessionid, cityid, user, fromdate, todate);

            // Console.WriteLine(json);
            return Ok(this.db.CityMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWProgramDateEX([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);

            string json = String.Format(@"select * from ""Dashboard"".""VWProgramDate""('{0}','{1}',{2},'{3}','{4}','{5}')", sessionid, cityid, user, fromdate, todate, level);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWShiftDateEX([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);

            string json = String.Format(@"select * from ""Dashboard"".""VWShiftPie""('{0}','{1}',{2},'{3}','{4}','{5}')", sessionid, cityid, user, fromdate, todate, level);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWCityDateEX([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);

            string json = String.Format(@"select * from ""Dashboard"".""VWCityDate""('{0}','{1}',{2},'{3}','{4}','{5}')", sessionid, cityid, user, fromdate, todate, level);

            // Console.WriteLine(json);
            return Ok(this.db.CityMult.FromSql(json));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWProgramDateEXX([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programid = new Guid(model.ProvidedString.Split("?")[6]);

            string json = String.Format(@"select * from ""Dashboard"".""VWProgramDate""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", sessionid, cityid, user, fromdate, todate, level, programid);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWShiftDateEXX([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programid = new Guid(model.ProvidedString.Split("?")[6]);

            string json = String.Format(@"select * from ""Dashboard"".""VWShiftPie""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", sessionid, cityid, user, fromdate, todate, level, programid);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWProgramDatePgd([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programid = (model.ProvidedString.Split("?")[6]);

            string json = String.Format(@"select * from ""Dashboard"".""VWProgramDateEx""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", sessionid, cityid, user, fromdate, todate, level, programid);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWShiftDatePgd([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programid = (model.ProvidedString.Split("?")[6]);

            string json = String.Format(@"select * from ""Dashboard"".""VWShiftPie""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", sessionid, cityid, user, fromdate, todate, level, programid);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWCityDateEXX([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programid = new Guid(model.ProvidedString.Split("?")[6]);

            string json = String.Format(@"select * from ""Dashboard"".""VWCityDate""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", sessionid, cityid, user, fromdate, todate, level, programid);

            // Console.WriteLine(json);
            return Ok(this.db.CityMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWCityDatePgd([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new String(model.ProvidedString.Split("?")[1]);
            var user = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programid = (model.ProvidedString.Split("?")[6]);

            string json = String.Format(@"select * from ""Dashboard"".""VWCityDateEx""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", sessionid, cityid, user, fromdate, todate, level, programid);

            // Console.WriteLine(json);
            return Ok(this.db.CityMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWProgramSession([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var user = (model.ProvidedString.Split("?")[1]);
            var fromdate = (model.ProvidedString.Split("?")[2]);
            var todate = (model.ProvidedString.Split("?")[3]);

            string json = String.Format(@"select * from ""Dashboard"".""VWProgramDateEX""('{0}',{1},'{2}','{3}')", sessionid, user, fromdate, todate);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWShiftSession([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var user = (model.ProvidedString.Split("?")[1]);
            var fromdate = (model.ProvidedString.Split("?")[2]);
            var todate = (model.ProvidedString.Split("?")[3]);

            string json = String.Format(@"select * from ""Dashboard"".""VWShiftPie""('{0}',{1},'{2}','{3}')", sessionid, user, fromdate, todate);

            // Console.WriteLine(json);
            return Ok(this.db.ProgramMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWCitySession([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var user = (model.ProvidedString.Split("?")[1]);
            var fromdate = (model.ProvidedString.Split("?")[2]);
            var todate = (model.ProvidedString.Split("?")[3]);

            string json = String.Format(@"select * from ""Dashboard"".""VWCityDateEX2""('{0}',{1},'{2}','{3}')", sessionid, user, fromdate, todate);

            // Console.WriteLine(json);
            return Ok(this.db.CityMult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetVWCitySessionDrill([FromBody] Predicate model)

        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var user = (model.ProvidedString.Split("?")[1]);
            var fromdate = (model.ProvidedString.Split("?")[2]);
            var todate = (model.ProvidedString.Split("?")[3]);
            var cityName = (model.ProvidedString.Split("?")[4]);
            string json = String.Format(@"select * from ""Dashboard"".""VWCityDateEXDrill""('{0}',{1},'{2}','{3}','{4}')", sessionid, user, fromdate, todate, cityName);

            // Console.WriteLine(json);
            return Ok(this.db.CityMultDrill.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSessionWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString);

                return Ok(this.db.AdmissionFormCplVM.Where(s => s.SessionId == sessionid && s.StatusId != 2));

            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GETALLVM CONTROLLER.GetAllVM()" + ex.Message;
                app.Time = DateTime.Now;
                // app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentList([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var campusprogramid = new Guid(model.ProvidedString.Split("?")[2]);
                var classid = new Guid(model.ProvidedString.Split("?")[3]);
                string sql = String.Format(@"Select * from ""Admission"".""GetTransferStudent""('{0}','{1}','{2}','{3}')", sessionid, campusid, campusprogramid, classid);
                return Ok(this.db.TransferList.FromSql(sql));



            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetStudentList CONTROLLER.GetStudentList()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                return Ok(await this.repository.AllAsync());
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAllAsync CONTROLLER.GetAllAsync()" + ex.Message;
                app.Time = DateTime.Now;
                // app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(AdmissionAdmissionForm).Assembly);
                Expression<Func<AdmissionAdmissionForm, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionAdmissionForm, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.Single(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetSingle CONTROLLER.GetSingle()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(AdmissionAdmissionForm).Assembly);
                Expression<Func<AdmissionAdmissionForm, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionAdmissionForm, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.SingleAsync(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetSingleAsync CONTROLLER.GetSingleAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(AdmissionAdmissionForm).Assembly);
                Expression<Func<AdmissionAdmissionForm, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionAdmissionForm, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.FindBy(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetFindBy CONTROLLER.GetFindBy()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckStudentFeeisPaid([FromBody] Predicate model)

        {
            var studentcnic = new string(model.ProvidedString.Split("?")[0]);
            var sessionId = new Guid(model.ProvidedString.Split("?")[1]);
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[2]);
            var admisionformid = string.IsNullOrEmpty(model.ProvidedString.Split("?")[3]) ? Guid.NewGuid() : new Guid(model.ProvidedString.Split("?")[3]);

            string json = String.Format(@"select * from ""Admission"".""CheckStudentFeeisPaid""('{0}','{1}','{2}','{3}')", studentcnic, sessionId, campusprogramid, admisionformid);
            Console.WriteLine(json);
            return Ok(this.db.EnrolledStudentResultModel.FromSql(json));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckStudentExist([FromBody] Predicate model)

        {
            var studentcnic = new string(model.ProvidedString.Split("?")[0]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = string.IsNullOrEmpty(model.ProvidedString.Split("?")[2]) ? Guid.NewGuid() : new Guid(model.ProvidedString.Split("?")[2]);

            var sessionid = new Guid(model.ProvidedString.Split("?")[3]);

            string json = String.Format(@"select * from ""Admission"".""CheckStudentExistforEMS""('{0}','{1}','{2}','{3}')", studentcnic, programdetailid, campusid, sessionid);

            Console.WriteLine(json);
            return Ok(this.db.StudentResultModel.FromSql(json));
        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAdmissionFormData()
        {
            var admissionformdata = new AdmissionFormData()
            {
                AdmissionType = new List<SetupAdmissionType>(),
                Gender = new List<SetupGender>(),
                Religion = new List<SetupReligion>(),
                Degree = new List<SetupDegree>(),
                Group = new List<SetupGroup>(),
                TotalMarks = new List<MarksData>(),
                Board = new List<SetupBoard>(),
                PassStatus = new List<SetupPassStatus>(),
                BloodGroup = new List<SetupBloodGroup>()
            };

            admissionformdata.AdmissionType = db.SetupAdmissionType.FromSql(@"select * from ""Setup"".""AdmissionType""  where ""StatusId""=1").ToList();
            admissionformdata.Gender = db.SetupGender.FromSql(@"select * from ""Setup"".""Gender""  where ""StatusId""=1").ToList();
            admissionformdata.Religion = db.SetupReligion.FromSql(@"select * from ""Setup"".""Religion""  where ""StatusId""=1").ToList();
            admissionformdata.Degree = db.SetupDegree.FromSql(@"select * from ""Setup"".""Degree""  where ""StatusId""=1").ToList();
            admissionformdata.Group = db.SetupGroup.FromSql(@"select * from ""Setup"".""Group""  where ""StatusId""=1").ToList();
            admissionformdata.TotalMarks = db.MarksData.FromSql(@"select * from ""Setup"".""TotalMarks"" ").ToList();
            admissionformdata.Board = db.SetupBoard.FromSql(@"select * from ""Setup"".""Board""  where ""StatusId""=1").ToList();
            admissionformdata.PassStatus = db.SetupPassStatus.FromSql(@"select * from ""Setup"".""PassStatus""  where ""StatusId""=1").ToList();
            admissionformdata.BloodGroup = db.SetupBloodGroup.FromSql(@"select * from ""Setup"".""BloodGroup""  where ""StatusId""=1").ToList();

            return Ok(admissionformdata);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAdmissionWidgetData()
        {
            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(@"select count(""AdmissionFormId"") AS ""AdmissionCount"" from ""public"".""VWAdmissionCity""  where ""StatusId""= 1").ToList();
            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(@"select count(""PaidChallanCount"") AS ""PaidChallanCount"" from ""public"".""VWFeeCityEx"" ").ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select count(""EnrollmentId"") AS ""EnrollmentCount"" from ""public"".""VWEnrollCity""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionDateWise([FromBody] Predicate model)
        {

            var date = Convert.ToDateTime(model.ProvidedString);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select count(\"AdmissionFormId\") AS \"AdmissionCount\" from \"public\".\"VWAdmissionCity\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"StudentChallanId\") AS \"PaidChallanCount\" from \"public\".\"VWFeeCity\"  where \"PaidDate\" = '{0}' and \"StatusId\"= 1", date)).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select count(""EnrollmentId"") AS ""EnrollmentCount"" from ""public"".""VWEnrollCity""  where ""StatusId""= 1").ToList();

            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionDateWiseFx([FromBody] Predicate model)
        {

            var date = DateTime.Today;
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var userid = (model.ProvidedString.Split("?")[1]);
            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityFyy\" ('{0}','{1}',{2}) AS \"AdmissionCount\"", sessionid, date, userid)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeecityFxx\"  ('{0}','{1}',{2})", sessionid, date, userid)).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select count(""EnrollmentId"") AS ""EnrollmentCount"" from ""public"".""VWEnrollCity""  where ""StatusId""= 1").ToList();

            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAdmissionDateWiseEx()
        {

            var date = DateTime.Today;

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select count(\"AdmissionFormId\") AS \"AdmissionCount\" from \"public\".\"VWAdmissionCityFx\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeecityFx\"  ('{0}')", date)).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select count(""EnrollmentId"") AS ""EnrollmentCount"" from ""public"".""VWEnrollCity""  where ""StatusId""= 1").ToList();

            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionPgDateWise([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new Guid(model.ProvidedString.Split("?")[1]);
            var programDetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var userid = (model.ProvidedString.Split("?")[3]);
            var date = DateTime.Today;

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            // admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select count(\"AdmissionFormId\") AS \"AdmissionCount\" from \"public\".\"VWAdmissionCityFx\"  Where \"SessionId\"='{0}' and \"CityId\"='{1}' and \"ProgramDetailId\" in (SELECT s.token::uuid from unnest(string_to_array('{2}', ',')) s(token)) and  \"StatusId\"=1 and  \"AdmissionDate\"='{3}'and \"CampusId\" in (SELECT \"VWCampuCity\".\"CampusId\" FROM \"Setup\".\"VWCampuCity\" WHERE \"Setup\".\"VWCampuCity\".\"CampusId\" IN ((SELECT CAST(( jsonb_array_elements ( \"ModuleStore\" ) :: jsonb ) ->> 'id' AS UUID ) FROM \"Role\".\"RolePrevilages\" WHERE \"UserId\" = {4})) )", sessionid, cityId, programDetailid, date, userid)).ToList();

            // admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeecityFx\"  ('{0}','{1}','{2}','{3}',{4}) ", sessionid, cityId, programDetailid, date, userid)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select count(\"EnrollmentId\") AS \"EnrollmentCount\" from \"public\".\"VWEnrollCityFx\"  Where \"SessionId\"='{0}' and \"CityId\"='{1}' and \"ProgramDetailId\" in (SELECT s.token::uuid from unnest(string_to_array('{2}', ',')) s(token)) and  \"StatusId\"=1 ", sessionid, cityId, programDetailid)).ToList();

            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityFx\"  ('{0}','{1}','{2}','{3}',{4}) AS \"AdmissionCount\"", sessionid, cityId, programDetailid, date, userid)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeecityFx\"  ('{0}','{1}','{2}','{3}',{4}) ", sessionid, cityId, programDetailid, date, userid)).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select count(\"EnrollmentId\") AS \"EnrollmentCount\" from \"public\".\"VWEnrollCityFx\"  Where \"SessionId\"='{0}' and \"CityId\"='{1}' and \"ProgramDetailId\" = '{2}' and  \"StatusId\"=1 ", sessionid, cityId, programDetailid)).ToList();

            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionPgDateWiseFx([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new Guid(model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var date = DateTime.Today;

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityFxx\"  ('{0}','{1}','{2}',{3}) AS \"AdmissionCount\"", sessionid, cityId, date, userid)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeecityFx\"  ('{0}','{1}','{2}',{3}) ", sessionid, cityId, date, userid)).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select count(\"EnrollmentId\") AS \"EnrollmentCount\" from \"public\".\"VWEnrollCityFx\"  Where \"SessionId\"='{0}' and \"CityId\"='{1}' and  \"StatusId\"=1 ", sessionid, cityId)).ToList();

            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWise([FromBody] Predicate model)
        {

            var cityId = new Guid(model.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(model.ProvidedString.Split("?")[1]);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select count(\"AdmissionFormId\") AS \"AdmissionCount\" from \"public\".\"VWAdmissionCity\"  Where \"CityId\"='{0}' and \"SubCityId\"='{1}' and  \"StatusId\"=1 ", cityId, subCityId)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"public\".\"VWFeeCityEx\"  where \"CityId\"='{0}' and \"SubCityId\"='{1}' ", cityId, subCityId)).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select count(\"EnrollmentId\") AS \"EnrollmentCount\" from \"public\".\"VWEnrollCity\"  Where \"CityId\"='{0}' and \"SubCityId\"='{1}' and  \"StatusId\"=1 ", cityId, subCityId)).ToList();

            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWiseFx([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new Guid(model.ProvidedString.Split("?")[1]);
            var programDetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var userid = (model.ProvidedString.Split("?")[3]);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            // admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql (String.Format ("select count(\"AdmissionFormId\") AS \"AdmissionCount\" from \"public\".\"VWAdmissionCityFx\"  Where \"SessionId\"='{0}' and \"CityId\"='{1}' and \"ProgramDetailId\" in (SELECT s.token::uuid from unnest(string_to_array('{2}', ',')) s(token)) and  \"StatusId\"=1 and \"CampusId\" in (SELECT \"VWCampuCity\".\"CampusId\" FROM \"Setup\".\"VWCampuCity\" WHERE \"Setup\".\"VWCampuCity\".\"CampusId\" IN ((SELECT CAST(( jsonb_array_elements ( \"ModuleStore\" ) :: jsonb ) ->> 'id' AS UUID ) FROM \"Role\".\"RolePrevilages\" WHERE \"UserId\" = {3})) )", sessionid, cityId, programDetailid, userid)).ToList ();

            // admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql (String.Format ("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"public\".\"VWFeeCityFx\"  where \"SessionId\"='{0}' and \"CityId\"='{1}' and \"ProgramDetailId\" in (SELECT s.token::uuid from unnest(string_to_array('{2}', ',')) s(token)) and \"CampusId\" in (SELECT \"VWCampuCity\".\"CampusId\" FROM \"Setup\".\"VWCampuCity\" WHERE \"Setup\".\"VWCampuCity\".\"CampusId\" IN ((SELECT CAST(( jsonb_array_elements ( \"ModuleStore\" ) :: jsonb ) ->> 'id' AS UUID ) FROM \"Role\".\"RolePrevilages\" WHERE \"UserId\" = {3})) )", sessionid, cityId, programDetailid, userid)).ToList ();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql (String.Format ("select count(\"EnrollmentId\") AS \"EnrollmentCount\" from \"public\".\"VWEnrollCityFx\"  Where \"SessionId\"='{0}' and \"CityId\"='{1}' and \"ProgramDetailId\" in (SELECT s.token::uuid from unnest(string_to_array('{2}', ',')) s(token)) and  \"StatusId\"=1 and \"CampusId\" in (SELECT \"VWCampuCity\".\"CampusId\" FROM \"Setup\".\"VWCampuCity\" WHERE \"Setup\".\"VWCampuCity\".\"CampusId\" IN ((SELECT CAST(( jsonb_array_elements ( \"ModuleStore\" ) :: jsonb ) ->> 'id' AS UUID ) FROM \"Role\".\"RolePrevilages\" WHERE \"UserId\" = {3})) )", sessionid, cityId, programDetailid, userid)).ToList ();

            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityFxz\"  ('{0}','{1}','{2}',{3}) AS \"AdmissionCount\"", sessionid, cityId, programDetailid, userid)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWFeeCityFx\"  ('{0}','{1}','{2}',{3}) AS \"PaidChallanCount\"", sessionid, cityId, programDetailid, userid)).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWEnrollCityFx\"  ('{0}','{1}','{2}',{3}) AS \"EnrollmentCount\"", sessionid, cityId, programDetailid, userid)).ToList();

            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWiseFxx([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new String(model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityMult\"  ('{0}','{1}',{2}) AS \"AdmissionCount\"", sessionid, cityId, userid)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWFeeCityMult\"  ('{0}','{1}',{2}) AS \"PaidChallanCount\"", sessionid, cityId, userid)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql (String.Format ("select *  from \"Dashboard\".\"VWEnrollCityFx\"  ('{0}','{1}',{2}) AS \"EnrollmentCount\"", sessionid, cityId, userid)).ToList ();

            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select count(""EnrollmentId"") AS ""EnrollmentCount"" from ""public"".""VWEnrollCity""  where ""StatusId""= 1").ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWiseDateMult([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new String(model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityMultDate\"  ('{0}','{1}',{2},'{3}','{4}') AS \"AdmissionCount\"", sessionid, cityId, userid, fromdate, todate)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeeCityMultDate\"  ('{0}','{1}',{2},'{3}','{4}') ", sessionid, cityId, userid, fromdate, todate)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql (String.Format ("select *  from \"Dashboard\".\"VWEnrollCityFx\"  ('{0}','{1}',{2}) AS \"EnrollmentCount\"", sessionid, cityId, userid)).ToList ();

            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityMultDateOnline\"  ('{0}','{1}',{2},'{3}','{4}') AS \"EnrollmentCount\"", sessionid, cityId, userid, fromdate, todate)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionGenderCount([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionGenderDashboard""('{0}','{1}','{2}')", sessionid, fromdate, todate);
            return Ok(this.db.AdmissionGenderDashboard.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionOnlineCount([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionOnlineDashboard""('{0}','{1}','{2}')", sessionid, fromdate, todate);
            return Ok(this.db.AdmissionOnlineDashboard.FromSql(sql));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionGenderCountCity([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionGenderDashboardCity""('{0}','{1}','{2}','{3}', {4})", sessionid, cityIdEx, fromdate, todate, userid);
            return Ok(this.db.AdmissionGenderDashboard.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionOnlineCountCity([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionOnlineDashboardCity""('{0}','{1}','{2}','{3}', {4})", sessionid, cityIdEx, fromdate, todate, userid);
            return Ok(this.db.AdmissionOnlineDashboard.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionGenderDashboardCityLevelWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var levelid = model.ProvidedString.Split("?")[5];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionGenderDashboardCityLevelWise""('{0}','{1}','{2}','{3}', {4},'{5}')", sessionid, cityIdEx, fromdate, todate, userid, levelid);
            return Ok(this.db.AdmissionGenderDashboard.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionOnlineDashboardCityLevelWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var levelid = model.ProvidedString.Split("?")[5];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionOnlineDashboardCityLevelWise""('{0}','{1}','{2}','{3}', {4},'{5}')", sessionid, cityIdEx, fromdate, todate, userid, levelid);
            return Ok(this.db.AdmissionOnlineDashboard.FromSql(sql));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionGenderDashboardCityProgramWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var levelid = model.ProvidedString.Split("?")[5];
            var programid = model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionGenderDashboardCityProgramWise""('{0}','{1}','{2}','{3}', {4},'{5}', '{6}')", sessionid, cityIdEx, fromdate, todate, userid, levelid, programid);
            return Ok(this.db.AdmissionGenderDashboard.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionOnlineDashboardCityProgramWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var levelid = model.ProvidedString.Split("?")[5];
            var programid = model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionOnlineDashboardCityProgramWise""('{0}','{1}','{2}','{3}', {4},'{5}', '{6}')", sessionid, cityIdEx, fromdate, todate, userid, levelid, programid);
            return Ok(this.db.AdmissionOnlineDashboard.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionGenderDashboardCityProgramDetailWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var levelid = model.ProvidedString.Split("?")[5];
            var programDetailid = model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionGenderDashboardCityProgramDetailWise""('{0}','{1}','{2}','{3}', {4},'{5}', '{6}')", sessionid, cityIdEx, fromdate, todate, userid, levelid, programDetailid);
            return Ok(this.db.AdmissionGenderDashboard.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionOnlineDashboardCityProgramDetailWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var levelid = model.ProvidedString.Split("?")[5];
            var programDetailid = model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""AdmissionOnlineDashboardCityProgramDetailWise""('{0}','{1}','{2}','{3}', {4},'{5}', '{6}')", sessionid, cityIdEx, fromdate, todate, userid, levelid, programDetailid);
            return Ok(this.db.AdmissionOnlineDashboard.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult VWCityDateEXCity([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            // var levelid = model.ProvidedString.Split("?")[5];
            //var programDetailid= model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""VWCityDateEXCity""('{0}','{1}','{2}','{3}', '{4}')", sessionid, userid, fromdate, todate, cityIdEx);
            return Ok(this.db.VWCityDateEXCity.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult VWCityDateEXlevel([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var levelid = model.ProvidedString.Split("?")[5];
            //var programDetailid= model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""VWCityDateEXlevel""('{0}','{1}','{2}','{3}', {4})", sessionid, userid, fromdate, todate, cityIdEx, levelid);
            return Ok(this.db.VWCityDateEXCity.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult VWCityDateEXProgram([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var todate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            //var cityIdEx = new Guid(model.ProvidedString.Split("?")[3]);
            var cityIdEx = (model.ProvidedString.Split("?")[3]);

            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            //var levelid = model.ProvidedString.Split("?")[5];
            var programid = model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""VWCityDateEXlevel""('{0}','{1}','{2}','{3}', {4})", sessionid, userid, fromdate, todate, cityIdEx, programid);
            return Ok(this.db.VWCityDateEXCity.FromSql(sql));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWiseMultLevel([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new String(model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityMultlevel\"  ('{0}','{1}',{2},'{3}','{4}','{5}') AS \"AdmissionCount\"", sessionid, cityId, userid, fromdate, todate, level)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeeCityMultLevel\"  ('{0}','{1}',{2},'{3}','{4}','{5}') ", sessionid, cityId, userid, fromdate, todate, level)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql (String.Format ("select *  from \"Dashboard\".\"VWEnrollCityFx\"  ('{0}','{1}',{2}) AS \"EnrollmentCount\"", sessionid, cityId, userid)).ToList ();

            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityMultlevelOnline\"  ('{0}','{1}',{2},'{3}','{4}','{5}') AS \"EnrollmentCount\"", sessionid, cityId, userid, fromdate, todate, level)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWiseProgramLevel([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new String(model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programdetailid = (model.ProvidedString.Split("?")[6]);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityMultlevel\"  ('{0}','{1}',{2},'{3}','{4}','{5}','{6}') AS \"AdmissionCount\"", sessionid, cityId, userid, fromdate, todate, level, programdetailid)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeeCityMultLevel\"  ('{0}','{1}',{2},'{3}','{4}','{5}','{6}') ", sessionid, cityId, userid, fromdate, todate, level, programdetailid)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql (String.Format ("select *  from \"Dashboard\".\"VWEnrollCityFx\"  ('{0}','{1}',{2}) AS \"EnrollmentCount\"", sessionid, cityId, userid)).ToList ();

            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityMultOnline\"  ('{0}','{1}',{2},'{3}','{4}','{5}','{6}') AS \"EnrollmentCount\"", sessionid, cityId, userid, fromdate, todate, level, programdetailid)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWiseProgram([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityId = new String(model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var todate = (model.ProvidedString.Split("?")[4]);
            var level = (model.ProvidedString.Split("?")[5]);
            var programid = (model.ProvidedString.Split("?")[6]);

            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            // admissionwidgetdata.AdmissionForm = db.AdmissionAdmissionForm.FromSql(String.Format("select * from \"Admission\".\"AdmissionForm\"  Where \"AdmissionDate\"='{0}' and  \"StatusId\"=1 ", date)).ToList();
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionlevel\"  ('{0}','{1}',{2},'{3}','{4}','{5}','{6}') AS \"AdmissionCount\"", sessionid, cityId, userid, fromdate, todate, level, programid)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeeLevelProgram\"  ('{0}','{1}',{2},'{3}','{4}','{5}','{6}') ", sessionid, cityId, userid, fromdate, todate, level, programid)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql (String.Format ("select *  from \"Dashboard\".\"VWEnrollCityFx\"  ('{0}','{1}',{2}) AS \"EnrollmentCount\"", sessionid, cityId, userid)).ToList ();

            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionlevelOnline\"  ('{0}','{1}',{2},'{3}','{4}','{5}','{6}') AS \"EnrollmentCount\"", sessionid, cityId, userid, fromdate, todate, level, programid)).ToList();
            // admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(@"select * from ""Registration"".""Enrollments""  where ""StatusId""= 1").ToList();

            return Ok(admissionwidgetdata);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityWiseAllEx([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var userid = (model.ProvidedString.Split("?")[1]);
            var fromdate = (model.ProvidedString.Split("?")[2]);
            var todate = (model.ProvidedString.Split("?")[3]);
            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            var z = (String.Format("select count(\"AdmissionFormId\") AS \"AdmissionCount\" from \"public\".\"VWAdmissionCityFx\"  Where \"SessionId\"= '{0}' and  \"StatusId\"=1 ", sessionid));
            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityFx\"  ('{0}',{1},'{2}','{3}') AS \"AdmissionCount\"", sessionid, userid, fromdate, todate)).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"Dashboard\".\"VWFeeCityDate\"  ('{0}',{1},'{2}','{3}') ", sessionid, userid, fromdate, todate)).ToList();
            // below query is NewExpression using for online admission count
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select *  from \"Dashboard\".\"VWAdmissionCityOnline\"  ('{0}',{1},'{2}','{3}') AS \"EnrollmentCount\"", sessionid, userid, fromdate, todate)).ToList();

            return Ok(admissionwidgetdata);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionTrendGraph([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var userid = (model.ProvidedString.Split("?")[1]);
            var fromdate = (model.ProvidedString.Split("?")[2]);
            var z = db.AdmissiontrendClass.FromSql(String.Format("select *  from \"Dashboard\".\"AdmissionTrendFunc\"  ('{0}',{1},'{2}') ", sessionid, userid, fromdate)).ToList();


            return Ok(z);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionTrendGraphCity([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = (model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var z = db.AdmissiontrendClass.FromSql(String.Format("select *  from \"Dashboard\".\"AdmissionTrendFunc\"  ('{0}','{1}',{2},'{3}') ", sessionid, cityid, userid, fromdate)).ToList();


            return Ok(z);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionTrendGraphlevel([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = (model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var level = (model.ProvidedString.Split("?")[4]);
            var z = db.AdmissiontrendClass.FromSql(String.Format("select *  from \"Dashboard\".\"AdmissionTrendFunc\"  ('{0}','{1}',{2},'{3}','{4}') ", sessionid, cityid, userid, fromdate, level)).ToList();


            return Ok(z);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionTrendGraphProgram([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = (model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var level = (model.ProvidedString.Split("?")[4]);
            var program = (model.ProvidedString.Split("?")[5]);
            var z = db.AdmissiontrendClass.FromSql(String.Format("select *  from \"Dashboard\".\"AdmissionTrendFunc\"  ('{0}','{1}',{2},'{3}','{4}','{5}') ", sessionid, cityid, userid, fromdate, level, program)).ToList();


            return Ok(z);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AdmissionTrendGraphProgramD([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = (model.ProvidedString.Split("?")[1]);
            var userid = (model.ProvidedString.Split("?")[2]);
            var fromdate = (model.ProvidedString.Split("?")[3]);
            var level = (model.ProvidedString.Split("?")[4]);
            var program = (model.ProvidedString.Split("?")[5]);
            var z = db.AdmissiontrendClass.FromSql(String.Format("select *  from \"Dashboard\".\"AdmissionTrendFuncPgd\"  ('{0}','{1}',{2},'{3}','{4}','{5}') ", sessionid, cityid, userid, fromdate, level, program)).ToList();


            return Ok(z);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityWiseAll()
        {
            var admissionwidgetdata = new AdmissionWidgetDataA()
            {
                AdmissionForm = new List<AdmissionsCount>(),
                StudentChallan = new List<FeeStudentChallanCount>(),
                Enrollments = new List<EnrollmentsCount>()
            };

            admissionwidgetdata.AdmissionForm = db.AdmissionsCount.FromSql(String.Format("select count(\"AdmissionFormId\") AS \"AdmissionCount\" from \"public\".\"VWAdmissionCityFx\"  Where \"SessionId\"= ( SELECT \"Session\".\"SessionId\" FROM \"Setup\".\"Session\" WHERE (\"Session\".\"StatusId\" = 1) ORDER BY \"Session\".\"FullName\" DESC LIMIT 1 ) and  \"StatusId\"=1 ")).ToList();

            admissionwidgetdata.StudentChallan = db.FeeStudentChallanCount.FromSql(String.Format("select count(\"PaidChallanCount\") AS \"PaidChallanCount\" from \"public\".\"VWFeeCityFx\"  where \"SessionId\"= ( SELECT \"Session\".\"SessionId\" FROM \"Setup\".\"Session\" WHERE (\"Session\".\"StatusId\" = 1) ORDER BY \"Session\".\"FullName\" DESC LIMIT 1 ) ")).ToList();
            admissionwidgetdata.Enrollments = db.EnrollmentsCount.FromSql(String.Format("select count(\"EnrollmentId\") AS \"EnrollmentCount\" from \"public\".\"VWEnrollCityFx\"  Where \"SessionId\"= ( SELECT \"Session\".\"SessionId\" FROM \"Setup\".\"Session\" WHERE (\"Session\".\"StatusId\" = 1) ORDER BY \"Session\".\"FullName\" DESC LIMIT 1 ) and \"StatusId\"=1 ")).ToList();

            return Ok(admissionwidgetdata);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(AdmissionAdmissionForm).Assembly);
                Expression<Func<AdmissionAdmissionForm, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionAdmissionForm, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.FindByAsync(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetFindByAsync CONTROLLER.GetFindByAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] AdmissionAdmissionForm entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN AddOne CONTROLLER.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] AdmissionAdmissionForm entity)
        {
            try
            {
                await this.repository.AddAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN AddOneAsync CONTROLLER.AddOneAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<AdmissionAdmissionForm> entities)
        {
            try
            {
                this.repository.AddAll(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN AddMany CONTROLLER.AddMany()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<AdmissionAdmissionForm> entities)
        {
            try
            {
                await this.repository.AddAllAsync(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN AddManyAsync CONTROLLER.AddManyAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] AdmissionAdmissionForm entity)
        {
            try
            {
                this.repository.Update(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN Update CONTROLLER.Update()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] AdmissionAdmissionForm entity)
        {
            try
            {
                await this.repository.UpdateAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN UpdateAsync CONTROLLER.UpdateAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] AdmissionAdmissionForm entity)
        {
            try
            {
                this.repository.Delete(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN Delete CONTROLLER.Delete()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] AdmissionAdmissionForm entity)
        {
            try
            {
                await this.repository.DeleteAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Admission.AdmissionForm"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN DeleteAsync CONTROLLER.DeleteAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GenerateStudentFee([FromBody] Predicate model)
        {
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var admissiionformid = new Guid(model.ProvidedString.Split("?")[0]);
                var className = new String(model.ProvidedString.Split("?")[1]);

                string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"FeeGenerate\"('{0}','{1}'); commit;", admissiionformid, className);
                // Console.WriteLine(json);

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
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GenerateStudentFee CONTROLLER.GenerateStudentFee()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult RevertConcession([FromBody] Predicate model)
        {
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var admissiionformid = new Guid(model.ProvidedString);
                var Data = this.log.GetLog();
                string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"RevertConcession\"('{0}','{1}'); commit;", admissiionformid, Data);

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
            catch (Exception ex)
            {

                AppException app = new AppException();
                app.Message = "ERROR IN RevertConcession CONTROLLER.RevertConcession()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult CheckFeeStructure([FromBody] Predicate model)
        {
            try
            {
                var campusid = new Guid(model.ProvidedString.Split("?")[0]);
                var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
                var campusprogramid = new Guid(model.ProvidedString.Split("?")[2]);
                var className = new String(model.ProvidedString.Split("?")[3]);

                string json = String.Format("SELECT \"Fee\".\"CheckFeeStructure\"('{0}','{1}','{2}','{3}')", campusid, sessionid, campusprogramid, className);

                // // Console.WriteLine(json);
                return Ok(db.StudentFeeExist.FromSql(json));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN CheckFeeStructure CONTROLLER.CheckFeeStructure()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(AdmissionAdmissionForm).Assembly);
                Expression<Func<AdmissionAdmissionForm, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionAdmissionForm, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.DeleteWhere(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN DeleteWhere CONTROLLER.DeleteWhere()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult isTestCampus([FromBody] Predicate model)

        {
            var campusid = new Guid(model.ProvidedString);

            string json = String.Format("select count(*) as val from \"Setup\".\"Campus\"  where \"CampusId\"='{0}' and \"IsTestCampus\" > 0 and \"StatusId\"=1 ;", campusid);

            // // Console.WriteLine(json);
            return Ok(db.IntModel.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(AdmissionAdmissionForm).Assembly);
                Expression<Func<AdmissionAdmissionForm, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionAdmissionForm, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN DeleteWhereAsync CONTROLLER.DeleteWhereAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckFeePaid([FromBody] Predicate predicate)
        {
            try
            {
                var admissiionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var InstallmentNo = Convert.ToInt16(predicate.ProvidedString.Split("?")[1]);
                var challantypeid = new Guid(predicate.ProvidedString.Split("?")[2]);
                var z = this.db.IntModel.FromSql(String.Format("select Count(\"StudentChallan\".\"PaidDate\") as val from \"Fee\".\"StudentChallan\"  Where \"AdmissionFormId\"='{0}' and \"PaidDate\" NOTNULL and \"StatusId\"=1 and \"InstallmentNo\"= {1} and \"ChallanTypeId\"='{2}' ", admissiionformid, InstallmentNo, challantypeid));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckFeePaid()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckFeePaidCl([FromBody] Predicate predicate)
        {
            try
            {
                var admissiionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var InstallmentNo = Convert.ToInt16(predicate.ProvidedString.Split("?")[1]);
                var challantypeid = new Guid(predicate.ProvidedString.Split("?")[2]);
                var classid = new Guid(predicate.ProvidedString.Split("?")[3]);

                var z = this.db.IntModel.FromSql(String.Format("select Count(\"StudentChallan\".\"PaidDate\") as val from \"Fee\".\"StudentChallan\"  Where \"AdmissionFormId\"='{0}' and \"PaidDate\" NOTNULL and \"StatusId\"=1 and \"InstallmentNo\"= {1} and \"ChallanTypeId\"='{2}' and \"ClassId\"='{3}' ", admissiionformid, InstallmentNo, challantypeid, classid));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckFeePaid()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckStudent([FromBody] Predicate predicate)
        {
            try
            {
                var admissiionformid = new Guid(predicate.ProvidedString);
                var z = this.db.Predicate.FromSql(String.Format("SELECT * FROM \"Admission\".\"checkStudent\"('{0}') AS \"ProvidedString\" ", admissiionformid));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckStudent()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckFeePaidEx([FromBody] Predicate predicate)
        {
            try
            {
                var admissiionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var InstallmentNo = Convert.ToInt16(predicate.ProvidedString.Split("?")[1]);
                var z = this.db.IntModel.FromSql(String.Format("select Count(\"StudentChallanEx\".\"PaidDate\") as val from \"Fee\".\"StudentChallanEx\"  Where \"AdmissionFormId\"='{0}' and \"PaidDate\" NOTNULL and \"StatusId\"=1 and \"InstallmentNo\"= {1}", admissiionformid, InstallmentNo));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckFeePaid()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckSubInstallment([FromBody] Predicate predicate)
        {
            try
            {
                var AdmissionformId = new Guid(predicate.ProvidedString.Split("?")[0]);
                var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
                var z = this.db.IntModel.FromSql(String.Format("SELECT \"Fee\".\"val\"('{0}','{1}')", AdmissionformId, classid));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN SUBINSTALLMENT Controller.CheckSubInstallment()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                return BadRequest(app.Message);

            }

        }

        //Check SubinStallment of Installment
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult CheckSubInstallmentofInstallment([FromBody] Predicate predicate)
        {

            IDbConnection connection = db.Database.GetDbConnection();
            var rtv = new RTV() { ReturnValue = 0 };
            var AdmissionformId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var Installmentno = Convert.ToInt16(predicate.ProvidedString.Split("?")[2]);
            var ChallanTypeId = new Guid(predicate.ProvidedString.Split("?")[3]);
            string json = String.Format("SELECT \"Fee\".\"CheckSubInstallmentofINstallment\"('{0}','{1}',{2},'{3}') as val", AdmissionformId, classid, Installmentno, ChallanTypeId);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            {
                return Ok(rtv);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckFeeExemptionByEx([FromBody] Predicate predicate)
        {
            try
            {
                var AdmissionformId = new Guid(predicate.ProvidedString.Split("?")[0]);
                var installno = Convert.ToInt16(predicate.ProvidedString.Split("?")[1]);
                var classid = new Guid(predicate.ProvidedString.Split("?")[2]);

                var z = this.db.IntModel.FromSql(String.Format("select count(*) as val from \"Fee\".\"StudentFeeStructure\" where  \"StudentFeeStructure\" .\"AdmissionFormId\"='{0}' and \"StudentFeeStructure\".\"FeeHeadId\"='00000000-0000-0000-0000-000000000000' and \"StudentFeeStructure\".\"StatusId\"=1 and \"StudentFeeStructure\".\"InstallmentNo\"={1}  and \"StudentFeeStructure\".\"ClassId\"='{2}'", AdmissionformId, installno, classid));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.CheckFeeExemption()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckFeeExemption([FromBody] Predicate predicate)
        {
            try
            {
                var AdmissionformId = new Guid(predicate.ProvidedString);
                var z = this.db.IntModel.FromSql(String.Format("select count(*) as val from \"Fee\".\"StudentFeeStructure\" where  \"StudentFeeStructure\" .\"AdmissionFormId\"='{0}' and \"StudentFeeStructure\".\"FeeHeadId\"='00000000-0000-0000-0000-000000000000' and \"StudentFeeStructure\".\"StatusId\"=1", AdmissionformId));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.CheckFeeExemption()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertAdmission([FromBody] Predicate predicate)
        {
            //     IDbTransaction transaction = null;
            string json = "";
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var Data = this.log.GetLog();
                //string json=String.Format("SELECT \"Admission\".\"AddAdmissionFormTest\"('{0}','{1}')",predicate.ProvidedString,Data);
                json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT pg_advisory_xact_lock(1); SELECT \"Admission\".\"AddAdmissionFormTest\"('{0}','{1}') ; commit;", predicate.ProvidedString, Data);
                Console.WriteLine(json);
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                    //   transaction =  connection.BeginTransaction(IsolationLevel.Serializable);
                    var con = connection.Execute(json);

                    // transaction.Commit();
                    connection.Close();
                    connection.Dispose();
                    return Ok("Data Saved");
                }

                return Ok("Connection lost Please Click Save Button Again");
            }
            catch (Exception ex)
            {

                //  transaction.Rollback();
                AppException app = new AppException();
                app.Message = "ERROR IN ADMISSION FORM CONTROLLER.InsertAdmission()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest("Please Hit Save Button Again ! Form Saving in Progress");
            }

        }
        Guid studentId;
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertOnlineadmissionstep([FromBody] OnlineAdmissionResponsestepModel predicate)
        {
            try
            {

                IDbConnection connection = db.Database.GetDbConnection();
                string json = string.Format("SELECT * FROM \"StepAssesment\".\"insertonlineAdmissionEx\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}')",
                predicate.StepCityId,
                predicate.FullName,
                predicate.FatherName,
                predicate.StudentCNIC,
                predicate.PhoneNo,
                predicate.Email,
                predicate.CollegeName,
                predicate.RollNo,
                predicate.BoardMarks,
                predicate.ProgramDetail,
                predicate.StepProvinceId
                );

                //return Ok(this.db.responseoninsert.FromSql(json));

                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                    //   transaction =  connection.BeginTransaction(IsolationLevel.Serializable);
                    IEnumerable<AcceptanceResponseSSAT> con = connection.Query<AcceptanceResponseSSAT>(json);
                    // transaction.Commit();
                    connection.Close();
                    connection.Dispose();
                    Console.WriteLine(con);
                    if (predicate.StepCityId == null)
                        BackgroundJob.Enqueue(() => this.SendEamilSSATOnline(con.FirstOrDefault()));
                    else
                        BackgroundJob.Enqueue(() => this.SendEamilSSATCampus(con.FirstOrDefault()));
                    return Ok(con);

                }
                else
                { return Ok("Data Not Saved"); }
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "StudentAlreadyExist!";
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                // return Ok(app.Message); 
                return Ok(ex);
            }
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetReferenceNumberwithcenter()
        {
            try
            {
                Console.WriteLine(studentId);
                return Ok(this.db.GetReferenceNumberVM);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll CONTROLLER.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllProvinces()
        {
            try
            {
                return Ok(this.db.GetAllProvincesVM.Where(s => s.StatusId == 1));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll CONTROLLER.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllprograms()
        {
            try
            {
                return Ok(this.db.GetAllProgramsVM);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll CONTROLLER.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllCity([FromBody] Predicate predicate)
        //  public IActionResult GetAllCity( )
        {
            // predicate.provincename
            string sql = string.Format("SELECT * FROM \"StepAssesment\".\"GetCities\"('{0}')", predicate.ProvidedString);
            Console.WriteLine(sql);
            return Ok(this.db.GetAllCitiesprovine.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertAdmissionBr([FromBody] Predicate predicate)
        {
            //     IDbTransaction transaction = null;
            string json = "";
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var Data = this.log.GetLog();
                //string json=String.Format("SELECT \"Admission\".\"AddAdmissionFormTest\"('{0}','{1}')",predicate.ProvidedString,Data);
                json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT pg_advisory_xact_lock(1); SELECT \"Admission\".\"AddAdmissionFormTestBr\"('{0}','{1}') ; commit;", predicate.ProvidedString, Data);
                Console.WriteLine(json);
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                    //   transaction =  connection.BeginTransaction(IsolationLevel.Serializable);
                    var con = connection.Execute(json);

                    // transaction.Commit();
                    connection.Close();
                    connection.Dispose();
                    return Ok("Data Saved");
                }

                return Ok("Connection lost Please Click Save Button Again");
            }
            catch (Exception ex)
            {

                //  transaction.Rollback();
                AppException app = new AppException();
                app.Message = "ERROR IN ADMISSION FORM CONTROLLER.InsertAdmission()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest("Please Hit Save Button Again ! Form Saving in Progress");
            }

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertAdmissionEx([FromBody] Predicate predicate)
        {
            //     IDbTransaction transaction = null;
            string json = "";
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var Data = this.log.GetLog();
                //string json=String.Format("SELECT \"Admission\".\"AddAdmissionFormTest\"('{0}','{1}')",predicate.ProvidedString,Data);
                json = String.Format("SELECT \"Admission\".\"AddAdmissionFormTestEx\"('{0}','{1}') ;", predicate.ProvidedString, Data);
                // Console.WriteLine(json);
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                    //   transaction =  connection.BeginTransaction(IsolationLevel.Serializable);
                    var con = connection.Execute(json);

                    // transaction.Commit();
                    connection.Close();
                    connection.Dispose();
                    return Ok("Data Saved");
                }

                return Ok("Connection lost Please Click Save Button Again");
            }
            catch (Exception ex)
            {

                //  transaction.Rollback();
                AppException app = new AppException();
                app.Message = "ERROR IN ADMISSION FORM CONTROLLER.InsertAdmission()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest("Please Hit Save Button Again ! Form Saving in Progress");
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetChallaNo([FromBody] Predicate entity)
        {
            try
            {
                var admissionFormId = new Guid(entity.ProvidedString);
                return Ok(this.db.Predicate.FromSql(@"select ""ChallanNo"" as ""ProvidedString"" from ""Fee"".""StudentChallan"" where ""AdmissionFormId""='" + admissionFormId + @"' and ""InstallmentNo""=1").ToList().FirstOrDefault());
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN Delete CONTROLLER.Delete()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ApplyConcessionStudent([FromBody] Predicate model)
        {

            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var scholarshop = new Guid(model.ProvidedString.Split("?")[0]);
                var admissionform = new Guid(model.ProvidedString.Split("?")[1]);
                var classid = new String(model.ProvidedString.Split("?")[2]);
                var Data = this.log.GetLog();

                string json = String.Format("SELECT \"OnlineAdmission\".\"ApplyConcessiononStudentCMS\"('{0}','{1}','{2}',{3},'{4}')", scholarshop, admissionform, Data, 1, classid);
                // Console.WriteLine(json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                var con = connection.Execute(json);
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }

                return Ok("Concession Applied");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckChallanValidity([FromBody] Predicate model)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var campusid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusprogramid = new Guid(model.ProvidedString.Split("?")[1]);
                var classid = new String(model.ProvidedString.Split("?")[2]);

                string json = String.Format("SELECT \"Admission\".\"CheckChallanValidity\"('{0}','{1}',{2}) as ProvidedString", campusprogramid, campusid, classid);
                // Console.WriteLine(json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                obj.ProvidedString = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;

                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }

                return Ok(obj.ProvidedString);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetadmissionAging([FromBody] Predicate model)
        {
            try
            {
                var searchParam = model.ProvidedString.Split("?")[0];
                var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
                // Console.Write(searchParam);
                // Console.Write(userid);
                //string sql = String.Format(@"SELECT * FROM ""Fee"".""DuesList""('{0}')", model.ProvidedString);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""AdmissionAgingReport""('{0}',{1})", searchParam, userid);


                return Ok(db.AdmissionAgingData.FromSql(sql));


                //         var searchParam = model.ProvidedString.Split("?")[0];
                // var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
                // var classid=new Guid (model.ProvidedString.Split("?")[2]);
                // //string sql = String.Format(@"select * from ""Admission"".""getStudentsDetail""('{0}',{1},'{2}')", searchParam, userid,classid);
                // string sql = String.Format(@"select * from ""Board"".""getBoardUniversitySearch""('{0}',{1},'{2}')", searchParam, userid,classid);
                // // Console.WriteLine(sql);
                // return Ok(db.StudentBoardUnivertySearch.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetadmissionAging, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckConcessionValdity([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var installno = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Admission"".""CheckConcessionValdity""('{0}','{1}','{2}')", admissionformid, installno, classid);
            return Ok(this.db.Checkconsessionvalidity.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckinstallmentValdity([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var installno = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Admission"".""CheckConcessionValdity2""('{0}','{1}','{2}')", admissionformid, installno, classid);
            return Ok(this.db.Checkconsessionvalidity2.FromSql(sql));
        }


        [AllowAnonymous]

        [IgnoreAntiforgeryToken]

        [HttpPost]

        [Route("[action]")]

        public IActionResult GetCheckInstallment([FromBody] Predicate model)

        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            var operationtype = (model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Admission"".""CheckStudentInstallment""('{0}','{1}','{2}')", admissionformid, classid, operationtype);
            Console.WriteLine(sql);
            return Ok(db.CheckStudentInstallment.FromSql(sql));

        }

        // [HttpPost]
        // [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        // [Route("[action]")]
        // public IActionResult getInstallmentList([FromBody] Predicate model)

        // {
        //      var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var campusid = new Guid(model.ProvidedString.Split("?")[1]);
        //     var campusprogramid = new Guid(model.ProvidedString.Split("?")[2]);
        //     var classid = new Guid(model.ProvidedString.Split("?")[3]);

        //     string json = String.Format(@"select * from ""Fee"".""InstallmentNo""('{0}','{1}','{2}','{3}')", sessionid,campusid,campusprogramid,classid);

        //     Console.WriteLine(json);
        //     return Ok(this.db.getInstallMentNo2.FromSql(json));
        // }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllProvincesStepAcademy()
        {
            try
            {
                return Ok(this.db.GetAllLocationsSSATVM.Where(s => s.StatusId == 1));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll CONTROLLER.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllCitiesStepAcademy()
        {
            try
            {
                return Ok(this.db.GetAllCitiesSSATVM.Where(s => s.StatusId == 1));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll CONTROLLER.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllLocationsStepAcademy([FromBody] Predicate predicate)
        {
            string sql = string.Format("SELECT * FROM \"StepAcademy\".\"GetAllLocations\"('{0}')", predicate.ProvidedString);
            Console.WriteLine(sql);
            return Ok(this.db.GetAllLocationsStepSSAT.FromSql(sql));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllprogramsStepAcademy([FromBody] Predicate predicate)
        {
            string sql = string.Format("SELECT * FROM \"StepAcademy\".\"GetAllTestFunction\"('{0}')", predicate.ProvidedString);
            Console.WriteLine(sql);
            return Ok(this.db.GetAllTestSSAT.FromSql(sql));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllprogramsStepAcademy()
        {
            try
            {
                return Ok(this.db.GetAllTestSSATVM.Where(s => s.StatusId == 1));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll CONTROLLER.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllSlotsStepAcademy([FromBody] Predicate predicate)
        {
            var testid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var locationid = new Guid(predicate.ProvidedString.Split("?")[1]);

            string sql = string.Format("SELECT * FROM \"StepAcademy\".\"GetAllSlotTime\"('{0}','{1}')", testid, locationid);
            Console.WriteLine(sql);
            return Ok(this.db.GetAllSloTimeSSAT.FromSql(sql));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertOnlineadmissionStepAcademy([FromBody] OnlineAdmissionResponsestepModelSSAT predicate)
        {
            try
            {

                IDbConnection connection = db.Database.GetDbConnection();
                string json = string.Format("SELECT * FROM \"StepAcademy\".\"InsertStepAcademyStudent\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}')",
                predicate.LocationId,
                predicate.TestId,
                predicate.SlotTimeId,
                predicate.FullName,
                predicate.FatherName,
                predicate.StudentCNIC,
                predicate.PhoneNo,
                predicate.Email,
                predicate.CollegeName
                );

                Console.WriteLine(json);
                //return Ok(this.db.responseoninsert.FromSql(json));

                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                    //   transaction =  connection.BeginTransaction(IsolationLevel.Serializable);
                    Console.WriteLine(json);
                    IEnumerable<AcceptanceResponseSTEPAcademy> con = connection.Query<AcceptanceResponseSTEPAcademy>(json);
                    // transaction.Commit();
                    connection.Close();
                    connection.Dispose();
                    Console.WriteLine(con);
                    // if (predicate.LocationId == null)
                    //     BackgroundJob.Enqueue(() => this.SendEamilSSATOnline(con.FirstOrDefault()));
                    // else
                    BackgroundJob.Enqueue(() => this.SendEamilSTEPAcademy(con.FirstOrDefault()));
                    return Ok(con);

                }
                else
                { return Ok("Data Not Saved"); }
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "StudentAlreadyExist!";
                app.Time = DateTime.Now;
                this.db.Add(app);
                this.db.SaveChangesAsync();
                // return Ok(app.Message); 
                return Ok(ex);
            }
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTestDate([FromBody] Predicate predicate)
        {
            var testid = new Guid(predicate.ProvidedString.Split("?")[0]);

            string sql = string.Format("SELECT * FROM \"StepAcademy\".\"GetTestDate\"('{0}')", testid);
            Console.WriteLine(sql);
            return Ok(this.db.GetTestDate.FromSql(sql));
        }
    }

}