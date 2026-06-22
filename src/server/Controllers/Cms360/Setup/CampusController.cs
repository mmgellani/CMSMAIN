using System.Diagnostics;
using System.Dynamic;
using System.Globalization;
using System.Runtime.CompilerServices;
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
using Dapper;
using System.Data;
namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupCampusController : Controller
    {
        private readonly ISetupCampusRepository repository;
        private readonly DbContextBase db;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly IUserLogService log;
        public SetupCampusController(ISetupCampusRepository repository, DbContextBase db, IDomainContextResolver Resolver, IUserLogService log)
        {
            this.repository = repository;
            this.db = db;
            this.Resolver = Resolver;
            this.log = log;

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

        public IActionResult GetAllowUser()
        {

            var z = this.db.IntModel.FromSql(String.Format("select Count(*) as val from \"Role\".\"AllowUsers\"  Where \"UserId\"={0} ", DomainContext.User.UserId));
            return Ok(z);
        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCampusAgainstCity([FromBody] Predicate predicate)
        {


            var cityId = new Guid(predicate.ProvidedString.Split("?")[0]);
            string sql = string.Format(@"select * from ""Setup"".""GetCityCampusRecord""('{0}' )", cityId);
            // Console.WriteLine(sql);
            return Ok(this.db.CampusCityData.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult BulkCopyProgramDetail([FromBody] Predicate predicate)
        {
            var isEnabled = Convert.ToBoolean(predicate.ProvidedString.Split("?")[0]);
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var campusId = predicate.ProvidedString.Split("?")[2];
            var campusProgramIdTos = predicate.ProvidedString.Split("?")[3];
            var sessionIdTo = new Guid(predicate.ProvidedString.Split("?")[4]);
            var campusIdTo = predicate.ProvidedString.Split("?")[5];
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT  \"Setup\".\"InsertBulkCopyProgramDetail\"({0},'{1}','{2}','{3}','{4}','{5}','{6}'::json ); commit;", isEnabled, sessionId, campusId, campusProgramIdTos, sessionIdTo, campusIdTo, Data);
           
            Console.WriteLine(json);
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
        public IActionResult GetCampusAgainstSubCity([FromBody] Predicate predicate)
        {


            var subcityId = new Guid(predicate.ProvidedString.Split("?")[0]);
            string sql = string.Format(@"select * from ""Setup"".""GetSubCityCampusRecord""('{0}' )", subcityId);
            // Console.WriteLine(sql);
            return Ok(this.db.CampusCityData.FromSql(sql));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityVM()
        {
            // var userId =  DomainContext.User.UserId;
            // Console.WriteLine(userId);
            // string sql = string.Format(@"select * from ""Setup"".""GetCampusRecord""('{0}' )", userId );
            //  Console.WriteLine(sql);
            // return Ok(this.db.CampusCityUserBased.FromSql(sql));

            List<CampusCityVM> res = new List<CampusCityVM>();
            res.AddRange(this.db.CampusCityVM.FromSql(String.Format(CampusVMQuery, DomainContext.User.UserId)).ToList<CampusCityVM>());
            if (res.Count > 0)
                return Ok(res);
            else
                return Ok(this.db.CampusCityVM);
        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetHadafCityVM()
        {
         
            List<VWHadafSMSCampus> res = new List<VWHadafSMSCampus>();
            res.AddRange(this.db.VWHadafSMSCampus.FromSql(String.Format(CampushadafVMQuery, DomainContext.User.UserId)).ToList<VWHadafSMSCampus>());
            if (res.Count > 0)
                return Ok(res);
            else
                return Ok(this.db.VWHadafSMSCampus);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCustomizeCampus([FromBody] Predicate model)
        {
            var input = Convert.ToInt16(model.ProvidedString);
            if (input == 1)
            {

                return Ok(this.db.CampusCityVM);

            }
            else
            {
                List<CampusCityVM> res = new List<CampusCityVM>();
                res.AddRange(this.db.CampusCityVM.FromSql(String.Format(CampusVMQuery, DomainContext.User.UserId)).ToList<CampusCityVM>());
                return Ok(res);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityVMByZone([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString);
            List<CampusCityVM> res = new List<CampusCityVM>();
            res.AddRange(this.db.CampusCityVM.FromSql(String.Format(CampusVMQueryByZone, DomainContext.User.UserId, zoneid)).ToList<CampusCityVM>());
            if (res.Count > 0)
                return Ok(res);
            else
                return Ok(this.db.CampusCityVM);
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
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampus).Assembly);
            Expression<Func<SetupCampus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampus, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampus).Assembly);
            Expression<Func<SetupCampus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampus, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampus).Assembly);
            Expression<Func<SetupCampus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampus, bool>>(predicate.ProvidedString, options));
            List<SetupCampus> result = new List<SetupCampus>();

            result.AddRange(this.db.SetupCampus.FromSql(String.Format(CampusQuery, DomainContext.User.UserId)).ToList<SetupCampus>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampus).Assembly);
            Expression<Func<SetupCampus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampus, bool>>(predicate.ProvidedString, options));

            List<SetupCampus> result = new List<SetupCampus>();

            result.AddRange(this.db.SetupCampus.FromSql(String.Format(CampusQuery, DomainContext.User.UserId, "Campus")).ToList<SetupCampus>());
            if (result.Count > 0)
                return Ok(result);
            else
                return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SetupCampus entity)
        {

            this.repository.Add(entity);
            this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.Campus");
            var dataex = JsonConvert.SerializeObject(entity);
            this.db.SaveChanges();

            var sql = String.Format(@"SELECT * FROM ""Setup"".""NewCampusEntry""('{0}'::json)", dataex);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            Console.WriteLine(sql);
            connection.Execute(sql);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] SetupCampus entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Campus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<SetupCampus> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Campus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<SetupCampus> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Campus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] SetupCampus entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Campus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] SetupCampus entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Campus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] SetupCampus entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Campus"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] SetupCampus entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Campus"));
        }






        [HttpGet]
        [Route("[action]")]
        public IActionResult GetStepCityVM()
        {
            // var userId =  DomainContext.User.UserId;
            // Console.WriteLine(userId);
            // string sql = string.Format(@"select * from ""Setup"".""GetCampusRecord""('{0}' )", userId );
            //  Console.WriteLine(sql);
            // return Ok(this.db.CampusCityUserBased.FromSql(sql));

            List<StepCampuCity> res = new List<StepCampuCity>();
            res.AddRange(this.db.StepCampuCity.FromSql(String.Format(CampusVMQuery, DomainContext.User.UserId)).ToList<StepCampuCity>());
            if (res.Count > 0)
                return Ok(res);
            else
                return Ok(this.db.StepCampuCity);
        }









        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampus).Assembly);
            Expression<Func<SetupCampus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampus, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampus).Assembly);
            Expression<Func<SetupCampus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampus, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
        private const string CampusQuery = @"SELECT
