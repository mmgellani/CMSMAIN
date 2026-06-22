
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

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using Dapper;
using Cms360.Contract;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class RolePrevilagesController : Controller
    {
        private readonly IRolePrevilagesRepository repository;
        //private readonly IUserroleRepository  repo;
        private readonly DbContextBase db;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private long ContextUserId = 0;
        private readonly IUserLogService log;

        public RolePrevilagesController(IUserLogService log, IRolePrevilagesRepository repository, DbContextBase db, IDomainContextResolver Resolver)
        {
            this.repository = repository;
            //this.repo=repo;
            this.db = db;
            this.Resolver = Resolver;
            this.log = log;
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



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAll([FromBody] Predicate model)
        {
            //return Ok(db.RoleAssignedList.FromSql("SELECT * FROM \"Role\".\"GetAllRoles\"()"));
            return Ok(db.PrevilagesData.FromSql(String.Format("select * from \"Role\".\"GetPrevilagesData\"({0})", model.ProvidedString)));

        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllSectionPrevileges([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();

            var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
            var campusId = new Guid(model.ProvidedString.Split("?")[1]);
            // var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var userid = Convert.ToInt32(model.ProvidedString.Split("?")[2]);
            var query = String.Format(@"SELECT * FROM ""Role"".""GetSectionPreviliges""({0},'{1}','{2}')", userid, campusId, sessionId);
            // Console.WriteLine(query);
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            var data = connection.Query<SectionCampusVM>(query).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(data);
            //return Ok(this.db.RegistrationSectionCourseLinkVM.Where(s => s.CampusId == campusId && s.SessionId == sessionId).ToListAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddSectionRightLink([FromBody] SectionRightLink model)
        {
            this.db.Database.ExecuteSqlCommand(@"Delete from ""Role"".""SectionRightLink"" where ""UserId""='" + model.UserId + "'");
            this.db.SectionRightLink.Add(model);
            return Ok(this.db.SaveChanges());
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMaskRightLink([FromBody] MaskRightLink model)
        {
            this.db.Database.ExecuteSqlCommand(@"Delete from ""Role"".""MaskRightLink"" where ""UserId""='" + model.UserId + "'");
            this.db.MaskRightLink.Add(model);
            return Ok(this.db.SaveChanges());
        }

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult GetAllSectionPrevileges([FromBody]Predicate model)
        // {
        //     var sessionId = new Guid(model.ProvidedString.Split("?")[0]);
        //     var campusId = new Guid(model.ProvidedString.Split("?")[1]);
        //     return Ok(this.db.RegistrationSectionCourseLinkVM.Where(s => s.CampusId == campusId && s.SessionId == sessionId).ToListAsync());
        // }

        

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllPrevilages([FromBody] Predicate model)
        {
            List<RoleAssignedData> ls = new List<RoleAssignedData>();
            List<PrevilagesData> assigned = new List<PrevilagesData>();

            assigned.AddRange(db.PrevilagesData.FromSql(String.Format("select distinct * from \"Role\".\"GetPrevilagesData\"({0})", model.ProvidedString)));
            ls.AddRange(db.RoleAssignedData.FromSql(String.Format("select * from \"public\".\"roleassignedlist2\"")));

            List<TreeItem> Zone = new List<TreeItem>();
            foreach (var item in ls)
            {
                if (Zone.Where(e => e.ID == item.ZoneId).Count() <= 0)
                {
                    Zone.Add(new TreeItem() { ID = item.ZoneId, Caption = item.ZoneName, IsChecked = false, Children = new List<TreeItem>() });
                    if (assigned.Where(e => e.Id.Trim() == item.ZoneId.ToString()).Count() > 0)
                    {
                        Zone[Zone.Count() - 1].IsChecked = true;
                    }

                    List<TreeItem> City = new List<TreeItem>();
                    foreach (var city in ls.Where(e => e.ZoneId == item.ZoneId))
                    {
                        if (City.Where(e => e.ID == city.CityId).Count() <= 0)
                        {
                            City.Add(new TreeItem() { ID = city.CityId, Caption = city.CityName, IsChecked = false, Children = new List<TreeItem>() });
                            if (assigned.Where(e => e.Id == city.CityId.ToString()).Count() > 0)
                            {
                                City[City.Count() - 1].IsChecked = true;
                            }

                            List<TreeItem> SubCity = new List<TreeItem>();
                            foreach (var subcity in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId))
                            {
                                if (SubCity.Where(e => e.ID == subcity.SubCityId).Count() <= 0)
                                {
                                    SubCity.Add(new TreeItem() { ID = subcity.SubCityId, Caption = subcity.SubCityName, IsChecked = false, Children = new List<TreeItem>() });
                                    if (assigned.Where(e => e.Id == subcity.SubCityId.ToString()).Count() > 0)
                                    {
                                        SubCity[SubCity.Count() - 1].IsChecked = true;
                                    }

                                    List<TreeItem> Campus = new List<TreeItem>();
                                    foreach (var campus in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId))
                                    {
                                        if (Campus.Where(e => e.ID == campus.CampusId).Count() <= 0)
                                        {
                                            Campus.Add(new TreeItem() { ID = campus.CampusId, Caption = campus.CampusName, IsChecked = false, Children = new List<TreeItem>() });
                                            if (assigned.Where(e => e.Id == campus.CampusId.ToString()).Count() > 0)
                                            {
                                                Campus[Campus.Count() - 1].IsChecked = true;
                                            }

                                            List<TreeItem> Program = new List<TreeItem>();
                                            foreach (var program in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId && e.CampusId == campus.CampusId))
                                            {
                                                if (Program.Where(e => e.ID == program.ProgramId).Count() <= 0)
                                                {
                                                    Program.Add(new TreeItem() { ID = program.ProgramId, Caption = program.ProgramName, IsChecked = false, Children = new List<TreeItem>() });
                                                    if (assigned.Where(e => e.Id == program.ProgramId.ToString()).Count() > 0)
                                                    {
                                                        Program[Program.Count() - 1].IsChecked = true;
                                                    }

                                                    List<TreeItem> Shift = new List<TreeItem>();
                                                    foreach (var shift in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId && e.CampusId == campus.CampusId && e.ProgramId == program.ProgramId))
                                                    {
                                                        if (Shift.Where(e => e.ID == shift.ShiftId).Count() <= 0)
                                                        {
                                                            Shift.Add(new TreeItem() { ID = shift.ShiftId, Caption = shift.ShiftName, IsChecked = false, Children = new List<TreeItem>() });
                                                            if (assigned.Where(e => e.Id == shift.ShiftId.ToString()).Count() > 0)
                                                            {
                                                                Shift[Shift.Count() - 1].IsChecked = true;
                                                            }

                                                            List<TreeItem> Classes = new List<TreeItem>();
                                                            foreach (var classes in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId && e.CampusId == campus.CampusId && e.ProgramId == program.ProgramId && e.ShiftId == shift.ShiftId))
                                                            {
                                                                if (Classes.Where(e => e.ID == classes.ClassId).Count() <= 0)
                                                                {
                                                                    Classes.Add(new TreeItem() { ID = classes.ClassId, Caption = classes.ClassName, IsChecked = false, Children = new List<TreeItem>() });
                                                                    if (assigned.Where(e => e.Id == classes.ClassId.ToString()).Count() > 0)
                                                                    {
                                                                        Classes[Classes.Count() - 1].IsChecked = true;
                                                                    }
                                                                }
                                                            }
                                                            Shift[Shift.Count() - 1].Children = Classes;
                                                        }
                                                    }
                                                    Program[Program.Count() - 1].Children = Shift;
                                                }
                                            }
                                            Campus[Campus.Count() - 1].Children = Program;
                                        }
                                    }
                                    SubCity[SubCity.Count() - 1].Children = Campus;
                                }
                            }
                            City[City.Count() - 1].Children = SubCity;
                        }
                    }
                    Zone[Zone.Count() - 1].Children = City;
                }
            }
            return Ok(Zone);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllListPrevilages()
        {
            List<RoleAssignedData> ls = new List<RoleAssignedData>();
            ls.AddRange(db.RoleAssignedData.FromSql(String.Format("select * from \"public\".\"roleassignedlist2\" ")));

            List<TreeItem> Zone = new List<TreeItem>();
            foreach (var item in ls)
            {
                if (Zone.Where(e => e.ID == item.ZoneId).Count() <= 0)
                {
                    Zone.Add(new TreeItem() { ID = item.ZoneId, Caption = item.ZoneName, IsChecked = false, Children = new List<TreeItem>() });

                    List<TreeItem> City = new List<TreeItem>();
                    foreach (var city in ls.Where(e => e.ZoneId == item.ZoneId))
                    {
                        if (City.Where(e => e.ID == city.CityId).Count() <= 0)
                        {
                            City.Add(new TreeItem() { ID = city.CityId, Caption = city.CityName, IsChecked = false, Children = new List<TreeItem>() });

                            List<TreeItem> SubCity = new List<TreeItem>();
                            foreach (var subcity in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId))
                            {
                                if (SubCity.Where(e => e.ID == subcity.SubCityId).Count() <= 0)
                                {
                                    SubCity.Add(new TreeItem() { ID = subcity.SubCityId, Caption = subcity.SubCityName, IsChecked = false, Children = new List<TreeItem>() });

                                    List<TreeItem> Campus = new List<TreeItem>();
                                    foreach (var campus in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId))
                                    {
                                        if (Campus.Where(e => e.ID == campus.CampusId).Count() <= 0)
                                        {
                                            Campus.Add(new TreeItem() { ID = campus.CampusId, Caption = campus.CampusName, IsChecked = false, Children = new List<TreeItem>() });

                                            List<TreeItem> Program = new List<TreeItem>();
                                            foreach (var program in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId && e.CampusId == campus.CampusId))
                                            {
                                                if (Program.Where(e => e.ID == program.ProgramId).Count() <= 0)
                                                {
                                                    Program.Add(new TreeItem() { ID = program.ProgramId, Caption = program.ProgramName, IsChecked = false, Children = new List<TreeItem>() });

                                                    List<TreeItem> Shift = new List<TreeItem>();
                                                    foreach (var shift in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId && e.CampusId == campus.CampusId && e.ProgramId == program.ProgramId))
                                                    {
                                                        if (Shift.Where(e => e.ID == shift.ShiftId).Count() <= 0)
                                                        {
                                                            Shift.Add(new TreeItem() { ID = shift.ShiftId, Caption = shift.ShiftName, IsChecked = false, Children = new List<TreeItem>() });

                                                            List<TreeItem> Classes = new List<TreeItem>();
                                                            foreach (var classes in ls.Where(e => e.ZoneId == item.ZoneId && e.CityId == city.CityId && e.SubCityId == subcity.SubCityId && e.CampusId == campus.CampusId && e.ProgramId == program.ProgramId && e.ShiftId == shift.ShiftId))
                                                            {
                                                                if (Classes.Where(e => e.ID == classes.ClassId).Count() <= 0)
                                                                {
                                                                    Classes.Add(new TreeItem() { ID = classes.ClassId, Caption = classes.ClassName, IsChecked = false, Children = new List<TreeItem>() });
                                                                }
                                                            }
                                                            Shift[Shift.Count() - 1].Children = Classes;
                                                        }
                                                    }
                                                    Program[Program.Count() - 1].Children = Shift;
                                                }
                                            }
                                            Campus[Campus.Count() - 1].Children = Program;
                                        }
                                    }
                                    SubCity[SubCity.Count() - 1].Children = Campus;
                                }
                            }
                            City[City.Count() - 1].Children = SubCity;
                        }
                    }
                    Zone[Zone.Count() - 1].Children = City;
                }
            }
            return Ok(Zone);
        }




        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllRoles()
        {
            return Ok(db.Roles.FromSql("SELECT * FROM \"Role\".\"Role\""));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllRoleDashboard()
        {

            ContextUserId = DomainContext.User.UserId;
            return Ok(this.db.RoleDashboardFilter.FromSql(String.Format(RoleDashboardquery, ContextUserId)).ToList<RoleDashboardFilter>());
        }


        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllUserById()
        {
            var z = DomainContext.User.UserId;
            return Ok(db.UserList.FromSql("select * from \"Role\".\"GetUserData\"({0})",z));


        }

           [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllUser()
        {
            return Ok(db.UserList.FromSql("select * from \"Role\".\"GetUserData\"()"));


        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetDataOnUpdate([FromBody] Predicate model)
        {
            var roleid = model.ProvidedString.Split("?")[0];
            var ModuleType = model.ProvidedString.Split("?")[1];

            return Ok(db.GetRoleUpdateData.FromSql(String.Format(UpdateQuery, roleid, ModuleType)));


            // return Ok(db.GetRoleUpdateData.FromSql(String.Format("SELECT * FROM \"Role\".\"DataOnUpdate\"() roleid,ModuleType")));
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RolePrevilages).Assembly);
            Expression<Func<RolePrevilages, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RolePrevilages, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllActiveAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RolePrevilages).Assembly);
            Expression<Func<RolePrevilages, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RolePrevilages, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RolePrevilages).Assembly);
            Expression<Func<RolePrevilages, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RolePrevilages, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RolePrevilages).Assembly);
            Expression<Func<RolePrevilages, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RolePrevilages, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] RolePrevilages entity)
        {
            int z = 1;

            z = (this.db.Database.ExecuteSqlCommand(String.Format("delete from \"Role\".\"RolePrevilages\" Where \"UserId\"=({0})", entity.UserId)));

            return Ok(this.repository.Add(entity));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] RolePrevilages entity)
        {
            return Ok(await this.repository.AddAsync(entity));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<RolePrevilages> entities)
        {

            return Ok(this.repository.AddAll(entities));
        }

        [HttpPost]
        [Route("[action]")]
        public int AddManyUser([FromBody] IList<UserRoles> entities)
        {
            int z = 1;

            z = (this.db.Database.ExecuteSqlCommand(String.Format("delete from \"Role\".\"UserRole\" Where \"UserId\"=({0})", (entities[0] as UserRoles).UserId)));

            foreach (var item in entities)
            {

                z = (this.db.Database.ExecuteSqlCommand(String.Format(InsertQuery, item.Id, item.UserId)));

            }
            // List<UserRoles> ls=new List<UserRoles>();
            // for (int  i=0;i<ls.Count();i++)
            // {
            //     int z=(this.db.Database.ExecuteSqlCommand(String.Format(InsertQuery,ls[i].RoleId,ls[i].UserId)));
            // }
            return z;

        }

        [HttpPost]
        [Route("[action]")]
        public int EditManyUser([FromBody] IList<UserRoles> entities)
        {
            int z = 1;

            z = (this.db.Database.ExecuteSqlCommand(String.Format("delete from \"Role\".\"UserRole\" Where \"UserId\"=({0})", (entities[0] as UserRoles).UserId)));

            foreach (var item in entities)
            {
                z = (this.db.Database.ExecuteSqlCommand(String.Format(InsertQuery, item.Id, item.UserId)));
            }

            return z;

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<RolePrevilages> entities)
        {
            return Ok(await this.repository.AddAllAsync(entities));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllowedSection([FromBody] Predicate predicate)
        {
            //    var data= this.log.GetLog();
            var userid = predicate.ProvidedString;
            var query = String.Format(@"Select ""AllowedSection"" as ""ProvidedString"" from ""Role"".""SectionRightLink"" WHERE ""UserId"" = {0}", userid);
            // Console.WriteLine(query);
            return Ok(this.db.Predicate.FromSql(query));
            //return Ok(await this.repository.AddAllAsync(entities));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllowedMask([FromBody] Predicate predicate)
        {
            //    var data= this.log.GetLog();
            var userid = predicate.ProvidedString;
            var query = String.Format(@"Select ""AllowedMask"" as ""ProvidedString"" from ""Role"".""MaskRightLink"" WHERE ""UserId"" = {0}", userid);
            // Console.WriteLine(query);
            return Ok(this.db.Predicate.FromSql(query));
            //return Ok(await this.repository.AddAllAsync(entities));
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetMaskList()
        {
            //    var data= this.log.GetLog();

            var query = String.Format(@"Select ""SmsApId"" as ""Id"",""Mask"" as ""Text"",false as ""IsChecked"" from ""Message"".""SmsAPI""");
            // Console.WriteLine(query);
            return Ok(this.db.MaskList.FromSql(query));
            //return Ok(await this.repository.AddAllAsync(entities));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetToDoList([FromBody] Predicate predicate)
        {
            //    var data= this.log.GetLog();
            var userid = predicate.ProvidedString;
            var query = String.Format(@"Select * from ""Dashboard"".""TodoList"" WHERE ""UserId"" = {0} and ""StatusId"" = 1 ORDER BY ""Dated"" DESC", userid);
            // Console.WriteLine(query);
            return Ok(this.db.TodoList.FromSql(query));
            //return Ok(await this.repository.AddAllAsync(entities));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertToDoList([FromBody] Predicate predicate)
        {
            //    var data= this.log.GetLog();
            var todolistId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var userid = (predicate.ProvidedString.Split("?")[1]);
            var dated = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.ProvidedString.Split("?")[2]));
            var description = (predicate.ProvidedString.Split("?")[3]);
            var taskstatus = (predicate.ProvidedString.Split("?")[4]);
            var title = (predicate.ProvidedString.Split("?")[5]);
            var statusid = Convert.ToInt32(predicate.ProvidedString.Split("?")[6]);
            var query = String.Format(@"Select * from ""Dashboard"".""InsertToDoList""('{0}',{1},'{2}','{3}','{4}','{5}',{6}) as ""ProvidedString""", todolistId, userid, dated, description, taskstatus, title, statusid);
            // Console.WriteLine(query);
            return Ok(this.db.Predicate.FromSql(query));
            //return Ok(await this.repository.AddAllAsync(entities));
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateStatus([FromBody] Predicate model)
        {
            IDbConnection connection = db.Database.GetDbConnection();
            var userDashBoardId = new Guid(model.ProvidedString);
            // var smsids = model.ProvidedString.Split("?")[1];

            string json = String.Format("UPDATE \"Role\".\"UserDasboard\" SET \"StatusId\" = 0 WHERE \"UserDashboadId\" = '{0}'", userDashBoardId);
            // string jsonsms = String.Format(@"select * from ""Examination"".""SendExamSms""({0})", smsids);
            // Console.WriteLine(json);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            // connection.Execute(jsonsms);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllRoleDashboardEx([FromBody] Predicate predicate)
        {
            //    var data= this.log.GetLog();
            var userid = predicate.ProvidedString;
            var query = String.Format(@"Select * from ""Role"".""UserRoleDashboardlink"" WHERE ""UserId"" = {0} and ""StatusId"" = 1", userid);
            // Console.WriteLine(query);
            return Ok(this.db.UserRoleDashboardlink.FromSql(query));
            //return Ok(await this.repository.AddAllAsync(entities));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult insertUserDashboard([FromBody] Predicate model)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var roledashboardid = (model.ProvidedString.Split("?")[0]);
                var userid = (model.ProvidedString.Split("?")[1]);

                string json = String.Format("SELECT \"Role\".\"UserDasboardlink\"({0},{1}) as ProvidedString", roledashboardid, userid);
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
        
        [HttpPost]
        [Route("[action]")]
        public IActionResult addUserDashboard([FromBody] Predicate model)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var roledashboardid = (model.ProvidedString.Split("?")[0]);
                var userid = (model.ProvidedString.Split("?")[1]);
                var operation = (model.ProvidedString.Split("?")[2]);


                string json = String.Format("SELECT \"Role\".\"AddUserDasboard\"({0},{1},'{2}') as ProvidedString", roledashboardid, userid, operation);
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

        // [HttpPost]
        // [Route("[action]")]
        // public IActionResult Update([FromBody]RolePrevilages entity)
        // {
        //     entity.ModuleStore = entity.ModuleStore.Replace("{", "{{").Replace("}", "}}");
        //     // entity.ModuleStore=Newtonsoft.Json.JsonConvert.SerializeObject(entity.ModuleStore);
        //     // return Ok( this.repository.Update(entity).where ;
        //     //    var data=(entity.ModuleStore).ToString();


        //     //return Ok( this.repository.Update(entity));
        //     return Ok(this.db.Database.ExecuteSqlCommand(String.Format(UpdateEntityQuery, entity.RoleId, entity.ModuleType, entity.ModuleStore)));

        // }


        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] RolePrevilages entity)
        {

            return Ok(this.repository.Update(entity));

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] RolePrevilages entity)
        {
            return Ok(await this.repository.UpdateAsync(entity));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] RolePrevilages entity)
        {
            return Ok(this.repository.Delete(entity));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] RolePrevilages entity)
        {
            return Ok(await this.repository.DeleteAsync(entity));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RolePrevilages).Assembly);
            Expression<Func<RolePrevilages, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RolePrevilages, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(RolePrevilages).Assembly);
            Expression<Func<RolePrevilages, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<RolePrevilages, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        private const string UpdateQuery = @"
        select * from ""Role"".""DataOnUpdate""('{0}','{1}')";


        private const string UpdateEntityQuery = "Update \"Role\".\"RolePrevilages\" set \"ModuleStore\"='{2}' where \"ModuleType\"='{1}' and \"RoleId\"='{0}';";
        //private const string InsertQuery = "Insert into  \"Role\".\"UserRole\" Values \"RoleId\"='{0}' \"UserId\"={1} ";
        private const string InsertQuery = "insert into  \"Role\".\"UserRole\" (\"RoleId\",\"UserId\")VALUES('{0}',{1}) ";


        private const string RoleDashboardquery = @"SELECT rd.""RoleDasboardId"", rd.""ModuleId"", rd.""ColumnWidth"", rd.""OrderBy"" FROM ""Role"".""UserRole"" AS ur, ""Role"".""RoleDashboard"" AS rd 
                                                    WHERE rd.""RoleId"" = ur.""RoleId"" AND ur.""UserId"" = {0} AND ""OrderBy"" is NOT null
                                                    GROUP BY rd.""RoleDasboardId"", rd.""ModuleId"", rd.""ColumnWidth"", rd.""OrderBy""
                                                    ORDER BY rd.""OrderBy""";



    }
}