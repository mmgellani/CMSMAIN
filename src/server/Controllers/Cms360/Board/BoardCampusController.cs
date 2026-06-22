
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

using Newtonsoft.Json;
using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class BoardBoardCampusController : Controller
    {
        private readonly IBoardBoardCampusRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        public BoardBoardCampusController(IUserLogService log, IBoardBoardCampusRepository repository, DbContextBase db)
        {
            this.repository = repository;
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
            return Ok(this.repository.All());
        }

        // [HttpGet]
        // [Route("[action]")]
        // public async Task<IActionResult> GetAllAsync()
        // {
        //     return Ok(await this.repository.AllAsync());
        // }

        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAllVM()
        // {
        //     return Ok(db.SetupZoneCityLinkVM.Where(r => r.StatusId == 1));
        // }

        // Get View without campusid and campus name
        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAllVMSM()
        // {
        //     return Ok(db.ZoneCityVM.Where(r => r.StatusId == 1));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public  IActionResult GetFindByVM([FromBody] Predicate model)
        // {
        //      var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var campusid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var programid = new Guid(model.ProvidedString.Split("?")[1]);
        //     var shiftid = new Guid(model.ProvidedString.Split("?")[2]);
        //     var zoneid=
        //     return Ok(db.SetupZoneCityLinkVM.Where(r=>r.StatusId==1));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetAllVMByZone([FromBody] Predicate model)
        // {
        //     var zoneid = new Guid(model.ProvidedString);
        //     return Ok(db.SetupZoneCityLinkVM.Where(r => r.ZoneId == zoneid && r.StatusId != 2));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SetupZoneCityLink).Assembly);
        //     Expression<Func<SetupZoneCityLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupZoneCityLink, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.Single(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SetupZoneCityLink).Assembly);
        //     Expression<Func<SetupZoneCityLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupZoneCityLink, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.SingleAsync(discountFilterExpression));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindBy([FromBody]Predicate predicate)
        {
            try
            {
                var BoardId = new Guid(predicate.ProvidedString);
                return Ok(this.db.BoardBoardCampus.Where(s => s.BoardId == BoardId && s.StatusId != 2));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.BoardBoardCampus()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardCampus([FromBody]Predicate predicate)
        {
            try
            {
                return Ok(this.db.BoardBoardCampus.Where(s => s.StatusId == 1));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.BoardBoardCampus()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }
        }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SetupZoneCityLink).Assembly);
        //     Expression<Func<SetupZoneCityLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupZoneCityLink, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.FindByAsync(discountFilterExpression));
        // }



        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]BoardBoardCampus entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Board.BoardBoardCampus"));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> AddOneAsync([FromBody]SetupZoneCityLink entity)
        // {
        //     await this.repository.AddAsync(entity);
        //     return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.ZoneCityLink"));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult AddMany([FromBody]IEnumerable<SetupZoneCityLink> entities)
        // {
        //     this.repository.AddAll(entities);
        //     return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.ZoneCityLink"));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SetupZoneCityLink> entities)
        // {
        //     await this.repository.AddAllAsync(entities);
        //     return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.ZoneCityLink"));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]BoardBoardCampus entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Board.BoardBoardCampus"));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> UpdateAsync([FromBody]SetupZoneCityLink entity)
        // {
        //     await this.repository.UpdateAsync(entity);
        //     return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.ZoneCityLink"));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]BoardBoardCampus entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Board.BoardBoardCampus"));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteAsync([FromBody]SetupZoneCityLink entity)
        // {
        //     await this.repository.DeleteAsync(entity);
        //     return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.ZoneCityLink"));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SetupZoneCityLink).Assembly);
        //     Expression<Func<SetupZoneCityLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupZoneCityLink, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.DeleteWhere(discountFilterExpression));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(SetupZoneCityLink).Assembly);
        //     Expression<Func<SetupZoneCityLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupZoneCityLink, bool>>(predicate.ProvidedString, options));

        //     return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        // }
    }
}