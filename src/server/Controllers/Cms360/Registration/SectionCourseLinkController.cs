
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

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using Cms360.Contract;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class RegistrationSectionCourseLinkController : Controller
    {
        private readonly IRegistrationSectionCourseLinkRepository repository;
        private readonly IRegistrationSectionCourseLinkVMRepository repo;

        private readonly DbContextBase db;

        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly IUserLogService log;

        public RegistrationSectionCourseLinkController(IRegistrationSectionCourseLinkRepository repository, DbContextBase db, IDomainContextResolver Resolver, IUserLogService log, IRegistrationSectionCourseLinkVMRepository repo)
        {
            this.repository = repository;
            this.repo = repo;
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

        private bool validateinputvalue(string input)
        {
            if (input == null || input == "" || input == " " || input == "null" || string.IsNullOrEmpty(input.Trim()))
            {
                return true;
            }
            return false;
        }

        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAll()
        // {
        //     return Ok(this.repo.FindBy(e => e.StatusId != 2));
        // }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionBycampusprogramid([FromBody] Predicate predicate)
        {

            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }

            return Ok(this.db.RegistrationSectionCourseLinkVM.Where(e => e.StatusId == 1 && e.CampusProgramId == new Guid(predicate.ProvidedString)).OrderBy(e => e.SectionName));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAsync([FromBody] Predicate predicate)
        {
            var SessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var CampusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var ClassId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var ProgramDetailId = new Guid(predicate.ProvidedString.Split("?")[3]);
            return Ok(this.db.RegistrationSectionCourseLinkVMEx.Where(e => e.StatusId != 2 && e.SessionId == SessionId && e.CampusId == CampusId && e.ClassId == ClassId && e.ProgramDetailId == ProgramDetailId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetBuildingRooms([FromBody] Predicate predicate)
        {

            var CampusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"select * from  ""Setup"".""CampusBuildingMap""('{0}')", CampusId);

            return Ok(this.db.RegistrationSectionCourseLink2.FromSql(sql));
        }



        [HttpPost]
        [Route("[action]")]


        public IActionResult GetUserSectionList([FromBody] Predicate predicate)
        {
            var SessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var CampusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var ClassId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var ProgramDetailId = new Guid(predicate.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"select * from  ""Registration"".""GetUserSectionList""('{0}','{1}','{2}',{3},'{4}')", CampusId, ProgramDetailId, SessionId, DomainContext.User.UserId, ClassId);

            return Ok(this.db.RegistrationSectionCourseLinkList.FromSql(sql).OrderBy(e => e.FullName));


        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionList([FromBody] Predicate predicate)
        {
            var CampusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);

            var AdmissionFormId = new Guid(predicate.ProvidedString.Split("?")[1]);

            var ClassId = GetClassId(AdmissionFormId);
            string query = string.Format(@"Select * from ""Registration"".""VWSectionList""  where ""CampusProgramId""='{0}' and ""ClassId""='{1}'", CampusProgramId, ClassId);
            return Ok(this.db.RegistrationSectionCourseLinkList.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllSectionsClass([FromBody] Predicate predicate)
        {
            var CampusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);

            var ClassId = new Guid(predicate.ProvidedString.Split("?")[1]);

            string query = string.Format(@"Select * from ""Registration"".""VWSectionList""  where ""CampusProgramId""='{0}' and ""ClassId""='{1}'", CampusProgramId, ClassId);
            return Ok(this.db.RegistrationSectionCourseLinkList.FromSql(query));
        }

        private Guid GetClassId(Guid val)

        {
            string sql = string.Format(@"SELECT
""Setup"".""Class"".""ClassId"" as ""CheckFeeStructure""
FROM
""Setup"".""Class""
INNER JOIN ""Fee"".""StudentChallan"" ON ""Fee"".""StudentChallan"".""ClassId"" = ""Setup"".""Class"".""ClassId""

where ""StudentChallan"".""AdmissionFormId""='{0}' 
order by ""Setup"".""Class"".""ClassCode"" Desc limit 1", val);

            StudentFeeExist[] res = this.db.StudentFeeExist.FromSql(sql).ToArray<StudentFeeExist>();


            return res[0].CheckFeeStructure;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionListEX([FromBody] Predicate predicate)
        {
            var CampusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);

            var AdmissionFormId = new Guid(predicate.ProvidedString.Split("?")[1]);

            var ClassId = GetClassIdEX(AdmissionFormId);
            string query = string.Format(@"Select * from ""Registration"".""VWSectionList""  where ""CampusProgramId""='{0}' and ""ClassId""='{1}'", CampusProgramId, ClassId);
            return Ok(this.db.RegistrationSectionCourseLinkList.FromSql(query));
        }

        private Guid GetClassIdEX(Guid val)

        {
            string sql = string.Format(@"SELECT ""ClassId"" as ""CheckFeeStructure"" FROM ""Setup"".""Class"" WHERE ""ClassId"" IN (
SELECT scl.""ClassId"" FROM
""Registration"".""Enrollments"" AS en, ""Registration"".""SectionCourseLink"" AS scl
WHERE en.""SectionCourseLinkId""[1] IN (scl.""SectionCourseLinkId"" )AND en.""AdmissionFormId"" = '{0}') ORDER BY ""ClassCode"" DESC LIMIT 1;", val);

            StudentFeeExist[] res = this.db.StudentFeeExist.FromSql(sql).ToArray<StudentFeeExist>();


            return res[0].CheckFeeStructure;
        }





        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationSectionCourseLink).Assembly);
            Expression<Func<RegistrationSectionCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationSectionCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSectionCourseByClass([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var ClassID = new Guid(predicate.ProvidedString);
            return Ok(this.db.RegistrationSectionCourseLinkVM.Where(e => e.ClassId == ClassID));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationSectionCourseLink).Assembly);
            Expression<Func<RegistrationSectionCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationSectionCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetAllFilterData([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var campusProgramId = new Guid(predicate.ProvidedString.Split('?')[0]);
            var classid = new Guid(predicate.ProvidedString.Split('?')[1]);
            var sectionid = new Guid(predicate.ProvidedString.Split('?')[2]);
            return Ok(this.db.RegistrationSectionCourseLinkVM.Where(e => e.StatusId != 2 && e.CampusProgramId == campusProgramId && e.ClassId == classid && e.SectionId == sectionid));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSectionData([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var campusId = new Guid(predicate.ProvidedString.Split('?')[0]);
            var campusProgramId = new Guid(predicate.ProvidedString.Split('?')[1]);
            var classid = new Guid(predicate.ProvidedString.Split('?')[2]);

            List<RegistrationSectionCourseLinkVMModel> res = new List<RegistrationSectionCourseLinkVMModel>();
            res.AddRange(this.db.RegistrationSectionCourseLinkVMModel.FromSql(String.Format(SectionQuery, campusId, campusProgramId, classid, DomainContext.User.UserId)).ToList<RegistrationSectionCourseLinkVMModel>());
            // if (res.Count > 0)
            return Ok(res);
            // else
            //     return Ok(this.repo.FindBy(e => e.StatusId != 2 && e.CampusId == campusId && e.CampusProgramId == campusProgramId && e.ClassId == classid).OrderBy(e => e.SectionName));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationSectionCourseLink).Assembly);
            Expression<Func<RegistrationSectionCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationSectionCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationSectionCourseLink).Assembly);
            Expression<Func<RegistrationSectionCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationSectionCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] RegistrationSectionCourseLink entity)
        {
            var exist = this.db.RegistrationSectionCourseLink.Where(e => e.CampusProgramId == entity.CampusProgramId && e.ClassId == entity.ClassId && e.SectionId == entity.SectionId && e.StatusId == 1).ToList();
            if (exist.Count == 0)
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Registration.SectionCourseLink"));
            }
            else
            {
                return Ok("Data Already Exist");
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] RegistrationSectionCourseLink entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Registration.SectionCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<RegistrationSectionCourseLink> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Registration.SectionCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<RegistrationSectionCourseLink> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Registration.SectionCourseLink"));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] RegistrationSectionCourseLink entity)
        {
            var exist = this.db.RegistrationSectionCourseLink.Where(e => e.CampusProgramId == entity.CampusProgramId && e.ClassId == entity.ClassId && e.SectionId == entity.SectionId && e.StatusId == 1 && e.SectionCourseLinkId != entity.SectionCourseLinkId).ToList();
            if (entity.StatusId == 2)
            {
                this.repository.Update(entity);
                string data = JsonConvert.SerializeObject(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Registration.SectionCourseLink"));

            }
            else if (exist.Count == 0 && entity.StatusId != 2)
            {
                this.repository.Update(entity);
                string data = JsonConvert.SerializeObject(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Registration.SectionCourseLink"));
            }
            else
            {
                return Ok("Data Already Exist");
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] RegistrationSectionCourseLink entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Registration.SectionCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] RegistrationSectionCourseLink entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Registration.SectionCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] RegistrationSectionCourseLink entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Registration.SectionCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationSectionCourseLink).Assembly);
            Expression<Func<RegistrationSectionCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationSectionCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationSectionCourseLink).Assembly);
            Expression<Func<RegistrationSectionCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationSectionCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
        private const string SectionQuery = @"SELECT * FROM ""Registration"".""VWSectionCourseViaSession"" WHERE ""CampusId""='{0}' and ""CampusProgramId""='{1}' and ""ClassId""= '{2}' and ""SectionCourseLinkId"" in (((SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {3} )))";
    }
}