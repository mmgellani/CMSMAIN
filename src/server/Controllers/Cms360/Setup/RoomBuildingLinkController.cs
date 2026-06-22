
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupRoomBuildingLinkController : Controller
    {
        private readonly ISetupRoomBuildingLinkRepository repository;

        private readonly ISetupRoomVMRepository repo;


        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public SetupRoomBuildingLinkController(ISetupRoomBuildingLinkRepository repository, DbContextBase db, ISetupRoomVMRepository repo, IUserLogService log)
        {
            this.repository = repository;
            this.db = db;
            this.repo = repo;
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
        public IActionResult GetAllVM()
        {
            return Ok(this.db.SetupRoomTypeBuildingVM);
        }

          [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllRoomBuildingLink([FromBody] Predicate predicate)
        {
            string sql = String.Format(@"select * from ""Setup"".""VWRoomBuildingLink"" Where ""CampusId""='{0}' ",predicate.ProvidedString);
            return Ok(this.db.RoomBuildingLinkVM.FromSql(sql));
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
            var options = ScriptOptions.Default.AddReferences(typeof(SetupRoomBuildingLink).Assembly);
            Expression<Func<SetupRoomBuildingLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupRoomBuildingLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupRoomBuildingLink).Assembly);
            Expression<Func<SetupRoomBuildingLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupRoomBuildingLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupRoomTypeBuildingVM).Assembly);
            Expression<Func<SetupRoomTypeBuildingVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupRoomTypeBuildingVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.repo.FindBy(discountFilterExpression));
        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetRoomfromSection([FromBody]Predicate predicate)
        {
           
            var sectionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"select * from  ""Setup"".""GetRoomfromSection""('{0}','{1}')", sectionid,campusprogramid);

            return Ok( this.db.SetupSectionCourseLink2.FromSql(sql));
        }
  [HttpPost]
        [Route("[action]")]
        public IActionResult GetRoomforedit([FromBody]Predicate predicate)
        {
           
            //var sectionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"select * from  ""Setup"".""CampusBuildingMap""('{0}')",campusprogramid);

            return Ok( this.db.SetupSectionCourseLink2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupRoomBuildingLink).Assembly);
            Expression<Func<SetupRoomBuildingLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupRoomBuildingLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]SetupRoomBuildingLink entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Setup.RoomBuildingLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]SetupRoomBuildingLink entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Setup.RoomBuildingLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<SetupRoomBuildingLink> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Setup.RoomBuildingLink"));
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SetupRoomBuildingLink> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Setup.RoomBuildingLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]SetupRoomBuildingLink entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Setup.RoomBuildingLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]SetupRoomBuildingLink entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Setup.RoomBuildingLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]SetupRoomBuildingLink entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Setup.RoomBuildingLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]SetupRoomBuildingLink entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Setup.RoomBuildingLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupRoomBuildingLink).Assembly);
            Expression<Func<SetupRoomBuildingLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupRoomBuildingLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupRoomBuildingLink).Assembly);
            Expression<Func<SetupRoomBuildingLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupRoomBuildingLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}