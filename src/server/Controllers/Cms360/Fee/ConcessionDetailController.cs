
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/
using Dapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;


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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class FeeConcessionDetailController : Controller
    {
        private readonly IFeeConcessionDetailRepository repository;
        private readonly IFeeConcessionDetailRepositoryVM repo;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        private List<FeeStructureVM> list;
        private List<FeeStructureVMEx> vmList;
        public FeeConcessionDetailController(IFeeConcessionDetailRepository repository, DbContextBase db, IFeeConcessionDetailRepositoryVM repo, IUserLogService log)
        {
            this.repository = repository;
            this.repo = repo;
            this.db = db;
            list = new List<FeeStructureVM>();
            vmList = new List<FeeStructureVMEx>();
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
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repo.FindByAsync(e => e.StatusId != 2));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult ApplyBulkConcession([FromBody] Predicate model)
        {
            var scholarshipCriteriaId = new Guid(model.ProvidedString.Split("?")[0]);
            var list = model.ProvidedString.Split("?")[1];
            var installno = Convert.ToInt16(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[3]);

            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT  \"Fee\".\"ApplyConcessionBulkViaInstallment\"('{0}','{1}','{2}',{3},'{4}'); commit;", scholarshipCriteriaId, list, Data, installno,classid);
             Console.WriteLine(json);
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
        public IActionResult ApplyConcessionBulkViaInstallmentNew([FromBody] Predicate model)
        {
            var scholarshipCriteriaId = new Guid(model.ProvidedString.Split("?")[0]);
            var list = model.ProvidedString.Split("?")[1];
            var installno = Convert.ToInt16(model.ProvidedString.Split("?")[2]);
           // var classid = new Guid(model.ProvidedString.Split("?")[3]);

            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT  \"Fee\".\"ApplyConcessionBulkViaInstallmentNew\"('{0}','{1}','{2}',{3}); commit;", scholarshipCriteriaId, list, Data, installno);
             Console.WriteLine(json);
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
        public IActionResult ApplySubInstallmentBulkPre([FromBody] Predicate model)
        {
            var subInstallAmount = Convert.ToInt32(model.ProvidedString.Split("?")[0]);
            var list = model.ProvidedString.Split("?")[1];
            var installno = Convert.ToInt16(model.ProvidedString.Split("?")[2]);
           // var classid = new Guid(model.ProvidedString.Split("?")[3]);

            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT  \"Fee\".\"ApplySubInstallmentBulkPre\"({0},'{1}','{2}',{3}); commit;", subInstallAmount, list, Data, installno);
             Console.WriteLine(json);
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
        public IActionResult ReNewConcession([FromBody] Predicate model)
        {
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            var installno = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var campusprogramid=new Guid(model.ProvidedString.Split("?")[5]);
            this.db.Database.SetCommandTimeout(100);

            var query = String.Format(@"SELECT * FROM ""Attendance"".""StudentPercentageWiseEx""('{0}','{1}',{2},'{3}','{4}','{5}')", sectioncourseid, classid, installno, fromDate, toDate,campusprogramid);
             Console.WriteLine(query);
            return Ok(this.db.ReNewConcessionVM.FromSql(query));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult ReNewConcessionforConcessionRules([FromBody] Predicate model)
        {
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            var installno = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var campusprogramid=new Guid(model.ProvidedString.Split("?")[5]);
            this.db.Database.SetCommandTimeout(100);

            var query = String.Format(@"SELECT * FROM ""Attendance"".""StudentPercentageWiseExWithConcessionRules""('{0}','{1}',{2},'{3}','{4}','{5}')", sectioncourseid, classid, installno, fromDate, toDate,campusprogramid);
             Console.WriteLine(query);
            return Ok(this.db.ReNewConcessionVM.FromSql(query));

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllConceccionRules()
        {
            var res=this.db.VW_ConcessionContinutionRules.ToList();
            return Ok(res);
        }


          [HttpPost]
        [Route("[action]")]
        public IActionResult ReNewConcessionEx([FromBody] Predicate model)
        {
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            var installno = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

            var query = String.Format(@"SELECT * FROM ""Attendance"".""StudentPercentageWiseExByPass""('{0}','{1}',{2})", sectioncourseid, classid, installno);
             Console.WriteLine(query);
            return Ok(this.db.ReNewConcessionVM.FromSql(query));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult AttendancePercentage([FromBody] Predicate model)
        {
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];

            var query = String.Format(@"SELECT * FROM ""Attendance"".""StudentPercentageWiseEx""('{0}','{1}','{2}','{3}')", sectioncourseid, classid, fromDate, toDate);
            // // Console.WriteLine(query);
            return Ok(this.db.ReNewConcessionVM.FromSql(query));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AttendancePercentageEx([FromBody] Predicate model)
        {
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            var fromDate = model.ProvidedString.Split("?")[2];
            var toDate = model.ProvidedString.Split("?")[3];
            var fromPer = model.ProvidedString.Split("?")[4];
            var toPer = model.ProvidedString.Split("?")[5];

            var query = String.Format(@"SELECT * FROM ""Attendance"".""StudentPercentageWiseExx""('{0}','{1}','{2}','{3}', {4}, {5})",
            sectioncourseid, classid, fromDate, toDate, fromPer, toPer);
            // // Console.WriteLine(query);
            return Ok(this.db.ReNewConcessionVMEx.FromSql(query));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetScholarships([FromBody] Predicate model)
        {
            var campusProgramid = new Guid(model.ProvidedString.Split("?")[0]);
            return Ok(this.db.ScholarshipsVM.Where(s => s.CampusProgramId == campusProgramid));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult ReNewConcessionBulk([FromBody] Predicate model)
        {
            var json = model.ProvidedString.Split("?")[0];
            var Data = this.log.GetLog();
            var query = String.Format(@"Select * from ""Attendance"".""ReNewConcessionBulk""('{0}','{1}')", json, Data);
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
            return Ok();

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudents([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[3]);
            var percentagefrom = Convert.ToDecimal(model.ProvidedString.Split("?")[4]);
            var percentageto = Convert.ToDecimal(model.ProvidedString.Split("?")[5]);
            //var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);

            //IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format("SELECT * FROM \"Admission\".\"getStudentsEx2\"('{0}','{1}','{2}','{3}',{4},{5})", sessionid, campusid, programdetailid, shiftid, percentagefrom, percentageto);
            // Console.WriteLine(json);
            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();

            // return Ok(connection.Query<studentModel>(json));

            return Ok(db.studentModelEx.FromSql(json));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsPre([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[3]);
            var percentagefrom = Convert.ToDecimal(model.ProvidedString.Split("?")[4]);
            var percentageto = Convert.ToDecimal(model.ProvidedString.Split("?")[5]);
            //var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);

            //IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format("SELECT * FROM \"Admission\".\"getStudentsEx3\"('{0}','{1}','{2}','{3}',{4},{5})", sessionid, campusid, programdetailid, shiftid, percentagefrom, percentageto);
            // Console.WriteLine(json);
            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();

            // return Ok(connection.Query<studentModel>(json));

            return Ok(db.studentModelEx.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionDetail([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var zoneid = new Guid(model.ProvidedString.Split("?")[3]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[4]);
            var percentagefrom = Convert.ToInt32(model.ProvidedString.Split("?")[5]);
            var percentageto = Convert.ToInt32(model.ProvidedString.Split("?")[6]);
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format("SELECT * FROM \"Admission\".\"getStudents\"('{0}','{1}','{2}',{3},{4})", sessionid, campusid, programdetailid, shiftid, zoneid, percentagefrom, percentageto);
            // // Console.WriteLine(json);
            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();

            // return Ok(connection.Query<studentModel>(json));

            return Ok(db.studentModel.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentSingle([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var shifftid = new Guid(model.ProvidedString.Split("?")[3]);
            var admissiontypeid = new Guid(model.ProvidedString.Split("?")[4]);

            return Ok(this.db.GetStudentsVM.Where(s => s.CampusId == campusid && s.SessionId == sessionid && s.ProgramDetailId == programdetailid && s.ShiftId == shifftid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentByRef([FromBody] Predicate model)
        {
            var refferenceNo = new string(model.ProvidedString);


            return Ok(this.db.GetStudentsVM.Where(s => s.RefferenceNo == refferenceNo && s.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcessionDetail).Assembly);
            Expression<Func<FeeConcessionDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcessionDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcessionDetail).Assembly);
            Expression<Func<FeeConcessionDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcessionDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcessionDetail).Assembly);
            Expression<Func<FeeConcessionDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcessionDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            var shifftid = new Guid(model.ProvidedString.Split("?")[3]);

            return Ok(this.db.FeeConcessionDetailVM.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.ProgramId == programid && s.ShiftId == shifftid && s.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetBulkData([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var shifftid = new Guid(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);
            List<CheckBoxModel> programCbList = JsonConvert.DeserializeObject<List<CheckBoxModel>>(model.ProvidedString.Split("?")[3]);
            List<CheckBoxModel> feeHeadList = JsonConvert.DeserializeObject<List<CheckBoxModel>>(model.ProvidedString.Split("?")[4]);
            //SetupClass clas = this.db.SetupClass.FromSql("SELECT * FROM \"Setup\".\"Class\" where Right(\"FullName\",2)='-I'").FirstOrDefault();

            // var classId = clas.ClassId;
            foreach (var program in programCbList)
            {
                foreach (var feeHead in feeHeadList)
                {
                    vmList.AddRange(this.db.FeeStructureVMEx.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.ProgramId == program.id && s.ShiftId == shifftid && s.FeeHeadId == feeHead.id && s.ClassId == classid && s.StatusId == 1).OrderBy(e => e.ProgramId));
                }
            }

            return Ok(vmList);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulkConcession([FromBody] Predicate model)
        {
            var concessionjson = model.ProvidedString.Split("?")[0];
            var concessiondetailjson = model.ProvidedString.Split("?")[1];
            var contPolicJson = model.ProvidedString.Split("?")[2];
            var admissiontypeid = new Guid(model.ProvidedString.Split("?")[3]);
            var scholtypeid = new Guid(model.ProvidedString.Split("?")[4]);
            var marksPer = Convert.ToDecimal(model.ProvidedString.Split("?")[5]);
            var attendPer = Convert.ToDecimal(model.ProvidedString.Split("?")[6]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[7]);

            IDbConnection connection = db.Database.GetDbConnection();
            string json = String.Format(@"select * from  ""Fee"".""AddBulkConcession3"" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}');",
            concessionjson, concessiondetailjson, contPolicJson, admissiontypeid, scholtypeid, marksPer, attendPer, shiftid);
            Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok("Done Successfully");
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulkConcessionEx([FromBody] Predicate model)
        {
            var concessionjson = model.ProvidedString.Split("?")[0];
            var concessiondetailjson = model.ProvidedString.Split("?")[1];
            var contPolicJson = model.ProvidedString.Split("?")[2];
            var scholtypeid = new Guid(model.ProvidedString.Split("?")[3]);
            var marksPer = Convert.ToDecimal(model.ProvidedString.Split("?")[4]);
            var attendPer = Convert.ToDecimal(model.ProvidedString.Split("?")[5]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[6]);

            IDbConnection connection = db.Database.GetDbConnection();
            string json = String.Format(@"select * from  ""Fee"".""AddBulkConcession3"" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}');",
            concessionjson, concessiondetailjson, contPolicJson, scholtypeid, marksPer, attendPer, shiftid);
            Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok("Done Successfully");
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcession([FromBody] Predicate model)
        {
            var campusProgramid = new Guid(model.ProvidedString.Split("?")[0]);
            var admissiontypid = new Guid(model.ProvidedString.Split("?")[1]);
            var query = String.Format(@"Select * from ""Fee"".""GetConcessions""('{0}','{1}')", campusProgramid, admissiontypid);
            // Console.WriteLine(query);
            return Ok(this.db.ConcessionVM.FromSql(query));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulkScholarshipCriteria([FromBody] Predicate model)
        {
            //  List<FeeContinuationPolicyCB> continuationPolicyL = JsonConvert.DeserializeObject<List<CheckBoxModel>>(model.ProvidedString.Split("?")[3]);
            var continuationPolicyJson = model.ProvidedString.Split("?")[0];
            var concessionName = model.ProvidedString.Split("?")[1];
            var zoneid = new Guid(model.ProvidedString.Split("?")[2]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[3]);
            var shifftid = new Guid(model.ProvidedString.Split("?")[4]);
            var challantypeid = new Guid(model.ProvidedString.Split("?")[5]);
            var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
            var scholarshiptypeid = new Guid(model.ProvidedString.Split("?")[7]);
            var marksPer = Convert.ToDecimal(model.ProvidedString.Split("?")[8]);
            var attendPer = Convert.ToDecimal(model.ProvidedString.Split("?")[9]);
            IDbConnection connection = db.Database.GetDbConnection();
            string json = String.Format(@"BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; select ""Fee"".""AddBulkConcession2"" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}',{8},{9}); commit;",
            continuationPolicyJson, concessionName, zoneid, sessionid, shifftid, challantypeid, admissiontypeid, scholarshiptypeid, marksPer, attendPer);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok("Hi");
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcessionDetail).Assembly);
            Expression<Func<FeeConcessionDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcessionDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddManyStudents([FromBody] Predicate predicate)
        {
            var query = String.Format(@"SELECT * FROM """".""""('{0}')", predicate.ProvidedString);
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
        public IActionResult AddOne([FromBody] FeeConcessionDetail entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] FeeConcessionDetail entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<FeeConcessionDetail> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<FeeConcessionDetail> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] FeeConcessionDetail entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] FeeConcessionDetail entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] FeeConcessionDetail entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] FeeConcessionDetail entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.ConcessionDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcessionDetail).Assembly);
            Expression<Func<FeeConcessionDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcessionDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeConcessionDetail).Assembly);
            Expression<Func<FeeConcessionDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeConcessionDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}