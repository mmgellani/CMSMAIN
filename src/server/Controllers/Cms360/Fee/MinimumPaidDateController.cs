/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server;
using Cms360.Server.Model;
using Cms360.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Cms360.UI.Controllers.Account {
    [Route ("api/[controller]")]
    [ServiceFilter (typeof (Server.Filters.ApiResultFilter))]
    [ServiceFilter (typeof (Server.Filters.ApiExceptionFilter))]
    [ServiceFilter (typeof (Server.Filters.IdentityMappingFilter))]
    public class MinimumPaidDateController : Controller {
        private readonly IMinimumPaidDateRepository repository;
        private readonly IUserLogService log;
        private DbContextBase db;
        public MinimumPaidDateController (IMinimumPaidDateRepository repository, IUserLogService log, DbContextBase db) {
            this.repository = repository;
            this.log = log;
            this.db = db;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T> (Func<T, bool> f) {
            return x => f (x);
        }
         
       
        [HttpGet]
        [Route ("[action]")]
        public IActionResult GetAll() {
            return Ok (this.repository.All ());
        }

        [HttpGet]
        [Route ("[action]")]
        public async Task<IActionResult> GetAllAsync () {
            return Ok (await this.repository.AllAsync ());
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetSingle ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (MinimumPaidDate).Assembly);
            Expression<Func<MinimumPaidDate, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<MinimumPaidDate, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.Single (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetSingleAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (MinimumPaidDate).Assembly);
            Expression<Func<MinimumPaidDate, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<MinimumPaidDate, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.SingleAsync (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetFindBy ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (MinimumPaidDate).Assembly);
            Expression<Func<MinimumPaidDate, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<MinimumPaidDate, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.FindBy (discountFilterExpression));
        }

        [HttpGet]
        [Route ("[action]")]
        public IActionResult GetAllVM () {
            
             
            return Ok(this.db.MinimumPaidDateVM.FromSql(String.Format("select * from \"Fee\".\"VWMinimumPaidDate\" ")));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetFindByAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (MinimumPaidDate).Assembly);
            Expression<Func<MinimumPaidDate, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<MinimumPaidDate, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.FindByAsync (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult AddOne ([FromBody] MinimumPaidDate entity) {
            this.repository.Add (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Insert", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> AddOneAsync ([FromBody] MinimumPaidDate entity) {
            await this.repository.AddAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Insert Async", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult AddMany ([FromBody] IEnumerable<MinimumPaidDate> entities) {
            this.repository.AddAll (entities);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entities), "Insert Multi", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> AddManyAsync ([FromBody] IEnumerable<MinimumPaidDate> entities) {
            await this.repository.AddAllAsync (entities);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entities), "Insert Multi Async", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult Update ([FromBody] MinimumPaidDate entity) {
            this.repository.Update (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Update", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> UpdateAsync ([FromBody] MinimumPaidDate entity) {
            await this.repository.UpdateAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Update Async", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult Delete ([FromBody] MinimumPaidDate entity) {
            this.repository.Delete (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Delete", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteAsync ([FromBody] MinimumPaidDate entity) {
            await this.repository.DeleteAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Delete Async", "Fee.MinimumPaidDate"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteWhere ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (MinimumPaidDate).Assembly);
            Expression<Func<MinimumPaidDate, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<MinimumPaidDate, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.DeleteWhere (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteWhereAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (MinimumPaidDate).Assembly);
            Expression<Func<MinimumPaidDate, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<MinimumPaidDate, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.DeleteWhereAsync (discountFilterExpression));
        }
    }
}