
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
using Cms360.Contract;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupShiftController : Controller
    {
        private readonly ISetupShiftRepository repository;

        private readonly DbContextBase db;
        private readonly IUserLogService log;

        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        public SetupShiftController( IUserLogService log,ISetupShiftRepository repository, DbContextBase db,IDomainContextResolver Resolver)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;
            this.Resolver=Resolver;
        }

         protected IDomainContext DomainContext
        {
            get
            {
                if (this.domainContext == null)
                    this.domainContext = this.Resolver.Resolve();

                return this.domainContext;
            }
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
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupShift).Assembly);
            Expression<Func<SetupShift, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupShift, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupShift).Assembly);
            Expression<Func<SetupShift, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupShift, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupShift).Assembly);
            Expression<Func<SetupShift, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupShift, bool>>(predicate.ProvidedString, options));
            List<SetupShift> result = new List<SetupShift>();

            result.AddRange(this.db.SetupShift.FromSql(String.Format(ShiftQuery, DomainContext.User.UserId)).ToList<SetupShift>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupShift).Assembly);
            Expression<Func<SetupShift, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupShift, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]SetupShift entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]SetupShift entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<SetupShift> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SetupShift> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]SetupShift entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]SetupShift entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]SetupShift entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]SetupShift entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Shift"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupShift).Assembly);
            Expression<Func<SetupShift, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupShift, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupShift).Assembly);
            Expression<Func<SetupShift, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupShift, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));

        }
        private const string ShiftQuery = @"SELECT
""Setup"".""Shift"".""ShiftId"",
""Setup"".""Shift"".""FullName"",
""Setup"".""Shift"".""Code"",
""Setup"".""Shift"".""Description"",
""Setup"".""Shift"".""StatusId"",
""Setup"".""Shift"".""LoggerId""
FROM
""Setup"".""Shift""
WHERE
""Setup"".""Shift"".""ShiftId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	))"
       ;




    }
}