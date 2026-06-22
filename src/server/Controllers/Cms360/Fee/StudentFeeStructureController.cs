
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

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using System.Diagnostics;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;

using Cms360.Server.Atributes;

using Newtonsoft.Json;
using Cms360.Data;
using Dapper;

using Microsoft.EntityFrameworkCore;
using System.Data;
using Cms360.Contract;

using Newtonsoft.Json;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using System.Data;

using Dapper;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json.Linq;
using Microsoft.Graph;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class FeeStudentFeeStructureController : Controller
    {
        // private readonly List<RegistrationSectionCourseLinkVM> tempList;

        public class RTV2
        {
            public string ReturnValue { get; set; }
        }
        private readonly IFeeStudentFeeStructureRepository repository;
        private readonly IFeeStudentFeeStructureVMRepository VMrepository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        private IDomainContext domainContext;
        protected IDomainContextResolver Resolver;
        private static object updateStatusLock = new object();
        private static readonly object updateLock = new object();

        public FeeStudentFeeStructureController(IFeeStudentFeeStructureRepository repository, IFeeStudentFeeStructureVMRepository VMrepository, DbContextBase db, IUserLogService log, IDomainContextResolver Resolver)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
            this.db = db;
            this.log = log;
            this.Resolver = Resolver;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAll()
        // {
        //     return Ok(this.repository.All());
        // }

        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAllVM()
        // {
        //     return Ok(this.VMrepository.FindBy(e => e.StatusId != 2));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllFilterData([FromBody] Predicate model)
        {
            var Sessionid = new Guid(model.ProvidedString.Split(',')[0]);
            var Campusid = new Guid(model.ProvidedString.Split(',')[1]);
            var ProgramDetailId = new Guid(model.ProvidedString.Split(',')[2]);
            return Ok(this.db.FeeStudentFeeStructureVM.Where(e => e.StatusId != 2 && e.ProgramDetailId == ProgramDetailId && e.SessionId == Sessionid && e.CampusId == Campusid));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ProgramTransfer([FromBody] Predicate model)
        {

            IDbConnection connection = db.Database.GetDbConnection();

            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[1]);
            var installmentamount = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var Data = this.log.GetLog();
            // var sessionid = new Guid(model.ProvidedString.Split("?")[1]);

            // var programdetailid = new Guid(model.ProvidedString.Split("?")[2]);
            // var campusid = new Guid(model.ProvidedString.Split("?")[3]);


            // var className = new String(model.ProvidedString.Split("?")[4]);


            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"ProgramTransfer\"('{0}','{1}',{2},'{3}') ; commit;", admissionformid, campusprogramid, installmentamount, Data);

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

        //Program Transfer With Already Paid date
        [HttpPost]
        [Route("[action]")]
        public IActionResult ProgramTransferWithPaid([FromBody] Predicate model)
        {
            var obj = new RTV2() { ReturnValue = "" };

            IDbConnection connection = db.Database.GetDbConnection();

            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[1]);
            var removeroll = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var Sectioncourselink = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var Data = this.log.GetLog();


            string json = String.Format("SELECT \"Fee\".\"ProgramTransferWithAlreadyPaidRecent\"('{0}','{1}','{2}','{3}','{4}','{5}') as ReturnValue", admissionformid, campusprogramid, removeroll, Sectioncourselink, Data, classid);

            Console.WriteLine(json);

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV2>(json).FirstOrDefault().ReturnValue;

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);

        }


        //Program Transfer With Already Paid date
        [HttpPost]
        [Route("[action]")]
        public IActionResult ProgramTransferWithPaidBulk([FromBody] Predicate model)
        {
            var obj = new RTV2() { ReturnValue = "" };

            IDbConnection connection = db.Database.GetDbConnection();

            var list = JsonConvert.DeserializeObject<List<TransferList>>(model.ProvidedString.Split("?")[0]);
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[1]);
            var removeroll = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var Sectioncourselink = new Guid(model.ProvidedString.Split("?")[3]);
            var Data = this.log.GetLog();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            foreach (var item in list)
            {
                string json = String.Format("SELECT \"Fee\".\"ProgramTransferWithAlreadyPaidRecent\"('{0}','{1}','{2}','{3}','{4}','{5}') as ReturnValue", item.AdmissionFormId, campusprogramid, removeroll, Sectioncourselink, Data, item.ClassId);

                Console.WriteLine(json);


                obj.ReturnValue = connection.Query<RTV2>(json).FirstOrDefault().ReturnValue;

            }




            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ProgramTransferWithPaidEX([FromBody] Predicate model)
        {

            IDbConnection connection = db.Database.GetDbConnection();

            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[1]);
            // var removeroll= Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var Sectioncourselink = new Guid(model.ProvidedString.Split("?")[3]);
            var Data = this.log.GetLog();

            string json = String.Format("SELECT \"Fee\".\"ProgramTransfernew\"('{0}','{1}','{2}','{3}')", admissionformid, campusprogramid, Sectioncourselink, Data);

            // // Console.WriteLine(json);

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
        public IActionResult StateChange([FromBody] Predicate model)
        {

            IDbConnection connection = db.Database.GetDbConnection();
            var TypeofStudent = new String(model.ProvidedString.Split("?")[0]);
            var admissionformid = new Guid(model.ProvidedString.Split("?")[1]);
            string json = String.Format("SELECT \"Fee\".\"StateChange\"('{0}','{1}')", TypeofStudent, admissionformid);
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
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentFeeStructure).Assembly);
            Expression<Func<FeeStudentFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentFeeStructure).Assembly);
            Expression<Func<FeeStudentFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentFeeStructure).Assembly);
            Expression<Func<FeeStudentFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentFeeStructure).Assembly);
            Expression<Func<FeeStudentFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] FeeStudentFeeStructure entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.StudentFeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] FeeStudentFeeStructure entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.StudentFeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<FeeStudentFeeStructure> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.StudentFeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<FeeStudentFeeStructure> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] FeeStudentFeeStructure entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.StudentFeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] FeeStudentFeeStructure entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.StudentFeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] FeeStudentFeeStructure entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.StudentFeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] FeeStudentFeeStructure entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.StudentFeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentFeeStructure).Assembly);
            Expression<Func<FeeStudentFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentFeeStructure).Assembly);
            Expression<Func<FeeStudentFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SearchStudent([FromBody] Predicate model)
        {
            var searchparam = model.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            // string whereClause = String.Format(@"(concat(LOWER(cv.""RefferenceNo""), LOWER(cv.""RollNo""),LOWER(cv.""FullName"")) Like LOWER(''%{1}%''))", userid, searchParam);
            string sql = String.Format(@"SELECT * FROM ""Fee"".""SearchStudentChallanVM""('{0}',{1})", searchparam, userid);
            return Ok(this.db.StudentFeeStructureVM.FromSql(sql));
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAdhocFeeHead()
        {

            // string whereClause = String.Format(@"(concat(LOWER(cv.""RefferenceNo""), LOWER(cv.""RollNo""),LOWER(cv.""FullName"")) Like LOWER(''%{1}%''))", userid, searchParam);
            string sql = String.Format(@"SELECT * FROM ""Fee"".""GetAdhocFeeHead""()");
            var result = db.AdhocChallanFeeHead.FromSql(sql).ToList();
            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentCreditNotes([FromBody] Predicate model)
        {
            var sessionid = model.ProvidedString.Split("?")[0];
            var city = model.ProvidedString.Split("?")[1];
            var subcity = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            // string whereClause = String.Format(@"(concat(LOWER(cv.""RefferenceNo""), LOWER(cv.""RollNo""),LOWER(cv.""FullName"")) Like LOWER(''%{1}%''))", userid, searchParam);
            string sql = String.Format(@"SELECT * FROM ""Fee"".""CreditNotesFeeReport""('{0}','{1}','{2}','{3}')", sessionid, city, subcity, classid);
            return Ok(this.db.StudentCreditNotes.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdatePaidDateCreditNotes([FromBody] Predicate model)
        {
            var list = model.ProvidedString.Split("?")[0];
            var Data = this.log.GetLog();
            string json = String.Format(@" SELECT * From ""Fee"".""CreditNotesPaidDate"" ('{0}','{1}'::json);", list, Data);
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
        public IActionResult InstallmentNos([FromBody] Predicate model)
        {
            var session = model.ProvidedString.Split("?")[0];
            var campus = model.ProvidedString.Split("?")[1];
            var campusprogramid = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            var Data = this.log.GetLog();
            string json = String.Format(@" SELECT * From ""Fee"".""InstallmentNo"" ('{0}','{1}','{2}','{3}');", session, campus, campusprogramid, classid);
            Console.WriteLine(json);
            return Ok(this.db.InstallmentNos.FromSql(json));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult LoadSections([FromBody] Predicate model)
        {
            var session = model.ProvidedString.Split("?")[0];
            var campus = model.ProvidedString.Split("?")[1];
            var campusprogramid = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            var Data = this.log.GetLog();
            string json = String.Format(@" SELECT * From ""Setup"".""SectionList"" ('{0}','{1}','{2}','{3}');", session, campus, campusprogramid, classid);
            Console.WriteLine(json);
            return Ok(this.db.SectionList.FromSql(json));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetScholarships([FromBody] Predicate model)
        {
            var campusProgramid = new Guid(model.ProvidedString.Split("?")[0]);
            Console.WriteLine(campusProgramid);
            return Ok(this.db.ScholarshipsVM.Where(s => s.CampusProgramId == campusProgramid));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetScholarshipsEX([FromBody] Predicate model)
        {
            var campusProgramid = new Guid(model.ProvidedString.Split("?")[0]);
            var admissionTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            Console.WriteLine(campusProgramid);
            return Ok(this.db.VWScholarshipsEX.Where(s => s.CampusProgramId == campusProgramid && s.AdmissionTypeId == admissionTypeId));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult AttendancecutoffDate([FromBody] Predicate model)
        {
            var session = model.ProvidedString.Split("?")[0];
            var campus = model.ProvidedString.Split("?")[1];
            var campusprogramid = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            var installmentno = model.ProvidedString.Split("?")[4];
            var Data = this.log.GetLog();
            string json = String.Format(@" SELECT * From ""Fee"".""CutOffDate"" ('{0}','{1}','{2}','{3}','{4}');", session, campus, campusprogramid, classid, installmentno);
            Console.WriteLine(json);
            return Ok(this.db.AttendanceCutOffDate.FromSql(json));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionReversalStudents([FromBody] Predicate model)
        {
            var session = model.ProvidedString.Split("?")[0];
            var campus = model.ProvidedString.Split("?")[1];
            var campusprogramid = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            var installmentno = model.ProvidedString.Split("?")[4];
            var cutofdate = model.ProvidedString.Split("?")[5];
            var Data = this.log.GetLog();
            this.db.Database.SetCommandTimeout(100);
            string json = String.Format(@" SELECT * From ""Fee"".""GetConcessionReversalStudents"" ('{0}','{1}','{2}','{3}','{4}','{5}');", session, campus, campusprogramid, classid, installmentno, cutofdate);
            Console.WriteLine(json);
            return Ok(this.db.GetConcessionReversalStudents.FromSql(json));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentDataApplyConcession([FromBody] Predicate model)
        {
            var session = model.ProvidedString.Split("?")[0];
            var campus = model.ProvidedString.Split("?")[1];
            var campusprogramid = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            var installmentno = model.ProvidedString.Split("?")[5];
            var sectionid = model.ProvidedString.Split("?")[4];
            var Data = this.log.GetLog();
            this.db.Database.SetCommandTimeout(100);
            string json = String.Format(@" SELECT * From ""Fee"".""GetStudentsToApplyConcession"" ('{0}','{1}','{2}','{3}','{4}','{5}');", session, campus, campusprogramid, classid, sectionid, installmentno);
            Console.WriteLine(json);
            return Ok(this.db.GetConcessionStudentsList.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentDataApplyConcessionEX([FromBody] Predicate model)
        {
            var session = model.ProvidedString.Split("?")[0];
            var campus = model.ProvidedString.Split("?")[1];
            var campusprogramid = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            var installmentno = model.ProvidedString.Split("?")[5];
            var sectionid = model.ProvidedString.Split("?")[4];
            var programDetailId = model.ProvidedString.Split("?")[6];
            var Data = this.log.GetLog();
            this.db.Database.SetCommandTimeout(100);
            string json = String.Format(@" SELECT * From ""Fee"".""GetStudentsToApplyConcessionEX"" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}');", session, campus, campusprogramid, classid, sectionid, installmentno, programDetailId);
            Console.WriteLine(json);
            return Ok(this.db.GetConcessionStudentsListEX.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateConcession([FromBody] Predicate model)
        {
            var list = model.ProvidedString.Split("?")[0];
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin;  SELECT * From \"Fee\".\"WithdrawnConcessionApplied\" ('{0}'::json,'{1}'::json); commit;", list, Data);
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
        public IActionResult ConcessionAppliedOnInstallment([FromBody] Predicate model)
        {
            var list = model.ProvidedString.Split("?")[0];
            var Data = this.log.GetLog();
            this.db.Database.SetCommandTimeout(100);
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin;  SELECT * From \"Fee\".\"ConcessionAppliedOnInstallment\" ('{0}'::json,'{1}'::json); commit;", list, Data);
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
        public IActionResult ProgramTransferWithPaidBookUnBind([FromBody] Predicate model)
        {
            var obj = new RTV2() { ReturnValue = "" };

            IDbConnection connection = db.Database.GetDbConnection();

            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[1]);
            var removeroll = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var Sectioncourselink = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var Data = this.log.GetLog();

            string json = String.Format("SELECT \"Fee\".\"ProgramTransferWithAlreadyPaidRecent\"('{0}','{1}','{2}','{3}','{4}','{5}') as ReturnValue", admissionformid, campusprogramid, removeroll, Sectioncourselink, Data, classid);

            Console.WriteLine(json);

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV2>(json).FirstOrDefault().ReturnValue;
            if (obj.ReturnValue == "Program Transferred SuccessFully")
            {
                // Directly use Result property for synchronous call
                UnRegisterUserBooksARVO(admissionformid);
            }
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }

        private void UnRegisterUserBooksARVO(Guid admissionformid)
        {
            HttpClient client = new HttpClient();

            var response = "";
            var _config = this.db.ARVOConfiguration.FirstOrDefault(e => e.FullName == "UnRegisterUserBooks");
            var studentCourse = RetriveStudentCourses(admissionformid);

            var studentCourseData = studentCourse.FirstOrDefault();
            if (studentCourseData != null)
            {
                if (_config != null)
                {
                    var apiUrl = _config.BaseURL + _config.APIURL;
                    var accessToken = _config.ARVOAccessToken;

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var requestBody = new RequestDataBookBind
                    {
                        organizationCode = "CMS",
                        email = studentCourseData.Email
                    };

                    var json = JsonConvert.SerializeObject(requestBody);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    try
                    {
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Delete,
                            RequestUri = new Uri(apiUrl),
                            Content = content
                        };

                        HttpResponseMessage response1 = client.SendAsync(request).Result;
                        string responseContent = response1.Content.ReadAsStringAsync().Result;

                        if (response1.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                        {
                            var apiResponse = JsonConvert.DeserializeObject<ResponseDataBookBindEx>(responseContent);
                            if (apiResponse != null && apiResponse.Data)
                            {
                                if (studentCourseData.IsEbook == true)
                                {
                                    AgainRegisterUserBooksARVO(studentCourseData);
                                }
                            }
                            else
                            {
                                if (apiResponse.Message == "Record does not exist.")
                                {
                                    if (studentCourseData.IsEbook == true)
                                    {
                                        AgainRegisterUserBooksARVO(studentCourseData);
                                    }
                                }
                                Console.WriteLine(apiResponse?.Message ?? "Unknown error occurred");
                            }
                        }
                        else
                        {
                            _config = ARVOLogin(_config);
                            accessToken = _config.ARVOAccessToken;

                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                            HttpResponseMessage response2 = client.SendAsync(request).Result;
                            string responseContents = response2.Content.ReadAsStringAsync().Result;
                            var apiResponses = JsonConvert.DeserializeObject<ResponseDataBookBindEx>(responseContents);
                            if (apiResponses != null && apiResponses.Data)
                            {
                                if (studentCourseData.IsEbook == true)
                                {
                                    AgainRegisterUserBooksARVO(studentCourseData);
                                }
                            }
                            else
                            {
                                if (apiResponses.Message == "Record does not exist.")
                                {
                                    if (studentCourseData.IsEbook == true)
                                    {
                                        AgainRegisterUserBooksARVO(studentCourseData);
                                    }
                                }
                                Console.WriteLine(apiResponses?.Message ?? "Unknown error occurred");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                }
            }
        }

        private void AgainRegisterUserBooksARVO(StudentCourses studentCourseData)
        {
            HttpClient client = new HttpClient();

            var _config = this.db.ARVOConfiguration.FirstOrDefault(e => e.FullName == "RegisterUserBooks");

            if (studentCourseData != null && studentCourseData.IsEbook == true)
            {
                if (_config != null)
                {
                    var apiUrl = _config.BaseURL + _config.APIURL;
                    var accessToken = _config.ARVOAccessToken;

                    string[] courseStrings;
                    if (studentCourseData.Course.Contains(','))
                    {
                        courseStrings = studentCourseData.Course.Split(',').Select(s => s.Trim()).ToArray();
                    }
                    else
                    {
                        courseStrings = new string[] { studentCourseData.Course.Trim() };
                    }

                    List<string> courses = new List<string>();
                    foreach (string str in courseStrings)
                    {
                        courses.Add(str);
                    }

                    string[] courseArray = courses.ToArray();
                    var requestBody = new RequestBodyBookBindRegister
                    {
                        organizationCode = studentCourseData.OrganizationCode,
                        email = studentCourseData.Email,
                        session = studentCourseData.SessionCode,
                        programLevel = studentCourseData.ProgramLevel,
                        @class = studentCourseData.Class,
                        board = studentCourseData.Board,
                        medium = studentCourseData.Medium,
                        subjects = courseArray
                    };

                    var json = JsonConvert.SerializeObject(requestBody);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    try
                    {
                        HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;
                        string responseContent = response1.Content.ReadAsStringAsync().Result;

                        if (response1.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                        {
                            var apiResponse = JsonConvert.DeserializeObject<ArvoApiResponseBookBind>(responseContent);
                            if (apiResponse != null && apiResponse.Succeeded)
                            {
                                // Handle success
                            }
                            else
                            {
                                Console.WriteLine(apiResponse?.Message ?? "Unknown error occurred");
                            }
                        }
                        else
                        {
                            _config = ARVOLogin(_config);
                            accessToken = _config.ARVOAccessToken;

                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                            HttpResponseMessage response2 = client.PostAsync(apiUrl, content).Result;

                            responseContent = response2.Content.ReadAsStringAsync().Result;
                            var apiResponse = JsonConvert.DeserializeObject<ArvoApiResponseBookBind>(responseContent);
                            if (apiResponse != null && apiResponse.Succeeded)
                            {
                                // Handle success
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                }
            }
        }

        public IEnumerable<StudentCourses> RetriveStudentCourses(Guid admissionformid)
        {
            string sql = string.Format(@"select * from ""Quiz"".""StudentCoursesForBookUnBind""('{0}')", admissionformid);
            return this.db.StudentCourses.FromSql(sql);
        }

        private ARVOConfiguration ARVOLogin(ARVOConfiguration _config)
        {
            lock (updateLock)
            {
                if (_config != null)
                {
                    var loginRequest = new
                    {
                        email = _config.ARVOLoginEmail,
                        password = _config.ARVOLoginPassword
                    };

                    string jsonRequest = JsonConvert.SerializeObject(loginRequest);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    using (HttpClient client = new HttpClient())
                    {
                        HttpResponseMessage response = client.PostAsync(_config.LoginURL, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = response.Content.ReadAsStringAsync().Result;
                            JObject json = JObject.Parse(responseData);
                            _config.ARVOAccessToken = json["data"]["token"].ToString();
                        }
                    }
                }
            }

            return _config;
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GenerateAdhocChallanEx([FromBody] AdhocChallanModel model)
        {
            try
            {
                using (IDbConnection connection = db.Database.GetDbConnection())
                {
                    if (connection.State == ConnectionState.Closed)
                        connection.Open();

                    // SQL Query to call PostgreSQL function and get challan number
                    string query = "SELECT \"Fee\".\"GenerateAdhocChallan\"(@campusid, @Amount, @feeheedid,@duedate,@staffId,@remarks);";

                    var challanNo = connection.ExecuteScalar<string>(query, new
                    {
                        CampusId = model.CampusId,
                        Amount = model.Amount,
                        feeheedid = model.FeeHeadId,
                        duedate = model.DueDate.ToString("yyyy-MM-dd"),
                        staffId = model.StaffId,
                        remarks = model.Remarks


                    });

                    if (connection.State == ConnectionState.Open)
                    {
                        connection.Close();
                        connection.Dispose();
                    }

                    return Ok(new { VoucherNo = challanNo });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Error generating challan", Error = ex.Message });
            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GenerateAdhocChallan([FromBody] AdhocChallanModel model)
        {
            var Data = this.log.GetLog();

            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin;  SELECT * From \"Fee\".\"GenerateAdhocChallan\" ('{0}',{1},'{2}','{3}','{4}','{5}'); commit;", model.CampusId, model.Amount, model.FeeHeadId, model.DueDate.ToString("yyyy-MM-dd"), model.StaffId,model.Remarks);
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

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateAdhocChallanDate([FromBody] UpdateAdhocChallan model)
        {
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin;  SELECT * From \"Fee\".\"changeadhocchallandate\" ('{0}','{1}','{2}','{3}','{4}'); commit;",model.Remarks, model.adhocchallanid, model.amount, model.duedate.ToString("yyyy-MM-dd"), model.isdelete);
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


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdhocChallanList([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split(',')[0]);

            string sql = String.Format(@"SELECT * FROM ""Fee"".""GetAdhocList""('{0}')", campusid);
            return Ok(this.db.GetAdhocListData.FromSql(sql));
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

    }

}


