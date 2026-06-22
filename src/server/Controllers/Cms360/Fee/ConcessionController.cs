/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server;
using Cms360.Server.Model;
using Cms360.Service;
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
    public class FeeConcessionController : Controller
    {
        private readonly IFeeConcessionRepository repository;
        private readonly IFeeConcessionVMRepository VMrepository;
        private readonly IUserLogService log;
        private readonly DbContextBase db;

        public FeeConcessionController(DbContextBase db, IFeeConcessionRepository repository, IFeeConcessionVMRepository VMrepository, IUserLogService log)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
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
            return Ok(this.VMrepository.FindBy(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetExistingConcession([FromBody]Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var shifftid = new Guid(model.ProvidedString.Split("?")[2]);
            var challanType = new Guid(model.ProvidedString.Split("?")[3]);
            var query = String.Format(@"SELECT DISTINCT ""FullName"" as ""ProvidedString"" FROM ""Fee"".""Concession"" WHERE 
				""ZoneId""='{0}' and ""ShiftId""='{1}'  and ""SessionId""='{2}' and ""ChallanTypeId""='{3}' and ""StatusId""=1", zoneid, shifftid, sessionid, challanType);
            // Console.WriteLine(query);
            return Ok(await this.db.Predicate.FromSql(query).ToListAsync());

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
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcession).Assembly);
            Expression<Func<FeeConcession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcession, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcession).Assembly);
            Expression<Func<FeeConcession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcession, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult LoadConcession([FromBody]Predicate model)
        // {
        //     var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
        //    // var campusid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var programid = new Guid(model.ProvidedString.Split("?")[1]);
        //     var shiftid = new Guid(model.ProvidedString.Split("?")[2]);
        //     var zoneid=
        //     return Ok();
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcession).Assembly);
            Expression<Func<FeeConcession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcession, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByVM([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcessionVM).Assembly);
            Expression<Func<FeeConcessionVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcessionVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.VMrepository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcession([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var zoneId = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]); 
            
            return Ok(this.db.FeeConcessionVM.Where(e => e.StatusId != 2 && e.SessionId == sessionId && e.ZoneId == zoneId && e.ProgramId == programId));

            //return Ok(this.VMrepository.FindBy(e => e.StatusId != 2 && e.SessionId == sessionId && e.ZoneId == zoneId && e.ProgramId == programId));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcession).Assembly);
            Expression<Func<FeeConcession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcession, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] FeeConcession entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] FeeConcession entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<FeeConcession> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<FeeConcession> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] FeeConcession entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] FeeConcession entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] FeeConcession entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] FeeConcession entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.Concession"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcession).Assembly);
            Expression<Func<FeeConcession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcession, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcession).Assembly);
            Expression<Func<FeeConcession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcession, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}