
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
using Newtonsoft.Json;
using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;

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
    public class ExaminationCampusGradingMappingController : Controller
    {
        private readonly IExaminationCampusGradingMappingRepository repository;
        private readonly IUserLogService log;

        private readonly DbContextBase db;
        public ExaminationCampusGradingMappingController(IExaminationCampusGradingMappingRepository repository,IUserLogService log,DbContextBase db)
        {
            this.repository = repository;
            this.log = log;
            this.db=db;
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
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] Predicate Predicate)
        {
            var campusProgramId=new Guid (Predicate.ProvidedString);
            return Ok(this.db.ExaminationCampusGradingMappingVM.FromSql(String.Format("select * from \"Examination\".\"VWCampusGraddingMapping\"  Where \"CampusProgramId\"='{0}' ",campusProgramId)));
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
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusGradingMapping).Assembly);
            Expression<Func<ExaminationCampusGradingMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusGradingMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusGradingMapping).Assembly);
            Expression<Func<ExaminationCampusGradingMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusGradingMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusGradingMapping).Assembly);
            Expression<Func<ExaminationCampusGradingMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusGradingMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusGradingMapping).Assembly);
            Expression<Func<ExaminationCampusGradingMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusGradingMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]ExaminationCampusGradingMapping entity)
        {
             this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Examination.CampusGradingMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]ExaminationCampusGradingMapping entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Examination.CampusGradingMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<ExaminationCampusGradingMapping> entities)
        {
           this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Examination.CampusGradingMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<ExaminationCampusGradingMapping> entities)
        {
             await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Examination.CampusGradingMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]ExaminationCampusGradingMapping entity)
        {
           this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Examination.CampusGradingMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]ExaminationCampusGradingMapping entity)
        {
           await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Examination.CampusGradingMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]ExaminationCampusGradingMapping entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Examination.CampusGradingMapping"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]ExaminationCampusGradingMapping entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Examination.CampusGradingMapping"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusGradingMapping).Assembly);
            Expression<Func<ExaminationCampusGradingMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusGradingMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationCampusGradingMapping).Assembly);
            Expression<Func<ExaminationCampusGradingMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationCampusGradingMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}