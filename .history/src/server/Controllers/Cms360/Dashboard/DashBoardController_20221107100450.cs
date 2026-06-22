
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    // [Loggings]
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
        public PublicDashBoardController(IUserLogService log, DbContextBase db, IPublicVWDashBoardVMRepository repository, IPublicStudentFeeCountVMRepository repositoryVM, IDomainContextResolver Resolver)
        {
            this.repository = repository;
            this.repositoryVM = repositoryVM;
            this.log = log;
            this.db = db;
            this.Resolver = Resolver;
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
        public IActionResult GetSurveyDetail2([FromBody] Predicate model)
        {
            var survey = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);


            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetSurveyDetailApiEx""('{0}','{1}','{2}')", survey, admissionformid, classid);
            return Ok(this.db.GetSurveyDetail.FromSql(sql));

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
        [Route("[action]")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
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

            string sql = String.Format(@"SELECT * FROM ""Message"".""SurveyTeacherSearchEx""('{0}',{1})", filterString, userId);
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

            string sql = String.Format(@"SELECT * FROM ""Message"".""TeacherTotalSurvey""('{0}',{1})", teacherId, userId);
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
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherGraphSection([FromBody] Predicate model)
        {
            var teacherId = new Guid(model.ProvidedString.Split("?")[0]);
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Message"".""TeacherGraphSecWise""('{0}',{1})", teacherId, userId);
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
            var CityId = new Guid(model.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(model.ProvidedString.Split("?")[1]);
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
            var fromdate =  model.ProvidedString.Split("?")[0];
            var todate = model.ProvidedString.Split("?")[1];
            var filter = model.ProvidedString.Split("?")[3];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Setup"".""StudentAppFeedBack""('{0}','{1}',{2})", fromdate,  todate, userId,filter);
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
            string sql = String.Format(@"SELECT * FROM ""Setup"".""StudentAppFeedBackAgainstStudent""('{0}','{1}','{2}',{3})",admissionformid, fromdate,  todate, userId);
            Console.WriteLine(sql);
            return Ok(this.db.StudentFeedbackAgainstStudent.FromSql(sql));

        }


    }

}