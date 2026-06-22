
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Npgsql;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using System.Net.Http;
using System.Text;
using System.Text.Json;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Dapper;
using Cms.Data.Model;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ExaminationExamMasterController : Controller
    {
        private readonly IExaminationExamMasterRepository repository;

        private readonly IExaminationExamMasterRepositoryVM repo;
        private readonly IUserLogService log;

        private readonly DbContextBase db;
        public ExaminationExamMasterController(IExaminationExamMasterRepository repository, IUserLogService log, IExaminationExamMasterRepositoryVM repo, DbContextBase db)
        {
            this.repository = repository;
            this.repo = repo;
            this.db = db;
            this.log = log;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.repository.All());
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repo.FindByAsync(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamMaster).Assembly);
            Expression<Func<ExaminationExamMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamMaster).Assembly);
            Expression<Func<ExaminationExamMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamMaster).Assembly);
            Expression<Func<ExaminationExamMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateBulk([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();
            var updateids = model.ProvidedString.Split("?")[0];
            var smsids = model.ProvidedString.Split("?")[1];

            string json = String.Format("UPDATE \"Examination\".\"ExamMaster\" SET \"IsApproved\" = true,  \"ApprovalDate\" = CURRENT_DATE   WHERE \"ExamMasterId\" IN ({0})", updateids);
            string jsonsms = String.Format(@"select * from ""Examination"".""SendExamSms""({0})", smsids);
            // Console.WriteLine(jsonsms);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            connection.Execute(jsonsms);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();
        }

        //        [HttpPost]
        // [Route("[action]")]
        // public IActionResult SendSMSApproval([FromBody] Predicate model)
        // {
        //     IDbConnection connection = db.Database.GetDbConnection();
        //     var updateids = model.ProvidedString.Split("?")[0];
        //     var smsids = model.ProvidedString.Split("?")[1];

        //     // string json = String.Format("UPDATE \"Examination\".\"ExamMaster\" SET \"IsApproved\" = true,  \"ApprovalDate\" = CURRENT_DATE   WHERE \"ExamMasterId\" IN ({0})", updateids);
        //     string jsonsms = String.Format(@"select * from ""Examination"".""InsertSmsApprovel""('{0}','{1}')",updateids, smsids);
        //                 string json = String.Format(@"select * from ""Examination"".""SendSmsApprovelStudentData""('{0}','{1}')",updateids, smsids);

        //     // Console.WriteLine(jsonsms);
        //     if (connection.State == ConnectionState.Closed)
        //         connection.Open();
        //  //   connection.Execute(json);
        //    connection.Execute(jsonsms);
        //     if (connection.State == ConnectionState.Open)
        //     {
        //         connection.Close();
        //         connection.Dispose();
        //     }


        //      var k = SendSMSApprovalTable(updateids, smsids);

        //     return Ok();
        // }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> SendSMSApproval([FromBody] Predicate model)
        {
            var updateids = model.ProvidedString.Split("?")[0];
            var smsids = model.ProvidedString.Split("?")[1];


            // using (IDbConnection connection = db.Database.GetDbConnection())
            // {
            //     connection.Open();

            //     // Execute the first SQL command
            //     string jsonsms = String.Format(@"select * from ""Examination"".""InsertSmsApprovel""('{0}','{1}')", updateids, smsids);
            //     connection.Execute(jsonsms);

            //     // Call the second method
            //     SendSMSApprovalTable(connection, updateids, smsids);
            // }

            IDbConnection connection = db.Database.GetDbConnection();

            string jsonsms = String.Format(@"select * from ""Examination"".""InsertSmsApprovelEx""('{0}','{1}')", updateids, smsids);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<ExamSmSApprovalStdData>(jsonsms).ToList();

            //  IDbConnection connectionSk = db.Database.GetDbConnection();

            foreach (var student in data)
            {
                string admissionformid = student.admissionformid.ToString();
                string examsmsapprovalid = student.examsmsapprovalid.ToString();
                string smsapi = student.smsapid.ToString();
                string mask = student.mask.ToString();

                string longUrl = $"https://ems.cms.edu.pk/report/#/id={admissionformid}&std={examsmsapprovalid}";

                // Shorten the long URL
                string shortenedUrl;
                try
                {
                    shortenedUrl = await ShortenUrlAsync(longUrl);
                }
                catch (Exception ex)
                {
                    // Handle the error (e.g., log it) and skip sending this message
                    Console.WriteLine($"Failed to shorten URL for AdmissionFormId {admissionformid}: {ex.Message}");
                    continue; // Skip this iteration
                }

                // Construct and replace placeholders in the message
                string message = "Dear Parent, Kindly visit #TinyURL# to view the #MAsk#  Monthly Student Performance Report for #MONTH#.";
                message = message.Replace("#TinyURL#", shortenedUrl);
                                message = message.Replace("#MONTH#", smsids);
                                message = message.Replace("#MAsk#", mask);



                // Format the contact number to add country code



                SmsSys msgModel = new SmsSys
                {
                    MessageId = Guid.NewGuid(),
                    MessageNo = student.parentcontactno,
                    MessageText = message,
                    QuedDate = DateTime.UtcNow,
                    SendDate = DateTime.UtcNow,
                    SendTo = student.parentcontactno,
                    Status = 1,
                    SmsApId = Guid.Parse(smsapi),
                    AdmissionFormId = Guid.Parse(admissionformid),
                    CampusProgramId = student.campusprogramid
                };

                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                // SQL command to call the PostgreSQL function
                string sql = String.Format(@"SELECT * from ""Examination"".""insertsmssystable""('{0}','{1}','{2}','{3}')", msgModel.MessageNo, msgModel.MessageText, msgModel.AdmissionFormId, msgModel.CampusProgramId);

                // Execute the SQL command
                // var result = await connection.ExecuteScalarAsync<string>(sql);
                connection.Execute(sql);

                // Return true if insertion was successful

            }

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }




            return Ok();
        }



        private async Task SendSMSApprovalTable(IDbConnection connection, string updateids, string smsids)
        {

            string jsonsms = String.Format(@"select * from ""Examination"".""SendSmsApprovalStudentDataEx""('{0}','{1}')", updateids, smsids);
            //return Ok(db.ExamApproval.Where(s =>s.Dated.Month==month && s.CampusId == campusId &&  s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.SectionId == sectionId && s.ExamTypeId == examTypeId));
            // // Console.WriteLine(query);
            var students = this.db.ExamSmSApprovalStdData.FromSql(jsonsms);
            foreach (var student in students)
            {
                string admissionformid = student.admissionformid.ToString();
                string longUrl = $"https://cms360.thetowertech.com/report/#/id={admissionformid}&std={smsids}";

                // Shorten the long URL
                string shortenedUrl;
                try
                {
                    shortenedUrl = await ShortenUrlAsync(longUrl);
                }
                catch (Exception ex)
                {
                    // Handle the error (e.g., log it) and skip sending this message
                    Console.WriteLine($"Failed to shorten URL for AdmissionFormId {admissionformid}: {ex.Message}");
                    continue; // Skip this iteration
                }

                // Construct and replace placeholders in the message
                string message = "Dear Parent, Kindly visit #TinyURL# to view the attendance & academic report.";
                message = message.Replace("#TinyURL#", shortenedUrl);

                // Format the contact number to add country code



                SmsSys msgModel = new SmsSys
                {
                    MessageId = Guid.NewGuid(),
                    MessageNo = student.parentcontactno,
                    MessageText = message,
                    QuedDate = DateTime.UtcNow,
                    SendDate = DateTime.UtcNow,
                    SendTo = student.parentcontactno,
                    Status = 1,
                    SmsApId = Guid.Parse("c3c57cd7-16fd-43fd-8949-ce79c693366e"),
                    AdmissionFormId = Guid.Parse(admissionformid),
                    CampusProgramId = student.campusprogramid
                };


                // SQL command to call the PostgreSQL function
                string sql = String.Format(@"SELECT * from ""Examination"".""insertsmssystable""('{0}','{1}','{2}','{3}')", msgModel.MessageNo, msgModel.MessageNo, msgModel.AdmissionFormId, msgModel.CampusProgramId);

                // Execute the SQL command
                // var result = await connection.ExecuteScalarAsync<string>(sql);
                connection.Execute(sql);

                // Return true if insertion was successful

            }


        }




        // private static readonly HttpClient client = new HttpClient();
        // public async Task<string> ShortenUrlAsync(string dynamicUrl)
        // {
        //     // Define the API endpoint
        //     string apiUrl = "https://bitx.at/api/";

        //     // Prepare form data
        //     var formData = new MultipartFormDataContent
        // {
        //     { new StringContent("tower"), "username" },
        //     { new StringContent("tower@pc_987"), "password" },
        //     { new StringContent(dynamicUrl), "url" }
        // };

        //     try
        //     {
        //         // Send the POST request
        //         var response = await client.PostAsync(apiUrl, formData);

        //         // Ensure the request was successful
        //         response.EnsureSuccessStatusCode();

        //         // Read the response content
        //         string result = await response.Content.ReadAsStringAsync();

        //         return result; // Return the response from the API
        //     }
        //     catch (Exception ex)
        //     {
        //         // Handle any errors (e.g., logging)
        //         Console.WriteLine($"Error calling API: {ex.Message}");
        //         return null; // or throw ex; depending on your error handling strategy
        //     }
        // }

        private static readonly HttpClient client = new HttpClient();

        public async Task<string> ShortenUrlAsync(string dynamicUrl)
        {
            // Define the API endpoint
            string apiUrl = "https://bitx.at/api/";

            // Prepare the form data
            var formData = new[]
            {
        new KeyValuePair<string, string>("username", "tower"),
        new KeyValuePair<string, string>("password", "tower@pc_987"),
        new KeyValuePair<string, string>("url", dynamicUrl)
    };

            try
            {
                // Send the POST request with application/x-www-form-urlencoded content
                var response = await client.PostAsync(apiUrl, new FormUrlEncodedContent(formData));

                // Log the response status code
                Console.WriteLine($"Response Status Code: {response.StatusCode}");

                // Ensure the request was successful
                response.EnsureSuccessStatusCode();

                // Read the response content
                string result = await response.Content.ReadAsStringAsync();


                // Log the raw result for debugging
                Console.WriteLine($"Response Content: {result}");
                //var responseList = System.Text.Json.JsonSerializer.Deserialize<List<BitxResponse>>(result);

                var responseList = JsonConvert.DeserializeObject<List<BitxResponse>>(result);

                if (responseList != null && responseList.Count >
                 0)
                {
                    return responseList[0].Bitx; // Re
                }

                return null; // Return null if no shortened URL is found
                             // return result; // Return the response from the API
            }
            catch (HttpRequestException httpRequestException)
            {
                // Handle any errors (e.g., logging)
                Console.WriteLine($"HTTP Request Error: {httpRequestException.Message}");
                return null; // or throw httpRequestException; depending on your error handling strategy
            }
            catch (Exception ex)
            {
                // Handle any other exceptions
                Console.WriteLine($"Error calling API: {ex.Message}");
                return null; // or throw ex; depending on your error handling strategy
            }
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteExamination([FromBody] Predicate model)
        {
            var obj = new Predicate() { ProvidedString = "" };

            IDbConnection connection = db.Database.GetDbConnection();
            var updateids = model.ProvidedString;
            var Data = this.log.GetLog();
            string json = String.Format("SELECT \"Examination\".\"DeleteExam\"('{0}','{1}') as \"ProvidedString\"", updateids, Data);



            //string json = String.Format("UPDATE \"Examination\".\"ExamMaster\" SET \"IsApproved\" = true WHERE \"ExamMasterId\" IN ({0})", updateids);
            // Console.WriteLine(jsonsms);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ProvidedString = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;
            //connection.Execute(jsonsms);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj.ProvidedString);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertBulkExamAdmin([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();
            var examcourse = model.ProvidedString.Split("?")[0];
            var examstudent = model.ProvidedString.Split("?")[1];

            string json = String.Format("SELECT \"Examination\".\"UpdateExamBulkAdmin\"('{0}','{1}')", examcourse, examstudent);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateBulkVM([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format("UPDATE \"Examination\".\"ExamMaster\" SET \"IsApproved\" = true WHERE \"ExamMasterId\" IN ({0})", model.ProvidedString);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UnApprovedExam([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format("UPDATE \"Examination\".\"ExamMaster\" SET \"IsApproved\" = false WHERE \"ExamMasterId\" IN ({0})", model.ProvidedString);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamApprovalData([FromBody] Predicate predicate)
        {
            // var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            // var sessionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var month = predicate.ProvidedString.Split("?")[1];
            var examTypeId = new Guid(predicate.ProvidedString.Split("?")[2]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""VWExamApproval"" where ""SectionCourseLinkId""= '{0}' and ""ExamTypeId"" = '{1}' and left(""ExamDate""::text,7)='{2}'", sectioncourselinkId, examTypeId, month);
            //return Ok(db.ExamApproval.Where(s =>s.Dated.Month==month && s.CampusId == campusId &&  s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.SectionId == sectionId && s.ExamTypeId == examTypeId));
            // // Console.WriteLine(query);
            return Ok(this.db.ExamApproval.FromSql(query));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamScheduleName([FromBody] Predicate predicate)
        {

            //     var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            //     var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            //     var programId = new Guid(model.ProvidedString.Split("?")[2]);
            //     var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            //     var classId = new Guid(model.ProvidedString.Split("?")[4]);
            //     var sectionId = new Guid(model.ProvidedString.Split("?")[5]);       
            //    var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[6]);
            //     string sql = String.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleName""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionId, campusId, programId, programDetailId, classId, sectionId, sectioncourselinkId);
            // Console.WriteLine(sql);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var query = string.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleName""('{0}') ", sectioncourselinkId);

            return Ok(this.db.ExamScheduleName.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamScheduleNameNewList([FromBody] Predicate predicate)
        {

            //     var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            //     var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            //     var programId = new Guid(model.ProvidedString.Split("?")[2]);
            //     var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            //     var classId = new Guid(model.ProvidedString.Split("?")[4]);
            //     var sectionId = new Guid(model.ProvidedString.Split("?")[5]);       
            //    var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[6]);
            //     string sql = String.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleName""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionId, campusId, programId, programDetailId, classId, sectionId, sectioncourselinkId);
            // Console.WriteLine(sql);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var query = string.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleNameEx""('{0}') ", sectioncourselinkId);

            return Ok(this.db.ExamScheduleName.FromSql(query));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamAssessmentScheduleNameNewList([FromBody] Predicate predicate)
        {

            //     var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            //     var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            //     var programId = new Guid(model.ProvidedString.Split("?")[2]);
            //     var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            //     var classId = new Guid(model.ProvidedString.Split("?")[4]);
            //     var sectionId = new Guid(model.ProvidedString.Split("?")[5]);       
            //    var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[6]);
            //     string sql = String.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleName""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionId, campusId, programId, programDetailId, classId, sectionId, sectioncourselinkId);
            // Console.WriteLine(sql);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var type = (predicate.ProvidedString.Split("?")[1]);
            var query = string.Format(@"SELECT * FROM ""Assessment"".""GetExamAssessmentScheduleNameExNew""('{0}' , '{1}') ", sectioncourselinkId, type);

            return Ok(this.db.ExamScheduleNameEx.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamAssessmentScheduleUnapprovalNameNewList([FromBody] Predicate predicate)
        {


            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var examname = (predicate.ProvidedString.Split("?")[1]);
            var examtype = (predicate.ProvidedString.Split("?")[2]);

            var query = string.Format(@"SELECT * FROM ""Assessment"".""AssessmentExamUnApprovalNewInterface""('{0}' , '{1}', '{2}') ", sectioncourselinkId, examname, examtype);

            return Ok(this.db.ExamApproval.FromSql(query));
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamTypeNameEx([FromBody] Predicate predicate)
        {

            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var CampusprogramId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[5]);
            var query = string.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleNameEx""('{0}','{1}','{2}','{3}','{4}','{5}') ",
            sessionId, campusId, programId, CampusprogramId, classId, sectioncourselinkId);

            return Ok(this.db.ExaminationExamTypeEx.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamTypeNameCourse([FromBody] Predicate predicate)
        {

            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var CampusprogramId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[5]);
            var query = string.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleNameEx2""('{0}','{1}','{2}','{3}','{4}','{5}') ",
            sessionId, campusId, programId, CampusprogramId, classId, sectioncourselinkId);

            return Ok(this.db.ExaminationExamTypeEx.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamTypeNameClass([FromBody] Predicate predicate)
        {

            var classId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var query = string.Format(@"SELECT * FROM ""Examination"".""GetExamScheduleNameEx3""('{0}') ", classId);
            Console.WriteLine(query);
            return Ok(this.db.ExaminationExamTypeEx.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamApprovalDataExDel([FromBody] Predicate predicate)
        {
            // var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            // var sessionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var month = predicate.ProvidedString.Split("?")[1];
            var examTypeId = new Guid(predicate.ProvidedString.Split("?")[2]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""VWExamApproval"" where ""SectionCourseLinkId""= '{0}' and ""ExamTypeId"" = '{1}' and left(""ExamDate""::text,7)='{2}' and ""StatusId""!=2", sectioncourselinkId, examTypeId, month);
            //return Ok(db.ExamApproval.Where(s =>s.Dated.Month==month && s.CampusId == campusId &&  s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.SectionId == sectionId && s.ExamTypeId == examTypeId));
            // // Console.WriteLine(query);
            return Ok(this.db.ExamApproval.FromSql(query));
        }


        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetExamApprovalDataEx2([FromBody] Predicate predicate)
        // {
        //     // var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //     // var sessionid = new Guid(predicate.ProvidedString.Split("?")[1]);
        //     // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
        //     var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //     var examTypeId = (predicate.ProvidedString.Split("?")[1]);

        //     var query = string.Format(@"SELECT * FROM ""Examination"".""VWExamApprovalExam2"" where ""SectionCourseLinkId""= '{0}' and ""ExamName"" = '{1}' and  ""StatusId""!=2", sectioncourselinkId, examTypeId);
        //     //return Ok(db.ExamApproval.Where(s =>s.Dated.Month==month && s.CampusId == campusId &&  s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.SectionId == sectionId && s.ExamTypeId == examTypeId));
        //     // // Console.WriteLine(query);
        //     return Ok(this.db.ExamApproval.FromSql(query));
        // }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamApprovalDataEx2([FromBody] Predicate predicate)
        {
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var examname = (predicate.ProvidedString.Split("?")[1]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""ExamApprovalNewInterface""('{0}','{1}')", sectioncourselinkId, examname);

            return Ok(this.db.ExamApprovalNew.FromSql(query));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamSMSApprovalData([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var month = (predicate.ProvidedString.Split("?")[4]);
            var status = (predicate.ProvidedString.Split("?")[5]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""ExamSmsApprovallist""('{0}','{1}','{2}','{3}','{4}','{5}')", sessionid, campusid, programid, classid, month,status);

            return Ok(this.db.ExamSmsApprovalNew.FromSql(query));
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamSMSApprovalDataPopup([FromBody] Predicate predicate)
        {
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);

            var month = (predicate.ProvidedString.Split("?")[1]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""ExamSmsApprovallistPopup""('{0}','{1}')", sectioncourselinkId, month);

            return Ok(this.db.ExamSmsApprovalNewPopup.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAssessmentExamApprovalData([FromBody] Predicate predicate)
        {
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var examname = (predicate.ProvidedString.Split("?")[1]);
            var type = (predicate.ProvidedString.Split("?")[2]);

            var query = string.Format(@"SELECT * FROM ""Assessment"".""AssessmentExamApprovalNewInterface""('{0}','{1}','{2}')", sectioncourselinkId, examname, type);

            return Ok(this.db.ExamApprovalNew.FromSql(query));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsExamDetail([FromBody] Predicate predicate)
        {
            var examschedulId = new Guid(predicate.ProvidedString.Split("?")[0]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""StudentsExamDetailOnClick""('{0}')", examschedulId);

            return Ok(this.db.GetStudentExamDetail.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamUnApprovalData([FromBody] Predicate predicate)
        {
            // var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            // var sessionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var month = predicate.ProvidedString.Split("?")[1];
            var examTypeId = new Guid(predicate.ProvidedString.Split("?")[2]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""VWExamUnApproval"" where ""SectionCourseLinkId""= '{0}' and ""ExamTypeId"" = '{1}' and left(""ExamDate""::text,7)='{2}'", sectioncourselinkId, examTypeId, month);
            //return Ok(db.ExamApproval.Where(s =>s.Dated.Month==month && s.CampusId == campusId &&  s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.SectionId == sectionId && s.ExamTypeId == examTypeId));
            // // Console.WriteLine(query);
            return Ok(this.db.ExamApproval.FromSql(query));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamUnApprovalDataExam2([FromBody] Predicate predicate)
        {
            // var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            // var sessionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var sectioncourselinkId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var examTypeId = (predicate.ProvidedString.Split("?")[1]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""VWExamUnApprovalExam2"" where ""SectionCourseLinkId""= '{0}' and ""ExamName"" = '{1}' ", sectioncourselinkId, examTypeId);
            //return Ok(db.ExamApproval.Where(s =>s.Dated.Month==month && s.CampusId == campusId &&  s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.SectionId == sectionId && s.ExamTypeId == examTypeId));
            // // Console.WriteLine(query);
            return Ok(this.db.ExamApproval.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentResultCard([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var month = predicate.ProvidedString.Split("?")[5];
            var examTypeId = new Guid(predicate.ProvidedString.Split("?")[6]);

            var query = string.Format(@"SELECT * FROM ""Examination"".""ExamStudentResultReport""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionid, campusId, programDetailId, classid, sectionId, examTypeId, month);

            return Ok(this.db.ExamStudentResult.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamResultApprovalData([FromBody] Predicate predicate)
        {
            var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);

            return Ok(db.ExamResultApproval.Where(s => s.CampusId == campusId && s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionId == sectionId));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByVM([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);

            return Ok(db.ExaminationExamMasterVM.Where(s => s.SessionId == sessionid && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.StatusId == 1));

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamMaster).Assembly);
            Expression<Func<ExaminationExamMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] ExaminationExamMaster entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] ExaminationExamMaster entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<ExaminationExamMaster> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<ExaminationExamMaster> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] ExaminationExamMaster entity)
        {
            this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] ExaminationExamMaster entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] ExaminationExamMaster entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] ExaminationExamMaster entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Examination.ExamMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamMaster).Assembly);
            Expression<Func<ExaminationExamMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamMaster).Assembly);
            Expression<Func<ExaminationExamMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        public partial class BitxResponse
        {
            public string Bitx { get; set; } // Maps to the "bitx" key in the JSON
        }
    }
}