
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
using System.Data;
using Dapper;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class BoardProgramCampusController : Controller
    {
        private readonly IBoardProgramCampusRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        public BoardProgramCampusController(IUserLogService log, IBoardProgramCampusRepository repository, DbContextBase db)
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]BoardProgramCampus entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Board.BoardProgramCampus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]BoardProgramCampus entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Board.BoardProgramCampus"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]BoardProgramCampus entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Board.BoardProgramCampus"));
        }
         [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByEx([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardProgramCampus).Assembly);
            Expression<Func<BoardProgramCampus, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardProgramCampus, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindBy([FromBody]Predicate predicate)
        {
            try
            {
                var programId = new Guid(predicate.ProvidedString);
                return Ok(this.db.VWProgramCampus.Where(s => s.ProgramId == programId && s.StatusId==1));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN BoardProgramCampus Controller.BoardProgramCampus()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }
        }
    }
}