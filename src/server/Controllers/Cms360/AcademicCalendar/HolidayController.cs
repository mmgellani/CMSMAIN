
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
    public class HolidayController : Controller
    {
        private readonly IHolidayRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public HolidayController(IHolidayRepository repository, DbContextBase db, IUserLogService log)
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

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllHolidays()
        {
            return Ok(this.db.Holidays.FromSql(String.Format("Select * from \"AcademicCalendar\".\"Holiday\" Where \"StatusId\"!=2   ")));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetHolidays([FromBody] Predicate model)
        {
            var holidayTypeId = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format("Select * from \"AcademicCalendar\".\"Holiday\" Where \"StatusId\"!=2 AND \"HolidayTypeId\"= '{0}'", holidayTypeId);
            // Console.WriteLine(sql);
            return Ok(db.Holidays.FromSql(sql));
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
            var options = ScriptOptions.Default.AddReferences(typeof(Holidays).Assembly);
            Expression<Func<Holidays, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<Holidays, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(Holidays).Assembly);
            Expression<Func<Holidays, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<Holidays, bool>>(predicate.ProvidedString, options));

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
            var options = ScriptOptions.Default.AddReferences(typeof(Holidays).Assembly);
            Expression<Func<Holidays, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<Holidays, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(Holidays).Assembly);
            Expression<Func<Holidays, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<Holidays, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] Holidays entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "AcademicCalendar.Holiday"));
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
        public async Task<IActionResult> AddOneAsync([FromBody] Holidays entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "AcademicCalendar.Holiday"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertHolidays([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var holidayid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var fullname = new string(predicate.ProvidedString.Split("?")[1]);
            var description = new string(predicate.ProvidedString.Split("?")[2]);
            var holidaytypeid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var dated = new string(predicate.ProvidedString.Split("?")[4]);
            var ope = new string(predicate.ProvidedString.Split("?")[5]);
            var statusid = Convert.ToInt32(predicate.ProvidedString.Split("?")[6]);

            string json = string.Format("SELECT \"AcademicCalendar\".\"InsertHolidays\"('{0}','{1}','{2}','{3}','{4}','{5}',{6}) as \"ReturnValue\" ", holidayid, fullname, description, holidaytypeid, dated, ope, statusid);
            // Console.WriteLine (json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<Holidays> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "AcademicCalendar.Holiday"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<Holidays> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "AcademicCalendar.Holiday"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] Holidays entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "AcademicCalendar.Holiday"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] Holidays entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "AcademicCalendar.Holiday"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] Holidays entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "AcademicCalendar.Holiday"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] Holidays entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "AcademicCalendar.Holiday"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(Holidays).Assembly);
            Expression<Func<Holidays, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<Holidays, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(Holidays).Assembly);
            Expression<Func<Holidays, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<Holidays, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}