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
    public class SetupCityController : Controller
    {
        private readonly ISetupCityRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;


        public SetupCityController(ISetupCityRepository repository, DbContextBase db, IUserLogService log, IDomainContextResolver Resolver)
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
            try
            {
                return Ok(this.repository.All());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.GetAll, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject ();
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllEx()
        {
            try
            {
                // var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
                //Expression<Func<SetupZone, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupZone, bool>>(predicate.ProvidedString, options));
                List<SetupCity> result = new List<SetupCity>();
                var z = String.Format(CityQuery, DomainContext.User.UserId, "City");
                // Console.WriteLine(z);
                result.AddRange(this.db.SetupCity.FromSql(String.Format(CityQuery, DomainContext.User.UserId, "City")).ToList<SetupCity>());
                if (result.Count > 0)
                    return Ok(result);
                else
                    return Ok(this.repository.All());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.GetAll, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject ();
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
             [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllOwnedCitiesForEbook()
        {
            try
            {
                // var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
                //Expression<Func<SetupZone, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupZone, bool>>(predicate.ProvidedString, options));
                List<SetupCity> result = new List<SetupCity>();
                var z = String.Format(OwnedCityQuery, DomainContext.User.UserId, "City");
                // Console.WriteLine(z);
                result.AddRange(this.db.SetupCity.FromSql(String.Format(OwnedCityQuery, DomainContext.User.UserId, "City")).ToList<SetupCity>());
                if (result.Count > 0)
                    return Ok(result);
                else
                    return Ok(this.repository.All());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.GetAll, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject ();
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllExpossession([FromBody] Predicate predicate)
        {
             var city = predicate.ProvidedString.Split("?")[0]; 
            var userId = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Dashboard"".""GetCityWithPossession""('{0}',{1})", city,userId);
            return Ok(this.db.SetupCityPossession.FromSql(sql));

        }



        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityEx()
        {
            List<CitySubCity> res = new List<CitySubCity>();
            res.AddRange(this.db.CitySubCity.FromSql(String.Format(SubCityQuery, DomainContext.User.UserId)).ToList<CitySubCity>());
            if (res.Count > 0)
                return Ok(res);
            else
                return Ok(this.db.CitySubCity);
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                return Ok(await this.repository.AllAsync());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.GetAllAsync, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject ();
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
                Expression<Func<SetupCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCity, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.Single(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.GetSingle, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
                Expression<Func<SetupCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCity, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.SingleAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.GetSingleAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }


            [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetFindBy ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (SetupCity).Assembly);
            Expression<Func<SetupCity, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<SetupCity, bool>> (predicate.ProvidedString, options));
            List<SetupCity> result = new List<SetupCity> ();

            result.AddRange (this.db.SetupCity.FromSql (String.Format (CityQuery, DomainContext.User.UserId)).ToList<SetupCity> ());
            if (result.Count > 0)
                return Ok (result);
            else
                return Ok (this.repository.FindBy (discountFilterExpression));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        // {
        //     try
        //     {
        //         var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
        //         Expression<Func<SetupCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCity, bool>>(predicate.ProvidedString, options));

        //         return Ok(this.repository.FindBy(discountFilterExpression));
        //     }
        //     catch (Exception err)
        //     {
        //         AppException app = new AppException();
        //         app.Message = "Error on CityController.GetFindBy, " + err.Message;
        //         app.Time = DateTime.Now;
        //         app.Data = predicate.ProvidedString;
        //         this.db.AppException.Add(app);
        //         await (this.db.SaveChangesAsync());
        //         return BadRequest(app.Message);
        //     }
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
                Expression<Func<SetupCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCity, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.FindByAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.GetFindByAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SetupCity entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.City"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.AddOne, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] SetupCity entity)
        {
            try
            {
                await this.repository.AddAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.City"));
            }

            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.AddOneAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<SetupCity> entities)
        {
            try
            {
                this.repository.AddAll(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.City"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.AddMany, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<SetupCity> entities)
        {
            try
            {
                await this.repository.AddAllAsync(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.City"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.AddManyAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] SetupCity entity)
        {
            try
            {
                this.repository.Update(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.City"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.Update, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] SetupCity entity)
        {
            try
            {
                await this.repository.UpdateAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.City"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.UpdateAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] SetupCity entity)
        {
            try
            {
                this.repository.Delete(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.City"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.Delete, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] SetupCity entity)
        {
            try
            {
                await this.repository.DeleteAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.City"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.DeleteAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
                Expression<Func<SetupCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCity, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.DeleteWhere(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.DeleteWhere, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCity).Assembly);
                Expression<Func<SetupCity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCity, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CityController.DeleteWhereAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
               
            }
        }
private const string  OwnedCityQuery = @"SELECT
 ""VW_OwnedCities"".""CityId"",
			ct.""FullName"",
			ct.""CityCode"",
			ct.""StatusId"",
			ct.""LoggerId"",
			ct.""ProvinceId"",
			ct.""ZoneId""
FROM
""Setup"".""VW_OwnedCities"" 
JOIN
			""Setup"".""City"" ct on ""VW_OwnedCities"".""CityId"" = ct.""CityId""
WHERE
""VW_OwnedCities"".""CityId"" !='f9917949-4a84-4da0-8a40-6919535fa155' and

""Setup"".""VW_OwnedCities"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	)) GROUP BY ""VW_OwnedCities"".""CityId"",
			ct.""FullName"",
			ct.""CityCode"",
			ct.""StatusId"",
			ct.""LoggerId"",
			ct.""ProvinceId"",
			ct.""ZoneId""";
private const string  CityQuery = @"SELECT
""VWCampuCity"".""CityId"",
			ct.""FullName"",
			ct.""CityCode"",
			ct.""StatusId"",
			ct.""LoggerId"",
			ct.""ProvinceId"",
			ct.""ZoneId""
FROM
""Setup"".""VWCampuCity"" JOIN
			""Setup"".""City"" ct on ""VWCampuCity"".""CityId"" = ct.""CityId""
WHERE


""Setup"".""VWCampuCity"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	)) GROUP BY ""VWCampuCity"".""CityId"",
			ct.""FullName"",
			ct.""CityCode"",
			ct.""StatusId"",
			ct.""LoggerId"",
			ct.""ProvinceId"",
			ct.""ZoneId""

";

        private const string SubCityQuery = @"SELECT
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
	)) GROUP BY ""VWCampuCity"".""CityId"",
""VWCampuCity"".""CityName"",
""VWCampuCity"".""SubCityId"",
ct.""FullName""";

    }
}