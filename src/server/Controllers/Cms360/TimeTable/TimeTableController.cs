using System.Dynamic;
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
    public class RTVS
    {
        public string ReturnValue { get; set; }
    }


    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class TimeTableTimeTableController : Controller
    {
        private readonly ITimeTableTimeTableRepository repository;

        private readonly ITimeTableTimeTableRepositoryVM repo;
        private readonly ITimeTableTimeTableTeacherRepository repoTeacher;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private long ContextUserId = 0;
        public TimeTableTimeTableController(ITimeTableTimeTableRepository repository, ITimeTableTimeTableRepositoryVM repo, IUserLogService log, DbContextBase db, IDomainContextResolver Resolver, ITimeTableTimeTableTeacherRepository repoTeacher)
        {
            this.repository = repository;
            this.repo = repo;
            this.repoTeacher = repoTeacher;
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
            return Ok(await this.repo.FindByAsync(e => e.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableTimeTable).Assembly);
            Expression<Func<TimeTableTimeTable, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableTimeTable, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableTimeTable).Assembly);
            Expression<Func<TimeTableTimeTable, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableTimeTable, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableTimeTable).Assembly);
            Expression<Func<TimeTableTimeTable, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableTimeTable, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableTimeTable).Assembly);
            Expression<Func<TimeTableTimeTable, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableTimeTable, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        //  [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetTimeTableViaSession([FromBody] Predicate model)
        // {
        //     var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
        //     var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
        //     var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
        //     var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
        //     var SectionID = new Guid(model.ProvidedString.Split("?")[4]);
        //     string sql=string.Format("SELECT * FROM  \"TimeTable\".\"TimeTableWithSectionsEx2\"('{0}','{1}','{2}','{3}','{4}')", SessionID, CampusID, ProgramdetailID, ClassID, SectionID);

        //     Console.WriteLine(model.ProvidedString);
        //     Console.WriteLine(sql);

        //     return Ok (this.db.TimeTableTimeTableVMEX3.FromSql(sql) );

        //    // return Ok(this.db.TimeTableTimeTableVM.Where(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID && e.SectionId == SectionID));

        //     //return Ok(this.repo.FindBy(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID && e.SectionId == SectionID));
        // }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTimeTableViaSession([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
            var SectionID = new Guid(model.ProvidedString.Split("?")[4]);
            string sql = string.Format("SELECT * FROM  \"TimeTable\".\"TimeTableWithSectionsEx3\"('{0}','{1}','{2}','{3}','{4}')", SessionID, CampusID, ProgramdetailID, ClassID, SectionID);
            //return Ok(this.db.TimeTableTimeTableVM.Where(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID && e.SectionId == SectionID));


            //return Ok(this.repo.FindBy(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID && e.SectionId == SectionID));
            Console.WriteLine(model.ProvidedString);
            Console.WriteLine(sql);

            return Ok(this.db.TimeTableTimeTableVMEX3.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertTimeTableClosedData([FromBody] Predicate predicate)
        {
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[4]);
            string json = string.Format("SELECT * FROM  \"TimeTable\".\"InsertTimeTableClosedData\"('{0}','{1}','{2}','{3}','{4}')", sessionId, campusId, programId, campusProgramId, classId);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok("TimeTable Closed Successfully");

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTimeTableCloseData([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[2]);
            string sql = string.Format("SELECT * FROM  \"TimeTable\".\"TimeTableClose\"('{0}','{1}','{2}' )", SessionID, CampusID, ClassID);
            return Ok(this.db.TimeTableClose.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetBulkDayoffUnHeld([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
            var SectionID = new Guid(model.ProvidedString.Split("?")[4]);
            var fromdate = ((model.ProvidedString.Split("?")[5]));
            var todate = (model.ProvidedString.Split("?")[6]);
            string sql = string.Format(@"select * from  ""TimeTable"".""GetBulkDayOFFUnheldData""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", SessionID, CampusID, ProgramdetailID, ClassID, SectionID, fromdate, todate);

            return Ok(this.db.TimeTableTimeTableVM.FromSql(sql));


        }
[HttpPost]
        [Route("[action]")]
        public IActionResult GetBulkDayoffUnHeldForAllSection([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
            var SectionID = new string(model.ProvidedString.Split("?")[4]);
            var fromdate = ((model.ProvidedString.Split("?")[5]));
            var todate = (model.ProvidedString.Split("?")[6]);
            string sql = string.Format(@"select * from  ""TimeTable"".""GetBulkDayOFFUnheldDataForAllSection""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", SessionID, CampusID, ProgramdetailID, ClassID, SectionID, fromdate, todate);

            return Ok(this.db.TimeTableTimeTableVM.FromSql(sql));


        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetRemoveDayOFFUnheldData([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
            var SectionID = new Guid(model.ProvidedString.Split("?")[4]);
            var fromdate = ((model.ProvidedString.Split("?")[5]));
            var todate = (model.ProvidedString.Split("?")[6]);
            string sql = string.Format(@"select * from  ""TimeTable"".""GetRemoveDayOFFUnheldData""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", SessionID, CampusID, ProgramdetailID, ClassID, SectionID, fromdate, todate);

            return Ok(this.db.TimeTableTimeTableVM.FromSql(sql));
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherTimeTableReport([FromBody] Predicate model)
        {
            var StaffId = new Guid(model.ProvidedString);
            return Ok(this.db.VWTeacherTimeTableReport.Where(e => e.StaffId == StaffId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertMergeTimeTable([FromBody] Predicate predicate)
        {

            var list = (predicate.ProvidedString.Split("?")[0]);
            var neworupd = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);

            string json = String.Format("SELECT \"TimeTable\".\"InsertMergeTimeTable\"('{0}',{1})", list, neworupd);
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
        public IActionResult GetSectionincharge([FromBody] Predicate predicate)
        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);

            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectioncourseid = new Guid(predicate.ProvidedString.Split("?")[2]);

            string json = String.Format(@"SELECT * from ""TimeTable"".""GetSectionincharge""('{0}','{1}','{2}')", campusprogramid, classid, sectioncourseid);

            // Console.WriteLine (json);

            return Ok(this.db.StaffHODData.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionData([FromBody] Predicate predicate)
        {
            var sectioncourseid = new Guid(predicate.ProvidedString.Split("?")[0]);


            string json = String.Format(@"SELECT * from ""TimeTable"".""GetData""('{0}')", sectioncourseid);

            // Console.WriteLine (json);

            return Ok(this.db.StaffHODData.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTimetablebyroom([FromBody] Predicate model)
        {
            var roomid = new Guid(model.ProvidedString);
            return Ok(this.db.TimeTableTimeTable.Where(e => e.StatusId != 2 && e.RoomId == roomid));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertSectionIncharge([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var list = (predicate.ProvidedString.Split("?")[0]);
                var sectioncourseid = new Guid(predicate.ProvidedString.Split("?")[1]);



                string json = String.Format("SELECT \"TimeTable\".\"InsertSectionIncharge\"('{0}','{1}') as ProvidedString", list, sectioncourseid);
                // Console.WriteLine (json);

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
        public IActionResult DeleteSectionInchargeData([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var staffid = new Guid(predicate.ProvidedString.Split("?")[0]);

                string json = String.Format("SELECT \"TimeTable\".\"DeleteSectionIncharge\"('{0}') as ProvidedString", staffid);
                // Console.WriteLine (json);

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
        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertBulkDayOff([FromBody] Predicate predicate)
        {
            IDbConnection connection = db.Database.GetDbConnection();
            // var message="";
            var rtv = new RTVS() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var fromdate = new string(predicate.ProvidedString.Split("?")[1]);
            var todate = new string(predicate.ProvidedString.Split("?")[2]);
            var ope = Convert.ToInt32(predicate.ProvidedString.Split("?")[3]);
            var Data = this.log.GetLog();
            string json = String.Format(@"SELECT * from ""TimeTable"".""InsertDayoffbulk""('{0}'::json,'{1}','{2}','{3}'::json,{4})", list, fromdate, todate, Data, ope);
            Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;
            Console.WriteLine(rtv.ReturnValue);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(rtv);


        }


        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult InsertBulkDayOff([FromBody] Predicate predicate)
        // {
        //     var list = new string(predicate.ProvidedString.Split("?")[0]);
        //     var fromdate = new string(predicate.ProvidedString.Split("?")[1]);
        //     var todate = new string(predicate.ProvidedString.Split("?")[2]);
        //     var ope = Convert.ToInt32(predicate.ProvidedString.Split("?")[3]);
        //     var Data = this.log.GetLog();
        //     string json = String.Format("SELECT \"TimeTable\".\"InsertDayoffbulk\"('{0}','{1}','{2}','{3}',{4})", list, fromdate, todate, Data, ope);
        //     Console.WriteLine(json);
        //     IDbConnection connection = db.Database.GetDbConnection();
        //     if (connection.State == ConnectionState.Closed)
        //         connection.Open();
        //     connection.Execute(json);
        //     if (connection.State == ConnectionState.Open)
        //     {
        //         connection.Close();
        //         connection.Dispose();
        //     }
        //     return Ok(true);
        // }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTimeTableMerge([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            //var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[1]);
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            string sql = String.Format(@"select * from  ""TimeTable"".""TimeTableWithSectionsEx""({0},'{1}','{2}')", userid, SessionID, ClassID);

            // return Ok(this.repo.FindBy(e => e.StatusId == 1 && e.SessionId == SessionID && e.CampusId == CampusID  && e.ClassId == ClassID ).OrderBy(e=>e.DayName));
            return Ok(this.db.TimeTableTimeTableVM.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTimeTableMergeEx([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[2]);
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[3]);
            string sql = String.Format(@"select * from  ""TimeTable"".""TimeTableWithSections""({0},'{1}','{2}','{3}')", userid, SessionID, CampusID, ClassID);

            // return Ok(this.repo.FindBy(e => e.StatusId == 1 && e.SessionId == SessionID && e.CampusId == CampusID  && e.ClassId == ClassID ).OrderBy(e=>e.DayName));
            return Ok(this.db.TimeTableTimeTableVM.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMergeTimeTableData([FromBody] Predicate model)
        {
            string sql = String.Format(@"select * from  ""TimeTable"".""GetTimeTableMErgeData""({0})", model.ProvidedString);
            // // Console.WriteLine (sql);
            return Ok(this.db.TimeTableTimeTableMerge.FromSql(sql).ToList<TimeTableTimeTableMerge>());

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);

            return Ok(this.db.TimeTableTimeTableVM.Where(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCourceVM([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[4]);

            var dayname = date.DayOfWeek.ToString();

            return Ok(this.db.TimeTableTimeTableVM.Where(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID && e.DayName == dayname));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCoursesVM([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);

            return Ok(this.db.TimeTableTimeTableVM.Where(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCourse([FromBody] Predicate model)
        {
            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);

            var dayname = date.DayOfWeek.ToString();

            return Ok(this.db.TimeTableTimeTableVM.Where(e => e.StatusId != 2 && e.DayName == dayname));
        }

        //     [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult GetTimeTableData([FromBody] Predicate model)
        //     {
        //         var param = model.ProvidedString.Split("?")[0];
        //         var dated = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
        //         var dayname = dated.DayOfWeek.ToString();
        //         param = param.Replace("#DAYNAME#", dayname);
        //         var query = string.Format(@"SELECT * FROM ""Query""(
        //  'cv.*', 
        // '""TimeTable"".""VWTimeTableTeacher"" as cv' , 
        // '{0}
        // ')
        // AS TBL(""TimeTableId"" uuid, ""SectionCourseLinkId"" uuid, ""StaffId"" uuid, ""RoomId"" uuid, 
        // ""DayName"" text, ""SlotTimingId"" uuid, ""StatusId"" int4, ""LoggerId"" uuid, ""RoomName"" text,
        //  ""Name"" text, ""StartTime"" text, ""EndTime"" text, ""StaffName"" text, ""CampusName"" text, 
        //  ""CampusId"" uuid, ""Description"" text, ""ProgramDetailId"" uuid, ""SessionId"" uuid, ""Session"" text, 
        //  ""SectionId"" uuid, ""ClassId"" uuid, ""FullName"" text, ""SectionName"" text, 
        //  ""ProgramCourseLinkId"" uuid, ""CourseId"" uuid, ""IsBreak"" bool, ""UserId"" int8, ""ClassName"" text,
        //   ""Ribbon"" int4,  ""IsDayOff"" int4);", param);
        //         // Console.WriteLine(query);
        //         return Ok(this.db.TimeTableTimeTableTeacher.FromSql(query).AsNoTracking());
        //         // var date = Convert.ToDateTime(model.ProvidedString);

        //         // var dayname = date.DayOfWeek.ToString();

        //         // ContextUserId = DomainContext.User.UserId;
        //         // return Ok(db.TimeTableTimeTableTeacher.Where(e => e.StatusId != 2 && e.UserId == ContextUserId && e.DayName == dayname));
        //     }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTimeTableData([FromBody] Predicate model)
        {
            var param = model.ProvidedString.Split("?")[0];
            var dated = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var dayname = dated.DayOfWeek.ToString();
            param = param.Replace("#DAYNAME#", dayname);

            ContextUserId = DomainContext.User.UserId;
            string query = String.Format(@"select * from  ""TimeTable"".""GetTeacherTimetableData""('{0}','{1}','{2}','{3}')", param, dated, ContextUserId, dayname);

            return Ok(this.db.TimeTableTimeTableTeacher4.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetUserTimeTableData([FromBody] Predicate model)
        {
            var date = Convert.ToDateTime(model.ProvidedString);

            var dayname = date.DayOfWeek.ToString();

            ContextUserId = DomainContext.User.UserId;
            return Ok(this.db.TimeTableTimeTableTeacher.FromSql(String.Format(@"select  * from ""TimeTable"".""GetUserTimeTableData"" ({0},'{1}')", ContextUserId, dayname)));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetUserTimeTableRib([FromBody] Predicate model)
        {
            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);
            var ribbon = Convert.ToInt32(model.ProvidedString.Split("?")[1]);
            var where = model.ProvidedString.Split("?")[2];
            var dayname = date.DayOfWeek.ToString();
            this.db.Database.SetCommandTimeout(100);
            ContextUserId = DomainContext.User.UserId;
            return Ok(this.db.TimeTableTimeTableTeacher.FromSql(String.Format(@"select  * from ""TimeTable"".""GetUserTimeTableRibEx"" ({0},'{1}','{2}','{3}')", ContextUserId, date, dayname, where)));
        }

        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetUserDayClose([FromBody] Predicate model)
        {
            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);

            var dayname = date.DayOfWeek.ToString();

            ContextUserId = DomainContext.User.UserId;
            return Ok(this.db.TimeTableTimeTableDayClose4.FromSql(String.Format(@"select  * from ""TimeTable"".""GetUserDayClose3"" ({0},'{1}')", ContextUserId, dayname)));
        }


        //    [HttpPost]
        //     [Route("[action]")]
        //     public IActionResult GetUserDayClose([FromBody] Predicate model)
        //     {
        //         var date = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);
        //         var ribbon = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

        //         var dayname = date.DayOfWeek.ToString();

        //         ContextUserId = DomainContext.User.UserId;
        //         return Ok(this.db.TimeTableTimeTableDayClose.FromSql(String.Format(@"select  * from ""TimeTable"".""GetUserDayClose"" ({0},'{1}','{2}')", ContextUserId, dayname, ribbon)));
        //     }

        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDailyAttendanceStatus([FromBody] Predicate model)
        {
            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);
            ContextUserId = DomainContext.User.UserId;
            return Ok(this.db.TimeTableDailyAttendanceStatus.FromSql(String.Format(@"select  * from ""TimeTable"".""GetDailyAttendanceInterface"" ({0},'{1}')", ContextUserId, date)));
        }
        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDailyAttendanceTeacherDeatail([FromBody] Predicate model)
        {
            var StaffId = new Guid(model.ProvidedString.Split("?")[0]);

            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[1]);
            var status = new string(model.ProvidedString.Split("?")[2]);
            ContextUserId = DomainContext.User.UserId;
            return Ok(this.db.TimeTableDailyAttendanceDetail.FromSql(String.Format(@"select  * from ""TimeTable"".""GetDailyAttendanceTeacherDetail"" ('{0}','{1}','{2}',{3})", StaffId, date, status, ContextUserId)));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertDayClose([FromBody] Predicate model)
        {
            // IDbConnection connection = db.Database.GetDbConnection();
            var jsonModel = model.ProvidedString.Split("?")[0];
            var masterIdString = new string(model.ProvidedString.Split("?")[1]);

            string query = String.Format(@"SELECT * FROM ""Attendance"".""SmsConcatation""('{0}','{1}')", masterIdString, jsonModel);
            Console.WriteLine(query);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            AttendanceNotificationEx[] obj = connection.Query<AttendanceNotificationEx>(query).ToArray<AttendanceNotificationEx>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj);
            //  if (connection.State == ConnectionState.Closed)
            //     connection.Open();
            //  if (connection.State == ConnectionState.Open)
            // {
            //     connection.Close();
            //     connection.Dispose();
            // }
            // return Ok("oK");
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult InsertDayClose([FromBody] Predicate model)
        // {
        //     // IDbConnection connection = db.Database.GetDbConnection();
        //     var jsonModel = model.ProvidedString.Split("?")[0];
        //     var masterIdString =  new string(model.ProvidedString.Split("?")[1]);

        //     string query = String.Format(@"SELECT * FROM ""Attendance"".""SmsConcat""('{0}','{1}')", masterIdString, jsonModel);
        //     Console.WriteLine(query);
        //     IDbConnection connection = db.Database.GetDbConnection();
        //     if (connection.State == ConnectionState.Closed)
        //         connection.Open();
        //     AttendanceNotificationEx[] obj = connection.Query<AttendanceNotificationEx>(query).ToArray<AttendanceNotificationEx>();

        //     if (connection.State == ConnectionState.Open)
        //     {
        //         connection.Close();
        //         connection.Dispose();
        //     }
        //     return Ok(obj);
        //     //  if (connection.State == ConnectionState.Closed)
        //     //     connection.Open();
        //     //  if (connection.State == ConnectionState.Open)
        //     // {
        //     //     connection.Close();
        //     //     connection.Dispose();
        //     // }
        //     // return Ok("oK");
        // }

        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCourceVMD([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
            var SectionID = new Guid(model.ProvidedString.Split("?")[4]);
            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);

            var dayname = date.DayOfWeek;

            string sql = String.Format(@"select * from  ""TimeTable"".""TimeTableGetCourceEX""('{0}','{1}','{2}','{3}','{4}','{5}')", SessionID, CampusID, ProgramdetailID, ClassID, SectionID, dayname);

            return Ok(this.db.TimeTableTimeTableCourseVM.FromSql(sql));
            // var dayname = date.DayOfWeek.ToString();

            // return Ok(this.repo.FindBy(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID && e.SectionId == SectionID && e.DayName == dayname));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCourceVMDEx([FromBody] Predicate model)
        {
            var SessionID = new Guid(model.ProvidedString.Split("?")[0]);
            var CampusID = new Guid(model.ProvidedString.Split("?")[1]);
            var ProgramdetailID = new Guid(model.ProvidedString.Split("?")[2]);
            var ClassID = new Guid(model.ProvidedString.Split("?")[3]);
            var SectionID = new Guid(model.ProvidedString.Split("?")[4]);
            var date = Convert.ToDateTime(model.ProvidedString.Split("?")[5]);

            var dayname = date.DayOfWeek.ToString();

            return Ok(this.db.TimeTableTimeTableVMEx.Where(e => e.StatusId != 2 && e.SessionId == SessionID && e.CampusId == CampusID && e.ProgramDetailId == ProgramdetailID && e.ClassId == ClassID && e.SectionId == SectionID && e.DayName == dayname));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckClash([FromBody] Predicate model)
        {

            var RoomId = new Guid(model.ProvidedString.Split("?")[0]);
            var SlotTimingId = new Guid(model.ProvidedString.Split("?")[1]);
            var DayName = new string(model.ProvidedString.Split("?")[2]);
            var SectionId = new Guid(model.ProvidedString.Split("?")[3]);
            var StaffId = new Guid(model.ProvidedString.Split("?")[4]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[5]);
            var campusid = new Guid(model.ProvidedString.Split("?")[6]);
            var z = this.db.Predicate.FromSql(String.Format("SELECT \"TimeTable\".\"val\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}') as \"ProvidedString\"", RoomId, SlotTimingId, DayName, SectionId, StaffId, sessionid, campusid));
            return Ok(z);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] TimeTableTimeTable entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] TimeTableTimeTable entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<TimeTableTimeTable> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<TimeTableTimeTable> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] TimeTableTimeTable entity)
        {
            //entity.ProgramCourseLinkId=Guid.Parse("00000000-0000-0000-0000-000000000000");
            this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "TimeTable.TimeTable"));
        }







        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateEx([FromBody] TimeTableTimeTable entity)
        {
            entity.ProgramCourseLinkId = Guid.Parse("00000000-0000-0000-0000-000000000000");
            this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] TimeTableTimeTable entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] TimeTableTimeTable entity)
        {
            //  entity.ProgramCourseLinkId=Guid.Parse("00000000-0000-0000-0000-000000000000");
            // this.repository.Update(entity);
            // this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] TimeTableTimeTable entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "TimeTable.TimeTable"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableTimeTable).Assembly);
            Expression<Func<TimeTableTimeTable, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableTimeTable, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TimeTableTimeTable).Assembly);
            Expression<Func<TimeTableTimeTable, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TimeTableTimeTable, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertAcademicCalendar([FromBody] Predicate predicate)
        {

            var SessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var CampusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var HolidayTypeId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var list = (predicate.ProvidedString.Split("?")[3]);

            string json = String.Format("SELECT \"AcademicCalendar\".\"InsertAcademicCalendar\"('{0}','{1}','{2}','{3}')", SessionId, CampusId, HolidayTypeId, list);
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
        public IActionResult GetAcademicCalendar([FromBody] Predicate predicate)
        {

            var SessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var CampusId = new Guid(predicate.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"select  * from ""AcademicCalendar"".""GetAcademicCalendar"" ('{0}','{1}')", SessionId, CampusId);
            return Ok(this.db.AcademicCalendarVM.FromSql(sql));
        }
        //    [HttpPost]
        // [Route("[action]")]
        // public IActionResult UpdateBulkdayoff([FromBody]Predicate predicate)
        // { 
        //     var list = new string(predicate.ProvidedString.Split("?")[0]);
        //     var fromdate = new string(predicate.ProvidedString.Split("?")[1]);
        //     var todate = new string(predicate.ProvidedString.Split("?")[2]);
        // var ope = Convert.ToInt32(predicate.ProvidedString.Split("?")[3]);
        //var Data = this.log.GetLog();

        //     string json = String.Format("SELECT \"TimeTable\".\"UpdateBulkDayOFF\"('{0}','{1}','{2}", list, fromdate, todate);
        //      Console.WriteLine(json);
        //  return Ok(this.db.DayOff.FromSql(json));
        //    // this.repository.UpdateBulkdayoff(entity);
        //     //string data = JsonConvert.SerializeObject(entity);
        //    //return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "UpdateBulkdayoff", "TimeTable.DayOff"));

        // }
        [HttpPost]
        [Route("[action]")]
        public IActionResult RemoveBulkDayOff([FromBody] Predicate predicate)
        {

            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var fromdate = new string(predicate.ProvidedString.Split("?")[1]);
            var todate = new string(predicate.ProvidedString.Split("?")[2]);
            var ope = Convert.ToInt32(predicate.ProvidedString.Split("?")[3]);
            var Data = this.log.GetLog();

            string json = String.Format("SELECT \"TimeTable\".\"RemoveDayoffbulk\"('{0}','{1}','{2}','{3}',{4})", list, fromdate, todate, Data, ope);
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


    }
}