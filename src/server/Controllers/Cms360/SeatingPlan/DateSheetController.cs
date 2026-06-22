
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
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SeatingPlanDateSheetController : Controller
    {
        private readonly ISeatingPlanDateSheetRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public SeatingPlanDateSheetController(ISeatingPlanDateSheetRepository repository, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;

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
        public IActionResult GetAllDateSheetVM()
        {
            string sql=String.Format(@"select * from   ""ExamSeatingPlan"".""VWDateSheet"" ");
            return Ok(this.db.SeatingPlanDateSheetVM.FromSql(sql));
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
            var options = ScriptOptions.Default.AddReferences(typeof(SeatingPlanDateSheet).Assembly);
            Expression<Func<SeatingPlanDateSheet, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SeatingPlanDateSheet, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SeatingPlanDateSheet).Assembly);
            Expression<Func<SeatingPlanDateSheet, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SeatingPlanDateSheet, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllActiveAsync()
        {
            return Ok(await this.repository.FindByAsync(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SeatingPlanDateSheet).Assembly);
            Expression<Func<SeatingPlanDateSheet, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SeatingPlanDateSheet, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM ([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            return Ok(this.db.SeatingPlanDateSheet.Where(s => s.CampusProgramId == campusProgramId && s.StatusId == 1));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SeatingPlanDateSheet).Assembly);
            Expression<Func<SeatingPlanDateSheet, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SeatingPlanDateSheet, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]SeatingPlanDateSheet entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "SeatingPlan.DateSheet"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ADDONE Controller.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]SeatingPlanDateSheet entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "SeatingPlan.DateSheet"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<SeatingPlanDateSheet> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "SeatingPlan.DateSheet"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SeatingPlanDateSheet> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "SeatingPlan.DateSheet"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]SeatingPlanDateSheet entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "SeatingPlan.DateSheet"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]SeatingPlanDateSheet entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "SeatingPlan.DateSheet"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]SeatingPlanDateSheet entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "SeatingPlan.DateSheet"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]SeatingPlanDateSheet entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "SeatingPlan.DateSheet"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SeatingPlanDateSheet).Assembly);
            Expression<Func<SeatingPlanDateSheet, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SeatingPlanDateSheet, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SeatingPlanDateSheet).Assembly);
            Expression<Func<SeatingPlanDateSheet, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SeatingPlanDateSheet, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulk([FromBody]Predicate predicate)
        {

            var json = predicate.ProvidedString.Split("?")[0];
            var dateSheetid = new Guid(predicate.ProvidedString.Split("?")[1]);

            var query = String.Format(@"SELECT * FROM ""ExamSeatingPlan"".""InsertSeatingPlanBulk""('{0}','{1}')", json, dateSheetid);
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
    }
}