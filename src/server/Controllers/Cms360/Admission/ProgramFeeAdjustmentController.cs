
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
using Cms360.Data;
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
    public class ProgramFeeAdjustmentController : Controller
    {
        private readonly IProgramFeeAdjustmentRepository repository;
        private readonly IUserLogService log;
        private readonly DbContextBase db;

        public ProgramFeeAdjustmentController(DbContextBase db,IProgramFeeAdjustmentRepository repository, IUserLogService log)
        {
            this.repository = repository;
            this.log = log;
            this.db=db;
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
        public IActionResult GetAllVMExDel([FromBody] Predicate model)
        {
             var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            return Ok(this.db.ProgramFeeAdjustmentVM.Where(s=>s.SessionId == sessionid && s.CampusId == campusid && s.StatusId!=2));
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
            var options = ScriptOptions.Default.AddReferences(typeof(ProgramFeeAdjustment).Assembly);
            Expression<Func<ProgramFeeAdjustment, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ProgramFeeAdjustment, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ProgramFeeAdjustment).Assembly);
            Expression<Func<ProgramFeeAdjustment, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ProgramFeeAdjustment, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ProgramFeeAdjustment).Assembly);
            Expression<Func<ProgramFeeAdjustment, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ProgramFeeAdjustment, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ProgramFeeAdjustment).Assembly);
            Expression<Func<ProgramFeeAdjustment, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ProgramFeeAdjustment, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]ProgramFeeAdjustment entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Admission.SaleType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]ProgramFeeAdjustment entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Admission.SaleType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<ProgramFeeAdjustment> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Admission.SaleType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<ProgramFeeAdjustment> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Admission.SaleType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]ProgramFeeAdjustment entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Admission.SaleType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]ProgramFeeAdjustment entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Admission.SaleType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]ProgramFeeAdjustment entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Admission.SaleType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]ProgramFeeAdjustment entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Admission.SaleType"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ProgramFeeAdjustment).Assembly);
            Expression<Func<ProgramFeeAdjustment, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ProgramFeeAdjustment, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ProgramFeeAdjustment).Assembly);
            Expression<Func<ProgramFeeAdjustment, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ProgramFeeAdjustment, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}