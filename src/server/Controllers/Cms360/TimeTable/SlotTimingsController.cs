
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class TimeTableSlotTimingsController : Controller
    {
        private readonly ITimeTableSlotTimingsRepository repository;
        private readonly ITimeTableVWSlotTimingsRepository repositoryVW;
         private readonly IUserLogService log;

        private readonly ITimeTableSlotTimingsVMRepository VMrepository;
        public TimeTableSlotTimingsController(ITimeTableVWSlotTimingsRepository repositoryVW ,ITimeTableSlotTimingsRepository repository, ITimeTableSlotTimingsVMRepository VMrepository,IUserLogService log)
        {
            this.repositoryVW = repositoryVW;
            this.repository = repository;
            this.VMrepository = VMrepository;
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
            return Ok(this.VMrepository.FindBy(e=>e.StatusId!=2));
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
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlotTimings).Assembly);
            Expression<Func<TimeTableSlotTimings, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlotTimings, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlotTimings).Assembly);
            Expression<Func<TimeTableSlotTimings, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlotTimings, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlotTimings).Assembly);
            Expression<Func<TimeTableSlotTimings, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlotTimings, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByVM([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableVWSlotTimings).Assembly);
            Expression<Func<TimeTableVWSlotTimings, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableVWSlotTimings, bool>>(predicate.ProvidedString, options));

            return Ok(this.repositoryVW.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlotTimings).Assembly);
            Expression<Func<TimeTableSlotTimings, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlotTimings, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]TimeTableSlotTimings entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]TimeTableSlotTimings entity)
        {
            await this.repository.AddAsync(entity);
             return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<TimeTableSlotTimings> entities)
        {
           this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<TimeTableSlotTimings> entities)
        {
            await this.repository.AddAllAsync(entities);
             return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]TimeTableSlotTimings entity)
        {
            this.repository.Update(entity);
             string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]TimeTableSlotTimings entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]TimeTableSlotTimings entity)
        {
           this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]TimeTableSlotTimings entity)
        {
             await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "TimeTable.SlotTimings"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlotTimings).Assembly);
            Expression<Func<TimeTableSlotTimings, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlotTimings, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlotTimings).Assembly);
            Expression<Func<TimeTableSlotTimings, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlotTimings, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}