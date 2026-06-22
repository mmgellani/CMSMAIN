
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
using Npgsql;


namespace Cms360.UI.Controllers.Account {
    [Route ("api/[controller]")]
    [ServiceFilter (typeof (Server.Filters.ApiResultFilter))]
    [ServiceFilter (typeof (Server.Filters.ApiExceptionFilter))]
    [ServiceFilter (typeof (Server.Filters.IdentityMappingFilter))]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    public class HumanResourceStaffController : Controller {
        private readonly IHumanResourceStaffRepository repository;
        private readonly IHumanResourceStaffRepositoryVM repositoryVM;
        private readonly DbContextBase db;
        private readonly IUserLogService log;
        private ICryptoService crypto;
        private static string ELDbString = "Host=eldbflexible.postgres.database.azure.com;Port=5432;User ID=emseducation;Password=RUy368FhdvYN7jPFKY9F#vVGNVpwZfUS9NkV4zWr3RS5gQru#Z;Database=Elp;Pooling=true;";


        public HumanResourceStaffController (IUserLogService log, IHumanResourceStaffRepository repository, IHumanResourceStaffRepositoryVM repositoryVM, ICryptoService crypto, DbContextBase db) {
            this.repository = repository;
            this.repositoryVM = repositoryVM;
            this.crypto = crypto;
            this.log = log;
            this.db = db;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T> (Func<T, bool> f) {
            return x => f (x);
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult ChangePassword ([FromBody] Predicate model) {
            UserProvider up = new UserProvider ();
            var username = model.ProvidedString.Split ("?") [0];
            var oldpassword = model.ProvidedString.Split ("?") [1];
            var newpassword = model.ProvidedString.Split ("?") [2];

            UserProviderLocal login = this.db.LocalProvider.Where (o => o.User.Username == username).FirstOrDefault ();

            if (login != null)

            {
                if (this.crypto.CheckKey (login.PasswordHash, login.PasswordSalt, oldpassword)) {
                    var salt = this.crypto.CreateSalt ();
                    var key = this.crypto.CreateKey (salt, newpassword);
                    up.UserId = login.UserId;
                    up.ExternalId = login.ExternalId;
                    // up.
                    // this.db.UserProvider.Update(UserProviderLocal);
                    IDbConnection connection = db.Database.GetDbConnection ();

                    //  string json = String.Format("Update \"Role\".\"UserProvider\" set \"PasswordSalt\" '{0}' and \"PasswordHash\" '{1}'", salt, key);
                    if (connection.State == ConnectionState.Closed)
                        connection.Open ();
                    //"Update \"Role\".\"UserProvider\" set \"PasswordSalt\"='"+salt+"' and \"PasswordHash\"='"+key+"'"
                    connection.Execute ("Update \"Role\".\"UserProvider\" set \"PasswordSalt\"='" + salt + "' , \"PasswordHash\"='" + key + "'  where \"UserId\"=" + login.UserId);
                    // this.db.UserProvider.FromSql("Update \"Role\".\"UserProvider\" set \"PasswordSalt\"='"+salt+"' \"PasswordHash\"='"+key+"'");

                    if (connection.State == ConnectionState.Open) {
                        connection.Close ();
                        connection.Dispose ();
                    }

                } else {
                    return Ok ("Incorrect Password");
                }
            } else {
                return Ok ("User does not exist");
            }

            return Ok ("Changed Successfully");
            //return Ok(this.repository.Update(entity));
        }
         [HttpPost]
        [Route ("[action]")]
        
        public IActionResult GetStaffCourseDepVM ([FromBody] Predicate predicate) {
        var staffId = new Guid (predicate.ProvidedString);

        // var data=  this.db.StaffCourseDeptVM.Where(s=>s.StaffId==staffId);

            string json = String.Format (@"SELECT * from ""HumanResource"".""VWStaffCourseDepartment"" where ""StaffId""='{0}'", staffId);
            

            Console.WriteLine (json);
        var data= this.db.StaffCourseDeptVM.FromSql (json);
            return Ok (data);
        }
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherProfile([FromBody] Predicate model)
        {
            var filterString = model.ProvidedString.Split("?")[0];
            var userId = Convert.ToInt32(model.ProvidedString.Split("?")[1]);

            string sql = String.Format(@"SELECT * FROM ""Admission"".""TeacherProfile""('{0}',{1})", filterString, userId);
            return Ok(this.db.TeacherProfileList.FromSql(sql));

        }


          [HttpPost]
        [Route("[action]")]
        public IActionResult GetStaffByCampus([FromBody] Predicate predicate)
        {
            var campusid = new Guid (predicate.ProvidedString.Split ("?") [0]);
            string sql = String.Format(@"SELECT * FROM ""Role"".""GetCampusWiseStaff""('{0}')", campusid);
            return Ok(this.db.StaffByCampus.FromSql(sql));
        }


        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetStaffHODData ([FromBody] Predicate predicate) {
            var campusprogramid = new Guid (predicate.ProvidedString.Split ("?") [0]);

            var classid = new Guid (predicate.ProvidedString.Split ("?") [1]);
            var courseid = new Guid (predicate.ProvidedString.Split ("?") [2]);

            string json = String.Format (@"SELECT * from ""HumanResource"".""GetStffdata""('{0}','{1}','{2}')", campusprogramid, classid, courseid);

            // Console.WriteLine (json);

            return Ok (this.db.StaffHODData.FromSql (json));
        }
          [HttpGet]
        [Route ("[action]")]
        public IActionResult GetEvaluationData () {
          
            string json = String.Format (@"SELECT * from ""HumanResource"".""EvaluationMaster"" where ""StatusId""=1");

             Console.WriteLine (json);

            return Ok (this.db.EvaluationMaster.FromSql (json));
        }
          [HttpPost]
        [Route ("[action]")]
        public IActionResult GetEvalutionDetail ([FromBody] Predicate predicate) {
             var evaluationid = new Guid (predicate.ProvidedString);
          
            string json = String.Format (@"SELECT * from ""HumanResource"".""GetEvaluatoinDetail"" ('{0}')", evaluationid);

             Console.WriteLine (json);

            return Ok (this.db.EvaluationDetail.FromSql (json));
        }


        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetHODData ([FromBody] Predicate predicate) {
            var campusprogramid = new Guid (predicate.ProvidedString.Split ("?") [0]);
            var programdetailid = new Guid (predicate.ProvidedString.Split ("?") [1]);
            var courseid = new Guid (predicate.ProvidedString.Split ("?") [2]);
            var classid = new Guid (predicate.ProvidedString.Split ("?") [3]);

            string json = String.Format (@"SELECT * from ""HumanResource"".""GetHodData""('{0}','{1}','{2}','{3}')", campusprogramid, programdetailid, courseid, classid);

            // Console.WriteLine (json);

            return Ok (this.db.StaffHODData.FromSql (json));
        }
        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetHODDataEx ([FromBody] Predicate predicate) {
            var campusprogramid = new Guid (predicate.ProvidedString.Split ("?") [0]);
            var programdetailid = new Guid (predicate.ProvidedString.Split ("?") [1]);
            var courseid = new Guid (predicate.ProvidedString.Split ("?") [2]);
            var classid = new Guid (predicate.ProvidedString.Split ("?") [3]);

            string json = String.Format (@"SELECT * from ""HumanResource"".""GetHodData""('{0}','{1}','{2}','{3}')", campusprogramid, programdetailid, courseid, classid);

            // Console.WriteLine (json);

            return Ok (this.db.StaffHODData.FromSql (json));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult InsertStaffHODData ([FromBody] Predicate predicate) {
            var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
                var list = (predicate.ProvidedString.Split ("?") [0]);
                var campusprogramid = new Guid (predicate.ProvidedString.Split ("?") [1]);
                var programdetailid = new Guid (predicate.ProvidedString.Split ("?") [2]);
                var courseid = new Guid (predicate.ProvidedString.Split ("?") [3]);
                var classid = new Guid (predicate.ProvidedString.Split ("?") [4]);

                string json = String.Format ("SELECT \"HumanResource\".\"InsertHodData\"('{0}','{1}','{2}','{3}','{4}') as ProvidedString", list, campusprogramid, programdetailid, courseid, classid);
                // Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }

        }
         [HttpPost]
        [Route ("[action]")]
        public IActionResult InsertEvaluationData([FromBody] Predicate predicate) {
            var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
                var detaillist = (predicate.ProvidedString.Split ("?") [0]);
                var master =  (predicate.ProvidedString.Split ("?") [1]);
                var ope = Convert.ToInt32(predicate.ProvidedString.Split ("?") [2]);
                var Data=this.log.GetLog();
                
                string json = String.Format ("SELECT \"HumanResource\".\"InsertEvaluationData\"('{0}','{1}','{2}',{3}) as ProvidedString", master, detaillist, Data,ope);
                 Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }

        }
 [HttpPost]
        [Route ("[action]")]
        public IActionResult DeleteTeacherEvaluation([FromBody] Predicate predicate) {
            var obj = new Predicate () { ProvidedString = "" };
               try {
                IDbConnection connection = db.Database.GetDbConnection ();
                var masterid = new Guid(predicate.ProvidedString);
               
                var Data=this.log.GetLog();
                
                string json = String.Format ("SELECT \"HumanResource\".\"DeleteEvaluationData\"('{0}','{1}') as ProvidedString", masterid, Data);
                 Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }
           


        }


        [HttpPost]
        [Route ("[action]")]
        public IActionResult DeleteStaffHODData ([FromBody] Predicate predicate) {
            var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
                var staffid = new Guid (predicate.ProvidedString.Split ("?") [0]);

                string json = String.Format ("SELECT \"HumanResource\".\"DeleteHodData\"('{0}') as ProvidedString", staffid);
                // Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }

        }

        [HttpGet]
        [Route ("[action]")]
        public IActionResult GetAll () {
            return Ok (this.repository.All ());
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetFindByVM ([FromBody] Predicate model) {
            var cityid = new Guid (model.ProvidedString.Split ("?") [0]);
            
            return Ok (this.db.HumanResourceStaff.Where (s => s.CityId == cityid && s.StatusId != 2));
            //return Ok (this.repository.FindBy (s => s.CityId == cityid && s.StatusId != 2));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetAllVM ([FromBody] Predicate predicate) {
            var id = Convert.ToInt32 (predicate.ProvidedString);
            
            return Ok (this.db.ProfileStaff.Where (s => s.UserId == id));
            // return Ok (this.repositoryVM.FindBy (s => s.UserId == id));
        }

        [HttpGet]
        [Route ("[action]")]
        public async Task<IActionResult> GetAllAsync () {
            return Ok (await this.repository.AllAsync ());
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetSingle ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (HumanResourceStaff).Assembly);
            Expression<Func<HumanResourceStaff, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<HumanResourceStaff, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.Single (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetSingleAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (HumanResourceStaff).Assembly);
            Expression<Func<HumanResourceStaff, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<HumanResourceStaff, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.SingleAsync (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetFindBy ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (HumanResourceStaff).Assembly);
            Expression<Func<HumanResourceStaff, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<HumanResourceStaff, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.FindBy (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult GetStaff ([FromBody] Predicate model) {

            
             return Ok (this.db.HumanResourceStaff.Where (s => s.CityId == new Guid (model.ProvidedString) && s.StatusId == 1));
        
           // return Ok (this.repository.FindBy (s => s.CityId == new Guid (model.ProvidedString) && s.StatusId == 1));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> GetFindByAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (HumanResourceStaff).Assembly);
            Expression<Func<HumanResourceStaff, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<HumanResourceStaff, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.FindByAsync (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult AddOne ([FromBody] Predicate predicate) {
             var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
                var list = (predicate.ProvidedString.Split ("?") [0]);
                 var ope = Convert.ToInt32(predicate.ProvidedString.Split ("?") [1]);
                 var email=(predicate.ProvidedString.Split ("?") [2]);
                 var flag=(predicate.ProvidedString.Split ("?") [3]);
                 var Data = this.log.GetLog();
               

                string json = String.Format ("SELECT \"HumanResource\".\"StaffInsertion\"('{0}',{1},'{2}') as ProvidedString", list,ope,Data);
                 Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }


                 var connection2 = new NpgsqlConnection(ELDbString);
            if (connection2.State == ConnectionState.Closed)
                connection2.Open();
            if(flag=="1")
            connection2.Execute($"INSERT INTO \"Users\"(\"UserId\", \"RoleId\", \"UserName\", \"Password\", \"Varification\", \"IsEnable\", \"Batch\") VALUES (uuid_generate_v4(), '69830c49-30ba-4d1e-ad06-bca0de2fb66a', '{email}', 'P@kist0n', '0', 1, 0);");

            if (connection2.State == ConnectionState.Open)
                connection2.Close();
            connection2.Dispose();

            return Ok(true);

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }

            // using (var trans = this.db.Database.BeginTransaction ()) {
            //     var checkUser = this.db.HumanResourceStaff.FirstOrDefaultAsync (e => e.Email == entity.Email || e.CNIC == entity.CNIC).Result;
            //     if (checkUser != null) {
            //         return Ok (false);
            //     }
                // entity.SubCityId = null;
                // this.db.Add (entity);
                // this.db.SaveChanges ();
                // this.log.Insert (JsonConvert.SerializeObject (entity), "Insert", "HumanResource.Staff");

                // IDbConnection connection = db.Database.GetDbConnection ();
                // var id = entity.StaffId;

                // string json = String.Format ("SELECT \"Role\".\"CreateUserName\"('{0}','{1}')", id, "E");
                // this.db.Database.ExecuteSqlCommand (json);
                // this.db.SaveChanges ();

                // if (connection.State == ConnectionState.Closed)
                //     connection.Open();
                // connection.Execute(json);
                // if (connection.State == ConnectionState.Open)
                // {
                //     connection.Close();
                //     connection.Dispose();
                // }

                //trans.Commit ();
               
            

        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> AddOneAsync ([FromBody] HumanResourceStaff entity) {

            await this.repository.AddAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Insert Async", "HumanResource.Staff"));
        }


      [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckTeacherExist([FromBody] Predicate model)

        {
            var staffid = string.IsNullOrEmpty(model.ProvidedString.Split("?")[0])?Guid.NewGuid():new Guid(model.ProvidedString.Split("?")[0]);

            var email = new string(model.ProvidedString.Split("?")[1]);


            string json = String.Format(@"select * from ""HumanResource"".""CheckStaffAlreadyexist""('{0}','{1}')",staffid,email);

             Console.WriteLine(json);
            return Ok(this.db.Teacherexistmodel.FromSql(json));
        }

      [HttpPost]
        [Route ("[action]")]
        public IActionResult UpMicroPass ([FromBody] Predicate predicate) {
             var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
               
            

                string json = String.Format ("SELECT \"HumanResource\".\"UpdMicropass\"('{0}') as ProvidedString",predicate.ProvidedString);
                // Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }

        }



        [HttpPost]
        [Route ("[action]")]
        public IActionResult AddMany ([FromBody] IEnumerable<HumanResourceStaff> entities) {

            this.repository.AddAll (entities);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entities), "Insert Multi", "HumanResource.Staff"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> AddManyAsync ([FromBody] IEnumerable<HumanResourceStaff> entities) {

            await this.repository.AddAllAsync (entities);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entities), "Insert Multi Async", "HumanResource.Staff"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult Update ([FromBody] HumanResourceStaff entity) {

            this.repository.Update (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Update", "HumanResource.Staff"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> UpdateAsync ([FromBody] HumanResourceStaff entity) {

            await this.repository.UpdateAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Update Async", "HumanResource.Staff"));
        }

        [HttpPost]
        [Route ("[action]")]
        public IActionResult Delete ([FromBody] HumanResourceStaff entity) {

            this.repository.Delete (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Delete", "HumanResource.Staff"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteAsync ([FromBody] HumanResourceStaff entity) {

            await this.repository.DeleteAsync (entity);
            return Ok (this.log.Insert (JsonConvert.SerializeObject (entity), "Delete Async", "HumanResource.Staff"));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteWhere ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (HumanResourceStaff).Assembly);
            Expression<Func<HumanResourceStaff, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<HumanResourceStaff, bool>> (predicate.ProvidedString, options));

            return Ok (this.repository.DeleteWhere (discountFilterExpression));
        }

        [HttpPost]
        [Route ("[action]")]
        public async Task<IActionResult> DeleteWhereAsync ([FromBody] Predicate predicate) {
            var options = ScriptOptions.Default.AddReferences (typeof (HumanResourceStaff).Assembly);
            Expression<Func<HumanResourceStaff, bool>> discountFilterExpression = FuncToExpression (await CSharpScript.EvaluateAsync<Func<HumanResourceStaff, bool>> (predicate.ProvidedString, options));

            return Ok (await this.repository.DeleteWhereAsync (discountFilterExpression));
        }
    }
}