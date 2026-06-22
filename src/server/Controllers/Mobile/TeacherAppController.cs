using System.Text;
using System.Runtime.CompilerServices;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Cms360.Contract;
using Cms360.Contract.Security;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Service;
using Cms360.Service.Model;
using Cms360.Service.Security;
using Dapper;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Microsoft.AspNetCore.Cors;
using MailKit.Net.Smtp;
using MimeKit;
using Hangfire;
using Hangfire.MemoryStorage;
using Npgsql;

namespace Cms360.Server.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("AllowPolicy")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [ServiceFilter(typeof(Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Filters.ApiExceptionFilter))]
    public class TeacherAppController : Controller
    {
        private static string DISdbString = "Server=172.23.1.82;User Id=shahidmahmood;Password=shahidmahmood;Database=CmsDb;";

        //"connectionString": "Server=172.23.1.83;Port=5432;User Id=fahadsattar;Password=fahadsattar;Database=CmsDb;",
        private readonly IAntiforgery antiForgeryService;
        private readonly ILocalAuthenticationService authService;
        private readonly CultureService cultureService;
        private readonly IUserLogService log;

        private readonly Cms360.Server.Config serverConfig;
        private readonly Service.Config serviceConfig;
        private readonly ISignupService signupService;
        private readonly ITokenProviderService<Token> tokenService;
        private Response loginResponse;
        private DbContextBase dbc;
        private ICryptoService crypto;
        private readonly ISetupSessionRepository repository;
        private IEmailService email;

        public TeacherAppController(ICryptoService crypto,
        IUserLogService log,
        DbContextBase dbc,
        IAntiforgery antiForgeryService,
        ILocalAuthenticationService authService,
        CultureService cultureService,
        IOptions<Cms360.Server.Config> serverConfig,
        IOptions<Cms360.Service.Config> serviceConfig,
        ISignupService signupService,
        ITokenProviderService<Token> tokenService,
        IDomainContextResolver resolver,
        ILocalizationService localization,
        ISetupSessionRepository repository,
            IEmailService email)
        {
            this.antiForgeryService = antiForgeryService;
            this.authService = authService;
            this.cultureService = cultureService;
            this.serverConfig = serverConfig.Value;
            this.serviceConfig = serviceConfig.Value;
            this.signupService = signupService;
            this.tokenService = tokenService;
            this.log = log;
            this.dbc = dbc;
            this.crypto = crypto;
            this.repository = repository;
            this.email = email;
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult get_years()
        {
            return Ok(this.repository.All()
                .Select(
                    x => new
                    {
                        sessionId = x.SessionId,
                        fullname = x.FullName
                    }
                ));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ResolveUser([FromBody] LoginParam provided)
        {
            try
            {
                loginResponse = new Response()
                {
                    SessionID = new Guid(),
                    TimeDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, DateTime.UtcNow.Day),
                    UserName = "NULL",
                    TeacherID = "",
                    Teacher = "Un Successful",
                    Code = 901,
                    Message = "Un Successful Login"
                };

                var login = this.dbc.LoginData.Where(s => s.Username == provided.User_name).ToList().FirstOrDefault();

                if (login != null)
                {
                    // Console.WriteLine(this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password));

                    if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password))
                    {
                        loginResponse = new Response()
                        {
                            SessionID = Guid.NewGuid(),
                            TimeDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, DateTime.UtcNow.Day),
                            UserName = login.DisplayName,
                            TeacherID = provided.User_name,
                            Teacher = login.DisplayName,
                            TeacherStudentID = login.StaffId,
                            Code = 900,
                            Message = "Successful Login"
                        };
                    }
                }
                this.log.Insert(JsonConvert.SerializeObject(loginResponse), "Teacher_Login", "Login From Mobile/Tab");

                return Ok(loginResponse);
            }
            catch (Exception ex)
            {

                return BadRequest(String.Format("Error in ResolveUser method. {0}", ex.Message));
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Get_TeacherData([FromBody] ClassAttendance predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherLectureDataCI""('{0}')", predicate.Teacher_ID);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherDataResponseCI.FromSql(sql));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetCoursewise_StudentAttendanceData([FromBody] StudentAttendance predicate)
        {
            StudentAttendanceData data = new StudentAttendanceData();
            string sql = string.Format(@"select * from ""Attendance"".""GetCoursewiseStudentAttendanceData""('{0}','{1}','{2}')", predicate.RefferenceNo, predicate.SectionCourseLinkId, predicate.Month);
            string sql1 = string.Format(@"select * from ""Attendance"".""GetCoursewiseStudentAttendanceDataOverall""('{0}','{1}')", predicate.RefferenceNo, predicate.SectionCourseLinkId);
            data.StudentAttendanceDataoverall = this.dbc.StudentAttendanceDataoverall.FromSql(sql1);
            // Console.WriteLine(sql1);
            data.CoursewiseStudentAttendanceData = this.dbc.CoursewiseStudentAttendanceData.FromSql(sql);
            return Ok(data);
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetTeacherMonthDetailSectionCI([FromBody] AttendanceSectionParam predicate)
        {
            string sql = string.Format(@"select * from ""Attendance"".""TeacherMonthAttendanceDtCI""('{0}','{1}')", predicate.SectionCourseLinkId, predicate.Start_Date);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetail.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetPPStudentDetail([FromBody] AttendenceDetailParam predicate)
        {




            string sql = string.Format(@"select * from ""Attendance"".""GetPPStudentDetail""('{0}','{1}')", predicate.Student_Id, predicate.Start_Date);
            // Console.WriteLine(sql);
            return Ok(this.dbc.PPStudentDetail.FromSql(sql));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetTeacherExamDetail([FromBody] ExamCourseParam predicate)
        {
            string sql = string.Format(@"select * from ""Message"".""ExamTeacherReport""('{0}')", predicate.SectionCourseLinkId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetail.FromSql(sql));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetCoursewise_StudentExamData([FromBody] StudentExam predicate)
        {
            string sql = string.Format(@"select * from ""Examination"".""GetStudentExamDataTeacherappnew""('{0}','{1}' )", predicate.RefferenceNo, predicate.ExamName);
            return Ok(this.dbc.StudentExamDataSubjectWise.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentExamDataOverall([FromBody] StudentExamSection predicate)
        {
            string sql = string.Format(@"select * from ""Examination"".""GetStudentExamDataOverall""('{0}' )", predicate.SectionCourseLinkId);
            return Ok(this.dbc.StudentExamDataOverall.FromSql(sql));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetStudentExamDataOverallData([FromBody] StudentExamSectionnew predicate)
        {
            string sql = string.Format(@"select * from ""Examination"".""GetStudentExamDataOverall""('{0}','{1}' )", predicate.SectionCourseLinkId, predicate.ExamName);
            return Ok(this.dbc.StudentExamDataOverallData.FromSql(sql));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_TeacherAppExamData([FromBody] AttendenceDataModel predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""GetTeacherAppExamData""('{0}')", predicate.SectionCourseLinkId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherExamDataResponseEx1.FromSql(sql));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_StudentCourseWiseData([FromBody] StudentCourse predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""Get_stu_ExamData""('{0}','{1}')", predicate.rollno, predicate.programcourselinkid);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentExamDataCourseWise.FromSql(sql));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_TeacherExamDetail([FromBody] ExamCourseParam2 predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""ExamTeacherReport""('{0}','{1}','{2}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId, predicate.examnames);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetail2.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_CorsesData([FromBody] TeacherScoursesModel predicate)
        {

            string sql = string.Format(@"select * from ""Registration"".""Getcourses""('{0}')", predicate.SectionCourseLinkId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.GetTeacherCourses.FromSql(sql));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_TeacherAppExamData2([FromBody] TeacherExamModel predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""GetTeacherAppExamData2""('{0}','{1}')", predicate.SectionCourseLinkId, predicate.CourseId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherExamDataResponseEx3.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetClassInchargeStudentData([FromBody] TeacherStudentExaminfoaModel predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetClassInchargeallStudentData""('{0}','{1}')", predicate.RollNo, predicate.StaffId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherstudentAttDataResponse.FromSql(sql));
        }

        [Authorize]
        [HttpPost]
        [Route("[action]")]
        public IActionResult Get_SectionTeacherExamDetail([FromBody] ExamCourseParam2 predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""SectionExamTeacherReportEx""('{0}','{1}','{2}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId, predicate.examnames);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetail2.FromSql(sql));
        }


        [HttpPost]
          [Authorize]
        [Route("[action]")]
        public IActionResult Get_SectionStudentExamDetail([FromBody] StudentExamCourseParam predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""GetStudentExamDetails""('{0}','{1}','{2}')", predicate.RollNo, predicate.ExamNames, predicate.CourseId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentExamDetail.FromSql(sql));
        }

        [HttpPost]
          [Authorize]
        [Route("[action]")]
        public IActionResult GetoverallSubjectSchedulData([FromBody] SubjectSchedual predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""GetoverallExamSchedulData""('{0}','{1}','{2}')", predicate.refno, predicate.courseid, predicate.examname);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentExamDataSubjectWise2.FromSql(sql));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult Get_SectionStudentExamDetailNew([FromBody] StudentExamCourseParam predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""GetStudentExamDetailsNew""('{0}','{1}')", predicate.RollNo, predicate.CourseId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentExamDetailNew.FromSql(sql));
        }
        [HttpPost]
          [Authorize]
        [Route("[action]")]
        public IActionResult GetClassInchargeallStudentAttendanceData([FromBody] attndancedata predicate)
        {

            string sql = string.Format(@"select * from ""Attendance"".""GetClassInchargeallStudentAttendanceData""('{0}','{1}')", predicate.refno, predicate.staffid);
            // Console.WriteLine(sql);
            return Ok(this.dbc.ClassInchargeAttendancedata.FromSql(sql));
        }
        [HttpPost]
          [Authorize]
        [Route("[action]")]
        public IActionResult GetClassInchargeStudentAttendanceDataCourseWise([FromBody] attndancedatacoursewise predicate)
        {

            string sql = string.Format(@"select * from ""Attendance"".""GetClassInchargeStudentAttendanceDataCourseWise""('{0}','{1}','{2}')", predicate.refno, predicate.staffid, predicate.monthname);
            // Console.WriteLine(sql);
            return Ok(this.dbc.ClassInchargeAttendancedataCoursewise.FromSql(sql));

        }

        //[AllowAnonymous]
  [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentSearchedData([FromBody] SearchStaff predicate)
        {
            Console.WriteLine("Enter in Function");

            string sql = string.Format(@"select * from ""Examination"".""GetStudentSearchedData""('{0}')", predicate.staffid);
            Console.WriteLine(sql);
            return Ok(this.dbc.StudentExamDataSubjectWise4.FromSql(sql));
        }

        [HttpPost]
          [Authorize]
        [Route("[action]")]
        public IActionResult GetStudentReportTestData([FromBody] SearchStaffwithref predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""StudentInchargeReport""('{0}','{1}')", predicate.refno, predicate.staffid);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentReportExamData.FromSql(sql));
        }
        [HttpPost]
                  [Authorize]

        [Route("[action]")]
        public IActionResult GetTestwiseStudentwiseData([FromBody] Testwisedata predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""TestwiseExamData""('{0}','{1}','{2}')", predicate.refno, predicate.staffid, predicate.examname);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentTestData.FromSql(sql));
        }
        [Authorize]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSec_wise_StudentSearchedData([FromBody] Secwisedata predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""Sec_wise_StudentSearchedData""('{0}','{1}')", predicate.StaffId, predicate.sectioncourselinkid);
            // Console.WriteLine(sql);
            return Ok(this.dbc.SecwiseStudentdata.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherStudentAttAll([FromBody] TeacherStudentExaminfoaModel predicate)
        {

            string sql = string.Format(@"select * from ""Message"".""GetTeacherStudentAttAll""('{0}','{1}')", predicate.RollNo, predicate.StaffId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherstudentAttDataResponse.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherStudentAttMonth([FromBody] TeacherStudentExaminfoaModel1 predicate)
        {
            string sql = string.Format(@"select * from ""Message"".""GetTeacherStudentAttMonth""('{0}','{1}','{2}')", predicate.RollNo, predicate.StaffId, predicate.CourseId);
            // Console.WriteLine(sql);
            var result = this.dbc.TeacherstudentAttDataMonthResponse.FromSql(sql);
            var filterresult = result.Where(e => e.CourseId == predicate.CourseId);
            return Ok(filterresult);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherStudentExaminfo([FromBody] TeacherStudentExaminfoaModel predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherStudentExaminfo""('{0}','{1}')", predicate.RollNo, predicate.StaffId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherStudentExaminfoResponse.FromSql(sql));
        }




        //[AllowAnonymous]
  [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetHodExamallData([FromBody] HodStudentExaminfoaModel predicate)
        {
            string sql = string.Format(@"select * from ""Examination"".""HodExamDataEx""('{0}','{1}')", predicate.Hodid, predicate.classId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.HodStudentExaminfoResponseEx.FromSql(sql));
        }



       // [AllowAnonymous]
  [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetHodExamDatasectionwise([FromBody] HodStudentExaminfoaModel predicate)
        {
            string sql = string.Format(@"select * from ""Examination"".""HodExamDatasectionwiseEx""('{0}','{1}','{2}')", predicate.Hodid, predicate.StaffId, predicate.classId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.HodStudentExaminfoResponse.FromSql(sql));
        }

        // [AllowAnonymous]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [HttpPost]
        [Route("[action]")]
        public IActionResult Get_TeacherExamDataHod([FromBody] AttendenceDataModel predicate)
        {



            string sql = string.Format(@"select * from ""Examination"".""GetTeacherExamDataHod""('{0}','{1}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherExamDataResponseHod.FromSql(sql));
        }


        //[AllowAnonymous]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult Get_TeacherAppExamDataHod([FromBody] AttendenceDataModel predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""GetTeacherAppExamDataHod""('{0}','{1}')", predicate.SectionCourseLinkId, predicate.CourseId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherExamDataResponseHodEx.FromSql(sql));
        }

        //[AllowAnonymous]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult Get_TeacherExamDetailHod([FromBody] ExamCourseParam2 predicate)
        {

            string sql = string.Format(@"select * from ""Examination"".""ExamTeacherReportHod""('{0}','{1}','{2}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId, predicate.examnames);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetailHod.FromSql(sql));
        }





        //[AllowAnonymous]
        [Authorize]
        [IgnoreAntiforgeryToken]

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherExamDetailHod([FromBody] ExamCourseParam predicate)
        {




            string sql = string.Format(@"select * from ""Examination"".""ExamTeacherReportHOdEx""('{0}','{1}','{2}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId, predicate.ExamTypeId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetailHodEx.FromSql(sql));
        }
       // [AllowAnonymous]
         [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherAcdemicSearchApICourse([FromBody] TeacherSearchParam param)
        {
            
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""GetTeacherAccedmiccalenderSearchCourse""  ('{0}')", param.Teacher_ID);
            // string sql = string.Format("select * from \"AcademicCalendar\".\"TeacherApiVW\" where \"st\".\"StaffId\"='{0}'", param.Teacher_ID);
            Console.WriteLine(sql);
            var result = this.dbc.TeacherSearchApiCoursesEx.FromSql(sql).ToList<TeacherSearchApiCoursesEx>();
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (result.Count > 0)
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = result;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found";
            MyDynamic.Data = result;
            return Ok(MyDynamic);
        }


       //[AllowAnonymous]
         [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherCalendarCourseApi([FromBody] TeacherCalendarParamEx param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""TeacherCalendarCourseApiEx"" ('{0}','{1}','{2}','{3}','{4}')", param.Teacher_ID, param.Course_ID, param.ClassID, param.SubCityID,param.SectionCourseLinkId);

            var result = this.dbc.TeacherCourseCalendar.FromSql(sql).ToList<TeacherCourseCalendar>();

            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (result.Count > 0)
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = result;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found";
            MyDynamic.Data = result;
            return Ok(MyDynamic);
        }

        //  [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult InsertTeacherCalendarCourse([FromBody] TeacherCalendarParamEx param)
        // {
        //     //Previou Function Name
        //     //ExamResultStudentApp1
        //     string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""InsertTeacherMarkCourse"" ('{0}','{1}','{2}')", param.Teacher_ID,param.SectionCourseLinkId);

        //     var result = this.dbc.TeacherCourseCalendar.FromSql(sql).ToList<TeacherCourseCalendar>();

        //     dynamic MyDynamic = new System.Dynamic.ExpandoObject();
        //     if (result.Count > 0)
        //     {
        //         MyDynamic.Status = "900";
        //         MyDynamic.Message = "Success";
        //         MyDynamic.Data = result;
        //         return Ok(MyDynamic);
        //     }
        //     MyDynamic.Status = "902";
        //     MyDynamic.Message = "No Data Found";
        //     MyDynamic.Data = result;
        //     return Ok(MyDynamic);
        // }
      //  [AllowAnonymous]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertTeacherCalendarCourse([FromBody] TeacherCalendarParamEx param)
        { 
            var sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""InsertTeacherMarkCourseEx"" ('{0}','{1}','{2}')", param.Teacher_ID,param.SectionCourseLinkId,param.listtopic);

            //var sql = String.Format(@"SELECT * FROM ""Message"".""InsertTeacherResponse""('{0}','{1}')", param.QuestionId, param.Answer);
            Console.WriteLine(sql);
            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var result=connection.Execute(sql);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            return Ok(MyDynamic);

            
        }


    }







}