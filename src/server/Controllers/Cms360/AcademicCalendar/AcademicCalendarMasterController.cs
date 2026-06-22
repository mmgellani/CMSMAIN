
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
using System.Globalization;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AcademicCalendarMasterController : Controller
    {
        private readonly IAcademicCalendarMasterRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public AcademicCalendarMasterController(IAcademicCalendarMasterRepository repository, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;

        }
        private bool validateinputvalue(string input)
        {
            if (input == null || input == "" || input == " " || input == "null" || string.IsNullOrEmpty(input.Trim()))
            {
                return true;
            }
            return false;
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
        public IActionResult GetAcadmicCaldenview([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(model.ProvidedString.Split("?")[1]);
            var classId = new Guid(model.ProvidedString.Split("?")[2]);
            var boardId = new Guid(model.ProvidedString.Split("?")[3]);
            return Ok(this.db.AcademicCalendarMaster.Where(e => e.SessionId == sessionId && e.SubCityId == subCityId && e.ClassId == classId && e.BoardId == boardId && e.StatusId == 1));
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
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendarMaster).Assembly);
            Expression<Func<AcademicCalendarMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendarMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendarMaster).Assembly);
            Expression<Func<AcademicCalendarMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendarMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetApprovedCalendar([FromBody] Predicate model)
        {
            var userId = model.ProvidedString.Split("?")[0];
            string sql = String.Format(@"SELECT DISTINCT acm.* 
                FROM
                    ""AcademicCalendar"".""AcademicCalendarMaster"" acm
                    JOIN ""Setup"".""Campus"" camp ON acm.""SubCityId"" = camp.""SubCityId"" 
                WHERE
                    camp.""CampusId"" = ANY ( SELECT ""Id"" FROM ""Role"".""VWUserRights"" WHERE ""UserId"" = '{0}' ) 
                    AND acm.""StatusId"" = 1", userId);
            // Console.WriteLine(sql);
            return Ok(db.AcademicCalendarMaster.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetApprovedCalendarEx([FromBody] Predicate model)
        {
            var userId = model.ProvidedString.Split("?")[0];
            string sql = String.Format(@"select * from  ""AcademicCalendar"".""GetAcademicCalendarForApprovels""('{0}')", userId);
            // Console.WriteLine(sql);
            return Ok(db.AcademicCalendarMasterCity.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicCalendarMasterView([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"select * from  ""AcademicCalendarMaster"".""GetAcademicCalendarMasterView""('{0}','{1}','{2}')", sessionid, subcityid, classid);
            // Console.WriteLine(sql);
            return Ok("Success");
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByIds([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);

            //string sql = String.Format(this.db.AcademicCalendarMaster.Where(s=>s.sessionid==sessionid && s.SubCityId==subcityid && s.ClassId=classid).ToList());
            // Console.WriteLine(sql);
            return Ok(this.db.AcademicCalendarMaster.Where(s => s.SessionId == sessionid && s.SubCityId == subcityid && s.ClassId == classid && s.StatusId == 1));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCalendarMasterBoardWise([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var boardid = new Guid(model.ProvidedString.Split("?")[3]);

            //string sql = String.Format(this.db.AcademicCalendarMaster.Where(s=>s.sessionid==sessionid && s.SubCityId==subcityid && s.ClassId=classid).ToList());
            // Console.WriteLine(sql);
            return Ok(this.db.AcademicCalendarMaster.Where(s => s.SessionId == sessionid && s.SubCityId == subcityid && s.ClassId == classid && s.BoardId == boardid && s.StatusId == 1));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicCalendarMasterSingleData([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var AcademicCalendarMasterid = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"select * from  ""AcademicCalendarMaster"".""GetAcademicCalendarMasterView""('{0}','{1}','{2}') where ""AcademicCalendarMasterId""='{3}'", sessionid, subcityid, classid, AcademicCalendarMasterid);
            // Console.WriteLine(sql);
            return Ok("Success");
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
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendarMaster).Assembly);
            Expression<Func<AcademicCalendarMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendarMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendarMaster).Assembly);
            Expression<Func<AcademicCalendarMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendarMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] AcademicCalendarMaster entity)
        {
            try
            {
                var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(entity.FromDate));
                var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(entity.ToDate));
                entity.Weeks = Convert.ToInt32((entity.ToDate - entity.FromDate).TotalDays) / 7;

                var fDate = entity.FromDate;

                DayOfWeek day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(fDate);
                if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
                {
                    fDate = fDate.AddDays(3);
                }

                // Return the week of our adjusted day
                entity.YearlyWeekNo = CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(fDate, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);

                // Console.WriteLine(entity.YearlyWeekNo);

                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "AcademicCalendarMaster.AcademicCalendarMaster"));
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
        public async Task<IActionResult> AddOneAsync([FromBody] AcademicCalendarMaster entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Medium"));
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<AcademicCalendarMaster> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<AcademicCalendarMaster> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] AcademicCalendarMaster entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "AcademicCalendar.AcademicCalendarMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] AcademicCalendarMaster entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] AcademicCalendarMaster entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] AcademicCalendarMaster entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendarMaster).Assembly);
            Expression<Func<AcademicCalendarMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendarMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendarMaster).Assembly);
            Expression<Func<AcademicCalendarMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendarMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }

}
