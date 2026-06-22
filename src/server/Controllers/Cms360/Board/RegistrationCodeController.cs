
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
    public class RegistrationCodeController : Controller
    {
        private readonly IBoardRegistrationCodeRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        public RegistrationCodeController(IUserLogService log, IBoardRegistrationCodeRepository repository, DbContextBase db)
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
            var options = ScriptOptions.Default.AddReferences(typeof(BoardRegistrationCode).Assembly);
            Expression<Func<BoardRegistrationCode, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardRegistrationCode, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardRegistrationCode).Assembly);
            Expression<Func<BoardRegistrationCode, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardRegistrationCode, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindBy([FromBody]Predicate predicate)
        {
            try
            {
                var programid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var boardid = new Guid(predicate.ProvidedString.Split("?")[1]);
                return Ok(this.db.BoardRegistrationCode.Where(s => s.StatusId != 2 && s.ProgramId==programid && s.BoardId==boardid));
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
        public IActionResult GetFindByPg([FromBody]Predicate predicate)
        {
            try
            {
                var programid = new Guid(predicate.ProvidedString);
                return Ok(this.db.BoardRegistrationCode.Where(s => s.StatusId ==1 && s.ProgramId==programid));
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
        public IActionResult GetFindByVM([FromBody]Predicate predicate)
        {
            try
            {
                var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
                var programdetailid = new Guid(predicate.ProvidedString.Split("?")[2]);
                var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
                var sectionid = new Guid(predicate.ProvidedString.Split("?")[4]);

                return Ok(this.db.BoardVWCampusStudentLink.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId ==  programdetailid && s.ClassId == classid && s.SectionId == sectionid && s.StatusId != 2));
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
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardRegistrationCode).Assembly);
            Expression<Func<BoardRegistrationCode, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardRegistrationCode, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]BoardRegistrationCode entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Board.BoardRegistrationCode"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]BoardRegistrationCode entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Board.BoardRegistrationCode"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]Predicate predicate)
        {
            var query = String.Format(@"SELECT * FROM ""Board"".""campusStudent""('{0}')", predicate.ProvidedString);
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
        public IActionResult AddBulk([FromBody]Predicate predicate)
        {
            
            var query = String.Format(@"SELECT * FROM ""Board"".""AddBulkBoardFee""('{0}')", predicate.ProvidedString);
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
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<BoardRegistrationCode> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Board.BoardRegistrationCode"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]BoardRegistrationCode entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Board.BoardRegistrationCode"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]BoardRegistrationCode entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Board.BoardRegistrationCode"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]BoardRegistrationCode entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Board.BoardRegistrationCode"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]BoardRegistrationCode entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Board.BoardRegistrationCode"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardRegistrationCode).Assembly);
            Expression<Func<BoardRegistrationCode, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardRegistrationCode, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardRegistrationCode).Assembly);
            Expression<Func<BoardRegistrationCode, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardRegistrationCode, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}