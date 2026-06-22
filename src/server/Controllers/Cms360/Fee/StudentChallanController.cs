/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.Data;
using System.DirectoryServices.ActiveDirectory;
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
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class FeeStudentChallanController : Controller
    {
        public class RTV
        {
            public Int32 ReturnValue { get; set; }
        }
        public class RTV2
        {
            public string ReturnValue { get; set; }
        }
        private readonly IFeeStudentChallanRepository repository;
        private readonly IFeeStudentChallanVMRepository VMrepository;
protected IDomainContextResolver Resolver;
    private IDomainContext domainContext;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        public FeeStudentChallanController(IFeeStudentChallanRepository repository, IFeeStudentChallanVMRepository VMrepository, DbContextBase db, IUserLogService log,IDomainContextResolver Resolver)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
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

        // [HttpGet]
        // [Route("[action]")]
        // public IActionResult GetAll()
        // {
        //     return Ok(this.repo.All());
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeByChallandata([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            string ChallanNo = model.ProvidedString;
            return Ok(this.db.VW_AdhocStudentChallan.Where(e => e.ChallanNo == ChallanNo && (e.StatusId == 1 || e.StatusId == 10 || e.StatusId == 20 )));
        }


         [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeByChallandataReversal([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            string ChallanNo = model.ProvidedString;
            return Ok(this.db.VW_ReversalStudentChallan.Where(e => e.ChallanNo == ChallanNo && (e.StatusId == 1)));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllChallandata([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            string ChallanNo = model.ProvidedString;
            return Ok(this.db.FeeStudentChallan.Where(e => e.ChallanNo == ChallanNo));
            //return Ok(this.repo.FindBy(String.Format("WHERE \"ChallanNo\"='" + model.ProvidedString + "'")));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var RefrenceNo = new String(model.ProvidedString);

            return Ok(this.db.FeeStudentChallanVM.Where(e => e.StatusId != 2 && e.RefferenceNo == RefrenceNo));
            
            //return Ok(this.VMrepository.FindBy(e => e.StatusId != 2 && e.RefferenceNo == RefrenceNo));
 
            //return Ok(this.repo.FindBy<FeeStudentChallanVM>(String.Format("WHERE \"RefferenceNo\"='" + model.ProvidedString + "' AND \"StatusId\"!=2")));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetData([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var admissionFormId = new Guid(model.ProvidedString);
            return Ok(this.db.FeeStudentChallan.Where(e => e.StatusId == 1 && e.AdmissionFormId == admissionFormId));

            //return Ok(this.repo.FindBy(String.Format("WHERE \"AdmissionFormId\"='" + model.ProvidedString + "' AND \"StatusId\" = 1")));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeByRefrenceNo([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var RefrenceNo = new String(model.ProvidedString);
            return Ok(this.db.FeeSubinstallmentVM.Where(e => e.StatusId == 1 && e.RefferenceNo == RefrenceNo));
            //return Ok(this.repo.FindBy<FeeSubinstallmentVM>(String.Format("WHERE \"RefferenceNo\"='" + model.ProvidedString + "' AND \"StatusId\" = 1")));
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetFeeRData([FromBody] Predicate model)
        // {
        //     var challanNO = new String(model.ProvidedString);
        //     return Ok(this.db.StudentChallanReportFu.Where(e => e.StatusId == 1 && e.ChallanNo == challanNO && e.PaidDate == null));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeRData([FromBody] Predicate model)
        {
            if (validateinputvalue(model.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var challanNO = new String(model.ProvidedString);
            string sql = String.Format(@"Select * from ""Fee"".""ChallanReport""('{0}')", challanNO);

            // return Ok(this.repo.FindBy(e => e.StatusId == 1 && e.SessionId == SessionID && e.CampusId == CampusID  && e.ClassId == ClassID ).OrderBy(e=>e.DayName));
            return Ok(this.db.StudentChallanReportFu.FromSql(sql));
            //return Ok(this.repo.FromSql<StudentChallanReportFu>(String.Format("Select * from \"Fee\".\"ChallanReport\"('" + model.ProvidedString + "')")));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTansportData([FromBody] Predicate model)
        {
            // var admissionFormId = new Guid(model.ProvidedString);
            return Ok(this.db.TransportChallanReport.Where(e => e.StatusId == 1 && e.ChallanNo == model.ProvidedString));
            //return Ok(this.repo.FindBy<TransportChallanReport>(String.Format("WHERE \"ChallanNo\"='" + model.ProvidedString + "' AND \"StatusId\" = 1")));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeByPaidDate([FromBody] Predicate model)
        {
            DateTime paidDate = Convert.ToDateTime(model.ProvidedString);

            var query = String.Format("Select count(\"AdmissionFormId\") From \"Fee\".\"VW-StudentFeeVM\"  where \"PaidDate\" is not NULL and \"StatusId\"= 1");
            return Ok(this.db.Database.ExecuteSqlCommand(query));
            // return Ok(this.VMrepository.FindBy(e => e.StatusId == 1 && e.PaidDate == paidDate));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSingleConcessionFeeByRefrenceNo([FromBody] Predicate model)
        {
            var RefrenceNo = new String(model.ProvidedString);
            List<StudentConcessedData> res = new List<StudentConcessedData>();
            res.AddRange(this.db.StudentConcessedData.FromSql(String.Format(GetSingleConcessionStudent, RefrenceNo)).ToList<StudentConcessedData>());
            return Ok(res);
            //return Ok(this.db.FeeStudentChallanVM.Where(e => e.StatusId == 1 && e.RefferenceNo == RefrenceNo && e.PaidDate == null));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertPaidDate([FromBody] Predicate model)
        {
            var rtv = new RTV() { ReturnValue = 0 };
            var ChallanNo = new String(model.ProvidedString.Split("?")[0]);
            DateTime paidDate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var Collectorid = new Guid(model.ProvidedString.Split("?")[2]);
            var Studentchallanid = new Guid(model.ProvidedString.Split("?")[3]);
            var campusBankLinkId = new Guid(model.ProvidedString.Split("?")[4]);
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"InsertPaidDate\"('{0}','{1}','{2}','{3}','{4}','{5}') as val; commit;", ChallanNo, paidDate, Collectorid, Studentchallanid, Data, campusBankLinkId);
            Console.WriteLine(json);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv);

        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult InsertPaidStudenChallanForRefund([FromBody] Predicate model)
        // {
        //     var rtv = new RTV() { ReturnValue = 0 };


        //     var studentchallanid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var refundamount = model.ProvidedString.Split("?")[1];
        //     DateTime refunddate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
        //     var userid = Convert.ToInt16(model.ProvidedString.Split("?")[3]);
        //     var Data = this.log.GetLog();
        //     var feeheadid=new Guid(model.ProvidedString.Split("?")[4]);
        //     DateTime chequeIssueDated = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
        //     var chequeNo = model.ProvidedString.Split("?")[6];
        //      var payeeName = model.ProvidedString.Split("?")[7];

        //     var remarks = model.ProvidedString.Split("?")[8];
        //                 var campusBankLinkId = new Guid(model.ProvidedString.Split("?")[9]);

        //     var studentData = model.ProvidedString.Split("?")[10];




        //     string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"InsertRefundChallan\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}') as val; commit;", studentchallanid, refundamount, refunddate, userid, Data, feeheadid,chequeIssueDated,chequeNo,payeeName,remarks,campusBankLinkId,studentData);
        //     Console.WriteLine(json);


        //     IDbConnection connection = db.Database.GetDbConnection();
        //     if (connection.State == ConnectionState.Closed)
        //         connection.Open();
        //     rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
        //     if (connection.State == ConnectionState.Open)
        //     {
        //         connection.Close();
        //         connection.Dispose();
        //     }

        //     return Ok(rtv);

        // }


[HttpPost]
[Route("[action]")]
public IActionResult InsertPaidStudenChallanForRefund([FromBody] Predicate model)
{
    var rtv = new RTV { ReturnValue = 0 };

    if (string.IsNullOrWhiteSpace(model?.ProvidedString))
        return BadRequest("Invalid payload");

    var parts = model.ProvidedString.Split('?', 11);
    if (parts.Length < 11)
        return BadRequest("Payload format is invalid");

    Guid studentChallanId = Guid.Parse(parts[0]);
    int refundAmount = int.Parse(parts[1]);
    DateTime refundDate = DateTime.Parse(parts[2]);
    int userId = int.Parse(parts[3]);
    Guid feeHeadId = Guid.Parse(parts[4]);
    DateTime chequeIssueDate = DateTime.Parse(parts[5]);
    string chequeNo = parts[6];
    string payeeName = parts[7];
    string remarks = parts[8];
    Guid campusBankLinkId = Guid.Parse(parts[9]);
    string studentFeeJson = parts[10];

    // Debug query
    Console.WriteLine("Student Fee JSON: " + studentFeeJson);

    // Use EF Core connection without disposing
    var connection = db.Database.GetDbConnection();
    if (connection.State != ConnectionState.Open)
        connection.Open();

    string sql = @"
        SELECT ""Fee"".""InsertRefundChallan""(
            @studentchallanid,
            @refundamount,
            @refunddate::date,
            @userid,
            @userlog::json,
            @feeheadid,
            @chequeissuedated::date,
            @chequeno,
            @payeename,
            @remarks,
            @campusbanklinkid,
            @studentfeedata::json
        ) AS val;
    ";

    rtv.ReturnValue = connection.Query<int>(sql, new
    {
        studentchallanid = studentChallanId,
        refundamount = refundAmount,
        refunddate = refundDate,
        userid = userId,
        userlog = this.log.GetLog(),
        feeheadid = feeHeadId,
        chequeissuedated = chequeIssueDate,
        chequeno = chequeNo,
        payeename = payeeName,
        remarks = remarks,
        campusbanklinkid = campusBankLinkId,
        studentfeedata = studentFeeJson
    }).FirstOrDefault();

    // Do other operations like Finance.ProcessToFinance after this
    return Ok(rtv);
}






[HttpPost]
[Route("[action]")]
public IActionResult InsertPaidStudenChallan([FromBody] Predicate model)
{
    var rtv = new RTV { ReturnValue = 0 };

    if (string.IsNullOrWhiteSpace(model?.ProvidedString))
        return BadRequest("Invalid payload");

    var parts = model.ProvidedString.Split('?', 3);
    if (parts.Length < 3)
        return BadRequest("Payload format is invalid");

    Guid studentChallanId = Guid.Parse(parts[0]);
       int userId = int.Parse(parts[1]);

    string studentFeeJson = parts[2];

    // Debug query
    Console.WriteLine("Student Fee JSON: " + studentFeeJson);

    // Use EF Core connection without disposing
    var connection = db.Database.GetDbConnection();
    if (connection.State != ConnectionState.Open)
        connection.Open();

    string sql = @"
        SELECT ""Fee"".""InsertReversalChallan""(
            @studentchallanid,
            @userid,
          
            @studentfeedata::json,
                        @userlog::json

        ) AS val;
    ";

    rtv.ReturnValue = connection.Query<int>(sql, new
    {
        studentchallanid = studentChallanId,
                userid = userId,

        studentfeedata = studentFeeJson,

        userlog = this.log.GetLog(),
   
    }).FirstOrDefault();

    // Do other operations like Finance.ProcessToFinance after this
    return Ok(rtv);
}
// Model for student fee JSON


        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult UpdateStudenChallanForRefund([FromBody] Predicate model)
        // {
        //     var rtv = new RTV() { ReturnValue = 0 };


        //     var refundchallanid = new Guid(model.ProvidedString.Split("?")[0]);
        //     var refundamount = model.ProvidedString.Split("?")[1];
        //     DateTime refunddate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
        //     var userid = Convert.ToInt16(model.ProvidedString.Split("?")[3]);
        //     var Data = this.log.GetLog();
        //                 var studentfeedata = model.ProvidedString.Split("?")[4];

        //     string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"UpdateRefundChallan\"('{0}','{1}','{2}','{3}','{4}','{5}') as val; commit;", refundchallanid, refundamount, refunddate, userid, Data,studentfeedata);
        //     Console.WriteLine(json);

        //     IDbConnection connection = db.Database.GetDbConnection();
        //     if (connection.State == ConnectionState.Closed)
        //         connection.Open();
        //     rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
        //     if (connection.State == ConnectionState.Open)
        //     {
        //         connection.Close();
        //         connection.Dispose();
        //     }

        //     return Ok(rtv);

        // }


    [HttpPost]
[Route("[action]")]
public IActionResult UpdateStudenChallanForRefund([FromBody] Predicate model)
{
    var rtv = new RTV { ReturnValue = 0 };

    if (string.IsNullOrWhiteSpace(model?.ProvidedString))
        return BadRequest(new { data = "Invalid payload" });

    // Split payload into 9+ parts
    var parts = model.ProvidedString.Split('?');
    if (parts.Length < 9)
        return BadRequest(new { data = "Payload format is invalid" });

    try
    {
        Guid refundChallanId = Guid.Parse(parts[0]);
        int refundAmount = int.Parse(parts[1]);
        DateTime refundDate = DateTime.Parse(parts[2]);
        int userId = int.Parse(parts[3]);
        string payeeName = parts[4];
        string chequeNo = parts[5];
        DateTime chequeIssueDate = DateTime.Parse(parts[6]);
        Guid campusBankLinkId = Guid.Parse(parts[7]);
        string studentFeeJson = parts[8]; // JSON array of fee heads

        string userLogJson = this.log.GetLog();

        // Debug
        Console.WriteLine("Student Fee JSON: " + studentFeeJson);

        var connection = db.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
            connection.Open();

        string sql = @"
            SELECT ""Fee"".""UpdateRefundChallan""(
                @refundchallanid,
                @refundamount,
                @refunddate::date,
                @userid,
                @userlog::json,
                @payeeName,
                @chequeNo,
                @chequeIssueDate::date,
                @campusBankLinkId,
                @studentfeedata::json
            ) AS val;
        ";

        rtv.ReturnValue = connection.Query<int>(sql, new
        {
            refundchallanid = refundChallanId,
            refundamount = refundAmount,
            refunddate = refundDate,
            userid = userId,
            userlog = userLogJson,
            payeeName,
            chequeNo,
            chequeIssueDate,
            campusBankLinkId,
            studentfeedata = studentFeeJson
        }).FirstOrDefault();
    }
    catch (Exception ex)
    {
        return BadRequest(new { data = "Error parsing payload", error = ex.Message });
    }

    return Ok(rtv);
}



        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckAllrefundchallanofAchallan([FromBody] Predicate model)
        {
            var rtv = new RTV() { ReturnValue = 0 };


            var challanno = new string(model.ProvidedString.Split("?")[0]);
            
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"CheckTotalRefundChallanamount\"('{0}') as val; commit;", challanno);
            Console.WriteLine(json);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv);

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertPaidDateAdmins([FromBody] Predicate model)
        {
            var rtv = new RTV() { ReturnValue = 0 };
            var ChallanNo = new String(model.ProvidedString.Split("?")[0]);
            DateTime paidDate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var Collectorid = new Guid(model.ProvidedString.Split("?")[2]);
            var Studentchallanid = new Guid(model.ProvidedString.Split("?")[3]);
            var campusBankLinkId = new Guid(model.ProvidedString.Split("?")[4]);
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"InsertPaidDateAdmins\"('{0}','{1}','{2}','{3}','{4}','{5}') as val; commit;", ChallanNo, paidDate, Collectorid, Studentchallanid, Data, campusBankLinkId);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv);

        }
        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAllDisableChallans([FromBody] Predicate model)
        {
            var sql = String.Format(@"SELECT * FROM ""Fee"".""StudentAllDisableChallans1""('{0}')", model.ProvidedString);
            return Ok(this.db.DisableChallans.FromSql(sql));
        }
         [HttpPost]
        [Route("[action]")]

        public IActionResult GetAllRfundChallanofaChallan([FromBody] Predicate model)
        {
            var sql = String.Format(@"SELECT * FROM ""Fee"".""GetAllRefundChallanofaChallanNew""('{0}')", model.ProvidedString);
            return Ok(this.db.AllalreadyRefundChallan.FromSql(sql));
        }
[AllowAnonymous]
[IgnoreAntiforgeryToken]
[HttpPost]
        [Route("[action]")]
          public IActionResult GetReversalChallan([FromBody] Predicate model)
        {

          var challanno = new String(model.ProvidedString.Split("?")[0]);

            var sql = String.Format(@"SELECT * FROM ""Fee"".""GetReversalChallanNew""('{0}')",challanno);

          
            return Ok(this.db.ReversalChalln.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFinanceData([FromBody] Predicate model)
        {

            DateTime dated = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var sql = String.Format(@"SELECT * FROM ""Finance"".""FinanceData""('{0}',{1})", dated, userid);
            return Ok(this.db.FinanceData.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertPaidDateEx([FromBody] Predicate model)
        {
            var ChallanNo = new String(model.ProvidedString.Split("?")[0]);
            DateTime paidDate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var Collectorid = new Guid(model.ProvidedString.Split("?")[2]);
            var Studentchallanid = new Guid(model.ProvidedString.Split("?")[3]);
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"InsertPaidDateEx\"('{0}','{1}','{2}','{3}','{4}'); commit;", ChallanNo, paidDate, Collectorid, Studentchallanid, Data);

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
        public IActionResult updatePaidDate([FromBody] Predicate model)
        {
            var ChallanNo = new String(model.ProvidedString.Split("?")[0]);
            DateTime paidDate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var Collectorid = new Guid(model.ProvidedString.Split("?")[2]);
            var Studentchallanid = new Guid(model.ProvidedString.Split("?")[3]);
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"UpdatePaidDateCollector\"('{0}','{1}','{2}','{3}','{4}'); commit;", ChallanNo, paidDate, Collectorid, Studentchallanid, Data);

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
        public IActionResult PrChallanExExist([FromBody] Predicate predicate)
        {
            var challan = predicate.ProvidedString.Split("?")[0];
            StudentFeeExist z = new StudentFeeExist() { CheckFeeStructure = Guid.NewGuid() };

            var sqlque = String.Format(@"select ""ClassId"" as ""CheckFeeStructure"" from ""Fee"".""StudentChallan"" where ""ChallanNo""='{0}'", challan);
            // Console.WriteLine(sqlque);
            z.CheckFeeStructure = this.db.StudentFeeExist.FromSql(sqlque).FirstOrDefault().CheckFeeStructure;
            var challantypeid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var username = predicate.ProvidedString.Split("?")[2];

            var challanReport = new List<ChallanBReportEx>();
            var generalList = new GeneralListEx();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportEx();
            var infod = new InfoList();
            var bank = new BankDataList();
            var challanNote = new List<FeeCampusChallanNoteLinkVM>();
            string strRes = "<br/> Note: <br/> ";

            string strRr = "<strong> ";
            model = new ChallanBReportEx();
            string ql = String.Format(@"Select * from ""Fee"".""ChallanReport""('{0}')", challan);
            var data = this.db.StudentChallanReportFu.FromSql(ql).ToList();
            model.ChallanNo = data[0].ChallanNo;
            model.AttendencePercentage = data[0].AttendencePercentage;
            model.FromDate = data[0].FromDate;
            model.ToDate = data[0].ToDate;
            var bankNote = this.db.ClassNote.Where(e => e.ClassId == data[0].ClassId).ToList();
            if (challantypeid.ToString() == "73d41647-8f68-4af1-a365-75e286f3f59b")
            {
                var jk = data[0].InstallmentNo.Substring(13, 1);
                var inst = Convert.ToInt32(jk);
                challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.InstallmentNo == inst && e.ChallanTypeId == challantypeid).ToList();
            }
            else
            {
                challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.ChallanTypeId == challantypeid).ToList();

            }
            if (challanNote.Count > 0)
            {
                foreach (var cNote in challanNote)
                {
                    cNote.Description = String.Concat("<li>", cNote.Description);
                    cNote.Description = String.Concat(cNote.Description, "</li>");
                    strRes = String.Concat(strRes, cNote.Description);
                }
            }

            generalList = new GeneralListEx();
            generalList.BusinessUnit = data[0].BusinessUnit;
            generalList.CampusName = data[0].CampusName;
            generalList.Cap = data[0].Cap;
            generalList.ChallanAmount = data[0].ChallanAmount;
            generalList.ChallanNo = data[0].ChallanNo;
            generalList.CustomerCode = data[0].CustomerCode;
            generalList.Description = data[0].Description;
            generalList.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
            generalList.DueDate = data[0].DueDate;
            generalList.FatherName = data[0].FatherName;
            generalList.FullName = data[0].FullName;
            if (z.CheckFeeStructure.ToString() == "10bfa10a-2582-46db-ba80-ae326fee2b48")
            {
                generalList.InstallmentNo = "Pre Fee";
            }
            else { generalList.InstallmentNo = data[0].InstallmentNo; }

            generalList.ObtainMarks = data[0].ObtainMarks;
            generalList.TotalMarks = data[0].TotalMarks;
            generalList.RefferenceNo = data[0].RefferenceNo;
            generalList.SectionName = data[0].SectionName;
            generalList.UserName = username;

            strRr = String.Concat(strRr, data[0].ZoneNote);
            strRr = String.Concat(strRr, "</strong>");
            strRr = String.Concat(strRr, strRes);
            generalList.ChallanNote = strRr;
            if (bankNote.Count > 0)
            {
                generalList.BankIban = bankNote[0].ChallanNote;
            }
            else
            {
                generalList.BankIban = "";
            }
            model.General = generalList;

            string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
            // Console.WriteLine(sqlex);
            var bankresult = this.db.CampusBank.FromSql(sqlex);
            foreach (var itemdata in data)
            {
                infod = new InfoList();
                infod.ChallanNo = itemdata.ChallanNo;
                infod.ConcessionName = itemdata.ConcessionName;
                infod.FeeAmount = itemdata.FeeAmount;
                infod.FeeHead = itemdata.FeeHead;
                infod.PayableAmount = itemdata.PayableAmount;
                infoList.Add(infod);
            }

            model.ChallanInfo.AddRange(infoList);
            infoList = new List<InfoList>();

            foreach (var bankdata in bankresult)
            {
                bank = new BankDataList();
                bank.ChallanNo = data[0].ChallanNo;
                bank.BankName = bankdata.BankName;
                bank.Address = bankdata.Address;
                bank.AccountNo = bankdata.AccountNo;
                bankList.Add(bank);

            }
            model.Banks.AddRange(bankList);
            bankList = new List<BankDataList>();
            if (challantypeid.ToString() == "73d41647-8f68-4af1-a365-75e286f3f59b")
            {
                var jk = data[0].InstallmentNo.Substring(13, 1);
                var inst = Convert.ToInt32(jk);



                var challan2 = this.db.FeeStudentChallan.Where(s => s.StatusId == 1 && s.AdmissionFormId == data[0].AdmissionFormId && s.InstallmentNo == inst && s.PaidDate == null && s.ChallanTypeId == challantypeid && s.ClassId == z.CheckFeeStructure).ToList();
                if (challan2.Count > 1)
                {
                    foreach (var subchallan in challan2)
                    {
                        if (subchallan.ChallanNo != data[0].ChallanNo)

                        {
                            subinst = new SubInstList();
                            subinst.ChallanNo = data[0].ChallanNo;
                            subinst.ChallanNoEx = subchallan.ChallanNo;
                            subinst.DueDate = subchallan.DueDate;
                            subinst.FeeAmount = subchallan.FeeAmount;
                            NextInstallment.Add(subinst);
                        }
                    }
                }
                else
                {
                    subinst = new SubInstList();
                    subinst.ChallanNo = data[0].ChallanNo;
                    subinst.ChallanNoEx = "";
                    subinst.DueDate = null;
                    subinst.FeeAmount = 0;
                    NextInstallment.Add(subinst);
                }
            }
            else
            {
                subinst = new SubInstList();
                subinst.ChallanNo = data[0].ChallanNo;
                subinst.ChallanNoEx = "";
                subinst.DueDate = null;
                subinst.FeeAmount = 0;
                NextInstallment.Add(subinst);
            }
            if (z.CheckFeeStructure.ToString() == "10bfa10a-2582-46db-ba80-ae326fee2b48")
            {
                subinst.ChallanNo = "";
                subinst.ChallanNoEx = "";
                subinst.DueDate = null;
                subinst.FeeAmount = 0;
            }
            model.NextInstallment.AddRange(NextInstallment);
            NextInstallment = new List<SubInstList>();
            challanReport.Add(model);

            return Ok(challanReport);

        }
    [HttpPost]
        [Route("[action]")]
        public IActionResult PrChallanEx([FromBody] Predicate predicate)
        {
            var challan = predicate.ProvidedString.Split("?")[0];
            StudentFeeExist z = new StudentFeeExist() { CheckFeeStructure = Guid.NewGuid() };

            var sqlque = String.Format(@"select ""ClassId"" as ""CheckFeeStructure"" from ""Fee"".""StudentChallan"" where ""ChallanNo""='{0}'", challan);
            // Console.WriteLine(sqlque);
            z.CheckFeeStructure = this.db.StudentFeeExist.FromSql(sqlque).FirstOrDefault().CheckFeeStructure;
            var challantypeid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var username = predicate.ProvidedString.Split("?")[2];

            var challanReport = new List<ChallanBReportExLatest>();
            var generalListLatest = new GeneralListExLatest();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportExLatest();
            var infod = new InfoList();
            var bank = new BankDataList();
            var challanNote = new List<FeeCampusChallanNoteLinkVM>();
            string strRes = "<br/> Note: <br/> ";

            string strRr = "<strong> ";
            model = new ChallanBReportExLatest();
            string ql = String.Format(@"Select * from ""Fee"".""ChallanReportLatest""('{0}')", challan);
            var data = this.db.StudentChallanReportFuLatest.FromSql(ql).ToList();
            model.ChallanNo = data[0].ChallanNo;
            model.AttendencePercentage = data[0].AttendencePercentage;
            model.FromDate = data[0].FromDate;
            model.ToDate = data[0].ToDate;
            var bankNote = this.db.ClassNote.Where(e => e.ClassId == data[0].ClassId).ToList();
            if (challantypeid.ToString() == "73d41647-8f68-4af1-a365-75e286f3f59b")
            {
                var jk = data[0].InstallmentNo.Substring(13, 1);
                var inst = Convert.ToInt32(jk);
                challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.InstallmentNo == inst && e.ChallanTypeId == challantypeid).ToList();
            }
            else
            {
                challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.ChallanTypeId == challantypeid).ToList();

            }
            if (challanNote.Count > 0)
            {
                foreach (var cNote in challanNote)
                {
                    cNote.Description = String.Concat("<li>", cNote.Description);
                    cNote.Description = String.Concat(cNote.Description, "</li>");
                    strRes = String.Concat(strRes, cNote.Description);
                }
            }

            generalListLatest = new GeneralListExLatest();
            generalListLatest.BusinessUnit = data[0].BusinessUnit;
            generalListLatest.Prefix = data[0].Prefix;
            generalListLatest.MobileApp = data[0].MobileApp;
            generalListLatest.MobileApp1 = data[0].MobileApp1;
            generalListLatest.MobileApp2 = data[0].MobileApp2;
            generalListLatest.MobileApp3 = data[0].MobileApp3;
            generalListLatest.MobileApp4 = data[0].MobileApp4;
            generalListLatest.MobileApp5 = data[0].MobileApp5;
            generalListLatest.CampusName = data[0].CampusName;
            generalListLatest.Cap = data[0].Cap;
            generalListLatest.ChallanAmount = data[0].ChallanAmount;
            generalListLatest.ChallanNo = data[0].ChallanNo;
            generalListLatest.CustomerCode = data[0].CustomerCode;
            generalListLatest.Description = data[0].Description;
            generalListLatest.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
            generalListLatest.DueDate = data[0].DueDate;
            generalListLatest.FatherName = data[0].FatherName;
            generalListLatest.FullName = data[0].FullName;
            if (z.CheckFeeStructure.ToString() == "10bfa10a-2582-46db-ba80-ae326fee2b48")
            {
                generalListLatest.InstallmentNo = "Pre Fee";
            }
            else { generalListLatest.InstallmentNo = data[0].InstallmentNo; }

            generalListLatest.ObtainMarks = data[0].ObtainMarks;
            generalListLatest.TotalMarks = data[0].TotalMarks;
            generalListLatest.RefferenceNo = data[0].RefferenceNo;
            generalListLatest.SectionName = data[0].SectionName;
            generalListLatest.UserName = username;

            strRr = String.Concat(strRr, data[0].ZoneNote);
            strRr = String.Concat(strRr, "</strong>");
            strRr = String.Concat(strRr, strRes);
            generalListLatest.ChallanNote = strRr;
            if (bankNote.Count > 0)
            {
                generalListLatest.BankIban = bankNote[0].ChallanNote;
            }
            else
            {
                generalListLatest.BankIban = "";
            }
            model.General = generalListLatest;

            string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
            // Console.WriteLine(sqlex);
            var bankresult = this.db.CampusBank.FromSql(sqlex);
            foreach (var itemdata in data)
            {
                infod = new InfoList();
                infod.ChallanNo = itemdata.ChallanNo;
                infod.ConcessionName = itemdata.ConcessionName;
                infod.FeeAmount = itemdata.FeeAmount;
                infod.FeeHead = itemdata.FeeHead;
                infod.PayableAmount = itemdata.PayableAmount;
                infoList.Add(infod);
            }

            model.ChallanInfo.AddRange(infoList);
            infoList = new List<InfoList>();

            foreach (var bankdata in bankresult)
            {
                bank = new BankDataList();
                bank.ChallanNo = data[0].ChallanNo;
                bank.BankName = bankdata.BankName;
                bank.Address = bankdata.Address;
                bank.AccountNo = bankdata.AccountNo;
                bankList.Add(bank);

            }
            model.Banks.AddRange(bankList);
            bankList = new List<BankDataList>();
            if (challantypeid.ToString() == "73d41647-8f68-4af1-a365-75e286f3f59b")
            {
                var jk = data[0].InstallmentNo.Substring(13, 1);
                var inst = Convert.ToInt32(jk);



                var challan2 = this.db.FeeStudentChallan.Where(s => s.StatusId == 1 && s.AdmissionFormId == data[0].AdmissionFormId && s.InstallmentNo == inst && s.PaidDate == null && s.ChallanTypeId == challantypeid && s.ClassId == z.CheckFeeStructure).ToList();
                if (challan2.Count > 1)
                {
                    foreach (var subchallan in challan2)
                    {
                        if (subchallan.ChallanNo != data[0].ChallanNo)

                        {
                            subinst = new SubInstList();
                            subinst.ChallanNo = data[0].ChallanNo;
                            subinst.ChallanNoEx = subchallan.ChallanNo;
                            subinst.DueDate = subchallan.DueDate;
                            subinst.FeeAmount = subchallan.FeeAmount;
                            NextInstallment.Add(subinst);
                        }
                    }
                }
                else
                {
                    subinst = new SubInstList();
                    subinst.ChallanNo = data[0].ChallanNo;
                    subinst.ChallanNoEx = "";
                    subinst.DueDate = null;
                    subinst.FeeAmount = 0;
                    NextInstallment.Add(subinst);
                }
            }
            else
            {
                subinst = new SubInstList();
                subinst.ChallanNo = data[0].ChallanNo;
                subinst.ChallanNoEx = "";
                subinst.DueDate = null;
                subinst.FeeAmount = 0;
                NextInstallment.Add(subinst);
            }
            if (z.CheckFeeStructure.ToString() == "10bfa10a-2582-46db-ba80-ae326fee2b48")
            {
                subinst.ChallanNo = "";
                subinst.ChallanNoEx = "";
                subinst.DueDate = null;
                subinst.FeeAmount = 0;
            }
            model.NextInstallment.AddRange(NextInstallment);
            NextInstallment = new List<SubInstList>();
            challanReport.Add(model);

            return Ok(challanReport);

        }





        [AllowAnonymous]
[IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult AdhocChallanEx([FromBody] Predicate predicate)
        {
            var challan = predicate.ProvidedString.Split("?")[0];
            // StudentFeeExist z = new StudentFeeExist() { CheckFeeStructure = Guid.NewGuid() };

            // var sqlque = String.Format(@"select ""ClassId"" as ""CheckFeeStructure"" from ""Fee"".""StudentChallan"" where ""ChallanNo""='{0}'", challan);
            // // Console.WriteLine(sqlque);
            // z.CheckFeeStructure = this.db.StudentFeeExist.FromSql(sqlque).FirstOrDefault().CheckFeeStructure;
            var challantypeid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var username = predicate.ProvidedString.Split("?")[2];

            var challanReport = new List<ChallanBReportExLatest>();
            var generalListLatest = new GeneralListExLatest();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportExLatest();
            var infod = new InfoList();
            var bank = new BankDataList();
            var challanNote = new List<FeeCampusChallanNoteLinkVM>();
            string strRes = "<br/> Note: <br/> ";

            string strRr = "<strong> ";
            model = new ChallanBReportExLatest();
            string ql = String.Format(@"Select * from ""Fee"".""AdhocChallanReportLatest""('{0}')", challan);
            var data = this.db.StudentChallanReportFuLatest.FromSql(ql).ToList();
            model.ChallanNo = data[0].ChallanNo;
            model.AttendencePercentage = data[0].AttendencePercentage;
            model.FromDate = data[0].FromDate;
            model.ToDate = data[0].ToDate;
            var bankNote = this.db.ClassNote.Where(e => e.ClassId == data[0].ClassId).ToList();
            if (challantypeid.ToString() == "b4d9e9dd-e2b0-49e6-95e6-e3a722d27c52")
            {
                var jk = 1;
                var inst = 1;
                challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.InstallmentNo == inst && e.ChallanTypeId == challantypeid).ToList();
            }
            else
            {
                challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.ChallanTypeId == challantypeid).ToList();

            }
            if (challanNote.Count > 0)
            {
                foreach (var cNote in challanNote)
                {
                    cNote.Description = String.Concat("<li>", cNote.Description);
                    cNote.Description = String.Concat(cNote.Description, "</li>");
                    strRes = String.Concat(strRes, cNote.Description);
                }
            }

            generalListLatest = new GeneralListExLatest();
            generalListLatest.BusinessUnit = data[0].BusinessUnit;
            generalListLatest.Prefix = data[0].Prefix;
            generalListLatest.MobileApp = data[0].MobileApp;
            generalListLatest.MobileApp1 = data[0].MobileApp1;
            generalListLatest.MobileApp2 = data[0].MobileApp2;
            generalListLatest.MobileApp3 = data[0].MobileApp3;
            generalListLatest.MobileApp4 = data[0].MobileApp4;
            generalListLatest.MobileApp5 = data[0].MobileApp5;
            generalListLatest.CampusName = data[0].CampusName;
            generalListLatest.Cap = data[0].Cap;
            generalListLatest.ChallanAmount = data[0].ChallanAmount;
            generalListLatest.ChallanNo = data[0].ChallanNo;
            generalListLatest.CustomerCode = data[0].CustomerCode;
            generalListLatest.Description = data[0].Description;
            generalListLatest.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
            generalListLatest.DueDate = data[0].DueDate;
            generalListLatest.FatherName = data[0].FatherName;
            generalListLatest.FullName = data[0].FullName;
            // if (z.CheckFeeStructure.ToString() == "10bfa10a-2582-46db-ba80-ae326fee2b48")
            // {
            //     generalListLatest.InstallmentNo = "Pre Fee";
            // }
            // else { generalListLatest.InstallmentNo = data[0].InstallmentNo; }

            generalListLatest.ObtainMarks = data[0].ObtainMarks;
            generalListLatest.TotalMarks = data[0].TotalMarks;
            generalListLatest.RefferenceNo = data[0].RefferenceNo;
            generalListLatest.SectionName = data[0].SectionName;
            generalListLatest.UserName = username;

            strRr = String.Concat(strRr, data[0].ZoneNote);
            strRr = String.Concat(strRr, "</strong>");
            strRr = String.Concat(strRr, strRes);
            generalListLatest.ChallanNote = strRr;
            if (bankNote.Count > 0)
            {
                generalListLatest.BankIban = bankNote[0].ChallanNote;
            }
            else
            {
                generalListLatest.BankIban = "";
            }
            model.General = generalListLatest;

            string sqlex = String.Format(@"Select * from ""Fee"".""GetAdhocBankEx""('{0}')", data[0].CampusId);
            // Console.WriteLine(sqlex);
            var bankresult = this.db.CampusBank.FromSql(sqlex);
            foreach (var itemdata in data)
            {
                infod = new InfoList();
                infod.ChallanNo = itemdata.ChallanNo;
                infod.ConcessionName = itemdata.ConcessionName;
                infod.FeeAmount = itemdata.FeeAmount;
                infod.FeeHead = itemdata.FeeHead;
                infod.PayableAmount = itemdata.PayableAmount;
                infoList.Add(infod);
            }

            model.ChallanInfo.AddRange(infoList);
            infoList = new List<InfoList>();

            foreach (var bankdata in bankresult)
            {
                bank = new BankDataList();
                bank.ChallanNo = data[0].ChallanNo;
                bank.BankName = bankdata.BankName;
                bank.Address = bankdata.Address;
                bank.AccountNo = bankdata.AccountNo;
                bankList.Add(bank);

            }
            model.Banks.AddRange(bankList);
            bankList = new List<BankDataList>();
        
            // if (z.CheckFeeStructure.ToString() == "10bfa10a-2582-46db-ba80-ae326fee2b48")
            // {
            //     subinst.ChallanNo = "";
            //     subinst.ChallanNoEx = "";
            //     subinst.DueDate = null;
            //     subinst.FeeAmount = 0;
            // }
            model.NextInstallment.AddRange(NextInstallment);
            NextInstallment = new List<SubInstList>();
            challanReport.Add(model);

            return Ok(challanReport);

        }



        //Remove Paid Date Generated by Fahad 13-7-2019
        [HttpPost]
        [Route("[action]")]
        public IActionResult RemovePaidDate([FromBody] Predicate model)
        {

            var ChallanNo = new String(model.ProvidedString.Split("?")[0]);
            var Studentchallanid = new Guid(model.ProvidedString.Split("?")[1]);

            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"DeletePaidDate\"('{0}','{1}','{2}'); commit;", ChallanNo, Studentchallanid, Data);
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
        public IActionResult SaveManualExemption([FromBody] Predicate model)
        {

            var admissionFormid = new Guid(model.ProvidedString.Split("?")[0]);
            var installno = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
            var amount = Convert.ToInt64(model.ProvidedString.Split("?")[2]);
            var challanNo = new string(model.ProvidedString.Split("?")[3]);
            var remarkconcess = new string(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);

            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GenerateExemptionManuallySubInstallment\"('{0}',{1},{2},'{3}','{4}','{5}','{6}'); commit;", admissionFormid, installno, amount, challanNo, Data, remarkconcess, classid);
            // Console.WriteLine(json);

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
        public IActionResult ChallanExemptionManually([FromBody] IEnumerable<FeeStudentChallan> entitylist)
        {
            foreach (var v in entitylist)
            {
                this.repository.Update(v);
            }

            return Ok();
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetStudentPaidData()
        {

            return Ok(this.db.FeeStudentChallan.FromSql(String.Format("select * from \"Fee\".\"StudentChallan\"  where \"PaidDate\" is not NULL and \"StatusId\"= 1")));

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetStudentPaidCount()
        {

            return Ok(this.db.StudentPaidCountData.FromSql(String.Format("select count(DISTINCT \"AdmissionFormId\") AS \"FeeCount\" from \"Fee\".\"StudentChallan\"  where \"PaidDate\" is not NULL and \"StatusId\"= 1")));

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetStudentReportData()
        {

            return Ok(this.db.StudentReportData.FromSql(String.Format("select * from \"Fee\".\"feerreportsdata\" ")));

        }

        [HttpPost]
        //Newly made Function
        [Route("[action]")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public IActionResult GetStudentReportDatas([FromBody] Predicate model)
        {

            return Ok(this.db.StudentReportData.FromSql(String.Format("select * from \"Fee\".\"VW_FeeReportDataNew\" Where \"ChallanNo\"='{0}' and \"StatusId\"=1 ", model.ProvidedString)));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GenerateManualSubInst([FromBody] Predicate model)
        {
            var studentchallanJson = model.ProvidedString.Split("?")[0];
            var challanNo = model.ProvidedString.Split("?")[1];
            var Data = this.log.GetLog();

            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GeneratManualSubIns\"('{0}','{1}','{2}'); commit;", studentchallanJson, challanNo, Data);
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
        public IActionResult GenerateSubInstallment([FromBody] Predicate model)
        {
            var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
            var challanNo = new string(model.ProvidedString.Split("?")[1]);
            var installNo = Convert.ToInt16(model.ProvidedString.Split("?")[2]);
            var SubInstallmentNo = Convert.ToInt16(model.ProvidedString.Split("?")[3]);
            var ManualAmount = Convert.ToInt32(model.ProvidedString.Split("?")[4]);
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GenerateSubInstallment\"('{0}','{1}','{2}','{3}','{4}',{5}); commit;", Admissionform, challanNo, installNo, SubInstallmentNo, Data, ManualAmount);

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
        public IActionResult GenerateExemption([FromBody] Predicate model)
        {
            var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
            var installNo = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
            var ManualAmount = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var CampusId = new Guid(model.ProvidedString.Split("?")[3]);
            var SessionId = new Guid(model.ProvidedString.Split("?")[4]);
            var challanNo = new string(model.ProvidedString.Split("?")[5]);
            var remarksconcess = new string(model.ProvidedString.Split("?")[6]);
            var Data = this.log.GetLog();

            //string json1 = String.Format("SELECT \"Message\".\"UserlogInsertion\"('{0}')",Data );
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GenerateExemption\"('{0}',{1},{2},'{3}','{4}','{5}','{6}','{7}'); commit;", Admissionform, installNo, ManualAmount, CampusId, SessionId, challanNo, remarksconcess, Data);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            //connection.Execute(json1);
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
        public IActionResult GenerateFullFeeChallan([FromBody] Predicate model)
        {
            var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            //var Admissionform = new Guid(model.ProvidedString);
            var Data = this.log.GetLog();

            //string json1 = String.Format("SELECT \"Message\".\"UserlogInsertion\"('{0}')",Data );
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin;SELECT pg_advisory_xact_lock(1);  SELECT \"Fee\".\"GenerateFullFeeChallan\"('{0}','{1}','{2}'); commit;", Admissionform, Data, classid);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            //connection.Execute(json1);
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
        public IActionResult RevertFullFeeChallan([FromBody] Predicate model)
        {
            var rtv = new Predicate() { ProvidedString = "" };
            var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            var Data = this.log.GetLog();
            string json = String.Format("SELECT \"Fee\".\"ReverseFullFeeChallan\"('{0}','{1}','{2}' ) as \"ProvidedString\";", Admissionform, Data, classid);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ProvidedString = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult RevertExemption([FromBody] Predicate model)
        {
            var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
            var installNo = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
            var challanType = new Guid(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[3]);
            var Data = this.log.GetLog();
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"RevertExemption\"('{0}',{1},'{2}','{3}','{4}'); commit;", Admissionform, installNo, challanType, Data, classid);
            // Console.WriteLine(json);
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
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult StudentFeeDetailDescription([FromBody] Predicate predicate)
        {
            var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]));
            var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]));
            // string json = String.Format("SELECT * from \"Fee\".\"StudentFeeDetailDescription\"('{0}','{1}');", fromDate,toDate);
            // // Console.WriteLine(json);
            string query = string.Format(@"SELECT ""Activity"", ""Activity_DateTime"", ""Month_Campus_Class_Fee_Structure_Detail_ID"", ""Status_ID"", ""Payable_Date"", ""Challan_Number"", ""Student_Name"", ""Father_Name"", ""Class"", ""Ref_No"", ""Reg_No"", ""Section"", ""Fee_For"", ""Legal_Entity"", ""Cluster"", ""Campus"", ""City"", ""Program"", ""Description"", ""Session"", ""Academic_Year"", ""Bank_Name"", ""Admission"", ""DiscountOnAdmission"", ""Tuition"", ""DiscountOnTuition"", ""Misc_Charges"", ""DiscountOnBoardRegistration_Exam_Sport_CollegeCard_Building_Mis"", ""DiscountOnOtherFeeHeads"", ""Discount"", ""Fine"", ""Late_Fee_Fine"", ""Total_Payable"", ""Due_Date"", ""Over_Due_Amount"", ""Print_Date"", ""Bank_Account"", ""PayDate"", ""ModeOfPayment"", ""Campus_ID"", ""GenerationDate"", ""BoardRegistrationSportsHouseCollegeExam"", ""CollegeFee"", ""Transportation"", ""BoardRegistrationFee"", ""UniversityRegistrationFee"", ""BoardExamFee"", ""UniversityExamFee"", ""EntryTestFee"", ""StatusId""
	FROM ""Finance"".""DetailFeeDailyReportDataEx"" WHERE ""PayDate"">='{0}' and ""PayDate""<='{1}'  ;", fromDate, toDate);
            // Console.WriteLine(query, fromDate, toDate);
            return Ok(this.db.StudentFeesdetailActivity.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckPaidInstallment([FromBody] Predicate model)
        {
            var rtv = new RTV() { ReturnValue = 0 };
            var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
            var installNo = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
            var challantypeid = new Guid(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[3]);

            string json = String.Format(" SELECT \"Fee\".\"CheckPaidInstallment\"('{0}',{1},'{2}','{3}') as val", Admissionform, installNo, challantypeid, classid);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult MultipleInstallments([FromBody] Predicate model)
        {
            var rtv = new RTV2() { ReturnValue = "" };
            var list = (model.ProvidedString.Split("?")[0]);
            var challanno = (model.ProvidedString.Split("?")[1]);
            var log = this.log.GetLog();


            string json = String.Format(" SELECT \"Fee\".\"MultipleInstallments\"('{0}','{1}','{2}') as ReturnValue", list, challanno, log);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<RTV2>(json).FirstOrDefault().ReturnValue;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeByChallanNo([FromBody] Predicate model)


        {
            try
            {
                var searchparam = (model.ProvidedString.Split("?")[0]);
                var userid = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""getStudentsFee""('{0}',{1})", searchparam, userid);
                // Console.WriteLine(sql);

                return Ok(this.db.FeeStudentChallanVM.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeByChallanNoPaid([FromBody] Predicate model)


        {
            try
            {
                var searchparam = (model.ProvidedString.Split("?")[0]);
                var userid = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""getStudentsFeePaid""('{0}',{1})", searchparam, userid);
                // Console.WriteLine(sql);

                return Ok(this.db.FeeStudentChallanVM.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        
        [HttpPost]        
        [Route("[action]")]
        public IActionResult GetRefundFeeByChallanNo([FromBody] Predicate model)


        {
            try
            {
                var searchparam = (model.ProvidedString.Split("?")[0]);
                var userid = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""getStudentsFeeToRefund""('{0}',{1})", searchparam, userid);
                // Console.WriteLine(sql);

                return Ok(this.db.FeeStudentChallanVM.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        
        [HttpPost]        
        [Route("[action]")]
        public IActionResult GetRefundChallanOfStudent([FromBody] Predicate model)
        {
            try
            {
                var searchparam = (model.ProvidedString.Split("?")[0]);
                             
                string sql = String.Format(@"SELECT * FROM ""Admission"".""getPaidStudenChallanForRefund3""('{0}','{1}')", searchparam,DomainContext.User.UserId);
                // Console.WriteLine(sql);

                return Ok(this.db.RefundChallanofStudent.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeePaid([FromBody] Predicate model)


        {
            try
            {
                DateTime dated = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);
                var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

                string json = String.Format(@"select * from ""Dashboard"".""getchallanDetail""('{0}',{1})", dated, userid);

                // Console.WriteLine(json);
                return Ok(this.db.StudentFeePaid.FromSql(json));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        //         [HttpPost]
        //         [Route("[action]")]
        //         public IActionResult GetFeeByChallanNo([FromBody] Predicate model)
        //         {
        //             try
        //             {
        //                 string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Fee"".""VW-StudentFeeVM"" AS cv', 'cv.""StatusId""=1 and cv.""ChallanNo""=''{0}''')
        // AS ""FeeStudentChallanVM"" (
        //     ""FeeHeadId""UUID,
        // ""stfeeamount""INT4,
        // ""PayableAmount""INT4,
        //     ""ChallanNo""text,
        //         ""DocumentNo""text,
        //         ""DueDate""DATE,
        //         ""PaidDate""DATE,
        //         ""StatusId""INT4,
        //         ""RefferenceNo""TEXT,
        //         ""FullName""TEXT,
        //     ""FatherName""TEXT,
        //     ""CampusName""TEXT,
        //     ""Description""TEXT,
        //     ""ConcessionName""TEXT,
        //     ""StudentFeeStructureId""UUID,
        //     ""AdmissionFormId""UUID,
        //     ""StudentChallanId""UUID,
        //     ""ConcessionDetailId""UUID,
        //     ""CampusId""UUID,
        //     ""ProgramDetailId""UUID,
        //     ""InstallmentNo""INT4,
        //     ""FeeHead""TEXT,
        //     ""LoggerId""UUID,
        //     ""BankId""UUID,
        //     ""BankName""TEXT,
        //     ""Branch""TEXT,
        //     ""FeeAmount""INT4,
        //     ""AccountNo""text,
        //     ""Code""TEXT,
        //     ""ClassName""TEXT,
        //     ""ProgramName""TEXT,
        //     ""CollectorName""TEXT); ", model.ProvidedString);
        //                 // Console.WriteLine(sql);

        //                 return Ok(this.db.FeeStudentChallanVM.FromSql(sql));
        //             }
        //             catch (Exception err)
        //             {
        //                 AppException app = new AppException();
        //                 app.Message = "Error on , " + err.Message;
        //                 app.Time = DateTime.Now;
        //                 app.Data = JsonConvert.SerializeObject(model);
        //                 this.db.AppException.Add(app);
        //                 this.db.SaveChangesAsync();
        //                 return BadRequest(app.Message);
        //             }
        //         }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CancelChallan([FromBody] Predicate model)
        {

            var Data = this.log.GetLog();
            string json = String.Format(@"select * from ""Fee"".""CancelChallan""('{0}')", model.ProvidedString);
            // Console.WriteLine(json);
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
        public IActionResult GetFeeCancelByChallanNo([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Fee"".""VWChallanCancel"" AS cv', 'cv.""StatusId""=1 and cv.""ChallanNo""=''{0}''')
AS ""FeeStudentChallanVM"" (
    ""FeeHeadId""UUID,
""stfeeamount""INT4,
""PayableAmount""INT4,
    ""ChallanNo""text,
        ""DocumentNo""text,
        ""DueDate""DATE,
        ""PaidDate""DATE,
        ""StatusId""INT4,
        ""RefferenceNo""TEXT,
        ""FullName""TEXT,
    ""FatherName""TEXT,
    ""CampusName""TEXT,
    ""Description""TEXT,
    ""ConcessionName""TEXT,
    ""StudentFeeStructureId""UUID,
    ""AdmissionFormId""UUID,
    ""StudentChallanId""UUID,
    ""ConcessionDetailId""UUID,
    ""CampusId""UUID,
    ""ProgramDetailId""UUID,
    ""InstallmentNo""INT4,
    ""FeeHead""TEXT,
    ""LoggerId""UUID,
    ""BankId""UUID,
    ""BankName""TEXT,
    ""Branch""TEXT,
    ""FeeAmount""INT4,
    ""AccountNo""text,
    ""Code""TEXT,
    ""ClassName""TEXT,
    ""ProgramName""TEXT,
    ""CollectorName""TEXT,
    ""SessionId"" uuid,
    ""CampusProgramId"" uuid,
    ""ClassId"" uuid,
    ""SectionCourseLinkId"" uuid,
    ""RollNo"" text); ", model.ProvidedString);
                // Console.WriteLine(sql);

                return Ok(this.db.FeeStudentChallanVM.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSearchBychallan([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Fee"".""VWGetAllChallanInfo"" AS cv', 'cv.""ChallanNo""=''{0}''')
AS ""FeeStudentChallanVM"" (
    ""FeeHeadId""UUID,
""stfeeamount""INT4,
""PayableAmount""INT4,
    ""ChallanNo""text,
        ""DocumentNo""text,
        ""DueDate""DATE,
        ""PaidDate""DATE,
        ""StatusId""INT4,
        ""RefferenceNo""TEXT,
        ""FullName""TEXT,
    ""FatherName""TEXT,
    ""CampusName""TEXT,
    ""Description""TEXT,
    ""ConcessionName""TEXT,
    ""StudentFeeStructureId""UUID,
    ""AdmissionFormId""UUID,
    ""StudentChallanId""UUID,
    ""ConcessionDetailId""UUID,
    ""CampusId""UUID,
    ""ProgramDetailId""UUID,
    ""InstallmentNo""INT4,
    ""FeeHead""TEXT,
    ""LoggerId""UUID,
    ""BankId""UUID,
    ""BankName""TEXT,
    ""Branch""TEXT,
    ""FeeAmount""INT4,
    ""AccountNo""text,
    ""Code""TEXT,
    ""ClassName""TEXT,
    ""ProgramName""TEXT,
    ""CollectorName""TEXT,
    ""CampusProgramId"" UUID,
    ""ClassId"" UUID,
    ""RollNo"" text,
    ""SectionCourseLinkId"" uuid,
    ""SessionId"" uuid); ", model.ProvidedString);
                // Console.WriteLine(sql);

                return Ok(this.db.FeeStudentChallanVM.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeByChallanNoEx([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Fee"".""VW-StudentFeeVMEx"" AS cv', 'cv.""StatusId""=1 and cv.""ChallanNo""=''{0}''')
AS ""FeeStudentChallanVM"" (
    ""FeeHeadId""UUID,
""stfeeamount""INT4,
""PayableAmount""INT4,
    ""ChallanNo""text,
        ""DocumentNo""text,
        ""DueDate""DATE,
        ""PaidDate""DATE,
        ""StatusId""INT4,
        ""RefferenceNo""TEXT,
        ""FullName""TEXT,
    ""FatherName""TEXT,
    ""CampusName""TEXT,
    ""Description""TEXT,
    ""ConcessionName""TEXT,
    ""StudentFeeStructureId""UUID,
    ""AdmissionFormId""UUID,
    ""StudentChallanId""UUID,
    ""ConcessionDetailId""UUID,
    ""CampusId""UUID,
    ""ProgramDetailId""UUID,
    ""InstallmentNo""INT4,
    ""FeeHead""TEXT,
    ""LoggerId""UUID,
    ""BankId""UUID,
    ""BankName""TEXT,
    ""Branch""TEXT,
    ""FeeAmount""INT4,
    ""AccountNo""text,
    ""Code""TEXT,
    ""ClassName""TEXT,
    ""ProgramName""TEXT,
    ""CollectorName""TEXT); ", model.ProvidedString);
                // Console.WriteLine(sql);

                return Ok(this.db.FeeStudentChallanVM.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on , " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetFeeByChallanNo([FromBody] Predicate model)
        // {
        //     var ChallanNo = new String(model.ProvidedString);

        //     return Ok(this.VMrepository.FindBy(e => e.StatusId == 1 && e.ChallanNo == ChallanNo));
        // }

        // [HttpGet]
        // [Route("[action]")]
        // public async Task<IActionResult> GetAllAsync()
        // {
        //     return Ok(await this.repository.AllAsync());
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentChallan).Assembly);
            Expression<Func<FeeStudentChallan, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentChallan, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentChallan).Assembly);
            Expression<Func<FeeStudentChallan, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentChallan, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy2([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var admissionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);

            return Ok(this.db.FeeStudentChallan.Where(e => e.StatusId == 1 && e.AdmissionFormId == admissionid && e.ClassId == classid));
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy3([FromBody] Predicate predicate)
        {
            // var options = ScriptOptions.Default.AddReferences (typeof (FeeStudentChallan).Assembly);
            // Expression<Func<FeeStudentChallan, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<FeeStudentChallan, bool>> (predicate.ProvidedString, options));

            //return Ok (this.repository.FindBy (discountFilterExpression));
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }

            var challanno = (predicate.ProvidedString);

            return Ok(this.db.VW_AdhocStudentChallan.Where (e => e.ChallanNo == challanno && (e.StatusId == 1 ||  e.StatusId == 20 )));
           
        }

        private bool  validateinputvalue(string input){
        if(input==null || input=="" || input==" " || input=="null" ||string.IsNullOrEmpty(input.Trim())){
            return true;
        } 
        return false;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }

            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentChallan).Assembly);
            Expression<Func<FeeStudentChallan, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentChallan, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetBulkModel([FromBody] Predicate predicate)
        {
            var refNo = predicate.ProvidedString.Split("?")[0];
            var admissionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);

            FeeBulkModel result = new FeeBulkModel();
            //var challan = this.repository.FindBy (s => s.StatusId == 1 && s.AdmissionFormId == admissionid).ToList ().OrderBy(e=>e.ChallanNo);
            var challan = this.db.FeeStudentChallan.Where(s => (s.StatusId == 1 || s.StatusId == -6) && s.AdmissionFormId == admissionid && s.ClassId == classid).ToList().OrderBy(e => e.ChallanNo);
            var fee = this.db.FeeSubinstallmentVM.Where(e => e.StatusId == 1 && e.AdmissionFormId == admissionid && e.ClassId == classid).ToList();
            result.FeeStudentChallan.AddRange(challan);
            result.FeeSubinstallmentVM.AddRange(fee);
            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetBulkModels([FromBody] Predicate predicate)
        {
            var refNo = predicate.ProvidedString.Split("?")[0];
            var admissionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);
            FeeBulkModels result = new FeeBulkModels();
            //var challan = this.db.FeeStudentChallans.Where(s => s.StatusId == 1 && s.AdmissionFormId == admissionid && s.ClassId == classid).ToList().OrderBy(e => e.ChallanNo);
            string sql = string.Format(@"SELECT * FROM ""Fee"".""StudentFeeChallans""('{0}','{1}')", admissionid, classid);
            var challan = this.db.FeeStudentChallans.FromSql(sql);
            var fee = this.db.FeeSubinstallmentVM.Where(e => e.StatusId == 1 && e.AdmissionFormId == admissionid && e.ClassId == classid).ToList();
            result.FeeStudentChallans.AddRange(challan);
            result.FeeSubinstallmentVM.AddRange(fee);
            return Ok(result);
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetBulkModelinfo([FromBody] Predicate predicate)
        {
            var challanno = predicate.ProvidedString.Split("?")[0];
            FeeBulkModelss result = new FeeBulkModelss();
            //var challan = this.db.FeeStudentChallans.Where(s => s.StatusId == 1 && s.AdmissionFormId == admissionid && s.ClassId == classid).ToList().OrderBy(e => e.ChallanNo);
            string sql = string.Format(@"SELECT * FROM ""Fee"".""StudentFeeChallansinfo""('{0}')", challanno);
            var challan = this.db.FeeStudentChallans.FromSql(sql);
            var fee = this.db.FeeSubinstallmentVMs.Where(e => e.StatusId == 1 && e.ChallanNo == challanno).ToList();
            result.FeeStudentChallans.AddRange(challan);
            result.FeeSubinstallmentVMs.AddRange(fee);
            return Ok(result);
            Console.WriteLine(result);
        }
        //  [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindByEx([FromBody]Predicate predicate)
        // {
        //     var options = ScriptOptions.Default.AddReferences(typeof(StudentChallanEx).Assembly);
        //     Expression<Func<StudentChallanEx, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StudentChallanEx, bool>>(predicate.ProvidedString, options));

        //     return Ok(this.repository.FindBy(discountFilterExpression));
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            if (validateinputvalue(predicate.ProvidedString.Trim()))
            {
                return BadRequest("Predicate.ProvidedString is null or empty.");
            }
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentChallan).Assembly);
            Expression<Func<FeeStudentChallan, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentChallan, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] FeeStudentChallan entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] FeeStudentChallan entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<FeeStudentChallan> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<FeeStudentChallan> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] FeeStudentChallan entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] FeeStudentChallan entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] FeeStudentChallan entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] FeeStudentChallan entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.StudentChallan"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentChallan).Assembly);
            Expression<Func<FeeStudentChallan, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentChallan, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeStudentChallan).Assembly);
            Expression<Func<FeeStudentChallan, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeStudentChallan, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateDueDate([FromBody] Predicate predicate)
        {
            var studentChallanId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var dueDate = predicate.ProvidedString.Split("?")[1];
            // var dateString = dueDate.ToString("yyyy/MM/dd");
            var Data = this.log.GetLog();

            var query = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"DueDateChange\"('{0}', '{1}', '{2}'); commit;", studentChallanId, dueDate, Data);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            var result = connection.Execute(query);

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(result);
            // return Ok(this.db.Database.ExecuteSqlCommand(query));

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetPreviousFee([FromBody] Predicate predicate)
        {
            var refNo = predicate.ProvidedString;
            var query = String.Format(@"select * from ""public"".""PreFirstYearTemp"" where ""Father_CNIC""=(
	                    select ""ParentCNIC"" from  ""Admission"".""VWAdmissionForm"" where ""RefferenceNo""='{0}')", refNo);
            // Console.WriteLine(query);

            return Ok(await this.db.PreFirstYear.FromSql(query).ToListAsync());

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddPreFirstYearChallan([FromBody] Predicate predicate)
        {
            var admissionFormid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var amount = predicate.ProvidedString.Split("?")[1];

            var query = String.Format(@"SELECT ""public"".""InsertPreFirstYearFee""('{0}','{1}') as ""ProvidedString""", admissionFormid, amount);

            return Ok(await this.db.Predicate.FromSql(query).ToListAsync());

        }

        private const string GetSingleConcessionStudent = @"SELECT e.""StudentFeeStructureId"", e.""AdmissionFormId"", e.""CampusId"", e.""CampusName"", e.""ChallanNo"", e.""ConcessionDetailId"", e.""ConcessionName"", e.""Description"", e.""DueDate"", e.""FatherName"", e.""FeeAmount"", e.""FeeHead"", e.""FeeHeadId"", e.""FullName"", e.""InstallmentNo"", e.""LoggerId"", e.""PaidDate"", e.""PayableAmount"", e.""ProgramDetailId"", e.""RefferenceNo"", e.""StatusId"", e.""StudentChallanId""
    FROM ""Fee"".""VW-StudentFeeVM"" AS e
    WHERE ((e.""StatusId"" = 1) AND (e.""RefferenceNo"" ='{0}')) AND (e.""AdmissionFormId"" NOT IN (SELECT ""AdmissionFormId"" FROM ""Fee"".""StudentChallan"" AS sc WHERE sc.""PaidDate"" IS NOT NULL AND sc.""AdmissionFormId""=e.""AdmissionFormId""))";

        /// Transportchallan Controller :P

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> TransportGetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(StudentChallanEx).Assembly);
            Expression<Func<StudentChallanEx, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<StudentChallanEx, bool>>(predicate.ProvidedString, options));

            return Ok(this.db.StudentChallanEx.Where(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult TransportGetFeeByRefrenceNo([FromBody] Predicate model)
        {
            var RefrenceNo = new String(model.ProvidedString);
            return Ok(this.db.TransportSubinstallmentVM.Where(e => e.StatusId == 1 && e.RefferenceNo == RefrenceNo));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult TransportGenerateExemption([FromBody] Predicate model)
        {
            var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
            var installNo = Convert.ToInt16(model.ProvidedString.Split("?")[1]);
            var ManualAmount = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var CampusId = new Guid(model.ProvidedString.Split("?")[3]);
            var SessionId = new Guid(model.ProvidedString.Split("?")[4]);
            var challanNo = new string(model.ProvidedString.Split("?")[5]);
            var remarksconcess = new string(model.ProvidedString.Split("?")[6]);
            var Data = this.log.GetLog();

            //string json1 = String.Format("SELECT \"Message\".\"UserlogInsertion\"('{0}')",Data );
            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GenerateExemptionForRouteChallan\"('{0}',{1},{2},'{3}','{4}','{5}','{6}','{7}'); commit;", Admissionform, installNo, ManualAmount, CampusId, SessionId, challanNo, remarksconcess, Data);
            // Console.WriteLine("------------------------------------" + json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            //connection.Execute(json1);
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
        public IActionResult TransportGenerateManualSubInst([FromBody] Predicate model)
        {
            var studentchallanJson = model.ProvidedString.Split("?")[0];
            var challanNo = model.ProvidedString.Split("?")[1];
            var Data = this.log.GetLog();

            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GeneratManualSubInsForRouteChallan\"('{0}','{1}','{2}'); commit;", studentchallanJson, challanNo, Data);
            // Console.WriteLine("------------------------------------" + json);
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
        public IActionResult GenerateCustomChallan([FromBody] Predicate model)
        {
            var admissionFromid = new Guid(model.ProvidedString.Split("?")[0]);
            var FeeHeadId = new Guid(model.ProvidedString.Split("?")[3]);
            var amount = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var dueDate = model.ProvidedString.Split("?")[2];
            var challanType = new Guid(model.ProvidedString.Split("?")[4]);
            var remarks = model.ProvidedString.Split("?")[5];
            var classid = new Guid(model.ProvidedString.Split("?")[6]);

            var Data = this.log.GetLog();

            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GenerateCustomChallan\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}'); commit;", admissionFromid, amount, dueDate, FeeHeadId, Data, challanType, remarks, classid);
            // Console.WriteLine("------------------------------------" + json);
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
        public IActionResult GenerateEducationChallanForPre([FromBody] Predicate model)
        {
            var admissionFromid = new Guid(model.ProvidedString.Split("?")[0]);
            var FeeHeadId = new Guid(model.ProvidedString.Split("?")[1]);
            var amount = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var dueDate = model.ProvidedString.Split("?")[3];
            var challanType = new Guid(model.ProvidedString.Split("?")[4]);
            var remarks = model.ProvidedString.Split("?")[5];
            var classid = new Guid(model.ProvidedString.Split("?")[6]);

            var Data = this.log.GetLog();

            string json = String.Format("BEGIN TRANSACTION ISOLATION LEVEL Read committed; Begin; SELECT \"Fee\".\"GenerateEducationChallanForPre\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}'); commit;", admissionFromid, amount, dueDate, FeeHeadId, Data, challanType, remarks, classid);
            // Console.WriteLine("------------------------------------" + json);
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
        public IActionResult GenerateBulkCustomChallanFee([FromBody] Predicate model)
        {
            var list = new string(model.ProvidedString.Split("?")[0]);
            var amount = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var dueDate = model.ProvidedString.Split("?")[2];
            var FeeHeadId = new Guid(model.ProvidedString.Split("?")[3]);
            var challanType = new Guid(model.ProvidedString.Split("?")[4]);
            var remarks = model.ProvidedString.Split("?")[5];

            var Data = this.log.GetLog();

            string json = String.Format("SELECT \"Fee\".\"GenerateBulkCustomChallanFee\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", list, amount, dueDate, FeeHeadId, Data, challanType, remarks);
            // Console.WriteLine("------------------------------------" + json);
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
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult TransportCheckSubInstallmentofInstallment([FromBody] Predicate predicate)
        {

            IDbConnection connection = db.Database.GetDbConnection();
            var rtv = new RTV() { ReturnValue = 0 };
            var AdmissionformId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var Installmentno = Convert.ToInt16(predicate.ProvidedString.Split("?")[2]);
            string json = String.Format("SELECT \"Fee\".\"CheckSubInstallmentofINstallmentTransportChallan\"('{0}','{1}',{2}) as val", AdmissionformId, classid, Installmentno);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            {
                return Ok(rtv);
            }

        }

    }

}