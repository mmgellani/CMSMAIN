
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
    public class ExaminationFailMasterCriteriaController : Controller
    {
        private readonly IExaminationFailMasterCriteriaRepository repository;
        private readonly IExaminationFailCriteriaRepository repo;

        private readonly ExaminationCampusFailCriteriaMapping CampusFailrepo;

        // private readonly IExaminationExamDetailVMRepository VMrepository;
        private readonly DbContextBase db;

        public ExaminationFailMasterCriteriaController(DbContextBase db)
        {
            // this.repository = repository;
            this.db = db;
            // this.repo = repo;
            // this.CampusFailrepo = CampusFailrepo;

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulkCriteria([FromBody] Predicate predicate)
        {
            var Masterjson = predicate.ProvidedString.Split("?")[0];
            var Detailjson = predicate.ProvidedString.Split("?")[1];

            var query = String.Format(@"Select * from ""Examination"".""AddFailCriteria""('{0}','{1}')", Masterjson, Detailjson);
            IDbConnection connection = db.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult EditBulkCriteria([FromBody] Predicate predicate)
        {
            var Masterjson = predicate.ProvidedString.Split("?")[0];
            var Detailjson = predicate.ProvidedString.Split("?")[1];
            var NewDetailjson = predicate.ProvidedString.Split("?")[2];


            var query = String.Format(@"Select * from ""Examination"".""EditFailCriteria""('{0}','{1}','{2}')", Masterjson, Detailjson, NewDetailjson);
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
            return Ok();

        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFailMaster()
        {

            return Ok(this.db.ExaminationFailMasterCriteria.Where(s => s.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByCampusFailCriteria([FromBody]Predicate predicate)
        {
            try
            {
                var campusProgramId = new Guid(predicate.ProvidedString);

                return Ok(this.db.ExaminationVWCampusFailCriteria.Where(s => s.CampusProgramId == campusProgramId && s.StatusId != 2));

            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ExaminationFailMasterCriteriaController.GetFindByVM()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFailDetailById([FromBody] Predicate predicate)
        {

            return Ok(this.db.ExaminationFailDetailCriteria.Where(s => s.FailMasterId == new Guid(predicate.ProvidedString) && s.StatusId == 1));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteFailDetail([FromBody] ExaminationFailDetailCriteria predicate)
        {

            this.db.ExaminationFailDetailCriteria.Update(predicate);
            return Ok(this.db.SaveChanges());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindBy([FromBody]Predicate predicate)
        {
            try
            {
                var z = this.db.ExaminationFailMasterCriteria.FromSql(String.Format("SELECT * FROM \"Examination\".\"FailMasterCriteria\" where \"StatusId\" = 1"));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ExaminationFailMasterCriteriaController.GetFindByVM()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }
        }
     
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByEx([FromBody]Predicate predicate)
        {
            try
            {
                var z = this.db.ExaminationVWFailMasterCriteria.FromSql(String.Format("SELECT * FROM \"Examination\".\"VWFailMasterCriteria\""));
                return Ok(z);
               
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN ExaminationFailMasterCriteriaController.GetFindByEx()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChangesAsync();
                return BadRequest(app.Message);

            }
        }
        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetFindByVM([FromBody] Predicate predicate)
        // {
        //     var sessionId = new Guid(predicate.ProvidedString.Split("?")[0]);
        //     var campusId = new Guid(predicate.ProvidedString.Split("?")[1]);
        //     var programDetailId = new Guid(predicate.ProvidedString.Split("?")[2]);
        //     var classId = new Guid(predicate.ProvidedString.Split("?")[3]);
        //     var sectionId = new Guid(predicate.ProvidedString.Split("?")[4]);
        //     var courseId = new Guid(predicate.ProvidedString.Split("?")[5]);

        //     return Ok(this.db.ExaminationFailDetailCriteria.Where(s => s.FailMasterId == new Guid(predicate.ProvidedString) && s.StatusId == 1));
        // }


        [HttpGet]
        [Route("[action]")]
        public IActionResult GetFindByVM()
        {
            return Ok(this.repo.All());
        }


    }
}