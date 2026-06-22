using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cms360.Contract;
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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading;
using Npgsql;
namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    //[Authorize]
    public class ReportsController : Controller
    {
        private readonly IAdmissionReportsRepository admissionRepository;
        private readonly IAdmissionReportsEnrolledRepository admissionRepositoryEnrolled;
        private readonly IFeeReportsRepository feeRepository;
        private readonly ITimeTableReportsRepository timeTableRepository;
        private readonly DbContextBase db;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        public ReportsController(IAdmissionReportsRepository admissionRepository, ITimeTableReportsRepository timeTableRepository, IAdmissionReportsEnrolledRepository admissionRepositoryEnrolled, DbContextBase db, IFeeReportsRepository feeRepository, IDomainContextResolver Resolver)
        {
            this.admissionRepository = admissionRepository;
            this.admissionRepositoryEnrolled = admissionRepositoryEnrolled;
            this.feeRepository = feeRepository;
            this.timeTableRepository = timeTableRepository;
            this.Resolver = Resolver;
            this.db = db;

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
            try
            {
                return Ok(this.admissionRepository.All());
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAll, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject (model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsUsernameAndPassword([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""StudentName"", cv.""RefferenceNo"" ,cv.""RollNo"", cv.""Username"", cv.""Password""', '""Registration"".""VWStudentUserPass"" AS cv', '{0}')
    AS TBL (
    ""StudentName"" TEXT,
    ""RefferenceNo"" TEXT,
    ""RollNo"" TEXT,
    ""Username"" VARCHAR,
    ""Password"" VARCHAR);", model.ProvidedString);

                return Ok(this.db.StudentUsernamePassword.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentsUsernameAndPassword, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeDetailFinal([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""DuesList""('{0}')", model.ProvidedString);
                return Ok(db.FinalDuesList.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllFeeDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeInstallment([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""InstallmentPaid""('{0}')", model.ProvidedString);
                return Ok(db.InstallmentPaid.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeInstallment, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeRevenueWise([FromBody] Predicate model)
        {
            try
            {
                var listquery = (model.ProvidedString.Split("?")[0]);
                var fromDate = (model.ProvidedString.Split("?")[1]);
                var toDate = (model.ProvidedString.Split("?")[2]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""CourseRevnueList""('{0}','{1}','{2}')", listquery, fromDate, toDate);
                return Ok(db.RevenuePaid.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeRevenueWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetStudentRevenueWise([FromBody] Predicate model)
        {
            try
            {
                var listquery = (model.ProvidedString.Split("?")[0]);
                var fromDate = (model.ProvidedString.Split("?")[1]);
                var toDate = (model.ProvidedString.Split("?")[2]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""CourseStudentRevnueList""('{0}','{1}','{2}')", listquery, fromDate, toDate);
                return Ok(db.StudentRevenuePaid.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentRevenueWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentRefundFee([FromBody] Predicate model)
        {
            var sessionid = model.ProvidedString.Split("?")[0];
            var city = model.ProvidedString.Split("?")[1];
            var subcity = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[3];
            var fromdate = model.ProvidedString.Split("?")[4];
            var todate = model.ProvidedString.Split("?")[5];
            var status = model.ProvidedString.Split("?")[6];
            // string whereClause = String.Format(@"(concat(LOWER(cv.""RefferenceNo""), LOWER(cv.""RollNo""),LOWER(cv.""FullName"")) Like LOWER(''%{1}%''))", userid, searchParam);
            string sql = String.Format(@" SELECT * FROM ""Fee"".""RefundReport""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", sessionid, city, subcity, classid, fromdate, todate, status);
            Console.WriteLine(sql);
            return Ok(this.db.StudentRefundFee.FromSql(sql));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentRefundFeeEx([FromBody] Predicate model)
        {
            var sessionid = model.ProvidedString.Split("?")[0];
            var city = model.ProvidedString.Split("?")[1];
            // var subcity = model.ProvidedString.Split("?")[2];
            var classid = model.ProvidedString.Split("?")[2];
            var fromdate = model.ProvidedString.Split("?")[3];
            var todate = model.ProvidedString.Split("?")[4];
            var status = model.ProvidedString.Split("?")[5];
            // string whereClause = String.Format(@"(concat(LOWER(cv.""RefferenceNo""), LOWER(cv.""RollNo""),LOWER(cv.""FullName"")) Like LOWER(''%{1}%''))", userid, searchParam);
            string sql = String.Format(@" SELECT * FROM ""Fee"".""RefundReportEx""('{0}','{1}','{2}','{3}','{4}',{5})", sessionid, city, classid, fromdate, todate, status);
            Console.WriteLine(sql);
            return Ok(this.db.StudentRefundFee.FromSql(sql));
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetStudentRevenueWiseEx([FromBody] Predicate model)
        {
            try
            {
                var listquery = (model.ProvidedString.Split("?")[0]);
                var fromDate = (model.ProvidedString.Split("?")[1]);
                var toDate = (model.ProvidedString.Split("?")[2]);
                var campusprogramid = new Guid(model.ProvidedString.Split("?")[3]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""CourseStudentRevnueListExx3""('{0}','{1}','{2}','{3}')  ORDER BY ""RollNo""", listquery, fromDate, toDate, campusprogramid);
                return Ok(db.StudentRevenuePaidExx2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentRevenueWiseExx, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

          [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetStudentRevenueWiseExyNew([FromBody] Predicate model)
        {
            try
            {
                var listquery = (model.ProvidedString.Split("?")[0]);
                var fromDate = (model.ProvidedString.Split("?")[1]);
                var toDate = (model.ProvidedString.Split("?")[2]);
                var campusprogramid = (model.ProvidedString.Split("?")[3]);
                this.db.Database.SetCommandTimeout(100);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""CourseStudentRevnueListWithExem2exy""('{0}','{1}','{2}','{3}')  ORDER BY ""RollNo""", listquery, fromDate, toDate, campusprogramid);
                return Ok(db.StudentRevenuePaidEx2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentRevenueWiseExy, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }






        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetStudentRevenueWiseExy([FromBody] Predicate model)
        {
            try
            {
                var listquery = (model.ProvidedString.Split("?")[0]);
                var fromDate = (model.ProvidedString.Split("?")[1]);
                var toDate = (model.ProvidedString.Split("?")[2]);
                var campusprogramid = new Guid(model.ProvidedString.Split("?")[3]);
                this.db.Database.SetCommandTimeout(100);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""CourseStudentRevnueListWithExem2""('{0}','{1}','{2}','{3}')  ORDER BY ""RollNo""", listquery, fromDate, toDate, campusprogramid);
                return Ok(db.StudentRevenuePaidEx2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentRevenueWiseExy, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetTeacherAttendanceReport([FromBody] Predicate model)
        {
            try
            {
                var listquery = (model.ProvidedString.Split("?")[0]);
                var fromDate = (model.ProvidedString.Split("?")[1]);
                this.db.Database.SetCommandTimeout(100);
                string sql = String.Format(@"SELECT * FROM ""Attendance"".""GetTeacherAttendenceReport""('{0}','{1}')", listquery, fromDate);
                return Ok(db.TeacherAttendancereport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentRevenueWiseExy, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStdMailingLabel([FromBody] Predicate model)
        {
            try
            {
                //string sql = String.Format(@"SELECT * FROM ""Fee"".""DuesList""('{0}')", model.ProvidedString);
                string sql = String.Format(@"SELECT * FROM ""Registration"".""StdMailingLabels""('{0}')", model.ProvidedString);


                return Ok(db.StdMailingLabel.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStdMailingLabel, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionCityWise([FromBody] Predicate model)
        {
            try
            {
                var z = new Guid(model.ProvidedString);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""GetStaticsData""('{0}',{1})", z, DomainContext.User.UserId);
                return Ok(db.AdmissionStaticsWise.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllFeeDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionSOI([FromBody] Predicate model)
        {
            try
            {
                var fromDate = (model.ProvidedString.Split("?")[0]);
                var toDate = (model.ProvidedString.Split("?")[1]);
                string sql = String.Format(@"SELECT * FROM ""OnlineAdmission"".""SourceInfo""('{0}','{1}')", fromDate, toDate);
                return Ok(db.VWSourceInfo.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionSOI, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeDetailFinalDefaulter([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""DuesList""('{0}') Where ""Total"">0 ", model.ProvidedString);
                return Ok(db.FinalDuesList.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllFeeDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckRemarks([FromBody] Predicate model)
        {
            try
            {
                //var data = (model.ProvidedString.Split("?")[0]);

                var z = this.db.Predicate.FromSql(String.Format("SELECT \"ProvidedString\" FROM \"Examination\".\"VWCampusFailCriteriaMappingDescription\" WHERE \"CampusProgramId\"='{0}'", model.ProvidedString));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckStudent()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckRemarksparam([FromBody] Predicate model)
        {
            try
            {
                var data = (model.ProvidedString.Split("?")[0]);

                var z = this.db.Predicate.FromSql(String.Format("SELECT \"Description\" AS \"ProvidedString\" FROM \"Examination\".\"FailDetailCriteria\" WHERE \"CampusProgramId\"={0} and LENGTH( \"Description\" ) > 2 GROUP BY \"Description\"", data));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckStudent()" + ex.Message;
                app.Time = DateTime.Now;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamRemarks([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""NewID"",cv.""AdmissionFormId"", cv.""SessionName"" ,cv.""RollNo"" ,cv.""StudentName"", cv.""CampusName"", cv.""Description"", cv.""ClassName"",cv.""OverAllRemark"", cv.""SectionName""', '""Examination"".""VWExamRemarksReport"" AS cv', '{0}')
    AS TBL (
    ""NewID"" UUID,
    ""AdmissionFormId"" UUID,
    ""SessionName"" TEXT,
    ""RollNo"" TEXT,
    ""StudentName"" TEXT,
    ""CampusName"" TEXT,
    ""Description"" TEXT,
    ""ClassName"" TEXT,
    ""OverAllRemark"" TEXT,
    ""SectionName"" TEXT);", model.ProvidedString);

                return Ok(this.db.ExaminationRemarks.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetEnrolledStudentsContact, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetail([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailGen([FromBody] Predicate model)
        {
            try
            {
                //                 string sql = String.Format (@"SELECT * FROM ""public"".""Query""('cv.*', '""Admission"".""VWAdmissionReportEx"" AS cv', '{0}')
                // AS ""AdmissionReportsdet"" (
                //     ""StudentId"" UUID,
                //     ""RefferenceNo"" TEXT,
                //     ""AdmissionDate"" DATE,
                //     ""StatusId"" INT4,
                //     ""LoggerId"" UUID,
                //     ""FormNo"" TEXT,
                //     ""FullName"" TEXT,
                //     ""FatherName"" TEXT,
                //     ""ParentCNIC"" TEXT,
                //     ""StudentCNIC"" TEXT,
                //     ""ParentContactNo"" JSONB,
                //     ""DateOfBirth"" DATE,
                //     ""Description"" TEXT,
                //     ""CampusName"" TEXT,
                //     ""Logo"" TEXT,
                //     ""SessionName"" TEXT,
                //     ""ShiftName"" TEXT,
                //     ""SessionId"" UUID,
                //     ""CampusId"" UUID,
                //     ""StudentType"" TEXT,
                //     ""GenderType"" TEXT,
                //     ""Year"" TEXT,
                //     ""BoardRollNo"" TEXT,
                //     ""Obtained"" TEXT,
                //     ""Total"" TEXT,
                //     ""Board"" TEXT,
                //     ""ParentContact"" JSONB,
                //     ""Address"" JSONB,
                //     ""AcademicInfo"" JSONB,
                //     ""EnrollmentNo"" TEXT,
                //     ""GenderId"" UUID,
                //     ""ProgramDetailId"" UUID,
                //     ""CityName"" TEXT,
                //     ""DegreeId"" UUID,
                //     ""GroupId"" UUID,
                //     ""DegreeName"" TEXT,
                //     ""GroupName"" TEXT,
                //     ""CityId"" UUID,
                //     ""ProgramId"" UUID,
                //     ""ProgramName"" TEXT,
                //     ""SubCityId"" UUID,
                //     ""Name"" CHARACTER VARYING,
                //     ""AdmissionTypeId"" UUID);", model.ProvidedString);

                //   string sql = String.Format(@"SELECT * FROM ""Admission"".""AdmissionReportEx""('{0}')", model.ProvidedString);

                //                 return Ok(db.ExamGazetteReport.FromSql(sql));

                string sql = String.Format(@"SELECT * FROM ""Admission"".""FormCollectionSummary""('{0}',{1})", model.ProvidedString, DomainContext.User.UserId);

                // return Ok (this.db.FormReport.FromSql (sql));
                // Console.WriteLine(sql);

                return Ok(this.db.AdmissionReportsdet.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionDetailFee([FromBody] Predicate model)
        {
            try
            {
                string sql = "";
                var where = (model.ProvidedString.Split("?")[0]);
                var opt = (model.ProvidedString.Split("?")[1]);
                if (opt == "1")
                {
                    sql = String.Format(@"SELECT * FROM ""Admission"".""FormCollectionSummaryFee2""('{0}',{1})", where, DomainContext.User.UserId);
                }
                else
                {

                    sql = String.Format(@"SELECT * FROM ""Admission"".""FormCollectionSummaryFee""('{0}',{1})", where, DomainContext.User.UserId);



                }



                // return Ok (this.db.FormReport.FromSql (sql));
                // Console.WriteLine(sql);

                return Ok(this.db.AdmissionReportsdet.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllStepAdmissionDetailGen([FromBody] Predicate model)
        {
            try
            {

                var data = (model.ProvidedString.Split("?")[0]);
                string opt = (model.ProvidedString.Split("?")[1]);
                string sql = "";

                if (opt == "R")
                {

                    sql = String.Format(@"SELECT * FROM ""Admission"".""FormCollectionSummary""('{0}',{1}) where  ""CampusName"" ilike 'Step%' and ""FormNo""!='Online'", data, DomainContext.User.UserId);

                }
                if (opt == "O")
                {

                    sql = String.Format(@"SELECT * FROM ""Admission"".""FormCollectionSummary""('{0}',{1}) where  ""CampusName"" ilike 'Step%' and ""FormNo""='Online'", data, DomainContext.User.UserId);

                }

                // Console.WriteLine(sql);

                return Ok(this.db.AdmissionReportsdet.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFormReport([FromBody] Predicate model)
        {
            try
            {

                string sql = String.Format(@"SELECT * FROM ""Admission"".""FormCollectionData2""('{0}',{1})", model.ProvidedString, DomainContext.User.UserId);

                return Ok(this.db.FormReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFormReportEx([FromBody] Predicate model)
        {
            try
            {

                string sql = String.Format(@"SELECT * FROM ""Admission"".""FormCollectionData3""('{0}',{1})", model.ProvidedString, DomainContext.User.UserId);

                return Ok(this.db.FormReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeDefaulterSummary([FromBody] Predicate model)
        {
            try
            {
                // var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                // var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                // var inst = Convert.ToInt32(model.ProvidedString.Split("?")[2]);

                // string sql = String.Format(@"SELECT * FROM ""Fee"".""FeeDeafulterEx""('{0}','{1}',{2})", sessionid, campusid, inst);


                var where = model.ProvidedString.Split("?")[0];
                var inst = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

                string sql = String.Format(@"SELECT * FROM ""Fee"".""FeeDeafulterExEx""('{0}','{1}')", where, inst);

                return Ok(this.db.FeeDefaultEx.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on FeeDeafulterEx, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailSec([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var sectionid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.SectionId == sectionid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.SectionId == sectionid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailSec, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailComp([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailComp, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAllAdmissionDetailProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetAdmissionReportBoardWiseGen([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Admission"".""VWAdmissionReport"" AS cv', '{0}')
AS TBL (
    ""StudentId"" UUID,
    ""RefferenceNo"" TEXT,
    ""AdmissionDate"" DATE,
    ""StatusId"" INT4,
    ""LoggerId"" UUID,
    ""FullName"" TEXT,
    ""FatherName"" TEXT,
    ""ParentCNIC"" TEXT,
    ""ParentContactNo"" JSONB,
    ""DateOfBirth"" DATE,
    ""Description"" TEXT,
    ""CampusName"" TEXT,
    ""Logo"" TEXT,
    ""SessionName"" TEXT,
    ""ShiftName"" TEXT,
    ""SessionId"" UUID,
    ""CampusId"" UUID,
    ""StudentType"" TEXT,
    ""GenderType"" TEXT,
    ""Year"" TEXT,
    ""BoardRollNo"" TEXT,
    ""Obtained"" TEXT,
    ""Total"" TEXT,
    ""Board"" TEXT,
    ""ParentContact"" TEXT,
    ""Address"" JSONB,
    ""AcademicInfo"" JSONB,
    ""EnrollmentNo"" TEXT,
    ""GenderId"" UUID,
    ""ProgramDetailId"" UUID,
    ""AddressId"" UUID,
    ""CityName"" TEXT,
    ""DegreeId"" UUID,
    ""GroupId"" UUID,
    ""DegreeName"" TEXT,
    ""GroupName"" TEXT,
    ""CityId"" UUID,
    ""ProgramId"" UUID,
    ""ProgramName"" TEXT,
    ""SubCityId"" UUID,
    ""Name"" CHARACTER VARYING,
    ""AdmissionTypeId"" UUID);", model.ProvidedString);
                // Console.WriteLine(sql); ;
                return Ok(this.db.AdmissionReportsdet.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportBoardWiseGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportYearWiseGen([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Admission"".""VWAdmissionReport"" AS cv', '{0}')
AS TBL (
    ""StudentId"" UUID,
    ""RefferenceNo"" TEXT,
    ""AdmissionDate"" DATE,
    ""StatusId"" INT4,
    ""LoggerId"" UUID,
    ""FullName"" TEXT,
    ""FatherName"" TEXT,
    ""ParentCNIC"" TEXT,
    ""ParentContactNo"" JSONB,
    ""DateOfBirth"" DATE,
    ""Description"" TEXT,
    ""CampusName"" TEXT,
    ""Logo"" TEXT,
    ""SessionName"" TEXT,
    ""ShiftName"" TEXT,
    ""SessionId"" UUID,
    ""CampusId"" UUID,
    ""StudentType"" TEXT,
    ""GenderType"" TEXT,
    ""Year"" TEXT,
    ""BoardRollNo"" TEXT,
    ""Obtained"" TEXT,
    ""Total"" TEXT,
    ""Board"" TEXT,
    ""ParentContact"" TEXT,
    ""Address"" JSONB,
    ""AcademicInfo"" JSONB,
    ""EnrollmentNo"" TEXT,
    ""GenderId"" UUID,
    ""ProgramDetailId"" UUID,
    ""AddressId"" UUID,
    ""CityName"" TEXT,
    ""DegreeId"" UUID,
    ""GroupId"" UUID,
    ""DegreeName"" TEXT,
    ""GroupName"" TEXT,
    ""CityId"" UUID,
    ""ProgramId"" UUID,
    ""ProgramName"" TEXT,
    ""SubCityId"" UUID,
    ""Name"" CHARACTER VARYING,
    ""AdmissionTypeId"" UUID);", model.ProvidedString);
                // Console.WriteLine(sql); ;
                return Ok(this.db.AdmissionReportsdet.FromSql(sql));

            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportYearWiseGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportAddressWiseGen([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Admission"".""VWAdmissionReport"" AS cv', '{0}')
AS TBL (
    ""StudentId"" UUID,
    ""RefferenceNo"" TEXT,
    ""AdmissionDate"" DATE,
    ""StatusId"" INT4,
    ""LoggerId"" UUID,
    ""FullName"" TEXT,
    ""FatherName"" TEXT,
    ""ParentCNIC"" TEXT,
    ""ParentContactNo"" JSONB,
    ""DateOfBirth"" DATE,
    ""Description"" TEXT,
    ""CampusName"" TEXT,
    ""Logo"" TEXT,
    ""SessionName"" TEXT,
    ""ShiftName"" TEXT,
    ""SessionId"" UUID,
    ""CampusId"" UUID,
    ""StudentType"" TEXT,
    ""GenderType"" TEXT,
    ""Year"" TEXT,
    ""BoardRollNo"" TEXT,
    ""Obtained"" TEXT,
    ""Total"" TEXT,
    ""Board"" TEXT,
    ""ParentContact"" TEXT,
    ""Address"" JSONB,
    ""AcademicInfo"" JSONB,
    ""EnrollmentNo"" TEXT,
    ""GenderId"" UUID,
    ""ProgramDetailId"" UUID,
    ""AddressId"" UUID,
    ""CityName"" TEXT,
    ""DegreeId"" UUID,
    ""GroupId"" UUID,
    ""DegreeName"" TEXT,
    ""GroupName"" TEXT,
    ""CityId"" UUID,
    ""ProgramId"" UUID,
    ""ProgramName"" TEXT,
    ""SubCityId"" UUID,
    ""Name"" CHARACTER VARYING,
    ""AdmissionTypeId"" UUID);", model.ProvidedString);
                // Console.WriteLine(sql); ;
                return Ok(this.db.AdmissionReportsdet.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportAddressWiseGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportBoardWiseProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportBoardWiseProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportYearWiseProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportYearWiseProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportAddressWiseProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportAddressWiseProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportBoardWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportBoardWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportYearWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportYearWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportAddressWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportAddressWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportBoardWiseGenProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportBoardWiseGenProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportYearWiseGenProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportYearWiseGenProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportAddressWiseGenProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);

                return Ok(this.db.AdmissionReports.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportAddressWiseGenProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMatricMarksReport([FromBody] Predicate model)
        {
            try
            {
                //             string sql = String.Format (@"SELECT * FROM ""public"".""Query""('cv.""AdmissionFormId"", cv.""EnrollmentNo"" ,cv.""StudentName"", cv.""CampusName"", cv.""Description"", cv.""MatricMarks""', '""Admission"".""VWMatricMarksReport"" AS cv', '{0}')
                // AS TBL (
                // ""AdmissionFormId"" UUID,
                // ""EnrollmentNo"" TEXT,
                // ""StudentName"" TEXT,
                // ""CampusName"" TEXT,
                // ""Description"" TEXT,
                // ""MatricMarks"" TEXT);", model.ProvidedString);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""MatricMarksReport""('{0}',{1})", model.ProvidedString, DomainContext.User.UserId);
                // Console.WriteLine(sql);

                return Ok(this.db.AdmissionMatricMarks.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetMatricMarksReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMatricPercReport([FromBody] Predicate model)
        {
            try
            {
                //             string sql = String.Format (@"SELECT * FROM ""public"".""Query""('cv.""NewID"", cv.""StudentsCount"", cv.""CityName"" ,cv.""SessionName"", cv.""MarksPercentage"", cv.""Description"", cv.""Grade""', '""Admission"".""VWStudentMarksPercReport"" AS cv', '{0}')
                // AS TBL (
                // ""NewID"" UUID,
                // ""StudentsCount"" BIGINT,
                // ""CityName"" TEXT,
                // ""SessionName"" TEXT,
                // ""MarksPercentage"" TEXT,
                // ""Description"" TEXT,
                // ""Grade"" TEXT);", model.ProvidedString);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""StudentsMarksPercentageReport""('{0}',{1})", model.ProvidedString, DomainContext.User.UserId);
                // Console.WriteLine(sql);

                return Ok(this.db.AdmissionMatricPerc.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetMatricPercReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessCountReport([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""StudentConcessCountReport""('{0}',{1})", model.ProvidedString, DomainContext.User.UserId);

                return Ok(db.FeeConcessCountReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStepCountReport([FromBody] Predicate model)
        {
            try
            {
                var providedstring = model.ProvidedString.Split("?")[0];
                var fromDate = model.ProvidedString.Split("?")[1];
                var toDate = model.ProvidedString.Split("?")[2];
                string sql = String.Format(@"SELECT * FROM ""Fee"".""StudentConcessCountReportEx""('{0}','{1}','{2}',{3})", providedstring, fromDate, toDate, DomainContext.User.UserId);

                return Ok(db.FeeStepCountReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on StudentConcessCountReportEx, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetPreAdmissionReport([FromBody] Predicate model)
        {
            try
            {
                var providedstring = model.ProvidedString.Split("?")[0];
                var fromDate = model.ProvidedString.Split("?")[1];
                var toDate = model.ProvidedString.Split("?")[2];
                string sql = String.Format(@"SELECT * FROM ""Admission"".""PreAdmission""('{0}','{1}','{2}',{3})", providedstring, fromDate, toDate, DomainContext.User.UserId);

                return Ok(db.PreAdmissionReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetPreAdmissionReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public IActionResult GetUndergraduateAdmissionReport([FromBody] Predicate model)
        {
            try
            {
                var providedstring = model.ProvidedString.Split("?")[0];
                var fromDate = model.ProvidedString.Split("?")[1];
                var toDate = model.ProvidedString.Split("?")[2];
                string sql = String.Format(@"SELECT * FROM ""Admission"".""UndergraduateAdmission""('{0}','{1}','{2}',{3})", providedstring, fromDate, toDate, DomainContext.User.UserId);

                return Ok(db.PreAdmissionReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetUndergraduateAdmission, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetRegularAdmissionReport([FromBody] Predicate model)
        {
            try
            {
                var providedstring = model.ProvidedString.Split("?")[0];
                var fromDate = model.ProvidedString.Split("?")[1];
                var toDate = model.ProvidedString.Split("?")[2];
                string sql = String.Format(@"SELECT * FROM ""Admission"".""RegularAdmission""('{0}','{1}','{2}',{3})", providedstring, fromDate, toDate, DomainContext.User.UserId);

                return Ok(db.RegularAdmissionReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetRegularAdmissionReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        //ENROLLED*******************************************************************************
        //ENROLLED*******************************************************************************

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportEnrolledBoardWiseGen([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledBoardWiseGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportEnrolledYearWiseGen([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledYearWiseGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportEnrolledAddressWiseGen([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);



                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));


                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledAddressWiseGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportEnrolledBoardWiseProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledBoardWiseProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportEnrolledYearWiseProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledYearWiseProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportEnrolledAddressWiseProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledAddressWiseProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportEnrolledBoardWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledBoardWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportEnrolledYearWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledYearWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetAdmissionReportEnrolledAddressWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledAddressWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportEnrolledBoardWiseGenProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledBoardWiseGenProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportEnrolledYearWiseGenProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledYearWiseGenProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionReportEnrolledAddressWiseGenProg([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAdmissionReportEnrolledAddressWiseGenProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailEnrolled([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[5]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailGenEnrolled([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailGen, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailSecEnrolled([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var sectionid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);

                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.SectionId == sectionid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.SectionId == sectionid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailSec, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailCompEnrolled([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var genderid = new Guid(model.ProvidedString.Split("?")[5]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[6]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[7]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[9]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.GenderId == genderid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionDetailProgEnrolled([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subCityid = new Guid(model.ProvidedString.Split("?")[2]);
                var campusid = new Guid(model.ProvidedString.Split("?")[3]);
                var programid = new Guid(model.ProvidedString.Split("?")[4]);
                var programdetailid = new Guid(model.ProvidedString.Split("?")[5]);
                var admissiontypeid = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[8]);


                return Ok(this.db.AdmissionReportsEnrolled.Where(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.admissionRepositoryEnrolled.FindBy(s => s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subCityid && s.CampusId == campusid && s.ProgramId == programid && s.ProgramDetailId == programdetailid && s.AdmissionTypeId == admissiontypeid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionDetailProg, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        //ENROLLED*******************************************************************************
        //ENROLLED*******************************************************************************

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionSlip([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var studentid = new Guid(model.ProvidedString.Split("?")[2]);
                var refferenceNo = model.ProvidedString.Split("?")[3];
                string sql = (String.Format(@"select * from ""Admission"".""VWAdmissionReport"" as v where v.""SessionId""='{0}' and v.""CampusId""='{1}' and v.""StudentId""='{2}' and v.""RefferenceNo"" = '{3}'", sessionid, campusid, studentid, refferenceNo));
                return Ok(this.db.AdmissionReports.FromSql(sql));
                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StudentId == studentid && s.StatusId != 2));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionSlip, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllAdmissionSlipEx([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var studentid = new Guid(model.ProvidedString.Split("?")[2]);
                string sql = (String.Format(@"select * from ""Admission"".""VWAdmissionReportVM"" as v where v.""SessionId""='{0}' and v.""CampusId""='{1}' and v.""AdmissionFormId""='{2}'", sessionid, campusid, studentid));
                return Ok(this.db.AdmissionReportsVM.FromSql(sql));
                //return Ok(this.admissionRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StudentId == studentid && s.StatusId != 2));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionSlip, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllAdmissionAcademicReport()
        {
            try
            {
                return Ok(this.db.AdmissionReports);
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllAdmissionAcademicReport, " + err.Message;
                app.Time = DateTime.Now;
                //app.Data = JsonConvert.SerializeObject ();
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllFeeDetail([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""FeeReports""('{0}')", model.ProvidedString);
                return Ok(db.FeeReportsData.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllFeeDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetScholarshipReport([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""ScholarshipReport""('{0}')", model.ProvidedString);
                return Ok(db.ScholarshipReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllFeeDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeDefaulterDetail([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""FeeDefaulterReports""('{0}')", model.ProvidedString);
                return Ok(db.FeeDefaulterReportnew.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDefaulterDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeStat([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var inst = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""FeeStat""('{0}','{1}',{2})", sessionid, campusid, inst);
                return Ok(db.FeeStatEx.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeStat, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetWithDrawllist([FromBody] Predicate model)
        {
            try
            {
                var providedstring = (model.ProvidedString.Split("?")[0]);
                var collegecode = (model.ProvidedString.Split("?")[1]);
                var orderby = (model.ProvidedString.Split("?")[2]);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""AdmissionWithdrawl""('{0}','{1}','{2}')", providedstring, collegecode, orderby);
                return Ok(db.AdmissionWithdrawl.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on AdmissionWithdrawl, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetGenderConCount([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
                var classid = new Guid(model.ProvidedString.Split("?")[3]);
                // var fromdate = Convert.ToDateTime (model.ProvidedString.Split ("?") [4]);
                // var todate = Convert.ToDateTime (model.ProvidedString.Split ("?") [5]);

                var fromdate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[4]));
                var todate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[5]));
                var inst = Convert.ToInt32(model.ProvidedString.Split("?")[6]);

                // var inst = Convert.ToInt32 (model.ProvidedString.Split ("?") [2]);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""GenderWiseConCount""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", sessionid, cityid, subcityid, classid, fromdate, todate, inst);
                return Ok(db.GenderWiseCountEx.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetGenderConCount, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetGenderConCountEx([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                //var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
                var classid = new Guid(model.ProvidedString.Split("?")[2]);
                // var fromdate = Convert.ToDateTime (model.ProvidedString.Split ("?") [4]);
                // var todate = Convert.ToDateTime (model.ProvidedString.Split ("?") [5]);

                var fromdate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[3]));
                var todate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[4]));
                var inst = Convert.ToInt32(model.ProvidedString.Split("?")[5]);

                // var inst = Convert.ToInt32 (model.ProvidedString.Split ("?") [2]);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""GenderWiseConCount""('{0}','{1}','{2}','{3}','{4}',{5})", sessionid, cityid, classid, fromdate, todate, inst);
                return Ok(db.GenderWiseCountEx.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetGenderConCount, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetGenderCount([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
                var classid = new Guid(model.ProvidedString.Split("?")[3]);
                // var fromdate = Convert.ToDateTime (model.ProvidedString.Split ("?") [4]);
                // var todate = Convert.ToDateTime (model.ProvidedString.Split ("?") [5]);

                var fromdate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[4]));
                var todate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[5]));
                // var inst = Convert.ToInt32 (model.ProvidedString.Split ("?") [2]);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""GenderWiseCount""('{0}','{1}','{2}','{3}','{4}','{5}')", sessionid, cityid, subcityid, classid, fromdate, todate);
                return Ok(db.GenderWiseCount.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetGenderCount, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetGenderCountEx([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var cityid = new Guid(model.ProvidedString.Split("?")[1]);
                // var subcityid = new Guid(model.ProvidedString.Split("?")[2]);
                var classid = new Guid(model.ProvidedString.Split("?")[2]);
                // var fromdate = Convert.ToDateTime (model.ProvidedString.Split ("?") [4]);
                // var todate = Convert.ToDateTime (model.ProvidedString.Split ("?") [5]);

                var fromdate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[3]));
                var todate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[4]));
                // var inst = Convert.ToInt32 (model.ProvidedString.Split ("?") [2]);
                string sql = String.Format(@"SELECT * FROM ""Admission"".""GenderWiseCount""('{0}','{1}','{2}','{3}','{4}')", sessionid, cityid, classid, fromdate, todate);
                return Ok(db.GenderWiseCount.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetGenderCount, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeDefaulterDetailEnr([FromBody] Predicate model)
        {
            try
            {
                var ps = model.ProvidedString.Split("?")[0];
                var classid = model.ProvidedString.Split("?")[1];
                string sql = String.Format(@"SELECT * FROM ""Fee"".""FeeDefaulterReportsWithEnrolledEx""('{0}','{1}')", ps, classid);
                return Ok(db.FeeDefaulterReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDefaulterDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllFeeDetailVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);

                return Ok(this.db.FeeReports.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                //return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAllFeeDetailVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFeeDetailOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDetailOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetDailyFeeStatement([FromBody] Predicate model)
        {
            string json = String.Format(" SELECT * FROM \"Fee\".\"FeeReport2\"('{0}')", model.ProvidedString);
            return Ok(this.db.VWFeeStatement.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDailyFeeStatementEnrolled([FromBody] Predicate model)
        {
            this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);

            string json = String.Format(" SELECT * FROM \"Fee\".\"FeeReportEnrolled2\"('{0}')", model.ProvidedString);
            return Ok(this.db.FeeStatementExinstall.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDailyFeeStatementEnrolled2([FromBody] Predicate model)
        {
            var query = model.ProvidedString.Split("?")[0];
            var orderby = model.ProvidedString.Split("?")[1];
            this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);

            string json = String.Format(" SELECT * FROM \"Fee\".\"FeeReportEnrolled2\"('{0}')", query);
            return Ok(this.db.FeeStatementExinstall.FromSql(json));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDailyFeeStatementEnrolledTrackHistory([FromBody] Predicate model)
        {
            var query = model.ProvidedString.Split("?")[0];
            var orderby = model.ProvidedString.Split("?")[1];
            this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);

            string json = String.Format(" SELECT * FROM \"Fee\".\"FeeReportEnrolledTrackHistory\"('{0}')", query);
            return Ok(this.db.FeeStatementExinstall.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetInstallemntexamption([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[3]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[4]);
            var installemnt = model.ProvidedString.Split("?")[5];

            string json = String.Format(@"SELECT * FROM ""Fee"".""InstallementExcemptionReport""('{0}','{1}','{2}','{3}','{4}',{5})", sessionid, campusid, programid, classid, shiftid, installemnt);
            return Ok(this.db.Installemntexamption.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetInstallemntexamption2([FromBody] Predicate model)
        {

            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[3]);
            var shiftid = new Guid(model.ProvidedString.Split("?")[4]);
            var installemnt = model.ProvidedString.Split("?")[5];
            var Gender = new Guid(model.ProvidedString.Split("?")[6]);

            string json = String.Format(@"SELECT * FROM ""Fee"".""InstallementExcemptionReport2""('{0}','{1}','{2}','{3}','{4}',{5},'{6}')", sessionid, campusid, programid, classid, shiftid, installemnt, Gender);
            return Ok(this.db.Installemntexamption.FromSql(json));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDailyFeeStatementEnrolledEx([FromBody] Predicate model)
        {
            this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);

            string json = String.Format(" SELECT * FROM \"Fee\".\"FeeReportEnrolled2C\"('{0}')", model.ProvidedString);
            return Ok(this.db.FeeStatementExinstall.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDailyFeeStatementVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.db.VWFeeStatement.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && (s.PaidDate >= fromDate && s.PaidDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetDailyFeeStatementVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetDailyFeeStatementOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.db.VWFeeStatement.Where(s => s.SessionId == sessionid && s.CampusId == campusid && (s.PaidDate >= fromDate && s.PaidDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetDailyFeeStatementOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeAverageRevenue([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeAverageRevenue, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeAverageRevenueOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeAverageRevenueOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeAverageRevenueVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeAverageRevenueVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeDetailProgramWise([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDetailProgramWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeDetailProgramWiseOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDetailProgramWiseOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeDetailProgramWiseVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDetailProgramWiseVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionDetails([FromBody] Predicate model)
        {
            try
            {
                // var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                // var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                // var programid = new Guid(model.ProvidedString.Split("?")[2]);
                // var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                // var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                // var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                // return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));

                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.*', '""Fee"".""VWFeeReports"" AS cv', '{0}')
AS TBL (
   ""RollNo"" Text,
    ""RefferenceNo""Text,
    ""StatusId"" int4,
    ""FullName""Text,
    ""FatherName""Text,
   ""Description""Text,
    ""CampusName""Text,
    ""SessionName""Text,
    ""ShiftName""Text,
    ""InstallmentNo"" INT4,
    ""ChallanNo""Text,
    ""FeeAmount""INT4,
    ""DueDate"" Date,
    ""PaidDate""Date,
     ""FeeDetail""INT4,
     ""PayableAmount""INT4,
    ""ConcessionName"" Text,
    ""StudentId"" UUID,
    ""LoggerId""UUID,
   ""CampusId""UUID,
   ""SessionId""UUID,
   ""ProgramDetailId""UUID,
    ""AdmissionDate"" Date,
    ""GenderId""UUID,
    ""GenderName"" Text,
    ""ClassId""UUID,
    ""ClassName""Text,
    ""StudentContactNo""JSONB,
      ""SectionName""Text ,
     ""SectionCourseLinkId""UUID,
    ""ParentContactNo"" jsonb);", model.ProvidedString);

                // Console.WriteLine(sql);

                return Ok(this.db.FeeReports.FromSql(sql));

            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionDetails, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult getFeeConcessionDetailsOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on getFeeConcessionDetailsOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionDetailsVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionDetailsVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionStrength([FromBody] Predicate model)
        {
            try
            {

                this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);

                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('DISTINCT cv.""AdmissionFormId"" AS ""ID"", cv.""RefferenceNo"" ,cv.""Description"", cv.""FullName"", cv.""Concession"", cv.""InstallmentNo"",cv.""SessionName"", cv.""CampusName"", cv.""ProgramName"",cv.""FatherName"",cv.""ShiftName"",cv.""ClassName"" , cv.""GenderName"" , cv.""Remarks""', '""Fee"".""VWConcessionReportData"" AS cv',  '{0}')
        AS TBL (
        ""ID"" UUID,
        ""RefferenceNo"" TEXT,
        ""Description"" TEXT,
        ""FullName"" TEXT,
        ""Concession"" TEXT,
	    ""InstallmentNo"" INT,
        ""SessionName"" Text,
        ""CampusName"" TEXT,
        ""ProgramName"" TEXT,
		""FatherName"" Text,
		""ShiftName"" Text,
        ""ClassName"" Text,
        ""GenderName"" Text,
        ""Remarks"" Text);", model.ProvidedString);

                return Ok(this.db.ConcessionReports.FromSql(sql));

            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionStrength, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionStrengthUnpaid([FromBody] Predicate model)
        {
            try
            {

                this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);


                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""ID"", cv.""RefferenceNo"" ,cv.""Description"", cv.""FullName"", cv.""Concession"", cv.""InstallmentNo"",cv.""SessionName"", cv.""CampusName"", cv.""ProgramName"",cv.""FatherName"",cv.""ShiftName"",cv.""PaidDate"",cv.""ClassName"" , cv.""GenderName"" , cv.""Remarks""', '""Fee"".""VWConcessionReportDataUnpaid"" AS cv',  '{0}')
        AS TBL (
        ""ID"" UUID,
        ""RefferenceNo"" TEXT,
        ""Description"" TEXT,
        ""FullName"" TEXT,
        ""Concession"" TEXT,
	    ""InstallmentNo"" INT,
        ""SessionName"" Text,
        ""CampusName"" TEXT,
        ""ProgramName"" TEXT,
		""FatherName"" Text,
		""ShiftName"" Text,
		""PaidDate"" Date,
        ""ClassName"" Text,
        ""GenderName"" Text,
        ""Remarks"" Text);", model.ProvidedString);

                return Ok(this.db.ConcessionReports.FromSql(sql));

            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionStrengthUnpaid, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionStrengthVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionStrengthVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionStrengthOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionStrengthOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionStrengthSummary([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionStrengthSummary, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionStrengthSummaryOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionStrengthSummaryOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeConcessionStrengthSummaryVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionStrengthSummaryVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeDefaulter([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDefaulter, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeDefaulterVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDefaulterVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeDefaulterOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeDefaulterOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeFinalDuesList([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeFinalDuesList, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeFinalDuesListVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeFinalDuesListVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetFeeFinalDuesListOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeFinalDuesListOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetScholashipStudents([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetScholashipStudents, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetScholashipStudentsOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetScholashipStudentsOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetScholashipStudentsVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetScholashipStudentsVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentChallanStatus([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var genderid = new Guid(model.ProvidedString.Split("?")[3]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.GenderId == genderid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentChallanStatus, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentChallanStatusOnly([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentChallanStatusOnly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentChallanStatusVM([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var programid = new Guid(model.ProvidedString.Split("?")[2]);
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
                return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetStudentChallanStatusVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTimeTableReport([FromBody] Predicate model)
        {
            try
            {
                var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
                var campusid = new Guid(model.ProvidedString.Split("?")[1]);
                var sectionid = new Guid(model.ProvidedString.Split("?")[2]);
                var programid = new Guid(model.ProvidedString.Split("?")[3]);
                var classid = new Guid(model.ProvidedString.Split("?")[4]);

                return Ok(this.db.TimeTableReport.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.SectionId == sectionid && s.CampusProgramId == programid && s.ClassId == classid && s.StatusId == 1));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetTimeTableReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        //Refined Fun of concession report data
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult GetConcessionReportData([FromBody] Predicate model)
        {
            try
            {
                this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);

                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('DISTINCT cv.""AdmissionFormId"" AS ""ID"", cv.""RefferenceNo"" ,cv.""Description"", cv.""FullName"", cv.""Concession"", cv.""InstallmentNo"",cv.""SessionName"", cv.""CampusName"", cv.""ProgramName"",cv.""FatherName"",cv.""ShiftName"",cv.""ClassName"" , cv.""GenderName"" , cv.""Remarks""', '""Fee"".""VWConcessionReportData"" AS cv',  '{0}')
AS TBL (
    ""ID"" UUID,
    ""RefferenceNo"" TEXT,
    ""Description"" TEXT,
    ""FullName"" TEXT,
   ""Concession"" TEXT,
	 ""InstallmentNo"" INT,
    ""SessionName"" Text,
    ""CampusName"" TEXT,
    ""ProgramName"" TEXT,
		""FatherName"" Text,
		""ShiftName"" Text,
        ""ClassName"" Text,
        ""GenderName"" Text,
        ""Remarks"" Text);", model.ProvidedString);

                return Ok(this.db.ConcessionReports.FromSql(sql));

            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionDetails, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConceWithPercentage([FromBody] Predicate model)
        {
            try
            {

                var sessionid = (model.ProvidedString.Split("?")[0]);
                var campusid = (model.ProvidedString.Split("?")[1]);
                var gender = (model.ProvidedString.Split("?")[2]);


                this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);


                string sql = String.Format(@"SELECT * FROM ""Fee"".""ConceReportwithPercentage1""('{0}','{1}','{2}')", sessionid, campusid, gender);
                Console.WriteLine(sql);

                return Ok(db.ConceReportwithPercentage.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetConceWithPercentage, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        //         [HttpPost]
        //         [Route ("[action]")]
        //         public IActionResult GetEnrolledStudents ([FromBody] Predicate model) {
        //             try {
        //                 string sql = String.Format (@"SELECT * FROM ""public"".""Query""('cv.""AdmissionFormId"", cv.""RefferenceNo"" , cv.""RollNo"" ,cv.""Board"" ,cv.""Obtained"" ,cv.""Religion"" ,cv.""StudentName"", cv.""FatherName"", cv.""Description"",cv.""CampusName"", cv.""SessionName"", cv.""SectionName""', '""Registration"".""VWEnrolledReport"" AS cv', '{0}')
        // AS TBL (
        //     ""AdmissionFormId"" UUID,
        //     ""RefferenceNo"" TEXT,
        //     ""RollNo"" TEXT,
        //     ""Board"" TEXT,
        //     ""Obtained"" TEXT,
        //     ""Religion"" TEXT,
        //     ""StudentName"" TEXT,
        //     ""FatherName"" TEXT,
        // 	 ""Description"" TEXT,
        //     ""CampusName"" Text,
        //     ""SessionName"" TEXT,
        //     ""SectionName"" TEXT);", model.ProvidedString);

        //                 return Ok (this.db.EnrolledReports.FromSql (sql));
        //             } catch (Exception err) {
        //                 AppException app = new AppException ();
        //                 app.Message = "Error on GetEnrolledStudents, " + err.Message;
        //                 app.Time = DateTime.Now;
        //                 app.Data = JsonConvert.SerializeObject (model);
        //                 this.db.AppException.Add (app);
        //                 this.db.SaveChangesAsync ();
        //                 return BadRequest (app.Message);
        //             }
        //         }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEnrolledStudentsContact([FromBody] Predicate model)
        {
            try
            {
                if (model.ProvidedString.Contains("ProgramDetailId"))
                {
                    // Console.WriteLine("Contains yahooooooo ...........................");
                }
                else
                {
                    // Console.WriteLine("Contains pppooooooo ...........................");
                }
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""AdmissionFormId"", cv.""RefferenceNo"" , cv.""RollNo"" ,cv.""Board"" ,cv.""Obtained"" ,cv.""Religion"" ,cv.""StudentName"", cv.""FatherName"", cv.""Address"", cv.""ParentContactNo"",cv.""StudentContactNo"",cv.""Description"",cv.""CampusName"", cv.""SessionName"", cv.""SectionName"",cv.""SectionCourseLinkId"",cv.""StudentCNIC""', '""Registration"".""VWEnrolledReport"" AS cv', '{0}')
AS TBL (
    ""AdmissionFormId"" UUID,
    ""RefferenceNo"" TEXT,
    ""RollNo"" TEXT,
    ""Board"" TEXT,
    ""Obtained"" INT,
    ""Religion"" TEXT,
    ""StudentName"" TEXT,
    ""FatherName"" TEXT,
    ""Address"" JSONB,
    ""ParentContactNo"" JSONB,
    ""StudentContactNo"" JSONB,
	""Description"" TEXT,
    ""CampusName"" Text,
    ""SessionName"" TEXT,
    ""SectionName"" TEXT,
    ""SectionCourseLinkId"" UUID,
    ""StudentCNIC"" TEXT);", model.ProvidedString);

                return Ok(this.db.EnrolledReportsCont.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetEnrolledStudentsContact, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEnrolledStudentsContactEx([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""AdmissionFormId"", cv.""RefferenceNo"" , cv.""RollNo"" ,cv.""Board"" ,cv.""Obtained"" , cv.""Total"", cv.""Percentage"",cv.""Religion"" ,cv.""StudentName"", cv.""FatherName"", cv.""Address"", cv.""ParentContactNo"", cv.""Description"",cv.""CampusName"", cv.""SessionName"", cv.""SectionName"", cv.""ClassName"", cv.""Grade"", cv.""CourseId"", cv.""StaffName""', '""Registration"".""VWStudentListEx"" AS cv', '{0}')
AS TBL (
    ""AdmissionFormId"" UUID,
    ""RefferenceNo"" TEXT,
    ""RollNo"" TEXT,
    ""Board"" TEXT,
    ""Obtained"" INT,
    ""Total"" INT,
	""Percentage"" numeric,
    ""Religion"" TEXT,
    ""StudentName"" TEXT,
    ""FatherName"" TEXT,
    ""Address"" TEXT,
    ""ParentContactNo"" TEXT,
	""Description"" TEXT,
    ""CampusName"" Text,
    ""SessionName"" TEXT,
    ""SectionName"" TEXT,
	""ClassName"" TEXT,
    ""Grade"" TEXT ,
	""CourseId"" uuid,
	""StaffName"" Text);", model.ProvidedString);

                return Ok(this.db.EnrolledReportsContEx2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetEnrolledStudentsContact, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEnrolledStudentsWithoutadd([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""AdmissionFormId"", cv.""RefferenceNo"" , cv.""RollNo"" ,cv.""Religion"" ,cv.""StudentName"", cv.""FatherName"", cv.""ParentContactNo"", cv.""Description"",cv.""CampusName"", cv.""SessionName"", cv.""SectionName""', '""Registration"".""VWEnrolledReportEx"" AS cv', '{0}')
AS TBL (
    ""AdmissionFormId"" UUID,
    ""RefferenceNo"" TEXT,
    ""RollNo"" TEXT,
    ""Religion"" TEXT,
    ""StudentName"" TEXT,
    ""FatherName"" TEXT,
    ""ParentContactNo"" JSONB,
	""Description"" TEXT,
    ""CampusName"" Text,
    ""SessionName"" TEXT,
    ""SectionName"" TEXT);", model.ProvidedString);

                return Ok(this.db.EnrolledReportsWithoutAdd.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetEnrolledStudentsWithoutadd, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        //EXAMINATION*******************************************************************************
        //REPORT************************************************************************************

        [HttpPost]
        [Route("[action]")]
        public IActionResult getStudentsStruckOff([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""NewID"",cv.""AdmissionFormId"",cv.""StudentName"",cv.""RollNo"",cv.""StruckoffReason"", cv.""StruckoffDate"" ,cv.""SessionName"", cv.""CampusName"", cv.""Description"", cv.""ClassName"", cv.""SectionName""', '""Registration"".""VWStruckOffStudents"" AS cv', '{0}')
    AS TBL (
    ""NewID"" UUID,
    ""AdmissionFormId"" UUID,
    ""StudentName"" TEXT,
    ""RollNo"" TEXT,
    ""StruckoffReason"" TEXT,
    ""StruckoffDate"" DATE,
    ""SessionName"" TEXT,
    ""CampusName"" TEXT,
    ""Description"" TEXT,
    ""ClassName"" TEXT,
    ""SectionName"" TEXT);", model.ProvidedString);

                return Ok(this.db.ExaminationStruckOffSt.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetEnrolledStudentsContact, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAwardList([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""AdmissionFormId"", cv.""RollNo"" ,cv.""FullName"", cv.""CampusName"", cv.""Description"", cv.""ClassName"", cv.""SectionName""', '""Examination"".""VWExamReport"" AS cv', '{0}')
    AS TBL (
    ""AdmissionFormId"" UUID,
    ""RollNo"" TEXT,
    ""FullName"" TEXT,
    ""CampusName"" TEXT,
    ""Description"" TEXT,
    ""ClassName"" TEXT,
    ""SectionName"" TEXT);", model.ProvidedString);

                return Ok(this.db.ExaminationReports.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetEnrolledStudentsContact, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult TransportData([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""TransportdataReport""('{0}')", model.ProvidedString);

                return Ok(db.TransportData.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTransportDefaultReport([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""TransportFeeDefaulterReport""('{0}')", model.ProvidedString);

                return Ok(db.TransportDefaulterReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTransportFeeDetailReport([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""TransportdatadetailReport""('{0}')", model.ProvidedString);

                return Ok(db.GetTransportFeeDetailReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetTransportFeeDetailReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamMonthly([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamMonthlyReport""('{0}')", model.ProvidedString);

                return Ok(db.ExamMonthlyReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamMonthlyExm2([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamMonthlyReportExm2""('{0}')", model.ProvidedString);

                return Ok(db.ExamMonthlyReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamMonthlyExx([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExaminationSectionAttendanceExx""('{0}')", model.ProvidedString);

                return Ok(db.ExamMonthlySectionReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthlyExx, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamMonthlyExy([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExaminationSectionAttendanceExy2""('{0}')", model.ProvidedString);

                return Ok(db.ExamMonthlySectionReportExam2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthlyExy, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetStudentsStruckOff([FromBody] Predicate model)
        // {
        //     try
        //     {
        //         string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamStruckOffStudents""('{0}')", model.ProvidedString);

        //         return Ok(db.ExamMonthlyReport.FromSql(sql));
        //     }
        //     catch (Exception err)
        //     {
        //         AppException app = new AppException();
        //         app.Message = "Error on GetStudentsStruckOff, " + err.Message;
        //         app.Time = DateTime.Now;
        //         app.Data = JsonConvert.SerializeObject(model);
        //         this.db.AppException.Add(app);
        //         this.db.SaveChangesAsync();
        //         return BadRequest(app.Message);
        //     }
        // }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicPerformance([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamStudentWise""('{0}',{1})", searchParam, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.AcademicPerformaceStudentWise.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAcademicPerReport([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            var classId = new Guid(model.ProvidedString.Split("?")[4]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[5]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamStudentWiseEx""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", sessionId, campusId, programId, programDetailId, classId, sectionId, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.AcademicPerformaceStudentWiseEx.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndividSummary([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualSummaryEx""('{0}',{1}) ORDER BY ""ExamType"",""MonthNumber""", searchParam, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamIndividualSummaryAxEx.FromSql(sql));
        }
        /////
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentResultReport([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var sessionId = new Guid(model.ProvidedString.Split("?")[1]);
            var campusId = new Guid(model.ProvidedString.Split("?")[2]);
            var programId = new Guid(model.ProvidedString.Split("?")[3]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[4]);
            var classId = new Guid(model.ProvidedString.Split("?")[5]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[6]);
            var scheduleName = model.ProvidedString.Split("?")[7];
            var examTypeId = new Guid(model.ProvidedString.Split("?")[8]);
            var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[9]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamResultReportForStudent""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}',{10})", searchParam, sessionId, campusId, programId, programDetailId, classId, sectionId, scheduleName, examTypeId, sectionCourseLinkId, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamResultReport.FromSql(sql));

        }

        ///////
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndividSummaryExm2([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualSummaryEx2""('{0}',{1}) ORDER BY ""ExamType"",""MonthNumber""", searchParam, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamIndividualSummaryAxExExm2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndividSummaryE12([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualSummary""('{0}',{1}) ORDER BY ""ExamType""", searchParam, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamIndividualSummaryAx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndividSummarySection([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            var classId = new Guid(model.ProvidedString.Split("?")[4]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[5]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualSummaryFilterEx""('{0}','{1}','{2}','{3}','{4}','{5}',{6})", sessionId, campusId, programId, programDetailId, classId, sectionId, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamIndividualSummaryEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndividSummarySectionExmEx([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamResultReportEx""('{0}',{1})", searchParam, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamResultReport.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndividSummarySectionExm2([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            var classId = new Guid(model.ProvidedString.Split("?")[4]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[5]);
            var scheduleName = model.ProvidedString.Split("?")[6];
            var examTypeId = new Guid(model.ProvidedString.Split("?")[7]);
            var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[8]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamResultReport""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}',{9})", sessionId, campusId, programId, programDetailId, classId, sectionId, scheduleName, examTypeId, sectionCourseLinkId, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamResultReport.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult ExamSecWiseIndividReport([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            var classId = new Guid(model.ProvidedString.Split("?")[4]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[5]);
            var scheduleName = model.ProvidedString.Split("?")[6];
            var examTypeId = new Guid(model.ProvidedString.Split("?")[7]);
            var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[8]);
            this.db.Database.SetCommandTimeout(100);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamSecWiseIndividReportEx""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}',{9})", sessionId, campusId, programId, programDetailId, classId, sectionId, scheduleName, examTypeId, sectionCourseLinkId, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamSecWiseIndivid.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult ExamSecWiseIndividReportProvisional([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var programId = new Guid(model.ProvidedString.Split("?")[2]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
            var classId = new Guid(model.ProvidedString.Split("?")[4]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[5]);
            var scheduleName = model.ProvidedString.Split("?")[6];
            var examTypeId = new Guid(model.ProvidedString.Split("?")[7]);
            var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[8]);
            this.db.Database.SetCommandTimeout(100);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamSecWiseIndividReportExApproved""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}',{9})", sessionId, campusId, programId, programDetailId, classId, sectionId, scheduleName, examTypeId, sectionCourseLinkId, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamSecWiseIndivid.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndiviReport([FromBody] Predicate model)
        {
            string sql = "";
            var searchParam = model.ProvidedString.Split("?")[0];
            var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            var date = model.ProvidedString.Split("?")[2];
            var classid = new Guid(model.ProvidedString.Split("?")[3]);
            var examScheduleName = model.ProvidedString.Split("?")[4];
            if (examScheduleName.Equals(""))
            {
                Console.WriteLine(2);
                sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualReport""('{0}','{1}','{2}','{3}',{4})", searchParam, examTypeId, date, classid, DomainContext.User.UserId);
                return Ok(db.ExamMonthlyReportExx.FromSql(sql));
            }
            else
            {
                Console.WriteLine(1);
                sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualReportEX""('{0}','{1}','{2}','{3}','{4}',{5})", searchParam, examTypeId, date, classid, examScheduleName, DomainContext.User.UserId);
                return Ok(db.ExamMonthlyReportExx.FromSql(sql));
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndiviReportUn([FromBody] Predicate model)
        {
            string sql = "";
            var searchParam = model.ProvidedString.Split("?")[0];
            var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            var date = model.ProvidedString.Split("?")[2];
            var classid = new Guid(model.ProvidedString.Split("?")[3]);
            var examScheduleName = model.ProvidedString.Split("?")[4];
            if (examScheduleName.Equals(""))
            {
                Console.WriteLine(2);
                sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualReportUn""('{0}','{1}','{2}','{3}',{4})", searchParam, examTypeId, date, classid, DomainContext.User.UserId);
                return Ok(db.ExamMonthlyReportExx.FromSql(sql));
            }
            else
            {
                Console.WriteLine(1);
                sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualReportUnAp""('{0}','{1}','{2}','{3}','{4}',{5})", searchParam, examTypeId, date, classid, examScheduleName, DomainContext.User.UserId);
                return Ok(db.ExamMonthlyReportExx.FromSql(sql));
            }
        }
        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentAcademicAnalysisReportExm2([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            // var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            // var date = model.ProvidedString.Split("?")[2];
            // var classid = new Guid(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2""('{0}')", admissionFormId);
            // Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisReportExm2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentAcademicAnalysisReportExm2Sub([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            // var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            // var date = model.ProvidedString.Split("?")[2];
            // var classid = new Guid(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Sub""('{0}')", admissionFormId);
            // Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisReportExm2Sub.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentAcademicAnalysisReportExm2Ex([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            // var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            // var date = model.ProvidedString.Split("?")[2];
            // var classid = new Guid(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex""('{0}')", admissionFormId);
            // Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisReportExm2.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentAcademicAnalysisReportExm2Ex3([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            var classId = model.ProvidedString.Split("?")[1];
            var dated = model.ProvidedString.Split("?")[2];
            // var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            // var date = model.ProvidedString.Split("?")[2];
            // var classid = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisReportExm3.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentAcademicAnalysisReport1styearDate([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            var classId = model.ProvidedString.Split("?")[1];
            var dated = model.ProvidedString.Split("?")[2];
            // var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            // var date = model.ProvidedString.Split("?")[2];
            // var classid = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReport1styearDate""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisEx.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentAcademicAnalysisReportExm2Ex5([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            var classId = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex5""('{0}','{1}')", admissionFormId, classId);
            Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisReportExm3.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentAcademicAnalysisReport1styearExam([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            var classId = model.ProvidedString.Split("?")[1];

            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReport1styear""('{0}','{1}')", admissionFormId, classId);
            Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisEx.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetSectionWiseAssmentList([FromBody] Predicate model)
        {
            var sectioncourselinkid = model.ProvidedString.Split("?")[0];

            string sql = String.Format(@"SELECT * FROM ""Assessment"".""GetSectionWiseAssments""('{0}')", sectioncourselinkid);
            Console.WriteLine(sql);
            return Ok(db.StudentAssessmentListEx.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentAcademicAnalysisReportExamTypeWiseExm2Ex3([FromBody] Predicate model)
        {
            var admissionFormId = model.ProvidedString.Split("?")[0];
            var classId = model.ProvidedString.Split("?")[1];
            //var dated = model.ProvidedString.Split("?")[2];
            var examTypeId = model.ProvidedString.Split("?")[2];
            // var examTypeId = new Guid(model.ProvidedString.Split("?")[1]);
            // var date = model.ProvidedString.Split("?")[2];
            // var classid = new Guid(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExamTypeWiseExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, examTypeId);
            Console.WriteLine(sql);
            return Ok(db.StudentAcademicAnalysisReportExm3.FromSql(sql));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEvaluateStudents([FromBody] Predicate model)
        {
            var sectioncourselinid = new Guid(model.ProvidedString.Split("?")[0]);
            var courseid = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format(@"SELECT * FROM ""Admission"".""EnrolledViewEx"" where ""CourseId"" = '{0}' and ""SectionCourseLinkId"" = '{1}'", courseid, sectioncourselinid);
            // Console.WriteLine(sql);
            return Ok(db.EnrolledViewEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public IActionResult GetEvaluateStudentsEx([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            var hodid = new Guid(model.ProvidedString.Split("?")[1]);
            var examtypeid = new Guid(model.ProvidedString.Split("?")[2]);
            var datestring = (model.ProvidedString.Split("?")[3]);
            var courseid = (model.ProvidedString.Split("?")[4]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[5]);
            //   string sql = String.Format(@"SELECT * from ""Admission"".""HodEnrolledViewEx"" where ""HodId"" = '{0}' AND ""CampusId"" = '{1}' AND left(""Dated""::text,7) in ('{2}','1991-07') AND ""CourseTypeId"" in ('00000000-0000-0000-0000-000000000000','{3}')", hodid, campusid, datestring, examtypeid);
            string sql = String.Format(@"select * from ""Admission"".""HodEnrolledFuncExWithSession""('{0}','{1}','{2}','{3}','{4}','{5}')", campusid, hodid, examtypeid, datestring, courseid, sessionid);

            Console.WriteLine(sql);
            return Ok(db.HodEnrolledViewEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public IActionResult GetGradeStudents([FromBody] Predicate model)
        {
            var campusid = new Guid(model.ProvidedString.Split("?")[0]);
            var courseid = new Guid(model.ProvidedString.Split("?")[1]);

            var hodid = new Guid(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[3]);
            var degreeid = new Guid(model.ProvidedString.Split("?")[4]);
            //   string sql = String.Format(@"SELECT * from ""Admission"".""HodEnrolledViewEx"" where ""HodId"" = '{0}' AND ""CampusId"" = '{1}' AND left(""Dated""::text,7) in ('{2}','1991-07') AND ""CourseTypeId"" in ('00000000-0000-0000-0000-000000000000','{3}')", hodid, campusid, datestring, examtypeid);
            string sql = String.Format(@"select * from ""Examination"".""SubjectwisegradepointEXY21786""('{0}','{1}','{2}','{3}','{4}')", campusid, courseid, hodid, classid, degreeid);

            Console.WriteLine(sql);
            return Ok(db.HodGradePoint.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamIndiviReportExamtype([FromBody] Predicate model)
        {
            var searchParam = model.ProvidedString.Split("?")[0];
            var date = model.ProvidedString.Split("?")[1];
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamIndividualReportExamType""('{0}','{1}','{2}',{3})", searchParam, date, classid, DomainContext.User.UserId);
            // Console.WriteLine(sql);
            return Ok(db.ExamMonthlyReport.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetGazetteData([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamGazetteData""('{0}')", model.ProvidedString);

                return Ok(db.ExamGazetteReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamMonthly, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult ExamSectiontestwise([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamSectiontestwise""('{0}')", model.ProvidedString);

                return Ok(db.ExamSectiontestwiseReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on ExamSectiontestwise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamSubjectWise([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamSubjectWiseReport""('{0}')", model.ProvidedString);

                return Ok(db.SubjectExamReportEx2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamSubjectWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamSubjectWiseExm2([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamSubjectWiseReportExm2""('{0}')", model.ProvidedString);

                return Ok(db.SubjectExamReportExam2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamSubjectWiseExm2, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamSubjectWiseEx([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamSubjectWiseReportEx""('{0}')", model.ProvidedString);

                return Ok(db.SubjectExamReportEx.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetExamSubjectWise, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }





        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCombinedSubjectExam([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""CombinedSubjectExam""('{0}')", model.ProvidedString);

                return Ok(db.SubjectExamReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on CombinedSubjectExam, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCombinedSubjectExam2([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Examination"".""CombinedSubjectExam2""('{0}')", model.ProvidedString);

                return Ok(db.SubjectExamReportExm2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetCombinedSubjectExam2, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStepEnrollmentReport([FromBody] Predicate model)
        {
            // Split the ProvidedString to get the relevant value (assuming you're using the part before '?' as a filter)
            var wheres = model.ProvidedString.Split("?")[0];

            // Ensure your SQL query is correctly formatted to accept a parameter (@p0)
            var sql = @"SELECT * FROM ""Registration"".""getstepadmissiondata""(@p0)";

            try
            {
                // Use FromSql for parameterized queries (for older EF Core versions)
                var datas = db.StepEnrollmentData.FromSql(sql, new NpgsqlParameter("@p0", NpgsqlTypes.NpgsqlDbType.Text) { Value = wheres }).ToList();

                // Return the result
                return Ok(datas);
            }
            catch (Exception ex)
            {
                // Handle any potential errors and return a friendly message
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost]
        [Route("[action]")]

        public IActionResult GetExamTypeWiseReport([FromBody] Predicate model)
        {
            try
            {
                // var SectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[0]);
                var where = model.ProvidedString;

                var queryFunc = String.Format(@"Select uuid_generate_v1() as ""Id"", rs.""ExamTypeId"",
Sum(rs.""TotalMarks"") as ""TotalMarks"",SUM(rs.""ObtainedMarks"") as ""ObtainedMarks"" ,rs.""RollNo"",rs.""FullName"",rs.""ExamType""||'-'||LEFT(rs.""Dated""::TEXT, 7) AS ""ExamType"",rs.""CampusName"",rs.""Section"",rs.""MatricObtainMarks"",rs.""MatricTotalMarks""
,rs.""Description"" as ""Class_""
from 
(Select em.""ExamTypeId"",em.""Dated"", af.""RollNo"",std.""FullName"",
concat(city.""FullName"",'-', camp.""FullName"")as ""CampusName"",sec.""FullName"" as ""Section"",extyp.""FullName"" as ""ExamType""
,em.""TotalMarks"",ed.""ObtainMarks"" as ""ObtainedMarks"",concat(pd.""Description"",'-',sft.""FullName"",'-',med.""FullName"",'-',cls.""FullName"",'-',ses.""FullName"") as ""Description"", 
coalesce(CAST(nullif(((array(select * from jsonb_array_elements(std.""AcademicInfo"") as v order by v->'classLevel' desc limit 1)::jsonb[])[1]->'obtainMarks')->>0,'') AS integer),0)as ""MatricObtainMarks"",
CASE WHEN (
coalesce(CAST(nullif(((array(select * from jsonb_array_elements(std.""AcademicInfo"") as v order by v->'classLevel' desc limit 1)::jsonb[])[1]->'totalMarks')->>0,'') AS integer),0)) =0 THEN 1
ELSE 
coalesce(CAST(nullif(((array(select * from jsonb_array_elements(std.""AcademicInfo"") as v order by v->'classLevel' desc limit 1)::jsonb[])[1]->'totalMarks')->>0,'') AS integer),0) END
as ""MatricTotalMarks""
-- CAST(((array(select * from jsonb_array_elements(std.""AcademicInfo"") as v order by v->'classLevel' desc limit 1)::jsonb[])[1]->'totalMarks')->>0 AS INTEGER)as ""MatricTotalMarks""
--,em.*
from ""Examination"".""ExamMaster"" em join
""Examination"".""ExamDetail"" ed on em.""ExamMasterId""=ed.""ExamMasterId"" join
""Admission"".""AdmissionForm"" af on af.""AdmissionFormId""=ed.""AdmissionFormId"" join
""Admission"".""Students"" std on af.""StudentId""=std.""StudentId"" join
""Setup"".""CampusProgramLink"" cpl on cpl.""CampusProgramId""=af.""CampusProgramId"" join
""Setup"".""Campus"" camp on cpl.""CampusId""=camp.""CampusId"" join
""Setup"".""SubCity"" scity on camp.""SubCityId""=scity.""SubCityId"" join
""Setup"".""City"" city on scity.""CityId""=city.""CityId"" join 
""Registration"".""SectionCourseLink"" scl on scl.""SectionCourseLinkId""=em.""SectionCourseLinkId"" join
""Setup"".""Section"" sec on sec.""SectionId""=scl.""SectionId"" join
""Examination"".""ExamType"" extyp on em.""ExamTypeId""=extyp.""ExamTypeId"" join
""Setup"".""ProgramDetails"" pd on pd.""ProgramDetailId""=cpl.""ProgramDetailId"" join
""Setup"".""Shift"" sft on sft.""ShiftId""=pd.""ShiftId"" join
""Setup"".""Medium"" med on med.""MediumId""=pd.""MediumId"" join
""Setup"".""Class"" cls on cls.""ClassId""= scl.""ClassId"" join 
""Setup"".""Session"" ses on ses.""SessionId""=cpl.""SessionId""
where {0}

) rs 
GROUP BY rs.""ExamType"",rs.""RollNo"",rs.""FullName"" ,rs.""CampusName"",rs.""Section"",rs.""MatricObtainMarks"",rs.""MatricTotalMarks"",rs.""Description"",LEFT(rs.""Dated""::TEXT, 7),rs.""ExamTypeId""", where);
                // Console.WriteLine(queryFunc);

                // var Query = String.Format(@"Select * from ""Examination"".""GetExamTypeWiseReport""('{0}')", SectionCourseLinkId);
                // // Console.WriteLine(Query);
                return Ok(this.db.ExamTypeWiseReportEx.FromSql(queryFunc));

                //  return Ok(this.feeRepository.FindBy(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programid && s.StatusId != 2 && (s.AdmissionDate >= fromDate && s.AdmissionDate <= toDate)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFeeConcessionDetailsVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFullFeeStudentDetail([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Fee"".""FullFeeStudentPartShiftwise""('{0}')", model.ProvidedString);

                return Ok(db.GetFullFeeStudentDetail.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetFullFeeStudentDetail, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamTypeWiseExam2([FromBody] Predicate model)
        {
            var wheres = model.ProvidedString.Split("?")[0];
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[1]);
            var programcourseid = new Guid(model.ProvidedString.Split("?")[2]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamTypeWiseExam2""('{0}','{1}','{2}')", wheres, programcourseid, sectioncourseid);
            var data2 = db.ExamTypeWiseReportExam2.FromSql(sql).ToList();
            string sql2 = String.Format(@"SELECT * FROM ""Examination"".""ExamTypeWiseExam2Agrr""('{0}')", wheres);
            var aggr2 = db.ExamTypeWiseExam2Agrr.FromSql(sql2).ToList();

            return Ok(new { data = data2, aggr = aggr2 });
            //                 Console.WriteLine($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')");

            //    return Ok(this.db.ExamTypeWiseReportExam2.FromSql($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')"));
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetExamTypeWiseExam2Agrr([FromBody] Predicate model)
        {

            string sql = String.Format(@"SELECT * FROM ""Examination"".""ExamTypeWiseExam2Agrr""('{0}')", model.ProvidedString);
            Console.WriteLine(sql);

            return Ok(db.ExamTypeWiseExam2Agrr.FromSql(sql));
            //                 Console.WriteLine($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')");

            //    return Ok(this.db.ExamTypeWiseReportExam2.FromSql($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')"));
        }


        // [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetStudentExamAttendanceReport([FromBody] Predicate model)
        // {

        //        var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
        //      var month = model.ProvidedString.Split("?")[1];

        //     string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentExamAttendenceDataOverAll""('{0}','{1}')", admissionformid,month);
        //     Console.WriteLine(sql);

        //     return Ok(db.AttendanceExamPercentage.FromSql(sql));

        // }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentExamAttendanceReport([FromBody] Predicate model)
        {
            try
            {
                // Extracting the parameters
                var admissionFormId = new Guid(model.ProvidedString.Split("?")[0]);
                var examsmsapprovalid = new Guid(model.ProvidedString.Split("?")[1]);

                // Raw SQL query
                string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentExamAttendenceDataOverAll2""('{0}', '{1}')", admissionFormId, examsmsapprovalid);
                Console.WriteLine(sql);

                // Execute the SQL and map to the AttendanceExamPercentage model
                var attendanceExamData = db.AttendanceExamPercentage.FromSql(sql).ToList();

                // Deserialize JSON fields to their respective classes
                foreach (var record in attendanceExamData)
                {
                    record.AttendanceDetailJsonString = JsonConvert.DeserializeObject<List<AttendanceDetail>>(record.AttendanceDetail);
                    record.AttendanceDetailOverAllJsonString = JsonConvert.DeserializeObject<List<AttendanceDetailOverAll>>(record.AttendanceDetailOverAll);
                    record.ExamPercentageExamwiseJsonString = JsonConvert.DeserializeObject<List<ExamPercentageExamwise>>(record.ExamPercentageExamwise);
                    record.ExamPercentageOverAllJsonString = JsonConvert.DeserializeObject<List<ExamPercentageOverAll>>(record.ExamPercentageOverAll);
                }

                return Ok(attendanceExamData);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Error fetching student exam attendance report.");
            }
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionWiseExam2([FromBody] Predicate model)
        {
            var wheres = model.ProvidedString.Split("?")[0];
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Examination"".""SectionWiseExam2""('{0}','{1}')", wheres, sectioncourseid);
            var datas = db.SectionWiseExam2.FromSql(sql).ToList();
            return Ok(new { data = datas });
            //                 Console.WriteLine($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')");

            //    return Ok(this.db.ExamTypeWiseReportExam2.FromSql($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')"));
        }

        public class AssessmentDataResponse
        {
            public List<SectionWiseAssesmentStudent> Data1 { get; set; }
            public List<SectionWiseAssesmentStudentAll> Data2 { get; set; }
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentAssessmentData([FromBody] Predicate model)
        {
            var sessionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[3]);
            var classid = new Guid(model.ProvidedString.Split("?")[4]);
            var sectioncourseid = new Guid(model.ProvidedString.Split("?")[5]);
            var assessmentname = model.ProvidedString.Split("?")[6];
            var assessmentPercentage = model.ProvidedString.Split("?")[7];


            string sql = String.Format(@"SELECT * FROM ""Assessment"".""AssemntStudentoverAllreport""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", sessionid, campusid, programid, programdetailid, classid, sectioncourseid, assessmentname, assessmentPercentage);
            var datas = db.SectionWiseAssesmentStudent.FromSql(sql).ToList();
            string sql1 = String.Format(@"SELECT * FROM ""Assessment"".""AssemntoverAllreport""('{0}')", sectioncourseid);
            var datas1 = db.SectionWiseAssesmentStudentAll.FromSql(sql1).ToList();
            var response = new AssessmentDataResponse
            {
                Data1 = datas,
                Data2 = datas1
            };

            return Ok(response);
            //                 Console.WriteLine($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')");

            //    return Ok(this.db.ExamTypeWiseReportExam2.FromSql($"SELECT * FROM \"Examination\".\"ExamTypeWiseExam2\"('{model.ProvidedString}')"));
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentResetMicrosoftPassword([FromBody] Predicate model)

        {
            string sql = string.Format(@"select * from ""Registration"".""StudentResetMicrosoftPassword""('{0}')", model.ProvidedString);

            Console.WriteLine(sql);

            return Ok(this.db.studentResetPassword.FromSql(sql));

        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetMask()

        {
            return Ok(this.db.SmsAPI.ToList().Where(e => e.Mask != "CUST" && e.Mask != "UCP" && e.Mask != "STEP SCHOOL"));

        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentFinanceReport([FromBody] Predicate model)
        {

            var searchParam = model.ProvidedString.Split("?")[0];

            string sql = String.Format(@"select * from ""Finance"".""GetStudentFinanceDataEx""('{0}')", searchParam);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.StudentFinanceDataLatest.FromSql(sql));

        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult GetStudentFinanceData([FromBody] Predicate model)
        {

            var searchParam = model.ProvidedString.Split("?")[0];

            string sql = String.Format(@"select * from ""Finance"".""GetFinanceStudentDataEx""('{0}')", searchParam);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.StudentFinanceData.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]

        public IActionResult GetCityWiseFinanceData([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);
            // var campusid=new Guid (model.ProvidedString.Split("?")[2]);
            // var programid=new Guid (model.ProvidedString.Split("?")[3]);

            //var classid=new Guid (model.ProvidedString.Split("?")[4]);
            //var sectionid=new Guid (model.ProvidedString.Split("?")[5]);
            //var genderid=new Guid (model.ProvidedString.Split("?")[2]);
            var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
            var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"select * from ""Finance"".""GetCityWiseFinanceData""('{0}','{1}','{2}','{3}')", cityid, subcityid, fromDate, toDate);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.CityWiseFinanceData.FromSql(sql));

        }

        // [HttpPost]
        // [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        // [Route("[action]")]
        // public IActionResult GetcamuswiseWiseDifferentFormat([FromBody] Predicate model)
        // {
        //     try
        //     {
        //         var listquery = (model.ProvidedString.Split("?")[0]).Replace("'", "''");
        //         var fromDate = (model.ProvidedString.Split("?")[1]);
        //         var toDate = (model.ProvidedString.Split("?")[2]);
    


        //         string sql = String.Format(@"SELECT * FROM ""Finance"".""GetCampusWiseDifferenceFormatDynamic""('{0}','{1}','{2}')", listquery, fromDate, toDate);
        //         return Ok(db.CampusWiseDifferenceResult.FromSql(sql));
        //     }
        //     catch (Exception err)
        //     {
        //         AppException app = new AppException();
        //         app.Message = "Error on GetStudentRevenueWise, " + err.Message;
        //         app.Time = DateTime.Now;
        //         app.Data = JsonConvert.SerializeObject(model);
        //         this.db.AppException.Add(app);
        //         this.db.SaveChangesAsync();
        //         return BadRequest(app.Message);
        //     }
        // }
[HttpPost]
[AllowAnonymous]
[IgnoreAntiforgeryToken]
[Route("[action]")]
public IActionResult GetcamuswiseWiseDifferentFormat([FromBody] Predicate model)
{
    try
    {
        // ✅ Declare 'parts' from ProvidedString
        var parts = model.ProvidedString.Split('?');

        var listquery = parts[0].Replace("'", "''");
        var fromDate = parts.Length > 1 ? parts[1] : null;
        var toDate = parts.Length > 2 ? parts[2] : null;

        Guid? classid = null;
        Guid? genderid = null;
        int? installno = null;

        // ✅ Safe parsing of optional parameters
        if (parts.Length > 3 && Guid.TryParse(parts[3], out var parsedClassId))
            classid = parsedClassId;

        if (parts.Length > 4 && Guid.TryParse(parts[4], out var parsedGenderId))
            genderid = parsedGenderId;

        if (parts.Length > 5 && int.TryParse(parts[5], out var parsedInstallNo))
            installno = parsedInstallNo;

        // ✅ Format for SQL query (pass NULL if not provided)
        var classIdParam = classid.HasValue ? $"'{classid}'" : "NULL";
        var genderIdParam = genderid.HasValue ? $"'{genderid}'" : "NULL";
        var installNoParam = installno.HasValue ? installno.ToString() : "NULL";

        // ✅ Build and execute the query
        string sql = $@"
            SELECT * FROM ""Finance"".""GetCampusWiseDifferenceFormatDynamiclatest""(
                '{listquery}', 
                '{fromDate}', 
                '{toDate}', 
                {classIdParam}, 
                {genderIdParam}, 
                {installNoParam}
            )";

        var result = db.CampusWiseDifferenceResult.FromSql(sql).ToList();
        return Ok(result);
    }
    catch (Exception err)
    {
        var app = new AppException
        {
            Message = "Error on GetcamuswiseWiseDifferentFormat, " + err.Message,
            Time = DateTime.Now,
            Data = JsonConvert.SerializeObject(model)
        };

        db.AppException.Add(app);
        db.SaveChanges();
        return BadRequest(app.Message);
    }
}


        [HttpPost]
        [Route("[action]")]

        public IActionResult GetBusniessUnitFinanceData([FromBody] Predicate model)
        {

            var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"select * from ""Finance"".""GetBusniessUnitwisedata""('{0}')", fromDate);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.BusniessUnitFinanceData.FromSql(sql));

        }
        [HttpPost]
        [Route("[action]")]

        public IActionResult GetCitywiseConsolidatedData([FromBody] Predicate model)
        {


            var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);

            string sql = String.Format(@"select * from ""Finance"".""GetCitywiseConsolidateddata""('{0}')", fromDate);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.CitywiseConsolidatedData.FromSql(sql));

        }

           [HttpPost]
        [Route("[action]")]

        public IActionResult GetBankCitywiseConsolidatedData([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select * from ""Finance"".""GetBankWiseConsolidateddata""('{0}','{1}')", cityid,fromDate);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.BankCitywiseConsolidatedData.FromSql(sql));

        }


        [HttpPost]
        [Route("[action]")]

        public IActionResult GetCampusWiseFinanceData([FromBody] Predicate model)
        {
            var cityid = new Guid(model.ProvidedString.Split("?")[0]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[1]);

            var campusid = new Guid(model.ProvidedString.Split("?")[2]);

            var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[3]);
            var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);
            //var fromDate = string.Format("{yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[7]));
            //var toDate = string.Format("{yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[8]));
            string sql = String.Format(@"select * from ""Finance"".""GetCampusWiseFinanceData""('{0}','{1}','{2}','{3}','{4}')", cityid, subcityid, campusid, fromDate, toDate);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.CampusWiseFinanceDataList.FromSql(sql));

        }



        [HttpPost]
        [Route("[action]")]

        public IActionResult GetProgramWiseFinanceData([FromBody] Predicate model)
        {
            var sesionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);

            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var PeogramDetailid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);

            var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
            var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
            //var fromDate = string.Format("{yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[7]));
            //var toDate = string.Format("{yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[8]));
            string sql = String.Format(@"select * from ""Finance"".""GetProgramWiseStudentFinanceDataLatest""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", sesionid, cityid, subcityid,campusid, PeogramDetailid,classid, fromDate, toDate);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.ProgramFinanceData.FromSql(sql));

        }

     [HttpPost]
        [Route("[action]")]
        public IActionResult GetProgramWiseFinanceDataLatest([FromBody] Predicate model)
        {
            var sesionid = new Guid(model.ProvidedString.Split("?")[0]);
            var cityid = new Guid(model.ProvidedString.Split("?")[1]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[2]);

            var campusid = new Guid(model.ProvidedString.Split("?")[3]);
            var PeogramDetailid = new Guid(model.ProvidedString.Split("?")[4]);
            var classid = new Guid(model.ProvidedString.Split("?")[5]);

            var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[6]);
            var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[7]);
            //var fromDate = string.Format("{yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[7]));
            //var toDate = string.Format("{yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[8]));
            string sql = String.Format(@"select * from ""Finance"".""GetProgramWiseStudentFinanceDataLatestReport""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", sesionid, cityid, subcityid, campusid, PeogramDetailid,classid, fromDate, toDate);

            //string sql = String.Format(@"SELECT * FROM ""Examination"".""GetStudentAcademicAnalysisReportExm2Ex4""('{0}','{1}','{2}')", admissionFormId, classId, dated);
            Console.WriteLine(sql);
            return Ok(db.ProgramFinanceDataLatest.FromSql(sql));

        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetProgramWiseConcessionReport([FromBody] Predicate model)
        {
            var sesionid = new Guid(model.ProvidedString.Split("?")[0]);
            var campusid = new Guid(model.ProvidedString.Split("?")[1]);
            var PeogramDetailid = new Guid(model.ProvidedString.Split("?")[2]);
            var classid = new Guid(model.ProvidedString.Split("?")[3]);

     
            string sql = String.Format(@"select * from ""Fee"".""GetProgramWiseConcessionReport""('{0}','{1}','{2}','{3}')", sesionid,  campusid, PeogramDetailid,classid);
            Console.WriteLine(sql);
            return Ok(db.ProgramWiseConcessionReportModel.FromSql(sql));

        }















    }
}