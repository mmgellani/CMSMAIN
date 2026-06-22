
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class FeeFeeStructureDetailController : Controller
    {
        private readonly IFeeFeeStructureDetailRepository repository;
         private readonly IFeeFeeStructureDetailRepositoryVM repo;

          private readonly DbContextBase db;
        private readonly IUserLogService log;


        public FeeFeeStructureDetailController(IFeeFeeStructureDetailRepository repository,IFeeFeeStructureDetailRepositoryVM repo, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
             this.repo = repo;
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
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok( await this.repo.FindByAsync(e=>e.StatusId!=2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructureDetail).Assembly);
            Expression<Func<FeeFeeStructureDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructureDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructureDetail).Assembly);
            Expression<Func<FeeFeeStructureDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructureDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructureDetail).Assembly);
            Expression<Func<FeeFeeStructureDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructureDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructureDetail).Assembly);
            Expression<Func<FeeFeeStructureDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructureDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]FeeFeeStructureDetail entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.FeeStructureDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]FeeFeeStructureDetail entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.FeeStructureDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<FeeFeeStructureDetail> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.FeeStructureDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<FeeFeeStructureDetail> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Fee.FeeStructureDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]FeeFeeStructureDetail entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.FeeStructureDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]FeeFeeStructureDetail entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.FeeStructureDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]FeeFeeStructureDetail entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.FeeStructureDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]FeeFeeStructureDetail entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.FeeStructureDetail"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructureDetail).Assembly);
            Expression<Func<FeeFeeStructureDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructureDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructureDetail).Assembly);
            Expression<Func<FeeFeeStructureDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructureDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllVM()
        {
            // var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructureDetail).Assembly);
            // Expression<Func<FeeFeeStructureDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructureDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.db.FeeFeeStructureDetailVM);
        }
    }
}