
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupExtraCourseController : Controller
    {
        private readonly ISetupExtraCourseRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public SetupExtraCourseController(ISetupExtraCourseRepository repository, DbContextBase db, IUserLogService log)
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
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupExtraCourse).Assembly);
            Expression<Func<SetupExtraCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupExtraCourse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupExtraCourse).Assembly);
            Expression<Func<SetupExtraCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupExtraCourse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupExtraCourse).Assembly);
            Expression<Func<SetupExtraCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupExtraCourse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate predicate)
        {
            var sessionid =  new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusid =  new Guid(predicate.ProvidedString.Split("?")[1]);

            return Ok(db.SetupExtraCourseVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupExtraCourse).Assembly);
            Expression<Func<SetupExtraCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupExtraCourse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SetupExtraCourse entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.InstitutionType"));
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
        public async Task<IActionResult> AddOneAsync([FromBody] SetupExtraCourse entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.InstitutionType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<SetupExtraCourse> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.InstitutionType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<SetupExtraCourse> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.InstitutionType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] SetupExtraCourse entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.InstitutionType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] SetupExtraCourse entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.InstitutionType"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] SetupExtraCourse entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.InstitutionType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] SetupExtraCourse entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.InstitutionType"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupExtraCourse).Assembly);
            Expression<Func<SetupExtraCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupExtraCourse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupExtraCourse).Assembly);
            Expression<Func<SetupExtraCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupExtraCourse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}