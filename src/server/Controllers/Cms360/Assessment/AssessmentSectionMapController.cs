
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
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
 
    public class AssessmentSectionMapController : Controller
    {
        private readonly IAssessmentSectionMapRepository repository;
        private readonly IVWAssessmentSectionMapRepository repo;
        private readonly List<SectionCourseLinkVMForAssessment> tempList;
        private readonly IUserLogService log;
        private IDomainContext domainContext;
        protected IDomainContextResolver Resolver;
        private DbContextBase db;
        public AssessmentSectionMapController(IAssessmentSectionMapRepository repository,IVWAssessmentSectionMapRepository repo, IDomainContextResolver Resolver,IUserLogService log,DbContextBase db)
        {
            this.repository = repository;
            this.repo = repo;
            this.log = log;
            this.db = db;
            this.Resolver = Resolver;
            tempList = new List<SectionCourseLinkVMForAssessment>();

        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
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
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.repository.All());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVM()
        {
            return Ok(this.repo.All());
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
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSectionMap).Assembly);
            Expression<Func<AssessmentSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSectionMap).Assembly);
            Expression<Func<AssessmentSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSectionMap, bool>>(predicate.ProvidedString, options));

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

         [HttpPost]
        [Route("[action]")]
        public IActionResult AddAssessmentSectionMapBulkInsertion([FromBody] Predicate predicate)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            var query = String.Format(@"select * from ""Assessment"".""AssessmentSectionMapBulkInsertion""('{0}') as ProvidedString", predicate.ProvidedString);
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
        public IActionResult GetProgramsAgainstLevel([FromBody] Predicate predicate)
        {
           var levelid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = string.Format(@"select * from ""Assessment"".""GetProgramsAgainstLevel""('{0}' , '{1}')", levelid , campusid);
            // Console.WriteLine(sql);
            return Ok(this.db.AssessmentLevelProgram.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSectionMap).Assembly);
            Expression<Func<AssessmentSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByVM([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(VWAssessmentSectionMap).Assembly);
            Expression<Func<VWAssessmentSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<VWAssessmentSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repo.FindBy(discountFilterExpression));
        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAssessmentOnClass([FromBody] StrObj obj)
        {
            var programId = new Guid(obj.text.Split("?")[0]);
            var classId = new Guid(obj.text.Split("?")[1]);
        
            return Ok(this.db.VWAssessmentSectionMap.Where(e => e.ProgramId == programId && e.ClassId == classId && e.StatusId == 1)
            .GroupBy(e => e.AssessmentSchemeMasterId)
            .Select(group => group.First())
            .OrderBy(e => e.CampusId));
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetAssessmentSectionMapData([FromBody] Predicate predicate)
        {
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var levelId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var campusid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var CampusProgramId = predicate.ProvidedString.Split("?")[4]; 

            string sql = string.Format(@"select * from ""Assessment"".""GetAssessmentSectionMapData""('{0}' , '{1}' , '{2}' , '{3}', '{4}')", sessionId , levelId , classId , campusid , CampusProgramId);
             
            Console.WriteLine(sql);
            return Ok(this.db.VWAssessmentSectionMap.FromSql(sql));

            //return Ok(this.db.VWAssessmentSectionMap.Where(e => e.ClassId == classId && e.SessionId == sessionId && e.LevelId == levelId && campusprogramIds.Contains(e.CampusProgramId.ToString()) && e.StatusId != 2).OrderBy(e => e.AssessmentMaster));
        }


          [HttpPost]
        [Route("[action]")]
        public IActionResult CheckAssessmentScheduleCount([FromBody] Predicate predicate)
        {
            var assessmentSectionMapId = new Guid(predicate.ProvidedString.Split("?")[0]);
           

            string sql = string.Format(@"select * from ""Assessment"".""CheckAsssessmentScheduleCount""('{0}') as ""Response""", assessmentSectionMapId);
             
            Console.WriteLine(sql);
            return Ok(this.db.deleteAssessmentSchedule.FromSql(sql));

            //return Ok(this.db.VWAssessmentSectionMap.Where(e => e.ClassId == classId && e.SessionId == sessionId && e.LevelId == levelId && campusprogramIds.Contains(e.CampusProgramId.ToString()) && e.StatusId != 2).OrderBy(e => e.AssessmentMaster));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionList([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusprogramidArray = predicate.ProvidedString.Split("?")[1].Split(',').Select(Guid.Parse).ToArray();
            var campusid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var levelid = new Guid(predicate.ProvidedString.Split("?")[4]);
             //var list = db.RegistrationSectionCourseLinkVM.FromSql(string.Format(@"Select * from ""Registration"".""VWSectionCourseViaSession""  where ""CampusProgramId"" = ANY('{0}') and ""ClassId""='{1}' and ""SectionCourseLinkId""
    // in (SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {2})", string.Join("','", campusprogramidArray), classid, DomainContext.User.UserId)).ToList();

            var list = (List<SectionCourseLinkVMForAssessment>)null;
            Console.WriteLine(campusprogramidArray.ToString());
            if(campusprogramidArray.Any(guid => guid == Guid.Empty) || campusprogramidArray.Any(guid => guid ==new Guid( "00000000-0000-0000-0000-000000000000")))
            {
                 list = db.SectionCourseLinkVMForAssessment.FromSql(string.Format(@"Select * from ""Assessment"".""GetSectionsForAssessment""  where ""SessionId""='{0}' and ""CampusId""='{1}' and ""ClassId""='{2}' and ""LevelId""='{3}' and ""SectionCourseLinkId""
		 in (SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {4})",sessionid,campusid , classid ,levelid, DomainContext.User.UserId)).ToList();
            }
            else{
                list = db.SectionCourseLinkVMForAssessment.FromSql(string.Format(@"Select * from ""Assessment"".""GetSectionsForAssessment""  where ""SessionId""='{0}' and ""CampusProgramId"" in ('{1}') and ""CampusId""='{2}' and""ClassId""='{3}' and ""LevelId""='{4}' and ""SectionCourseLinkId""
		 in (SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {5})",sessionid, string.Join("','", campusprogramidArray), campusid ,classid,levelid, DomainContext.User.UserId)).ToList();

            }
             
            if (list.Count > 0)
            {
                var oldObj = list[0];
                tempList.Add(oldObj);
                foreach (var v in list)
                {
                    if (v.SectionId != oldObj.SectionId)
                    {
                        tempList.Add(v);
                    }
                    oldObj = v;
                }
                return Ok(tempList.OrderBy(e => e.SectionName));
            }
            else return Ok(null);

        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionListForUpdate([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusprogramidArray = predicate.ProvidedString.Split("?")[1].Split(',').Select(Guid.Parse).ToArray();
            var campusid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var levelid = new Guid(predicate.ProvidedString.Split("?")[4]);
             //var list = db.RegistrationSectionCourseLinkVM.FromSql(string.Format(@"Select * from ""Registration"".""VWSectionCourseViaSession""  where ""CampusProgramId"" = ANY('{0}') and ""ClassId""='{1}' and ""SectionCourseLinkId""
    // in (SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {2})", string.Join("','", campusprogramidArray), classid, DomainContext.User.UserId)).ToList();

            var list = (List<SectionCourseLinkVMForAssessment>)null;
            Console.WriteLine(campusprogramidArray.ToString());
            if(campusprogramidArray.Any(guid => guid == Guid.Empty) || campusprogramidArray.Any(guid => guid ==new Guid( "00000000-0000-0000-0000-000000000000")))
            {
                 list = db.SectionCourseLinkVMForAssessment.FromSql(string.Format(@"Select * from ""Assessment"".""GetAssessmentSectionsForUpdate""  where ""SessionId""='{0}' and ""CampusId""='{1}' and ""ClassId""='{2}' and ""LevelId""='{3}' and ""SectionCourseLinkId""
		 in (SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {4})",sessionid,campusid , classid ,levelid, DomainContext.User.UserId)).ToList();
            }
            else{
                list = db.SectionCourseLinkVMForAssessment.FromSql(string.Format(@"Select * from ""Assessment"".""GetAssessmentSectionsForUpdate""  where ""SessionId""='{0}' and ""CampusProgramId"" in ('{1}') and ""CampusId""='{2}' and""ClassId""='{3}' and ""LevelId""='{4}' and ""SectionCourseLinkId""
		 in (SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {5})",sessionid, string.Join("','", campusprogramidArray), campusid ,classid,levelid, DomainContext.User.UserId)).ToList();

            }
             
            if (list.Count > 0)
            {
                var oldObj = list[0];
                tempList.Add(oldObj);
                foreach (var v in list)
                {
                    if (v.SectionId != oldObj.SectionId)
                    {
                        tempList.Add(v);
                    }
                    oldObj = v;
                }
                return Ok(tempList.OrderBy(e => e.SectionName));
            }
            else return Ok(null);

        }

        [HttpPost]
        [Route("[action]")]
      public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSectionMap).Assembly);
            Expression<Func<AssessmentSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]AssessmentSectionMap entity)
        {
           this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Assessment.AssessmentSectionMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]AssessmentSectionMap entity)
        {
             await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Assessment.AssessmentSectionMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<AssessmentSectionMap> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Assessment.AssessmentSectionMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<AssessmentSectionMap> entities)
        {
             await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Assessment.AssessmentSectionMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]AssessmentSectionMap entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Assessment.AssessmentSectionMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]AssessmentSectionMap entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Assessment.AssessmentSectionMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]AssessmentSectionMap entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Assessment.AssessmentSectionMap"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]AssessmentSectionMap entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Assessment.AssessmentSectionMap"));
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSectionMap).Assembly);
            Expression<Func<AssessmentSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSectionMap).Assembly);
            Expression<Func<AssessmentSectionMap, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSectionMap, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}