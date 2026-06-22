

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Newtonsoft.Json;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Cors;
using StructureMap.Diagnostics.TreeView;
using Cms360.Contract;
using common.Crypto;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [EnableCors("AllowPolicy")]
    [IgnoreAntiforgeryToken]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]

    public class QuizController : Controller
    {
        private readonly IQuizResultRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        private static readonly HttpClient client = new HttpClient();
        private static readonly object updateLock = new object();
        private readonly IARVOConfigurationRepository arvorepository;
        private readonly IARVOConfigurationRepository arvorepositoryEx;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly EncryptionService _encryptionService;

        public QuizController(IQuizResultRepository repository, EncryptionService encryptionService, DbContextBase db, IDomainContextResolver Resolver, IARVOConfigurationRepository arvorepository, IARVOConfigurationRepository arvorepositoryEx, IUserLogService log)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;
            this.arvorepository = arvorepository;
            this.arvorepositoryEx = arvorepositoryEx;
            this.Resolver = Resolver;
            _encryptionService = encryptionService;

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
            return Ok(this.repository.All());
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
            var options = ScriptOptions.Default.AddReferences(typeof(QuizResult).Assembly);
            Expression<Func<QuizResult, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<QuizResult, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(QuizResult).Assembly);
            Expression<Func<QuizResult, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<QuizResult, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllActiveAsync()
        {
            return Ok(await this.repository.FindByAsync(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(QuizResult).Assembly);
            Expression<Func<QuizResult, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<QuizResult, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(QuizResult).Assembly);
            Expression<Func<QuizResult, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<QuizResult, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] QuizResult entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Registration.CampusEmailLink"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ADDONE Controller.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] QuizResult entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<QuizResult> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<QuizResult> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] QuizResult entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] QuizResult entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] QuizResult entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] QuizResult entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(QuizResult).Assembly);
            Expression<Func<QuizResult, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<QuizResult, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(QuizResult).Assembly);
            Expression<Func<QuizResult, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<QuizResult, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetRandomQuestionByCourse([FromBody] Predicate model)
        // {
        //     GetRandomQuestionByCourseResponse resp = new GetRandomQuestionByCourseResponse();

        //     if (model == null || string.IsNullOrEmpty(model.ProvidedString))
        //     {
        //         return Ok("Invalid input data.");
        //     }

        //     var identifiers = model.ProvidedString.Split("?");
        //     if (identifiers.Length != 7)
        //     {
        //         return Ok("Invalid input format.");
        //     }

        //     if (!Guid.TryParse(identifiers[0], out Guid classId) ||
        //         !Guid.TryParse(identifiers[1], out Guid courseId) ||
        //         !Guid.TryParse(identifiers[2], out Guid configurationId) ||
        //         !Guid.TryParse(identifiers[3], out Guid academicCalendarMasterId)
        //         )
        //     {
        //         return Ok("Invalid GUID format.");
        //     }

        //     string responseContent = "";
        //     string sql = $@"SELECT * FROM ""Quiz"".""GetRandomQuestionByCourseTest""('{classId}', '{courseId}', '{configurationId}', '{academicCalendarMasterId}')";
        //     var quizIds = await this.db.GetRandomQuestionByCourse.FromSql(sql).ToListAsync();
        //     Console.WriteLine(sql);
        //     Console.WriteLine("Response **************************");
        //     var firstQuizId = quizIds.FirstOrDefault();
        //     Console.WriteLine(firstQuizId);

        //     if (firstQuizId == null || firstQuizId.QuestionId.Length == 0)
        //     {
        //         return Ok("No quiz questions found.");
        //     }

        //     var idss = firstQuizId.QuestionId;
        //     if (string.IsNullOrEmpty(idss))
        //     {
        //         return Ok("No question IDs found.");
        //     }

        //     ARVOConfiguration config = this.db.ARVOConfiguration.Where(e => e.srNo == 4 && e.FullName == "QuizMcqs").FirstOrDefault();
        //     if (config == null)
        //     {
        //         return Ok("Configuration not found.");
        //     }

        //     string apiUrl = config.BaseURL + config.APIURL;
        //     string accessToken = config.ARVOAccessToken;

        //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        //     var ids = idss.Split(',').Select(id => id.Trim()).Select(int.Parse).ToArray();
        //     var requestBody = new
        //     {
        //         organization = "CMS",
        //         ids,
        //         module = identifiers[4],
        //         userEmail = identifiers[5],
        //         organizationCode = "CMS",
        //         device= identifiers[6]
        //     };

        //     var json = JsonConvert.SerializeObject(requestBody);
        //     var content = new StringContent(json, Encoding.UTF8, "application/json");
        //     Random rng = new Random();

        //     try
        //     {
        //         HttpResponseMessage response = await client.PostAsync(apiUrl, content);
        //         responseContent = await response.Content.ReadAsStringAsync();
        //         if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
        //         {
        //             resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);
        //             //  var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
        //             // resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();
        //             return Ok(resp);
        //         }
        //         else
        //         {
        //             config = await ARVOLogin(config);
        //             accessToken = config.ARVOAccessToken;
        //             response = await client.PostAsync(apiUrl, content);
        //             responseContent = await response.Content.ReadAsStringAsync();
        //             if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
        //             {
        //                 resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);
        //                 // var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
        //                 //resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();
        //                 return Ok(resp);
        //             }
        //         }

        //         return Ok(responseContent);
        //     }
        //     catch (Exception ex)
        //     {
        //         Console.WriteLine(ex.ToString());
        //         return StatusCode(500, "Internal server error.");
        //     }
        // }




        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetRandomQuestionByCourseEncrypt([FromBody] Predicate model)
        {
            string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

            GetRandomQuestionByCourseResponse resp = new GetRandomQuestionByCourseResponse();

            if (model == null || string.IsNullOrEmpty(decryptedPayload))
            {
                return Ok("Invalid input data.");
            }

            var identifiers = decryptedPayload.Split("?");
            if (identifiers.Length != 7)
            {
                return Ok("Invalid input format.");
            }

            if (!Guid.TryParse(identifiers[0], out Guid classId) ||
                !Guid.TryParse(identifiers[1], out Guid courseId) ||
                !Guid.TryParse(identifiers[2], out Guid configurationId) ||
                !Guid.TryParse(identifiers[3], out Guid academicCalendarMasterId)
                )
            {
                return Ok("Invalid GUID format.");
            }

            string responseContent = "";
            string sql = $@"SELECT * FROM ""Quiz"".""GetRandomQuestionByCourseTest""('{classId}', '{courseId}', '{configurationId}', '{academicCalendarMasterId}')";
            var quizIds = await this.db.GetRandomQuestionByCourse.FromSql(sql).ToListAsync();
            Console.WriteLine(sql);
            Console.WriteLine("Response **************************");
            var firstQuizId = quizIds.FirstOrDefault();
            Console.WriteLine(firstQuizId);

            if (firstQuizId == null || firstQuizId.QuestionId.Length == 0)
            {
                return Ok("No quiz questions found.");
            }

            var idss = firstQuizId.QuestionId;
            if (string.IsNullOrEmpty(idss))
            {
                return Ok("No question IDs found.");
            }

            ARVOConfiguration config = this.db.ARVOConfiguration.Where(e => e.srNo == 4 && e.FullName == "QuizMcqs").FirstOrDefault();
            if (config == null)
            {
                return Ok("Configuration not found.");
            }

            string apiUrl = config.BaseURL + config.APIURL;
            string accessToken = config.ARVOAccessToken;

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var ids = idss.Split(',').Select(id => id.Trim()).Select(int.Parse).ToArray();
            var requestBody = new
            {
                organization = "CMS",
                ids,
                module = identifiers[4],
                userEmail = identifiers[5],
                organizationCode = "CMS",
                device = identifiers[6]
            };

            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            Random rng = new Random();

            try
            {
                HttpResponseMessage response = await client.PostAsync(apiUrl, content);
                responseContent = await response.Content.ReadAsStringAsync();
                if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                {
                    resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);
                    //  var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
                    // resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();
                    //return Ok(resp);

                }
                else
                {
                    config = await ARVOLogin(config);
                    accessToken = config.ARVOAccessToken;
                    response = await client.PostAsync(apiUrl, content);
                    responseContent = await response.Content.ReadAsStringAsync();
                    if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                    {
                        resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);
                        // var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
                        //resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();
                        //  return Ok(resp);
                    }
                }

                string jsonResponse = JsonConvert.SerializeObject(resp);
                string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                return Ok(encryptedResponse);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("GetQuizStatus")]
        public async Task<IActionResult> GetQuizStatus([FromBody] QuizStatusRequest model)
        {
            if (model == null)
                return BadRequest("Invalid request");

            QuizStatusResponse response = new QuizStatusResponse();

            try
            {
                //---------------------------------------------------------
                // STEP 1 — CHECK IF QUIZ ALREADY STARTED (GetLastTime)
                //---------------------------------------------------------
                string lastTimeSql = $@"
SELECT * FROM ""Quiz"".""GetLastTime""(
'{model.ConfigurationId}', 
'{model.AcademicCalendarMasterId}', 
'{model.AdmissionFormId}')";

                var lastTime = db.GetLastTime.FromSql(lastTimeSql).FirstOrDefault();
                bool quizAlreadyStarted = lastTime != null && lastTime.StartTime != null;
                response.QuizStarted = quizAlreadyStarted;
                response.QuizEnded = false;



                //---------------------------------------------------------
                // STEP 2 — FETCH COURSE LIST ALWAYS
                //---------------------------------------------------------
                string courseSql = $@"
SELECT * FROM ""Quiz"".""GetCourseList""(
'{model.ConfigurationId}', 
'{model.AdmissionFormId}')";

                var courseList = db.GetQuizCourseList.FromSql(courseSql).ToList();
                response.CourseList = courseList;
                response.TotalCourses = courseList.Count;
                int overflowSubmit = 0;

                //---------------------------------------------------------
                // CASE A: QUIZ NOT STARTED → RETURN ONLY COURSE LIST
                //---------------------------------------------------------
                if (!quizAlreadyStarted)
                {
                    response.CurrentPointer = 0;
                }
                else
                {
                    //-----------------------------------------------------
                    // CASE B: QUIZ ALREADY IN PROGRESS → SET POINTER
                    //-----------------------------------------------------
                    var attempted = courseList.Where(x => !string.IsNullOrEmpty(x.TimeTaken)).ToList();
                    response.CurrentPointer = attempted.Count;


                    if (lastTime != null)
                    {

                        var lastCourse = courseList.FirstOrDefault(x => x.CourseId == lastTime.CourseId);

                        if (lastCourse != null)
                        {
                            //-------------------------------------------------
                            // QUIZ TOTAL TIME = TestFrequency × TimePerQuestion (minutes)
                            //-------------------------------------------------
                            decimal testFrequency = lastCourse.TestFrequency;
                            decimal timePerQuestion = lastCourse.TimePerQuestion;

                            int totalTimeMinutes = (int)(testFrequency * timePerQuestion);

                            //-------------------------------------------------
                            // PARSE StartTime AND CurrentTime
                            //-------------------------------------------------
                            DateTime startTime = DateTime.Parse(lastTime.StartTime);
                            DateTime currentTime = DateTime.Parse(lastTime.CurrentTime);

                            //-------------------------------------------------
                            // ELAPSED TIME
                            //-------------------------------------------------
                            TimeSpan elapsed = currentTime - startTime;

                            //-------------------------------------------------
                            // REMAINING TIME
                            //-------------------------------------------------
                            TimeSpan totalAllowed = TimeSpan.FromMinutes(totalTimeMinutes);
                            TimeSpan remaining = totalAllowed - elapsed;

                            int remainingMs = (int)remaining.TotalMilliseconds;

                            //-------------------------------------------------
                            // WHEN TIME IS OVER
                            //-------------------------------------------------
                            if (remainingMs < 0)
                            {
                                remainingMs = 0;

                                if (lastTime.IsSubmitted == false)
                                {
                                    string sql = @"SELECT * FROM ""Quiz"".""SubmitQuizInNullCase""(@p0,@p1,@p2,@p3)";

                                    await db.SubmitQuizResponse.FromSql(sql, model.ConfigurationId, model.AcademicCalendarMasterId, model.AdmissionFormId, lastTime.CourseId).ToListAsync();
                                    await db.SaveChangesAsync();
                                    courseList = await db.GetQuizCourseList.FromSql(courseSql).ToListAsync();
                                    response.CourseList = courseList;
                                    foreach (var course in courseList)
                                    {
                                        if (course.CourseId == lastTime.CourseId && string.IsNullOrEmpty(course.TimeTaken))
                                        {
                                            course.TimeTaken = "05:00";

                                        }
                                    }

                                }

                                lastTime = await db.GetLastTime.FromSql(lastTimeSql).FirstOrDefaultAsync();
                            }

                            //-------------------------------------------------
                            // SET RESPONSE
                            //-------------------------------------------------
                            response.RemainingTime = remainingMs;
                        }

                    }


                    //-----------------------------------------------------
                    // FETCH CURRENT COURSE
                    //-----------------------------------------------------
                    attempted = courseList.Where(x => !string.IsNullOrEmpty(x.TimeTaken)).ToList();
                    response.CurrentPointer = attempted.Count + overflowSubmit;
                    var currentCourse = courseList.Skip(attempted.Count + overflowSubmit).FirstOrDefault();
                    response.CurrentCourseId = currentCourse?.CourseId;
                }


                //---------------------------------------------------------
                // STEP 3 — DETERMINE WHICH COURSE TO START
                //---------------------------------------------------------
                Guid? startCourseId = model.CourseId != null
                                        ? model.CourseId
                                        : response.CurrentCourseId;

                bool isManualCourseStart = model.CourseId != null;

                if (startCourseId != null && (isManualCourseStart || lastTime.CourseId == startCourseId) && overflowSubmit == 0)
                {

                    //---------------------------------------------------------
                    // GET RANDOM QUESTION FOR THIS COURSE
                    //---------------------------------------------------------
                    string randomQuestionSql = $@"
SELECT * FROM ""Quiz"".""GetRandomQuestionByCourseTest""(
'{model.ConfigurationId}', 
'{startCourseId}', 
'{model.ConfigurationId}', 
'{model.AcademicCalendarMasterId}')";

                    var quizEntry = db.GetRandomQuestionByCourse
                                       .FromSql(randomQuestionSql)
                                       .FirstOrDefault();


                    //---------------------------------------------------------
                    // MANUAL COURSE START BUT NO QUESTIONS FOUND → RETURN
                    //---------------------------------------------------------
                    if (isManualCourseStart && quizEntry == null)
                    {
                        response.QuestionData = null;
                        return Ok(response);
                    }


                    //---------------------------------------------------------
                    // IF QUESTIONS FOUND → CALL ARVO API
                    //---------------------------------------------------------
                    if (quizEntry != null)
                    {
                        var ids = quizEntry.QuestionId
                                           .Split(',')
                                           .Select(x => Convert.ToInt32(x))
                                           .ToArray();

                        ARVOConfiguration config = db.ARVOConfiguration
                            .First(x => x.srNo == 4 && x.FullName == "QuizMcqs");

                        client.DefaultRequestHeaders.Authorization =
                            new AuthenticationHeaderValue("Bearer", config.ARVOAccessToken);

                        var body = new
                        {
                            organization = "CMS",
                            ids,
                            module = model.Module,
                            userEmail = model.UserEmail,
                            organizationCode = "CMS",
                            device = model.Device
                        };

                        var json = JsonConvert.SerializeObject(body);
                        var content = new StringContent(json, Encoding.UTF8, "application/json");

                        var apiResponse = await client.PostAsync(config.BaseURL + config.APIURL, content);
                        var raw = await apiResponse.Content.ReadAsStringAsync();

                        response.QuestionData =
                            JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(raw);
                    }

                    if (quizEntry != null && isManualCourseStart)
                    {
                        string updateSql = $@"
SELECT * FROM ""Quiz"".""QuizTimeUpdate""(
'{model.ConfigurationId}',
'{model.AcademicCalendarMasterId}',
'{model.AdmissionFormId}',
'{startCourseId}')";

                        db.QuizTimeUpdate.FromSql(updateSql).ToList();

                        var manualIndex = courseList.FindIndex(x => x.CourseId == model.CourseId);
                        if (manualIndex >= 0)
                        {
                            response.CurrentPointer = manualIndex;
                            response.CurrentCourseId = model.CourseId;
                            response.QuizStarted = true;
                            var lastCourse = courseList.FirstOrDefault(x => x.CourseId == model.CourseId);

                            if (lastCourse != null)
                            {
                                //-------------------------------------------------
                                // QUIZ TOTAL TIME = TestFrequency × TimePerQuestion (minutes)
                                //-------------------------------------------------
                                decimal testFrequency = lastCourse.TestFrequency;
                                decimal timePerQuestion = lastCourse.TimePerQuestion;

                                int totalTimeMinutes = (int)(testFrequency * timePerQuestion);
                                response.RemainingTime = totalTimeMinutes * 60 * 1000;
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }

            //---------------------------------------------------------
            // FINAL RETURN
            //---------------------------------------------------------
            if (response.CurrentCourseId == null && response.CurrentPointer >= response.TotalCourses)
                response.QuizEnded = true;
            return Ok(response);
        }



        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetRandomQuestionByCourseMobile([FromBody] Predicate model)
        {
            GetRandomQuestionByCourseResponse resp = new GetRandomQuestionByCourseResponse();

            if (model == null || string.IsNullOrEmpty(model.ProvidedString))
            {
                return Ok("Invalid input data.");
            }

            var identifiers = model.ProvidedString.Split("?");
            if (identifiers.Length != 8)
            {
                resp = null;
                resp = null;
                return Ok(resp);
                //return Ok("Invalid input format.");
            }

            if (!Guid.TryParse(identifiers[0], out Guid classId) ||
                !Guid.TryParse(identifiers[1], out Guid courseId) ||
                !Guid.TryParse(identifiers[2], out Guid configurationId) ||
                !Guid.TryParse(identifiers[3], out Guid academicCalendarMasterId) ||
                !Guid.TryParse(identifiers[4], out Guid admissionFormId)
                )
            {
                resp = null;
                return Ok(resp);
                // return Ok("Invalid GUID format.");
            }

            string responseContent = "";
            string sql = $@"SELECT * FROM ""Quiz"".""GetRandomQuestionByCourseTest""('{classId}', '{courseId}', '{configurationId}', '{academicCalendarMasterId}')";
            var quizIds = await this.db.GetRandomQuestionByCourse.FromSql(sql).ToListAsync();
            Console.WriteLine(sql);
            Console.WriteLine("Response **************************");
            var firstQuizId = quizIds.FirstOrDefault();
            Console.WriteLine(firstQuizId);

            if (firstQuizId == null || firstQuizId.QuestionId.Length == 0)
            {
                resp = null;
                string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";


                Predicate models = new Predicate
                {
                    ProvidedString = combinedString
                };
                SubmitQuizInNullCase(models);
                return Ok(resp);
                //return Ok("No quiz questions found.");
            }

            var idss = firstQuizId.QuestionId;
            if (string.IsNullOrEmpty(idss))
            {
                resp = null;
                return Ok(resp);
                //return Ok("No question IDs found.");
            }

            ARVOConfiguration config = this.db.ARVOConfiguration.Where(e => e.srNo == 4 && e.FullName == "QuizMcqs").FirstOrDefault();
            if (config == null)
            {
                resp = null;
                string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";


                Predicate models = new Predicate
                {
                    ProvidedString = combinedString
                };
                SubmitQuizInNullCase(models);
                return Ok(resp);
                //return Ok("Configuration not found.");
            }

            string apiUrl = config.BaseURL + config.APIURL;
            string accessToken = config.ARVOAccessToken;

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var ids = idss.Split(',').Select(id => id.Trim()).Select(int.Parse).ToArray();
            var requestBody = new
            {
                organization = "CMS",
                ids,
                module = identifiers[5],
                userEmail = identifiers[6],
                organizationCode = "CMS",
                device = identifiers[7]
            };

            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            Random rng = new Random();

            try
            {
                HttpResponseMessage response = await client.PostAsync(apiUrl, content);
                responseContent = await response.Content.ReadAsStringAsync();
                if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                {
                    resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);

                    if (resp == null)
                    {
                        string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";


                        Predicate models = new Predicate
                        {
                            ProvidedString = combinedString
                        };
                        SubmitQuizInNullCase(models);
                    }
                    // var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
                    //resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();
                    return Ok(resp);
                }
                else
                {
                    config = await ARVOLogin(config);
                    accessToken = config.ARVOAccessToken;
                    response = await client.PostAsync(apiUrl, content);
                    responseContent = await response.Content.ReadAsStringAsync();
                    if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                    {
                        // var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
                        resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);
                        if (resp == null)
                        {
                            string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";

                            Predicate models = new Predicate
                            {
                                ProvidedString = combinedString
                            };
                            SubmitQuizInNullCase(models);
                        }
                        //resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();
                        return Ok(resp);
                    }
                }

                return Ok(responseContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal server error.");
            }
        }



        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetRandomQuestionByCourseMobileEncrypt([FromBody] Predicate model)
        {
            string jsonResponse = "";
            string encryptedResponse = "";


            model.ProvidedString = _encryptionService.Decrypt(model.ProvidedString);

            GetRandomQuestionByCourseResponse resp = new GetRandomQuestionByCourseResponse();

            if (model == null || string.IsNullOrEmpty(model.ProvidedString))
            {
                return Ok("Invalid input data.");
            }

            var identifiers = model.ProvidedString.Split("?");
            if (identifiers.Length != 8)
            {
                resp = null;
                resp = null;
                jsonResponse = JsonConvert.SerializeObject(resp);
                encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                return Ok(encryptedResponse);
                // return Ok(resp);
                //return Ok("Invalid input format.");
            }

            if (!Guid.TryParse(identifiers[0], out Guid classId) ||
                !Guid.TryParse(identifiers[1], out Guid courseId) ||
                !Guid.TryParse(identifiers[2], out Guid configurationId) ||
                !Guid.TryParse(identifiers[3], out Guid academicCalendarMasterId) ||
                !Guid.TryParse(identifiers[4], out Guid admissionFormId)
                )
            {
                resp = null;
                jsonResponse = JsonConvert.SerializeObject(resp);
                encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                return Ok(encryptedResponse);
                // return Ok(resp);
                // return Ok("Invalid GUID format.");
            }

            string responseContent = "";
            string sql = $@"SELECT * FROM ""Quiz"".""GetRandomQuestionByCourseTest""('{classId}', '{courseId}', '{configurationId}', '{academicCalendarMasterId}')";
            var quizIds = await this.db.GetRandomQuestionByCourse.FromSql(sql).ToListAsync();
            Console.WriteLine(sql);
            Console.WriteLine("Response **************************");
            var firstQuizId = quizIds.FirstOrDefault();
            Console.WriteLine(firstQuizId);

            if (firstQuizId == null || firstQuizId.QuestionId.Length == 0)
            {
                resp = null;
                string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";


                Predicate models = new Predicate
                {
                    ProvidedString = combinedString
                };
                SubmitQuizInNullCase(models);

                jsonResponse = JsonConvert.SerializeObject(resp);
                encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                return Ok(encryptedResponse);
                // return Ok(resp);
                //return Ok("No quiz questions found.");
            }

            var idss = firstQuizId.QuestionId;
            if (string.IsNullOrEmpty(idss))
            {
                resp = null;
                return Ok(resp);
                //return Ok("No question IDs found.");
            }

            ARVOConfiguration config = this.db.ARVOConfiguration.Where(e => e.srNo == 4 && e.FullName == "QuizMcqs").FirstOrDefault();
            if (config == null)
            {
                resp = null;
                string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";


                Predicate models = new Predicate
                {
                    ProvidedString = combinedString
                };
                SubmitQuizInNullCase(models);
                jsonResponse = JsonConvert.SerializeObject(resp);
                encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                return Ok(encryptedResponse);
                // return Ok(resp);
                //return Ok("Configuration not found.");
            }

            string apiUrl = config.BaseURL + config.APIURL;
            string accessToken = config.ARVOAccessToken;

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var ids = idss.Split(',').Select(id => id.Trim()).Select(int.Parse).ToArray();
            var requestBody = new
            {
                organization = "CMS",
                ids,
                module = identifiers[5],
                userEmail = identifiers[6],
                organizationCode = "CMS",
                device = identifiers[7]
            };

            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            Random rng = new Random();

            try
            {
                HttpResponseMessage response = await client.PostAsync(apiUrl, content);
                responseContent = await response.Content.ReadAsStringAsync();
                if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                {
                    resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);

                    if (resp == null)
                    {
                        string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";


                        Predicate models = new Predicate
                        {
                            ProvidedString = combinedString
                        };
                        SubmitQuizInNullCase(models);
                    }
                    // var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
                    //resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();
                    jsonResponse = JsonConvert.SerializeObject(resp);
                    encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                    return Ok(encryptedResponse);
                    // return Ok(resp);
                }
                else
                {
                    config = await ARVOLogin(config);
                    accessToken = config.ARVOAccessToken;
                    response = await client.PostAsync(apiUrl, content);
                    responseContent = await response.Content.ReadAsStringAsync();
                    if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                    {
                        // var configdata = this.db.CityConfiguration.Where(f => f.ConfigurationId == configurationId).FirstOrDefault();
                        resp = JsonConvert.DeserializeObject<GetRandomQuestionByCourseResponse>(responseContent);
                        if (resp == null)
                        {
                            string combinedString = $"{configurationId}?{academicCalendarMasterId}?{admissionFormId}?{courseId}";

                            Predicate models = new Predicate
                            {
                                ProvidedString = combinedString
                            };
                            SubmitQuizInNullCase(models);
                        }

                        jsonResponse = JsonConvert.SerializeObject(resp);
                        encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                        return Ok(encryptedResponse);
                        // return Ok(resp);
                        //resp.Data = resp.Data.OrderBy(x => rng.Next()).Take(configdata.TestFrequency).ToList();

                    }
                }
                jsonResponse = JsonConvert.SerializeObject(resp);
                encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                return Ok(encryptedResponse);
                // return Ok(responseContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal server error.");
            }
        }
        private async Task<ARVOConfiguration> ARVOLogin(ARVOConfiguration _config)
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
                        }
                    }

                    arvorepository.Update(_config);
                }
            }

            return _config;
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetQuizConfigrationData([FromBody] Predicate model)
        // {
        //     var classid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);

        //     string sql = String.Format(@"select * from  ""Quiz"".""GetQuizConfigrationDataEx1""('{0}','{1}')", classid, admissionformid);
        //     // Console.WriteLine(sql);
        //     return Ok(this.db.GetQuizConfigrationDataResponseExNew.FromSql(sql));
        // }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetQuizConfigrationDataEncrypt([FromBody] Predicate model)
        {
            try
            {
                string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

                // var model = JsonConvert.DeserializeObject<Predicate>(decryptedPayload);

                var classid = new Guid(decryptedPayload.Split("?")[0]);
                var admissionformid = new Guid(decryptedPayload.Split("?")[1]);

                string sql = String.Format(@"select * from ""Quiz"".""GetQuizConfigrationDataEx1""('{0}','{1}')", classid, admissionformid);
                var resultdata = this.db.GetQuizConfigrationDataResponseExNew.FromSql(sql).ToList();

                string jsonResponse = JsonConvert.SerializeObject(resultdata);
                string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                return Ok(encryptedResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetQuizConfigrationDataEx([FromBody] Predicate model)
        {
            var classid = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""GetQuizConfigrationDataEx""('{0}','{1}')", classid, admissionformid);
            // Console.WriteLine(sql);
            return Ok(this.db.GetQuizConfigrationDataResponseEx.FromSql(sql));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetQuizCourseList([FromBody] Predicate model)
        // {
        //     var configurationid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);

        //     string sql = String.Format(@"select * from  ""Quiz"".""GetCourseList""('{0}','{1}')", configurationid, admissionformid);
        //     // Console.WriteLine(sql);
        //     return Ok(this.db.GetQuizCourseList.FromSql(sql));
        // }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetQuizCourseListEncrypt([FromBody] Predicate model)
        {

            string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

            var configurationid = new Guid(decryptedPayload.Split("?")[0]);
            var admissionformid = new Guid(decryptedPayload.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""GetCourseList""('{0}','{1}')", configurationid, admissionformid);
            // Console.WriteLine(sql); 
            var resultdata = this.db.GetQuizCourseList.FromSql(sql).ToList();

            string jsonResponse = JsonConvert.SerializeObject(resultdata);
            string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
            return Ok(encryptedResponse);
        }


        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetLastTime([FromBody] Predicate model)
        // {
        //     var configurationid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var academiccalendarmasterod = new Guid(model.ProvidedString.Split("?")[1]);
        //     var admissionformid = new Guid(model.ProvidedString.Split("?")[2]);

        //     string sql = String.Format(@"select * from  ""Quiz"".""GetLastTime""('{0}','{1}','{2}' )", configurationid, academiccalendarmasterod, admissionformid);
        //     // Console.WriteLine(sql);
        //     return Ok(this.db.GetLastTime.FromSql(sql));
        // }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetLastTimeEncrypt([FromBody] Predicate model)
        {
            string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

            var configurationid = new Guid(decryptedPayload.Split("?")[0]);
            var academiccalendarmasterod = new Guid(decryptedPayload.Split("?")[1]);
            var admissionformid = new Guid(decryptedPayload.Split("?")[2]);

            string sql = String.Format(@"select * from  ""Quiz"".""GetLastTime""('{0}','{1}','{2}' )", configurationid, academiccalendarmasterod, admissionformid);
            // Console.WriteLine(sql); 
            var resultdata = this.db.GetLastTime.FromSql(sql).ToList();

            string jsonResponse = JsonConvert.SerializeObject(resultdata);
            string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
            return Ok(encryptedResponse);
        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult QuizTimeUpdate([FromBody] Predicate model)
        // {
        //     var configurationid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var academiccalendarmasterod = new Guid(model.ProvidedString.Split("?")[1]);
        //     var admissionformid = new Guid(model.ProvidedString.Split("?")[2]);
        //     var courseid = new Guid(model.ProvidedString.Split("?")[3]);

        //     string sql = String.Format(@"select * from  ""Quiz"".""QuizTimeUpdate""('{0}','{1}','{2}','{3}')", configurationid, academiccalendarmasterod, admissionformid, courseid);
        //     // Console.WriteLine(sql);
        //     return Ok(this.db.QuizTimeUpdate.FromSql(sql));
        // }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult QuizTimeUpdateEncrypt([FromBody] Predicate model)
        {

            string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

            var configurationid = new Guid(decryptedPayload.Split("?")[0]);
            var academiccalendarmasterod = new Guid(decryptedPayload.Split("?")[1]);
            var admissionformid = new Guid(decryptedPayload.Split("?")[2]);
            var courseid = new Guid(decryptedPayload.Split("?")[3]);

            string sql = String.Format(@"select * from  ""Quiz"".""QuizTimeUpdate""('{0}','{1}','{2}','{3}')", configurationid, academiccalendarmasterod, admissionformid, courseid);
            // Console.WriteLine(sql); 
            var resultdata = this.db.QuizTimeUpdate.FromSql(sql).ToList();

            string jsonResponse = JsonConvert.SerializeObject(resultdata);
            string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
            return Ok(encryptedResponse);
        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult SubmitQuiz([FromBody] Predicate model)
        // {
        //     if (model == null || string.IsNullOrEmpty(model.ProvidedString))
        //     {
        //         return BadRequest("Invalid input");
        //     }

        //     try
        //     {
        //         string sql = @"SELECT * FROM ""Quiz"".""SubmitQuiz""(@p0)";
        //         var res = this.db.SubmitQuizResponse.FromSql(sql, model.ProvidedString).ToList();
        //         if (res != null)
        //         {
        //             return Ok(res);
        //         }
        //         else
        //         {
        //             return NotFound(res);
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         // Log exception
        //         Console.WriteLine(ex.Message);
        //         return StatusCode(500, "Internal server error");
        //     }
        // }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult SubmitQuizEncrypt([FromBody] Predicate model)
        {

            if (model == null || string.IsNullOrEmpty(model.ProvidedString))
            {
                return BadRequest("Invalid input");
            }

            try
            {
                string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

                string sql = @"SELECT * FROM ""Quiz"".""SubmitQuiz""(@p0)";
                var res = this.db.SubmitQuizResponse.FromSql(sql, decryptedPayload).ToList();
                if (res != null)
                {

                    string jsonResponse = JsonConvert.SerializeObject(res);
                    string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                    return Ok(encryptedResponse);

                }
                else
                {
                    return NotFound(res);
                }
            }
            catch (Exception ex)
            {
                // Log exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult TotalMarksQuizWize([FromBody] Predicate model)
        {
            var configurationid = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""TotalMarksQuizWize""('{0}','{1}')", configurationid, admissionformid);
            // Console.WriteLine(sql);
            return Ok(this.db.TotalMarksQuizWize.FromSql(sql));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult QuizFinishedList([FromBody] Predicate model)
        {
            var classid = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""QuizFinishedListEx""('{0}','{1}')", classid, admissionformid);
            // Console.WriteLine(sql);
            return Ok(this.db.QuizFinishedListEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizFinishedListEncrypt([FromBody] Predicate model)
        {
            string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

            var classid = new Guid(decryptedPayload.Split("?")[0]);
            var admissionformid = new Guid(decryptedPayload.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""QuizFinishedListEx""('{0}','{1}')", classid, admissionformid);
            // Console.WriteLine(sql); 
            var resultdata = this.db.QuizFinishedListEx.FromSql(sql).ToList();

            string jsonResponse = JsonConvert.SerializeObject(resultdata);
            string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
            return Ok(encryptedResponse);
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetLeaderBoardSubjectWise([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString);

            string sql = String.Format(@"select * from  ""Quiz"".""GetLeaderBoardSubjectWiseEx""('{0}')", admissionformid);
            Console.WriteLine(sql);
            return Ok(this.db.LeaderBoardEx.FromSql(sql));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetLeagueDataofTopStudents([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var courseid = new Guid(model.ProvidedString.Split("?")[1]);
            var leagueid = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"select * from  ""Quiz"".""GetLeagueDataofTopStudentsLatest""('{0}','{1}','{2}')", admissionformid, courseid, leagueid);
            // Console.WriteLine(sql);
            return Ok(this.db.Top10Leaguestudentdata.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]


        public IActionResult QuizBreakdownOfStudent([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var courseid = new Guid(model.ProvidedString.Split("?")[1]);
            var leagueid = new Guid(model.ProvidedString.Split("?")[2]);
            var quiztype = (model.ProvidedString.Split("?")[3]);


            string sql = String.Format(@"select * from  ""Quiz"".""GetLeagueQuizBreakDown""('{0}','{1}','{2}','{3}')", admissionformid, courseid, leagueid, quiztype);
            // Console.WriteLine(sql);
            return Ok(this.db.quizBreakdownofstudent.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]


        public IActionResult QuizStudentDataPerformance([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var leagueid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""GetLeagueDataPerformanceLatest""('{0}','{1}')", admissionformid, leagueid);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentPerformnce.FromSql(sql));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult QuizAllDoneOverAll([FromBody] Predicate model)
        {
            var configurationid = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""QuizAllDoneOverAll""('{0}','{1}')", configurationid, admissionformid);
            // Console.WriteLine(sql);
            return Ok(this.db.QuizAllDoneOverAll.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SubmitQuizInNullCase([FromBody] Predicate model)
        {
            if (model == null || string.IsNullOrEmpty(model.ProvidedString))
            {
                return BadRequest("Invalid input");
            }

            try
            {

                var configid = new Guid(model.ProvidedString.Split("?")[0]);
                var acdmasterid = new Guid(model.ProvidedString.Split("?")[1]);
                var admisid = new Guid(model.ProvidedString.Split("?")[2]);
                var crsid = new Guid(model.ProvidedString.Split("?")[3]);
                string sql = @"SELECT * FROM ""Quiz"".""SubmitQuizInNullCase""(@p0,@p1,@p2,@p3)";
                var res = this.db.SubmitQuizResponse.FromSql(sql, configid, acdmasterid, admisid, crsid).ToList();

                // Assuming you need to do something with the result before returning OK
                if (res != null)
                {
                    // Process res if needed
                    return Ok("Data saved successfully");
                }
                else
                {
                    return NotFound("No data found");
                }
            }
            catch (Exception ex)
            {
                // Log exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult SubmitQuizInNullCaseEncrypt([FromBody] Predicate model)
        {
            if (model == null || string.IsNullOrEmpty(model.ProvidedString))
            {
                return BadRequest("Invalid input");
            }

            try
            {
                string decryptedPayload = _encryptionService.Decrypt(model.ProvidedString);

                var configid = new Guid(decryptedPayload.Split("?")[0]);
                var acdmasterid = new Guid(decryptedPayload.Split("?")[1]);
                var admisid = new Guid(decryptedPayload.Split("?")[2]);
                var crsid = new Guid(decryptedPayload.Split("?")[3]);
                string sql = @"SELECT * FROM ""Quiz"".""SubmitQuizInNullCase""(@p0,@p1,@p2,@p3)";
                var res = this.db.SubmitQuizResponse.FromSql(sql, configid, acdmasterid, admisid, crsid).ToList();

                if (res != null)
                {
                    string jsonResponse = JsonConvert.SerializeObject("Data saved successfully");
                    string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                    return Ok(encryptedResponse);
                }
                else
                {
                    string jsonResponse = JsonConvert.SerializeObject("No data found");
                    string encryptedResponse = _encryptionService.Encrypt(jsonResponse);
                    return Ok(encryptedResponse);
                }
            }
            catch (Exception ex)
            {
                // Log exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        // [Authorize]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> SaveQuizConfigration([FromBody] Predicate model)
        {
            ConfigurationApiResponse resp = new ConfigurationApiResponse();

            if (model == null || string.IsNullOrEmpty(model.ProvidedString))
            {
                return BadRequest("Invalid input");
            }

            try
            {
                HttpClient client = new HttpClient();
                ARVOConfiguration _config = new ARVOConfiguration();
                var configurationids = Guid.NewGuid();
                var arvoSubject = this.db.ArvoCourses.ToList();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "Configuration");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl = string.Empty;
                string accessToken = string.Empty;

                if (_config != null)
                {
                    apiUrl = _config.BaseURL + _config.APIURL;
                    accessToken = _config.ARVOAccessToken;

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    foreach (var arvo in arvoSubject)
                    {
                        CourseData _crsData = new CourseData();
                        string coursename = "";
                        if (arvo.CourseName == "Tarjama Tul Quran")
                        {
                            coursename = "Translation of Holy Quran";
                        }
                        else
                        {
                            coursename = arvo.CourseName;
                        }





                        string jsoncourse = String.Format(@"select * from ""Quiz"".""GetCourseDataConfigration""('{0}')", coursename);
                        var coursedata = this.db.CourseData.FromSql(jsoncourse);
                        _crsData = coursedata.FirstOrDefault();


                        if (_crsData != null)
                        {
                            CourseConfiguration courseConfiguration = new CourseConfiguration();

                            if (arvo.CourseName == "Islamiyat")
                            {
                                arvo.CourseName = "Islamiat";
                            }
                            else
                            {
                                arvo.CourseName = arvo.CourseName;
                            }

                            var requestBody = new
                            {
                                organization = "CMS",
                                subject = arvo.CourseName,
                                userEmail = "Routine@cms.edu.pk",
                                module = "Quiz Configration",
                                organizationCode = "CMS",
                                device = "CMS Web"

                            };


                            var jsonex = JsonConvert.SerializeObject(requestBody);
                            var content = new StringContent(jsonex, Encoding.UTF8, "application/json");

                            HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                            if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                            {
                                string responseContent = await response.Content.ReadAsStringAsync();
                                resp = JsonConvert.DeserializeObject<ConfigurationApiResponse>(responseContent);
                                if (resp.Data != null)
                                {
                                    string time = resp.Data.PerQuestionTime;
                                    TimeSpan timeSpan = TimeSpan.Parse(time);
                                    decimal minutes = (decimal)Math.Round(timeSpan.TotalMinutes);

                                    courseConfiguration.CourseConfigurationId = Guid.NewGuid();
                                    courseConfiguration.ConfigurationId = configurationids;
                                    courseConfiguration.CourseId = _crsData.CourseId;
                                    courseConfiguration.Subject = arvo.CourseName;
                                    courseConfiguration.TestFrequency = resp.Data.PerSubjectQuestions;
                                    courseConfiguration.TimePerQuestion = minutes;
                                    courseConfiguration.MarksPerQuestion = resp.Data.PerQuestionMarks;
                                    courseConfiguration.Easy = resp.Data.ComplexityDetails.FirstOrDefault(e => e.Complexity == "easy").MinQuestions;
                                    courseConfiguration.Medium = resp.Data.ComplexityDetails.FirstOrDefault(e => e.Complexity == "medium").MinQuestions;
                                    courseConfiguration.Hard = resp.Data.ComplexityDetails.FirstOrDefault(e => e.Complexity == "hard").MinQuestions;
                                    string jsonString = JsonConvert.SerializeObject(courseConfiguration, Formatting.Indented);
                                    string sqlcrs = @"SELECT * FROM ""Quiz"".""SaveCourseConfiguration""(@p0::json)";
                                    var rescrs = this.db.returnResponseValue.FromSql(sqlcrs, jsonString).ToList();
                                }

                            }
                            else
                            {
                                _config = await ARVOLoginEx(_config);
                                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                                HttpResponseMessage response1 = await client.PostAsync(apiUrl, content);

                                if (response1.IsSuccessStatusCode)
                                {
                                    string responseData = await response1.Content.ReadAsStringAsync();
                                    resp = JsonConvert.DeserializeObject<ConfigurationApiResponse>(responseData);
                                    if (resp.Data != null)
                                    {
                                        string time = resp.Data.PerQuestionTime;
                                        TimeSpan timeSpan = TimeSpan.Parse(time);
                                        decimal minutes = (decimal)Math.Round(timeSpan.TotalMinutes);

                                        courseConfiguration.CourseConfigurationId = Guid.NewGuid();
                                        courseConfiguration.ConfigurationId = configurationids;
                                        courseConfiguration.CourseId = _crsData.CourseId;
                                        courseConfiguration.Subject = arvo.CourseName;
                                        courseConfiguration.TestFrequency = resp.Data.PerSubjectQuestions;
                                        courseConfiguration.TimePerQuestion = minutes;
                                        courseConfiguration.MarksPerQuestion = resp.Data.PerQuestionMarks;
                                        courseConfiguration.Easy = resp.Data.ComplexityDetails.FirstOrDefault(e => e.Complexity == "easy").MinQuestions;
                                        courseConfiguration.Medium = resp.Data.ComplexityDetails.FirstOrDefault(e => e.Complexity == "medium").MinQuestions;
                                        courseConfiguration.Hard = resp.Data.ComplexityDetails.FirstOrDefault(e => e.Complexity == "hard").MinQuestions;
                                        string jsonString = JsonConvert.SerializeObject(courseConfiguration, Formatting.Indented);
                                        string sqlcrs = @"SELECT * FROM ""Quiz"".""SaveCourseConfiguration""(@p0::json)";
                                        var rescrs = this.db.returnResponseValue.FromSql(sqlcrs, jsonString).ToList();
                                    }

                                }
                            }
                        }
                    }

                    var payloaddata = model.ProvidedString;
                    var Data = this.log.GetLog();
                    string sql = @"SELECT * FROM ""Quiz"".""SaveQuizConfigrationWithCourse""(@p0::json,@p1::json,@p2::uuid)";
                    var res = this.db.returnResponseValue.FromSql(sql, payloaddata, Data, configurationids).ToList();

                    if (res != null)
                    {
                        return Ok("Data saved successfully");
                    }
                    else
                    {
                        return NotFound("No data found");
                    }
                }

                return BadRequest("Configuration not found");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEbookCheck([FromBody] Predicate predicate)
        {
            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetEbookCheck""('{0}')", admissionformid);
            return Ok(this.db.GetEbookCheckResponse.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteQuizStudentData([FromBody] Predicate predicate)
        {

            var configrationid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = @"SELECT * FROM ""Quiz"".""DeleteQuizStudentData""(@p0,@p1)";
            var res = this.db.returnResponseValue.FromSql(sql, configrationid, admissionformid).ToList();
            if (res != null)
            {
                return Ok("Data saved successfully");
            }
            else
            {
                return NotFound("No data found");
            }

        }

        // [Authorize]
        [HttpPost]
        [Route("[action]")]
        public IActionResult SaveLeagueConfigration([FromBody] Predicate model)
        {
            if (model == null || string.IsNullOrEmpty(model.ProvidedString))
            {
                return BadRequest("Invalid input");
            }

            try
            {
                var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
                var cityId = new Guid(model.ProvidedString.Split("?")[1]);
                var classId = new Guid(model.ProvidedString.Split("?")[2]);
                var fromdate = model.ProvidedString.Split("?")[3];
                var todate = model.ProvidedString.Split("?")[4];
                var quizName = model.ProvidedString.Split("?")[5];
                var Data = this.log.GetLog();

                string sql = @"SELECT * FROM ""Quiz"".""SaveLeagueConfigration""(@p0,@p1,@p2,@p3,@p4,@p5,@p6::json)";
                var res = this.db.returnResponseValue.FromSql(sql, sessionId, cityId, classId, fromdate, todate, quizName, Data).ToList();

                // Assuming you need to do something with the result before returning OK
                if (res != null)
                {
                    // Process res if needed
                    return Ok("Data saved successfully");
                }
                else
                {
                    return NotFound("No data found");
                }
            }
            catch (Exception ex)
            {
                // Log exception
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLeagueList([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var cityid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetLeagueList""('{0}','{1}','{2}')", sessionid, cityid, classid);
            return Ok(this.db.GetLeagueList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLeagueListSessionBased([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetLeagueListSessionBased""('{0}')", sessionid);
            return Ok(this.db.GetLeagueList.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLeagueListData([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var cityid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var leagueid = new Guid(predicate.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetLeagueListData""('{0}','{1}','{2}','{3}')", sessionid, cityid, classid, leagueid);
            return Ok(this.db.GetLeagueListData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLeagueListDataWithoutLeague([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var cityid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetLeagueListDataWithoutLeague""('{0}','{1}','{2}')", sessionid, cityid, classid);
            return Ok(this.db.GetLeagueListData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetQuizCourseListForPopUp([FromBody] Predicate model)
        {
            var configurationid = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Quiz"".""GetQuizCourseListForPopUp""('{0}','{1}')", configurationid, admissionformid);
            // Console.WriteLine(sql);
            return Ok(this.db.GetQuizCourseList.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityConfigrationData([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var cityid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetCityConfigrationData""('{0}','{1}','{2}')", sessionid, cityid, classid);
            return Ok(this.db.GetCityConfigrationData.FromSql(sql));

        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetActiveLeagueData([FromBody] Predicate predicate)
        {
            var configurationId = new Guid(predicate.ProvidedString);

            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetActiveLeagueData""('{0}')", configurationId);
            return Ok(this.db.League.FromSql(sql));

        }
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSessionBasedSummery([FromBody] Predicate predicate)
        {
            Console.WriteLine("Data", DomainContext.User.UserId);
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizSummeryData""('{0}', '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizSummeryData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetQuizSummeryDataCityWise([FromBody] Predicate predicate)
        {
            Console.WriteLine("Data", DomainContext.User.UserId);
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizSummeryDataCityWise""('{0}', '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizSummeryDataCityWise.FromSql(sql).OrderBy(f => f.CityName));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetQuizSummeryDataQuizWise([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizSummeryDataQuizWise""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizSummeryDataQuizWise.FromSql(sql).OrderBy(f => f.QuizName));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetQuizSummeryDataSubCityWise([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizSummeryDataSubCityWise""('{0}','{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizSummeryDataCityWise.FromSql(sql).OrderBy(f => f.CityName));

        }
        [HttpPost]

        [Route("[action]")]
        public IActionResult GetArvoCourseForQuiz([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""GetArvoCourseForQuiz""('{0}')", predicate.ProvidedString);
            return Ok(this.db.GetArvoSubjectList.FromSql(sql).OrderBy(f => f.SubjectName));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizTopStudentSession([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizTopStudentSession""('{0}',{1})", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizTopStudentSession.FromSql(sql).OrderBy(f => f.SerialNumber));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizTopStudentSessionEx([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizTopStudentSessionEX""('{0}',{1})", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizTopStudentSessionEx.FromSql(sql).OrderBy(f => f.SerialNumber));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizTopStudentSessionCourse([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizTopStudentSessionCourse""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizTopStudentSessionCourse.FromSql(sql).OrderBy(f => f.SerialNumber));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizTopStudentSessionCourseEX([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizTopStudentSessionCourseEX""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizTopStudentSessionCourseEx.FromSql(sql).OrderBy(f => f.SerialNumber));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizWeeklyPerformanceResponse([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizWeeklyPerformanceResponse""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizWeeklyPerformanceResponse.FromSql(sql).OrderBy(f => f.QuizName));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizSubjectWisePerformance([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizSubjectWisePerformance""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizSubjectWisePerformance.FromSql(sql).OrderBy(f => f.Course));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizCityWisePerformance([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizCityWisePerformance""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizCityWisePerformance.FromSql(sql).OrderBy(f => f.City));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizTimeWiseOverAllPerformance([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizTimeWiseOverAllPerformance""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizTimeWiseOverAllPerformance.FromSql(sql).OrderBy(f => f.City));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizTimeWiseOverAllPerformanceSessionBased([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizTimeWiseOverAllPerformanceSessionBased""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizTimeWiseOverAllPerformanceSessionBased.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult QuizSubCityOverAllPerformance([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizSubCityOverAllPerformance""('{0}' , '{1}')", predicate.ProvidedString, DomainContext.User.UserId);
            return Ok(this.db.QuizSubCityOverAllPerformance.FromSql(sql));

        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetQuizClass()
        {
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizClassGet""()");
            return Ok(this.db.SetupClass.FromSql(sql).OrderBy(f => f.FullName));

        }

    }
}