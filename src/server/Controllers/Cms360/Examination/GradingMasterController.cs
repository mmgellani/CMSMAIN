
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ExaminationGradingMasterController : Controller
    {
        private readonly IExaminationGradingMasterRepository repository;
        private readonly IExaminationGradingCriteriaVMRepository repo;

        private readonly DbContextBase db;

        public ExaminationGradingMasterController(IExaminationGradingMasterRepository repository, IExaminationGradingCriteriaVMRepository repo, DbContextBase db)
        {
            this.repository = repository;
            this.db = db;
            this.repo = repo;
        }

    private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }


        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFindByVM()
        {
            return Ok(this.repo.All());
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBY([FromBody]Predicate predicate)
        {
            // return Ok(this.db.ExaminationGradingMaster.Where(s => s.StatusId != 2));
            var options = ScriptOptions.Default.AddReferences(typeof(ExaminationGradingMaster).Assembly);
            Expression<Func<ExaminationGradingMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationGradingMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

     

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]ExaminationGradingMaster entity)
        {
            return Ok(this.repository.Add(entity));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]ExaminationGradingMaster entity)
        {
            return Ok(this.repository.Update(entity));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]ExaminationGradingMaster entity)
        {
            return Ok(this.repository.Delete(entity));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddBulk([FromBody] Predicate predicate)
        {
            var gradingMaster = predicate.ProvidedString.Split("?")[0];
            var gradingDetail = predicate.ProvidedString.Split("?")[1];
            var query = String.Format(@"select * from ""Examination"".""AddBulkGradingMaster""('{0}','{1}')", gradingMaster, gradingDetail);
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
        public IActionResult EditBulkCriteria([FromBody] Predicate predicate)
        {
            var Masterjson = predicate.ProvidedString.Split("?")[0];
            var Detailjson = predicate.ProvidedString.Split("?")[1];
            var NewDetailjson = predicate.ProvidedString.Split("?")[2];


            var query = String.Format(@"Select * from ""Examination"".""EditGradingPolicy""('{0}','{1}','{2}')", Masterjson, Detailjson, NewDetailjson);
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
            return Ok();

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetGradingMasterDetail()
        {
            return Ok(this.db.GradingMasterDetailData.FromSql(String.Format("select * from \"Examination\".\"GradingMasterData\"()")));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetGradingMasterDetailEx()
        {
            return Ok(this.db.GradingMasterDetailData.FromSql(String.Format("select * from \"Examination\".\"GradingMasterDataEx\"()")));
        }




        //     [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult GetExamCourse([FromBody] Predicate predicate)
        //     {
        //         var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //         // var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
        //         var classId = new Guid(predicate.ProvidedString.Split("?")[1]);



        //         return Ok(db.ExamCourseVM.Where(s => s.CampusProgramId == campusProgramId && s.ClassId == classId));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult GetExamData([FromBody] Predicate predicate)
        //     {
        //         var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //         var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
        //         var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
        //         var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
        //         var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);
        //         var courseId = new Guid(predicate.ProvidedString.Split("?")[5]);



        //         return Ok(db.ExamBulkVM.Where(e => e.SessionId== sessionId && e.CampusId == campusId && e.ProgramDetailId == programDetailId && e.ClassId == classId && e.SectionId == sectionId && e.CourseId == courseId && e.StatusId == 1));
        //     }
        //     [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult CheckClash([FromBody] Predicate model)
        //     {


        //         var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
        //         var campusProgramId = new Guid(model.ProvidedString.Split("?")[1]);
        //         var classId = new string(model.ProvidedString.Split("?")[2]);
        //         var SectionId = new Guid(model.ProvidedString.Split("?")[3]);
        //         var courseId = new Guid(model.ProvidedString.Split("?")[4]);
        //         var examTypeId = new Guid(model.ProvidedString.Split("?")[5]);
        //         var dated = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);


        //         var z = this.db.IntModel.FromSql(String.Format("SELECT \"Examination\".\"val\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionId, campusProgramId, classId, SectionId, courseId, examTypeId, dated));

        //         return Ok(z);

        //     }

        //     private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        //     {
        //         return x => f(x);
        //     }

        //     [HttpGet]
        //     [Route("[action]")]
        //     public IActionResult GetAll()
        //     {
        //         return Ok(this.VMrepository.FindBy(e => e.StatusId != 2));
        //     }

        //     [HttpGet]
        //     [Route("[action]")]
        //     public async Task<IActionResult> GetAllAsync()
        //     {
        //         return Ok(await this.repository.AllAsync());
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        //     {
        //         var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //         Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //         return Ok(this.repository.Single(discountFilterExpression));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        //     {
        //         var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //         Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //         return Ok(await this.repository.SingleAsync(discountFilterExpression));
        //     }

        //     [HttpGet]
        //     [Route("[action]")]
        //     public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        //     {
        //         var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //         Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //         return Ok(this.repository.FindBy(discountFilterExpression));
        //     }
        //     [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult GetFindByVM([FromBody] Predicate predicate)
        //     {
        //         var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //         var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
        //         var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
        //         var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
        //         var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);
        //         var courseId = new Guid(predicate.ProvidedString.Split("?")[5]);



        //         return Ok(this.repo.FindBy(e => e.SessionId== sessionId && e.CampusId == campusId && e.ProgramDetailId == programDetailId && e.ClassId == classId && e.SectionId == sectionId && e.CourseId == courseId && e.StatusId == 1));
        //         // return Ok(this.repo.All());
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        //     {
        //         var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //         Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //         return Ok(await this.repository.FindByAsync(discountFilterExpression));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult AddOne([FromBody]ExaminationExamDetail entity)
        //     {
        //         return Ok(this.repository.Add(entity));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> AddOneAsync([FromBody]ExaminationExamDetail entity)
        //     {
        //         return Ok(await this.repository.AddAsync(entity));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult AddMany([FromBody]IEnumerable<ExaminationExamDetail> entities)
        //     {
        //         return Ok(this.repository.AddAll(entities));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<ExaminationExamDetail> entities)
        //     {
        //         return Ok(await this.repository.AddAllAsync(entities));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> UpdateAsync([FromBody]ExaminationExamDetail entity)
        //     {
        //         return Ok(await this.repository.UpdateAsync(entity));
        //     }
        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> DeleteAsync([FromBody]ExaminationExamDetail entity)
        //     {
        //         return Ok(await this.repository.DeleteAsync(entity));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        //     {
        //         var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //         Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //         return Ok(this.repository.DeleteWhere(discountFilterExpression));
        //     }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        //     {
        //         var options = ScriptOptions.Default.AddReferences(typeof(ExaminationExamDetail).Assembly);
        //         Expression<Func<ExaminationExamDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ExaminationExamDetail, bool>>(predicate.ProvidedString, options));

        //         return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        //     }
    }
}