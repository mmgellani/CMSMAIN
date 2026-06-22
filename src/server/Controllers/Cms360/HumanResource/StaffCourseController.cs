using System.Runtime.CompilerServices;
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class StaffCourseController : Controller
    {
        private readonly IStaffCourseRepository repository;
        // private readonly IStaffCourseRepositoryVM repositoryVM;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        private ICryptoService crypto;

        public StaffCourseController(IUserLogService log, IStaffCourseRepository repository, ICryptoService crypto, DbContextBase db)
        {
            this.repository = repository;
            //this.repositoryVM = repositoryVM;
            this.crypto = crypto;
            this.log = log;
            this.db = db;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate model)
        {
            var staffId = new Guid(model.ProvidedString);
            return Ok(this.db.StaffCourseVM.Where(s => s.StaffId == staffId && s.StatusId !=2));
        }




        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.repository.All());
        }



        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult GetAllVM ([FromBody] Predicate predicate) {
        //     var id = Convert.ToInt32 (predicate.ProvidedString);
        //     return Ok (this.repositoryVM.FindBy (s => s.UserId == id));
        // }

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
            var options = ScriptOptions.Default.AddReferences(typeof(StaffCourse).Assembly);
            Expression<Func<StaffCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StaffCourse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StaffCourse).Assembly);
            Expression<Func<StaffCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StaffCourse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StaffCourse).Assembly);
            Expression<Func<StaffCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StaffCourse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult GetStaff ([FromBody] Predicate model) {
        //     return Ok (this.repository.FindBy (s => s.CityId == new Guid (model.ProvidedString) && s.StatusId == 1));
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StaffCourse).Assembly);
            Expression<Func<StaffCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StaffCourse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }
         

          [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]StaffCourse entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] StaffCourse entity)
        {

            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<StaffCourse> entities)
        {

            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<StaffCourse> entities)
        {

            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] StaffCourse entity)
        {

            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] StaffCourse entity)
        {

            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] StaffCourse entity)
        {

            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] StaffCourse entity)
        {

            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "HumanResource.StaffCourse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StaffCourse).Assembly);
            Expression<Func<StaffCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StaffCourse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StaffCourse).Assembly);
            Expression<Func<StaffCourse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StaffCourse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}