
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
using Cms360.Data;
using Cms360.Contract;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using Dapper;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupCampusProgramLinkController : Controller
    {
        private readonly ISetupCampusProgramLinkRepository repository;

        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly DbContextBase db;
        private readonly IUserLogService log;


        public SetupCampusProgramLinkController(ISetupCampusProgramLinkRepository repository, DbContextBase db, IDomainContextResolver Resolver, IUserLogService log)
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
        public IActionResult GetAssessmentSchemes()
        {
            return Ok(this.repository.All());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            List<SetupCampusProgramVM> result = new List<SetupCampusProgramVM>();

            // result.AddRange(this.db.SetupCampusProgramVM.FromSql(String.Format(CampusProgramLinkVMQuery, DomainContext.User.UserId, "Program",campusId,sessionId)).ToList<SetupCampusProgramVM>());
            // if (result.Count > 0)
            //     return Ok(result);
            // else
            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.StatusId != 2).OrderBy(e => e.ProgramId));
        }
                [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMAdmission([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]); 
            var programId = new Guid(obj.text.Split("?")[2]);
            List<SetupCampusProgramVM> result = new List<SetupCampusProgramVM>();
            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.StatusId != 2 && e.ProgramId==programId).OrderBy(e => e.ProgramId));
        }

          [HttpPost]
        [Route("[action]")]
        public IActionResult GetForAssessmentSchedule([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
             var programId = new Guid(obj.text.Split("?")[1]);
            List<SetupCampusProgramVM> result = new List<SetupCampusProgramVM>();

            // result.AddRange(this.db.SetupCampusProgramVM.FromSql(String.Format(CampusProgramLinkVMQuery, DomainContext.User.UserId, "Program",campusId,sessionId)).ToList<SetupCampusProgramVM>());
            // if (result.Count > 0)
            //     return Ok(result);
            // else
            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId&& e.ProgramId == programId && e.StatusId != 2).OrderBy(e => e.ProgramId));
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAllVMEx2([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            List<SetupCampusProgramVM> result = new List<SetupCampusProgramVM>();

            // result.AddRange(this.db.SetupCampusProgramVM.FromSql(String.Format(CampusProgramLinkVMQuery, DomainContext.User.UserId, "Program",campusId,sessionId)).ToList<SetupCampusProgramVM>());
            // if (result.Count > 0)
            //     return Ok(result);
            // else
            //this.db.SetupCampusProgramVM.FromSql($"Select * from \"Setup\".\"VWCampusProgramLinkEx\" where \"CampusId\"={campusId} and \"SessionId\"={sesssionId} and \"StatusId\"=1")
            return Ok(this.db.SetupCampusProgramVM.FromSql($"Select * from \"Setup\".\"VWCampusProgramLinkEx\" where \"CampusId\"={campusId} and \"SessionId\"={sessionId} and \"StatusId\"=1").ToList().OrderBy(e => e.ProgramId));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMEx([FromBody] StrObj obj)
        {
            var campusId = new Guid(obj.text.Split("?")[0]);
            List<SetupCampusProgramVM> result = new List<SetupCampusProgramVM>();

            // result.AddRange(this.db.SetupCampusProgramVM.FromSql(String.Format(CampusProgramLinkVMQuery, DomainContext.User.UserId, "Program",campusId,sessionId)).ToList<SetupCampusProgramVM>());
            // if (result.Count > 0)
            //     return Ok(result);
            // else
            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.StatusId == 1).OrderBy(e => e.ProgramId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult AssesmentProgDetailByProgram([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            var levelId = new Guid(obj.text.Split("?")[2]);

            return Ok(this.db.LevelProgamDetailsVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.LevelId == levelId && e.StatusId != 2).OrderBy(e => e.ProgramId));
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult ProgDetailByProgram([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            var ProgramId = new Guid(obj.text.Split("?")[2]);

            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.ProgramId == ProgramId && e.StatusId != 2).OrderBy(e => e.ProgramId));
        }

             [HttpPost]
        [Route("[action]")]
        public IActionResult GetAssessmentNames([FromBody] StrObj obj)
        {
            var assessmentSchemeMasterId = new Guid(obj.text.Split("?")[0]);
        
            return Ok(this.db.VWAssessmentNames.Where(e => e.AssessmentSchemeMasterId == assessmentSchemeMasterId).OrderBy(e => e.Order));
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetClassName([FromBody] StrObj obj)
        {
           
            var programId = new Guid(obj.text.Split("?")[0]);
            var levelId = new Guid(obj.text.Split("?")[1]);

            return Ok(this.db.VWClassLevel.Where(e => e.ProgramId == programId && e.LevelId == levelId).OrderBy(e => e.ProgramId));
        }

  [HttpPost]
        [Route("[action]")]
        public IActionResult GetAssessmentSections([FromBody] StrObj obj)
        {
           
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            var programDetailId = new Guid(obj.text.Split("?")[2]);
            var classId = new Guid(obj.text.Split("?")[3]);
            var assessmentSchemeMasterId = new Guid(obj.text.Split("?")[4]);
           
            return Ok(this.db.VWAssessmentSectionMap.Where(e => e.SessionId == sessionId && e.CampusId == campusId && 
            e.ProgramDetailId == programDetailId  && e.ClassId == classId && 
             e.AssessmentSchemeMasterId == assessmentSchemeMasterId).OrderBy(e => e.SectionName));
        }


      
        

        [HttpPost]
        [Route("[action]")]
        public IActionResult ProgDetailByMultipleProgram([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            var programIdString = obj.text.Split("?")[2];
            var programIds = programIdString.Split(',').ToList();

            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && programIds.Contains(e.ProgramId.ToString()) && e.StatusId != 2).OrderBy(e => e.ProgramId));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMActive([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            var shiftId = new Guid(obj.text.Split("?")[2]);

            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.StatusId == 1 && e.ShiftId == shiftId).OrderBy(e => e.ProgramId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllActive([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            var programDetailId = new Guid(obj.text.Split("?")[2]);

            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.StatusId == 1 && e.ProgramDetailId == programDetailId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulk([FromBody] Predicate obj)
        {
            var sessionId = new Guid(obj.ProvidedString.Split("?")[0]);
            var campusId = new Guid(obj.ProvidedString.Split("?")[1]);
            var json = obj.ProvidedString.Split("?")[2];

            var query = string.Format(@"select * from ""Setup"".""AddCampusProgramLinkBulk""('{0}','{1}','{2}')", campusId, sessionId, json);
            // Console.WriteLine(query);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }



            return Ok("Done");
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityProgram([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var cityId = new Guid(obj.text.Split("?")[1]);
            string sql = string.Format(@"select ""ProgramDetailId"",""Description"",""ProgramName"",""ProgramId"",""CityId"" from ""Setup"".""VWCampusProgramCity"" where ""CityId"" = '{0}' and ""SessionId"" = '{1}'
             GROUP BY ""ProgramName"",""ProgramId"",""Description"",""ProgramDetailId"",""CityId""
           ORDER BY ""ProgramId"" ", cityId, sessionId);
            return Ok(this.db.VWCampusProgramCity.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLevelProgram([FromBody] StrObj obj)
        {
            var level = new String(obj.text.Split("?")[0]);
            string sql = string.Format(@"select * from  ""Setup"".""VW-ProgramEx"" Where ""ProgramId""='{0}' ", level);
            return Ok(this.db.VWCampusProgramLevel.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLevel([FromBody] StrObj obj)
        {
            var level = new String(obj.text.Split("?")[0]);
            string sql = string.Format(@"select * from  ""Setup"".""GetDashboardProgramDataEx"" ('{0}') ", level);
            return Ok(this.db.VWProgramLevel.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLevelProgramDetail([FromBody] StrObj obj)
        {
            var level = new String(obj.text.Split("?")[0]);
          var sessionid = new Guid(obj.text.Split("?")[1]);

            var cityid = new String(obj.text.Split("?")[2]);

            string sql = string.Format(@"select * from  ""Setup"".""GetDashboardProgramDataCitySession"" ('{0}','{1}','{2}') ", level,sessionid,cityid);
            return Ok(this.db.VWCampusProgramLevelEx.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMActiveOrdeByCampus([FromBody] StrObj obj)
        {
            var sessionId = new Guid(obj.text.Split("?")[0]);
            var campusId = new Guid(obj.text.Split("?")[1]);
            var shiftId = new Guid(obj.text.Split("?")[2]);

            return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.StatusId == 1 && e.ShiftId == shiftId).OrderBy(e => e.CampusId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllByZoneId([FromBody] StrObj obj)
        {
            var zoneId = new Guid(obj.text.Split("?")[0]);
            var sessionId = new Guid(obj.text.Split("?")[1]);
            var shiftid = new Guid(obj.text.Split("?")[2]);



            return Ok(this.db.CampusProgramZoneVM.Where(s => s.ZoneId == zoneId && s.SessionId == sessionId && s.ShiftId == shiftid).OrderBy(a => a.CampusId));


            //  return Ok(this.db.SetupCampusProgramVM.FromSql(@"Select * from ""Setup"".""VWCampusProgramLink"" where ""CampusId"" in( select ""CampusId"" from ""Setup"".""VWCampuCity"" where ""ZoneId""='" + zoneId + @"' and ""SessionId""='" + sessionId + "')").OrderBy(a => a.CampusId));

            // return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.StatusId == 1 && e.ShiftId==shiftId).OrderBy(e => e.CampusId));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllPrograms()
        {
            return Ok(this.db.SetupCampusProgramVMo.FromSql("SELECT '' AS \"CampusProgramId\", '' AS \"CampusId\", \"VW-ProgramDetail\".\"ProgramDetailId\", '' AS \"StatusId\", '' AS \"LoggerId\", '' AS \"SessionId\", '' AS \"CampusName\", \"VW-ProgramDetail\".\"Description\", \"Program\".\"FullName\" AS \"ProgramName\", '' AS \"ProgramId\", '' AS \"ShiftId\", '' AS \"ShiftName\" FROM \"Setup\".\"VW-ProgramDetail\" JOIN \"Setup\".\"Program\" ON \"VW-ProgramDetail\".\"ProgramId\" = \"Program\".\"ProgramId\" ORDER BY \"Program\".\"FullName\", \"VW-ProgramDetail\".\"Description\""));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVMData()
        {

            return Ok(this.db.SetupCampusProgramVM.Where(e => e.StatusId == 1));
        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetVM([FromBody] StrObj obj)
        // {
        //     var sessionId = new Guid(obj.text.Split("?")[0]);
        //     var campusId = new Guid(obj.text.Split("?")[1]);
        //     return Ok(this.db.SetupCampusProgramVM.Where(e => e.CampusId == campusId && e.SessionId == sessionId && e.StatusId != 2));
        // }
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCampusProgramData()
        {
            return Ok(this.db.CampusProgramData.FromSql(string.Format("select * from \"Setup\".\"CampusProgramLinkData\"()")));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampusProgramLink).Assembly);
            Expression<Func<SetupCampusProgramLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampusProgramLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampusProgramLink).Assembly);
            Expression<Func<SetupCampusProgramLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampusProgramLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampusProgramLink).Assembly);
            Expression<Func<SetupCampusProgramLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampusProgramLink, bool>>(predicate.ProvidedString, options));
            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampusProgramLink).Assembly);
            Expression<Func<SetupCampusProgramLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampusProgramLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SetupCampusProgramLink entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] SetupCampusProgramLink entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<SetupCampusProgramLink> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<SetupCampusProgramLink> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] SetupCampusProgramLink entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] SetupCampusProgramLink entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] SetupCampusProgramLink entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] SetupCampusProgramLink entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.CampusProgramLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampusProgramLink).Assembly);
            Expression<Func<SetupCampusProgramLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampusProgramLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupCampusProgramLink).Assembly);
            Expression<Func<SetupCampusProgramLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCampusProgramLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        private const string CampusProgramLinkVMQuery = @"
SELECT
""Setup"".""VWCampusProgramLink"".""CampusProgramId"",
""Setup"".""VWCampusProgramLink"".""CampusId"",
""Setup"".""VWCampusProgramLink"".""ProgramDetailId"",
""Setup"".""VWCampusProgramLink"".""StatusId"",
""Setup"".""VWCampusProgramLink"".""LoggerId"",
""Setup"".""VWCampusProgramLink"".""SessionId"",
""Setup"".""VWCampusProgramLink"".""CampusName"",
""Setup"".""VWCampusProgramLink"".""Description"",
""Setup"".""VWCampusProgramLink"".""ProgramName"",
""Setup"".""VWCampusProgramLink"".""ProgramId"",
""Setup"".""VWCampusProgramLink"".""ShiftId"",
""Setup"".""VWCampusProgramLink"".""ShiftName""
FROM
""Setup"".""VWCampusProgramLink""
WHERE
""Setup"".""VWCampusProgramLink"".""ProgramId"" IN ((
	SELECT CAST (( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID 
		) AS ""Id"" 
	FROM
		""Role"".""RolePrevilages"" 
	WHERE
		""RoleId"" IN (select ""RoleId"" from ""Role"".""UserRole"" WHERE ""UserId"" = '{0}') 
	AND ""ModuleType"" = '{1}'))
		 AND
""Setup"".""VWCampusProgramLink"".""CampusId"" = '{2}' AND
""Setup"".""VWCampusProgramLink"".""SessionId"" = '{3}'
";
    }
}