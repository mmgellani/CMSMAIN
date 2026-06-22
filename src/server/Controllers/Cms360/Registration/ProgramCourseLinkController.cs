
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

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
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Npgsql;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class RegistrationProgramCourseLinkController : Controller
    {
        private readonly IRegistrationProgramCourseLinkRepository repository;
        private readonly IRegistrationProgramCourseLinkVMRepository VMrepository;
        private readonly IUserLogService log;
        private readonly DbContextBase db;
        public RegistrationProgramCourseLinkController(IRegistrationProgramCourseLinkRepository repository, DbContextBase db, IUserLogService log, IRegistrationProgramCourseLinkVMRepository VMrepository)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
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
            return Ok(this.db.RegistrationProgramCourseLinkVM.Where(e => e.StatusId != 2));

            //return Ok(this.VMrepository.FindBy(e=>e.StatusId!=2));
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
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationProgramCourseLink).Assembly);
            Expression<Func<RegistrationProgramCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationProgramCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamCourseList([FromBody] Predicate param)
        {
            var sectioncourslinkId = param.ProvidedString.Split("?")[0];
            var examname = param.ProvidedString.Split("?")[1];
            var scheduletype=param.ProvidedString.Split("?")[2];

            Console.WriteLine("New Functions : " + sectioncourslinkId);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetExamCourseList""('{0}','{1}','{2}')", sectioncourslinkId,examname,scheduletype);
            // Console.WriteLine(sql);
            return Ok(db.examcourselist.FromSql(sql));
            //return Ok(z);

        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetAllFilterData([FromBody] Predicate predicate)
        {
            var programDetailId = new Guid(predicate.ProvidedString.Split('?')[0]);
            var classId = new Guid(predicate.ProvidedString.Split('?')[1]);
            return Ok(this.db.RegistrationProgramCourseLinkVM.Where(e => e.StatusId == 1 && e.ProgramDetailId == programDetailId && e.ClassId == classId));
            //return Ok(this.VMrepository.FindBy(e=>e.StatusId!=2 && e.ProgramDetailId == programDetailId && e.ClassId == classId));
        }

         [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetAllFilterDataForList([FromBody] Predicate predicate)
        {
            var programDetailId = new Guid(predicate.ProvidedString.Split('?')[0]);
            var classId = new Guid(predicate.ProvidedString.Split('?')[1]);
            return Ok(this.db.RegistrationProgramCourseLinkVM.Where(e => e.StatusId != 2 && e.ProgramDetailId == programDetailId && e.ClassId == classId));
            //return Ok(this.VMrepository.FindBy(e=>e.StatusId!=2 && e.ProgramDetailId == programDetailId && e.ClassId == classId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetByClassId([FromBody] Predicate predicate)
        {
            var classid = new Guid(predicate.ProvidedString);
            return Ok(this.db.RegistrationProgramCourseLinkVM.Where(e => e.ClassId == classid && e.StatusId != 2));

            //return Ok(this.VMrepository.FindBy(e=>e.ClassId==classid && e.StatusId!=2));

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationProgramCourseLink).Assembly);
            Expression<Func<RegistrationProgramCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationProgramCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationProgramCourseLink).Assembly);
            Expression<Func<RegistrationProgramCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationProgramCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationProgramCourseLink).Assembly);
            Expression<Func<RegistrationProgramCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationProgramCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] RegistrationProgramCourseLink entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Registration.ProgramCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] RegistrationProgramCourseLink entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Registration.ProgramCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<RegistrationProgramCourseLink> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Registration.ProgramCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<RegistrationProgramCourseLink> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Registration.ProgramCourseLink"));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] RegistrationProgramCourseLink entity)
        {
            if(entity.StatusId != 1)
            {
                string json = String.Format(@"SELECT DISTINCT exs.""ProgramCourseLinkId"" FROM ""Examination"".""ExamMaster"" exs WHERE exs.""ProgramCourseLinkId"" = '{0}' AND ""StatusId"" = 1", entity.ProgramCourseLinkId);
                Console.WriteLine("New Query : " + json);
                var res = db.ExaminationExamMasterNew.FromSql(json).ToArray();


                //string json1 = String.Format(@"SELECT DISTINCT exs.""ProgramCourseLinkId"" FROM ""TimeTable"".""TimeTable"" exs WHERE exs.""ProgramCourseLinkId"" = '{0}' AND ""StatusId"" = 1", entity.ProgramCourseLinkId);
                //Console.WriteLine("New Query : " + json1);
                //var res1 = db.ExaminationExamMasterNew.FromSql(json1).ToArray();



                if (res.Length > 0)
                {

                    return Ok("Cannot Update/Delete Exam is scheduled for this course.");

                }
                //else if (res1.Length > 0)
                //{
                //    return Ok("Cannot Update/Delete TimeTable entered for this course.");
                //}
                else
                {
                    this.repository.Update(entity);
                    string data = JsonConvert.SerializeObject(entity);
                    return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Registration.ProgramCourseLink"));
                }
            }
            else
            {
                this.repository.Update(entity);
                string data = JsonConvert.SerializeObject(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Registration.ProgramCourseLink"));
            }
          
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] RegistrationProgramCourseLink entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Registration.ProgramCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] RegistrationProgramCourseLink entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Registration.ProgramCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] RegistrationProgramCourseLink entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Registration.ProgramCourseLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationProgramCourseLink).Assembly);
            Expression<Func<RegistrationProgramCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationProgramCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationProgramCourseLink).Assembly);
            Expression<Func<RegistrationProgramCourseLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationProgramCourseLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}