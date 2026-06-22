
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

using Newtonsoft.Json;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class DayOffController : Controller
    {
        private readonly IDayOffRepository repository;
        private readonly IDayOffVMRepository repositoryVM;

        private readonly DbContextBase db;

        private readonly IUserLogService log;
        public DayOffController(DbContextBase db, IDayOffRepository repository, IDayOffVMRepository repositoryVM, IUserLogService log)
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

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.repository.All());
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] Predicate predicate)
        {
            var sectioncourselinkid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var slottimingid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var query = String.Format(@"select * from ""TimeTable"".""GetDayOffVM""('{0}','{1}')", sectioncourselinkid, slottimingid);
            // Console.WriteLine(query);
            return Ok(this.db.DayOffVM.FromSql(query));
        }
        
        //   [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetTimeTabledata()
        // {
        //     string sql = String.Format(@"select * from ""TimeTable"".""VWTimeTableSession"" ");
        //     return Ok(this.db.TimeTableTimeTableVM.FromSql(sql));
        // }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.FindByAsync(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(DayOff).Assembly);
            Expression<Func<DayOff, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<DayOff, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(DayOff).Assembly);
            Expression<Func<DayOff, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<DayOff, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(DayOff).Assembly);
            Expression<Func<DayOff, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<DayOff, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(DayOff).Assembly);
            Expression<Func<DayOff, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<DayOff, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]DayOff entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]DayOff entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<DayOff> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<DayOff> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]DayOff entity)
        {
            this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]DayOff entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]DayOff entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]DayOff entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "TimeTable.DayOff"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(DayOff).Assembly);
            Expression<Func<DayOff, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<DayOff, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(DayOff).Assembly);
            Expression<Func<DayOff, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<DayOff, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}