
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Dapper;

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
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class SurveyDetailController : Controller
    {
        private readonly IDashboardSurveyDetailRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;

        public SurveyDetailController(IDashboardSurveyDetailRepository repository, DbContextBase db, IUserLogService log, IDomainContextResolver Resolver)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;
            this.Resolver = Resolver;

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
            var options = ScriptOptions.Default.AddReferences(typeof(SurveyDetail).Assembly);
            Expression<Func<SurveyDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SurveyDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SurveyDetail).Assembly);
            Expression<Func<SurveyDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SurveyDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllActiveAsync()
        {
            return Ok(await this.repository.FindByAsync(e => e.StatusId != 2));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllSurveyDetail()
        {

            return Ok(this.db.SurveyDetailVM.FromSql(String.Format("Select * from \"Dashboard\".\"SurveyDetailVM\" Where \"StatusId\"!=2")));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEvalutionDetail([FromBody] Predicate predicate)
        {
            var surveyid = new Guid(predicate.ProvidedString);

            string json = String.Format(@"SELECT * from ""Dashboard"".""GetSurveyDetail"" ('{0}')", surveyid);

            Console.WriteLine(json);

            return Ok(this.db.SurveyDetail2.FromSql(json));
        }



        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SurveyDetail).Assembly);
            Expression<Func<SurveyDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SurveyDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertSurveyDetail([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var detaillist = (predicate.ProvidedString.Split("$")[0]);
                var ope = Convert.ToInt32(predicate.ProvidedString.Split("$")[1]);
                var Data = this.log.GetLog();

                string json = String.Format("SELECT \"Dashboard\".\"InsertSurveyDetail\"('{0}','{1}',{2}) as ProvidedString", detaillist, Data, ope);
                Console.WriteLine(json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                obj.ProvidedString = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;

                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }

                return Ok(obj.ProvidedString);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertEvaluationData([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var detaillist = (predicate.ProvidedString.Split("$")[0]);
                var master = (predicate.ProvidedString.Split("$")[1]);
                var ope = Convert.ToInt32(predicate.ProvidedString.Split("$")[2]);
                var Data = this.log.GetLog();

                string json = String.Format("SELECT \"HumanResource\".\"InsertEvaluationData\"('{0}','{1}','{2}',{3}) as ProvidedString", master, detaillist, Data, ope);
                Console.WriteLine(json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                obj.ProvidedString = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;

                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }

                return Ok(obj.ProvidedString);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertNotification([FromBody] Predicate predicate)
        {


            var obj = new Predicate() { ProvidedString = "" };

            IDbConnection connection = db.Database.GetDbConnection();
            var detaillist = predicate.ProvidedString;

            var Data = this.log.GetLog();
            string json = String.Format("SELECT \"HumanResource\".\"InsertNotification\"({0},'{1}','{2}') as ProvidedString", DomainContext.User.UserId, detaillist, Data);
            Console.WriteLine(json);

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ProvidedString = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj.ProvidedString);



        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SurveyDetail).Assembly);
            Expression<Func<SurveyDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SurveyDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] SurveyDetail entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Setup.Medium"));
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
        public async Task<IActionResult> AddOneAsync([FromBody] SurveyDetail entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<SurveyDetail> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<SurveyDetail> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] SurveyDetail entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] SurveyDetail entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] SurveyDetail entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] SurveyDetail entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Setup.Medium"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SurveyDetail).Assembly);
            Expression<Func<SurveyDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SurveyDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(SurveyDetail).Assembly);
            Expression<Func<SurveyDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<SurveyDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}