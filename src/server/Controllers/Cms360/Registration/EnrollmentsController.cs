
using System.Runtime.InteropServices;
using System.Xml.Serialization;
using System.Drawing;
using System.ComponentModel;
using System.Dynamic;
using Microsoft.VisualBasic.CompilerServices;
using System.Diagnostics;
using System.Globalization;
using System.Runtime.CompilerServices;
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
using Cms360.Contract;


namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class RegistrationEnrollmentsController : Controller
    {
        private readonly IRegistrationEnrollmentsRepository repository;
        private readonly IRegistrationSectionCourseLinkVMRepository repo;
        private readonly List<RegistrationSectionCourseLinkVMModel> tempList;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly DbContextBase db;
        private readonly IUserLogService log;

        public RegistrationEnrollmentsController(IRegistrationEnrollmentsRepository repository, DbContextBase db, IDomainContextResolver Resolver, IUserLogService log, IRegistrationSectionCourseLinkVMRepository repo)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;
            this.Resolver = Resolver;
            this.repo = repo;
            tempList = new List<RegistrationSectionCourseLinkVMModel>();
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
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
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationEnrollments).Assembly);
            Expression<Func<RegistrationEnrollments, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationEnrollments, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetStudentEnrollData()
        {


            return Ok(this.db.RegistrationEnrollments.FromSql(String.Format("select * from \"Registration\".\"Enrollments\"  where \"StatusId\"= 1")));

        }

        [HttpPost]
        [Route("[action]")]

        // var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
        // var challanNo = new string(model.ProvidedString.Split("?")[1]);
        public IActionResult GetStudentsToEnroll([FromBody] Predicate predicate)
        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var admissiontypeid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var genderid = new Guid(predicate.ProvidedString.Split("?")[3]);
            return Ok(db.StudentToEnrollVM.Where(s => s.CampusProgramId == campusprogramid && s.ClassId == classid && s.AdmissionTypeId == admissiontypeid && s.GenderId == genderid && s.StatusId == 1).ToList());
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckEnrolledStudentExist([FromBody] Predicate model)

        {
            var studentcnic = new string(model.ProvidedString.Split("?")[0]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);

            string json = String.Format(@"select * from ""Admission"".""CheckStudentAlreadyEnrolled""('{0}','{1}','{2}')", studentcnic, programdetailid, classid);
            Console.WriteLine(json);
            return Ok(this.db.EnrolledStudentResultModel.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]

        // var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
        // var challanNo = new string(model.ProvidedString.Split("?")[1]);
        public IActionResult GetStudentsToBatchEnroll([FromBody] Predicate predicate)
        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var admissiontypeid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var genderid = new Guid(predicate.ProvidedString.Split("?")[3]);
            return Ok(db.StudentsToEnrolledPercentageVM.Where(s => s.CampusProgramId == campusprogramid && s.ClassId == classid && s.AdmissionTypeId == admissiontypeid && s.GenderId == genderid && s.StatusId == 1).OrderByDescending(s => s.Percentage).ToList());
        }

        [HttpPost]
        [Route("[action]")]

        // var Admissionform = new Guid(model.ProvidedString.Split("?")[0]);
        // var challanNo = new string(model.ProvidedString.Split("?")[1]);
        public IActionResult GetStudentsToEnrollWithoutPaid([FromBody] Predicate predicate)
        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var admissiontypeid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var genderid = new Guid(predicate.ProvidedString.Split("?")[3]);
            return Ok(db.ToEnrollWithoutPaidVM.Where(s => s.CampusProgramId == campusprogramid && s.ClassId == classid && s.AdmissionTypeId == admissiontypeid && s.GenderId == genderid && s.StatusId == 1).ToList());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsByEnrollment([FromBody] Predicate predicate)
        {
            var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);

            return Ok(db.StudentEnrolledVM.Where(s => s.SessionId == sessionId && s.CampusId == campusId && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.SectionId == sectionId && s.StatusId == 1).ToList());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentsBySection([FromBody] Predicate predicate)
        {

            var sectionCourseLinkId = new Guid(predicate.ProvidedString);

            return Ok(db.StudentEnrolledVM.Where(s => s.SectionCourseLinkId == sectionCourseLinkId && s.StatusId == 1).ToList());
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertBulkEnrolment([FromBody] Predicate predicate)
        {
            // // Console.WriteLine(predicate.ProvidedString);
            IDbConnection connection = db.Database.GetDbConnection();
            var data = this.log.GetLog();

            string json = String.Format("SELECT \"Registration\".\"EnrollmentBulk\"('{0}','{1}') as val", predicate.ProvidedString, data);
            Console.WriteLine(json);

            // var count= db.IntModel.FromSql(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var count = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(count);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertBulkEnrolmentWithUserCreation([FromBody] Predicate predicate)
        {
            // // Console.WriteLine(predicate.ProvidedString);
            IDbConnection connection = db.Database.GetDbConnection();
            var data = this.log.GetLog();

            string json = String.Format("SELECT \"Registration\".\"EnrollmentBulkEx\"('{0}','{1}',{2}) as val", predicate.ProvidedString.Split("?")[0], data, Convert.ToInt32(predicate.ProvidedString.Split("?")[1]));
            Console.WriteLine(json);

            // var count= db.IntModel.FromSql(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var count = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(count);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertBulkEnrolmentEx([FromBody] Predicate predicate)
        {
            // // Console.WriteLine(predicate.ProvidedString);
            IDbConnection connection = db.Database.GetDbConnection();
            var data = this.log.GetLog();

            string json = String.Format("SELECT \"Registration\".\"EnrollmentBulkEx\"('{0}','{1}',{2}) as val", predicate.ProvidedString, data, 1);
            Console.WriteLine(json);

            // var count= db.IntModel.FromSql(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var count = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(count);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertClassPromotion([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var Data = this.log.GetLog();


            string json = string.Format("SELECT \"Registration\".\"InsertClassPromotion\"('{0}','{1}','{2}') as \"ReturnValue\" ", list, classid, Data);
            // Console.WriteLine (json);
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
        public IActionResult InsertClassPromotionEx([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var Data = this.log.GetLog();


            string json = string.Format("SELECT \"Registration\".\"InsertClassPromotionEx\"('{0}','{1}','{2}', '{3}') as \"ReturnValue\" ", list, classid, Data, campusProgramId);
            // Console.WriteLine (json);
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
        public IActionResult InsertTransferBulckCampus([FromBody] Predicate predicate)
        {

            var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var campusProgramId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var campusid = new Guid(predicate.ProvidedString.Split("?")[3]);

            var Data = this.log.GetLog();


            string json = string.Format("SELECT \"Registration\".\"InsertTransferBulckCampus\"('{0}','{1}','{2}', '{3}','{4}') as \"ReturnValue\" ", list, classid, Data, campusProgramId,campusid);
            // Console.WriteLine (json);
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
        public IActionResult InsertClassPrePromotion([FromBody] Predicate predicate)
        {

            // var obj = new RTV() { ReturnValue = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var Data = this.log.GetLog();


            string json = string.Format("SELECT \"Registration\".\"InsertClassPrePromotion\"('{0}','{1}','{2}') as \"val\" ", list, classid, Data);
            Console.WriteLine(json);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var count = connection.Query<IntModel>(json).FirstOrDefault().val;             //connection.Execute (json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(count);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEnrolledStudent([FromBody] Predicate predicate)
        {
            //var query = String.Format(@"SELECT * FROM ""Registration"".""VWStudentEnrolled"" WHERE concat(LOWER(""RollNo""),LOWER(""RefferenceNo"")) LIKE '%'||LOWER('{0}')||'%'", predicate.ProvidedString);
            var searchtext = (predicate.ProvidedString.Split("?")[0]);
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);
            var query = String.Format(@"SELECT * FROM ""Registration"".""getEnrolledStudentList"" ('{0}',{1})", searchtext, userid);
            // Console.WriteLine(query);
            return Ok(this.db.StudentEnrolledVM.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetEnrolledStudentVM([FromBody] Predicate predicate)

        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectionCourseLinkid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var query = String.Format(@"SELECT * FROM ""Registration"".""VWStudentEnrolled"" WHERE ""CampusProgramId"" = '{0}' and ""ClassId"" = '{1}' and ""SectionCourseLinkId"" = '{2}'  ORDER BY ""RollNo""", campusprogramid, classid, sectionCourseLinkid);
            return Ok(this.db.StudentEnrolledVM.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentPromotionList([FromBody] Predicate predicate)

        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectionCourseLinkid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var flag = Convert.ToInt32(predicate.ProvidedString.Split("?")[3]);
            var transferid = new Guid(predicate.ProvidedString.Split("?")[4]);
            var query = String.Format(@"select * from ""Registration"".""GetClassPromotionList""('{0}','{1}','{2}',{3},'{4}')", campusprogramid, classid, sectionCourseLinkid, flag, transferid);
            return Ok(this.db.StudentPromotionList.FromSql(query));
        }
                [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentBulckTransferList([FromBody] Predicate predicate)

        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectionCourseLinkid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var flag = Convert.ToInt32(predicate.ProvidedString.Split("?")[3]);
            var transferid = new Guid(predicate.ProvidedString.Split("?")[4]);
            var query = String.Format(@"select * from ""Registration"".""GetStudentBulckTransferList""('{0}','{1}','{2}',{3},'{4}')", campusprogramid, classid, sectionCourseLinkid, flag, transferid);
            return Ok(this.db.StudentPromotionList.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentPromotionPreList([FromBody] Predicate predicate)

        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectionCourseLinkid = new Guid(predicate.ProvidedString.Split("?")[2]);
            var query = String.Format(@"select * from ""Registration"".""GetClassPromotionList""('{0}','{1}','{2}')", campusprogramid, classid, sectionCourseLinkid);
            return Ok(this.db.StudentPromotionPreList.FromSql(query));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateScetion([FromBody] Predicate predicate)

        {
            IDbConnection connection = db.Database.GetDbConnection();

            var enrollmentId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var sectionCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var data = this.log.GetLog();
            string query = String.Format(@"select * from ""Registration"".""SectionChange""('{0}','{1}','{2}')", enrollmentId, sectionCourseLinkId, data);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);


            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(true);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateScetionBulk([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {

                IDbConnection connection = db.Database.GetDbConnection();
                var list = (predicate.ProvidedString.Split("?")[0]);
                var sectionCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[1]);
                var logs = this.log.GetLog();




                string json = String.Format("SELECT \"Registration\".\"SectionChangeBulk\"('{0}','{1}','{2}') as ProvidedString", list, sectionCourseLinkId, logs);
                Console.WriteLine(json);

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
        public IActionResult ReverseEnrollment([FromBody] Predicate predicate)
        {
            var log = this.log.GetLog();
            var obj = new Predicate() { ProvidedString = "" };

            var query = String.Format(@"Select ""Registration"".""DeleteEnrollment""('{0}','{1}') as ProvidedString", predicate.ProvidedString, log);
            Console.WriteLine(query);
            IDbConnection connection = db.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ProvidedString = connection.Query<Predicate>(query).FirstOrDefault().ProvidedString;

            //  var count = connection.Query<IntModel>(json).FirstOrDefault().val;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(obj.ProvidedString);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSectionList([FromBody] Predicate predicate)
        {
            var campusprogramid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var z = this.db.IntModel.FromSql(String.Format("select Count(*) as val from \"Role\".\"AllowUsers\"  Where \"UserId\"={0} ", DomainContext.User.UserId)).FirstOrDefault();

            if (z.val > 0)
            {
                var list = db.RegistrationSectionCourseLinkVMModel.FromSql(string.Format(@"Select * from ""Registration"".""VWSectionCourseViaSession""  where ""CampusProgramId""='{0}' and ""ClassId""='{1}'", campusprogramid, classid)).ToList();
                if (list.Count > 0)
                {
                    var oldObj = list[0];
                    tempList.Add(oldObj);
                    foreach (var v in list)
                    {
                        if (v.SectionId != oldObj.SectionId)
                        {
                            tempList.Add(v);
                        }
                        oldObj = v;
                    }
                    return Ok(tempList.OrderBy(e => e.SectionName));
                }
                else return Ok(null);

            }
            else
            {

                var list = db.RegistrationSectionCourseLinkVMModel.FromSql(string.Format(@"Select * from ""Registration"".""VWSectionCourseViaSession""  where ""CampusProgramId""='{0}' and ""ClassId""='{1}' and ""SectionCourseLinkId""
		 in (SELECT (jsonb_array_elements(""AllowedSection"")->>'id')::uuid FROM ""Role"".""SectionRightLink"" WHERE ""UserId"" = {2})", campusprogramid, classid, DomainContext.User.UserId)).ToList();
                if (list.Count > 0)
                {
                    var oldObj = list[0];
                    tempList.Add(oldObj);
                    foreach (var v in list)
                    {
                        if (v.SectionId != oldObj.SectionId)
                        {
                            tempList.Add(v);
                        }
                        oldObj = v;
                    }
                    return Ok(tempList.OrderBy(e => e.SectionName));
                }
                else return Ok(null);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationEnrollments).Assembly);
            Expression<Func<RegistrationEnrollments, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationEnrollments, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationEnrollments).Assembly);
            Expression<Func<RegistrationEnrollments, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationEnrollments, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationEnrollments).Assembly);
            Expression<Func<RegistrationEnrollments, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationEnrollments, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] RegistrationEnrollments entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] RegistrationEnrollments entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<RegistrationEnrollments> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<RegistrationEnrollments> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] RegistrationEnrollments entity)
        {
            this.repository.Update(entity);
            string data = JsonConvert.SerializeObject(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] RegistrationEnrollments entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] RegistrationEnrollments entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] RegistrationEnrollments entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Registration.Enrollments"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationEnrollments).Assembly);
            Expression<Func<RegistrationEnrollments, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationEnrollments, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RegistrationEnrollments).Assembly);
            Expression<Func<RegistrationEnrollments, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RegistrationEnrollments, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}