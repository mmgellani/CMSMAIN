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

namespace Cms360.UI.Controllers.Account {
    [Route ("api/[controller]")]
    [ServiceFilter (typeof (Server.Filters.ApiResultFilter))]
    [ServiceFilter (typeof (Server.Filters.ApiExceptionFilter))]
    [ServiceFilter (typeof (Server.Filters.IdentityMappingFilter))]
    public class FeeCampusBankLinkController : Controller {
        private readonly IFeeCampusBankLinkRepository repository;
        private readonly IFeeCampusBankLinkVMRepository VMrepository;
        private readonly DbContextBase db;

        private readonly IUserLogService log;
        public FeeCampusBankLinkController (IFeeCampusBankLinkRepository repository, IFeeCampusBankLinkVMRepository VMrepository, IUserLogService log, DbContextBase db) {
            this.repository = repository;
            this.VMrepository = VMrepository;
            this.log = log;
            this.db = db;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T> (Func<T, bool> f) {
            return x => f (x);
        }

        [HttpGet]
        [Route ("[action]")]
        public IActionResult GetAll () {
            return Ok (this.VMrepository.FindBy (e => e.StatusId != 2));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetByCampus ([FromBody] Predicate predicate) {
 
            return Ok (this.db.FeeCampusBankAccountVM.Where (e => e.StatusId == 1 && e.CampusId == new Guid (predicate.ProvidedString)));

            //return Ok (this.VMrepository.FindBy (e => e.StatusId == 1 && e.CampusId == new Guid (predicate.ProvidedString)));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetBank ([FromBody] Predicate model) {
            var campusId = new Guid (model.ProvidedString.Split ("?") [0]);
            var programDetailId = new Guid (model.ProvidedString.Split ("?") [1]);
            return Ok (this.db.CampusBank.Where (e => e.StatusId == 1 && e.CampusId == campusId && e.ProgramDetailId == programDetailId));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetBankEx ([FromBody] Predicate model) {
            var campusId = new Guid (model.ProvidedString.Split ("?") [0]);
            var programDetailId = new Guid (model.ProvidedString.Split ("?") [1]);
            var admissionFormId = new Guid (model.ProvidedString.Split ("?") [2]);

            string sql = String.Format (@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", campusId, programDetailId, admissionFormId);

            return Ok (this.db.CampusBank.FromSql (sql));

            // return Ok(this.db.CampusBank.Where(e => e.StatusId == 1 && e.CampusId == campusId && e.ProgramDetailId == programDetailId));
        }

          [HttpPost]
        [Route ("[action]")]
        public IActionResult GetBankAll ([FromBody] Predicate model) {
            var campusId = new Guid (model.ProvidedString.Split ("?") [0]);
            var programDetailId = new Guid (model.ProvidedString.Split ("?") [1]);
            var admissionFormId = new Guid (model.ProvidedString.Split ("?") [2]);

            string sql = String.Format (@"Select * from ""Fee"".""GetBankAll""('{0}','{1}','{2}')", campusId, programDetailId, admissionFormId);

            return Ok (this.db.CampusBank.FromSql (sql));

            // return Ok(this.db.CampusBank.Where(e => e.StatusId == 1 && e.CampusId == campusId && e.ProgramDetailId == programDetailId));
        }

        [HttpGet]
        [Route ("[action]")]
        public async Task<IActionResult> GetAllAsync () {
            return Ok (await this.repository.AllAsync ());
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetSingle ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (FeeCampusBankLink).Assembly);
            Expression<Func<FeeCampusBankLink, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<FeeCampusBankLink, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.Single (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetSingleAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (FeeCampusBankLink).Assembly);
            Expression<Func<FeeCampusBankLink, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<FeeCampusBankLink, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.SingleAsync (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetFindBy ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (FeeCampusBankLink).Assembly);
            Expression<Func<FeeCampusBankLink, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<FeeCampusBankLink, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.FindBy (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetFindByAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (FeeCampusBankLink).Assembly);
            Expression<Func<FeeCampusBankLink, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<FeeCampusBankLink, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.FindByAsync (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult AddOne ([FromBody] Predicate predicate) {
            var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
                var list = (predicate.ProvidedString);

                string json = String.Format ("SELECT \"Fee\".\"InsertCampusBankLink\"('{0}') as ProvidedString", list);
                // Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);

            } catch (Exception ex) {
                return BadRequest (ex.Message);

            }

            // this.repository.Add(entity);
            // return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> AddOneAsync ([FromBody] FeeCampusBankLink entity) {
            await this.repository.AddAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Insert Async", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult AddMany ([FromBody] IEnumerable<FeeCampusBankLink> entities) {
            this.repository.AddAll (entities);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entities), "Insert Multi", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> AddManyAsync ([FromBody] IEnumerable<FeeCampusBankLink> entities) {
            await this.repository.AddAllAsync (entities);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entities), "Insert Multi Async", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult Update ([FromBody] FeeCampusBankLink entity) {
            this.repository.Update (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Update", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> UpdateAsync ([FromBody] FeeCampusBankLink entity) {
            await this.repository.UpdateAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Update Async", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult Delete ([FromBody] FeeCampusBankLink entity) {
            this.repository.Delete (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Delete", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteAsync ([FromBody] FeeCampusBankLink entity) {
            await this.repository.DeleteAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Delete Async", "Fee.CampusBankLink"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteWhere ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (FeeCampusBankLink).Assembly);
            Expression<Func<FeeCampusBankLink, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<FeeCampusBankLink, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.DeleteWhere (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteWhereAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (FeeCampusBankLink).Assembly);
            Expression<Func<FeeCampusBankLink, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<FeeCampusBankLink, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.DeleteWhereAsync (discountFilterExpression));
        }
    }
}