
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server;
using Cms360.Server.Model;
using Cms360.Service;
using Dapper;
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
    public class AdmissionEligibilityCriteriaController : Controller
    {
        private readonly IAdmissionEligibilityCriteriaRepository repository;
        private readonly IAdmissionEligibilityCriteriaVMRepository VMrepository;
        private readonly IUserLogService log; 
private readonly DbContextBase db;
        public AdmissionEligibilityCriteriaController(IAdmissionEligibilityCriteriaRepository repository, DbContextBase db,IAdmissionEligibilityCriteriaVMRepository VMrepository, IUserLogService log)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
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
            return Ok(this.db.AdmissionEligibilityCriteriaVM.Where(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetEligibilityCriteriaBySession([FromBody]Predicate predicate)
        {
            var SessionID = new Guid(predicate.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(predicate.ProvidedString.Split("?")[1]);
           

            return Ok(this.db.AdmissionEligibilityCriteriaVM.Where(e => e.StatusId != 2 && e.SessionId==SessionID && e.CampusId==CampusID));

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
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionEligibilityCriteria).Assembly);
            Expression<Func<AdmissionEligibilityCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionEligibilityCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetEligibilityCriteria([FromBody]Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var GenderId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var AdmissionType = new Guid(predicate.ProvidedString.Split("?")[2]);

            return Ok(this.db.AdmissionEligibilityCriteriaVM.Where(e => e.StatusId == 1 && e.CampusProgramId == campusProgramId && e.GenderId == GenderId && e.AdmissionTypeId == AdmissionType));

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionEligibilityCriteria).Assembly);
            Expression<Func<AdmissionEligibilityCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionEligibilityCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionEligibilityCriteria).Assembly);
            Expression<Func<AdmissionEligibilityCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionEligibilityCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionEligibilityCriteria).Assembly);
            Expression<Func<AdmissionEligibilityCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionEligibilityCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]AdmissionEligibilityCriteria entity)
        {

            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]AdmissionEligibilityCriteria entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<AdmissionEligibilityCriteria> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<AdmissionEligibilityCriteria> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]AdmissionEligibilityCriteria entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]AdmissionEligibilityCriteria entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]AdmissionEligibilityCriteria entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]AdmissionEligibilityCriteria entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Admission.EligibilityCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionEligibilityCriteria).Assembly);
            Expression<Func<AdmissionEligibilityCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionEligibilityCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionEligibilityCriteria).Assembly);
            Expression<Func<AdmissionEligibilityCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionEligibilityCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}