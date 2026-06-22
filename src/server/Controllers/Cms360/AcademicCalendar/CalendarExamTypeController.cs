
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
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class CalendarExamTypeController : Controller
    {
        private readonly ICalendarExamTypeRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public CalendarExamTypeController(ICalendarExamTypeRepository repository, DbContextBase db, IUserLogService log)
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
        public IActionResult DeleteCalendarExam([FromBody] Predicate model)
        {
            var calendarExamTypeId = new Guid(model.ProvidedString.Split("?")[0]);
            int sql = this.db.Database.ExecuteSqlCommand(String.Format("Update \"AcademicCalendar\".\"CalendarExamType\" Set \"StatusId\" = 2  Where  \"CalendarExamType\".\"CalendarExamTypeId\"= '{0}'", calendarExamTypeId));
            Console.WriteLine(sql);
            return Ok("Successfully Deleted");
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
            var options = ScriptOptions.Default.AddReferences(typeof(CalendarExamType).Assembly);
            Expression<Func<CalendarExamType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CalendarExamType, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CalendarExamType).Assembly);
            Expression<Func<CalendarExamType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CalendarExamType, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CalendarExamType).Assembly);
            Expression<Func<CalendarExamType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CalendarExamType, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CalendarExamType).Assembly);
            Expression<Func<CalendarExamType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CalendarExamType, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] CalendarExamType entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "AcademicCalendar.CalendarExamType"));
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
        public async Task<IActionResult> AddOneAsync([FromBody] CalendarExamType entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "AcademicCalendar.CalendarExamType"));
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<CalendarExamType> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "AcademicCalendar.CalendarExamType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<CalendarExamType> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "AcademicCalendar.CalendarExamType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] CalendarExamType entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "AcademicCalendar.CalendarExamType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] CalendarExamType entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "AcademicCalendar.CalendarExamType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] CalendarExamType entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "AcademicCalendar.CalendarExamType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] CalendarExamType entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "AcademicCalendar.CalendarExamType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CalendarExamType).Assembly);
            Expression<Func<CalendarExamType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CalendarExamType, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CalendarExamType).Assembly);
            Expression<Func<CalendarExamType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CalendarExamType, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}