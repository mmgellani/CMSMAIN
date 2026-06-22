
using System.Diagnostics;
using System.Globalization;
using System.Runtime.CompilerServices;
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cms360.Contract;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server;
using Cms360.Server.Model;
using Cms360.Service;
using Microsoft.EntityFrameworkCore;

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
using Newtonsoft.Json;


namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class LevelProgramClassMapController : Controller
    {
        private readonly ILevelProgramClassMapRepository repository;
        private readonly IVWLevelProgramClassMapRepository repo;
        private readonly IUserLogService log;
        private DbContextBase db;
        public LevelProgramClassMapController(ILevelProgramClassMapRepository repository,IVWLevelProgramClassMapRepository repo, IUserLogService log,DbContextBase db)
        {
            this.repository = repository;
            this.repo = repo;
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
            return Ok(this.repository.All());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVM()
        {
            return Ok(this.repo.All());
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
            var options = ScriptOptions.Default.AddReferences(typeof(LevelProgramClassMap).Assembly);
            Expression<Func<LevelProgramClassMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<LevelProgramClassMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(LevelProgramClassMap).Assembly);
            Expression<Func<LevelProgramClassMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<LevelProgramClassMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }
          [HttpPost]
        [Route ("[action]")]
        public IActionResult UpdateExamData ([FromBody] Predicate predicate) {
            var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
                var list = predicate.ProvidedString.Split("?")[0];
                var smsids = predicate.ProvidedString.Split("?")[1];
                var admissionformid = new Guid(predicate.ProvidedString.Split("?")[2]);

                 var Data = this.log.GetLog();
               

                string json = String.Format ("SELECT \"Examination\".\"UpdateExamApproveData\"('{0}','{1}') as ProvidedString", list,Data);
                string jsonsms = String.Format(@"select * from ""Examination"".""SendExamSmsEdited""({0},'{1}')", smsids,admissionformid);

                 Console.WriteLine (jsonsms);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;
                            connection.Execute(jsonsms);

                

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }

        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(LevelProgramClassMap).Assembly);
            Expression<Func<LevelProgramClassMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<LevelProgramClassMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByVM([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWLevelProgramClassMap).Assembly);
            Expression<Func<VWLevelProgramClassMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWLevelProgramClassMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repo.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(LevelProgramClassMap).Assembly);
            Expression<Func<LevelProgramClassMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<LevelProgramClassMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]LevelProgramClassMap entity)
        {
           this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Assessment.LevelProgramClassMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]LevelProgramClassMap entity)
        {
             await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Assessment.LevelProgramClassMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<LevelProgramClassMap> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Assessment.LevelProgramClassMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<LevelProgramClassMap> entities)
        {
             await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Assessment.LevelProgramClassMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]LevelProgramClassMap entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Assessment.LevelProgramClassMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]LevelProgramClassMap entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Assessment.LevelProgramClassMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]LevelProgramClassMap entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Assessment.LevelProgramClassMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]LevelProgramClassMap entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Assessment.LevelProgramClassMap"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(LevelProgramClassMap).Assembly);
            Expression<Func<LevelProgramClassMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<LevelProgramClassMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(LevelProgramClassMap).Assembly);
            Expression<Func<LevelProgramClassMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<LevelProgramClassMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}