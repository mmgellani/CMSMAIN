
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

using System.Data;
using Cms360.Data;
using Dapper;
using Microsoft.EntityFrameworkCore;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class CampusEmailMappingController : Controller
    {
        private readonly ICampusEmailMappingRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public CampusEmailMappingController(ICampusEmailMappingRepository repository, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
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
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEmailMappinglist([FromBody] Predicate model)
        {
            var campusId = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format("Select * from \"Registration\".\"CampusEmailLink\" Where \"StatusId\"!=2 AND \"CampusId\"= '{0}'", campusId);
            // Console.WriteLine(sql);
            return Ok(db.CampusEmailMapping.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CampusEmailMapping).Assembly);
            Expression<Func<CampusEmailMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CampusEmailMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CampusEmailMapping).Assembly);
            Expression<Func<CampusEmailMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CampusEmailMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllActiveAsync()
        {
            return Ok(await this.repository.FindByAsync(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CampusEmailMapping).Assembly);
            Expression<Func<CampusEmailMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CampusEmailMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CampusEmailMapping).Assembly);
            Expression<Func<CampusEmailMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CampusEmailMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]CampusEmailMapping entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Registration.CampusEmailLink"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ADDONE Controller.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]CampusEmailMapping entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<CampusEmailMapping> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<CampusEmailMapping> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]CampusEmailMapping entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]CampusEmailMapping entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]CampusEmailMapping entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]CampusEmailMapping entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Registration.CampusEmailLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CampusEmailMapping).Assembly);
            Expression<Func<CampusEmailMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CampusEmailMapping, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CampusEmailMapping).Assembly);
            Expression<Func<CampusEmailMapping, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CampusEmailMapping, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}