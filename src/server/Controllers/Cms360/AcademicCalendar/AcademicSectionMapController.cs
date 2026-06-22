
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
using Newtonsoft.Json;
using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Dapper;
using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using Cms360.Contract;
using System.Data;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AcademicSectionMapController : Controller
    {
        private readonly IAcademicSectionMapRepository repository;

        private readonly DbContextBase db;

        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly IUserLogService log;

        public AcademicSectionMapController(IAcademicSectionMapRepository repository, DbContextBase db, IDomainContextResolver Resolver, IUserLogService log)
        {
            this.repository = repository;
            this.log = log;
            this.Resolver = Resolver;
            this.db = db;
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
            return Ok(this.repository.FindBy(e => e.StatusId != 2));
        }


        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetAllAsync([FromBody]Predicate predicate)
        // {
        //     var SessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //     var CampusId = new Guid(predicate.ProvidedString.Split("?")[1]);
        //     var ClassId = new Guid(predicate.ProvidedString.Split("?")[2]);
        //     var ProgramDetailId = new Guid(predicate.ProvidedString.Split("?")[3]);
        //     return Ok( this.db.AcademicSectionMapVMEx.Where(e => e.StatusId != 2 && e.SessionId == SessionId && e.CampusId == CampusId && e.ClassId == ClassId && e.ProgramDetailId == ProgramDetailId));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicSectionMapList([FromBody]Predicate predicate)
        {
            var SessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var subCityId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var boardId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var CampusProgramId = new Guid(predicate.ProvidedString.Split("?")[4]);

            string query = string.Format(@"Select * from ""AcademicCalendar"".""AcademicSectionMapListVW""  where  ""SessionId""='{0}' and  ""SubCityId""='{1}' and ""ClassId""='{2}' and ""BoardId""='{3}' and ""CampusProgramId""='{4}'",SessionId, subCityId, classId, boardId,CampusProgramId);
            return Ok(this.db.AcademicSectionMapVW.FromSql(query));
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicSectionMap).Assembly);
            Expression<Func<AcademicSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicSectionMap).Assembly);
            Expression<Func<AcademicSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicSectionMap).Assembly);
            Expression<Func<AcademicSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]AcademicSectionMap entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]AcademicSectionMap entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<AcademicSectionMap> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddAcademicSectionMapBulkInsertion([FromBody] Predicate predicate)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            var query = String.Format(@"select * from ""AcademicCalendar"".""AcademicSectionMapBulkInsertion""('{0}') as ProvidedString", predicate.ProvidedString);
             Console.WriteLine(query);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
           var result= connection.Query<Predicate>(query).FirstOrDefault().ProvidedString;;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(result);
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<AcademicSectionMap> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]AcademicSectionMap entity)
        {
            this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]AcademicSectionMap entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]AcademicSectionMap entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]AcademicSectionMap entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "AcademicCalendar.AcademicSectionLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicSectionMap).Assembly);
            Expression<Func<AcademicSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AcademicSectionMap).Assembly);
            Expression<Func<AcademicSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AcademicSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}