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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class AttendanceAttendenceMasterController : Controller
    {
        private readonly IAttendanceAttendenceMasterRepository repository;
        private readonly IAttendanceAttendenceMasterVMRepository VMrepository;
        private readonly IUserLogService log;
        private readonly DbContextBase db;
        public AttendanceAttendenceMasterController(IAttendanceAttendenceMasterRepository repository, IUserLogService log, IAttendanceAttendenceMasterVMRepository VMrepository, DbContextBase db)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
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
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetSmartAttendenceBySubCity([FromBody] Predicate predicate)
        {
            var SubcityId = new Guid(predicate.ProvidedString);
            return Ok(this.db.SmartAttendence.FromSql(String.Format("select ffc.* from \"Attendance\".\"GetSmartAttendenceView\"() as ffc  join  \"Attendance\".\"SmartAttendence\" sa  on ffc.\"CampusId\"=sa.\"CampusId\" where ffc.\"SubCityId\"='{0}'", SubcityId)));




        }



        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllSmartAttendence()
        {
            List<SmartAttendence> ls = new List<SmartAttendence>();
            List<SmartAttendence> assigned = new List<SmartAttendence>();
            ls.AddRange(db.SmartAttendence.FromSql(String.Format("select * from \"Attendance\".\"GetSmartAttendenceView\"()")));
            assigned.AddRange(db.SmartAttendence.FromSql(String.Format("select ffc.* from \"Attendance\".\"GetSmartAttendenceView\"() as ffc  join  \"Attendance\".\"SmartAttendence\" sa  on ffc.\"CampusId\"=sa.\"CampusId\"")));

            List<TreeItem> City = new List<TreeItem>();
            foreach (var item in ls)
            {
                if (City.Where(e => e.ID == item.CityId).Count() <= 0)
                {
                    City.Add(new TreeItem() { ID = item.CityId, Caption = item.CityName, IsChecked = false, Children = new List<TreeItem>() });
                    if (assigned.Where(e => e.CityId == item.CityId).Count() > 0)
                    {


                        City[City.Count() - 1].IsChecked = true;
                    }

                }
                List<TreeItem> SubCity = new List<TreeItem>();
                foreach (var subcity in ls.Where(e => e.CityId == item.CityId))
                {

                    if (SubCity.Where(e => e.ID == subcity.SubCityId).Count() <= 0)
                    {
                        SubCity.Add(new TreeItem() { ID = subcity.SubCityId, Caption = subcity.SubCityName, IsChecked = false, Children = new List<TreeItem>() });
                        if (assigned.Where(e => e.SubCityId == item.SubCityId).Count() > 0)
                        {


                            SubCity[SubCity.Count() - 1].IsChecked = true;
                        }


                    }
                    List<TreeItem> Campus = new List<TreeItem>();
                    foreach (var campus in ls.Where(e => e.CityId == item.CityId && e.SubCityId == subcity.SubCityId))
                    {
                        if (Campus.Where(e => e.ID == campus.CampusId).Count() <= 0)
                        {
                            Campus.Add(new TreeItem() { ID = campus.CampusId, Caption = campus.CampusName, IsChecked = false, Children = new List<TreeItem>() });
                            if (assigned.Where(e => e.CampusId == item.CampusId).Count() > 0)
                            {


                                Campus[Campus.Count() - 1].IsChecked = true;
                            }

                        }

                    }
                    SubCity[SubCity.Count - 1].Children = Campus;

                }
                City[City.Count() - 1].Children = SubCity;
            }

            return Ok(City);

        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceApprovalData([FromBody] Predicate predicate)
        {
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceApproval""('{0}','{1}')", date, userid);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendanceApprovalDataVM>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            // var sessionid = new Guid(predicate.ProvidedString.Split("?")[2]);
            // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[3]);

            // return Ok(db.AttendanceApprovalDataVM.Where(s => s.CampusId == campusId && s.Dated == date && s.SessionId == sessionid && s.ProgramDetailId == programDetailId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceApprovalDataRemove([FromBody] Predicate predicate)
        {
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceApprovalRemove""('{0}','{1}')", date, userid);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendanceApprovalDataExVM>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            // var sessionid = new Guid(predicate.ProvidedString.Split("?")[2]);
            // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[3]);

            // return Ok(db.AttendanceApprovalDataVM.Where(s => s.CampusId == campusId && s.Dated == date && s.SessionId == sessionid && s.ProgramDetailId == programDetailId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateBulkRemove([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""ApproveAttendanceRemove""('{0}')", model.ProvidedString);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceApprovalDataEx([FromBody] Predicate predicate)
        {
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceApprovalEx""('{0}','{1}')", date, userid);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendanceApprovalDataExVM>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            // var sessionid = new Guid(predicate.ProvidedString.Split("?")[2]);
            // var programDetailId = new Guid(predicate.ProvidedString.Split("?")[3]);

            // return Ok(db.AttendanceApprovalDataVM.Where(s => s.CampusId == campusId && s.Dated == date && s.SessionId == sessionid && s.ProgramDetailId == programDetailId));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceApprovalExNotification([FromBody] Predicate predicate)
        {
            var userid = Convert.ToInt32(predicate.ProvidedString.Split("?")[0]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var Masterid = new Guid(predicate.ProvidedString.Split("?")[2]);
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""AttendanceApprovalExNotification""('{0}','{1}','{2}')", date, userid, Masterid);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var data = connection.Query<AttendanceApprovalExNotificationVM>(json).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceApprovalTeacher([FromBody] Predicate predicate)
        {

            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var timeTableId = new Guid(predicate.ProvidedString.Split("?")[1]);
            return Ok(db.AttendanceAttendenceMaster.Where(s => s.Dated == date && s.TimeTableId == timeTableId));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMonthlyAttendence([FromBody] Predicate predicate)
        {

            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = string.Format(@"select * from ""Attendance"".""GetAttendenceInfoMonthWiseExDate""('{0}','{1}')", admissionformid, classid);
            return Ok(this.db.AttendenceMonthWise.FromSql(sql));
        }


         [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendencePercentage([FromBody] Predicate predicate)
        {

            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var date = Convert.ToDateTime(predicate.ProvidedString.Split("?")[2]);
            string sql = string.Format(@"select * from ""Attendance"".""GetAttendencePercentage""('{0}','{1}','{2}')", admissionformid, classid,date);
            return Ok(this.db.AttendencePercentages.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMonthlyExam([FromBody] Predicate predicate)
        {

            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = string.Format(@"select * from ""Examination"".""GetExamInfoMonthWiseEx""('{0}','{1}')", admissionformid, classid);
            return Ok(this.db.ExamMonthWiseEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetMonthlyExamUn([FromBody] Predicate predicate)
        {

            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[1]);
            string sql = string.Format(@"select * from ""Examination"".""GetExamInfoMonthWiseUnApprovedEx""('{0}','{1}')", admissionformid, classid);
            return Ok(this.db.ExamMonthWiseEx.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentDetailINfo([FromBody] Predicate predicate)
        {

            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var fromDate = Convert.ToDateTime(predicate.ProvidedString.Split("?")[1]);
            var ToDate = Convert.ToDateTime(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);

            string sql = string.Format(@"select * from ""Attendance"".""AttendanceStudentInfo""('{0}','{1}','{2}','{3}')", admissionformid, fromDate, ToDate, classid);
            return Ok(this.db.AttendanceAttendanceStudentInfo.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertSmartAttendence([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var list = (predicate.ProvidedString);
                var Data = this.log.GetLog();

                string json = String.Format("SELECT \"Attendance\".\"InsertSmartAttendence\"('{0}','{1}') as ProvidedString", list, Data);
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
        public IActionResult CheckClash([FromBody] Predicate model)
        {
            var dated = Convert.ToDateTime(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var sessionId = new string(model.ProvidedString.Split("?")[2]);
            var sectionId = new Guid(model.ProvidedString.Split("?")[3]);
            var classId = new Guid(model.ProvidedString.Split("?")[4]);
            var programDetailId = new Guid(model.ProvidedString.Split("?")[5]);
            var courseId = new Guid(model.ProvidedString.Split("?")[6]);
            var slotTimingId = new Guid(model.ProvidedString.Split("?")[7]);

            var z = this.db.IntModel.FromSql(String.Format("SELECT \"Attendance\".\"val\"('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')", dated, campusId, sessionId, sectionId, classId, programDetailId, courseId, slotTimingId));

            return Ok(z);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateBulk([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            string json = String.Format(@"SELECT * FROM ""Attendance"".""ApproveAttendance""('{0}')", model.ProvidedString);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceMaster).Assembly);
            Expression<Func<AttendanceAttendenceMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceMaster).Assembly);
            Expression<Func<AttendanceAttendenceMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceMaster).Assembly);
            Expression<Func<AttendanceAttendenceMasterVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceMasterVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.VMrepository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByVM([FromBody] Predicate predicate)
        {
            // var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceMaster).Assembly);
            // Expression<Func<AttendanceAttendenceMasterVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceMasterVM, bool>>(predicate.ProvidedString, options));

            var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
            var dated = Convert.ToDateTime(predicate.ProvidedString.Split("?")[4]);

            return Ok(db.AttendanceAttendenceMasterVM.Where(s => s.CampusId == campusId && s.SessionId == sessionid && s.ProgramDetailId == programDetailId && s.ClassId == classId && s.Dated == dated));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceHistory([FromBody] Predicate predicate)
        {
            var dated = Convert.ToDateTime(predicate.ProvidedString.Split("?")[0]);
            var browserInfo = predicate.ProvidedString.Split("?")[1].ToString();

            return Ok(db.VWAttendanceHistory.Where(s => s.Dated == dated && s.BrowserInfo == browserInfo));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAttendanceDevice([FromBody] Predicate predicate)
        {
            var dated = Convert.ToDateTime(predicate.ProvidedString);
            string json = String.Format(@"SELECT  ""Operation""->>'browserInfo' as ""BrowserInfo"", COUNT(*) as ""Count"", ""Dated"" FROM ""Attendance"".""AttendenceMaster"" WHERE ""Dated"" = '{0}' GROUP BY ""Operation""->>'browserInfo', ""Dated""; ", predicate.ProvidedString);
            return Ok(this.db.AttendanceDevice.FromSql(json));

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceMaster).Assembly);
            Expression<Func<AttendanceAttendenceMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] AttendanceAttendenceMaster entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] AttendanceAttendenceMaster entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<AttendanceAttendenceMaster> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<AttendanceAttendenceMaster> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] AttendanceAttendenceMaster entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] AttendanceAttendenceMaster entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] AttendanceAttendenceMaster entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] AttendanceAttendenceMaster entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Attendance.AttendenceMaster"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceMaster).Assembly);
            Expression<Func<AttendanceAttendenceMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceMaster, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(AttendanceAttendenceMaster).Assembly);
            Expression<Func<AttendanceAttendenceMaster, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<AttendanceAttendenceMaster, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}