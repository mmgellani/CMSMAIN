
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class FeeScholarshipCriteriaController : Controller
    {
        private readonly IFeeScholarshipCriteriaRepository repository;
        private readonly ITableGradesRepository Gradesrepository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        public FeeScholarshipCriteriaController(IFeeScholarshipCriteriaRepository repository, ITableGradesRepository Gradesrepository, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
            this.Gradesrepository = Gradesrepository;
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

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllGrades()
        {
            return Ok(this.Gradesrepository.All());
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult ApplyBulkScholarship([FromBody] Predicate model)
        {
            // var scholarshipCriteriaId = new Guid(model.ProvidedString.Split("?")[0]);
            var list = model.ProvidedString;
            string json = String.Format("SELECT  \"Fee\".\"ApplyScholarshipBulk\"('{0}')", list);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }
            return Ok(true);
        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulkScholarshipScholarshipCriteria([FromBody] Predicate model)
        {
        var obj = new Predicate() { ProvidedString = "" };


        var campusprogramid = new Guid(model.ProvidedString.Split("?")[0]);
        var admissiontypeid = new Guid(model.ProvidedString.Split("?")[1]);
        var continuationpolicyid = new Guid(model.ProvidedString.Split("?")[2]);
        var concesslist = (model.ProvidedString.Split("?")[3]);
        var fullName = (model.ProvidedString.Split("?")[4]);
        var scholartypid= new Guid(model.ProvidedString.Split("?")[5]);
        var marks= Convert.ToInt64(model.ProvidedString.Split("?")[6]);
        var attendper= Convert.ToInt64(model.ProvidedString.Split("?")[7]);

            string json = String.Format("SELECT  \"Fee\".\"InsertBulkScholarShipCriteria\"('{0}','{1}','{2}','{3}','{4}','{5}',{6},{7} ) as \"ProvidedString\" ", campusprogramid,admissiontypeid,continuationpolicyid,concesslist,fullName,scholartypid,marks,attendper);
           
            IDbConnection connection = db.Database.GetDbConnection();
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
        public IActionResult GetStudents([FromBody] Predicate model)
        {
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[0]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[1]);
            var admissiontypeid = new Guid(model.ProvidedString.Split("?")[2]);

            string json = String.Format("SELECT * FROM \"Fee\".\"ApplyScholarship\"('{0}','{1}','{2}')", campusprogramid, admissiontypeid, shiftid);

            return Ok(db.ScholarshipStudentModel.FromSql(json).OrderBy(s => s.ScholarshipId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] Predicate model)
        {
            var campusProgramid = new Guid(model.ProvidedString);
            return Ok(this.db.FeeScholarshipCriteriaVM.Where(s => s.CampusProgramId == campusProgramid && s.StatusId != 2));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMBy([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[3]);
            //var admissionTypeId = new Guid(model.ProvidedString.Split("?")[4]);
            

            //var campusProgramid=new Guid(model.ProvidedString);
            return Ok(this.db.FeeScholarshipCriteriaVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programdetailid && s.ShiftId == shiftid   && s.StatusId == 1));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMByAdmissionConcession([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[3]);
            var admissionTypeId = new Guid(model.ProvidedString.Split("?")[4]);
            

            //var campusProgramid=new Guid(model.ProvidedString);
            return Ok(this.db.FeeScholarshipCriteriaVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programdetailid && s.ShiftId == shiftid   && s.StatusId == 1 && s.AdmissionTypeId==admissionTypeId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVMByEx([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[3]);
            var admissionTypeId = new Guid(model.ProvidedString.Split("?")[4]);
            var continuationPolicyId = new Guid(model.ProvidedString.Split("?")[5]);

            //var campusProgramid=new Guid(model.ProvidedString);
            return Ok(this.db.FeeScholarshipCriteriaVM.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programdetailid && s.ShiftId == shiftid && s.AdmissionTypeId == admissionTypeId && s.ContinuationPolicyId == continuationPolicyId && s.StatusId == 1));
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
            var options = ScriptOptions.Default.AddReferences(typeof(FeeScholarshipCriteria).Assembly);
            Expression<Func<FeeScholarshipCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeScholarshipCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeScholarshipCriteria).Assembly);
            Expression<Func<FeeScholarshipCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeScholarshipCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeScholarshipCriteria).Assembly);
            Expression<Func<FeeScholarshipCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeScholarshipCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeScholarshipCriteria).Assembly);
            Expression<Func<FeeScholarshipCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeScholarshipCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]FeeScholarshipCriteria entity)
        {
            // Console.WriteLine(entity);
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]FeeScholarshipCriteria entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<FeeScholarshipCriteria> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<FeeScholarshipCriteria> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]FeeScholarshipCriteria entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]FeeScholarshipCriteria entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]FeeScholarshipCriteria entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]FeeScholarshipCriteria entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.ScholarshipCriteria"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeScholarshipCriteria).Assembly);
            Expression<Func<FeeScholarshipCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeScholarshipCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeScholarshipCriteria).Assembly);
            Expression<Func<FeeScholarshipCriteria, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeScholarshipCriteria, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}