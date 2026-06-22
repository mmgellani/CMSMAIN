
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
using Cms360.Contract;
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]

    public class SetupSubCityController : Controller
    {
        private readonly ISetupSubCityRepository repository;
        private readonly ISetupOwnedCitySubCityRepository repo1;
        private readonly ISetupCitySubCityLinkRepository repo;

        private readonly IUserLogService log;
        private readonly DbContextBase db;
        private IDomainContext domainContext;
        protected IDomainContextResolver Resolver;
        public SetupSubCityController(IUserLogService log, ISetupSubCityRepository repository, ISetupCitySubCityLinkRepository repo, DbContextBase db, IDomainContextResolver Resolver, ISetupOwnedCitySubCityRepository repo1)
        {
            this.repository = repository;
            this.log = log;
            this.repo = repo;
            this.db = db;
            this.Resolver = Resolver;
            this.repo1 = repo1;
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
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSubCity).Assembly);
            Expression<Func<SetupSubCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSubCity, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSubCity).Assembly);
            Expression<Func<SetupSubCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSubCity, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSubCity).Assembly);
            Expression<Func<SetupSubCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSubCity, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByOwnedSubCitites([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VW_OwnedSubCities).Assembly);
            Expression<Func<VW_OwnedSubCities, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VW_OwnedSubCities, bool>>(predicate.ProvidedString, options));

            return Ok(this.repo1.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByEx([FromBody] Predicate predicate)
        {
            var cityid = new Guid(predicate.ProvidedString);
            var UserId = DomainContext.User.UserId;
            //string sql = String.Format(@"select * from  ""Setup"".""GetSubCitites""({0},'{1}')", DomainContext.User.UserId, cityid);
            //var result = this.db.CitySubCity2.FromSql(sql).ToList<CitySubCity2>();
            //return Ok(result);
            List<CitySubCity> res = new List<CitySubCity>();
            res.AddRange(this.db.CitySubCity.FromSql(String.Format(@"select * from  ""Setup"".""GetSubCitites""({0},'{1}')", DomainContext.User.UserId, cityid)).ToList<CitySubCity>());
            if (res.Count > 0)
                return Ok(res);
            else
                return Ok(this.db.CitySubCity.Where(s => s.CityId == cityid));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindBySubcitiesEx([FromBody] Predicate predicate)
        {
            var cityid = new Guid(predicate.ProvidedString);
            List<CitySubCity> res = new List<CitySubCity>();
            res.AddRange(this.db.CitySubCity.FromSql(String.Format(OwnedSubCityVMQuery, DomainContext.User.UserId, cityid)).ToList<CitySubCity>());
            if (res.Count > 0)
                return Ok(res);
            else
                return Ok(this.db.CitySubCity.Where(s => s.CityId == cityid));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByCitySubCity([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCitySubCityLink).Assembly);
            Expression<Func<SetupCitySubCityLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCitySubCityLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repo.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByCitySubCityEx([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCitySubCityLink).Assembly);
            Expression<Func<SetupCitySubCityLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCitySubCityLink, bool>>(predicate.ProvidedString, options));

            List<SetupCitySubCityLink> result = new List<SetupCitySubCityLink>();
            result.AddRange(this.db.SetupCitySubCityLink.FromSql(String.Format(SubCityQuer, DomainContext.User.UserId)).ToList<SetupCitySubCityLink>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(this.repo.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSubCity).Assembly);
            Expression<Func<SetupSubCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSubCity, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]SetupSubCity entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]SetupSubCity entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<SetupSubCity> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SetupSubCity> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]SetupSubCity entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]SetupSubCity entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]SetupSubCity entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]SetupSubCity entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "SetupSubCity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSubCity).Assembly);
            Expression<Func<SetupSubCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSubCity, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupSubCity).Assembly);
            Expression<Func<SetupSubCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupSubCity, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
        private const string SubCityVMQuery = @"SELECT
""VWCampuCity"".""CityId"",
ct.""FullName"" AS ""CityName"",
""VWCampuCity"".""SubCityId"",
""VWCampuCity"".""CityName"" AS ""SubCityName""
FROM
""Setup"".""VWCampuCity""
JOIN ""Setup"".""City"" ct on ""VWCampuCity"".""CityId"" = ct.""CityId""
WHERE


""Setup"".""VWCampuCity"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	)) AND ""VWCampuCity"".""CityId"" = '{1}'  GROUP BY ""VWCampuCity"".""CityId"",
""VWCampuCity"".""CityName"",
""VWCampuCity"".""SubCityId"",
ct.""FullName""";

private const string OwnedSubCityVMQuery = @"SELECT
""VW_OwnedCities"".""CityId"",
ct.""FullName"" AS ""CityName"",
""VW_OwnedCities"".""SubCityId"",
""VW_OwnedCities"".""CityName"" AS ""SubCityName""
FROM
""Setup"".""VW_OwnedCities""
JOIN ""Setup"".""City"" ct on ""VW_OwnedCities"".""CityId"" = ct.""CityId""
WHERE


""Setup"".""VW_OwnedCities"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	)) AND ""VW_OwnedCities"".""CityId"" = '{1}'  GROUP BY ""VW_OwnedCities"".""CityId"",
""VW_OwnedCities"".""CityName"",
""VW_OwnedCities"".""SubCityId"",
ct.""FullName""";



private const string SubCityQuer = @"SELECT sub.""SubCityId"",
    sub.""Name"" AS ""SubCityName"",
    sub.""StatusId"",
    sub.""LoggerId"",
    ci.""CityId"",
    sub.""Code"",
    ci.""FullName"" AS ""CityName""
   FROM ""Setup"".""City"" ci,
    ""Setup"".""SubCity"" sub,
		""Setup"".""VWCampuCity"" camp
  WHERE camp.""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	)) and ((ci.""CityId"" = sub.""CityId"") AND
     (camp.""CityId"" = ci.""CityId"") AND (ci.""StatusId"" = 1) AND (sub.""StatusId"" = (1)::numeric))GROUP BY
	sub.""SubCityId"",
    sub.""Name"",
    sub.""StatusId"",
    sub.""LoggerId"",
    ci.""CityId"",
    sub.""Code"",
    ci.""FullName""";
    }
}