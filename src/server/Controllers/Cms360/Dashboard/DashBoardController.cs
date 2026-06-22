
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using System.Diagnostics;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;

using Cms360.Server.Atributes;

using Newtonsoft.Json;
using Cms360.Data;
using Dapper;

using Microsoft.EntityFrameworkCore;
using System.Data;
using Cms360.Contract;
using Newtonsoft.Json.Serialization;
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    // [Loggings]
    [IgnoreAntiforgeryToken]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class PublicDashBoardController : Controller
    {
        private readonly IPublicVWDashBoardVMRepository repository;

        private readonly IPublicStudentFeeCountVMRepository repositoryVM;


        private readonly IUserLogService log;
        private readonly DbContextBase db;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly IARVOConfigurationRepository arvorepositoryEx;
        public PublicDashBoardController(IUserLogService log, DbContextBase db, IPublicVWDashBoardVMRepository repository, IPublicStudentFeeCountVMRepository repositoryVM, IDomainContextResolver Resolver, IARVOConfigurationRepository arvorepositoryEx)
        {
            this.repository = repository;
            this.repositoryVM = repositoryVM;
            this.log = log;
            this.db = db;
            this.Resolver = Resolver;
            this.arvorepositoryEx = arvorepositoryEx;
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

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.db.VWDashBoardVMA);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFeeCount()
        {
            return Ok(this.repositoryVM.All());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationDashboard([FromBody] Predicate model)
        {
            // try
            // {
            // var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            // var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            // var inst = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            // string sql = String.Format(@"SELECT * FROM ""Fee"".""FeeDeafulterEx""('{0}','{1}',{2})", sessionid, campusid, inst);


            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]);
            var classId = new Guid(model.ProvidedString.Split("?")[3]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[4]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[5]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""NotificationDashboardEx""('{0}','{1}','{2}','{3}','{4}',{5}) ORDER BY ""CourseName""", sessionid, campusid, programId, classId, sectionId, userId);
            return Ok(this.db.NotificationDashboardListEx.FromSql(sql));
            // }
            // catch (Exception err)
            // {
            //     AppException app = new AppException();
            //     app.Message = "Error on NotificationDashboard, " + err.Message;
            //     app.Time = DateTime.Now;
            //     app.Data = JsonConvert.SerializeObject(model);
            //     this.db.AppException.Add(app);
            //     this.db.SaveChangesAsync();
            //     return BadRequest(app.Message);
            // }
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationDashboardCampusWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""NotificationDashboardEx""('{0}','{1}',{2}) ORDER BY ""CourseName""", sessionid, campusid, userId);
            return Ok(this.db.NotificationDashboardListEx.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAll([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingAll""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingList.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllEx([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingAll""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }
        //December Survey 2021
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllEx2([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyRatingAll""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }
        //December Survey 2021

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllEx3([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyRatingAllEX""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingList.FromSql(sql));

        }

        //April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllApril([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022SurveyRatingAll""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }
        //April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllAprilEx([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022SurveyRatingAllEX""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingList.FromSql(sql));

        }
        //April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllJanuary23([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllJAnuary2023""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }

        //july Survey 2023
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllJuly23([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllJuly2023""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }

        //jun Survey 2024
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllJun24([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllJun2024""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllEbook24([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllEbook2024""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }
        //April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllExJanuary23([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""CityCompresionSurveyRatingAllEXJanuary23""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingList.FromSql(sql));

        }

        //July Survey 2023
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllExJuly23([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""CityCompresionSurveyRatingAllEXJuly23""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingList.FromSql(sql));

        }

        //Jun Survey 2024
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllExJun24([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""CityCompresionSurveyRatingAllEXJun24""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllExEBook24([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""CityCompresionSurveyRatingAllEXEbook24""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllEBook2024([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllEBook2024""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationDashboardSessionWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""NotificationDashboardEx""('{0}',{1}) ORDER BY ""CourseName""", sessionid, userId);
            return Ok(this.db.NotificationDashboardListEx.FromSql(sql));

        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCMSQuizLogin([FromBody] Predicate model)
        {
            var email = model.ProvidedString.Split("?")[0];
            var type = model.ProvidedString.Split("?")[1];

            try
            {
                // Set up the command to execute the function
                using (var command = this.db.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = $@"SELECT * FROM ""Dashboard"".""GetCMSQuizLogin""('{email}','{type}')";
                    command.CommandType = CommandType.Text;

                    // Open the connection if not already open
                    if (command.Connection.State != ConnectionState.Open)
                        command.Connection.Open();

                    // Execute the command and retrieve the JSON result
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Capture the JSON result as a string
                            var jsonResult = reader.GetString(0);

                            if (jsonResult.Contains("no_data_found"))
                            {
                                return Ok("no_data_found");
                            }

                            List<QuizQuestion> quizQuestions = JsonConvert.DeserializeObject<List<QuizQuestion>>(jsonResult);


                            // Deserialize the JSON data and return it
                            return Ok(quizQuestions);
                        }
                        else
                        {
                            return NotFound(new { message = "No data found for the provided email" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle any errors
                return StatusCode(500, new { message = "An error occurred while fetching data", details = ex.Message });
            }
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertCMSQuizResponse([FromBody] List<QuizQuestion> model)
        {

            var jsonValue = JsonConvert.SerializeObject(model, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                Formatting = Formatting.Indented // Optional: for pretty-printing
            });


            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Dashboard"".""InsertCMSQuizResponse""('{0}')", jsonValue);
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


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult ReAttemptCMSQuiz([FromBody] Predicate model)
        {


            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Dashboard"".""ReAttemptCMSQuiz""('{0}')", model.ProvidedString);
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


        [HttpPost]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult CMSQuizStatus([FromBody] Predicate param)
        {

            var admissionFormId = new Guid(param.ProvidedString.Split("?")[0]);
            var rtv = new RTV() { ReturnValue = "" };

            IDbConnection connection = db.Database.GetDbConnection();

            try
            {
                string json = String.Format("SELECT \"Dashboard\".\"CMSQuizStatus\"('{0}') as ProvidedString", admissionFormId);

                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                rtv.ReturnValue = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;



                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }
                return Ok(rtv);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        [HttpPost]
        // [Authorize]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetSurveyDetail2([FromBody] Predicate model)
        {
            var survey = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingAllEXJanuary23""('{0}','{1}','{2}')", survey, admissionformid, classid);


            EbooksData arvobooklist = new EbooksData();
            var result = this.db.GetSurveyDetail.FromSql(sql).ToList();
            if (result.Count > 0)
            {
                arvobooklist = GetARVOEbooks(result[0].UserName);
            }

            var courseNames = new List<string>();
            if (arvobooklist.SubjectBooks != null)
            {

                foreach (var subjectBook in arvobooklist.SubjectBooks)
                {
                    foreach (var book in subjectBook.BookHashes)
                    {
                        courseNames.Add($"{{\"CourseName\": \"{book.Title}\"}}");
                    }
                }
            }

            // Create a JSON string representation
            string coursesName = $"[{string.Join(", ", courseNames)}]";


            foreach (var item in result)
            {

                if (item.Query == "Books")
                {

                    item.CoursesName = coursesName;
                }

            }

            //  foreach (var item in result)
            // {

            //     if (item.Query == "Books")
            //     {

            //         item.Query = "courses";
            //     }

            // }

            return Ok(result);

        }

        public EbooksData GetARVOEbooks(string username)
        {
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();

            // string providedString = model.ProvidedString;
            // string[] parts = providedString.Split('?');
            string organization = "cms";
            string userEmail = username;

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 10);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "10");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();



                // Call the API to get the ebook data
                EbooksData resdata = GetARVOQREbookApi(_config, organization, userEmail).Result;

                // Create a new list to hold the transformed SubjectBooks
                var transformedSubjectBooks = new List<SubjectBook>();

                // Loop through each SubjectBook and separate each BookHash into its own SubjectBook
                foreach (var subjectBook in resdata.SubjectBooks)
                {
                    foreach (var book in subjectBook.BookHashes)
                    {
                        // Create a new SubjectBook for each BookHash
                        transformedSubjectBooks.Add(new SubjectBook
                        {
                            Subject = subjectBook.Subject,
                            BookHashes = new List<BookHash> { book }
                        });
                    }
                }

                // Replace the original SubjectBooks with the transformed list
                resdata.SubjectBooks = transformedSubjectBooks;

                // Return the modified response
                return resdata;
            }
            catch (Exception ex)
            {
                return new EbooksData();
            }
            finally
            {
                client.Dispose();
            }
        }



        [HttpPost]
        [Route("[action]")]
        private async Task<EbooksData> GetARVOQREbookApi(ARVOConfiguration _config, string organization, string userEmail)
        {
            EbookApiResponse resp = new EbookApiResponse();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organizationCode = organization,
                email = userEmail,
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<EbookApiResponse>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<EbookApiResponse>(responseData);
                    }

                }
            }



            return resp.Data;

        }

        private static readonly object updateLock = new object();


        private async Task<ARVOConfiguration> ARVOLoginEx(ARVOConfiguration _config)
        {
            // SAMS_Configurations _config = await _unitOfWork.SAMS_Configurations.GetFirstOrDefaultAsync(r => r.srNo == 1);

            lock (updateLock)
            {
                if (_config != null)
                {
                    var loginRequest = new
                    {
                        email = _config.ARVOLoginEmail,
                        password = _config.ARVOLoginPassword
                    };

                    string jsonRequest = JsonConvert.SerializeObject(loginRequest);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    using (HttpClient client = new HttpClient())
                    {
                        HttpResponseMessage response = client.PostAsync(_config.LoginURL, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = response.Content.ReadAsStringAsync().Result;
                            JObject json = JObject.Parse(responseData);
                            _config.ARVOAccessToken = json["data"]["token"].ToString();
                            arvorepositoryEx.Update(_config);
                        }
                    }


                }
            }

            return _config;
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllSurveyOptionWise()
        {

            List<SurveyDetailActiveVM> detail = this.db.SurveyDetailActiveVM.ToList();
            SurveyReturnObj surveyReturnObj;
            List<SurveyReturnObj> returnList = new List<SurveyReturnObj>();
            foreach (var item in detail)
            {
                surveyReturnObj = new SurveyReturnObj();
                surveyReturnObj.SurveyDetailActiveVM.SurveyDetailId = item.SurveyDetailId;
                surveyReturnObj.SurveyDetailActiveVM.SurveyMasterId = item.SurveyMasterId;
                surveyReturnObj.SurveyDetailActiveVM.Question = item.Question;
                surveyReturnObj.SurveyDetailActiveVM.SurveyDetailDescription = item.SurveyDetailDescription;
                surveyReturnObj.SurveyDetailActiveVM.Query = item.Query;
                surveyReturnObj.SurveyDetailActiveVM.ControlType = item.ControlType;
                surveyReturnObj.SurveyDetailActiveVM.SurveyName = item.SurveyName;
                surveyReturnObj.SurveyDetailActiveVM.SurveyDescription = item.SurveyDescription;
                surveyReturnObj.Options.AddRange(JsonConvert.DeserializeObject<List<Options>>(item.Operation));
                returnList.Add(surveyReturnObj);
            }
            return Ok(returnList);
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllSurvey()
        {

            // SurveyDetailActiveVM detail=this.db.SurveyDetailActiveVM.ToList();
            // SurveyReturnObj surveyReturnObj;
            // List<SurveyReturnObj> returnList=new List<SurveyReturnObj>();
            // foreach(var item in detail){
            //     surveyReturnObj=new SurveyReturnObj();
            //     surveyReturnObj.SurveyDetailActiveVM=item;
            //     surveyReturnObj.Options.AddRange(JsonConvert.DeserializeObject<List<Options>>(item.Operation));
            //     returnList.Add(surveyReturnObj);
            // }
            return Ok(this.db.SurveyMaster.Select(p => new { p.SurveyMasterId, p.Name }).ToList());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetNotificationDashboardProgramWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""NotificationDashboardEx""('{0}','{1}','{2}',{3}) ORDER BY ""CourseName""", sessionid, campusid, programId, userId);
            return Ok(this.db.NotificationDashboardListEx.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCalculateMonthAverageSession([FromBody] Predicate model)
        {
            var courseid = new Guid(model.ProvidedString.Split("?")[0]);
            var teacherid = new Guid(model.ProvidedString.Split("?")[1]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[2]);
            var subCity = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""CalculateMonthAverage""('{0}','{1}','{2}','{3}',{4})", courseid, teacherid, sessionid, subCity, userId);
            return Ok(this.db.CalculateMonthAverageList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCalculateMonthAverageCampus([FromBody] Predicate model)
        {
            var courseid = new Guid(model.ProvidedString.Split("?")[0]);
            var teacherid = new Guid(model.ProvidedString.Split("?")[1]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var subCity = model.ProvidedString.Split("?")[4];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[5]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""CalculateMonthAverage""('{0}','{1}','{2}','{3}','{4}',{5})", courseid, teacherid, sessionid, campusid, subCity, userId);
            return Ok(this.db.CalculateMonthAverageList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCalculateMonthAverageProgram([FromBody] Predicate model)
        {
            var courseid = new Guid(model.ProvidedString.Split("?")[0]);
            var teacherid = new Guid(model.ProvidedString.Split("?")[1]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var subCity = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""CalculateMonthAverage""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", courseid, teacherid, sessionid, campusid, programid, subCity, userId);
            return Ok(this.db.CalculateMonthAverageList.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCalculateMonthAverageSection([FromBody] Predicate model)
        {
            var courseid = new Guid(model.ProvidedString.Split("?")[0]);
            var teacherid = new Guid(model.ProvidedString.Split("?")[1]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var sectionid = new Guid(model.ProvidedString.Split("?")[6]);
            var subCity = model.ProvidedString.Split("?")[7];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[8]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""CalculateMonthAverage""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}',{8})", courseid, teacherid, sessionid, campusid, programid, classid, sectionid, subCity, userId);
            return Ok(this.db.CalculateMonthAverageList.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionCount([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var roleDashboardId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Role"".""AdmissionCount""({0},{1}) as ""AdmissionCountWiz"" ", userId, roleDashboardId);
            return Ok(this.db.AdmissionCount.FromSql(sql));

        }


        [HttpGet]
        [Route("[action]")]
        public IActionResult GetSurvey2()
        {

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurvey""()");
            return Ok(this.db.Survey2.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult GetSurvey3([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyEx""('{0}','{1}')", fromDate, toDate);
            return Ok(this.db.Survey2.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult TotalSurveyExJan23([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyExJan23""('{0}','{1}')", fromDate, toDate);
            return Ok(this.db.Survey2.FromSql(sql));

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult TotalSurveyExJul23([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyExJul23""('{0}','{1}')", fromDate, toDate);
            return Ok(this.db.Survey2.FromSql(sql));

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult TotalSurveyExJan25([FromBody] Predicate model)
        {
            var surveymasterid = new Guid(model.ProvidedString.Split("?")[0]);
            var surveymasteridd = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymasterid3 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyExJan2025""('{0}','{1}','{2}')", surveymasterid, surveymasteridd, surveymasterid3);
            return Ok(this.db.Survey2.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult TotalSurveyExJan26([FromBody] Predicate model)
        {
            var surveymasterid = new Guid(model.ProvidedString.Split("?")[0]);
            var surveymasteridd = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymasterid3 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyExJan2026""('{0}','{1}','{2}')", surveymasterid, surveymasteridd, surveymasterid3);
            return Ok(this.db.Survey26.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult TotalSurveyExJun24([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyExJun24""('{0}','{1}')", fromDate, toDate);
            return Ok(this.db.Survey2.FromSql(sql));

        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult TotalSurveyEbooks24([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            // var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyEbooks24""('{0}')", fromDate);
            return Ok(this.db.Survey2.FromSql(sql));

        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult TotalSurveyJanuary2024([FromBody] Predicate model)
        {
            var surveya = model.ProvidedString.Split("?")[0];
            var surveyb = model.ProvidedString.Split("?")[1];
            var surveyc = model.ProvidedString.Split("?")[2];
            var surveyd = model.ProvidedString.Split("?")[3];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyJanuary2024""('{0}','{1}','{2}','{3}')", surveya, surveyb, surveyc, surveyd);
            return Ok(this.db.TotalSurveyJanuary2024.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult TotalSurveyJanuary2025([FromBody] Predicate model)
        {
            var surveya = model.ProvidedString.Split("?")[0];
            var surveyb = model.ProvidedString.Split("?")[1];
            var surveyc = model.ProvidedString.Split("?")[2];
            // var surveyd = model.ProvidedString.Split("?")[3];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyJanuary2025""('{0}','{1}','{2}')", surveya, surveyb, surveyc);
            return Ok(this.db.TotalSurveyJanuary2024.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]

        [Route("[action]")]
        public IActionResult GetSurvey3pree([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyExpree""('{0}','{1}')", fromDate, toDate);
            return Ok(this.db.Survey2.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTotalSurvey([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""TotalSurvey""('{0}','{1}','{2}')", fromDate, toDate, userId);
            return Ok(this.db.Survey.FromSql(sql));

        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult InsertSurvey([FromBody] SurveyParam model)
        {

            SurveyResult obj = new SurveyResult();
            obj.SurveyResultId = Guid.NewGuid();
            obj.AdmissionFormId = model.AdmissionFormId;
            obj.SurveyMasterId = model.SurveyMasterId;
            obj.Options = model.List;
            obj.Dated = DateTime.Now;
            obj.StatusId = 1;
            var item = this.db.SurveyResult.Where(s => s.AdmissionFormId == obj.AdmissionFormId && s.SurveyMasterId == obj.SurveyMasterId).ToList().FirstOrDefault();
            if (item == null)
            {
                this.db.SurveyResult.Add(obj);

            }
            else
            {
                return BadRequest("You have already submitted this survey.");
            }

            this.db.SaveChanges();
            return Ok("Your response has been submitted successfully.");

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyList([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""Test""('{0}','{1}',{2}) ORDER BY ""TotalSubmitted"" DESC", fromDate, toDate, userId);
            return Ok(this.db.SurveyList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTopTeachers([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""TopTeachers""('{0}','{1}',{2}) ORDER BY ""Average"" DESC LIMIT 5", fromDate, toDate, userId);
            return Ok(this.db.TopTeachers.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetBottomTeachers([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""TopTeachers""('{0}','{1}',{2}) ORDER BY ""Average"" ASC LIMIT 5", fromDate, toDate, userId);
            return Ok(this.db.TopTeachers.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetGraphData([FromBody] Predicate model)
        {
            var courseId = new Guid(model.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var fromDate = model.ProvidedString.Split("?")[3];
            var toDate = model.ProvidedString.Split("?")[4];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[5]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""RatingGraphSecWise""('{0}','{1}','{2}','{3}','{4}',{5})", courseId, subCityId, teacherId, fromDate, toDate, userId);
            return Ok(this.db.NotificationRatingGraph.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCapmusList([FromBody] Predicate model)
        {
            var cityId = new Guid(model.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];

            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyCityWise""('{0}','{1}','{2}','{3}')", subCityId, cityId, fromDate, toDate);
            return Ok(this.db.SurveyCampusList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCrsList([FromBody] Predicate model)
        {
            var subCityId = new Guid(model.ProvidedString.Split("?")[0]);
            var fromDate = model.ProvidedString.Split("?")[1];
            var toDate = model.ProvidedString.Split("?")[2];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyCampusWise""('{0}','{1}','{2}','{3}')  ORDER BY ""CourseName"" ", subCityId, fromDate, toDate, userId);
            return Ok(this.db.SurveyCourseList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSubjectList([FromBody] Predicate model)
        {
            var subCityId = new Guid(model.ProvidedString.Split("?")[0]);
            var courseId = new Guid(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveySubjectWise""('{0}','{1}','{2}','{3}','{4}')", subCityId, courseId, fromDate, toDate, userId);
            return Ok(this.db.SurveySubjectList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSubCityList([FromBody] Predicate model)
        {
            var cityId = new Guid(model.ProvidedString.Split("?")[0]);
            var fromDate = model.ProvidedString.Split("?")[1];
            var toDate = model.ProvidedString.Split("?")[2];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveySubCityWise""('{0}','{1}','{2}','{3}') ORDER BY ""TotalSubmitted"" DESC ", cityId, fromDate, toDate, userId);
            return Ok(this.db.SurveySubCityList.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSearch([FromBody] Predicate model)
        {
            var filterString = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx2""('{0}',{1},'{2}','{3}')", filterString, userId, fromDate, toDate);
            //string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx""('{0}',{1})", filterString, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSearchwithcity([FromBody] Predicate model)
        {
            var city = model.ProvidedString.Split("?")[0];
            var subcity = model.ProvidedString.Split("?")[1];
            var modelsearch = model.ProvidedString.Split("?")[2];
            var paramsearch = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx""('{0}','{1}','{2}','{3}',{4})", city, subcity, modelsearch, paramsearch, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }
        [Route("[action]")]
        public IActionResult GetTeacherSearchwithcityApril([FromBody] Predicate model)
        {
            var city = model.ProvidedString.Split("?")[0];
            var subcity = model.ProvidedString.Split("?")[1];
            var modelsearch = model.ProvidedString.Split("?")[2];
            var paramsearch = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx""('{0}','{1}','{2}','{3}',{4})", city, subcity, modelsearch, paramsearch, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }
        [Route("[action]")]
        public IActionResult GetTeacherSearchwithcityJuly([FromBody] Predicate model)
        {
            var city = model.ProvidedString.Split("?")[0];
            var subcity = model.ProvidedString.Split("?")[1];
            var modelsearch = model.ProvidedString.Split("?")[2];
            var paramsearch = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchExJuly""('{0}','{1}','{2}','{3}',{4})", city, subcity, modelsearch, paramsearch, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }

        [Route("[action]")]
        public IActionResult GetTeacherSearchwithcityJune24([FromBody] Predicate model)
        {
            var city = model.ProvidedString.Split("?")[0];
            var subcity = model.ProvidedString.Split("?")[1];
            var modelsearch = model.ProvidedString.Split("?")[2];
            var paramsearch = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchExJun24""('{0}','{1}','{2}','{3}',{4})", city, subcity, modelsearch, paramsearch, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSearchEX([FromBody] Predicate model)
        {
            var filterString = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx1""('{0}',{1})", filterString, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCity([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatistics""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityEX([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityEXX([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsExx""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, masterid, masterids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityDec22([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsDec22""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, masterid, masterids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsJan23([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsJan23""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, masterid, masterids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsJanuary24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterida = new Guid(model.ProvidedString.Split("?")[3]);
            var masteridb = new Guid(model.ProvidedString.Split("?")[4]);
            var masteridc = new Guid(model.ProvidedString.Split("?")[5]);
            var masteridd = new Guid(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsJanuary24""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", id, modelname, userId, masterida, masteridb, masteridc, masteridd);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsJanuary25([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterida = new Guid(model.ProvidedString.Split("?")[3]);
            var masteridb = new Guid(model.ProvidedString.Split("?")[4]);
            var masteridc = new Guid(model.ProvidedString.Split("?")[5]);
            // var masteridd = new Guid(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsJanuary25""('{0}','{1}',{2},'{3}','{4}','{5}')", id, modelname, userId, masterida, masteridb, masteridc);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsJul23([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsJul23""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, masterid, masterids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsJun24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsJun24""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, masterid, masterids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsJan25([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            var masterid3 = new Guid(model.ProvidedString.Split("?")[5]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsJan25""('{0}','{1}',{2},'{3}','{4}','{5}')", id, modelname, userId, masterid, masterids, masterid3);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
          [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsJan26([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            var masterid3 = new Guid(model.ProvidedString.Split("?")[5]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsJan26""('{0}','{1}',{2},'{3}','{4}','{5}')", id, modelname, userId, masterid, masterids, masterid3);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEbook24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var masterid = new Guid(model.ProvidedString.Split("?")[3]);
            // var masterids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEbook24""('{0}','{1}',{2},'{3}')", id, modelname, userId, masterid);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        //specific City Data
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityEX1([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        //specific City Data April
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityApril([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWise""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        //specific City Data April
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityJanuary23([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary23""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityJuly23([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJuly23""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityJun24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJun24""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityEbook24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseEBook24""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        //specific City Data April
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsCityWiseJanuary23WithBuilding([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);

            var buildingname = model.ProvidedString.Split("?")[5];
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary23WithBuilding""('{0}','{1}',{2},'{3}','{4}','{5}')", id, modelname, userId, surveymid, surveymids, buildingname);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        //specific City Data July
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsCityWiseJuly23WithBuilding([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);

            var buildingname = model.ProvidedString.Split("?")[5];
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJuly23WithBuilding""('{0}','{1}',{2},'{3}','{4}','{5}')", id, modelname, userId, surveymid, surveymids, buildingname);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsCityWiseJun24WithBuilding([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);

            var buildingname = model.ProvidedString.Split("?")[5];
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJun24WithBuilding""('{0}','{1}',{2},'{3}','{4}','{5}')", id, modelname, userId, surveymid, surveymids, buildingname);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        //specific Posession Data
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityEX1posession([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1Latest""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        //specific Posession Data
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEx1LatestJanuary23([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1LatestJanuary23""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEx1LatestJuly23([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1LatestJuly23""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEx1LatestJun24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1LatestJun24""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEx1LatestEBook([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1LatestEBook24""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        //comparision board 

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityEX2([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx2""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityEXApril([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsExApril""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyOverAll""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyOverAllResult.FromSql(sql));

        }
        //Survey December 2021 +
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposission([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyOverAllwithposission""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7}) ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
        //Survey April 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionApril([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022SurveyOverAllwithposission""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7}) ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        //Survey April 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJanuary23([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionJanuary23""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7}) ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }

        //Survey July 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJuly23([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionJuly23""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7}) ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJun24([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionJun24""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7}) ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionEbook24([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionEbook24""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7}) ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        //Survey April 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJanuary2023([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var buildingname = model.ProvidedString.Split("?")[8];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionJanuary23""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}') ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJuly2023([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var buildingname = model.ProvidedString.Split("?")[8];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionJuly23""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}') ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJun2024withbuilding([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var buildingname = model.ProvidedString.Split("?")[8];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionJun24""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}') ORDER BY ""Question"" , ""Course"" ASC", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyOverAll""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1January23([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January23SurveyOverAllCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1July23([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23SurveyOverAllCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1Jun24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24SurveyOverAllCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1Ebook24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Ebook24SurveyOverAllCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyOverAllJan2025([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyOverAllJan2025""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1January23WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            var buildingname = model.ProvidedString.Split("?")[7];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January23SurveyOverAllWithBuildingCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6},'{7}') ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1July23WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            var buildingname = model.ProvidedString.Split("?")[7];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23SurveyOverAllWithBuildingCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6},'{7}') ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1Jun24WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            var buildingname = model.ProvidedString.Split("?")[7];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24SurveyOverAllWithBuildingCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6},'{7}') ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1pre([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyOverAllpre""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResultpre.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1April([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022SurveyOverAll""('{0}','{1}','{2}','{3}','{4}','{5}',{6}) ORDER BY ""Question"" , ""Course"" ASC", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResultpreB.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeachersRating([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatings""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllList.FromSql(sql));

        }
        //December Survey 2021
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeachersRating1([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherRatings""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeachersRating1pre([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherRatingspre""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeachersRatingEx([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatings""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllList.FromSql(sql));

        }
        //December Survey 2021 
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeachersRatingEx1([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherRatings""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Dec2021TeacherRatingswithid([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherRatingswithid""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult April2022TeacherRatingswithid([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022TeacherRatingswithid""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherRatingswithidJanuary2023([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatingswithidJanuary2023""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherRatingswithidJuly2023([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatingswithidJuly2023""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherRatingswithidJun2024([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatingswithidJun2024""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult April2022TeacherRatingswithidSpecificCity([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022TeacherRatingswithidSpecificCity""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult July2023TeacherRatingswithidSpecificCity([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July2023TeacherRatingswithidSpecificCity""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Jun2024TeacherRatingswithidSpecificCity([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun2024TeacherRatingswithidSpecificCity""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Jan23TeacherRatingswithidSpecificCityWithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var building = model.ProvidedString.Split("?")[8];


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jan23TeacherRatingswithidSpecificCityWithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}')", cityid, subcityid, campusid, programid, classid, modelname, course, userId, building);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult July23TeacherRatingswithidSpecificCityWithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var building = model.ProvidedString.Split("?")[8];


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23TeacherRatingswithidSpecificCityWithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}')", cityid, subcityid, campusid, programid, classid, modelname, course, userId, building);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Jun24TeacherRatingswithidSpecificCityWithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var building = model.ProvidedString.Split("?")[8];


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24TeacherRatingswithidSpecificCityWithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}')", cityid, subcityid, campusid, programid, classid, modelname, course, userId, building);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeachersRatingEx1pre([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherRatingspre""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllList.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultEx([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyOverAll""({0}) ORDER BY ""Question"" , ""Course"" ASC", userId);
            return Ok(this.db.SurveyOverAllResult.FromSql(sql));

        }
        //December Servey 2021 
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultEx1([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyOverAll""({0}) ORDER BY ""Question"" , ""Course"" ASC", userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
        //April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultApril([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""LatestSurveyOverAll""({0},'{1}','{2}') ORDER BY ""Question"" , ""Course"" ASC", userId, surveymid, surveymids);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }  //April JAnuary23

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultJanuary23([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResultJanuary23""({0},'{1}','{2}') ORDER BY ""Question"" , ""Course"" ASC", userId, surveymid, surveymids);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultJuly23([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResultJuly23""({0},'{1}','{2}') ORDER BY ""Question"" , ""Course"" ASC", userId, surveymid, surveymids);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultJun24([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResultJun24""({0},'{1}','{2}') ORDER BY ""Question"" , ""Course"" ASC", userId, surveymid, surveymids);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultEbook24([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            // var surveymids = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResultEbook24""({0},'{1}') ORDER BY ""Question"" , ""Course"" ASC", userId, surveymid);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultEx1pre([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyOverAllpre""({0}) ORDER BY ""Question"" , ""Course"" ASC", userId);
            return Ok(this.db.Dec2021SurveyOverAllResultpre.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultEx1April([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid("3fe19a14-5186-4c20-9232-55ff46b435fd");
            var surveymids = new Guid("340a3de9-146d-4555-ae34-e8b5a7364e9d");

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""LatestSurveyOverAll""({0},'{1}','{2}') ORDER BY ""Question"" , ""Course"" ASC", userId, surveymid, surveymids);
            return Ok(this.db.Dec2021SurveyOverAllResultpre.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDash([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyCommentDash""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        // December Survey 2021 
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDash1([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyCommentDash""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        // April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashApril([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022SurveyCommentDash""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        // January 2023 Survey
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary23([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary23""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        // January 2023 Survey
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJuly23([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJuly23""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashEbook23([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashEbook23""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        // Jun 2024 Survey
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyQuestionDashJun24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyQuestionDashJuly24""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyQuestionDashEbook24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyQuestionDashEbook24""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJun24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJun24""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashEbook24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashEbook23""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }

        // January 2023 Survey With Building
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary23WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var building = new string(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary23WithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, building, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        // Jun 2024 Survey With Building

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyQuestionDashJun24WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var building = new string(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyQuestionDashJun24WithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, building, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }

        // July 2023 Survey With Building
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJuly23WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var building = new string(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJuly23WithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, building, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJun24WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var building = new string(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJun24WithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, building, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashEBook2024([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashEbook24""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        // January 2023 Survey
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary2023([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary23""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }

        // July 2023 Survey
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJuly2023([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJuly23""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJun2024([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJun24""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyQuestionDashJun2024([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyQuestionDashJun24""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyQuestionDashEbook2024([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyQuestionDashEbook24""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashEx([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyCommentDash""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        //December Survey 2021 

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashEx1([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021SurveyCommentDash""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        //April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashExApril([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022SurveyCommentDash""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurvey([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            string sql = String.Format(@"SELECT * FROM ""Message"".""TeacherTotalSurvey2023""('{0}',{1},'{2}','{3}')", teacherId, userId, fromDate, toDate);
            //string sql = String.Format(@"SELECT * FROM ""Message"".""TeacherTotalSurvey""('{0}',{1})", teacherId, userId);

            return Ok(this.db.TeacherSurvey.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyEX([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyEXApril([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyEXJanuary23([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January23TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyEXJuly23([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyEXJun24([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSection([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""TeacherGraphSecWise""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraph.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionLatest([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];

            string sql = String.Format(@"SELECT * FROM ""Message"".""TeacherGraphSecWiseLatest""('{0}',{1},'{2}','{3}')", teacherId, userId, fromDate, toDate);
            return Ok(this.db.TeacherRatingGraph.FromSql(sql));

        }
        //December survey  2021
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubject([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }
        //April survey  2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubjectApril([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }
        //January survey  2023
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubjectJanuary23([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January23TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }
        //July survey  2023
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubjectJuly23([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubjectJun24([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }
        //December Section Wise Data Teacher in Search Teacher 
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWise([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherSearchRatingsallsections""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSection.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotal([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Dec2021TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalApril([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""April2022TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary23([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January23TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJuly23([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJun24([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary23Xx([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var course = (model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January23TeacherSearchRatingsallsectionswithtotal""('{0}',{1},'{2}')", teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJuly23Xx([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var course = (model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23TeacherSearchRatingsallsectionswithtotal""('{0}',{1},'{2}')", teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJun24Xx([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var course = (model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24TeacherSearchRatingsallsectionswithtotal""('{0}',{1},'{2}')", teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary23EXx([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            var course = (model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January23TeacherSearchRatingsallsectionswithtotal""('{0}','{1}','{2}',{3},'{4}')", cityid, subcityid, teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJuly23EXx([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            var course = (model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""July23TeacherSearchRatingsallsectionswithtotal""('{0}','{1}','{2}',{3},'{4}')", cityid, subcityid, teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJun24EXx([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            var course = (model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jun24TeacherSearchRatingsallsectionswithtotal""('{0}','{1}','{2}',{3},'{4}')", cityid, subcityid, teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphMonth([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""TeacherGraphMonthWise""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphMonth.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphMonthEX([FromBody] Predicate model)
        {
            var courseId = new Guid(model.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var fromDate = model.ProvidedString.Split("?")[3];
            var toDate = model.ProvidedString.Split("?")[4];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[5]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherGraphMonthWiseEX""('{0}','{1}','{2}','{3}','{4}',{5})", courseId, subCityId, teacherId, fromDate, toDate, userId);
            return Ok(this.db.TeacherRatingGraphMonth.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetComments([FromBody] Predicate model)
        {
            var CityId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyComments""('{0}',{1})", CityId, userId);
            return Ok(this.db.DashboardComment.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCommentAll([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyComments""({0})", userId);
            return Ok(this.db.DashboardComment.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCommentsSubcity([FromBody] Predicate model)
        {
            var CityId = new Guid(model.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(model.ProvidedString.Split("?")[1]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyComments""('{0}','{1}',{2})", CityId, subCityId, userId);
            return Ok(this.db.DashboardComment.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCommentsCitySubCityDateWise([FromBody] Predicate model)
        {
            var CityId = new string(model.ProvidedString.Split("?")[0]);
            var subCityId = new string(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyCommentsEX""('{0}','{1}','{2}','{3}',{4})", CityId, subCityId, fromDate, toDate, userId);
            return Ok(this.db.DashboardComment.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherRatingList([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Message"".""NotificationTeacherWise""('{0}','{1}')", fromDate, toDate);
            return Ok(this.db.TeacherRatingList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSubjectRatingList([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var fromDate = model.ProvidedString.Split("?")[1];
            var toDate = model.ProvidedString.Split("?")[2];

            string sql = String.Format(@"SELECT * FROM ""Message"".""NotificationSubjectWise""('{0}','{1}','{2}')", teacherId, fromDate, toDate);
            return Ok(this.db.SubjectRatingList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionCountFeeWise([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var roleDashboardId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Role"".""FeePaidCount""({0},{1}) as ""AdmissionCountFeeWise"" ", userId, roleDashboardId);
            return Ok(this.db.AdmissionFeeCount.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeCountDateWise([FromBody] Predicate predicate)
        {


            var fromdate = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var todate = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            string sql = string.Format(@"select * from ""Dashboard"".""StudentFeeCount""('{0}','{1}')", fromdate, todate);
            return Ok(this.db.StudentFeeCountVM.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionSessionWiseDataEx([FromBody] Predicate predicate)
        {


            var param = predicate.ProvidedString.Split("?")[0];
            var criteria = predicate.ProvidedString.Split("?")[1];
            string sql = string.Format(@"SELECT
""Id"",
""FullName"",
""FormSubmition""::INT,
""FeePaidCount"",
((""FeePaidCount"" * 100) / ""FormSubmition""::INTEGER) ""Conversion"",
""FeePaidCountPrevious"" ""NDateAdmission"",
""FeePaidCountToday"",
""FormSubmitionPrevious""
FROM ""Dashboard"".""AdmissionSessionWiseDataEx""('{0}','{1}') WHERE ""Id"" IS NOT NULL", param, criteria);
            Console.WriteLine(sql);
            return Ok(this.db.AdmissionSessionWiseDataEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionSessionWiseDataEx2([FromBody] Predicate predicate)
        {


            var param = predicate.ProvidedString.Split("?")[0];
            var criteria = predicate.ProvidedString.Split("?")[1];
            var dated = predicate.ProvidedString.Split("?")[2];
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""AdmissionComparisonDataExx2""('{0}','{1}','{2}') WHERE ""Id"" IS NOT NULL", param, criteria, dated);
            Console.WriteLine(sql);
            return Ok(this.db.AdmissionSessionWiseDataExx2.FromSql(sql));
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionSessionWiseDataEx4([FromBody] Predicate predicate)
        {
            var param = predicate.ProvidedString.Split("?")[0];
            var criteria = predicate.ProvidedString.Split("?")[1];
            var dated = Convert.ToDateTime(predicate.ProvidedString.Split("?")[2]);
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""AdmissionComparisonDataExx4""('{0}','{1}','{2}') WHERE ""Id"" IS NOT NULL", param, criteria, dated);
            Console.WriteLine(sql);
            return Ok(this.db.AdmissionSessionWiseDataExx2.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionSessionWiseDataCampus([FromBody] Predicate predicate)
        {


            var param = predicate.ProvidedString.Split("?")[0];
            var criteria = predicate.ProvidedString.Split("?")[1];
            var dated = predicate.ProvidedString.Split("?")[2];
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""AdmissionComparisonDataCampusWise""('{0}','{1}','{2}',{3}) WHERE ""Id"" IS NOT NULL", param, criteria, dated, DomainContext.User.UserId);
            Console.WriteLine(sql);
            return Ok(this.db.AdmissionSessionWiseDataExx2.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionSessionWiseDataCampusTestingClone([FromBody] Predicate predicate)
        {


            var param = predicate.ProvidedString.Split("?")[0];
            var criteria = predicate.ProvidedString.Split("?")[1];
            var dated = predicate.ProvidedString.Split("?")[2];
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""AdmissionComparisonDataCampusWiseTesting""('{0}','{1}','{2}',{3}) WHERE ""Id"" IS NOT NULL", param, criteria, dated, DomainContext.User.UserId);
            Console.WriteLine(sql);
            return Ok(this.db.AdmissionSessionWiseDataExx2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeCountDateWiseA([FromBody] Predicate predicate)
        {


            var fromdate = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var todate = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            string sql = string.Format(@"select * from ""Dashboard"".""StudentFeeCountA""('{0}','{1}')", fromdate, todate);
            return Ok(this.db.StudentFeeCountVM.FromSql(sql));
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWDashBoardVM).Assembly);
            Expression<Func<VWDashBoardVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWDashBoardVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWDashBoardVM).Assembly);
            Expression<Func<VWDashBoardVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWDashBoardVM, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWDashBoardVM).Assembly);
            Expression<Func<VWDashBoardVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWDashBoardVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWDashBoardVM).Assembly);
            Expression<Func<VWDashBoardVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWDashBoardVM, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] VWDashBoardVM entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] VWDashBoardVM entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<VWDashBoardVM> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<VWDashBoardVM> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] VWDashBoardVM entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] VWDashBoardVM entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] VWDashBoardVM entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] VWDashBoardVM entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Public.DashBoard"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWDashBoardVM).Assembly);
            Expression<Func<VWDashBoardVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWDashBoardVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWDashBoardVM).Assembly);
            Expression<Func<VWDashBoardVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWDashBoardVM, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentFeedBack([FromBody] Predicate model)
        {
            var fromdate = model.ProvidedString.Split("?")[0];
            var todate = model.ProvidedString.Split("?")[1];
            var filter = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Setup"".""StudentAppFeedBack""('{0}','{1}',{2},'{3}')", fromdate, todate, userId, filter);
            Console.WriteLine(sql);
            return Ok(this.db.StudentFeedback.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentFeedBackAgainstStudent([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromdate = model.ProvidedString.Split("?")[1];
            var todate = model.ProvidedString.Split("?")[2];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"SELECT * FROM ""Setup"".""StudentAppFeedBackAgainstStudent""('{0}','{1}','{2}',{3})", admissionformid, fromdate, todate, userId);
            Console.WriteLine(sql);
            return Ok(this.db.StudentFeedbackAgainstStudent.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BuildingSectionData([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"select * from ""Dashboard"".""BuildingSectionData""('{0}')", campusid);
            Console.WriteLine(sql);
            return Ok(this.db.BuildingSectionData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BuildingSectionDataEx([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"select * from ""Dashboard"".""BuildingSectionDataEx""('{0}')", campusid);
            Console.WriteLine(sql);
            return Ok(this.db.BuildingSectionData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BuildingSectionDataWithSessionAndClass([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid("affe2372-1f82-45bd-bbd4-3abc2f7eb8c0");
            var classid = new Guid("10bfa10a-2582-46db-ba80-ae326fee2b48");
            string sql = String.Format(@"select * from ""Dashboard"".""BuildingSectionDataWithSessionAndClass""('{0}','{1}','{2}')", campusid, sessionid, classid);
            Console.WriteLine(sql);
            return Ok(this.db.BuildingSectionData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BuildingSectionData24([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"select * from ""Dashboard"".""BuildingSectionData24""('{0}')", campusid);
            Console.WriteLine(sql);
            return Ok(this.db.BuildingSectionData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BuildingSectionData26([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"select * from ""Dashboard"".""BuildingSectionData26""('{0}')", campusid);
            Console.WriteLine(sql);
            return Ok(this.db.BuildingSectionData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BuildingSectionData25([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"select * from ""Dashboard"".""BuildingSectionData25""('{0}')", campusid);
            Console.WriteLine(sql);
            return Ok(this.db.BuildingSectionData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary2024([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary24""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary2026([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary26""({0})", userId);
            return Ok(this.db.SurveyCommentDash26.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary2025([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary25""({0})", userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary24""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary26([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetcitySurveyCommentDashJanuary26""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash26.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary25([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary25""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary24WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var building = new string(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary24WithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, building, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary26WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var building = new string(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary26WithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, building, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash26.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCommentDashJanuary25WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var building = new string(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyCommentDashJanuary25WithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, building, programid, classid, modelname, userId);
            return Ok(this.db.SurveyCommentDash.FromSql(sql));

        }
        [Route("[action]")]
        public IActionResult GetTeacherSearchwithcityJanuary24([FromBody] Predicate model)
        {
            var city = model.ProvidedString.Split("?")[0];
            var subcity = model.ProvidedString.Split("?")[1];
            var modelsearch = model.ProvidedString.Split("?")[2];
            var paramsearch = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetTeacherSearchwithcityJanuary24""('{0}','{1}','{2}','{3}',{4})", city, subcity, modelsearch, paramsearch, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }
        
             [Route("[action]")]
        public IActionResult GetTeacherSearchwithcityJanuary26([FromBody] Predicate model)
        {
            var city = model.ProvidedString.Split("?")[0];
            var subcity = model.ProvidedString.Split("?")[1];
            var modelsearch = model.ProvidedString.Split("?")[2];
            var paramsearch = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetTeacherSearchwithcityJanuary26""('{0}','{1}','{2}','{3}',{4})", city, subcity, modelsearch, paramsearch, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }
        [Route("[action]")]
        public IActionResult GetTeacherSearchwithcityJanuary25([FromBody] Predicate model)
        {
            var city = model.ProvidedString.Split("?")[0];
            var subcity = model.ProvidedString.Split("?")[1];
            var modelsearch = model.ProvidedString.Split("?")[2];
            var paramsearch = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetTeacherSearchwithcityJanuary25""('{0}','{1}','{2}','{3}',{4})", city, subcity, modelsearch, paramsearch, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyJanuary24([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January24TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyJanuary26([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January26TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSurveyJanuary25([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January25TeacherSearchRatings""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherSurveyEX.FromSql(sql));

        }

        //January survey  2023
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubjectJanuary24([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January24TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }
           [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubjectJanuary26([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January26TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSubjectJanuary25([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January25TeacherSearchRatingsallcourses""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEX.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary24([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January24TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
       [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary26([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January26TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary25([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January25TeacherSearchRatingsallsectionswithtotal""('{0}',{1})", teacherId, userId);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSearchJanuary24([FromBody] Predicate model)
        {
            var filterString = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyTeacherSearchJanuary24""('{0}',{1},'{2}','{3}')", filterString, userId, fromDate, toDate);
            //string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx""('{0}',{1})", filterString, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSearchJanuary25([FromBody] Predicate model)
        {
            var filterString = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyTeacherSearchJanuary25""('{0}',{1},'{2}','{3}')", filterString, userId, fromDate, toDate);
            //string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx""('{0}',{1})", filterString, userId);
            return Ok(this.db.TeacherSearch.FromSql(sql));

        }

        //January Survey 2024
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllJanuary24([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllJAnuary2024""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx2.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllJanuary25([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllJAnuary2025""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx2.FromSql(sql));

        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllJanuary26([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyRatingComparisionAllJAnuary2026""('{0}','{1}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1);
            return Ok(this.db.SurveyRatingListEx2.FromSql(sql));

        }


        //April Survey 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllExJanuary24([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""CityCompresionSurveyRatingAllEXJanuary24""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingListExx2.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllExJanuary25([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""CityCompresionSurveyRatingAllEXJanuary25""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingListExx2.FromSql(sql));

        }


  [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyRatingAllExJanuary26([FromBody] Predicate model)
        {
            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid1 = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid2 = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""CityCompresionSurveyRatingAllEXJanuary26""('{0}','{1}','{2}') ORDER BY ""Order"" , ""Course"" ASC", subcityid, subcityid1, subcityid2);
            return Ok(this.db.SurveyRatingListExx2.FromSql(sql));

        }
        [HttpPost]

        [Route("[action]")]
        public IActionResult TotalSurveyExJan24([FromBody] Predicate model)
        {
            var fromDate = model.ProvidedString.Split("?")[0];
            var toDate = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TotalSurveyExJan24""('{0}','{1}')", fromDate, toDate);
            return Ok(this.db.Survey2.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEx1LatestJanuary24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1LatestJanuary24""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
           [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEx1LatestJanuary26([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1LatestJanuary26""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsEx1LatestJanuary25([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsEx1LatestJanuary25""('{0}','{1}',{2})", id, modelname, userId);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityJanuary24([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary24""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityJanuary25([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            var surveymid3 = new Guid(model.ProvidedString.Split("?")[5]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary25""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetSurveyCityJanuary26([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            var surveymid3 = new Guid(model.ProvidedString.Split("?")[5]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary26""('{0}','{1}',{2},'{3}','{4}')", id, modelname, userId, surveymid, surveymids);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsCityWiseJanuary24WithBuilding([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            var buildingname = model.ProvidedString.Split("?")[5];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary24WithBuilding""('{0}','{1}',{2},'{3}','{4}','{5}')", id, modelname, userId, surveymid, surveymids, buildingname);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }
 [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsCityWiseJanuary26WithBuilding([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            var surveymids3 = new Guid(model.ProvidedString.Split("?")[5]);
            var buildingname = model.ProvidedString.Split("?")[6];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary26WithBuilding""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", id, modelname, userId, surveymid, surveymids,surveymids3, buildingname);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SurveyStatisticsCityWiseJanuary25WithBuilding([FromBody] Predicate model)
        {
            var id = new Guid(model.ProvidedString.Split("?")[0]);
            var modelname = model.ProvidedString.Split("?")[1];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[3]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[4]);
            var surveymids3 = new Guid(model.ProvidedString.Split("?")[5]);
            var buildingname = model.ProvidedString.Split("?")[6];
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""SurveyStatisticsCityWiseJanuary25WithBuilding""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", id, modelname, userId, surveymid, surveymids, surveymids3, buildingname);
            return Ok(this.db.SurveyStatistics.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Januray24TeacherRatingswithidSpecificCity([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Januray24TeacherRatingswithidSpecificCity""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Januray26TeacherRatingswithidSpecificCity([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Januray26TeacherRatingswithidSpecificCity""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Januray25TeacherRatingswithidSpecificCity([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Januray25TeacherRatingswithidSpecificCity""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", cityid, subcityid, campusid, programid, classid, modelname, course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary24Ex([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var course = (model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetTeacherGraphSectionWisewithtotalJanuary24Ex""('{0}',{1},'{2}')", teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary26Ex([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var course = (model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetTeacherGraphSectionWisewithtotalJanuary26Ex""('{0}',{1},'{2}')", teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary25Ex([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var course = (model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetTeacherGraphSectionWisewithtotalJanuary25Ex""('{0}',{1},'{2}')", teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherRatingswithidJanuary2024([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatingswithidJanuary2024""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherRatingswithidJanuary2025([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatingswithidJanuary2025""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherRatingswithidJanuary2026([FromBody] Predicate model)
        {
            var course = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""TeacherRatingswithidJanuary2026""('{0}',{1})", course, userId);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Jan24TeacherRatingswithidSpecificCityWithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var building = model.ProvidedString.Split("?")[8];


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jan24TeacherRatingswithidSpecificCityWithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}')", cityid, subcityid, campusid, programid, classid, modelname, course, userId, building);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult Jan25TeacherRatingswithidSpecificCityWithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var building = model.ProvidedString.Split("?")[8];


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jan25TeacherRatingswithidSpecificCityWithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}')", cityid, subcityid, campusid, programid, classid, modelname, course, userId, building);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Jan26TeacherRatingswithidSpecificCityWithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var course = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);
            var building = model.ProvidedString.Split("?")[8];


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""Jan26TeacherRatingswithidSpecificCityWithBuilding""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},'{8}')", cityid, subcityid, campusid, programid, classid, modelname, course, userId, building);
            return Ok(this.db.TeacherRatingOverAllListwithid.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary24EXx([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            var course = (model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January24TeacherSearchRatingsallsectionswithtotal""('{0}','{1}','{2}',{3},'{4}')", cityid, subcityid, teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary25EXx([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            var course = (model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January25TeacherSearchRatingsallsectionswithtotal""('{0}','{1}','{2}',{3},'{4}')", cityid, subcityid, teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSectionWisewithtotalJanuary26EXx([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var teacherId = new Guid(model.ProvidedString.Split("?")[2]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            var course = (model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January26TeacherSearchRatingsallsectionswithtotal""('{0}','{1}','{2}',{3},'{4}')", cityid, subcityid, teacherId, userId, course);
            return Ok(this.db.TeacherRatingGraphEXSectionwithtotal.FromSql(sql));

        }
   
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultJanuary24([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResultJanuary24""({0},'{1}','{2}')", userId, surveymid, surveymids);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultJanuary26([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[2]);
             var surveymids3 = new Guid(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResultJanuary2026""({0},'{1}','{2}','{3}')", userId, surveymid, surveymids,surveymids3);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResultJanuary25([FromBody] Predicate model)
        {
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var surveymid = new Guid(model.ProvidedString.Split("?")[1]);
            var surveymids = new Guid(model.ProvidedString.Split("?")[2]);
            var surveymids3 = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResultJanuary25""({0},'{1}','{2}','{3}')", userId, surveymid, surveymids, surveymids3);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        //Survey April 2022
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJanuary24([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetOverAllResult1withposissionJanuary24""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJanuary25([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var programid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            var modelname = model.ProvidedString.Split("?")[6];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[7]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GeneralSurveyRatingOverAllCurrentwithposissionJan25""('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7})", PosissionType, cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1withposissionJanuary26([FromBody] Predicate model)
        {
            var PosissionType = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var modelname = model.ProvidedString.Split("?")[4];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[5]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GeneralSurveyRatingOverAllCurrentwithposissionJan26""('{0}','{1}','{2}','{3}','{4}',{5})", PosissionType, cityid, subcityid, campusid,modelname, userId);
            return Ok(this.db.April2022SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1January24WithBuilding([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            var buildingname = model.ProvidedString.Split("?")[7];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January24SurveyOverAllWithBuildingCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6},'{7}')", cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetJanuary25SurveyOverAllWithBuildingCopy([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);
            var buildingname = model.ProvidedString.Split("?")[7];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January25SurveyOverAllWithBuildingCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6},'{7}')", cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetJanuary26SurveyOverAllWithBuildingCopy([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);
            var buildingname = model.ProvidedString.Split("?")[7];

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January26SurveyOverAllWithBuildingCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6},'{7}')", cityid, subcityid, campusid, programid, classid, modelname, userId, buildingname);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1January24([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var programid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var modelname = model.ProvidedString.Split("?")[5];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""January24SurveyOverAllCopy""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", cityid, subcityid, campusid, programid, classid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOverAllResult1January26([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var modelname = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GeneralSurveyRatingOverAllCitySubcityJan26""('{0}','{1}','{2}','{3}',{4})", cityid, subcityid, campusid, modelname, userId);
            return Ok(this.db.Dec2021SurveyOverAllResult.FromSql(sql));

        }
    }


}