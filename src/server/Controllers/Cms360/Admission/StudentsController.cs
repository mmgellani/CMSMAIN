
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using Dapper;

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
    public class AdmissionStudentsController : Controller
    {
        private readonly IAdmissionStudentsRepository repository;
        private readonly IStudentRecordVMRepository repositoryVM;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        public AdmissionStudentsController(IAdmissionStudentsRepository repository, DbContextBase db, IStudentRecordVMRepository repositoryVM, IUserLogService log)
        {
            this.repository = repository;
            this.repositoryVM = repositoryVM;
            this.db = db;
            this.log = log;

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentFeeInfo([FromBody]Predicate model)
        {

            var searchParam = model.ProvidedString.Split("?")[0];
            var classid = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"select * from ""Fee"".""GetStudentFeeInfoEx""('{0}','{1}')", searchParam,classid);

            // Console.WriteLine(sql);
            return Ok(db.StudentFeeInfoData.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentPreAcademic([FromBody]Predicate model)
        {

            var studentid = new Guid(model.ProvidedString);
            string sql = String.Format(@"select * from ""Admission"".""PreviousAcademic"" Where ""StudentId"" = '{0}'", studentid);

            // Console.WriteLine(sql);
            return Ok(db.PreviousAcademicRecord.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicMarks([FromBody]Predicate model)
        {

            var studentId = new Guid(model.ProvidedString);
            
            string sql = String.Format(@"SELECT * FROM ""Admission"".""ProfileAcadamicInfo""('{0}')",studentId);
            return Ok(this.db.AcademicMarks.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetPreAcademicDegreeWise([FromBody]Predicate model)
        {

            var studentid = new Guid(model.ProvidedString.Split("?")[0]);
            var degreeid = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"select * from ""Admission"".""PreviousAcademic"" Where ""StudentId"" = '{0}' AND ""DegreeId"" = '{1}'", studentid,degreeid);

            // Console.WriteLine(sql);
            return Ok(db.PreviousAcademicRecord.FromSql(sql));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetProgramCourse()
        {

            // var campusprogramid = new Guid(model.ProvidedString);
            string sql = String.Format(@"select ""CourseId"",""FullName"" from ""Registration"".""Course"" Where ""StatusId"" = 1");

            // Console.WriteLine(sql);
            return Ok(db.ProgramCourseList.FromSql(sql));
        }

[HttpPost]
[Route("InsertStudentAttachment")]
public IActionResult InsertStudentAttachment([FromBody] StudentChallanAttachments model)
{
    try
    {
        if (string.IsNullOrEmpty(model.Image))
            return BadRequest("Image is required");

        // PostgreSQL function call
        string sql = @"SELECT ""Fee"".""InsertStudentChallanAttachment""(@AdmissionFormId, @ClassId, @InstallmentNo, @Image,@FileName, @StatusId);";

        db.Database.ExecuteSqlCommand(sql,
            new Npgsql.NpgsqlParameter("@AdmissionFormId", model.AdmissionFormId),
            new Npgsql.NpgsqlParameter("@ClassId", model.ClassId),
            new Npgsql.NpgsqlParameter("@InstallmentNo", model.InstallmentNo),
            new Npgsql.NpgsqlParameter("@Image", model.Image),
                        new Npgsql.NpgsqlParameter("@FileName", model.FileName),
            new Npgsql.NpgsqlParameter("@StatusId", 1)

            
             // default status
        );

        return Ok("Attachment saved successfully via function");
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}

  
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentAttachments([FromBody]Predicate model)
        {

            var studentid = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"SELECT * FROM ""Fee"".""GetStudentAttachmentsByAdmissionFormId""('{0}')",studentid);

            // Console.WriteLine(sql);
            return Ok(db.AdmissionFormRequest.FromSql(sql));
        }



  
         [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteStudentAttachments([FromBody]Predicate model)
        {

            var studentid = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format(@"SELECT * FROM ""Fee"".""DeleteStudentAttachments""('{0}')",studentid);

            

IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);        }


// [HttpDelete]
// [Route("DeleteStudentAttachment")]
// public IActionResult DeleteStudentAttachment(Guid id)
// {
//     string sql = @"
//         UPDATE ""Fee"".""StudentChallanAttachments""
//         SET ""StatusId"" = 0
//         WHERE ""StudentChallanAttachmentsId"" = @Id
//     ";

//     db.Database.ExecuteSqlCommand(
//         sql,
//         new Npgsql.NpgsqlParameter("@Id", id)
//     );

//     return Ok(new { message = "Deleted Successfully" });
// }




        [HttpPost]
        [Route("[action]")]
        public IActionResult InsetPreAcademicInfo([FromBody] Predicate model)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var studentid = new Guid(model.ProvidedString.Split("?")[0]);
                var degreeid = new Guid(model.ProvidedString.Split("?")[1]);
                var list = (model.ProvidedString.Split("?")[2]);
                var statusid = Convert.ToInt32(model.ProvidedString.Split("?")[3]);

                string json = String.Format("SELECT \"Admission\".\"InsetPreAcademicInfo\"('{0}','{1}','{2}','{3}') as ProvidedString", studentid, degreeid, list, statusid);
                // Console.WriteLine(json);

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
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionStudents).Assembly);
            Expression<Func<AdmissionStudents, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionStudents, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentRecord([FromBody]Predicate predicate)
        {

            var StudentId = new Guid(predicate.ProvidedString);
            return Ok(this.db.StudentRecordVM.Where(s => s.StudentId == StudentId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentChallanInfo([FromBody]Predicate predicate)
        {


             var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"select * from ""Fee"".""GetStudentChallanProfile""('{0}','{1}')",admissionformid,classid );

            return Ok(this.db.StudentChallanINfoData2New.FromSql(sql));

        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentChallanInfoUnpaid([FromBody]Predicate predicate)
        {


             var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"select * from ""Fee"".""GetStudentChallanProfileUnpaid""('{0}','{1}')",admissionformid,classid );

            return Ok(this.db.StudentChallanINfoData2New.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentChallanPaidInfo([FromBody]Predicate predicate)
        {


             var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT ""Fee"".""valex""('{0}','{1}')  as val",admissionformid,classid );

            return Ok(this.db.IntModel.FromSql(sql));

        }
          [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentTransferRecord([FromBody]Predicate predicate)
        {

            var obj = new Predicate () { ProvidedString = "" };
           IDbConnection connection = db.Database.GetDbConnection ();



             var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format("select   \"Admission\".\"GetTransferRecord\"('{0}','{1}') as \"ProvidedString\"",admissionformid,classid );
            Console.WriteLine(sql);
             if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (sql).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

              return Ok (obj.ProvidedString);
        }
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetMessageCount([FromBody]Predicate predicate)
        {

            var obj = new GetUserId () {UserId = 0 };
           IDbConnection connection = db.Database.GetDbConnection ();



             var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            //var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format("select   \"Admission\".\"GetMessageCount\"('{0}') as \"UserId\"",admissionformid );
            Console.WriteLine(sql);
             if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.UserId = connection.Query<GetUserId> (sql).FirstOrDefault ().UserId;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

              return Ok (obj.UserId);
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetMigratedRecord([FromBody]Predicate predicate)
        {

            var obj = new Predicate () { ProvidedString = "" };
           IDbConnection connection = db.Database.GetDbConnection ();



             var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = String.Format("select   \"Admission\".\"GetMigrationRecord\"('{0}','{1}') as \"ProvidedString\"",admissionformid,classid );
            Console.WriteLine(sql);
             if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (sql).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

              return Ok (obj.ProvidedString);
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
         [HttpPost]
        [Route("[action]")]
        public IActionResult GetTransferMigratedRecord([FromBody]Predicate predicate)
        {
            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Admission"".""GetTransferMigrationRecord""('{0}','{1}') ",admissionformid,classid );
            Console.WriteLine(sql);
            
               return Ok(this.db.GetstudentMigrationtrsnfer.FromSql(sql));
            //  return Ok (obj.ProvidedString);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPassword([FromBody]Predicate predicate)
        {
            var studentId = new Guid(predicate.ProvidedString);

            string sql = String.Format(@"select * from ""Role"".""StudentPassword""('{0}')  as ""ProvidedString""", studentId);

            return Ok(this.db.Predicate.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMessage([FromBody] Predicate model)
        {

            var studentid = new Guid(model.ProvidedString.Split("?")[0]);
            var messageText = new String(model.ProvidedString.Split("?")[1]);

            string json = String.Format("SELECT \"Message\".\"QueMessage\"('{0}','{1}')", studentid, messageText);
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
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionStudents).Assembly);
            Expression<Func<AdmissionStudents, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionStudents, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionStudents).Assembly);
            Expression<Func<AdmissionStudents, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionStudents, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody]Predicate predicate)
        {
            var admissionFormId = new Guid(predicate.ProvidedString);

            return Ok(db.VWStudentFeeProfile.Where(s => s.AdmissionFormId == admissionFormId).OrderBy(s => s.InstallmentNo));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsDetails([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var classid=new Guid (model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"select * from ""Admission"".""getStudentsDetail""('{0}',{1},'{2}')", searchParam, userid,classid);
            //             string whereClause = String.Format(@"(cv.""CampusId"" = ANY (SELECT ""Id"" FROM ""Role"".""VWUserRights"" WHERE ""UserId"" = {0})) AND (cv.""SessionId"" = ANY (SELECT ""Id"" FROM ""Role"".""VWUserRights"" WHERE ""UserId"" = {0}))
            // 			AND (concat(LOWER(cv.""RefferenceNo""), LOWER(cv.""RollNo""),LOWER(cv.""FullName"")) Like LOWER(''%{1}%''))", userid, searchParam);
            //             string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Admission"".""VWStudentsProfile"" AS cv', '{0}')
            //     As TBL(
            // ""AdmissionFormId"" UUID,
            // ""CampusProgramId"" UUID,
            //     ""StudentId"" UUID,
            //     ""AdmissionTypeId"" UUID,
            //     ""RollNo"" TEXT,
            //     ""RefferenceNo"" TEXT,
            //     ""AcademicInfo"" JSONB,
            //     ""StatusId"" INT4,
            //     ""LoggerId"" UUID,
            //     ""FullName"" TEXT,
            //     ""FatherName"" TEXT,
            //     ""CampusId"" UUID,
            //     ""ProgramDetailId"" UUID,
            //     ""SessionId"" UUID,
            //     ""StudentCNIC"" TEXT,
            //     ""ParentCNIC"" TEXT,
            //     ""StudentContactNo"" JSONB,
            //     ""ParentContactNo"" JSONB,
            //     ""Guardians"" JSONB,
            //     ""GenderId"" UUID,
            //     ""DateOfBirth"" DATE,
            //     ""Address"" JSONB,
            //     ""BloodGroupId"" UUID,
            //     ""ReligionId"" UUID,
            //     ""ShiftId"" UUID,
            //     ""ZoneId"" UUID,
            //     ""CampusName""  TEXT,
            //     ""Description"" TEXT,
            //     ""CityName"" TEXT
            // );", whereClause);

            // Console.WriteLine(sql);
            return Ok(db.VWStudentsProfile.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsDetailsC([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var installmentNo = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"select * from ""Fee"".""ConcessionCancelView""('{0}',{1},{2})", searchParam, installmentNo, userid);

            // Console.WriteLine(sql);
            return Ok(db.StudentsProfileCon.FromSql(sql));

        }
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsExamUpd([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString;

            string sql = String.Format(@"select * from ""Examination"".""GetExamInfoEdit""('{0}')", searchParam);

            // Console.WriteLine(sql);
            return Ok(db.ExamUpdList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsExamUpdES([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString;

            string sql = String.Format(@"select * from ""Examination"".""GetExamInfoEditExamSchedule""('{0}')", searchParam);

            // Console.WriteLine(sql);
            return Ok(db.ExamUpdList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsExamUpdESNew([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var type = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"select * from ""Assessment"".""GetExamInfoEditExamScheduleNew""('{0}', '{1}')", searchParam , type);

            // Console.WriteLine(sql);
            return Ok(db.ExamUpdList.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ReverseConcession([FromBody] Predicate model)
        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var ChallanTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            var installmentNo = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
              var classid = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"select * from ""Fee"".""ConcessionCancel""('{0}','{1}',{2},'{3}')  as ""ProvidedString"" ", admissionformid, ChallanTypeId, installmentNo,classid);

            // Console.WriteLine(sql);
            return Ok(db.Predicate.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsSectionDetails([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"select * from  ""Admission"".""getStudentsSectionWise""('{0}',{1})", searchParam, userid);
            //             string whereClause = String.Format(@"(cv.""CampusId"" = ANY (SELECT ""Id"" FROM ""Role"".""VWUserRights"" WHERE ""UserId"" = {0})) AND (cv.""SessionId"" = ANY (SELECT ""Id"" FROM ""Role"".""VWUserRights"" WHERE ""UserId"" = {0})
            //             AND (cv.""SectionCourseLinkId"" = ANY(SELECT (jsonb_array_elements(""AllowedSection"")->>''id'')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {0}))
            //             )
            // 			AND (concat(LOWER(cv.""RefferenceNo""), LOWER(cv.""RollNo""),LOWER(cv.""FullName"")) Like LOWER(''%{1}%''))", userid, searchParam);
            //             // Console.WriteLine(whereClause);

            //             string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Admission"".""VWStudentSectionProfile"" AS cv', '{0}')
            //     As TBL(
            // ""AdmissionFormId"" UUID,
            //       ""CampusProgramId"" UUID,
            //           ""StudentId"" UUID,
            //           ""AdmissionTypeId"" UUID,
            //           ""RollNo"" TEXT,
            //           ""RefferenceNo"" TEXT,
            //           ""AcademicInfo"" JSONB,
            //           ""StatusId"" INT4,
            //           ""LoggerId"" UUID,
            //           ""FullName"" TEXT,
            //           ""FatherName"" TEXT,
            //           ""CampusId"" UUID,
            //           ""ProgramDetailId"" UUID,
            //           ""SessionId"" UUID,
            //           ""StudentCNIC"" TEXT,
            //           ""ParentCNIC"" TEXT,
            //           ""StudentContactNo"" JSONB,
            //           ""ParentContactNo"" JSONB,
            //           ""SectionCourseLinkId"" UUID,
            //           ""GenderId"" UUID,
            //           ""DateOfBirth"" DATE,
            //           ""Address"" JSONB,
            //           ""BloodGroupId"" UUID,
            //           ""ReligionId"" UUID,
            //           ""ShiftId"" UUID,
            //           ""ZoneId"" UUID,
            //           ""CampusName""  TEXT,
            //           ""Description"" TEXT,
            //           ""CityName"" TEXT,
            //           ""ClassId"" UUID
            // );", whereClause);


            return Ok(db.VWStudentSectionProfile2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLeaveStudentsSectionWise([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"select * from  ""Admission"".""getLeaveStudentsSectionWise""('{0}',{1})", searchParam, userid);
            return Ok(db.VWStudentSectionProfile.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsByRollNo([FromBody] Predicate model) //Rights Based
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from  ""Admission"".""GetStudentsByRollNoEx""({0},'{1}')", userid, searchParam);
            // Console.WriteLine(sql);
            return Ok(db.StudentOfSectionEx.FromSql(sql).ToList());

            //    return BadRequest("No Data Found");
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentDetails([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[1]));
            var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[2]));
            var classid=new Guid (model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"select * from  ""Attendance"".""AttendanceIndividualSummary""('{0}','{1}','{2}','{3}')", searchParam, fromDate, toDate,classid);
            return Ok (db.AttendanceAttendanceIndividSummaryEx.FromSql(sql));
            //var result = db.AttendanceAttendanceIndividSummary.FromSql(sql).ToList();
            // if (result.Count > 0)
            // {
            //     return Ok(result);
            // }
            // else
            // {
            //     string data = String.Format(@"select * from  ""Attendance"".""AttendanceSummarypartII""('{0}','{1}','{2}')", searchParam, fromDate, toDate);
            //     return Ok(db.AttendanceAttendanceSummaryII.FromSql(data));
            // }
            //    return BadRequest("No Data Found");
        }

         [HttpPost]
        [Route("[action]")]
        public IActionResult GetMessageDetail([FromBody] Predicate model)
        {
          var admissionformid=new Guid (model.ProvidedString.Split("?")[0]);

            var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[1]));
            var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[2]));


            string sql = String.Format(@"select * from  ""Message"".""StudentMessageDetail""('{0}','{1}','{2}')",admissionformid,fromDate,toDate) ;
            return Ok (db.MessageDetailStud.FromSql(sql));
        }














        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionStudents).Assembly);
            Expression<Func<AdmissionStudents, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionStudents, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]AdmissionStudents entity)
        {
            try
            {
                this.repository.Add(entity);
                return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Admission.Students"));
            }

            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN Students CONTROLLER.AddOne()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(entity);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        //  [HttpPost]
        // [Route("[action]")]
        // public IActionResult StudentAttachments([FromBody]StudentChallanAttachments entity)
        // {
        //     try
        //     {
        //         this.repository.Add(entity);
        //         return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.StudentChallanAttachments"));
        //     }

        //     catch (Exception ex)
        //     {
        //         AppException app = new AppException();
        //         app.Message = "ERROR IN Students CONTROLLER.AddOne()" + ex.Message;
        //         app.Time = DateTime.Now;
        //         app.Data = JsonConvert.SerializeObject(entity);
        //         this.db.AppException.Add(app);
        //         this.db.SaveChangesAsync();
        //         return BadRequest(app.Message);
        //     }
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]AdmissionStudents entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Admission.Students"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<AdmissionStudents> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Admission.Students"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<AdmissionStudents> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Admission.Students"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]AdmissionStudents entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Admission.Students"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]AdmissionStudents entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Admission.Students"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]AdmissionStudents entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Admission.Students"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]AdmissionStudents entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Admission.Students"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionStudents).Assembly);
            Expression<Func<AdmissionStudents, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionStudents, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AdmissionStudents).Assembly);
            Expression<Func<AdmissionStudents, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AdmissionStudents, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}