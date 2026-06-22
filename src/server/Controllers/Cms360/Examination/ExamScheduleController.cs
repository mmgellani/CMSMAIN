
using System.Globalization;
using System.Runtime.CompilerServices;
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;

using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;

namespace Cms360.UI.Controllers.Account
{
    ////////////changing by Ansa//////
    public class RTVSS
    {
        public string ReturnValue { get; set; }
    }



    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ExaminationExamScheduleController : Controller
    {
        private readonly IExaminationExamScheduleRepository repository;

        private readonly IExaminationExamScheduleVMRepository repositoryVM;

        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public ExaminationExamScheduleController(IExaminationExamScheduleRepository repository, IUserLogService log, IExaminationExamScheduleVMRepository repositoryVM, DbContextBase db)
        {
            this.repository = repository;
            this.repositoryVM = repositoryVM;
            this.db = db;
            this.log = log;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        private bool validateinputvalue(string input)
        {
            if (input == null || input == "" || input == " " || input == "null" || string.IsNullOrEmpty(input.Trim()))
            {
                return true;
            }
            return false;
        }

        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAll()
        // {
        //     return Ok(this.repository.All());
        // }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetExamSched([FromBody] Predicate predicate)
        {
            var examScheduleId = new Guid(predicate.ProvidedString.Split("?")[0]);
            // var data = entity.ExamScheduleId;
            // Console.WriteLine(examScheduleId);
            // var res = db.ExaminationExamSchedule.First(e=> e.ExamScheduleId == examScheduleId);

            string json = String.Format(@"select * from ""Examination"".""ExamSchedule"" where ""ExamScheduleId"" = '{0}'", examScheduleId);

            return Ok(this.db.ExaminationExamScheduleModel.FromSql(json));
            // return Ok(res);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamSchedule([FromBody] Predicate predicate)
        {
            var sectionCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[0]);

            string json = String.Format(@"SELECT
            uuid_generate_v4 ( ) AS ""NewID"",* FROM
            ( SELECT DISTINCT exs.""ExamTypeId"", exs.""FullName"" FROM ""Examination"".""ExamSchedule"" exs WHERE exs.""SectionCourseLinkId"" = '{0}' AND ""StatusId"" = 1 ) x", sectionCourseLinkId);

            return Ok(this.db.ExamScheduleExx.FromSql(json));
            // return Ok(res);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamScheduleBySectionCourseLinkId([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[0]);
            var courseId = new Guid(model.ProvidedString.Split("?")[1]);
            return Ok(this.db.ExaminationExamSchedule.Where(e => e.StatusId == 1 && e.SectionCourseLinkId == sectionCourseLinkId && e.CourseId == courseId));

            //return Ok(this.repo.FindBy(String.Format("WHERE \"AdmissionFormId\"='" + model.ProvidedString + "' AND \"StatusId\" = 1")));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamAssScheduleBySectionCourseLinkId([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[0]);
            var courseId = new Guid(model.ProvidedString.Split("?")[1]);
            var typeid = (model.ProvidedString.Split("?")[2]);
            string json = String.Format(@"select * from ""Assessment"".""GetassmentexamScedule""('{0}','{1}','{2}')", sectionCourseLinkId, courseId, typeid);

            return Ok(this.db.ExaminationExamSchedule.FromSql(json));
            //return Ok(this.db.ExaminationExamSchedule.Where(e => e.StatusId == 1 && e.SectionCourseLinkId == sectionCourseLinkId && e.CourseId==courseId));

            //return Ok(this.repo.FindBy(String.Format("WHERE \"AdmissionFormId\"='" + model.ProvidedString + "' AND \"StatusId\" = 1")));
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetassmentexamSceduleList([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[0]);
            var typeid = (model.ProvidedString.Split("?")[1]);
            string json = String.Format(@"select * from ""Assessment"".""GetassmentexamSceduleList""('{0}','{1}')", sectionCourseLinkId, typeid);

            return Ok(this.db.ExaminationExamScheduleList.FromSql(json));
            
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {

            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamSchedule).Assembly);
            Expression<Func<ExaminationExamSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {

            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamSchedule).Assembly);
            Expression<Func<ExaminationExamSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {

            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamSchedule).Assembly);
            Expression<Func<ExaminationExamSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression).Where(x => x.StatusId == 1));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate predicate)
        {

            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }

            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectioncourselinkid = new string(predicate.ProvidedString.Split("?")[2]);
            //var courseid = new Guid(predicate.ProvidedString.Split("?")[3]);
            string json = String.Format(@"select * from ""Examination"".""ExamScheduleDataEx""('{0}','{1}','{2}')", campusprogramid, classid, sectioncourselinkid);
            var z = this.db.VWExaminationExamScheduleEx.FromSql(json);

            return Ok(z);



        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateById([FromBody] Predicate predicate)
        {
            var examScheduleId = new Guid(predicate.ProvidedString);
            string json = String.Format("Update \"Examination\".\"ExamSchedule\" set \"StatusId\"=2 where \"ExamScheduleId\"='{0}'", examScheduleId);
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

            return Ok("OK");



        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCode([FromBody] Predicate param)
        {


            // string json = String.Format(@"select coalesce(right(concat('00',max(right(""FullName"",2))::int+1),2),'01') as ""ProvidedString"" from ""Examination"".""ExamSchedule""");
            // var z = this.db.Predicate.FromSql(json).ToList();
            var examtypeid = param.ProvidedString.Split("?")[0];
            var sectioncourslinkId = new Guid(param.ProvidedString.Split("?")[1]);
            return Ok(this.db.Predicate.FromSql($"SELECT \"GetExamScheduleCode\" as \"ProvidedString\" FROM \"Examination\".\"GetExamScheduleCode\"({examtypeid},{sectioncourslinkId})"));

            //return Ok(z);



        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCodeSpecificSections([FromBody] Predicate param)
        {


            // string json = String.Format(@"select coalesce(right(concat('00',max(right(""FullName"",2))::int+1),2),'01') as ""ProvidedString"" from ""Examination"".""ExamSchedule""");
            // var z = this.db.Predicate.FromSql(json).ToList();
            var examtypeid = param.ProvidedString.Split("?")[0];
            var sectioncourslinkId = param.ProvidedString.Split("?")[1];
            Console.WriteLine("New Functions : " + sectioncourslinkId);
            return Ok(this.db.Predicate.FromSql($"SELECT \"GetExamScheduleCodeSpecificSections\" as \"ProvidedString\" FROM \"Examination\".\"GetExamScheduleCodeSpecificSections\"({examtypeid},{sectioncourslinkId})"));

            //return Ok(z);

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCodeForAllSections([FromBody] Predicate param)
        {


            // string json = String.Format(@"select coalesce(right(concat('00',max(right(""FullName"",2))::int+1),2),'01') as ""ProvidedString"" from ""Examination"".""ExamSchedule""");
            // var z = this.db.Predicate.FromSql(json).ToList();
            var campusProgramId = new Guid(param.ProvidedString.Split("?")[0]);
            var classId = new Guid(param.ProvidedString.Split("?")[1]);

            var examtypeid = new Guid(param.ProvidedString.Split("?")[2]);
            //var sectioncourslinkId = new Guid(param.ProvidedString.Split("?")[1]);
            Console.WriteLine(String.Format("SELECT \"GetExamScheduleCodeForAllSections\" as \"ProvidedString\" FROM \"Examination\".\"GetExamScheduleCodeForAllSections\"('{0}','{1}','{2}')", campusProgramId, classId, examtypeid));
            return Ok(this.db.Predicate.FromSql($"SELECT \"GetExamScheduleCodeForAllSections\" as \"ProvidedString\" FROM \"Examination\".\"GetExamScheduleCodeForAllSections\"({campusProgramId},{classId},{examtypeid})"));

            //return Ok(z);



        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult AddForAllSections([FromBody] Predicate param)
        {
            var campusProgramId = new Guid(param.ProvidedString.Split("?")[0]);
            var classId = new Guid(param.ProvidedString.Split("?")[1]);

            var examtypeid = new Guid(param.ProvidedString.Split("?")[2]);
            var model = param.ProvidedString.Split("?")[3];

            //var sectioncourslinkId = new Guid(param.ProvidedString.Split("?")[1]);
            Console.WriteLine(String.Format("SELECT * FROM \"Examination\".\"AddForAllSections\"('{0}','{1}','{2}','{3}')", campusProgramId, classId, examtypeid, model));
            return Ok(this.db.IntModel.FromSql($"SELECT \"AddForAllSections\" as \"val\" FROM \"Examination\".\"AddForAllSections\"({campusProgramId},{classId},{examtypeid},{model})"));

            //return Ok(z);



        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {

            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamSchedule).Assembly);
            Expression<Func<ExaminationExamSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] ExaminationExamSchedule entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Examination.ExamSchedule"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] ExaminationExamSchedule entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Examination.ExamSchedule"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<ExaminationExamSchedule> entities)
        {

            Console.WriteLine(entities);
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Examination.ExamSchedule"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<ExaminationExamSchedule> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Examination.ExamSchedule"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] ExaminationExamSchedule entity)
        {
            Console.WriteLine("Exam Date +++++++++++++++++++++++++++" + entity.ExamDate);
            this.repository.Update(entity);
            // var insertdata = String.Format(@"SELECT * FROM ""Examination"".""UpdateExamMarktingWithExamSchedule""('{0}',{1})", entity.ExamScheduleId, entity.TotalMarks);
            // var datas = db.updatemarks.FromSql(insertdata);

            // Console.WriteLine("Exam Date +++++++++++++++++++++++++++" + datas);

            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Examination.ExamSchedule"));

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] ExaminationExamSchedule entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Examination.ExamSchedule"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] ExaminationExamSchedule entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Examination.ExamSchedule"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] ExaminationExamSchedule entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Examination.ExamSchedule"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamSchedule).Assembly);
            Expression<Func<ExaminationExamSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamSchedule).Assembly);
            Expression<Func<ExaminationExamSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCoursesbyTimetablee([FromBody] Predicate model)
        {

            //  IDbConnection connection = db.Database.GetDbConnection();
            // var rtv = new RTVSS() { ReturnValue = "" };

            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[2]);
            var classId = new Guid(model.ProvidedString.Split("?")[3]);
            var sectioncourselinkid = new string(model.ProvidedString.Split("?")[4]);
            //var courseId = model.ProvidedString.Split("?")[5];
            var datee = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetCoursesbyTimetable3""('{0}','{1}','{2}','{3}','{4}','{5}')", sessionId, campusId, programDetailId, classId, sectioncourselinkid, datee);
            // Console.WriteLine(sql);
            return Ok(db.Checkdayoff.FromSql(sql));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCoursesFromTimetable([FromBody] Predicate model)
        {

            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[2]);
            var classId = new Guid(model.ProvidedString.Split("?")[3]);
            var sectioncourselinkid = new string(model.ProvidedString.Split("?")[4]);
            var datee = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetCoursesFromTimetable""('{0}','{1}','{2}','{3}','{4}','{5}')", sessionId, campusId, programDetailId, classId, sectioncourselinkid, datee);
            // Console.WriteLine(sql);
            return Ok(db.getcourselist.FromSql(sql));
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckAlreadyExistingSubject([FromBody] Predicate model)

        {
            var courseId = new Guid(model.ProvidedString.Split("?")[0]);
            var datee = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var examName = new string(model.ProvidedString.Split("?")[2]);
            var sectioncourseLinkId = new string(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""CheckAlreadyExistingSubject""('{0}','{1}','{2}','{3}')", courseId, datee, examName, sectioncourseLinkId);
            // Console.WriteLine(sql);
            return Ok(db.Checkdayoff.FromSql(sql));

        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckSubjectExamMarking([FromBody] Predicate model)
        {


            var courseId = new Guid(model.ProvidedString.Split("?")[0]);
            var sectioncourseLinkId = new string(model.ProvidedString.Split("?")[1]);
            var examName = new string(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""CheckSubjectExamMarking""('{0}','{1}','{2}')", courseId, sectioncourseLinkId, examName);
            // Console.WriteLine(sql);
            return Ok(db.Checkdayoff.FromSql(sql));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateExamMasterwithExamschedul([FromBody] Predicate model)

        {
            var examschedulid = new Guid(model.ProvidedString.Split("?")[0]);
            var totalmarks = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""UpdateExamMarktingWithExamSchedule""('{0}',{1}) as pg_catalog", examschedulid, totalmarks);

            return Ok(this.db.updatemarks.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckExamIsApproved([FromBody] Predicate model)
        {


            // var courseId = new Guid(model.ProvidedString.Split("?")[0]);
            var sectioncourseLinkId = new string(model.ProvidedString.Split("?")[0]);
            var examName = new string(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""CheckExamisApproved""('{0}','{1}')", sectioncourseLinkId, examName);
            // Console.WriteLine(sql);
            return Ok(db.Checkdayoff.FromSql(sql));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteExamSchedulebyCourse([FromBody] Predicate model)
        {

            var sectioncourseLinkId = new string(model.ProvidedString.Split("?")[0]);
            var examscheduleid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""DeleteExamSchedule""('{0}','{1}') as pg_catalog ", sectioncourseLinkId, examscheduleid);
            // Console.WriteLine(sql);
            return Ok(db.updatemarks.FromSql(sql));
        }

    }
}