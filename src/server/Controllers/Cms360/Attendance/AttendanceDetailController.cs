using System.Reflection;
using System.Xml.Schema;
using System.Runtime.CompilerServices;
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AttendanceAttendanceDetailController : Controller
    {
        private readonly IAttendanceAttendanceDetailRepository repository;

        private readonly IAttendanceAttendanceDetailVMRepository repositoryVM;
        private readonly IUserLogService log;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly DbContextBase db;
        private long ContextUserId = 0;

        public AttendanceAttendanceDetailController(IUserLogService log, IAttendanceAttendanceDetailRepository repository, IAttendanceAttendanceDetailVMRepository repositoryVM, DbContextBase db, IDomainContextResolver Resolver)
        {
            this.repository = repository;
            this.repositoryVM = repositoryVM;
            this.log = log;
            this.db = db;
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
        public IActionResult GetAttendaceData([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);

            var dayname = date.DayOfWeek.ToString();

            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceData""({0},'{1}','{2}','{3}','{4}')", userid, campusProgramId, dayname, timetableId, classId);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendenceData>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.TimeTableId == timetableId && s.ClassId == classId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMergeAttendaceData([FromBody] Predicate predicate)
        {

            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[2]);

            var dayname = date.DayOfWeek.ToString();

            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""MergeAttendance""({0},'{1}','{2}')", userid, timetableId, date);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendenceDataEx>(json).ToList().OrderBy(e => e.TimeTableId);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.TimeTableId == timetableId && s.ClassId == classId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherMergeAttendaceData([FromBody] Predicate predicate)
        {

            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[1]);
            // var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[2]);

            //   var dayname = date.DayOfWeek.ToString();

            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""MergeTeacherAttendanceOptimize""('{0}','{1}')", timetableId, date);
            Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendenceDataEx>(json).ToList().OrderBy(e => e.TimeTableId);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.TimeTableId == timetableId && s.ClassId == classId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherData([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            //var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);
            var dayname = date.DayOfWeek.ToString();

            // var dayname = date.DayOfWeek.ToString();
            return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.TimeTableId == timetableId && s.ClassId == classId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentLeaveInfo([FromBody] Predicate predicate)
        {
            var admissionformid = new Guid(predicate.ProvidedString);
            return Ok(this.db.AttendenceLeaves.Where(s => s.AdmissionFormId == admissionformid));

            // var dayname = date.DayOfWeek.ToString();
            //  return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.TimeTableId == timetableId && s.ClassId == classId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceDataTeacher([FromBody] Predicate predicate)
        {
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var courseId = new Guid(predicate.ProvidedString.Split("?")[1]);

            var dayname = date.DayOfWeek.ToString();
            ContextUserId = DomainContext.User.UserId;
            return Ok(db.AttendenceDataTeacher.Where(s => s.DayName == dayname && s.CourseId == courseId && s.UserId == ContextUserId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceDatas([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);

            var dayname = date.DayOfWeek.ToString();
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceDataBulk""({0},'{1}','{2}','{3}','{4}','{5}') order by ""RollNo"" asc ", userid, campusProgramId, dayname, sectionId, classId, date);
            Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendenceData>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.ClassId == classId && s.SectionId == sectionId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceDatasDayOff([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);

            var dayname = date.DayOfWeek.ToString();
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceDataBulkDayOff""({0},'{1}','{2}','{3}','{4}')", userid, campusProgramId, dayname, sectionId, classId);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendenceDataDayoff>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.ClassId == classId && s.SectionId == sectionId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceVM([FromBody] Predicate predicate)
        {
            var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[2]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);

            IDbConnection connection = db.Database.GetDbConnection();
            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceDetail""({0},'{1}','{2}','{3}','{4}')", userid, campusId, date, programDetailId, timetableId);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendanceAttendanceDetailVM>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            // var dayname = date.DayOfWeek.ToString();
            // return Ok(db.AttendanceAttendanceDetailVM.Where(s => s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.Dated == date && s.TimeTableId == timetableId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckDayOff([FromBody] Predicate predicate)
        {

            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[1]);
            // var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[2]);

            IDbConnection connection = db.Database.GetDbConnection();
            string json = String.Format(@"select * from ""TimeTable"".""CheckDayOff""('{0}','{1}') as val", timetableId, date);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<IntModel>(json).ToList().FirstOrDefault();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data.val);
            // var dayname = date.DayOfWeek.ToString();
            // return Ok(db.AttendanceAttendanceDetailVM.Where(s => s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.Dated == date && s.TimeTableId == timetableId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMergeAttendaceVM([FromBody] Predicate predicate)
        {

            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[2]);

            IDbConnection connection = db.Database.GetDbConnection();
            string json = String.Format(@"SELECT * FROM ""Attendance"".""MergeAttendanceUpdate""({0},'{1}','{2}')", userid, timetableId, date);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendanceUpdateVM>(json).ToList().OrderBy(e => e.TimeTableId);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            // var dayname = date.DayOfWeek.ToString();
            // return Ok(db.AttendanceAttendanceDetailVM.Where(s => s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.Dated == date && s.TimeTableId == timetableId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMergeTeacherAttendaceVM([FromBody] Predicate predicate)
        {

            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[1]);
            //  var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[2]);

            IDbConnection connection = db.Database.GetDbConnection();
            string json = String.Format(@"SELECT * FROM ""Attendance"".""MergeTeacherAttendanceUpdateOptimize""('{0}','{1}')", timetableId, date);
            Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendanceAttendanceDetailVMEx>(json).ToList().OrderBy(e => e.TimeTableId);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            // var dayname = date.DayOfWeek.ToString();
            // return Ok(db.AttendanceAttendanceDetailVM.Where(s => s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.Dated == date && s.TimeTableId == timetableId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceTVM([FromBody] Predicate predicate)
        {
            var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[2]);
            var timetableId = new Guid(predicate.ProvidedString.Split("?")[3]);

            // var dayname = date.DayOfWeek.ToString();
            //return Ok(db.AttendanceAttendanceDetailVM.Where(s => s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.Dated == date && s.TimeTableId == timetableId));
            return Ok(db.AttendanceAttendanceDetailVM.Where(s => s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.Dated == date && s.TimeTableId == timetableId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceTeacher([FromBody] Predicate predicate)
        {
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var courseId = new Guid(predicate.ProvidedString.Split("?")[1]);

            return Ok(db.AttendanceAttendanceDetailVM.Where(s => s.Dated == date && s.CourseId == courseId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult submit_attendance([FromBody] SubmitAttendanceLecture param)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            var dte = DateTime.Now.Date;
            var data = this.db.AttendanceAttendenceMaster.Where(s => s.TimeTableId == param.TimeTableId && s.Dated == dte).ToList();
            var log = this.log.GetLog();
            if (data.Count > 0)
            {
                // Console.WriteLine(JsonConvert.SerializeObject(param.Enrollment));
                // Console.WriteLine(data[0].AttendenceMasterId);
                var queryEX = String.Format(@"SELECT * FROM ""Message"".""BulkAttendanceUpdateForAllSubjects""('{0}','{1}','{2}')", JsonConvert.SerializeObject(param.Enrollment), data[0].AttendenceMasterId, log);


                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                connection.Execute(queryEX);
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }
                return Ok(1982);
            }

            var attmasterid = Guid.NewGuid();
            var attendanceMaster = new AttendanceAttendenceMaster();

            attendanceMaster.AttendenceMasterId = attmasterid;
            attendanceMaster.Dated = DateTime.Now;
            attendanceMaster.IsApproved = false;
            attendanceMaster.LoggerId = Guid.NewGuid();
            attendanceMaster.StatusId = 1;
            attendanceMaster.TimeTableId = param.TimeTableId;

            var attendanceDetailList = new List<AttendanceAttendanceDetail>();
            // var list=new List<TimeTableStudentVM>();
            var list = this.db.TimeTableStudentVM.Where(s => s.TimeTableId == param.TimeTableId).ToList();
            foreach (var item in list)
            {
                var model = new AttendanceAttendanceDetail();
                model.AttendanceDetailId = Guid.NewGuid();
                model.AdmissionFormId = item.AdmissionFormId;
                model.AttendanceMasterId = attmasterid;
                model.AttendenceStatusId = param.Enrollment.Find(s => s.EnrollmentId == item.RollNo) != null ? item.AbsentId : item.PresentId;
                model.StatusId = 1;
                model.LoggerId = Guid.NewGuid();
                attendanceDetailList.Add(model);
            }
            var query = String.Format(@"SELECT * FROM ""Message"".""BulkAttendanceForAllSubjects""('{0}','{1}','{2}')", JsonConvert.SerializeObject(attendanceMaster), JsonConvert.SerializeObject(attendanceDetailList), log);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(1982);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceVMS([FromBody] Predicate predicate)
        {
            var campusId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[5]);
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[6]);

            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(
                @"SELECT * FROM ""Attendance"".""AttendanceDetailBulk""({0},'{1}','{2}','{3}','{4}','{5}')",
                userid, campusId, date, programDetailId, sectionId, sessionId
            );

            if (connection.State == ConnectionState.Closed)
                connection.Open();

            // Increase timeout to 60 seconds
            var data = connection.Query<AttendanceAttendanceDetailVM>(
                json,
                commandTimeout: 70
            ).ToList();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(data);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCourseSection([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[2]);

            var dayname = date.DayOfWeek.ToString();
            return Ok(db.CourseSection.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.ClassId == classid));
        }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult GetAttendanceReportVM ([FromBody] Predicate predicate) {
        //     var sessionId = new Guid (predicate.ProvidedString.Split ("?") [0]);
        //     var campusId = new Guid (predicate.ProvidedString.Split ("?") [1]);
        //     var programDetailId = new Guid (predicate.ProvidedString.Split ("?") [2]);
        //     var classId = new Guid (predicate.ProvidedString.Split ("?") [3]);
        //     var sectionId = new Guid (predicate.ProvidedString.Split ("?") [4]);
        //     var courseId = new Guid (predicate.ProvidedString.Split ("?") [5]);
        //     var fromDate = Convert.ToDateTime (predicate.ProvidedString.Split ("?") [6]);
        //     var toDate = Convert.ToDateTime (predicate.ProvidedString.Split ("?") [7]);

        //     return Ok (db.AttendanceAttendanceReport.Where (s => s.SessionId == sessionId && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionId == sectionId && s.CourseId == courseId && (s.Dated >= fromDate && s.Dated <= toDate)));
        // }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult GetAttendanceReportWithoutCourseVM ([FromBody] Predicate predicate) {
        //     var sessionId = new Guid (predicate.ProvidedString.Split ("?") [0]);
        //     var campusId = new Guid (predicate.ProvidedString.Split ("?") [1]);
        //     var programDetailId = new Guid (predicate.ProvidedString.Split ("?") [2]);
        //     var classId = new Guid (predicate.ProvidedString.Split ("?") [3]);
        //     var sectionId = new Guid (predicate.ProvidedString.Split ("?") [4]);
        //     var fromDate = Convert.ToDateTime (predicate.ProvidedString.Split ("?") [5]);
        //     var toDate = Convert.ToDateTime (predicate.ProvidedString.Split ("?") [6]);

        //     return Ok (db.AttendanceAttendanceReport.Where (s => s.SessionId == sessionId && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionId == sectionId && (s.Dated >= fromDate && s.Dated <= toDate)));
        // }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult WithoutToDateFromDateVM ([FromBody] Predicate predicate) {
        //     var sessionId = new Guid (predicate.ProvidedString.Split ("?") [0]);
        //     var campusId = new Guid (predicate.ProvidedString.Split ("?") [1]);
        //     var programDetailId = new Guid (predicate.ProvidedString.Split ("?") [2]);
        //     var classId = new Guid (predicate.ProvidedString.Split ("?") [3]);
        //     var sectionId = new Guid (predicate.ProvidedString.Split ("?") [4]);
        //     var courseId = new Guid (predicate.ProvidedString.Split ("?") [5]);

        //     return Ok (db.AttendanceAttendanceReport.Where (s => s.SessionId == sessionId && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionId == sectionId && s.CourseId == courseId));
        // }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult WithoutToDateFromDateCourseVM ([FromBody] Predicate predicate) {
        //     var sessionId = new Guid (predicate.ProvidedString.Split ("?") [0]);
        //     var campusId = new Guid (predicate.ProvidedString.Split ("?") [1]);
        //     var programDetailId = new Guid (predicate.ProvidedString.Split ("?") [2]);
        //     var classId = new Guid (predicate.ProvidedString.Split ("?") [3]);
        //     var sectionId = new Guid (predicate.ProvidedString.Split ("?") [4]);

        //     return Ok (db.AttendanceAttendanceReport.Where (s => s.SessionId == sessionId && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionId == sectionId));
        // }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult WithoutToDateFromDateCourseVM([FromBody] Predicate predicate)
        // {
        //     var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //     var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
        //     var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
        //     var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
        //     var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);

        //     return Ok(db.AttendanceAttendanceReport.Where(s => s.SessionId == sessionId && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionId == sectionId));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertLeave([FromBody] Predicate predicate)
        {

            var list = (predicate.ProvidedString.Split("?")[0]);
            var neworupd = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);
            var log = this.log.GetLog();
            string json = String.Format("SELECT * from \"Attendance\".\"InsertLeave\"('{0}',{1},'{2}') as \"ProvidedString\"", list, neworupd, log);
            Console.WriteLine(json);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var result = connection.Query<Predicate>(json).ToList().FirstOrDefault();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(result.ProvidedString);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetLeaveInfo([FromBody] Predicate predicate)
        {

            string json = String.Format("select * from \"Attendance\".\"Leaves\" WHERE \"AdmissionFormId\"='{0}'", predicate.ProvidedString);
            // Console.WriteLine(json);
            return Ok(this.db.AttendenceLeaves.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendanceDetail).Assembly);
            Expression<Func<AttendanceAttendanceDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendanceDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddBulkAttendance([FromBody] Predicate predicate)
        {
            var attendanceMasterJson = predicate.ProvidedString.Split("?")[0];
            var attendanceDetailJson = predicate.ProvidedString.Split("?")[1];
            var log = this.log.GetLog();
            var query = String.Format(@"select * from ""Attendance"".""BulkAttendance""('{0}','{1}','{2}')", attendanceMasterJson, attendanceDetailJson, log);
            Console.WriteLine(query);

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
        public async Task<IActionResult> UpdateBulkAttendance([FromBody] Predicate predicate)
        {
            var attendanceDetailJson = predicate.ProvidedString;
            var log = this.log.GetLog();
            var query = String.Format(@"select * from ""Attendance"".""UpdateBulkAttendance""('{0}','{1}')", attendanceDetailJson, log);
            Console.WriteLine(query);

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
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendanceDetail).Assembly);
            Expression<Func<AttendanceAttendanceDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendanceDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendanceDetailVM).Assembly);
            Expression<Func<AttendanceAttendanceDetailVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendanceDetailVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.repositoryVM.FindBy(discountFilterExpression));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFindByVM()
        {

            return Ok(this.repositoryVM.All());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendanceDetail).Assembly);
            Expression<Func<AttendanceAttendanceDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendanceDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] AttendanceAttendanceDetail entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] AttendanceAttendanceDetail entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<AttendanceAttendanceDetail> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<AttendanceAttendanceDetail> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] AttendanceAttendanceDetail entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] AttendanceAttendanceDetail entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] AttendanceAttendanceDetail entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] AttendanceAttendanceDetail entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Attendance.AttendanceDetail"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendanceDetail).Assembly);
            Expression<Func<AttendanceAttendanceDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendanceDetail, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendanceDetail).Assembly);
            Expression<Func<AttendanceAttendanceDetail, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendanceDetail, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
        //************************** Attendance Reports ***************************//
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceReport([FromBody] Predicate model)
        {
            try
            {
                //                 string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""NewID"" ,cv.""AdmissionFormId"" , cv.""RollNo"" , cv.""CourseName"",cv.""Dated"", cv.""DayName"", cv.""AttendanceStatus"" ,cv.""RefferenceNo""  ,cv.""ClassName"" ,cv.""ShiftName"" ,cv.""ProgramName"" ,cv.""StudentName"", cv.""FatherName"", cv.""Description"",cv.""CampusName"", cv.""SessionName"", cv.""SectionName""', '""Attendance"".""VWAttendanceReportExx"" AS cv', '{0}')
                // AS TBL (
                //     ""NewID"" UUID,
                //     ""AdmissionFormId"" UUID,
                //     ""RollNo"" TEXT,
                //     ""CourseName"" TEXT,
                //     ""Dated"" DATE,
                //     ""DayName"" TEXT,
                //     ""AttendanceStatus"" TEXT,
                //     ""RefferenceNo"" TEXT,
                //     ""ClassName"" TEXT,
                //     ""ShiftName"" TEXT,
                //     ""ProgramName"" TEXT,
                //     ""StudentName"" TEXT,
                //     ""FatherName"" TEXT,
                // 	 ""Description"" TEXT,
                //     ""CampusName"" TEXT,
                //     ""SessionName"" TEXT,
                //     ""SectionName"" TEXT);", model.ProvidedString);
                string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceReportExx""('{0}')", model.ProvidedString);

                return Ok(this.db.AttendanceAttendanceReport.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceReports([FromBody] Predicate model)
        {
            try
            {
                //     this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);

                //     var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
                //     var campusId = new Guid(model.ProvidedString.Split("?")[1]);
                //     var programId = new Guid(model.ProvidedString.Split("?")[2]);
                //     var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
                //     var classId = new Guid(model.ProvidedString.Split("?")[4]);
                //     var sectionId = new Guid(model.ProvidedString.Split("?")[5]);
                //     //var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[6]);
                //     var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[6]));
                //     var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[7]));
                //    string sql = String.Format(@"SELECT * FROM ""Attendance"".""GetAttendanceReport""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", sessionId, campusId, programId, programDetailId, classId, sectionId,fromDate, toDate);
                string sql = String.Format(@"SELECT * FROM ""Attendance"".""GetAttendanceReport""('{0}')", model.ProvidedString);
                return Ok(db.AttendanceReportResult2.FromSql(sql));


            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceReports, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendenceStatusSubjectWise([FromBody] Predicate model)
        {
            try
            {
                this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);
                //string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceReport""('{0}')", model.ProvidedString);
                model.ProvidedString = model.ProvidedString.Replace("''", "'");
                // Console.WriteLine(String.Format(Attendequery, model.ProvidedString));


                return Ok(db.AttendanceReportStatusSubjectWise.FromSql(String.Format(AttendequerySubjectWise, model.ProvidedString)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceReports, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceReportsExx([FromBody] Predicate model)
        {
            try
            {
                this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);
                //string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceReport""('{0}')", model.ProvidedString);
                model.ProvidedString = model.ProvidedString.Replace("''", "'");
                // Console.WriteLine(String.Format(Attendequery, model.ProvidedString));


                return Ok(db.AttendanceReportStatus.FromSql(String.Format(AttendequeryExx, model.ProvidedString)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceReports, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceReportsEx([FromBody] Predicate model)
        {
            try
            {
                this.db.Database.SetCommandTimeout((int)TimeSpan.FromMinutes(4).TotalSeconds);
                //string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceReport""('{0}')", model.ProvidedString);
                model.ProvidedString = model.ProvidedString.Replace("''", "'");
                // Console.WriteLine(String.Format(AttendequeryEx, model.ProvidedString));


                return Ok(db.AttendanceReportStatusExx.FromSql(String.Format(AttendequeryEx, model.ProvidedString)));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceReports, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceElReports([FromBody] Predicate predicate)
        {
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var programdetailid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[4]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[5]);
            var dated = Convert.ToDateTime(predicate.ProvidedString.Split("?")[6]);
            try
            {
                this.db.Database.SetCommandTimeout(200);
                string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceReportEl2""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", sessionId, campusid, programid, programdetailid, classId, sectionId, dated);

                return Ok(db.AttendanceReportStatusEl.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceReports, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(predicate);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceRegister([FromBody] Predicate model)
        {
            try
            {
                var pstring = model.ProvidedString.Split("?")[0];
                var fromDate = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
                var toDate = Convert.ToDateTime(model.ProvidedString.Split("?")[2]);
                string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceRegisterEx""('{0}','{1}','{2}')", pstring, fromDate, toDate);

                return Ok(db.AttendanceRegister.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceRegister, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        // [HttpPost]
        // [Route ("[action]")]
        // public IActionResult GetAttendenceMonthWise ([FromBody] Predicate predicate) {

        //     var fromDate = string.Format ("{0:yyyy-MM-dd}", Convert.ToDateTime (predicate.ProvidedString.Split ("?") [0]));
        //     var toDate = string.Format ("{0:yyyy-MM-dd}", Convert.ToDateTime (predicate.ProvidedString.Split ("?") [1]));
        //     var RefferencNo=(predicate.ProvidedString.Split ("?") [2]);
        //     string sql = String.Format (@"select * from ""Attendance"".""VWAttendanceReportEx""  as obj where obj.""RefferenceNo""='{0}'  and obj.""Dated"" >='{1}'  and obj.""Dated""<='{2}' order by obj.""Dated"" ",RefferencNo,fromDate,toDate);
        //    return Ok (this.db.AttendanceAttendanceReport.FromSql (sql));
        // }

        //         [HttpPost]
        //         [Route ("[action]")]
        //         public IActionResult GetAttendanceReport ([FromBody] Predicate model) {
        //             try {
        //                 string sql = String.Format (@"SELECT * FROM ""public"".""Query""('cv.""AdmissionFormId"" , cv.""RollNo"" , cv.""ParentContactNo"",cv.""Dated"", cv.""PresentStatus"", cv.""AbsentStatus"" ,cv.""RefferenceNo""  ,cv.""ClassName"" ,cv.""ShiftName"" ,cv.""ProgramName"" ,cv.""StudentName"", cv.""FatherName"", cv.""Description"",cv.""CampusName"", cv.""SessionName"", cv.""SectionName""', '""Attendance"".""VWAttendanceReport"" AS cv', '{0}')
        // AS TBL (
        //     ""AdmissionFormId"" UUID,
        //     ""RollNo"" TEXT,
        //     ""ParentContactNo"" JSONB,
        //     ""Dated"" DATE,
        //     ""PresentStatus"" BIGINT,
        //     ""AbsentStatus"" BIGINT,
        //     ""RefferenceNo"" TEXT,
        //     ""ClassName"" TEXT,
        //     ""ShiftName"" TEXT,
        //     ""ProgramName"" TEXT,
        //     ""StudentName"" TEXT,
        //     ""FatherName"" TEXT,
        // 	 ""Description"" TEXT,
        //     ""CampusName"" TEXT,
        //     ""SessionName"" TEXT,
        //     ""SectionName"" TEXT);", model.ProvidedString);

        //                 return Ok (this.db.AttendanceAttendanceReport.FromSql (sql));
        //             } catch (Exception err) {
        //                 AppException app = new AppException ();
        //                 app.Message = "Error on GetAttendanceReport, " + err.Message;
        //                 app.Time = DateTime.Now;
        //                 app.Data = JsonConvert.SerializeObject (model);
        //                 this.db.AppException.Add (app);
        //                 this.db.SaveChangesAsync ();
        //                 return BadRequest (app.Message);
        //             }
        //         }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDirectlyMarkedAttendanceReport([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""public"".""Query""('cv.""TimeTableId"" , cv.""Email"" , cv.""StaffName"",cv.""StartTime"", cv.""EndTime"", cv.""CourseName""  ,cv.""ClassName"" ,cv.""ShiftName"" ,cv.""ProgramName"" , cv.""Description"",cv.""CampusName"", cv.""SessionName"", cv.""SectionName""', '""Attendance"".""VWAttendanceReportVMEx"" AS cv', '{0}')
AS TBL (
    ""TimeTableId"" UUID,
    ""Email"" TEXT,
    ""StaffName"" TEXT,
    ""StartTime"" TIME,
    ""EndTime"" TIME,
    ""CourseName"" TEXT,
    ""ClassName"" TEXT,
    ""ShiftName"" TEXT,
    ""ProgramName"" TEXT,
	 ""Description"" TEXT,
    ""CampusName"" TEXT,
    ""SessionName"" TEXT,
    ""SectionName"" TEXT);", model.ProvidedString);

                return Ok(this.db.AttendanceAttendanceReportVM.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceReportVM, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendaceDatasStruckOFF([FromBody] Predicate predicate)
        {
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);

            var dayname = date.DayOfWeek.ToString();
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceDataBulkAllStudents""({0},'{1}','{2}','{3}','{4}')", userid, campusProgramId, dayname, sectionId, classId);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendenceData>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.ClassId == classId && s.SectionId == sectionId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsOfSection([FromBody] Predicate predicate)
        {
            var sectioncourseid = new Guid(predicate.ProvidedString.Split("?")[0]);

            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);


            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Registration"".""GetStudentsOfSection""({0},'{1}')", userid, sectioncourseid);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<StudentOfSection>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(db.AttendenceData.Where(s => s.CampusProgramId == campusProgramId && s.DayName == dayname && s.ClassId == classId && s.SectionId == sectionId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSubjectWiseReport([FromBody] Predicate model)
        {
            try
            {
                string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceSubwise""('{0}')", model.ProvidedString);

                return Ok(db.AttendanceAttendanceSubWise.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetSubjectWiseReport, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceSummary([FromBody] Predicate model)
        {
            try
            {
                var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
                var campusId = new Guid(model.ProvidedString.Split("?")[1]);
                var programId = new Guid(model.ProvidedString.Split("?")[2]);
                var programDetailId = new Guid(model.ProvidedString.Split("?")[3]);
                var classId = new Guid(model.ProvidedString.Split("?")[4]);
                var sectionId = new Guid(model.ProvidedString.Split("?")[5]);
                //var sectionCourseLinkId = new Guid(model.ProvidedString.Split("?")[6]);
                var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[6]));
                var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(model.ProvidedString.Split("?")[7]));
                string sql = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceSummary""('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", sessionId, campusId, programId, programDetailId, classId, sectionId, fromDate, toDate);

                return Ok(db.AttendanceAttendanceSummary2.FromSql(sql));
            }
            catch (Exception err)
            {
                AppException app = new AppException();
                app.Message = "Error on GetAttendanceSummary, " + err.Message;
                app.Time = DateTime.Now;
                app.Data = JsonConvert.SerializeObject(model);
                this.db.AppException.Add(app);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);
            }
        }
        string AttendequeryEx = @"SELECT
	uuid_generate_v4() AS ""NewID"",
	vc.""Description"",
	vc.""CampusName"",
	vc.""SessionName"",
	vc.""ShiftName"",
	vc.""GenderType"",
	sum(vc.""RollNo"") AS ""Strength"",
	vc.""ProgramName"",
	SUM ( vc.""Present"" ) AS ""Present"",
	SUM ( vc.""Absent"" ) AS ""Absent"",
	SUM ( vc.""Leave"" ) AS ""Leave"",
	SUM ( vc.""Present"" ) * 100 / COALESCE ( NULLIF ( ( SUM ( vc.""Absent"" ) + SUM ( vc.""Present"" ) ), 0 ), 1 ) AS ""Percentage"",
	vc.""ClassName"",
	vc.""SectionName"" 
FROM
	(  SELECT
          ""AdmissionFormId"",
        ""RefferenceNo"",
        ""ParentContactNo"",
        ""StudentName"",
        ""FatherName"",
        ""Description"",
        ""CampusName"",
        ""SessionName"",
        ""ShiftName"",
        ""GenderType"",
		COUNT ( DISTINCT ""RollNo"" ) AS ""RollNo"",
        ""ProgramName"",
        SUM(""PresentStatus"") AS ""Present"",
        SUM(""AbsentStatus"") AS ""Absent"",
        SUM(""LeaveStatus"") AS ""Leave"",
        ""ClassName"",
        ""SectionName""
      FROM(
      SELECT
        af.""AdmissionFormId"",
          af.""RefferenceNo"",
          atm.""Dated"",
         ((ARRAY( SELECT v.value FROM jsonb_array_elements(""st"".""ParentContactNo"") v(value)))[1] -> 'phoneNo'::text) AS     ""ParentContactNo"",
        st.""FullName"" AS ""StudentName"",
        st.""FatherName"",
        ""ProgramDetails"".""Description"",
        ""Campus"".""FullName"" AS ""CampusName"",
        ""Session"".""FullName"" AS ""SessionName"",
        sh.""FullName"" AS ""ShiftName"",
        gd.""Description"" AS ""GenderType"",
        af.""RollNo"",
        ""Program"".""FullName"" AS ""ProgramName"",
        CASE WHEN (ats.""FullName"" = 'Present'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""PresentStatus"",
        CASE WHEN (ats.""FullName"" = 'Absent'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""AbsentStatus"",
        CASE WHEN (ats.""FullName"" = 'Leave'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""LeaveStatus"",
        ""Class"".""FullName"" AS ""ClassName"",
        ""Section"".""FullName"" AS ""SectionName""
      FROM
        ""Admission"".""Students"" st
        JOIN ""Admission"".""AdmissionForm"" af ON af.""StudentId"" = st.""StudentId""
        JOIN ""Registration"".""Enrollments"" enr ON enr.""AdmissionFormId"" = af.""AdmissionFormId""

        JOIN ""Setup"".""CampusProgramLink"" cpl ON af.""CampusProgramId"" = cpl.""CampusProgramId""
        JOIN ""Setup"".""Session"" ""Session"" ON cpl.""SessionId"" = ""Session"".""SessionId""
        JOIN ""Setup"".""Campus"" ""Campus"" ON cpl.""CampusId"" = ""Campus"".""CampusId""
        JOIN ""Setup"".""ProgramDetails"" ""ProgramDetails"" ON cpl.""ProgramDetailId"" = ""ProgramDetails"".""ProgramDetailId""
        JOIN ""Setup"".""Program"" ""Program"" ON ""ProgramDetails"".""ProgramId"" = ""Program"".""ProgramId""

        JOIN ""Setup"".""Shift"" sh ON ""ProgramDetails"".""ShiftId"" = sh.""ShiftId""
          JOIN ""Setup"".""Gender"" gd ON st.""GenderId"" = gd.""GenderId""

        JOIN ""Registration"".""SectionCourseLink"" scl ON enr.""SectionCourseLinkId""[1] = scl.""SectionCourseLinkId"" AND cpl.""CampusProgramId"" = scl.""CampusProgramId""

        JOIN ""Setup"".""Class"" ""Class"" ON scl.""ClassId"" = ""Class"".""ClassId""
        JOIN ""Setup"".""Section"" ""Section"" ON scl.""SectionId"" = ""Section"".""SectionId""

        JOIN ""Attendance"".""AttendanceDetail"" atd ON atd.""AdmissionFormId"" = af.""AdmissionFormId""
        JOIN ""Attendance"".""AttendenceMaster"" atm ON atd.""AttendanceMasterId"" = atm.""AttendenceMasterId""
        JOIN ""Attendance"".""AttendenceStatus"" ats ON atd.""AttendenceStatusId"" = ats.""AttendenceStatusId""
      WHERE
        af.""StatusId"" = 1
	{0}) sm
GROUP BY ""AdmissionFormId"",
         ""RefferenceNo"",	
         ""ParentContactNo"",	
         ""StudentName"",	
         ""FatherName"",	
         ""Description"",	
         ""CampusName"",	
         ""SessionName"",	
         ""ShiftName"",	
         ""GenderType"",	
         ""RollNo"",	
         ""ProgramName"",	
         ""ClassName"",	
         ""SectionName"")vc
	
            GROUP BY
            vc.""Description"",
            vc.""CampusName"",
            vc.""SessionName"",
            vc.""ShiftName"",
            vc.""GenderType"",
            vc.""RollNo"",
            vc.""ProgramName"",
            vc.""ClassName"",
            vc.""SectionName"" ";

        string AttendequeryExx = @"  SELECT 
          ""AdmissionFormId"",
        ""RefferenceNo"",
        ""ParentContactNo"",
        ""StudentName"",
        ""FatherName"",
        ""Description"",
        ""CampusName"",
        ""SessionName"",
        ""ShiftName"",
        ""GenderType"",
        ""RollNo"",
        ""ProgramName"",
        SUM(""PresentStatus"") AS ""Present"",
        SUM(""AbsentStatus"") AS ""Absent"",
        SUM(""LeaveStatus"") AS ""Leave"",
       
        SUM(""PresentStatus"") * 100 /  COALESCE(NULLIF((SUM(""AbsentStatus"")+SUM(""PresentStatus"")),0), 1) AS ""Percentage"",
        ""ClassName"",
        ""SectionName""
      FROM(
      SELECT
      distinct
      atm.""AttendenceMasterId"",
        af.""AdmissionFormId"",
          af.""RefferenceNo"",
          atm.""Dated"",
         ((ARRAY( SELECT v.value FROM jsonb_array_elements(""st"".""ParentContactNo"") v(value)))[1] -> 'phoneNo'::text) AS     ""ParentContactNo"",
        st.""FullName"" AS ""StudentName"",
        st.""FatherName"",
        ""ProgramDetails"".""Description"",
        ""Campus"".""FullName"" AS ""CampusName"",
        ""Session"".""FullName"" AS ""SessionName"",
        sh.""FullName"" AS ""ShiftName"",
        gd.""Description"" AS ""GenderType"",
        af.""RollNo"",
        ""Program"".""FullName"" AS ""ProgramName"",
        CASE WHEN (ats.""FullName"" = 'Present'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""PresentStatus"",
        CASE WHEN (ats.""FullName"" = 'Absent'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""AbsentStatus"",
        CASE WHEN (ats.""FullName"" = 'Leave'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""LeaveStatus"",
        ""Class"".""FullName"" AS ""ClassName"",
        ""Section"".""FullName"" AS ""SectionName""
      FROM
        ""Admission"".""Students"" st
        JOIN ""Admission"".""AdmissionForm"" af ON af.""StudentId"" = st.""StudentId""
        JOIN ""Registration"".""Enrollments"" enr ON enr.""AdmissionFormId"" = af.""AdmissionFormId""

        JOIN ""Setup"".""CampusProgramLink"" cpl ON af.""CampusProgramId"" = cpl.""CampusProgramId""
        JOIN ""Setup"".""Session"" ""Session"" ON cpl.""SessionId"" = ""Session"".""SessionId""
        JOIN ""Setup"".""Campus"" ""Campus"" ON cpl.""CampusId"" = ""Campus"".""CampusId""
        JOIN ""Setup"".""ProgramDetails"" ""ProgramDetails"" ON cpl.""ProgramDetailId"" = ""ProgramDetails"".""ProgramDetailId""
        JOIN ""Setup"".""Program"" ""Program"" ON ""ProgramDetails"".""ProgramId"" = ""Program"".""ProgramId""

        JOIN ""Setup"".""Shift"" sh ON ""ProgramDetails"".""ShiftId"" = sh.""ShiftId""
          JOIN ""Setup"".""Gender"" gd ON st.""GenderId"" = gd.""GenderId""

        JOIN ""Registration"".""SectionCourseLink"" scl ON enr.""SectionCourseLinkId""[1] = scl.""SectionCourseLinkId"" AND cpl.""CampusProgramId"" = scl.""CampusProgramId""

        JOIN ""Setup"".""Class"" ""Class"" ON scl.""ClassId"" = ""Class"".""ClassId""
        JOIN ""Setup"".""Section"" ""Section"" ON scl.""SectionId"" = ""Section"".""SectionId""

        JOIN ""Attendance"".""AttendanceDetail"" atd ON atd.""AdmissionFormId"" = af.""AdmissionFormId""
        JOIN ""Attendance"".""AttendenceMaster"" atm ON atd.""AttendanceMasterId"" = atm.""AttendenceMasterId""
       

        JOIN ""Attendance"".""AttendenceStatus"" ats ON atd.""AttendenceStatusId"" = ats.""AttendenceStatusId""
      WHERE
        af.""StatusId"" = 1 and atd.""StatusId"" =1 and atm.""StatusId"" = 1 and atm.""IsApproved"" and (atm.""TimeTableJson"" ->>'SectionCourseLinkId')::uuid =scl.""SectionCourseLinkId""
	{0}) sm
GROUP BY ""AdmissionFormId"",
         ""RefferenceNo"",
         ""ParentContactNo"",	
         ""StudentName"",	
         ""FatherName"",	
         ""Description"",	
         ""CampusName"",	
         ""SessionName"",	
         ""ShiftName"",	
         ""GenderType"",	
         ""RollNo"",	
         ""ProgramName"",	
         ""ClassName"",	
         ""SectionName""";

        string AttendequerySubjectWise = @"
             SELECT DISTINCT
              ""AdmissionFormId"",
              ""RefferenceNo"",
              ""ParentContactNo"",
              ""StudentName"",
              ""FatherName"",
              ""Description"",
              ""CampusName"",
              ""SessionName"",
              ""ShiftName"",
              ""GenderType"",
              ""RollNo"",
              ""ProgramName"",
              SUM(""PresentStatus"") AS ""Present"",
              SUM(""AbsentStatus"") AS ""Absent"",
              SUM(""LeaveStatus"") AS ""Leave"",
              SUM(""PresentStatus"") * 100 / (SUM(""AbsentStatus"") + SUM(""PresentStatus"")) AS ""Percentage"",
              ""ClassName"",
              ""SectionName"",""CourseName""
            FROM(
            SELECT
              af.""AdmissionFormId"",
                af.""RefferenceNo"",
                atm.""Dated"",
               ((ARRAY( SELECT v.value FROM jsonb_array_elements(""st"".""ParentContactNo"") v(value)))[1] -> 'phoneNo'::text) AS     ""ParentContactNo"",
              st.""FullName"" AS ""StudentName"",
              st.""FatherName"",
              ""ProgramDetails"".""Description"",
              ""Campus"".""FullName"" AS ""CampusName"",
              ""Session"".""FullName"" AS ""SessionName"",
              sh.""FullName"" AS ""ShiftName"",
              gd.""Description"" AS ""GenderType"",
              af.""RollNo"",
              ""Program"".""FullName"" AS ""ProgramName"",
              CASE WHEN (ats.""FullName"" = 'Present'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""PresentStatus"",
              CASE WHEN (ats.""FullName"" = 'Absent'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""AbsentStatus"",
              CASE WHEN (ats.""FullName"" = 'Leave'::text) THEN (1)::bigint ELSE (0)::bigint END AS ""LeaveStatus"",
              ""Class"".""FullName"" AS ""ClassName"",
              ""Section"".""FullName"" AS ""SectionName"",
							crs.""FullName"" as ""CourseName""
							 
            FROM
              ""Admission"".""Students"" st
              JOIN ""Admission"".""AdmissionForm"" af ON af.""StudentId"" = st.""StudentId""
              JOIN ""Registration"".""Enrollments"" enr ON enr.""AdmissionFormId"" = af.""AdmissionFormId""

              JOIN ""Setup"".""CampusProgramLink"" cpl ON af.""CampusProgramId"" = cpl.""CampusProgramId""
              JOIN ""Setup"".""Session"" ""Session"" ON cpl.""SessionId"" = ""Session"".""SessionId""
              JOIN ""Setup"".""Campus"" ""Campus"" ON cpl.""CampusId"" = ""Campus"".""CampusId""
              JOIN ""Setup"".""ProgramDetails"" ""ProgramDetails"" ON cpl.""ProgramDetailId"" = ""ProgramDetails"".""ProgramDetailId""
              JOIN ""Setup"".""Program"" ""Program"" ON ""ProgramDetails"".""ProgramId"" = ""Program"".""ProgramId""

              JOIN ""Setup"".""Shift"" sh ON ""ProgramDetails"".""ShiftId"" = sh.""ShiftId""
                JOIN ""Setup"".""Gender"" gd ON st.""GenderId"" = gd.""GenderId""

              JOIN ""Registration"".""SectionCourseLink"" scl ON enr.""SectionCourseLinkId""[1] = scl.""SectionCourseLinkId"" AND cpl.""CampusProgramId"" = scl.""CampusProgramId""

              JOIN ""Setup"".""Class"" ""Class"" ON scl.""ClassId"" = ""Class"".""ClassId""
              JOIN ""Setup"".""Section"" ""Section"" ON scl.""SectionId"" = ""Section"".""SectionId""
							

              JOIN ""Attendance"".""AttendanceDetail"" atd ON atd.""AdmissionFormId"" = af.""AdmissionFormId""
              JOIN ""Attendance"".""AttendenceMaster"" atm ON atd.""AttendanceMasterId"" = atm.""AttendenceMasterId""
              JOIN ""Attendance"".""AttendenceStatus"" ats ON atd.""AttendenceStatusId"" = ats.""AttendenceStatusId""
							
							
							
								JOIN ""Registration"".""ProgramCourseLink"" pcl on pcl.""ProgramCourseLinkId""=  (atm.""TimeTableJson"" ->>'ProgramCourseLinkId')::uuid
								JOIN ""Registration"".""Course"" crs on pcl.""CourseId""=crs.""CourseId""
            WHERE
              af.""StatusId"" = 1  AND   (atm.""TimeTableJson"" ->>'SectionCourseLinkId')::uuid=  scl.""SectionCourseLinkId""
  {0}) sm
      GROUP BY ""AdmissionFormId"",
               ""RefferenceNo"",
               ""ParentContactNo"",
               ""StudentName"",
               ""FatherName"",
               ""Description"",
               ""CampusName"",
               ""SessionName"",
               ""ShiftName"",
               ""GenderType"",
               ""RollNo"",
               ""ProgramName"",
               ""ClassName"",
               ""SectionName"",
	       ""CourseName""
						
            ";


        string Attendequery = @"SELECT
ms.""AdmissionFormId"",

sum(ms.""PresentStatus"") AS ""Present"",
sum(ms.""AbsentStatus"") AS ""Absent"",
sum(ms.""LeaveStatus"") AS ""Leave"",
        CASE
            WHEN ((sum(ms.""PresentStatus"")+sum(ms.""AbsentStatus"") = 0::numeric)) THEN (0)::bigint
            ELSE ((sum(ms.""PresentStatus"")*100)/(sum(ms.""PresentStatus"")+sum(ms.""AbsentStatus"")))
        END AS ""Percentage"",
        
    ms.""StudentName"",
    ms.""RefferenceNo"",
    ms.""ParentContactNo"",
    ms.""CampusName"",
    ms.""SessionName"",
    ms.""RollNo"",
    ms.""Description"",
    ms.""ProgramName"",
    ms.""SectionName"",
    ms.""ClassName"" ,
    ms.""Month"",
    ms.""StartDate"",
    ms.""EndDate""

    FROM
( SELECT
        ""AdmissionForm"".""AdmissionFormId"",
   ""AdmissionForm"".""RefferenceNo"",
    ""AdmissionForm"".""StatusId"",
     ""AttendenceMaster"".""Dated"",
     ((ARRAY( SELECT v.value
              FROM jsonb_array_elements(""Students"".""ParentContactNo"") v(value)))[1] -> 'phoneNo'::text) AS     ""ParentContactNo"",
to_char((""Attendance"".""AttendenceMaster"".""Dated"")::timestamp with time zone, 'Month'::text) AS ""StartDate"",
to_char(date_trunc('month'::text, (""Attendance"".""AttendenceMaster"".""Dated"")::timestamp with time zone), 'dd-Mon-yyyy'::text) AS ""EndDate"",
to_char((date_trunc('month'::text, (""Attendance"".""AttendenceMaster"".""Dated"")::timestamp with time zone) + '1 mon -1 days'::interval), 'dd-Mon-yyyy'::text) AS ""Month"",
            
            ""Students"".""FullName"" AS ""StudentName"",
            ""Students"".""FatherName"",
            ""ProgramDetails"".""Description"",
            ""Campus"".""FullName"" AS ""CampusName"",
            ""Session"".""FullName"" AS ""SessionName"",
            ""Shift"".""FullName"" AS ""ShiftName"",
            ""Session"".""SessionId"",
            ""CampusProgramLink"".""CampusId"",
            ""Gender"".""Description"" AS ""GenderType"",
            ""AdmissionForm"".""RollNo"",
            ""Gender"".""GenderId"",
            ""ProgramDetails"".""ProgramDetailId"",
            ""Program"".""ProgramId"",
            ""Program"".""FullName"" AS ""ProgramName"",
            ""Shift"".""ShiftId"",
            ""AttendenceStatus"".""AttendenceStatusId"",
                 CASE
            WHEN (""AttendenceStatus"".""FullName"" = 'Present'::text) THEN count(""AttendenceStatus"".""FullName"")
            ELSE (0)::bigint
        END AS ""PresentStatus"",
        CASE
             WHEN (""AttendenceStatus"".""FullName"" = 'Absent'::text) THEN count(""AttendenceStatus"".""FullName"")
            ELSE (0)::bigint
        END AS ""AbsentStatus"",
        CASE
             WHEN (""AttendenceStatus"".""FullName"" = 'Leave'::text) THEN count(""AttendenceStatus"".""FullName"")
            ELSE (0)::bigint
        END AS ""LeaveStatus"",
            ""Class"".""ClassId"",
            ""Class"".""FullName"" AS ""ClassName"",
            ""Section"".""FullName"" AS ""SectionName"",
            ""Section"".""SectionId""
FROM
""Admission"".""AdmissionForm""
JOIN ""Admission"".""Students"" ON ""Admission"".""AdmissionForm"".""StudentId"" = ""Admission"".""Students"".""StudentId""
JOIN ""Setup"".""CampusProgramLink"" ON ""Admission"".""AdmissionForm"".""CampusProgramId"" = ""Setup"".""CampusProgramLink"".""CampusProgramId""
JOIN ""Setup"".""ProgramDetails"" ON ""Setup"".""CampusProgramLink"".""ProgramDetailId"" = ""Setup"".""ProgramDetails"".""ProgramDetailId""
JOIN ""Setup"".""Campus"" ON ""Setup"".""CampusProgramLink"".""CampusId"" = ""Setup"".""Campus"".""CampusId""
JOIN ""Setup"".""Session"" ON ""Setup"".""CampusProgramLink"".""SessionId"" = ""Setup"".""Session"".""SessionId""
JOIN ""Setup"".""Shift"" ON ""Setup"".""ProgramDetails"".""ShiftId"" = ""Setup"".""Shift"".""ShiftId""
JOIN ""Setup"".""Gender"" ON ""Admission"".""Students"".""GenderId"" = ""Setup"".""Gender"".""GenderId""
JOIN ""Setup"".""Program"" ON ""Setup"".""ProgramDetails"".""ProgramId"" = ""Setup"".""Program"".""ProgramId""
JOIN ""Registration"".""Enrollments"" ON ""Registration"".""Enrollments"".""AdmissionFormId"" = ""Admission"".""AdmissionForm"".""AdmissionFormId""
JOIN ""Attendance"".""AttendanceDetail"" ON ""Attendance"".""AttendanceDetail"".""AdmissionFormId"" = ""Admission"".""AdmissionForm"".""AdmissionFormId""
JOIN ""Attendance"".""AttendenceMaster"" ON ""Attendance"".""AttendanceDetail"".""AttendanceMasterId"" = ""Attendance"".""AttendenceMaster"".""AttendenceMasterId""
JOIN ""Attendance"".""AttendenceStatus"" ON ""Attendance"".""AttendanceDetail"".""AttendenceStatusId"" = ""Attendance"".""AttendenceStatus"".""AttendenceStatusId""
JOIN ""Registration"".""SectionCourseLink"" ON ""Registration"".""Enrollments"".""SectionCourseLinkId""[1]= ""Registration"".""SectionCourseLink"".""SectionCourseLinkId""
 JOIN ""Setup"".""Class"" ON ""Registration"".""SectionCourseLink"".""ClassId"" = ""Setup"".""Class"".""ClassId""
JOIN ""Registration"".""ProgramCourseLink"" ON ((""AttendenceMaster"".""TimeTableJson"" ->> 'ProgramCourseLinkId'::text))::uuid = ""Registration"".""ProgramCourseLink"".""ProgramCourseLinkId""
 
 JOIN ""Registration"".""Course"" ON ""Registration"".""ProgramCourseLink"".""CourseId"" = ""Registration"".""Course"".""CourseId""
 JOIN ""Setup"".""Section"" ON ""Registration"".""SectionCourseLink"".""SectionId"" = ""Setup"".""Section"".""SectionId""

WHERE((""Admission"".""AdmissionForm"".""StatusId"" = ""Admission"".""Students"".""StatusId"") AND 
( ""Setup"".""CampusProgramLink"".""StatusId"" = ""Admission"". ""AdmissionForm"".""StatusId"") AND 
(""Setup"".""ProgramDetails"".""StatusId"" = ""Admission"".""AdmissionForm"".""StatusId"") AND 
(""Setup"".""Campus"".""StatusId"" = ""Admission"".""AdmissionForm"".""StatusId"") AND 
(""Session"".""StatusId"" = ""Admission"".""AdmissionForm"".""StatusId"") AND 
(""Setup"".""Shift"".""StatusId"" = ""Admission"".""AdmissionForm"".""StatusId"") AND 
(""Setup"".""Gender"".""StatusId"" = ""Admission"".""AdmissionForm"".""StatusId"") AND 
(""Admission"".""AdmissionForm"".""StatusId"" = 1)  AND 
 
(""Attendance"".""AttendenceMaster"".""StatusId"" = 1) AND
(""Attendance"".""AttendanceDetail"".""StatusId"" = 1)AND 
(""Attendance"".""AttendenceMaster"".""IsApproved""=TRUE) {0})

GROUP BY ""AdmissionForm"".""AdmissionFormId"", ""AdmissionForm"".""RefferenceNo"", ""Students"".""FullName"", ""Students"".""FatherName"", ""Students"".""ParentContactNo"", 
""Campus"".""FullName"", ""Session"".""FullName"", ""Shift"".""FullName"", ""Session"".""SessionId"", ""CampusProgramLink"".""CampusId"", 
""Gender"".""Description"", ""AdmissionForm"".""RollNo"", ""Gender"".""GenderId"", ""ProgramDetails"".""ProgramDetailId"", 
""Program"".""ProgramId"", ""Program"".""FullName"", ""Shift"".""ShiftId"", ""AttendenceStatus"".""AttendenceStatusId"", 
""Class"".""ClassId"", ""Class"".""FullName"", ""Section"".""FullName"", ""Section"".""SectionId"", ""AttendenceMaster"".""Dated""
order by ""Admission"".""AdmissionForm"".""RollNo"" ASC
) ms

GROUP BY ms.""AdmissionFormId"",
    ms.""StudentName"",
    ms.""RefferenceNo"",
    ms.""ParentContactNo"",
    ms.""CampusName"",
    ms.""SessionName"",
    ms.""RollNo"",
    ms.""Description"",
    ms.""ProgramName"",
    ms.""SectionName"",
    ms.""ClassName"",
    ms.""Month"",
    ms.""StartDate"",
    ms.""EndDate""
    ORDER BY ms.""RollNo""";

    }
}
