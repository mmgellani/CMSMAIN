
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System.Linq.Expressions;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ExaminationCampusFailCriteriaMappingController : Controller
    {
        private readonly IExaminationCampusFailCriteriaMappingRepository repository;
        private readonly IUserLogService log;
        public ExaminationCampusFailCriteriaMappingController(IExaminationCampusFailCriteriaMappingRepository repository,IUserLogService log)
        {
            this.repository = repository;
            this.log = log;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }
   [AllowAnonymous]
   [IgnoreAntiforgeryToken]
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
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusFailCriteriaMapping).Assembly);
            Expression<Func<ExaminationCampusFailCriteriaMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusFailCriteriaMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusFailCriteriaMapping).Assembly);
            Expression<Func<ExaminationCampusFailCriteriaMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusFailCriteriaMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusFailCriteriaMapping).Assembly);
            Expression<Func<ExaminationCampusFailCriteriaMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusFailCriteriaMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusFailCriteriaMapping).Assembly);
            Expression<Func<ExaminationCampusFailCriteriaMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusFailCriteriaMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]ExaminationCampusFailCriteriaMapping entity)
        {
             this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Examination.CampusFailCriteriaMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]ExaminationCampusFailCriteriaMapping entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Examination.CampusFailCriteriaMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<ExaminationCampusFailCriteriaMapping> entities)
        {
           this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Examination.CampusFailCriteriaMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<ExaminationCampusFailCriteriaMapping> entities)
        {
             await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Examination.CampusFailCriteriaMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]ExaminationCampusFailCriteriaMapping entity)
        {
           this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Examination.CampusFailCriteriaMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]ExaminationCampusFailCriteriaMapping entity)
        {
           await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Examination.CampusFailCriteriaMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]ExaminationCampusFailCriteriaMapping entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Examination.CampusFailCriteriaMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]ExaminationCampusFailCriteriaMapping entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Examination.CampusFailCriteriaMapping"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusFailCriteriaMapping).Assembly);
            Expression<Func<ExaminationCampusFailCriteriaMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusFailCriteriaMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusFailCriteriaMapping).Assembly);
            Expression<Func<ExaminationCampusFailCriteriaMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusFailCriteriaMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}