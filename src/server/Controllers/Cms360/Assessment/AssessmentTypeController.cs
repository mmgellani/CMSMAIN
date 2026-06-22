
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
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AssessmentTypeController : Controller
    {
    private readonly IAssessmentTypeRepository repository;
        private readonly IAssessmentTypeRepositoryEx repositoryEx;

    private readonly IAssessmentTypeRepositoryVM repositoryVM;

        private readonly IUserLogService log;
        private DbContextBase db;
        public AssessmentTypeController(IAssessmentTypeRepository repository,IAssessmentTypeRepositoryVM repositoryVM,  IAssessmentTypeRepositoryEx repositoryEx,IUserLogService log,DbContextBase db)
        {
            this.repository = repository;
            this.repositoryVM = repositoryVM;
                        this.repositoryEx = repositoryEx;


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
            return Ok(this.repositoryVM.All());
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
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentType).Assembly);
            Expression<Func<AssessmentType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentType, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentType).Assembly);
            Expression<Func<AssessmentType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentType, bool>>(predicate.ProvidedString, options));

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


        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(AssessmentType).Assembly);
        //     Expression<Func<AssessmentType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentType, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.FindBy(discountFilterExpression));
        // }
          [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentCategory).Assembly);
            Expression<Func<AssessmentCategory, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentCategory, bool>>(predicate.ProvidedString, options));

            return Ok(this.repositoryEx.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentType).Assembly);
            Expression<Func<AssessmentType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentType, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]AssessmentType entity)
        {
           this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Assessment.AssessmentType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]AssessmentType entity)
        {
             await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Assessment.AssessmentType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<AssessmentType> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Assessment.AssessmentType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<AssessmentType> entities)
        {
             await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Assessment.AssessmentType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]AssessmentType entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Assessment.AssessmentType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]AssessmentType entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Assessment.AssessmentType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]AssessmentType entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Assessment.AssessmentType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]AssessmentType entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Assessment.AssessmentType"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentType).Assembly);
            Expression<Func<AssessmentType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentType, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentType).Assembly);
            Expression<Func<AssessmentType, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentType, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}