
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
    public class TimeTableSlotsController : Controller
    {
        private readonly ITimeTableSlotsRepository repository;
         private readonly ITimeTableSlotsRepositoryVM VMrepository;
         private readonly IUserLogService log;
        public TimeTableSlotsController(ITimeTableSlotsRepository repository,ITimeTableSlotsRepositoryVM VMrepository,IUserLogService log )
        {
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
            return Ok(this.repository.All());
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok( await this.VMrepository.FindByAsync(e=>e.StatusId!=2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlots).Assembly);
            Expression<Func<TimeTableSlots, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlots, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlots).Assembly);
            Expression<Func<TimeTableSlots, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlots, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlots).Assembly);
            Expression<Func<TimeTableSlots, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlots, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlots).Assembly);
            Expression<Func<TimeTableSlots, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlots, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]TimeTableSlots entity)
        {
            this.repository.Add(entity);
             return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "TimeTable.Slots"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]TimeTableSlots entity)
        {
            await this.repository.AddAsync(entity);
             return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "TimeTable.Slots"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<TimeTableSlots> entities)
        {
            this.repository.AddAll(entities);
             return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "TimeTable.Slots"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<TimeTableSlots> entities)
        {
            await this.repository.AddAllAsync(entities);
             return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "TimeTable.Slots"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]TimeTableSlots entity)
        {
           this.repository.Update(entity);
           string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "TimeTable.Slots"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]TimeTableSlots entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "TimeTable.Slots"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]TimeTableSlots entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "TimeTable.Slots"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]TimeTableSlots entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "TimeTable.Slots"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlots).Assembly);
            Expression<Func<TimeTableSlots, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlots, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableSlots).Assembly);
            Expression<Func<TimeTableSlots, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableSlots, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}