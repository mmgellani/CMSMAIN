
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

namespace Cms360.UI.Controllers.Account
{
           [AllowAnonymous]
        [IgnoreAntiforgeryToken]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AssessmentScheduleController : Controller
    {
        private readonly IAssessmentScheduleRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public AssessmentScheduleController(IAssessmentScheduleRepository repository, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMonthlyPlanner([FromBody] Predicate model)
        {
            try
            {
                var academicCalendarMasterId = new Guid(model.ProvidedString.Split("?")[0]);
                var campusId = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityId = new Guid(model.ProvidedString.Split("?")[2]);
                var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = model.ProvidedString.Split("?")[4];
                var toDate = model.ProvidedString.Split("?")[5];
                string sql = String.Format(@"SELECT * FROM ""AcademicCalendar"".""MonthlyPlannerEx""('{0}','{1}','{2}','{3}','{4}','{5}') ORDER BY ""DateRange""", academicCalendarMasterId, campusId, subCityId, programDetailId, fromDate, toDate);
                return Ok(db.MonthlyPlannerReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetMonthlyPlanner, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSubWiseCalendarReport([FromBody] Predicate model)
        {
            try
            {
                var academicCalendarMasterId = new Guid(model.ProvidedString.Split("?")[0]);
                var campusId = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityId = new Guid(model.ProvidedString.Split("?")[2]);
                var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
                var courseId = new Guid(model.ProvidedString.Split("?")[4]);
                string sql = String.Format(@"SELECT * FROM ""AcademicCalendar"".""SubWiseCalendarReport""('{0}','{1}','{2}','{3}','{4}') ORDER BY ""DateRange""", academicCalendarMasterId, campusId, subCityId, programDetailId, courseId);
                return Ok(db.SubWiseCalendarReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetMonthlyPlanner, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
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
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedule).Assembly);
            Expression<Func<AssessmentSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteCalendar([FromBody] Predicate model)
        {
            var academicCalendarId = new Guid(model.ProvidedString.Split("?")[0]);
            int sql = this.db.Database.ExecuteSqlCommand(String.Format("Delete from \"AcademicCalendar\".\"AcademicCalendar\" Where  \"AcademicCalendar\".\"AcademicCalendarId\"= '{0}'", academicCalendarId));
            Console.WriteLine(sql);
            return Ok("Successfully Deleted");
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedule).Assembly);
            Expression<Func<AssessmentSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicCalendarView([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var academicCalendarMasterId = new Guid(model.ProvidedString.Split("?")[3]);
            var courseid = new Guid(model.ProvidedString.Split("?")[4]);

            string sql = String.Format(@"select * from  ""AcademicCalendar"".""GetAcademicCalendarViewEx""('{0}','{1}','{2}','{3}','{4}')", sessionid, subcityid, classid,academicCalendarMasterId, courseid);
            // Console.WriteLine(sql);
            return Ok(this.db.AcademicCalendarView.FromSql(sql));
        }

          [HttpPost]
        [Route("[action]")]
        public IActionResult GetassesmentSceduleData([FromBody] Predicate model)
        {
            var assessmentSchemeMasterId = new Guid(model.ProvidedString.Split("?")[0]);
            var assessmentSchedulingDetailId = new Guid(model.ProvidedString.Split("?")[1]);
            var examtype = model.ProvidedString.Split("?")[2];
            string sql = String.Format(@"select * from  ""Assessment"".""GetAssesmentSeceduleData""('{0}','{1}','{2}')", assessmentSchemeMasterId, assessmentSchedulingDetailId, examtype);
            // Console.WriteLine(sql);
            return Ok(this.db.GetAssessmentView.FromSql(sql));
        }

        

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetAssessmentListView([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[2]);
            var classId = new Guid(model.ProvidedString.Split("?")[3]);
            var assessmentSchemeMasterId = new Guid(model.ProvidedString.Split("?")[4]);
            var assessmentSchedulingDetailId = new Guid(model.ProvidedString.Split("?")[5]);
            var sectionId = model.ProvidedString.Split("?")[6];
            var statusid = model.ProvidedString.Split("?")[7];
             string sql ;
            if(statusid == null || statusid == ""  || statusid == "0" ||  statusid == "00000000-00000000-00000000-00000000"){
                 sql = String.Format(@"select * from  ""Assessment"".""GetAssessmentScheduleList""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')",sessionId, campusId,programDetailId,classId, assessmentSchemeMasterId, assessmentSchedulingDetailId,sectionId);
           
            }
           else{
             sql = String.Format(@"select * from  ""Assessment"".""GetAssessmentScheduleListwithStatus""('{0}','{1}','{2}','{3}')", assessmentSchemeMasterId, assessmentSchedulingDetailId, sectionId,statusid);

           }

            Console.WriteLine(sql);
            return Ok(this.db.AssessmentViewList.FromSql(sql));
        }


           [HttpPost]
        [Route("[action]")]
        public IActionResult GetAssessmentSceduleList([FromBody] Predicate model)
        {

            var assessmentSchedulingDetailId = new Guid(model.ProvidedString.Split("?")[0]);
            var assessmentSchedulingsectionId = new Guid(model.ProvidedString.Split("?")[1]);
        
           
            var sql = String.Format(@"select * from  ""Assessment"".""getscedulelidtdata""('{0}','{1}')", assessmentSchedulingDetailId,assessmentSchedulingsectionId);


            Console.WriteLine(sql);
            return Ok(this.db.AssessmentScedileViewList.FromSql(sql));
        }

                [HttpPost]
        [Route("[action]")]
        public IActionResult deleteAssessmentSceduleList([FromBody] Predicate model)
        {

            var assessmentSchedulingDetailId = new Guid(model.ProvidedString.Split("?")[0]);
            var assessmentSchedulingsectionId = new Guid(model.ProvidedString.Split("?")[1]);
            var sql = String.Format(@"select * from  ""Assessment"".""deleteAssmentScedule""('{0}','{1}')", assessmentSchedulingDetailId,assessmentSchedulingsectionId);
            Console.WriteLine(sql);
            return Ok(this.db.deleteAssessmentSchedule.FromSql(sql));
        }

        
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicCalendarSingleData([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var academiccalendarid = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"select * from  ""AcademicCalendar"".""GetAcademicCalendarView""('{0}','{1}','{2}') where ""AcademicCalendarId""='{3}'", sessionid, subcityid, classid,academiccalendarid);
            // Console.WriteLine(sql);
            return Ok(this.db.AcademicCalendarView.FromSql(sql));
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetClassAgainstLevel([FromBody] Predicate model)
        {
            var levelid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"select * from  ""Assessment"".""GetClassAgainstLevel""('{0}','{1}','{2}')", levelid, campusid, programid);
            Console.WriteLine(sql);
            return Ok(this.db.AssessmentLevelClass.FromSql(sql));
        }



        // [HttpGet]
        // [Route("[action]")]
        // public async Task<IActionResult> GetAllActiveAsync()
        // {
        //     return Ok(await this.repository.FindByAsync(e => e.StatusId != 2));
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedule).Assembly);
            Expression<Func<AssessmentSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedule).Assembly);
            Expression<Func<AssessmentSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] AssessmentSchedule entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "AcademicCalendar.AcademicCalendar"));
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
        public async Task<IActionResult> AddOneAsync([FromBody] AssessmentSchedule entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Medium"));
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<AssessmentSchedule> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<AssessmentSchedule> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] AssessmentSchedule entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] AssessmentSchedule entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] AssessmentSchedule entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "AcademicCalendar.AcademicCalendar"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] AssessmentSchedule entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedule).Assembly);
            Expression<Func<AssessmentSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedule).Assembly);
            Expression<Func<AssessmentSchedule, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedule, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}