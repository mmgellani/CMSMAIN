
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

using Newtonsoft.Json;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Dapper;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class StruckoffReinstateController : Controller
    {
        private readonly IStruckoffReinstateRepository repository;
        private readonly IUserLogService log;
        private DbContextBase db;
        public StruckoffReinstateController(DbContextBase db, IStruckoffReinstateRepository repository, IUserLogService log)
        {
            this.repository = repository;
            this.log = log;
            this.db = db;
        }

        private bool  validateinputvalue(string input){
        if(input==null || input=="" || input==" " || input=="null" ||string.IsNullOrEmpty(input.Trim())){
            return true;
        } 
        return false;
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
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StruckoffReinstate).Assembly);
            Expression<Func<StruckoffReinstate, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StruckoffReinstate, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        } 
        [HttpPost]
        [Route("[action]")]
        public IActionResult StruckofListData([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var admissionFormId =new Guid(model.ProvidedString);
            return Ok(this.db.StruckoffReinstate.Where( e=>e.AdmissionFormId == admissionFormId));
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StruckoffReinstate).Assembly);
            Expression<Func<StruckoffReinstate, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StruckoffReinstate, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StruckoffReinstate).Assembly);
            Expression<Func<StruckoffReinstate, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StruckoffReinstate, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StruckoffReinstate).Assembly);
            Expression<Func<StruckoffReinstate, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StruckoffReinstate, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[Action]")]

        public IActionResult GetStudentStruckOff([FromBody] Predicate entity)
        {

            string sql = String.Format(@"select * from ""Admission"".""StruckoffReinstate"" Where ""AdmissionFormId""='{0}'", entity.ProvidedString);

            return Ok(this.db.StruckoffReinstate.FromSql(sql));


        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] StruckoffReinstate entity)
        {
            this.repository.Add(entity);
            string json = String.Format("SELECT \"Message\".\"StruckoffQueMessage\"('{0}')", entity.AdmissionFormId);
            // Console.WriteLine(json);
            this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Admission.StruckoffReinstate");
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();

            }

            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckStruckoff([FromBody] Predicate entity)
        {
            var data = this.db.IntModel.FromSql(String.Format(@"select * from ""Admission"".""CheckStruckOFF""('{0}') as val", entity.ProvidedString)).ToList().FirstOrDefault();
            return Ok(data.val);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] StruckoffReinstate entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Admission.StruckoffReinstate"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<StruckoffReinstate> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Admission.StruckoffReinstate"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<StruckoffReinstate> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Admission.StruckoffReinstate"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] StruckoffReinstate entity)
        {
            this.repository.Update(entity);

            string json = String.Format("SELECT \"Message\".\"ReinstateMsg\"('{0}')", entity.AdmissionFormId);
            this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Admission.StruckoffReinstate");
             IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();

            }

            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] StruckoffReinstate entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Admission.StruckoffReinstate"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] StruckoffReinstate entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Admission.StruckoffReinstate"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] StruckoffReinstate entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Admission.StruckoffReinstate"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StruckoffReinstate).Assembly);
            Expression<Func<StruckoffReinstate, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StruckoffReinstate, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StruckoffReinstate).Assembly);
            Expression<Func<StruckoffReinstate, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StruckoffReinstate, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}