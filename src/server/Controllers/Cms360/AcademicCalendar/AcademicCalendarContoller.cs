
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
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;
using Newtonsoft.Json.Linq;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AcademicCalendarController : Controller
    {
        private readonly IAcademicCalendarRepository repository;
        private readonly DbContextBase db;

        private readonly IUserLogService log;
        private readonly IARVO_ConfigurationsRepository arvorepository;

        public AcademicCalendarController(IAcademicCalendarRepository repository, DbContextBase db, IARVO_ConfigurationsRepository arvorepository, IUserLogService log  )
        {
            this.repository = repository;
            this.db = db;
            this.log = log;
            this.arvorepository = arvorepository; 
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
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendar).Assembly);
            Expression<Func<AcademicCalendar, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendar, bool>>(predicate.ProvidedString, options));

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
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendar).Assembly);
            Expression<Func<AcademicCalendar, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendar, bool>>(predicate.ProvidedString, options));

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

            string sql = String.Format(@"select * from  ""AcademicCalendar"".""GetAcademicCalendarViewEx""('{0}','{1}','{2}','{3}','{4}')", sessionid, subcityid, classid, academicCalendarMasterId, courseid);
            // Console.WriteLine(sql);
            return Ok(this.db.AcademicCalendarView.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicCalendarSingleData([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var academiccalendarid = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"select * from  ""AcademicCalendar"".""GetAcademicCalendarView""('{0}','{1}','{2}') where ""AcademicCalendarId""='{3}'", sessionid, subcityid, classid, academiccalendarid);
            // Console.WriteLine(sql);
            return Ok(this.db.AcademicCalendarView.FromSql(sql));
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
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendar).Assembly);
            Expression<Func<AcademicCalendar, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendar, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendar).Assembly);
            Expression<Func<AcademicCalendar, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendar, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] AcademicCalendar entity)
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
        public async Task<IActionResult> AddOneAsync([FromBody] AcademicCalendar entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckFullWeekEnable([FromBody] Predicate model)
        {
            bool response = false;
            int newvalue = 0;

            try
            {
                if (!string.IsNullOrEmpty(model.ProvidedString))
                {
                    var AcdamicCalenderIds = model.ProvidedString;
                    string[] idArray = AcdamicCalenderIds.Split(',');

                    foreach (string id in idArray)
                    {
                        if (Guid.TryParse(id, out Guid parsedId))
                        {
                            var academicCalendardata = this.db.AcademicCalendar.FirstOrDefault(e => e.AcademicCalendarId == parsedId);

                            if (academicCalendardata != null)
                            {
                                if (academicCalendardata.FromDate.Date != academicCalendardata.ToDate.Date)
                                {
                                    newvalue = newvalue + 1;
                                }
                            }
                            else
                            {
                                // Log or handle the case where academicCalendardata is null
                                Console.WriteLine($"No data found for AcademicCalendarId: {parsedId}");
                            }
                        }
                        else
                        {
                            // Log or handle invalid GUID case
                            Console.WriteLine($"Invalid GUID: {id}");
                        }
                    }
                }

                response = newvalue > 0;

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteFullWeekIds([FromBody] Predicate model)
        {
            if (!string.IsNullOrEmpty(model.ProvidedString))
            {
                var courseid = new Guid(model.ProvidedString.Split("?")[0]);
                var boardid = new Guid(model.ProvidedString.Split("?")[1]);
                var classid = new Guid(model.ProvidedString.Split("?")[2]);
                var academiccalentermasterid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromdateString = model.ProvidedString.Split("?")[4];
                var todateString = model.ProvidedString.Split("?")[5];
                DateTime fromdate = DateTime.Parse(fromdateString);
                DateTime todate = DateTime.Parse(todateString);

                var academiccalendarids = this.db.AcademicCalendar.Where(e => e.AcademicCalendarMasterId == academiccalentermasterid && e.FromDate >= fromdate && e.ToDate <= todate && e.CourseId == courseid).ToList();

                try
                {
                    if (academiccalendarids != null)
                    {
                        foreach (var academiccalendarid in academiccalendarids)
                        {
                            Predicate p = new Predicate();
                            p.ProvidedString = academiccalendarid.AcademicCalendarId.ToString();
                            this.DeleteCalendar(p);
                        }
                    }
                    return Ok(true);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteOldIds([FromBody] Predicate model)
        {
            if (!string.IsNullOrEmpty(model.ProvidedString))
            {
                var AcdamicCalenderIds = model.ProvidedString;
                string[] idArray = AcdamicCalenderIds.Split(',');
                foreach (string id in idArray)
                {
                    var academicCalendardata = this.db.AcademicCalendar.FirstOrDefault(e => e.AcademicCalendarId == Guid.Parse(id));
                    this.Delete(academicCalendardata);
                }
            }
            return Ok(true);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<AcademicCalendar> entities)
        {
            // foreach (var entity in entities)
            // {
            //     if (entity.FromDate != entity.ToDate)
            //     {
            //         var academicCalendar = this.db.AcademicCalendar.FirstOrDefault(e => e.CourseId == entity.CourseId && e.AcademicCalendarTypeId==entity.AcademicCalendarTypeId && e.AcademicCalendarMasterId == entity.AcademicCalendarMasterId && e.TopicIds == entity.TopicIds && e.TopicValue == entity.TopicValue && e.FromDate >= entity.FromDate && e.ToDate<= entity.ToDate) as AcademicCalendar;
            //         if (academicCalendar != null){
            //             this.Delete(academicCalendar);
            //         }
            //     }
            // }
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<AcademicCalendar> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] AcademicCalendar entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] AcademicCalendar entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] AcademicCalendar entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "AcademicCalendar.AcademicCalendar"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] AcademicCalendar entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendar).Assembly);
            Expression<Func<AcademicCalendar, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendar, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicCalendar).Assembly);
            Expression<Func<AcademicCalendar, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicCalendar, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
        
    }
}