
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

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Cms360.Contract;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;


namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupProgramController : Controller
    {
        private readonly ISetupProgramRepository repository;

        private readonly ISetupCampusBaseProgramRepository campusProgramrepository;

        private IDomainContext domaincontext;

        private IDomainContextResolver Resolver;

        private DbContextBase db;
        private readonly IUserLogService log;

        public SetupProgramController(ISetupProgramRepository repository, IDomainContextResolver Resolver, DbContextBase db, IUserLogService log, ISetupCampusBaseProgramRepository campusProgramrepository)
        {
            this.repository = repository;
            this.campusProgramrepository = campusProgramrepository;
            this.Resolver = Resolver;
            this.db = db;
            this.log = log;

        }

        protected IDomainContext Domaincontext
        {

            get
            {
                if (this.domaincontext == null)
                    this.domaincontext = this.Resolver.Resolve();
                return this.domaincontext;

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
            var options = ScriptOptions.Default.AddReferences(typeof(SetupProgram).Assembly);
            Expression<Func<SetupProgram, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupProgram, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupProgram).Assembly);
            Expression<Func<SetupProgram, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupProgram, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupProgram).Assembly);
            Expression<Func<SetupProgram, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupProgram, bool>>(predicate.ProvidedString, options));
            List<SetupProgram> res = new List<SetupProgram>();
            // res.AddRange(this.db.SetupProgram.FromSql(String.Format(programQuery,Domaincontext.User.UserId,"Program")).ToList<SetupProgram>());
            //    if (res.Count > 0)
            //     return Ok(res);
            // else
            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        // [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ProgramByCampus([FromBody]Predicate predicate)
        {
            //  var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
             
            //     string json = String.Format("SELECT \"Setup\".\"VWCampusBaseProgram\"('{0}')", campusId);
            //     return Ok(db.VWCampusBaseProgram.FromSql(json));
            var options = ScriptOptions.Default.AddReferences(typeof(VWCampusBaseProgram).Assembly);
            Expression<Func<VWCampusBaseProgram, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWCampusBaseProgram, bool>>(predicate.ProvidedString, options));
            // List<VWCampusBaseProgram> res = new List<VWCampusBaseProgram>();
            // res.AddRange(this.db.SetupProgram.FromSql(String.Format(programQuery,Domaincontext.User.UserId,"Program")).ToList<SetupProgram>());
            //    if (res.Count > 0)
            //     return Ok(res);
            // else
            return Ok(this.campusProgramrepository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupProgram).Assembly);
            Expression<Func<SetupProgram, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupProgram, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]SetupProgram entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]SetupProgram entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<SetupProgram> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SetupProgram> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]SetupProgram entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]SetupProgram entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]SetupProgram entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]SetupProgram entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Program"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupProgram).Assembly);
            Expression<Func<SetupProgram, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupProgram, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupProgram).Assembly);
            Expression<Func<SetupProgram, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupProgram, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        //         private const string programQuery = @"SELECT
        // ""Setup"".""Program"".""ProgramId"",
        // ""Setup"".""Program"".""FullName"",
        // ""Setup"".""Program"".""Description"",
        // ""Setup"".""Program"".""Code"",
        // ""Setup"".""Program"".""StatusId"",
        // ""Setup"".""Program"".""LoggerId""
        // FROM
        // ""Setup"".""Program""
        // WHERE
        // ""Setup"".""Program"".""ProgramId"" IN ((
        // SELECT CAST (( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID 
        // 		) AS ""Id"" 
        // 	FROM
        // 		""Role"".""RolePrevilages"" 
        // 	WHERE
        // 		""UserId"" = {0}
        // 	))
        // ";
    }
}