
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

using Cms360.Server.Atributes;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Dapper;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    // [Loggings]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SecurityClaimUpdController : Controller
    {
        private readonly IRoleSecurityClaimUpdRepository repository;
        private readonly DbContextBase db;
        public SecurityClaimUpdController(IRoleSecurityClaimUpdRepository repository, DbContextBase db)
        {
            this.repository = repository;
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
            return Ok(this.db.SecurityClaimUpd.FromSql("Select * from  \"Role\".\"SecurityClaim\"  "));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertSecurityClaims([FromBody] Predicate predicate)
        {

            var list = (predicate.ProvidedString.Split("?")[0]);
            var neworupd = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);

            string json = String.Format("SELECT \"Role\".\"InsertSecurityClaims\"('{0}',{1})", list, neworupd);
            // Console.WriteLine(json);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] Predicate predicate)
        {



            string json = String.Format("delete from  \"Role\".\"SecurityClaim\" where \"SecurityClaimId\"='{0}'", predicate.ProvidedString);
            // Console.WriteLine(json);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);

        }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult FindBy ([FromBody] Predicate predicate) {
        //     var fromDate = Convert.ToDateTime (predicate.ProvidedString.Split ("?") [0]);
        //     var toDate = Convert.ToDateTime (predicate.ProvidedString.Split ("?") [1]);
        //     return Ok (db.SecurityClaimUpd.Where ((s=>s.CreatedOn==fromDate)));
        // }

        // [HttpGet]
        // [Route("[action]")]
        // public async Task<IActionResult> GetAllAsync()
        // {
        //     return Ok(await this.repository.AllAsync());
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SecurityClaimUpd).Assembly);
        //     Expression<Func<SecurityClaimUpd, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SecurityClaimUpd, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.Single(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SecurityClaimUpd).Assembly);
        //     Expression<Func<SecurityClaimUpd, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SecurityClaimUpd, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.SingleAsync(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SecurityClaimUpd).Assembly);
        //     Expression<Func<SecurityClaimUpd, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SecurityClaimUpd, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.FindBy(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SecurityClaimUpd).Assembly);
        //     Expression<Func<SecurityClaimUpd, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SecurityClaimUpd, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.FindByAsync(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult AddOne([FromBody]SecurityClaimUpd entity)
        // {
        //     return Ok(this.repository.Add(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> AddOneAsync([FromBody]SecurityClaimUpd entity)
        // {
        //     return Ok(await this.repository.AddAsync(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult AddMany([FromBody]IEnumerable<SecurityClaimUpd> entities)
        // {
        //     return Ok(this.repository.AddAll(entities));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SecurityClaimUpd> entities)
        // {
        //     return Ok(await this.repository.AddAllAsync(entities));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult Update([FromBody]SecurityClaimUpd entity)
        // {
        //     return Ok(this.repository.Update(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> UpdateAsync([FromBody]SecurityClaimUpd entity)
        // {
        //     return Ok(await this.repository.UpdateAsync(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult Delete([FromBody]SecurityClaimUpd entity)
        // {
        //     return Ok(this.repository.Delete(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteAsync([FromBody]SecurityClaimUpd entity)
        // {
        //     return Ok(await this.repository.DeleteAsync(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SecurityClaimUpd).Assembly);
        //     Expression<Func<SecurityClaimUpd, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SecurityClaimUpd, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.DeleteWhere(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SecurityClaimUpd).Assembly);
        //     Expression<Func<SecurityClaimUpd, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SecurityClaimUpd, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        // }
    }
}