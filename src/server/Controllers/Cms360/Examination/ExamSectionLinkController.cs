
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ExaminationExamSectionLinkController : Controller
    {
        private readonly IExaminationExamSectionLinkVMRepository repository;

        private readonly DbContextBase db;
         private readonly IUserLogService log;

        public ExaminationExamSectionLinkController(IExaminationExamSectionLinkVMRepository repository,IUserLogService log, DbContextBase db)
        {
            this.repository = repository;
            this.db=db;
            this.log = log;
        }

        [HttpGet]
        [Route("[action]")]
        public  IActionResult GetFindByVM()
        {
            return Ok (this.repository.All());
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetExamCourse([FromBody] Predicate predicate)
        // {
        //     var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //     // var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
        //     var classId = new Guid(predicate.ProvidedString.Split("?")[1]);



        //     return Ok(db.ExamCourseVM.Where(s => s.CampusProgramId == campusProgramId && s.ClassId == classId));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetExamData([FromBody] Predicate predicate)
        // {
        //     var sectioncourseid = new Guid(predicate.ProvidedString);
        //     // var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
        //     //var classId = new Guid(predicate.ProvidedString.Split("?")[1]);



        //     return Ok(db.ExamDataVM.Where(s => s.SectionCourseId == sectioncourseid));
        // }

        // private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        // {
        //     return x => f(x);
        // }

        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAll()
        // {
        //     return Ok(this.VMrepository.FindBy(e => e.StatusId != 2));
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
        //     var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //     Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.Single(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //     Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.SingleAsync(discountFilterExpression));
        // }

        

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //     Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.FindByAsync(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult AddOne([FromBody]ExaminationExamDetail entity)
        // {
        //     return Ok(this.repository.Add(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> AddOneAsync([FromBody]ExaminationExamDetail entity)
        // {
        //     return Ok(await this.repository.AddAsync(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult AddMany([FromBody]IEnumerable<ExaminationExamDetail> entities)
        // {
        //     return Ok(this.repository.AddAll(entities));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<ExaminationExamDetail> entities)
        // {
        //     return Ok(await this.repository.AddAllAsync(entities));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult Update([FromBody]ExaminationExamDetail entity)
        // {
        //     return Ok(this.repository.Update(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> UpdateAsync([FromBody]ExaminationExamDetail entity)
        // {
        //     return Ok(await this.repository.UpdateAsync(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult Delete([FromBody]ExaminationExamDetail entity)
        // {
        //     return Ok(this.repository.Delete(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteAsync([FromBody]ExaminationExamDetail entity)
        // {
        //     return Ok(await this.repository.DeleteAsync(entity));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //     Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.DeleteWhere(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //     Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        // }
    }
}