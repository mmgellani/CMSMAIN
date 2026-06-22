
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class TransportationRouteInfoController : Controller
    {
        private readonly ITransportationRouteInfoRepository repository;
        private readonly IUserLogService log;
        private DbContextBase db;
        public TransportationRouteInfoController(ITransportationRouteInfoRepository repository, IUserLogService log , DbContextBase db)
        {
            this.repository = repository;
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
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteInfo).Assembly);
            Expression<Func<TransportationRouteInfo, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteInfo, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteInfo).Assembly);
            Expression<Func<TransportationRouteInfo, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteInfo, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetRoutesByStudentId([FromBody]Predicate predicate)
        {
            //TransportationRouteInfoByStudent result = new TransportationRouteInfoByStudent();
            //var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteInfo).Assembly);
            //Expression<Func<TransportationRouteInfo, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteInfo, bool>>(predicate.ProvidedString, options));
            string sql = string.Format(@"SELECT * FROM ""Transportation"".""GetRoutesByStudentId"" ('{0}')", predicate.ProvidedString);

            var result = this.db.TransportationRouteInfoByStudent.FromSql(sql).ToList();


            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteInfo).Assembly);
            Expression<Func<TransportationRouteInfo, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteInfo, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteInfo).Assembly);
            Expression<Func<TransportationRouteInfo, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteInfo, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]TransportationRouteInfo entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Transportation.RouteInfo"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]TransportationRouteInfo entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Transportation.RouteInfo"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<TransportationRouteInfo> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Transportation.RouteInfo"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<TransportationRouteInfo> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Transportation.RouteInfo"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]TransportationRouteInfo entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Transportation.RouteInfo"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]TransportationRouteInfo entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Transportation.RouteInfo"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]TransportationRouteInfo entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Transportation.RouteInfo"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]TransportationRouteInfo entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Transportation.RouteInfo"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteInfo).Assembly);
            Expression<Func<TransportationRouteInfo, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteInfo, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteInfo).Assembly);
            Expression<Func<TransportationRouteInfo, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteInfo, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}