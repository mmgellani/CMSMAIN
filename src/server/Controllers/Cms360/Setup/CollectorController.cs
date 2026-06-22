/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server;
using Cms360.Server.Model;
using Cms360.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SetupCollectorController : Controller
    {
        private readonly ISetupCollectorRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public SetupCollectorController(ISetupCollectorRepository repository, DbContextBase db, IUserLogService log)
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
            try
            {
                return Ok(this.repository.All());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.GetAll, " + err.Message;
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
                app.Message = "Error on CollectorController.GetAllAsync, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject (model);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCollector).Assembly);
                Expression<Func<SetupCollector, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCollector, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.Single(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.GetSingle, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCollector).Assembly);
                Expression<Func<SetupCollector, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCollector, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.SingleAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.GetSingleAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            try
            {
                // Console.WriteLine("+++++++++++++++++++++++++++++++++++++");
                // Console.WriteLine(predicate.ProvidedString);
                // Console.WriteLine("+++++++++++++++++++++++++++++++++++++");
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCollector).Assembly);
                Expression<Func<SetupCollector, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCollector, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.FindBy(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.GetFindBy, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCollector).Assembly);
                Expression<Func<SetupCollector, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCollector, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.FindByAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.GetFindByAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SetupCollector entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.AddOne, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] SetupCollector entity)
        {
            try
            {
                await this.repository.AddAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.AddOneAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<SetupCollector> entities)
        {
            try
            {
                this.repository.AddAll(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.AddMany, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<SetupCollector> entities)
        {
            try
            {
                await this.repository.AddAllAsync(entities);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.AddManyAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entities);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] SetupCollector entity)
        {
            try
            {
                this.repository.Update(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.Update, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] SetupCollector entity)
        {
            try
            {
                await this.repository.UpdateAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.UpdateAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] SetupCollector entity)
        {
            try
            {
                this.repository.Delete(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.Delete, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] SetupCollector entity)
        {
            try
            {
                await this.repository.DeleteAsync(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Collector"));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.DeleteAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCollector).Assembly);
                Expression<Func<SetupCollector, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCollector, bool>>(predicate.ProvidedString, options));

                return Ok(this.repository.DeleteWhere(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.DeleteWhere, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            try
            {
                var options = ScriptOptions.Default.AddReferences(typeof(SetupCollector).Assembly);
                Expression<Func<SetupCollector, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SetupCollector, bool>>(predicate.ProvidedString, options));

                return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CollectorController.DeleteWhereAsync, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.AppException.Add(app);
                await (this.db.SaveChangesAsync());
                return BadRequest(app.Message);
            }
        }
    }
}