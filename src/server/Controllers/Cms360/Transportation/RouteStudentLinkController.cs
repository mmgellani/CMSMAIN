
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

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class TransportationRouteStudentLinkController : Controller
    {

        private readonly ITransportationRouteStudentLinkRepository repository;
        private readonly IroutestudentlinkVMRepository VMRepository;

        private readonly IroutestudentlinklistVMRepository VMListRepository;
        private readonly DbContextBase db;

        private readonly IUserLogService log;
        public TransportationRouteStudentLinkController(DbContextBase db, ITransportationRouteStudentLinkRepository repository, IroutestudentlinkVMRepository VMRepository, IroutestudentlinklistVMRepository VMListRepository, IUserLogService log)
        {
            this.repository = repository;
            this.VMRepository = VMRepository;
            this.VMListRepository = VMListRepository;
            this.log = log;
            this.db = db;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetStudentsOfSubCity([FromBody]Predicate predicate)
        {
            var subcityid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(predicate.ProvidedString.Split("?")[1]);
            return Ok(await this.db.StudentSubCityVM.Where(e => e.SubCityId == subcityid && e.SessionId == sessionid).ToListAsync());
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetStudentsOfCampus([FromBody]Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var campusProgramId = new Guid(model.ProvidedString.Split("?")[2]);
            var classId = new Guid(model.ProvidedString.Split("?")[3]);

            string sql = string.Format(@"SELECT * from ""Transportation"".""VWStudentsCampus"" where ""SessionId"" = '{0}' AND ""CampusId"" = '{1}'	AND ""CampusProgramId"" = '{2}' AND ""ClassId"" = '{3}'", sessionId, campusId, campusProgramId, classId);
            // Console.WriteLine(sql);
            return Ok(db.StudentsCampusVM.FromSql(sql));        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.repository.All());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var cityid = new Guid(model.ProvidedString.Split("?")[2]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[3]);
            
             return Ok(this.db.routestudentlinkVM.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subcityid));

           // return Ok(this.VMRepository.FindBy(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subcityid));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulk([FromBody] Predicate model)
        {
             var obj = new Predicate () { ProvidedString = "" };
            var json = model.ProvidedString.Split("?")[0];
            var duedate = model.ProvidedString.Split("?")[1];
            string query = String.Format ("SELECT \"Transportation\".\"InsertTransportChallan\"('{0}','{1}') as ProvidedString", json, duedate);

             Console.WriteLine(query);
             IDbConnection connection = db.Database.GetDbConnection();
            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();

            //     var result = connection.Execute(query);
            //     if (connection.State == ConnectionState.Open)
            //     {
            //         connection.Close();
            //         connection.Dispose();
            //     }
            // return Ok(result);
            if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (query).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            //  return Ok(this.VMRepository.FindBy(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subcityid));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetRouteStudent([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var cityid = new Guid(model.ProvidedString.Split("?")[2]);
            var subcityid = new Guid(model.ProvidedString.Split("?")[3]);
            
            return Ok(this.db.routestudentlinklistVM.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subcityid));

            //return Ok(this.VMListRepository.FindBy(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.CityId == cityid && s.SubCityId == subcityid));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetRouteStudentList([FromBody] Predicate model)
        {
            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            var campusProgramId = new Guid(model.ProvidedString.Split("?")[2]);
            var classId = new Guid(model.ProvidedString.Split("?")[3]);
            string sql = string.Format(@"SELECT * from ""Transportation"".""VWRouteStudentLinkEx"" where ""SessionId"" = '{0}' AND ""CampusId"" = '{1}'	AND ""CampusProgramId"" = '{2}' AND ""ClassId"" = '{3}'", sessionId, campusId, campusProgramId, classId);
            // Console.WriteLine(sql);
            return Ok(db.RouteStudentLinkEx.FromSql(sql));
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
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteStudentLink).Assembly);
            Expression<Func<TransportationRouteStudentLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteStudentLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteStudentLink).Assembly);
            Expression<Func<TransportationRouteStudentLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteStudentLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteStudentLink).Assembly);
            Expression<Func<TransportationRouteStudentLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteStudentLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteStudentLink).Assembly);
            Expression<Func<TransportationRouteStudentLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteStudentLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]TransportationRouteStudentLink entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]TransportationRouteStudentLink entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<TransportationRouteStudentLink> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<TransportationRouteStudentLink> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]TransportationRouteStudentLink entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]TransportationRouteStudentLink entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]TransportationRouteStudentLink entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]TransportationRouteStudentLink entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Transportation.RouteStudentLink"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteStudentLink).Assembly);
            Expression<Func<TransportationRouteStudentLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteStudentLink, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(TransportationRouteStudentLink).Assembly);
            Expression<Func<TransportationRouteStudentLink, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<TransportationRouteStudentLink, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}