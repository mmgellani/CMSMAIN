
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
using System.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [IgnoreAntiforgeryToken]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class UserMcqResponseController : Controller
    {
        private readonly IUserMcqResponseRepository repository;
        private readonly IMcqAttemptedRepository repo;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public UserMcqResponseController(IUserMcqResponseRepository repository, IMcqAttemptedRepository repo, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
            this.repo = repo;
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


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetMcqResponse([FromBody] Predicate model)
        {
            var userId = new Guid(model.ProvidedString.Split("?")[0]);
            //var topicIds = model.ProvidedString.Split("?")[1]
            //                 .Split(',')
            //                 .Select(id => $"'{id}'")
            //                 .ToArray();
            //var topicIdList = string.Join(", ", topicIds);

            var topicIds = model.ProvidedString.Split("?")[1];

            string sql = $"SELECT * FROM \"EL\".\"UserMcqResponse\" WHERE \"UserId\" = '{userId}' AND \"TopicId\" = '{topicIds}'";
            Console.WriteLine(sql);

            var res = db.UserMcqResponse.FromSql(sql).ToList();
            //var res1 = JsonConvert.DeserializeObject<UserMcqResponse>(res);
            return Ok(res);
            //var userId = new Guid(model.ProvidedString.Split("?")[0]);
            //var topicId = (model.ProvidedString.Split("?")[1]);
            //// string sql = String.Format("Select * from \"EL\".\"UserMcqResponse\" Where \"StatusId\"!=2 AND \"HolidayTypeId\"= '{0}'", holidayTypeId);
            //string sql = String.Format($"SELECT * FROM \"UserMcqResponse\" WHERE \"UserId\" = '{userId}' AND \"TopicId\" in ('{topicId}')");
            // Console.WriteLine(sql);
            //return Ok(db.UserMcqResponse.FromSql(sql));
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
            var options = ScriptOptions.Default.AddReferences(typeof(UserMcqResponse).Assembly);
            Expression<Func<UserMcqResponse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<UserMcqResponse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(UserMcqResponse).Assembly);
            Expression<Func<UserMcqResponse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<UserMcqResponse, bool>>(predicate.ProvidedString, options));

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
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(UserMcqResponse).Assembly);
            Expression<Func<UserMcqResponse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<UserMcqResponse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(UserMcqResponse).Assembly);
            Expression<Func<UserMcqResponse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<UserMcqResponse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] UserMcqResponse entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "EL.UserMcqResponse"));
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
        public async Task<IActionResult> AddOneAsync([FromBody] UserMcqResponse entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "EL.UserMcqResponse"));
        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        [HttpPost]
        public IActionResult InsertMCQResponse([FromBody] UserMcqResponse entity)
        {
            try
            {
                if ((null == entity) || (!ModelState.IsValid))
                {
                    Console.WriteLine("Null or Invalid Entity Object.");
                    return BadRequest();
                }

                entity.UserMcqResponseId = new Guid();
                this.repository.Add(entity);
                return new ObjectResult(entity);
            }
            catch { return BadRequest(); }
        }

        [Route("[action]")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult InsertMCQAttempted([FromBody] McqAttempted entity)
        {
            try
            {
                if ((null == entity) || (!ModelState.IsValid))
                {
                    Console.WriteLine("Null or Invalid Entity Object.");
                    return BadRequest();
                }

                entity.McqAttemptId = new Guid();
                entity.OperationOn = DateTime.Now;
                this.repo.Add(entity);
                return new ObjectResult(entity);
            }
            catch { return BadRequest(); }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<UserMcqResponse> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "EL.UserMcqResponse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<UserMcqResponse> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "EL.UserMcqResponse"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateEx([FromBody] UserMcqResponse entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "EL.UserMcqResponse"));
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("[action]")]
        public IActionResult Update([FromBody] UserMcqResponse incoming)
        {
            var dbEntity = db.UserMcqResponse.FirstOrDefault(e => e.UserMcqResponseId == incoming.UserMcqResponseId);
            // repository.FindById(incoming.UserMcqResponseId);

            if (dbEntity == null)
            {
                return NotFound("UserMcqResponse not found");
            }

            // Deserialize existing and incoming operations
            var existingOperations = string.IsNullOrEmpty(dbEntity.Operations)
                ? new List<McqOperation>()
                : JsonConvert.DeserializeObject<List<McqOperation>>(dbEntity.Operations);

            var incomingOperations = string.IsNullOrEmpty(incoming.Operations)
                ? new List<McqOperation>()
                : JsonConvert.DeserializeObject<List<McqOperation>>(incoming.Operations);

            // Merge logic
            foreach (var newOp in incomingOperations)
            {
                var existingOp = existingOperations.FirstOrDefault(o => o.QuestionId == newOp.QuestionId);
                if (existingOp != null)
                {
                    existingOp.Answer = newOp.Answer;
                    existingOp.AnswerId = newOp.AnswerId;
                    existingOp.IsPastPaper = newOp.IsPastPaper;
                }
                else
                {
                    existingOperations.Add(newOp);
                }
            }

            // Update the db entity
            var camelCaseSettings = new JsonSerializerSettings
            {
                ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver(),
                Formatting = Formatting.None
            };

            dbEntity.Operations = JsonConvert.SerializeObject(existingOperations, camelCaseSettings);
            dbEntity.StatusId = incoming.StatusId; // update other fields as needed

            repository.Update(dbEntity);

            // Log and return
            return Ok(log.Insert(JsonConvert.SerializeObject(dbEntity), "Update", "EL.UserMcqResponse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] UserMcqResponse entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "EL.UserMcqResponse"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] UserMcqResponse entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "EL.UserMcqResponse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] UserMcqResponse entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "EL.UserMcqResponse"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(UserMcqResponse).Assembly);
            Expression<Func<UserMcqResponse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<UserMcqResponse, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(UserMcqResponse).Assembly);
            Expression<Func<UserMcqResponse, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<UserMcqResponse, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}