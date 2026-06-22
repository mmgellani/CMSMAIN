
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
using MailKit.Net.Smtp;
using MimeKit;
using Hangfire;
using Hangfire.MemoryStorage;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AssessmentSchedulingDetailController : Controller
    {
        private readonly IAssessmentSchedulingRepository repository;
        private readonly IUserLogService log;
        private readonly DbContextBase db;

        public AssessmentSchedulingDetailController(IAssessmentSchedulingRepository repository,DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
            this.log = log;
            this.db=db;

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
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedulingDetail).Assembly);
            Expression<Func<AssessmentSchedulingDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedulingDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllActiveAsync()
        {
            return Ok(await this.repository.FindByAsync(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedulingDetail).Assembly);
            Expression<Func<AssessmentSchedulingDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedulingDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedulingDetail).Assembly);
            Expression<Func<AssessmentSchedulingDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedulingDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedulingDetail).Assembly);
            Expression<Func<AssessmentSchedulingDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedulingDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]AssessmentSchedulingDetail entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]AssessmentSchedulingDetail entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<AssessmentSchedulingDetail> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<AssessmentSchedulingDetail> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]AssessmentSchedulingDetail entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]AssessmentSchedulingDetail entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]AssessmentSchedulingDetail entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]AssessmentSchedulingDetail entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Setup.BloodGroup"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedulingDetail).Assembly);
            Expression<Func<AssessmentSchedulingDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedulingDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AssessmentSchedulingDetail).Assembly);
            Expression<Func<AssessmentSchedulingDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AssessmentSchedulingDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult AssessmentSchedulingList()
        {
            string json = String.Format(@"select * from ""Assessment"".""AssessmentSchedulingList""()");

            Console.WriteLine(json);
            return Ok(this.db.AssessmentSchedulingList.FromSql(json));
           
        }
         [HttpGet]
        [Route("[action]")]
        public IActionResult AssessmentSchedulingListData()
        {
            string json = String.Format(@"select * from ""Assessment"".""AssessmentSchedulingListData""()");

            Console.WriteLine(json);
            return Ok(this.db.AssessmentSchedulingList.FromSql(json));
           
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult AssessmentSchedulingData([FromBody]Predicate predicate)
        {
           var assessmentSchemeMasterId = new Guid(predicate.ProvidedString);
           string json = String.Format(@"select * from ""Assessment"".""AssessmentSchedulingData""('{0}')", assessmentSchemeMasterId);
            Console.WriteLine(json);
            return Ok(this.db.AssessmentScheduleData.FromSql(json));
           
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult EditAssessmentSchedulingData([FromBody]Predicate predicate)
        {
           var assessmentSchemeMasterId = new Guid(predicate.ProvidedString);
           string json = String.Format(@"select * from ""Assessment"".""EditAssessmentSchedulingData""('{0}')", assessmentSchemeMasterId);
            Console.WriteLine(json);
            return Ok(this.db.AssessmentScheduleData.FromSql(json));
           
        }
         [HttpGet]
        [Route("[action]")]
        public IActionResult MonthList()
        {
            string json = String.Format(@"select * from ""Assessment"".""MonthList""()");

            Console.WriteLine(json);
            return Ok(this.db.MonthList.FromSql(json));
           
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddAssessmentSchedulingData([FromBody]Predicate predicate)
        { 
            string json = String.Format(@"select * from ""Assessment"".""AddAssessmentSchedulingData""('{0}')", predicate.ProvidedString);
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
        public IActionResult UpdateAssessmentSchedulingData([FromBody]Predicate predicate)
        { 
           string json = String.Format(@"select * from ""Assessment"".""UpdateAssessmentSchedulingData""('{0}')", predicate.ProvidedString);
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
        public IActionResult DeleteAssessmentSchedulingData([FromBody]Predicate predicate)
        { 
           string json = String.Format(@"select * from ""Assessment"".""DeleteAssessmentSchedulingData""('{0}')", predicate.ProvidedString);
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
       
        
    }
}