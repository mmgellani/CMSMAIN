
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
using Cms360.Contract;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupSessionController : Controller
    {
        private readonly ISetupSessionRepository repository;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly IUserLogService log;
        private DbContextBase dbcontext;

        public SetupSessionController(IUserLogService log, ISetupSessionRepository repository, IDomainContextResolver Resolver, DbContextBase dbcontext)
        {
            this.repository = repository;
            this.Resolver = Resolver;
            this.log = log;
            this.dbcontext = dbcontext;
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
            List<SetupSession> result = new List<SetupSession>();

            result.AddRange(this.dbcontext.SetupSession.FromSql(String.Format(SesionQuery, DomainContext.User.UserId, "Session")).ToList<SetupSession>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSession).Assembly);
            Expression<Func<SetupSession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSession, bool>>(predicate.ProvidedString, options));

            List<SetupSession> result = new List<SetupSession>();

            result.AddRange(this.dbcontext.SetupSession.FromSql(String.Format(SesionQuery, DomainContext.User.UserId)).ToList<SetupSession>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSession).Assembly);
            Expression<Func<SetupSession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSession, bool>>(predicate.ProvidedString, options));

            List<SetupSession> result = new List<SetupSession>();

            result.AddRange(this.dbcontext.SetupSession.FromSql(String.Format(SesionQuery, DomainContext.User.UserId)).ToList<SetupSession>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSession).Assembly);
            Expression<Func<SetupSession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSession, bool>>(predicate.ProvidedString, options));

            List<SetupSession> result = new List<SetupSession>();
            result.AddRange(this.dbcontext.SetupSession.FromSql(String.Format(SesionQuery, DomainContext.User.UserId)).ToList<SetupSession>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByEx([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSession).Assembly);
            Expression<Func<SetupSession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSession, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSession).Assembly);
            Expression<Func<SetupSession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSession, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SetupSession entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] SetupSession entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<SetupSession> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<SetupSession> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] SetupSession entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] SetupSession entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] SetupSession entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] SetupSession entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Session"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSession).Assembly);
            Expression<Func<SetupSession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSession, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSession).Assembly);
            Expression<Func<SetupSession, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSession, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult QuizSessionGet()
        {
            Console.WriteLine("Data", DomainContext.User.UserId);
            string sql = String.Format(@"SELECT * FROM ""Quiz"".""QuizSessionGet""('{0}')", DomainContext.User.UserId);
            Console.WriteLine("Data", DomainContext.User.UserId);
            return Ok(this.dbcontext.SetupSession.FromSql(sql));

        }




        private const string SesionQuery = @"SELECT sc.""SessionId"", sc.""Code"", sc.""FullName"", sc.""Description"", sc.""WorkingDays"", sc.""StatusId"", sc.""LoggerId""
FROM ""Setup"".""Session"" AS sc
WHERE   sc.""StatusId""=1 and sc.""SessionId"" = ANY (SELECT ""Id"" FROM ""Role"".""VWUserRights"" WHERE ""UserId"" = {0})";
    }
}