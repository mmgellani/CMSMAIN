
using System.Globalization;
using System.Runtime.CompilerServices;
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ExaminationExamDetailController : Controller
    {
        private readonly IExaminationExamDetailRepository repository;
        private readonly IExamDataVMRepository repo;
        private readonly IUserLogService log;

        private readonly IExaminationExamDetailVMRepository VMrepository;
        private readonly DbContextBase db;

        public ExaminationExamDetailController(IExaminationExamDetailRepository repository, IUserLogService log, IExaminationExamDetailVMRepository VMrepository, IExamDataVMRepository repo, DbContextBase db)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
            this.db = db;
            this.log = log;
            this.repo = repo;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamCourse([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            // var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[1]);



            return Ok(db.ExamCourseVM.Where(s => s.CampusProgramId == campusProgramId && s.ClassId == classId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherSection([FromBody] Predicate predicate)
        {
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[0]);
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var query = string.Format(@"SELECT * FROM ""TimeTable"".""GetTeacherSections""({0},'{1}','{2}')", userid, sessionId, classid);
            // Console.WriteLine(query);
            return Ok(this.db.TeacherSection.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherCourse([FromBody] Predicate predicate)
        {
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[0]);
            var programcourseid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var query = string.Format(@"SELECT * FROM ""TimeTable"".""GetTeacherCourses""({0},'{1}','{2}','{3}')", userid, programcourseid, classid, sessionId);

            // Console.WriteLine(query);
            return Ok(this.db.TeacherCourse.FromSql(query));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherExamData([FromBody] Predicate predicate)
        {

            var sectioncourseid = new Guid(predicate.ProvidedString);

            var query = String.Format(@"Select * from ""Examination"".""GetTeacherExamBulkData""('{0}')", sectioncourseid);
            // Console.WriteLine(query);

            return Ok(db.ExamBulkVM1.FromSql(query));
        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherExamDataEX([FromBody] Predicate predicate)
        {  
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectionCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var programCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var examScheduleId = new Guid(predicate.ProvidedString.Split("?")[4]);  

            var query = String.Format(@"Select * from ""Examination"".""GetTeacherExamBulkDataEX""('{0}','{1}','{2}','{3}','{4}')",sessionId,classId,sectionCourseLinkId,programCourseLinkId,examScheduleId);
            // Console.WriteLine(query);

            return Ok(db.ExamBulkVM1.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamData([FromBody] Predicate predicate)
        {
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var courseId = new Guid(predicate.ProvidedString.Split("?")[5]);

            var query = String.Format(@"Select * from ""Examination"".""GetExamBulkData""('{0}','{1}','{2}','{3}','{4}','{5}')", sessionId, campusId, programDetailId, classId, sectionId, courseId);
            // Console.WriteLine(query);

            return Ok(db.ExamBulkVM.FromSql(query));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSubjectExamReport([FromBody] Predicate predicate)
        {
            var sectioncourselinkid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var courseid = new Guid(predicate.ProvidedString.Split("?")[1]);


            var query = String.Format(@"Select * from ""Examination"".""SubjectExamReport""('{0}','{1}')", sectioncourselinkid, courseid);
            // Console.WriteLine(query);

            return Ok(db.SubjectExamReport.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamUpdateData([FromBody] Predicate predicate)
        {
            var sectioncourseid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programcourseid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var dated = predicate.ProvidedString.Split("?")[3];
            var query = String.Format(@"select * from ""Examination"".""GetExamBulkUpdate""('{0}','{1}','{2}','{3}')", sectioncourseid, programcourseid, examtypeid, dated);
            return Ok(this.db.ExamBulkUpdateVM.FromSql(query));
        }


          [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamUpdateDataExam2([FromBody] Predicate predicate)
        {
            var examscheduleid = new Guid(predicate.ProvidedString.Split("?")[0]);
           
            var query = String.Format(@"select * from ""Examination"".""GetExamBulkUpdate""('{0}')", examscheduleid);
            return Ok(this.db.ExamBulkUpdateVM.FromSql(query));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamScheduleUpdateData([FromBody] Predicate predicate)
        {
            var sectioncourseid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programcourseid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var dated = predicate.ProvidedString.Split("?")[3];
            var examScheduleId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var query = String.Format(@"select * from ""Examination"".""GetExamScheduleBulkUpdate""('{0}','{1}','{2}','{3}','{4}')", sectioncourseid, programcourseid, examtypeid, dated,examScheduleId);
            Console.WriteLine(query);
            return Ok(this.db.ExamBulkUpdateVM.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamScheduleBulkPreview([FromBody] Predicate predicate)
        {
           
            var examScheduleId = predicate.ProvidedString;
            var query = String.Format(@"select * from ""Examination"".""GetExamScheduleBulkPreview""('{0}')",examScheduleId);
            Console.WriteLine(query);
            return Ok(this.db.ExamBulkUpdateVM.FromSql(query));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateExamBulk([FromBody] Predicate predicate)
        {

            IDbConnection connection = db.Database.GetDbConnection();

            var query = String.Format(@"select * from ""Examination"".""ExamBulkUpdate""('{0}')", predicate.ProvidedString);
            // Console.WriteLine(query);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok("Done");
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertExamBulk([FromBody] Predicate predicate)
        {
            var master = predicate.ProvidedString.Split("?")[0];
            var detail = predicate.ProvidedString.Split("?")[1];
            var Data=this.log.GetLog();
            IDbConnection connection = db.Database.GetDbConnection();

            var query = String.Format(@"select * from ""Examination"".""ExamBulkInsert""('{0}','{1}','{2}')", master, detail,Data);
             Console.WriteLine(query);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok("Done");

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckClash([FromBody] Predicate model)
        {


            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusProgramId = new Guid(model.ProvidedString.Split("?")[1]);
            var classId = new string(model.ProvidedString.Split("?")[2]);
            var SectionId = new Guid(model.ProvidedString.Split("?")[3]);
            var courseId = new Guid(model.ProvidedString.Split("?")[4]);
            var examTypeId = new Guid(model.ProvidedString.Split("?")[5]);
            var dated = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);


            var z = this.db.IntModel.FromSql(String.Format("SELECT \"Examination\".\"val\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionId, campusProgramId, classId, SectionId, courseId, examTypeId, dated));

            return Ok(z);

        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            //return Ok(this.VMrepository.FindBy(e => e.StatusId != 2));
            return Ok(this.db.ExaminationExamDetailVM.Where(e => e.StatusId != 2));
            
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
            Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
            Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
            Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate predicate)
        {
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var courseId = new Guid(predicate.ProvidedString.Split("?")[5]);


            return Ok(this.db.ExamDataVM.Where(e => e.SessionId == sessionId && e.CampusId == campusId && e.ProgramDetailId == programDetailId && e.ClassId == classId && e.SectionId == sectionId && e.CourseId == courseId && e.StatusId == 1));
            
            //return Ok(this.repo.FindBy(e => e.SessionId == sessionId && e.CampusId == campusId && e.ProgramDetailId == programDetailId && e.ClassId == classId && e.SectionId == sectionId && e.CourseId == courseId && e.StatusId == 1));
            // return Ok(this.repo.All());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
            Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]ExaminationExamDetail entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]ExaminationExamDetail entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<ExaminationExamDetail> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<ExaminationExamDetail> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]ExaminationExamDetail entity)
        {
            this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]ExaminationExamDetail entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]ExaminationExamDetail entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]ExaminationExamDetail entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Examination.ExamDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
            Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
            Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}