""Setup"".""Campus"".""CampusId"",
""Setup"".""Campus"".""FullName"",
""Setup"".""Campus"".""Code"",
""Setup"".""Campus"".""Description"",
""Setup"".""Campus"".""CustomerCode"",
""Setup"".""Campus"".""IsTestCampus"",
""Setup"".""Campus"".""FranchiseId"",
""Setup"".""Campus"".""InstitutionId"",
""Setup"".""Campus"".""DigitCode"",
""Setup"".""Campus"".""SubCityId"",
""Setup"".""Campus"".""StatusId"",
""Setup"".""Campus"".""Logo"",
""Setup"".""Campus"".""LoggerId"",
""Setup"".""Campus"".""BusinessUnitId"",
""Setup"".""Campus"".""SmsApId"",
""Setup"".""Campus"".""EmailPrefix"",
""Setup"".""Campus"".""IsEbook"",
""Setup"".""Campus"".""IsMerchandise"",
""Setup"".""Campus"".""IsDelivery""


FROM
""Setup"".""Campus""
WHERE  ""Setup"".""Campus"".""StatusId""=1
 and     ""Setup"".""Campus"".""CampusId"" IN (( SELECT CAST (( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID 
		) 
	FROM
		""Role"".""RolePrevilages"" 
	WHERE
	""UserId"" = {0} 
	))";

        private const string CampusVMQuery = @"SELECT
*
FROM
""Setup"".""VWCampuCity""
WHERE


""Setup"".""VWCampuCity"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	))

";
 private const string CampushadafVMQuery = @"SELECT
*
FROM
""Setup"".""VW_HadafSMSCampus""
WHERE


""Setup"".""VW_HadafSMSCampus"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	))

";

        private const string CampusVMQueryByZone = @"SELECT
*
FROM
""Setup"".""VWCampuCity""
WHERE
""Setup"".""VWCampuCity"".""ZoneId""='{1}'
and

""Setup"".""VWCampuCity"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	))

";
    }
}