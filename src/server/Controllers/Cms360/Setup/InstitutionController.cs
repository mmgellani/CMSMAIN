
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
using Microsoft.EntityFrameworkCore;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Newtonsoft.Json;
using Cms360.Data;



namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupInstitutionController : Controller
    {
        private readonly ISetupInstitutionRepository repository;
        private readonly ISetupInstitutionVMRepository VMrepository;

        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public SetupInstitutionController(ISetupInstitutionRepository repository, ISetupInstitutionVMRepository VMrepository, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
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
            try
            {
                return Ok(this.VMrepository.FindBy(e => e.StatusId != 2));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAll Controller.GetAll()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
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
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetAllAsync Controller.GetAllAsync()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupInstitution).Assembly);
                Expression<Func<SetupInstitution, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupInstitution, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.Single(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetSingle Controller.GetSingle()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupInstitution).Assembly);
                Expression<Func<SetupInstitution, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupInstitution, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.SingleAsync(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetSingleAsync Controller.GetSingleAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupInstitution).Assembly);
                Expression<Func<SetupInstitution, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupInstitution, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.FindBy(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetFindBy Controller.GetFindBy()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupInstitution).Assembly);
                Expression<Func<SetupInstitution, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupInstitution, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.FindByAsync(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN GetFindByAsync Controller.GetFindByAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]SetupInstitution entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ADDONE Controller.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]SetupInstitution entity)
        {
            try
            {
                await this.repository.AddAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ADDONE Controller.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<SetupInstitution> entities)
        {
            try
            {
                this.repository.AddAll(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ADDONE Controller.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<SetupInstitution> entities)
        {
            try
            {
                await this.repository.AddAllAsync(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN AddManyAsync Controller.AddManyAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]SetupInstitution entity)
        {
            try
            {
                this.repository.Update(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN Update Controller.Update()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]SetupInstitution entity)
        {
            try
            {
                await this.repository.UpdateAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN UpdateAsync Controller.UpdateAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]SetupInstitution entity)
        {
            try
            {
                this.repository.Delete(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN Delete Controller.Delete()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]SetupInstitution entity)
        {
            try
            {
                await this.repository.DeleteAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async","Setup.Institution"));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN DeleteAsync Controller.DeleteAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.Add(app);
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
                var options = ScriptOptions.Default.AddReferences(typeof(SetupInstitution).Assembly);
                Expression<Func<SetupInstitution, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupInstitution, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.DeleteWhere(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN DeleteWhere Controller.DeleteWhere()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
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
                var options = ScriptOptions.Default.AddReferences(typeof(SetupInstitution).Assembly);
                Expression<Func<SetupInstitution, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupInstitution, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN DeleteWhereAsync Controller.DeleteWhereAsync()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }
    }
}