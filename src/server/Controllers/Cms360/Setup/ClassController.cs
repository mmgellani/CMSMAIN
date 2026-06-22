
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
using Cms360.Contract;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupClassController : Controller
    {
        private readonly ISetupClassRepository repository;
        private readonly DbContextBase db;

        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly IUserLogService log;

        public SetupClassController(ISetupClassRepository repository, DbContextBase db, IDomainContextResolver Resolver, IUserLogService log)
        {
            this.repository = repository;
            this.db = db;
            this.Resolver = Resolver;
            this.log = log;

        }
        protected IDomainContext DomainContext
        {
            get
            {
                if (this.domainContext == null)
                    this.domainContext = this.Resolver.Resolve();

                return this.domainContext;
            }
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            try
            {
                return Ok(this.repository.All());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.GetAll, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject (model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                return Ok(await this.repository.AllAsync());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.GetAllAsync, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject (model);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupClass).Assembly);
                Expression<Func<SetupClass, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupClass, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.Single(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.GetSingle, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupClass).Assembly);
                Expression<Func<SetupClass, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupClass, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.SingleAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.GetSingleAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByEx([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SetupClass).Assembly);
            Expression<Func<SetupClass, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupClass, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupClass).Assembly);
                Expression<Func<SetupClass, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupClass, bool>>(predicate.ProvidedString, options));

                List<SetupClass> result = new List<SetupClass>();

                result.AddRange(this.db.SetupClass.FromSql(String.Format(ClassQuery, DomainContext.User.UserId)).ToList<SetupClass>());
                if (result.Count > 0)
                    return Ok(result);
                else
                    return Ok(this.repository.FindBy(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.GetFindBy, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupClass).Assembly);
                Expression<Func<SetupClass, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupClass, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.FindByAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.GetFindByAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]SetupClass entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.AddOne, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]SetupClass entity)
        {
            try
            {
                await this.repository.AddAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.AddOneAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<SetupClass> entities)
        {
            try
            {
                this.repository.AddAll(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.AddMany, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SetupClass> entities)
        {
            try
            {
                await this.repository.AddAllAsync(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.AddManyAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]SetupClass entity)
        {
            try
            {
                this.repository.Update(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.Update, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]SetupClass entity)
        {
            try
            {
                await this.repository.UpdateAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.UpdateAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]SetupClass entity)
        {
            try
            {
                this.repository.Delete(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.Delete, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]SetupClass entity)
        {
            try
            {
                await this.repository.DeleteAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Class"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.DeleteAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupClass).Assembly);
                Expression<Func<SetupClass, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupClass, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.DeleteWhere(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.DeleteWhere, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupClass).Assembly);
                Expression<Func<SetupClass, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupClass, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ClassController.DeleteWhereAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        private const string ClassQuery = @"SELECT
""Setup"".""Class"".""ClassId"",
""Setup"".""Class"".""FullName"",
""Setup"".""Class"".""Description"",
""Setup"".""Class"".""ClassCode"",
""Setup"".""Class"".""IsAdmissionTest"",
""Setup"".""Class"".""IsInterview"",
""Setup"".""Class"".""StatusId"",
""Setup"".""Class"".""LoggerId""
FROM
""Setup"".""Class""
WHERE
""Setup"".""Class"".""ClassId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0} 
	))"
     ;
    }
}