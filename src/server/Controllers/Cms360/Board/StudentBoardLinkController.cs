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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Cms360.UI.Controllers.Account
{

    public class RTV
    {
        public string ReturnValue { get; set; }
    }

    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class BoardStudentBoardLinkController : Controller
    {
        private readonly IBoardStudentBoardLinkRepository repository;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        public BoardStudentBoardLinkController(IUserLogService log, IBoardStudentBoardLinkRepository repository, DbContextBase db)
        {
            this.repository = repository;
            this.log = log;
            this.db = db;
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
            var options = ScriptOptions.Default.AddReferences(typeof(BoardStudentBoardLink).Assembly);
            Expression<Func<BoardStudentBoardLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardStudentBoardLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardStudentBoardLink).Assembly);
            Expression<Func<BoardStudentBoardLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardStudentBoardLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentBoardLink([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var shiftid = new Guid(predicate.ProvidedString.Split("?")[4]);
            var genderid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var boardid = new Guid(predicate.ProvidedString.Split("?")[6]);

            string sql = string.Format("Select *  from \"Board\".\"GetStudentBoardLink\" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionid, campus, programid, classid, shiftid, genderid, boardid);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardLinkData.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentBoardRegistration([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var registrationCodeId = new Guid(predicate.ProvidedString.Split("?")[5]);


            string sql = string.Format("Select *  from \"Board\".\"GetStudentBoardRegistration\" ('{0}','{1}','{2}','{3}','{4}','{5}')", sessionid, campus, programid, classid, programdetailid,registrationCodeId);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardRegistration.FromSql(sql));
        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardUniversityExamEx([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var exyear = new string(predicate.ProvidedString.Split("?")[6]);
            var registrationCodeId = new Guid(predicate.ProvidedString.Split("?")[7]);




            string sql = string.Format("Select *  from \"Board\".\"GetExamBoardUniversity\" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", sessionid, campus, programid, classid, programdetailid,examtypeid,exyear,registrationCodeId);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardExamEntry.FromSql(sql));
        }


          [HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardUniversityRollno([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var exyear = new string(predicate.ProvidedString.Split("?")[6]);




            string sql = string.Format("Select *  from \"Board\".\"GetBoardUnRollNo\" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionid, campus, programid, classid, programdetailid,examtypeid,exyear);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardUniversityRollNoList.FromSql(sql));
        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardUniversityResultCard([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var exyear = new string(predicate.ProvidedString.Split("?")[6]);




            string sql = string.Format("Select *  from \"Board\".\"GetBoardUniResultCard\" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionid, campus, programid, classid, programdetailid,examtypeid,exyear);
            // Console.WriteLine(sql);
            return Ok(this.db.BoardUniversityResultCard.FromSql(sql));
        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardUniversityRollnoEx([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var exyear = new string(predicate.ProvidedString.Split("?")[6]);




            string sql = string.Format("Select *  from \"Board\".\"GetBoardUnRollNo\" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}') where  \"BoardUniRollNoSlipId\" not in  (Select \"BoardUniRollNoSlipId\" from \"Board\".\"BoardUniversityResultCard\" where \"StatusId\"=1)", sessionid, campus, programid, classid, programdetailid,examtypeid,exyear);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardUniversityRollNoList.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentBoardExamUniversity([FromBody] Predicate predicate)
        {
            string sql="";
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var registrationCodeId = new Guid(predicate.ProvidedString.Split("?")[5]);

            if(registrationCodeId.ToString()=="00000000-0000-0000-0000-000000000000")
            {
             sql = string.Format("Select *  from \"Board\".\"GetStudentBoardRegistration\" ('{0}','{1}','{2}','{3}','{4}')  where  \"AdmissionFormId\" not in  (Select \"AdmissionFormId\" from \"Board\".\"BoardUniversityExamEntry\" where \"StatusId\"=1)", sessionid, campus, programid, classid, programdetailid);
            }
            else{
             sql = string.Format("Select *  from \"Board\".\"GetStudentBoardRegistration\" ('{0}','{1}','{2}','{3}','{4}','{5}')  where  \"AdmissionFormId\" not in  (Select \"AdmissionFormId\" from \"Board\".\"BoardUniversityExamEntry\" where \"StatusId\"=1)", sessionid, campus, programid, classid, programdetailid,registrationCodeId);


            }

            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardRegistration.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentBoardUniRollData([FromBody] Predicate predicate)
        {
            string sql="";
           var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var exyear = new string(predicate.ProvidedString.Split("?")[6]);
             sql = string.Format("Select *  from \"Board\".\"GetBoardUniRollData\" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}') where  \"BoardUniversityExamEntryId\" not in  (Select \"BoardUniversityExamEntryId\" from \"Board\".\"BoardUniversityRollNoSlip\" where \"StatusId\"=1)", sessionid, campus, programid, classid, programdetailid,examtypeid,exyear);


           
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardUniRollData.FromSql(sql));
        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardUniversityRegistrationCard([FromBody] Predicate predicate)
        {
            string sql="";
           var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var examtypeid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var exyear = new string(predicate.ProvidedString.Split("?")[6]);
             sql = string.Format("Select *  from \"Board\".\"GetBoardUniRollData\" ('{0}','{1}','{2}','{3}','{4}','{5}','{6}') where  \"BoardUniversityExamEntryId\" not in  (Select \"BoardUniversityExamEntryId\" from \"Board\".\"BoardUniversityRollNoSlip\" where \"StatusId\"=1)", sessionid, campus, programid, classid, programdetailid,examtypeid,exyear);


           
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardUniRollData.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentBoardRegistrationEx([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);


            string sql = string.Format("Select *  from \"Board\".\"GetStudentBoardRegistration\" ('{0}','{1}','{2}','{3}','{4}')", sessionid, campus, programid, classid, programdetailid);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardRegistration.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentListEx([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var programdetailid = new String(predicate.ProvidedString.Split("?")[4]);
            var registrationCodeId = new Guid(predicate.ProvidedString.Split("?")[5]);


            string sql = string.Format("Select *  from \"Board\".\"GetStudentList\" ('{0}','{1}','{2}','{3}','{4}','{5}')", sessionid, campus, programid, classid, programdetailid,registrationCodeId);
            // Console.WriteLine(sql);
            return Ok(this.db.StudentBoardRegistrationEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult BoardFeePaidStudent([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campus = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programdetailid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var shiftid = new Guid(predicate.ProvidedString.Split("?")[4]);
            var genderid = new Guid(predicate.ProvidedString.Split("?")[5]);

            string sql = string.Format("Select *  from \"Board\".\"BoardFeePaidStudent\" ('{0}','{1}','{2}','{3}','{4}','{5}')", sessionid, campus, programdetailid, classid, shiftid, genderid);
            // Console.WriteLine(sql);
            return Ok(this.db.BoardFeePaidStudent.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardFee([FromBody] Predicate predicate)
        {
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var boardid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var ChallanTypeId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var feeheadid = new Guid(predicate.ProvidedString.Split("?")[3]);
            string sql = string.Format("Select *  from \"Board\".\"VWSessionBoardFee\"  Where \"SessionId\"='{0}' and \"BoardId\"='{1}' and \"FeeHeadId\"='{2}' and \"ChallanTypeId\"='{3}'", sessionid, boardid, feeheadid, ChallanTypeId);
            // Console.WriteLine(sql);
            return Ok(this.db.SessionBoardFeeVM.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult insertStudentBoardLink([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var returntype = new Guid(predicate.ProvidedString.Split("?")[1]);
            var registrationCodeId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var dueDate = new string(predicate.ProvidedString.Split("?")[3]);
            var amount = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);
            var returndate = new string(predicate.ProvidedString.Split("?")[5]);

            string json = string.Format("SELECT \"Board\".\"InsertStudentBoardLink\"('{0}','{1}','{2}','{3}',{4},'{5}') as \"ReturnValue\" ", list, returntype, registrationCodeId, dueDate, amount, returndate);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertStudentRegistration([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString);

            string json = string.Format("SELECT \"Board\".\"InsertStudentRegistration\"('{0}') as \"ReturnValue\" ", list);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult InsertUniversityExamEntry([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString);

            string json = string.Format("SELECT \"Board\".\"InsertUniversityExamEntry\"('{0}') as \"ReturnValue\" ", list);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }


[HttpPost]
        [Route("[action]")]
        public IActionResult GetBoardUniversitySearch([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var classid=new Guid (model.ProvidedString.Split("?")[2]);
            //string sql = String.Format(@"select * from ""Admission"".""getStudentsDetail""('{0}',{1},'{2}')", searchParam, userid,classid);
            string sql = String.Format(@"select * from ""Board"".""getBoardUniversitySearch""('{0}',{1},'{2}')", searchParam, userid,classid);
            // Console.WriteLine(sql);
            return Ok(db.StudentBoardUnivertySearch.FromSql(sql));
        }
            [HttpPost]
        [Route("[action]")]
        public IActionResult InsertBoardUniversityRollNo([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString);

            string json = string.Format("SELECT \"Board\".\"InsertBoardUniversityRollNo\"('{0}') as \"ReturnValue\" ", list);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }
         [Route("[action]")]
        public IActionResult InsertBoardUniversityResultCard([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString);

            string json = string.Format("SELECT \"Board\".\"InsertBoardUniversityResultCard\"('{0}') as \"ReturnValue\" ", list);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }




        

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateStudentBoardLink([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var studentboardlinkid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var returntype = new Guid(predicate.ProvidedString.Split("?")[1]);
            var registrationCodeId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var dueDate = new string(predicate.ProvidedString.Split("?")[3]);
            var amount = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);
            var returndate = new string(predicate.ProvidedString.Split("?")[5]);
            var boardRegistrationNo = new string(predicate.ProvidedString.Split("?")[6]);
            var ope = new string(predicate.ProvidedString.Split("?")[7]);

            string json = string.Format("SELECT \"Board\".\"UpdateStudentBoardLink\"('{0}','{1}','{2}','{3}',{4},'{5}','{6}','{7}') as \"ReturnValue\" ", studentboardlinkid, returntype, registrationCodeId, dueDate, amount, returndate, boardRegistrationNo, ope);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }

        
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteRegistrationNo([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var admissionformid = new Guid(predicate.ProvidedString);

            string json = string.Format("SELECT \"Board\".\"DeleteRegistrationNo\"('{0}') as \"ReturnValue\" ", admissionformid);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteBoardExamEntry([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var admissionformid = new Guid(predicate.ProvidedString);

            string json = string.Format("SELECT \"Board\".\"DeleteStudentBoardExamEntry\"('{0}') as \"ReturnValue\" ", admissionformid);
            // Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ReturnValue = connection.Query<RTV>(json).FirstOrDefault().ReturnValue;
            //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindBy([FromBody] Predicate predicate)
        {
            try
            {
                return Ok(this.db.BoardStudentBoardLink.Where(s => s.StatusId != 2));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.BoardBoardCampus()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate predicate)
        {
            try
            {
                var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
                var programdetailid = new Guid(predicate.ProvidedString.Split("?")[2]);
                var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
                var sectionid = new Guid(predicate.ProvidedString.Split("?")[4]);

                return Ok(this.db.BoardVWCampusStudentLink.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programdetailid && s.ClassId == classid && s.SectionId == sectionid && s.StatusId != 2));
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.BoardBoardCampus()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }
        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetFindByVM([FromBody]Predicate predicate)
        // {
        //     try
        //     {
        //         var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
        //         var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
        //         var programdetailid = new Guid(predicate.ProvidedString.Split("?")[2]);
        //         var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
        //         var sectionid = new Guid(predicate.ProvidedString.Split("?")[4]);

        //         return Ok(this.db.BoardVWCampusStudentLink.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId ==  programdetailid && s.ClassId == classid && s.SectionId == sectionid && s.StatusId != 2));
        //     }
        //     catch (Exception ex)
        //     {
        //         AppException app = new AppException();
        //         app.Message = "ERROR IN FEE EXEMPTION Controller.BoardBoardCampus()" + ex.Message;
        //         app.Time = DateTime.Now;
        //         app.Data = predicate.ProvidedString;
        //         this.db.Add(app.Message);
        //         this.db.SaveChanges();
        //         return BadRequest(app.Message);

        //     }
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardStudentBoardLink).Assembly);
            Expression<Func<BoardStudentBoardLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardStudentBoardLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] BoardStudentBoardLink entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Board.BoardStudentBoardLink"));
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateExamEntry([FromBody] StudentBoardExamEntry entity)
        {

         // Console.WriteLine((String.Format("Update \"Board\".\"BoardUniversityExamEntry\" set \"ExamTypeId\"='{0}',\"ExamYear\"='{1}'     Where \"AdmissionFormId\"=('{2}')", entity.ExamTypeId,entity.ExamYear,entity.AdmissionFormId)));

          var z = (this.db.Database.ExecuteSqlCommand(String.Format("Update \"Board\".\"BoardUniversityExamEntry\" set \"ExamTypeId\"='{0}',\"ExamYear\"='{1}'     Where \"AdmissionFormId\"=('{2}')", entity.ExamTypeId,entity.ExamYear,entity.AdmissionFormId)));


            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Board.BoardStudentExamType"));
        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateBoardRollNoSlip([FromBody] BoardUniRollNoSlip entity)
        {

         // Console.WriteLine((String.Format("Update \"Board\".\"BoardUniversityRollNoSlip\" set \"BoardUniversityExamEntryId\"='{0}',\"BoardRollNo\"='{1}',\"StatusId\"={2}     Where \"BoardUniRollNoSlipId\"=('{3}')", entity.BoardUniversityExamEntryId,entity.BoardRollNo,entity.StatusId,entity.BoardUniRollNoSlipId)));

          var z = (this.db.Database.ExecuteSqlCommand(String.Format("Update \"Board\".\"BoardUniversityRollNoSlip\" set \"BoardUniversityExamEntryId\"='{0}',\"BoardRollNo\"='{1}',\"StatusId\"={2}     Where \"BoardUniRollNoSlipId\"=('{3}')", entity.BoardUniversityExamEntryId,entity.BoardRollNo,entity.StatusId,entity.BoardUniRollNoSlipId)));


            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Board.BoardUniversityRollNoSlip"));
        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateBoardUniResultCard([FromBody] BoardUniResultCard entity)
        {

         // Console.WriteLine((String.Format("Update \"Board\".\"BoardUniversityResultCard\" set \"PassFailCriteria\"='{0}',\"StatusId\"={1}     Where \"BoardUniResultCardId\"=('{2}')", entity.BoardUniResultCardId,entity.StatusId,entity.BoardUniRollNoSlipId)));

          var z = (this.db.Database.ExecuteSqlCommand(String.Format("Update \"Board\".\"BoardUniversityResultCard\" set \"PassFailCriteria\"='{0}',\"StatusId\"={1}     Where \"BoardUniResultCardId\"=('{2}')", entity.PassFailCriteria,entity.StatusId,entity.BoardUniResultCardId)));


            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Board.BoardUniversityRollNoSlip"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] BoardStudentBoardLink entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Board.BoardStudentBoardLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] Predicate predicate)
        {
            var query = String.Format(@"SELECT * FROM ""Board"".""BoardStudentBoardLink""('{0}')", predicate.ProvidedString);
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
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<BoardStudentBoardLink> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Board.BoardStudentBoardLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] BoardStudentBoardLink entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Board.BoardStudentBoardLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] BoardStudentBoardLink entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Board.BoardStudentBoardLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] BoardStudentBoardLink entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Board.BoardStudentBoardLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] BoardStudentBoardLink entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Board.BoardStudentBoardLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardStudentBoardLink).Assembly);
            Expression<Func<BoardStudentBoardLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardStudentBoardLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(BoardStudentBoardLink).Assembly);
            Expression<Func<BoardStudentBoardLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<BoardStudentBoardLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}