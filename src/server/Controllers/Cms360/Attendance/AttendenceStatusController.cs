
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

using Newtonsoft.Json;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AttendanceAttendenceStatusController : Controller
    {
        private readonly IAttendanceAttendenceStatusRepository repository;
        private readonly IUserLogService log;

        private DbContextBase db;
        public AttendanceAttendenceStatusController(IUserLogService log, DbContextBase db, IAttendanceAttendenceStatusRepository repository)
        {
            this.repository = repository;
            this.log = log;
            this.db = db;
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
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceStatus).Assembly);
            Expression<Func<AttendanceAttendenceStatus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceStatus, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceStatus).Assembly);
            Expression<Func<AttendanceAttendenceStatus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceStatus, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceStatus).Assembly);
            Expression<Func<AttendanceAttendenceStatus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceStatus, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceStatus).Assembly);
            Expression<Func<AttendanceAttendenceStatus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceStatus, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] AttendanceAttendenceStatus entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] AttendanceAttendenceStatus entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<AttendanceAttendenceStatus> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<AttendanceAttendenceStatus> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] AttendanceAttendenceStatus entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] AttendanceAttendenceStatus entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] AttendanceAttendenceStatus entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] AttendanceAttendenceStatus entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Attendance.AttendenceStatus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceStatus).Assembly);
            Expression<Func<AttendanceAttendenceStatus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceStatus, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceStatus).Assembly);
            Expression<Func<AttendanceAttendenceStatus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceStatus, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendenceDashboardData([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ClassHeldUnheld""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3],
            model.ProvidedString.Split("?")[4],
            model.ProvidedString.Split("?")[5],
            model.ProvidedString.Split("?")[6]);
            return Ok(this.db.AttendenceDashboard.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendenceDashboardData2([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""AttendanceDashboard2""('{0}','{1}','{2}','{3}','{4}','{5}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3],
            model.ProvidedString.Split("?")[4],
            model.ProvidedString.Split("?")[5]);
            //  Console.WriteLine(sql);

            return Ok(this.db.AttendenceDashboard2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendenceDashboardData2LastMonth([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""AttendanceDashboard2LastMonthsEx""('{0}','{1}','{2}','{3}','{4}','{5}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3],
            model.ProvidedString.Split("?")[4],
            model.ProvidedString.Split("?")[5]);
            //  Console.WriteLine(sql);

            return Ok(this.db.AttendanceDashboard2LastMonthsEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendenceDashboardData2CityWise([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""AttendanceDashboard2CityWise""('{0}','{1}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1]);
            //  Console.WriteLine(sql);

            return Ok(this.db.AttendanceDashboard2CityWise.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionDashboardData([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDown""('{0}','{1}','{2}','{3}','{4}','{5}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3],
            model.ProvidedString.Split("?")[4],
            model.ProvidedString.Split("?")[5]);
            return Ok(this.db.ConcessionDashboard.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionDashboardDataEx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownProgEx""('{0}','{1}','{2}','{3}','{4}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3],            
            model.ProvidedString.Split("?")[4]);
            return Ok(this.db.ConcessionDashboardEx2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ConcessionDrillDownClassEx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownClassEx""('{0}','{1}','{2}','{3}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3]
            );
            return Ok(this.db.ConcessionDashboardEx2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ConcessionDrillDownInsatlEx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownInsatlEx""('{0}','{1}','{2}','{3}','{4}',{5})",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3],
            model.ProvidedString.Split("?")[4],
            model.ProvidedString.Split("?")[5]
            );
            return Ok(this.db.ConcessionDashboardEx2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ConcessionDrillDownLevelEx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownLevelExemptEx""('{0}','{1}','{2}','{3}','{4}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3],
            model.ProvidedString.Split("?")[4]
           );
            return Ok(this.db.ConcessionDashboardEx2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionDashboardDataFx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownCityEx1""('{0}','{1}','{2}')",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2]);
            return Ok(this.db.ConcessionDashboardEx2.FromSql(sql));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetConcessionDashboardDataFxCity([FromBody] Predicate model)
        // {
        //     string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownCityEx""('{0}','{1}','{2}', '{3}')",
        //     model.ProvidedString.Split("?")[0],
        //     model.ProvidedString.Split("?")[1],
        //     model.ProvidedString.Split("?")[2],
        //     model.ProvidedString.Split("?")[3]);
        //     return Ok(this.db.ConcessionDashboardEx2.FromSql(sql));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetRevenueDashboardDataEx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""RevenueDash""('{0}','{1}','{2}',{3})",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2],
            model.ProvidedString.Split("?")[3]);
            return Ok(this.db.RevenueDashboard.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionDashboardDataExx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownExx""('{0}',{1})",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1]);
            return Ok(this.db.ConcessionDashboardEx.FromSql(sql));
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult ConcessionDrillDownWithExemptionExx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""ConcessionDrillDownWithExemptionExx""('{0}',{1})",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1]);
            return Ok(this.db.ConcessionDashboardEx2.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetRevenueDashboardData([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""RevenueDash""('{0}',{1})",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1]);
            return Ok(this.db.RevenueDashboard.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetRevenueDashboardDataFx([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""RevenueDash""('{0}','{1}',{2})",
            model.ProvidedString.Split("?")[0],
            model.ProvidedString.Split("?")[1],
            model.ProvidedString.Split("?")[2]);
            return Ok(this.db.RevenueDashboard.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendenceStudentList([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT * FROM ""Dashboard"".""StudentList""('{0}')",
            model.ProvidedString);
            return Ok(this.db.StudntListEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDeviceInfo([FromBody] Predicate model)
        {
            string sql = string.Format(@"SELECT ""Operation"" FROM ""Attendance"".""AttendenceMaster"" Where ""AttendenceMasterId"" = ('{0}')",
            model.ProvidedString);
            return Ok(this.db.DeviceInfoEx.FromSql(sql));
        }


    }
}