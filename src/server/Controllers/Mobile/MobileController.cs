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
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using common.Crypto;

namespace Cms360.Server.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("AllowPolicy")]
    [IgnoreAntiforgeryToken]
    [ServiceFilter(typeof(Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Filters.ApiExceptionFilter))]
    public class MobileController : Controller
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
        private ResponseEx loginResponseEx;
        private DbContextBase dbc;
        private ICryptoService crypto;
        private readonly ISetupSessionRepository repository;
        private IEmailService email;
        private readonly IARVO_ConfigurationsRepository arvorepository;
        private readonly IARVOConfigurationRepository arvorepositoryEx;
        private readonly ITopicWatchRepository TopicWatch;
        private readonly EncryptionService encryptionService;

        private static readonly object updateLock = new object();

        public MobileController(ICryptoService crypto,
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
        IARVO_ConfigurationsRepository arvorepository,
        IARVOConfigurationRepository arvorepositoryEx,
        ITopicWatchRepository TopicWatch,
            IEmailService email, EncryptionService encryptionService)
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
            this.arvorepository = arvorepository;
            this.arvorepositoryEx = arvorepositoryEx;
            this.TopicWatch = TopicWatch;
            this.encryptionService = encryptionService;

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
        public IActionResult Login([FromBody] LoginParam provided)
        {
            var result = this.dbc.VWUserSession.Where(e => e.Username.ToLower() == provided.User_name.ToLower()).ToList();

            if (result.Count > 0)
            {
                if (result[0].StatusId == 0)
                {
                    try
                    {
                        loginResponse = new Response()
                        {
                            SessionID = new Guid(),
                            TimeDate = DateTime.UtcNow,
                            UserName = "NULL",
                            TeacherID = "",
                            Teacher = "Un Successful",
                            Code = 901,
                            Message = "Un Successful Login"
                        };

                        var login = this.dbc.LoginData.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).FirstOrDefault();
                        if (login != null)
                        {
                            // if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password))
                            // {
                            loginResponse = new Response()
                            {
                                SessionID = Guid.NewGuid(),
                                TimeDate = DateTime.UtcNow,
                                UserName = login.DisplayName,
                                TeacherID = provided.User_name,
                                Teacher = login.DisplayName,
                                TeacherStudentID = login.StaffId,
                                Code = 900,
                                Message = "Successful Login"
                            };
                            var sql = String.Format(@"SELECT * FROM ""Message"".""UpdateSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                            this.dbc.Database.ExecuteSqlCommand(sql);

                            var loginResponce = JsonConvert.SerializeObject(loginResponse);

                            this.log.Insert(JsonConvert.SerializeObject(loginResponse), "Teacher_Login", "Login From Mobile/Tab");
                            //}
                        }

                        return Ok(loginResponse);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(String.Format("Error in ResolveUser method. {0}", ex.Message));
                    }
                }
                else if (result[0].StatusId == 1)
                {
                    var login = this.dbc.LoginData.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).FirstOrDefault();

                    loginResponse = new Response()
                    {
                        SessionID = Guid.NewGuid(),
                        TimeDate = DateTime.UtcNow,
                        UserName = login.DisplayName,
                        TeacherID = provided.User_name,
                        Teacher = login.DisplayName,
                        TeacherStudentID = login.StaffId,
                        Code = 918,
                        Message = "Un Successful Login"
                    };
                    return Ok(loginResponse);
                }
            }
            else if (result.Count == 0)
            {
                try
                {
                    loginResponse = new Response()
                    {
                        SessionID = new Guid(),
                        TimeDate = DateTime.UtcNow,
                        UserName = "NULL",
                        TeacherID = "",
                        Teacher = "Un Successful",
                        Code = 901,
                        Message = "Un Successful Login"
                    };

                    var login = this.dbc.LoginData.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).ToList().FirstOrDefault();

                    if (login != null)
                    {
                        // Console.WriteLine(this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password));

                        // if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password))
                        // {
                        loginResponse = new Response()
                        {
                            SessionID = Guid.NewGuid(),
                            TimeDate = DateTime.UtcNow,
                            UserName = login.DisplayName,
                            TeacherID = provided.User_name,
                            Teacher = login.DisplayName,
                            TeacherStudentID = login.StaffId,
                            Code = 900,
                            Message = "Successful Login"
                        };
                        var sql = String.Format(@"SELECT * FROM ""Message"".""InsertSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                        this.dbc.Database.ExecuteSqlCommand(sql);
                        //}
                    }
                    this.log.Insert(JsonConvert.SerializeObject(loginResponse), "Teacher_Login", "Login From Mobile/Tab");

                    return Ok(loginResponse);
                }
                catch (Exception ex)
                {

                    return BadRequest(String.Format("Error in ResolveUser method. {0}", ex.Message));
                }
            }
            return Ok();
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult LoginNew([FromBody] LoginParam provided)
        {
            var result = this.dbc.VWUserSession.Where(e => e.Username.ToLower() == provided.User_name.ToLower()).ToList();
            if (result.Count > 0)
            {
                if (result[0].StatusId == 0)
                {
                    try
                    {
                        loginResponse = new Response()
                        {
                            SessionID = new Guid(),
                            TimeDate = DateTime.UtcNow,
                            UserName = "NULL",
                            TeacherID = "",
                            Teacher = "Un Successful",
                            Code = 901,
                            Message = "Un Successful Login"
                        };
                        var login = this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).ToList();
                        if (login != null)
                        {
                            // if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password))
                            // {


                            // loginResponse = new Response()
                            // {
                            //     SessionID = Guid.NewGuid(),
                            //     TimeDate = DateTime.UtcNow,
                            //     UserName = login.DisplayName,
                            //     TeacherID = provided.User_name,
                            //     Teacher = login.DisplayName,
                            //     TeacherStudentID = login.StaffId,
                            //     Code = 900,
                            //     Message = "Successful Login"
                            // };


                            return Ok(this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).Select(
                        e => new ResponseEx
                        {
                            SessionID = Guid.NewGuid(),
                            TimeDate = DateTime.UtcNow,
                            UserName = e.DisplayName,
                            TeacherID = provided.User_name,
                            Teacher = e.DisplayName,
                            TeacherStudentID = e.StaffId,
                            HodCheck = e.HodCheck,
                            Code = 900,
                            Message = "Successful Login"
                        }).ToList());
                        }
                        var sql = String.Format(@"SELECT * FROM ""Message"".""UpdateSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                        this.dbc.Database.ExecuteSqlCommand(sql);
                        var loginResponce = JsonConvert.SerializeObject(loginResponse);
                        this.log.Insert(JsonConvert.SerializeObject(loginResponse), "Teacher_Login", "Login From Mobile/Tab");
                        //}
                    }
                    //    return Ok(this.dbc.LoginData.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).Select(
                    //     e=>new Response {
                    //         SessionID = Guid.NewGuid(),
                    //         TimeDate = DateTime.UtcNow,
                    //         UserName = e.DisplayName,
                    //         TeacherID = provided.User_name,
                    //         Teacher = e.DisplayName,
                    //         TeacherStudentID = e.StaffId,
                    //         Code = 918,
                    //         Message = "Un Successful Login"
                    //     }).ToList());
                    // }
                    catch (Exception ex)
                    {
                        return BadRequest(String.Format("Error in ResolveUser method. {0}", ex.Message));
                    }
                }
                else if (result[0].StatusId == 1)
                {
                    return Ok(this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).Select(
                       e => new ResponseEx
                       {
                           SessionID = Guid.NewGuid(),
                           TimeDate = DateTime.UtcNow,
                           UserName = e.DisplayName,
                           TeacherID = provided.User_name,
                           Teacher = e.DisplayName,
                           TeacherStudentID = e.StaffId,
                           HodCheck = e.HodCheck,
                           Code = 918,
                           Message = "Un Successful Login"
                       }).ToList());
                }
            }
            else if (result.Count == 0)
            {
                try
                {
                    loginResponse = new Response()
                    {
                        SessionID = new Guid(),
                        TimeDate = DateTime.UtcNow,
                        UserName = "NULL",
                        TeacherID = "",
                        Teacher = "Un Successful",
                        Code = 901,
                        Message = "Un Successful Login"
                    };
                    var login = this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).ToList();
                    if (login != null)
                    {
                        // Console.WriteLine(this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password));
                        // if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password))
                        // {
                        // loginResponse = new Response()
                        // {
                        //     SessionID = Guid.NewGuid(),
                        //     TimeDate = DateTime.UtcNow,
                        //     UserName = login.DisplayName,
                        //     TeacherID = provided.User_name,
                        //     Teacher = login.DisplayName,
                        //     TeacherStudentID = login.StaffId,
                        //     Code = 900,
                        //     Message = "Successful Login"
                        // };




                        return Ok(this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).Select(
                      e => new ResponseEx
                      {
                          SessionID = Guid.NewGuid(),
                          TimeDate = DateTime.UtcNow,
                          UserName = e.DisplayName,
                          TeacherID = provided.User_name,
                          Teacher = e.DisplayName,
                          TeacherStudentID = e.StaffId,
                          HodCheck = e.HodCheck,
                          Code = 900,
                          Message = "Successful Login"
                      }).ToList());
                        var sql = String.Format(@"SELECT * FROM ""Message"".""InsertSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                        this.dbc.Database.ExecuteSqlCommand(sql);
                        //}
                    }
                    this.log.Insert(JsonConvert.SerializeObject(loginResponse), "Teacher_Login", "Login From Mobile/Tab");

                }
                catch (Exception ex)
                {
                    return BadRequest(String.Format("Error in ResolveUser method. {0}", ex.Message));
                }
            }
            return Ok();
        }





        [HttpGet]
        [Authorize]
        [Route("[action]")]
        public IActionResult NegativeVideoRatting()
        {
            return Ok(this.dbc.VW_NegativeVideoRatting);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult LoginEx([FromBody] LoginParam provided)
        {
            var result = this.dbc.VWUserSession.Where(e => e.Username.ToLower() == provided.User_name.ToLower()).ToList();

            if (result.Count > 0)
            {
                if (result[0].StatusId == 0)
                {
                    try
                    {
                        loginResponse = new Response()
                        {
                            SessionID = new Guid(),
                            TimeDate = DateTime.UtcNow,
                            UserName = "NULL",
                            TeacherID = "",
                            Teacher = "Un Successful",
                            Code = 901,
                            Message = "Un Successful Login"
                        };

                        var login = this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).FirstOrDefault();
                        if (login != null)
                        {
                            // if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password))
                            // {
                            loginResponseEx = new ResponseEx()
                            {
                                SessionID = Guid.NewGuid(),
                                TimeDate = DateTime.UtcNow,
                                UserName = login.DisplayName,
                                TeacherID = provided.User_name,
                                Teacher = login.DisplayName,
                                TeacherStudentID = login.StaffId,
                                HodCheck = login.HodCheck,
                                Code = 900,
                                Message = "Successful Login"
                            };
                            var sql = String.Format(@"SELECT * FROM ""Message"".""UpdateSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                            this.dbc.Database.ExecuteSqlCommand(sql);

                            var loginResponce = JsonConvert.SerializeObject(loginResponseEx);

                            this.log.Insert(JsonConvert.SerializeObject(loginResponseEx), "Teacher_Login", "Login From Mobile/Tab");
                            //}
                        }

                        return Ok(loginResponseEx);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(String.Format("Error in ResolveUser method. {0}", ex.Message));
                    }
                }
                else if (result[0].StatusId == 1)
                {
                    var login = this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).FirstOrDefault();

                    loginResponseEx = new ResponseEx()
                    {
                        SessionID = Guid.NewGuid(),
                        TimeDate = DateTime.UtcNow,
                        UserName = login.DisplayName,
                        TeacherID = provided.User_name,
                        Teacher = login.DisplayName,
                        TeacherStudentID = login.StaffId,
                        HodCheck = login.HodCheck,
                        Code = 918,
                        Message = "Un Successful Login"
                    };
                    return Ok(loginResponseEx);
                }
            }
            else if (result.Count == 0)
            {
                try
                {
                    loginResponse = new Response()
                    {
                        SessionID = new Guid(),
                        TimeDate = DateTime.UtcNow,
                        UserName = "NULL",
                        TeacherID = "",
                        Teacher = "Un Successful",
                        Code = 901,
                        Message = "Un Successful Login"
                    };

                    var login = this.dbc.LoginDataEx.Where(s => s.Username.ToLower() == provided.User_name.ToLower()).ToList().FirstOrDefault();

                    if (login != null)
                    {
                        // Console.WriteLine(this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password));

                        // if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, provided.User_Password))
                        // {
                        loginResponseEx = new ResponseEx()
                        {
                            SessionID = Guid.NewGuid(),
                            TimeDate = DateTime.UtcNow,
                            UserName = login.DisplayName,
                            TeacherID = provided.User_name,
                            Teacher = login.DisplayName,
                            TeacherStudentID = login.StaffId,
                            HodCheck = login.HodCheck,
                            Code = 900,
                            Message = "Successful Login"
                        };
                        var sql = String.Format(@"SELECT * FROM ""Message"".""InsertSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                        this.dbc.Database.ExecuteSqlCommand(sql);
                        //}
                    }
                    this.log.Insert(JsonConvert.SerializeObject(loginResponseEx), "Teacher_Login", "Login From Mobile/Tab");

                    return Ok(loginResponseEx);
                }
                catch (Exception ex)
                {

                    return BadRequest(String.Format("Error in ResolveUser method. {0}", ex.Message));
                }
            }
            return Ok();
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult LoginTest([FromBody] LoginParam provided)
        {
            var result = this.dbc.VWUserSession.Where(e => e.Username == provided.User_name && e.MobileCode == provided.Device_Id).ToList();
            var resultOne = this.dbc.VWUserSession.Where(e => e.Username == provided.User_name).ToList();
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (result.Count > 0)
            {
                if (result[0].StatusId == 0)
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
                                var updPrevious = String.Format(@"SELECT * FROM ""Message"".""UpdatePreviousSession""('{0}')", provided.User_name);
                                if (connection.State == ConnectionState.Closed)
                                    connection.Open();
                                connection.Execute(updPrevious);
                                if (connection.State == ConnectionState.Open)
                                {
                                    connection.Close();
                                    connection.Dispose();
                                }

                                var sql = String.Format(@"SELECT * FROM ""Message"".""UpdateSession""('{0}','{1}')", provided.User_name, provided.Device_Id);

                                if (connection.State == ConnectionState.Closed)
                                    connection.Open();
                                connection.Execute(sql);
                                if (connection.State == ConnectionState.Open)
                                {
                                    connection.Close();
                                    connection.Dispose();
                                }
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
                else if (result[0].StatusId == 1)
                {
                    var login = this.dbc.LoginData.Where(s => s.Username == provided.User_name).ToList().FirstOrDefault();

                    loginResponse = new Response()
                    {
                        SessionID = Guid.NewGuid(),
                        TimeDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, DateTime.UtcNow.Day),
                        UserName = login.DisplayName,
                        TeacherID = provided.User_name,
                        Teacher = login.DisplayName,
                        TeacherStudentID = login.StaffId,
                        Code = 918,
                        Message = "Un Successful Login"
                    };
                    return Ok(loginResponse);
                }
            }
            else if (result.Count == 0)
            {
                if (resultOne.Count > 0)
                {
                    if (resultOne[0].StatusId == 1)
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
                                    var updPrevious = String.Format(@"SELECT * FROM ""Message"".""UpdatePreviousSession""('{0}')", provided.User_name);
                                    if (connection.State == ConnectionState.Closed)
                                        connection.Open();
                                    connection.Execute(updPrevious);
                                    if (connection.State == ConnectionState.Open)
                                    {
                                        connection.Close();
                                        connection.Dispose();
                                    }
                                }
                                var sql = String.Format(@"SELECT * FROM ""Message"".""InsertSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                                if (connection.State == ConnectionState.Closed)
                                    connection.Open();
                                connection.Execute(sql);
                                if (connection.State == ConnectionState.Open)
                                {
                                    connection.Close();
                                    connection.Dispose();
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
                    else if (resultOne[0].StatusId == 0)
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
                                    var updPrevious = String.Format(@"SELECT * FROM ""Message"".""UpdatePreviousSession""('{0}')", provided.User_name);
                                    if (connection.State == ConnectionState.Closed)
                                        connection.Open();
                                    connection.Execute(updPrevious);
                                    if (connection.State == ConnectionState.Open)
                                    {
                                        connection.Close();
                                        connection.Dispose();
                                    }
                                }
                                var sql = String.Format(@"SELECT * FROM ""Message"".""InsertSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                                if (connection.State == ConnectionState.Closed)
                                    connection.Open();
                                connection.Execute(sql);
                                if (connection.State == ConnectionState.Open)
                                {
                                    connection.Close();
                                    connection.Dispose();
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
                }
                else
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
                            var sql = String.Format(@"SELECT * FROM ""Message"".""InsertSession""('{0}','{1}')", provided.User_name, provided.Device_Id);
                            if (connection.State == ConnectionState.Closed)
                                connection.Open();
                            connection.Execute(sql);
                            if (connection.State == ConnectionState.Open)
                            {
                                connection.Close();
                                connection.Dispose();
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
            }
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult check_session([FromBody] SessionParams param)
        {
            var result = this.dbc.VWUserSession.Where(s => s.StaffId == param.Teacher_ID && s.MobileCode == param.Device_Id).ToList();
            if (result.Count > 0)
            {
                if (result[0].StatusId == 1)
                {
                    return Ok(901);
                }
                else if (result[0].StatusId == 0)
                {
                    return Ok(900);
                }
            }
            return Ok(900);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult check_user([FromBody] UserParameter param)
        {
            IntModel[] res = (this.dbc.IntModel.FromSql(String.Format(@"SELECT * FROM ""Message"".""CheckUser"" ('{0}') as val", param.User_name))).ToArray<IntModel>();
            int result = res[0].val;
            if (res[0].val == 0)
            {
                return Ok("CMS USER!");
            }
            else
            {
                return Ok("EMS USER!");
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult LogOut([FromBody] SessionParams param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""Logout"" ('{0}')", param.Teacher_ID);

            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_class_attendance([FromBody] ClassAttendance param)
        {
            var z = DateTime.Now;
            var dayname = z.DayOfWeek.ToString();
            return Ok(this.dbc.TimeTableReportData.Where(s => s.Teacher_ID == param.Teacher_ID && s.Day == dayname)
                .Select(x => new
                {
                    campusID = x.Campus_ID,
                    campusName = x.Campus_Name,
                    campus_Prog_ID = x.Campus_Prog_ID,
                    class_Prog_Name = x.Class_Prog_Name,
                    colorName = x.ColorName,
                    // lectureNo = x.LectureNo,
                    room_ID = x.Room_ID,
                    room_Name = x.Room_Name,
                    sections_ID = x.Sections_ID,
                    sections_Name = x.Sections_Name,
                    slot_ID = x.Slot_ID,
                    timeTableID = x.TimeTableID,
                    teacher_ID = x.Teacher_ID,
                    teacher_Name = x.Teacher_Name,
                    subject_Name = x.Subject_Name,
                    subject_ID = x.Subject_ID,
                    timeStart = x.TimeStart,
                    timeEnd = x.TimeEnd,
                    dated = x.Dated,
                    isAppproved = x.IsApproved
                }));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult get_class_attendanceEx([FromBody] ClassAttendanceEx predicate)
        {

            string sql = string.Format(@"select * from ""Admission"".""GetTimeTableReport""('{0}','{1}')", predicate.Teacher_ID, predicate.Day);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TimeTableReportDataEx.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_class_attendance_full_week([FromBody] ClassAttendanceByWeek param)
        {
            return Ok(this.dbc.TimeTableReportData.Where(s => s.Teacher_ID == param.Teacher_ID && s.Day == param.Day)
                .Select(x => new
                {
                    campusID = x.Campus_ID,
                    campusName = x.Campus_Name,
                    campus_Prog_ID = x.Campus_Prog_ID,
                    class_Prog_Name = x.Class_Prog_Name,
                    colorName = x.ColorName,
                    // lectureNo = x.LectureNo,
                    day = x.Day,
                    room_ID = x.Room_ID,
                    room_Name = x.Room_Name,
                    sections_ID = x.Sections_ID,
                    sections_Name = x.Sections_Name,
                    slot_ID = x.Slot_ID,
                    timeTableID = x.TimeTableID,
                    teacher_ID = x.Teacher_ID,
                    teacher_Name = x.Teacher_Name,
                    subject_Name = x.Subject_Name,
                    subject_ID = x.Subject_ID,
                    timeStart = x.TimeStart,
                    timeEnd = x.TimeEnd,
                    dated = x.Dated,
                    isAppproved = x.IsApproved
                }));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult get_attendance_lecture_without_merge([FromBody] AttendanceLecture param)
        {
            string sql = String.Format(@"SELECT * FROM ""Message"".""GetAttendanceLecture""('{0}')", param.TimeTableID);
            return Ok(dbc.AttendanceLectureResponseModel.FromSql(sql).OrderBy(s => s.StudentID)
                .Select(
                    x => new
                    {
                        admission_ID = x.Admission_ID,
                        enrollment_ID = x.Enrollment_ID,
                        studentID = x.StudentID,
                        studentName = x.StudentName,
                        timeTableID = x.TimeTableID,
                        absent_ID = x.Absent_ID
                    }
                ));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult get_attendance_lecture([FromBody] AttendanceLecture param)
        {
            var date = DateTime.Now.Date;
            var sql = string.Format(@"SELECT * FROM ""Message"".""GetTeacherAttendenceDataUpdate""('{0}', '{1}') ORDER BY ""studentID""", param.TimeTableID, date);
            var result = dbc.AttendenceDatasStudentEx.FromSql(sql).ToList();
            if (result.Count > 0)
            {
                return Ok(result
                    .Select(
                        x => new
                        {
                            admission_ID = x.admission_ID,
                            enrollment_ID = x.studentID,
                            studentID = x.studentID,
                            studentName = x.studentName,
                            timeTableID = x.TimeTableId,
                            absent_ID = x.absent_ID,
                            shouldAbsent = x.ShouldAbsent,
                            detail = x.Detail
                        }
                    ));
            }
            else
            {
                var sql_one = string.Format(@"SELECT * FROM ""Message"".""GetTeacherAttendenceData""('{0}', '{1}') ORDER BY ""studentID""", param.TimeTableID, date);

                return Ok(dbc.AttendenceDatasStudentEx.FromSql(sql_one)
                    .Select(
                        x => new
                        {
                            admission_ID = x.admission_ID,
                            enrollment_ID = x.studentID,
                            studentID = x.studentID,
                            studentName = x.studentName,
                            timeTableID = x.TimeTableId,
                            absent_ID = x.absent_ID,
                            shouldAbsent = x.ShouldAbsent,
                            detail = x.Detail
                        }
                    ));
            }

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult get_attendance_lecture_without_function([FromBody] AttendanceLecture param)
        {
            var dte = (DateTime.Now.Date).ToString("yyyy-MM-dd");
            var date = Convert.ToDateTime(dte);
            if (CheckAttendence(param.TimeTableID, date) > 0)
            {

                return Ok(this.dbc.AttendanceLectureData.Where(s => s.TimeTableID == param.TimeTableID && s.Dated == date)
                    .Select(
                        x => new
                        {
                            admission_ID = x.Admission_ID,
                            enrollment_ID = x.Enrollment_ID,
                            studentID = x.StudentID,
                            studentName = x.StudentName,
                            timeTableID = x.TimeTableID,
                            absent_ID = x.Absent_ID
                        }
                    ));

            }
            else
            {
                return Ok(this.dbc.GetAttendenceData.Where(s => s.TimeTableID == param.TimeTableID).Select(
                    x => new
                    {
                        admission_ID = x.Admission_ID,
                        enrollment_ID = x.Enrollment_ID,
                        studentID = x.StudentID,
                        studentName = x.StudentName,
                        timeTableID = x.TimeTableID,
                        absent_ID = x.Absent_ID
                    }
                ));
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult submit_attendanceEx([FromBody] SubmitAttendanceLecture param)
        {
            var dte = DateTime.Now.Date;
            var data = this.dbc.AttendanceAttendenceMaster.Where(s => s.TimeTableId == param.TimeTableId && s.Dated == dte).ToList();
            if (data.Count > 0)
            {
                this.dbc.AttendanceAttendenceMaster.Remove(data[0]);
                this.dbc.SaveChanges();
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
            var list = this.dbc.TimeTableStudentVM.Where(s => s.TimeTableId == param.TimeTableId).ToList();
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
            var query = String.Format(@"SELECT * FROM ""Message"".""BulkAttendance""('{0}','{1}')", JsonConvert.SerializeObject(attendanceMaster), JsonConvert.SerializeObject(attendanceDetailList));

            IDbConnection connection = dbc.Database.GetDbConnection();

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
        [Authorize]
        [Route("[action]")]
        public IActionResult submit_attendance([FromBody] SubmitAttendanceLecture param)
        {
            IDbConnection connection = dbc.Database.GetDbConnection();

            var dte = DateTime.Now.Date;
            var data = this.dbc.AttendanceAttendenceMaster.Where(s => s.TimeTableId == param.TimeTableId && s.Dated == dte).ToList();
            var log = this.log.GetLog();
            if (data.Count > 0)
            {
                // Console.WriteLine(JsonConvert.SerializeObject(param.Enrollment));
                // Console.WriteLine(data[0].AttendenceMasterId);
                // var queryEX = String.Format(@"SELECT * FROM ""Message"".""BulkAttendanceUpdateForAllSubjects""('{0}','{1}','{2}')", JsonConvert.SerializeObject(param.Enrollment), data[0].AttendenceMasterId, log);
                var queryEX = String.Format(@"SELECT * FROM ""Message"".""BulkAttendanceUpdate""('{0}','{1}','{2}')", JsonConvert.SerializeObject(param.Enrollment), data[0].AttendenceMasterId, log);
                Console.WriteLine(queryEX);

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
            var list = this.dbc.TimeTableStudentVM.Where(s => s.TimeTableId == param.TimeTableId).ToList();
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
            // var query = String.Format(@"SELECT * FROM ""Message"".""BulkAttendanceForAllSubjects""('{0}','{1}','{2}')", JsonConvert.SerializeObject(attendanceMaster), JsonConvert.SerializeObject(attendanceDetailList), log);
            var query = String.Format(@"SELECT * FROM ""Message"".""BulkAttendance""('{0}','{1}','{2}')", JsonConvert.SerializeObject(attendanceMaster), JsonConvert.SerializeObject(attendanceDetailList), log);
            Console.WriteLine(query);


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
        public IActionResult GetStudentAttDetailINfo([FromBody] AttendenceDetailParam predicate)
        {

            var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.Start_Date));
            var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.End_Date));


            string sql = string.Format(@"select * from ""Message"".""AttendanceStudentInfo""('{0}','{1}','{2}')", predicate.Student_Id, fromDate, toDate);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceAttendanceStudentInfo.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentAttCourse([FromBody] AttendenceCourseParam predicate)
        {

            // var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.Start_Date));
            // var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.End_Date));


            string sql = string.Format(@"select * from ""Attendance"".""AttendanceCourseWise""('{0}','{1}')", predicate.TimeTable_Id, predicate.Start_Date);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceCourseResponseModel.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherMonth([FromBody] AttendenceCourseParam predicate)
        {




            string sql = string.Format(@"select * from ""Attendance"".""TeacherMonth""('{0}')", predicate.TimeTable_Id);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonth.FromSql(sql));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherMonthDetail([FromBody] AttendenceCourseParam predicate)
        {




            string sql = string.Format(@"select * from ""Attendance"".""TeacherMonthAttendanceDtEx""('{0}','{1}')", predicate.TimeTable_Id, predicate.Start_Date);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetail.FromSql(sql));
        }



        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetTeacherMonthSection([FromBody] ExamCourseParam predicate)
        {




            string sql = string.Format(@"select * from ""Attendance"".""TeacherMonthex""('{0}','{1}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthSection.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherMonthSectionMobile([FromBody] AttendenceCourseParam predicate)
        {




            string sql = string.Format(@"select * from ""Attendance"".""TeacherMonth""('{0}')", predicate.TimeTable_Id);
            //  Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonth.FromSql(sql));
        }



        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetTeacherMonthDetailSection([FromBody] AttendanceSectionParam predicate)
        {




            string sql = string.Format(@"select * from ""Attendance"".""TeacherMonthAttendanceDtExy""('{0}','{1}','{2}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId, predicate.Start_Date);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetail.FromSql(sql));
        }




        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherExamDetail([FromBody] ExamCourseParam predicate)
        {




            string sql = string.Format(@"select * from ""Message"".""ExamTeacherReport""('{0}','{1}','{2}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId, predicate.ExamTypeId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendanceTeacherMonthDetail.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetStudentAttDetailINfoEx([FromBody] AttendenceDetailParam predicate)
        {

            var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.Start_Date));
            var toDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(predicate.End_Date));


            string sql = string.Format(@"select * from ""Message"".""AttendanceStudentInfoEx""('{0}','{1}','{2}')", predicate.Student_Id, fromDate, toDate);
            // Console.WriteLine(sql);
            return Ok(this.dbc.AttendenceStudentInfoEx.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_TeacherData([FromBody] ClassAttendance predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherLectureData""('{0}')", predicate.Teacher_ID);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherDataResponse.FromSql(sql));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_TeacherExamData([FromBody] AttendenceDataModel predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherExamData""('{0}','{1}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherExamDataResponseEx.FromSql(sql));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_TeacherExamSce([FromBody] AttendenceDataModel predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherExamSce""('{0}','{1}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherExamDataResponse.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult Get_ClassStudents([FromBody] TeacherExamDataResponse predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetClassStudents""('{0}','{1}','{2}')", predicate.SectionCourseLinkId, predicate.ProgramCourseLinkId, predicate.Exam_Type_ID);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentClassList.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetTeacherStudentExaminfo([FromBody] TeacherStudentExaminfoaModel predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherStudentExaminfo""('{0}','{1}')", predicate.RollNo, predicate.StaffId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherStudentExaminfoResponse.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetTeacherStudentinfo([FromBody] TeacherStudentExaminfoaModel predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherStudentinfo""('{0}','{1}')", predicate.RollNo, predicate.StaffId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherStudentinfoResponse.FromSql(sql));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetTeacherStudentAttAll([FromBody] TeacherStudentExaminfoaModel predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherStudentAttAll""('{0}','{1}')", predicate.RollNo, predicate.StaffId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherstudentAttDataResponse.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetTeacherStudentAttMonth([FromBody] TeacherStudentExaminfoaModel1 predicate)
        {



            string sql = string.Format(@"select * from ""Message"".""GetTeacherStudentAttMonth""('{0}','{1}')", predicate.RollNo, predicate.StaffId, predicate.CourseId);
            // Console.WriteLine(sql);
            return Ok(this.dbc.TeacherstudentAttDataMonthResponse.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult submit_attendance_without_function([FromBody] SubmitAttendanceLecture param)
        {
            var dte = DateTime.Now.Date;
            var data = this.dbc.AttendanceAttendenceMaster.Where(s => s.TimeTableId == param.TimeTableId && s.Dated == dte).ToList();
            if (data.Count > 0)
            {
                this.dbc.AttendanceAttendenceMaster.Remove(data[0]);
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
            var list = this.dbc.TimeTableStudentVM.Where(s => s.TimeTableId == param.TimeTableId).ToList();

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

            this.dbc.AttendanceAttendenceMaster.Add(attendanceMaster);
            this.dbc.SaveChanges();
            this.dbc.AddRange(attendanceDetailList);

            return Ok(this.dbc.SaveChanges());
        }

        public Int32 CheckAttendence(Guid id, DateTime Date)
        {
            // var Dte = DateTime.Now.Date;
            IntModel[] res = (this.dbc.IntModel.FromSql(String.Format("select Count(*) as val from \"Message\".\"VWMobileAttendance\" where \"TimeTableID\"='{0}' and \"Dated\"='{1}' ", id, Date))).ToArray<IntModel>();
            int result = res[0].val;
            return result;

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_attendance_report([FromBody] AttendanceReportParams param)
        {
            var from = Convert.ToDateTime(param.DateFrom).Date;
            var to = Convert.ToDateTime(param.DateTo).Date;
            string sql = String.Format(@"SELECT * FROM ""Message"".""GetAattendanceReport""('{0}','{1}','{2}','{3}','{4}','{5}')", param.Teacher_ID, param.Campus_ID, param.Sections_ID, param.Subject_ID, param.DateFrom, param.DateTo);
            //  var result = this.dbc.AttendanceLectureData.Where(s => s.Teacher_ID == param.Teacher_ID && s.Campus_ID == param.Campus_ID && s.Sections_ID == param.Sections_ID && s.Subject_ID == param.Subject_ID && (s.Dated >= from && s.Dated <= to)).OrderBy(s => s.Admission_ID).ToList();
            var result = dbc.AttendanceReportResponseModelVM.FromSql(sql).OrderBy(s => s.Admission_ID).ThenBy(e => e.Dated).ToList();
            var attendanceReport = new List<AttendanceReportResponseModel>();
            var attModelList = new List<AttendanceModel>();
            var model = new AttendanceReportResponseModel();
            if (result.Count > 0)
            {
                var oldObj = result[0];

                foreach (var item in result)
                {
                    if (oldObj.Admission_ID == item.Admission_ID)
                    {
                        var attModel = new AttendanceModel();
                        attModel.Attendance_Date = item.Dated;
                        attModel.Attendance_Status = item.Absent_ID;
                        attModelList.Add(attModel);

                    }
                    else
                    {
                        model = new AttendanceReportResponseModel();
                        var index = result.IndexOf(item) - 1;
                        //model.DayName = result[index].DayName;
                        model.Program_Class = result[index].Program_Class;
                        model.StudentID = result[index].StudentID;
                        model.StudentName = result[index].StudentName;
                        model.days_data.AddRange(attModelList);
                        attendanceReport.Add(model);

                        var attModel = new AttendanceModel();
                        attModel.Attendance_Date = item.Dated;
                        attModel.Attendance_Status = item.Absent_ID;
                        attModelList = new List<AttendanceModel>();
                        attModelList.Add(attModel);

                    }
                    oldObj = item;

                }
                model = new AttendanceReportResponseModel();
                var index2 = result.Count - 1;
                //model.DayName = result[index2].DayName;
                model.Program_Class = result[index2].Program_Class;
                model.StudentID = result[index2].StudentID;
                model.StudentName = result[index2].StudentName;
                model.days_data.AddRange(attModelList);
                attendanceReport.Add(model);
            }
            // foreach (var item in attendanceReport)
            // {
            //     item.days_data.OrderBy(s=>s.Attendance_Date);
            // }
            return Ok(attendanceReport.OrderBy(e => e.StudentID));
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult get_timetable_reportWithClass([FromBody] TimeTableParams2 param)
        {
            //var result = this.dbc.TimeTableAPI.Where(s => s.Student_ID.ToUpper() == param.Student_ID.ToUpper()).ToList();
            var sql = String.Format(@"Select   * FROM ""Message"".""getTimeTableAPIWithClass""('{0}','{1}')", param.Student_ID.ToUpper(), param.ClassId);

            var result = this.dbc.TimeTableAPI.FromSql(sql).ToList();
            var timetableReport = new List<ResponseTimeTableAPI>();
            var timeModelList = new List<SubResponseTimeTableAPI>();
            var model = new ResponseTimeTableAPI();

            if (result.Count > 0)
            {

                var oldObj = result[0];

                foreach (var item in result)
                {
                    if (oldObj.Student_ID == item.Student_ID && oldObj.Day == item.Day)
                    {
                        var ttblModel = new SubResponseTimeTableAPI();
                        ttblModel.TeacherName = item.TeacherName;
                        ttblModel.SubjectName = item.SubjectName;
                        ttblModel.Room = item.Room;
                        ttblModel.ClassTime = item.StartTime + ' ' + '-' + ' ' + item.EndTime;
                        timeModelList.Add(ttblModel);
                    }
                    else
                    {
                        model = new ResponseTimeTableAPI();
                        var index = result.IndexOf(item) - 1;
                        model.Name = result[index].Name;
                        model.Campus = result[index].Campus;
                        model.Section = result[index].Section;
                        model.Class = result[index].Class;
                        model.Day = result[index].Day;
                        model.TimeTableData.AddRange(timeModelList);
                        timetableReport.Add(model);

                        var ttblModel = new SubResponseTimeTableAPI();
                        ttblModel.TeacherName = item.TeacherName;
                        ttblModel.SubjectName = item.SubjectName;
                        ttblModel.Room = item.Room;
                        ttblModel.ClassTime = item.StartTime + ' ' + '-' + ' ' + item.EndTime;

                        timeModelList = new List<SubResponseTimeTableAPI>();
                        timeModelList.Add(ttblModel);
                    }
                    oldObj = item;
                }
                model = new ResponseTimeTableAPI();
                var index2 = result.Count - 1;
                model.Name = result[index2].Name;
                model.Campus = result[index2].Campus;
                model.Section = result[index2].Section;
                model.Class = result[index2].Class;
                model.Day = result[index2].Day;
                model.TimeTableData.AddRange(timeModelList);
                timetableReport.Add(model);
            }
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = timetableReport;
            return Ok(MyDynamic);
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult get_timetable_report([FromBody] TimeTableParams param)
        {
            //var result = this.dbc.TimeTableAPI.Where(s => s.Student_ID.ToUpper() == param.Student_ID.ToUpper()).ToList();
            var sql = String.Format(@"Select   * FROM ""Message"".""getTimeTableAPI""('{0}')", param.Student_ID.ToUpper());

            var result = this.dbc.TimeTableAPI.FromSql(sql).ToList();
            var timetableReport = new List<ResponseTimeTableAPI>();
            var timeModelList = new List<SubResponseTimeTableAPI>();
            var model = new ResponseTimeTableAPI();

            if (result.Count > 0)
            {

                var oldObj = result[0];

                foreach (var item in result)
                {
                    if (oldObj.Student_ID == item.Student_ID && oldObj.Day == item.Day)
                    {
                        var ttblModel = new SubResponseTimeTableAPI();
                        ttblModel.TeacherName = item.TeacherName;
                        ttblModel.SubjectName = item.SubjectName;
                        ttblModel.Room = item.Room;
                        ttblModel.ClassTime = item.StartTime + ' ' + '-' + ' ' + item.EndTime;
                        timeModelList.Add(ttblModel);
                    }
                    else
                    {
                        model = new ResponseTimeTableAPI();
                        var index = result.IndexOf(item) - 1;
                        model.Name = result[index].Name;
                        model.Campus = result[index].Campus;
                        model.Section = result[index].Section;
                        model.Class = result[index].Class;
                        model.Day = result[index].Day;
                        model.TimeTableData.AddRange(timeModelList);
                        timetableReport.Add(model);

                        var ttblModel = new SubResponseTimeTableAPI();
                        ttblModel.TeacherName = item.TeacherName;
                        ttblModel.SubjectName = item.SubjectName;
                        ttblModel.Room = item.Room;
                        ttblModel.ClassTime = item.StartTime + ' ' + '-' + ' ' + item.EndTime;

                        timeModelList = new List<SubResponseTimeTableAPI>();
                        timeModelList.Add(ttblModel);
                    }
                    oldObj = item;
                }
                model = new ResponseTimeTableAPI();
                var index2 = result.Count - 1;
                model.Name = result[index2].Name;
                model.Campus = result[index2].Campus;
                model.Section = result[index2].Section;
                model.Class = result[index2].Class;
                model.Day = result[index2].Day;
                model.TimeTableData.AddRange(timeModelList);
                timetableReport.Add(model);
            }
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = timetableReport;
            return Ok(MyDynamic);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_timetable_reportEx([FromBody] TimeTableParams param)
        {
            //var result = this.dbc.TimeTableAPI.Where(s => s.Student_ID.ToUpper() == param.Student_ID.ToUpper()).ToList();
            var sql = String.Format(@"Select   * FROM ""Message"".""getTimeTableAPIEx""('{0}')", param.Student_ID.ToUpper());

            var result = this.dbc.TimeTableAPIEx.FromSql(sql).ToList();
            var timetableReport = new List<ResponseTimeTableAPIEx>();
            var timeModelList = new List<SubResponseTimeTableAPIEx>();
            var model = new ResponseTimeTableAPIEx();

            if (result.Count > 0)
            {

                var oldObj = result[0];

                foreach (var item in result)
                {
                    if (oldObj.Student_ID == item.Student_ID && oldObj.Day == item.Day)
                    {
                        var ttblModel = new SubResponseTimeTableAPIEx();
                        ttblModel.TeacherName = item.TeacherName;
                        ttblModel.SubjectName = item.SubjectName;
                        ttblModel.Room = item.Room;
                        ttblModel.ClassTime = item.StartTime + ' ' + '-' + ' ' + item.EndTime;
                        ttblModel.StaffId = item.StaffId;
                        timeModelList.Add(ttblModel);
                    }
                    else
                    {
                        model = new ResponseTimeTableAPIEx();
                        var index = result.IndexOf(item) - 1;
                        model.Name = result[index].Name;
                        model.Campus = result[index].Campus;
                        model.Section = result[index].Section;
                        model.Class = result[index].Class;
                        model.Day = result[index].Day;
                        model.TimeTableData.AddRange(timeModelList);
                        timetableReport.Add(model);

                        var ttblModel = new SubResponseTimeTableAPIEx();
                        ttblModel.TeacherName = item.TeacherName;
                        ttblModel.SubjectName = item.SubjectName;
                        ttblModel.Room = item.Room;
                        ttblModel.ClassTime = item.StartTime + ' ' + '-' + ' ' + item.EndTime;
                        ttblModel.StaffId = item.StaffId;
                        timeModelList = new List<SubResponseTimeTableAPIEx>();
                        timeModelList.Add(ttblModel);
                    }
                    oldObj = item;
                }
                model = new ResponseTimeTableAPIEx();
                var index2 = result.Count - 1;
                model.Name = result[index2].Name;
                model.Campus = result[index2].Campus;
                model.Section = result[index2].Section;
                model.Class = result[index2].Class;
                model.Day = result[index2].Day;
                model.TimeTableData.AddRange(timeModelList);
                timetableReport.Add(model);
            }
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = timetableReport;
            return Ok(MyDynamic);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_section([FromBody] Section_ExamType param)
        {
            return Ok(this.dbc.Sectionapi.Where(s => s.Teacher_ID == param.Teacher_ID)
                .Select(
                    x => new
                    {
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        subject_ID = x.Subject_ID,
                        subject_name = x.Subject_name

                    }
                ));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult get_section_question([FromBody] Section_ExamType param)
        {
            return Ok(this.dbc.VWSectionAPIQuestion.Where(s => s.Teacher_ID == param.Teacher_ID)
                .Select(
                    x => new
                    {
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        subject_ID = x.Subject_ID,
                        subject_name = x.Subject_name

                    }
                ));

        }

        // ********************************************************************************************************************************
        // ********************************************************************************************************************************
        // ********************************************************************************************************************************
        // ********************************************************************************************************************************

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_sectionEx([FromBody] Section_ExamType param)
        {
            return Ok(this.dbc.ExamSectionapiEx.Where(s => s.Teacher_ID == param.Teacher_ID)
                .Select(
                    x => new
                    {
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        SectionCourseLinkId = x.SectionCourseLinkId
                    }
                ));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_typeEx([FromBody] Section_ExamType param)
        {

            return Ok(this.dbc.ExamTypeAPIEx.Where(s => s.Teacher_ID == param.Teacher_ID && s.SectionCourseLinkId == param.SectionCourseLinkId)
                .Select(
                    x => new
                    {
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        teacher_ID = x.Teacher_ID,
                        teacher_Name = x.Teacher_Name,
                        examTypeId = x.ExamTypeId,
                        examType = x.ExamType,

                    }
                ));
        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult get_subjectsEx([FromBody] GetSubjects param)
        {

            return Ok(this.dbc.VWGetSubjectsEx.Where(s => s.Teacher_ID == param.Teacher_ID && s.SectionCourseLinkId == param.SectionCourseLinkId)
                .Select(
                    x => new
                    {
                        teacher_ID = x.Teacher_ID,
                        teacher_Name = x.Teacher_Name,
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        campus_Prog_ID = x.Campus_Prog_ID,
                        campus_Prog_Name = x.Campus_Prog_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        subject_ID = x.Subject_ID,
                        subject_Name = x.Subject_Name,
                        ProgramCourseLinkId = x.ProgramCourseLinkId

                    }
                ));

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_master([FromBody] ExamMonths param)
        {
            return Ok(this.dbc.VWGetExamMaster.Where(e => e.SectionCourseLinkId == param.SectionCourseLinkId && e.ProgramCourseLinkId == param.ProgramCourseLinkId && e.ExamTypeId == param.ExamTypeId)
            .Select(
                x => new
                {
                    ExamMasterId = x.ExamMasterId,
                    SectionCourseLinkId = x.SectionCourseLinkId,
                    ProgramCourseLinkId = x.ProgramCourseLinkId,
                    Sections_ID = x.Sections_ID,
                    Sections_Name = x.Sections_Name,
                    ExamTypeId = x.ExamTypeId,
                    Exam_Type = x.Exam_Type,
                    Subject_ID = x.Subject_ID,
                    Subject_Name = x.Subject_Name,
                    Dated = x.Dated.ToString("yyyy-MM-dd")
                }
            ));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_dataEx([FromBody] GetExamData param)
        {
            return Ok(this.dbc.VWExamData.Where(s => s.ExamMasterId == param.ExamMasterId).OrderBy(e => e.StudentID)
                .Select(
                    x => new
                    {
                        examMasterId = x.ExamMasterId,
                        examDetailId = x.ExamDetailId,
                        admission_ID = x.Admission_ID,
                        enrollment_ID = x.Enrollment_ID,
                        studentID = x.StudentID,
                        studentName = x.StudentName,
                        attendanceStatusId = x.AttendanceStatusId,
                        absent_ID = x.Absent_ID,
                        totalMarks = x.TotalMarks,
                        obtainedMarks = x.ObtainMarks,
                        dated = x.Dated,
                        shouldAbsent = x.ShouldAbsent,
                        IsApproved = x.IsApproved
                    }
                ));
        }

        // ********************************************************************************************************************************
        // ********************************************************************************************************************************
        // ********************************************************************************************************************************
        // ********************************************************************************************************************************

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_section([FromBody] Section_ExamType param)
        {
            return Ok(this.dbc.ExamSectionapi.Where(s => s.Teacher_ID == param.Teacher_ID).OrderBy(x => x.Sections_Name)
                .Select(
                    x => new
                    {
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        subject_ID = x.Subject_ID,
                        subject_name = x.Subject_name,
                        sectionCourseLinkId = x.SectionCourseLinkId,
                        programCourseLinkId = x.ProgramCourseLinkId

                    }
                ));

        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult get_exam_type([FromBody] Section_ExamType param)
        {

            return Ok(this.dbc.ExamTypeAPI.Where(s => s.Teacher_ID == param.Teacher_ID && s.Campus_ID == param.Campus_ID && s.Sections_ID == param.Sections_ID)
                .Select(
                    x => new
                    {
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        teacher_ID = x.Teacher_ID,
                        teacher_Name = x.Teacher_Name,
                        examTypeId = x.ExamTypeId,
                        examType = x.ExamType,

                    }
                ));

        }



        [HttpPost]
        [Route("[action]")]

        public IActionResult get_subjects([FromBody] GetSubjects param)
        {

            return Ok(this.dbc.VWGetSubjects.Where(s => s.Teacher_ID == param.Teacher_ID && s.Campus_ID == param.Campus_ID && s.Sections_ID == param.Sections_ID)
                .Select(
                    x => new
                    {
                        teacher_ID = x.Teacher_ID,
                        teacher_Name = x.Teacher_Name,
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        campus_Prog_ID = x.Campus_Prog_ID,
                        campus_Prog_Name = x.Campus_Prog_Name,
                        sections_ID = x.Sections_ID,
                        sections_Name = x.Sections_Name,
                        subject_ID = x.Subject_ID,
                        subject_Name = x.Subject_Name,
                        ProgramCourseLinkId = x.ProgramCourseLinkId
                    }
                ));

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult get_section_program_link([FromBody] SectionProgramLink param)
        {
            return Ok(this.dbc.VWSectionProgramLink.Where(e => e.SectionId == param.Sections_ID && e.ExamTypeId == param.ExamTypeId && e.CourseId == param.Subject_ID)
            .Select(
                x => new
                {
                    sectionCourseLinkId = x.SectionCourseLinkId,
                    programCourseLinkId = x.ProgramCourseLinkId
                }
            ));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_months([FromBody] ExamMonths param)
        {
            return Ok(this.dbc.VWExamMonths.Where(e => e.SectionCourseLinkId == param.SectionCourseLinkId && e.ProgramCourseLinkId == param.ProgramCourseLinkId && e.ExamTypeId == param.ExamTypeId)
            .Select(
                x => new
                {
                    examMasterId = x.ExamMasterId,
                    dated = x.Dated,
                    SectionCourseLinkId = x.SectionCourseLinkId,
                    ProgramCourseLinkId = x.ProgramCourseLinkId,
                    examTypeId = x.ExamTypeId
                }
            ));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_data([FromBody] GetExamData param)
        {
            return Ok(this.dbc.VWExamData.Where(s => s.ExamTypeId == param.Exam_Type_ID && s.SectionCourseLinkId == param.SectionCourseLinkId && s.ProgramCourseLinkId == param.ProgramCourseLinkId).OrderBy(e => e.StudentID)
                .Select(
                    x => new
                    {
                        examMasterId = x.ExamMasterId,
                        examDetailId = x.ExamDetailId,
                        admission_ID = x.Admission_ID,
                        enrollment_ID = x.Enrollment_ID,
                        studentID = x.StudentID,
                        studentName = x.StudentName,
                        attendanceStatusId = x.AttendanceStatusId,
                        absent_ID = x.Absent_ID,
                        totalMarks = x.TotalMarks,
                        obtainedMarks = x.ObtainMarks,
                        dated = x.Dated,
                        shouldAbsent = x.ShouldAbsent,
                        IsApproved = x.IsApproved
                    }
                ));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult submit_exam([FromBody] List<SubmitExamData> param)
        {
            var examdetailList = new List<ExamdetailTemp>();
            if (param.Count > 0)
            {
                foreach (var item in param)
                {
                    var list = this.dbc.VWExamData.Where(s => s.ExamDetailId == item.ExamDetailId).ToList();

                    var examdetailmodel = new ExamdetailTemp();
                    examdetailmodel.ExamDetailId = item.ExamDetailId;
                    examdetailmodel.AttendanceStatusId = item.AttendanceOptionIDs;
                    examdetailmodel.ObtainMarks = item.ObtainedMarks;
                    examdetailList.Add(examdetailmodel);
                }
            }
            var query = String.Format(@"SELECT * FROM ""Message"".""UpdateExam""('{0}')", JsonConvert.SerializeObject(examdetailList));

            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(1);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_report([FromBody] ExamReport param)
        {
            return Ok(this.dbc.VWExamReport.Where(e => e.Exam_Type_ID == param.Exam_Type_ID && e.SectionCourseLinkId == param.SectionCourseLinkId && e.ProgramCourseLinkId == param.ProgramCourseLinkId)
                .Select(
                    x => new
                    {
                        Exam_Schedule_ID = x.ExamType,
                        TotalMarks = x.TotalMarks,
                        Enrollment_ID = x.RollNo,
                        Student_ID = x.RollNo,
                        Student_Name = x.StudentName,
                        ObtainedMarks = x.ObtainMarks,
                        Grade = x.Grades
                    }
                ));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_exam_comparison([FromBody] GetExamComparison param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""ExamComparison""('{0}','{1}','{2}')", param.Teacher_ID, JsonConvert.SerializeObject(param.SCLData), JsonConvert.SerializeObject(param.ETData));
            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var res = connection.Query<GetExamComparisonResponse>(sql).ToList();
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(res);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_student_info([FromBody] StudentInfo param)
        {
            var sql = string.Format(@"SELECT * FROM ""Message"".""StudentInfo""('{0}','{1}','{2}','{3}')", param.Teacher_ID, param.Campus_ID, param.Sections_ID, param.Subject_ID);
            var result = this.dbc.StudentInfoMain.FromSql(sql).OrderBy(s => s.StudentID).ToList();
            var responselist = new List<StudentInfoResponse>();
            var subresponsepastresultlist = new List<PastResult>();
            var subresponseacademicinfolist = new List<AcademicInfo>();

            var model = new StudentInfoResponse();

            if (result.Count > 0)
            {
                var oldobj = result[0];

                foreach (var item in result)
                {
                    if (oldobj.StudentID == item.StudentID)
                    {
                        var subresponse = new PastResult();
                        subresponse.ExamType = item.ExamType;
                        subresponse.ExamTotalMarks = item.ExamTotalMarks;
                        subresponse.ExamObtainMarks = item.ExamObtainMarks;
                        subresponsepastresultlist.Add(subresponse);

                        var subresponseacademic = new AcademicInfo();
                        subresponseacademic.Degree = item.Degree;
                        subresponseacademic.Total = item.Total;
                        subresponseacademic.Obtained = item.Obtained;

                        if (subresponseacademicinfolist.FindIndex(e => e.Degree == item.Degree) < 0)
                        {
                            subresponseacademicinfolist.Add(subresponseacademic);
                        }
                    }
                    else
                    {
                        model = new StudentInfoResponse();
                        var index = result.IndexOf(item) - 1;
                        model.StudentID = result[index].StudentID;
                        model.StudentName = result[index].StudentName;
                        model.AttendancePercentage = result[index].AttendancePercentage;
                        model.past_result_data.AddRange(subresponsepastresultlist);
                        model.academic_info_data.AddRange(subresponseacademicinfolist);
                        responselist.Add(model);

                        var subresponse = new PastResult();
                        subresponse.ExamType = item.ExamType;
                        subresponse.ExamTotalMarks = item.ExamTotalMarks;
                        subresponse.ExamObtainMarks = item.ExamObtainMarks;
                        subresponsepastresultlist.Add(subresponse);

                        var subresponseacademic = new AcademicInfo();
                        subresponseacademic.Degree = item.Degree;
                        subresponseacademic.Total = item.Total;
                        subresponseacademic.Obtained = item.Obtained;
                        //subresponseacademicinfolist.Add(subresponseacademic);
                        if (subresponseacademicinfolist.FindIndex(e => e.Degree == item.Degree) < 0)
                        {
                            subresponseacademicinfolist.Add(subresponseacademic);
                        }

                        subresponsepastresultlist = new List<PastResult>();
                        subresponsepastresultlist.Add(subresponse);

                        subresponseacademicinfolist = new List<AcademicInfo>();
                        subresponseacademicinfolist.Add(subresponseacademic);

                    }
                    oldobj = item;
                }
                model = new StudentInfoResponse();
                var index2 = result.Count - 1;
                model.StudentID = result[index2].StudentID;
                model.StudentName = result[index2].StudentName;
                model.AttendancePercentage = result[index2].AttendancePercentage;
                model.past_result_data.AddRange(subresponsepastresultlist);
                model.academic_info_data.AddRange(subresponseacademicinfolist);
                responselist.Add(model);
            }

            return Ok(responselist.OrderBy(e => e.StudentID));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult update_attendence_students_list([FromBody] UpdateAttendanceStudentList param)
        {

            return Ok(this.dbc.AttendanceLectureData.Where(s => s.TimeTableID == param.TimeTableID && s.Dated == param.Dated)
                .Select(
                    x => new
                    {
                        enrollmentId = x.Enrollment_ID,
                        admissionFormId = x.Admission_ID,
                        studentID = x.StudentID,
                        studentName = x.StudentName,
                        absent_ID = x.Absent_ID
                    }
                ));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult students_fee_list([FromBody] FeeRequestData param)
        {

            // var result = this.dbc.VWFeeApi.Where(s => s.Student_ID.ToUpper() == param.Student_Id.ToUpper() && s.Class_Level_Id == param.Class_Level_Id);
            var sql = String.Format(@"SELECT * FROM ""Message"".""GetStudentChallanProfile""('{0}', '{1}')", param.Student_Id, param.Class_Level_Id);
            var result = this.dbc.VWFeeApi.FromSql(sql)
            .Select(
                    x => new
                    {
                        Challan_Number = x.Challan_Number,
                        Amount = x.Amount,
                        Due_date = x.Due_date.ToString("dd-MM-yyyy"),
                        received_date = x.received_date.ToString("dd-MM-yyyy"),
                        Status = x.Status,
                        ConcessionType = x.ConcessionType,
                        INstallment = x.INstallment,
                        Msg = x.Msg,
                        Installment_Order = x.Installment_Order,
                        Challan_Instruction_Type = x.Challan_Instruction_Type,
                        Class_ID = x.Class_ID,
                        Chalan_type_name = x.Chalan_type_name,
                    });

            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = result;
            return Ok(MyDynamic);
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult students_fee_list_DueDateCalculate([FromBody] FeeRequestData param)
        {

            // var result = this.dbc.VWFeeApi.Where(s => s.Student_ID.ToUpper() == param.Student_Id.ToUpper() && s.Class_Level_Id == param.Class_Level_Id);
            var sql = String.Format(@"SELECT * FROM ""Message"".""GetStudentChallanProfileprintbutton""('{0}', '{1}')", param.Student_Id, param.Class_Level_Id);
            var result = this.dbc.VWFeeApiPrintButton.FromSql(sql)
            .Select(
                    x => new
                    {
                        Challan_Number = x.Challan_Number,
                        Amount = x.Amount,
                        Due_date = x.Due_date.ToString("dd-MM-yyyy"),
                        received_date = x.received_date.ToString("dd-MM-yyyy"),
                        Status = x.Status,
                        ConcessionType = x.ConcessionType,
                        INstallment = x.INstallment,
                        Msg = x.Msg,
                        Installment_Order = x.Installment_Order,
                        Challan_Instruction_Type = x.Challan_Instruction_Type,
                        Class_ID = x.Class_ID,
                        Chalan_type_name = x.Chalan_type_name,
                        AllowButton = x.AllowButton,
                    });

            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = result;
            return Ok(MyDynamic);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult get_campuses([FromBody] GetCampuses param)
        {
            return Ok(this.dbc.VWGetCampuses.Where(s => s.Teacher_ID == param.Teacher_ID)
                .Select(
                    x => new
                    {
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        teacher_ID = x.Teacher_ID,
                        teacher_Name = x.Teacher_Name
                    }
                ));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_programs([FromBody] GetPrograms param)
        {
            return Ok(this.dbc.VWGetPrograms.Where(s => s.Teacher_ID == param.Teacher_ID && s.Campus_ID == param.Campus_ID && s.SessionId == param.SessionId)
                .Select(
                    x => new
                    {

                        teacher_ID = x.Teacher_ID,
                        teacher_Name = x.Teacher_Name,
                        campus_ID = x.Campus_ID,
                        campus_Name = x.Campus_Name,
                        campus_Prog_ID = x.Campus_Prog_ID,
                        campus_Prog_Name = x.Campus_Prog_Name,
                    }
                ));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult get_teacher_timetable([FromBody] GetTeacherTimeTable param)
        {
            var sql = String.Format(@"SELECT * FROM ""Examination"".""get_teacher_timetable""('{0}' )", param.Teacher_ID);
            var result = this.dbc.TimeTableReportData.FromSql(sql)
               .Select(x => new
               {
                   timeTableID = x.TimeTableID,
                   teacher_ID = x.Teacher_ID,
                   teacher_Name = x.Teacher_Name,
                   dayName = x.Day,
                   slotTimingId = x.Slot_ID,
                   timeStart = x.TimeStart,
                   timeEnd = x.TimeEnd,
                   subject_ID = x.Subject_ID,
                   subject_Name = x.Subject_Name,
                   roomId = x.Room_ID,
                   roomName = x.Room_Name,
                   classId = x.ClassId,
                   className = x.Class_Prog_Name,
                   campusID = x.Campus_ID,
                   campusName = x.Campus_Name,
                   campus_Prog_ID = x.Campus_Prog_ID,
                   sections_ID = x.Sections_ID,
                   sections_Name = x.Sections_Name
               });
            //     dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            // MyDynamic.Status = "900";
            // MyDynamic.Message = "Success";
            // MyDynamic.Data = result;
            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult student_attendance_monthly_single([FromBody] StudentAttendanceInfo param)
        {
            var sql = string.Format(@"SELECT * FROM ""Message"".""StudentAttendanceMonthlyInfo""('{0}')", param.Student_ID);
            return Ok(this.dbc.StudentAttendanceInfoResponseModel.FromSql(sql)
                .Select(
                    x => new
                    {
                        admissionFormId = x.AdmissionFormId,
                        rollNo = x.RollNo,
                        classId = x.ClassId,
                        className = x.ClassName,
                        totalLectures = x.TotalLectures,
                        attendance_Percentage = x.Attendance_Percentage,
                        present_Count = x.Present_Count,
                        absent_Count = x.Absent_Count,
                        leave_Count = x.Leave_Count,
                        month = x.Month,
                        month_Start_Date = x.Month_Start_Date,
                        month_End_Date = x.Month_End_Date,
                    }
                ));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult student_attendance_monthly_single_month_wise([FromBody] StudentMonthlyInfomonthwise param)
        {
            var fromDate = string.Format("{0:yyyy-MM-dd}", Convert.ToDateTime(param.Start_Date));

            var sql = string.Format(@"SELECT * FROM ""Message"".""StudentAttendanceMonthlyInfoDateWise""('{0}','{1}')", param.Student_ID, fromDate);
            return Ok(this.dbc.StudentAttendanceInfoResponseModel.FromSql(sql)
                .Select(
                    x => new
                    {
                        admissionFormId = x.AdmissionFormId,
                        rollNo = x.RollNo,
                        classId = x.ClassId,
                        className = x.ClassName,
                        totalLectures = x.TotalLectures,
                        attendance_Percentage = x.Attendance_Percentage,
                        present_Count = x.Present_Count,
                        absent_Count = x.Absent_Count,
                        leave_Count = x.Leave_Count,
                        month = x.Month,
                        month_Start_Date = x.Month_Start_Date,
                        month_End_Date = x.Month_End_Date,
                    }
                ));
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult attendance_cms([FromBody] Attendance_CMS param)
        {
            //Previous Function Name 
            //attendance_cms
            string sql = String.Format(@"SELECT * FROM ""Message"".""attendance_cmsEx""('{0}', '{1}')", param.Student_ID, param.Class_Level_ID);

            var result = dbc.AttendanceResponseModel_CMS.FromSql(sql);
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = result;
            return Ok(MyDynamic);
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult get_teacher_list([FromBody] GetTeacherList param)
        {
            var newparam = string.Empty;
            newparam = param.Student_ID;

            if (string.IsNullOrEmpty(newparam))
            {
                newparam = param.StudentID;
            }

            var sql = String.Format(@"SELECT * FROM ""Message"".""get_teacher_list""('{0}')", newparam);

            var result = dbc.GetTeacherListresponse.FromSql(sql)
                .Select(
                    x => new
                    {
                        teacher_ID = x.Teacher_ID,
                        teacher_Name = x.Teacher_Name,
                        studentName = x.StudentName,
                        studentID = x.StudentID,
                        subject_ID = x.Subject_ID,
                        subject_Name = x.Subject_Name
                    }
                );
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = result;
            return Ok(MyDynamic);
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult send_question([FromBody] SendQuestion param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""SendQuestion""('{0}','{1}','{2}','{3}','{4}')", param.Question, param.Student_ID, param.Teacher_ID, param.Subject_ID, param.Section_ID);

            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult send_questionEx([FromBody] SendQuestionEx param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""SendQuestionEx""('{0}','{1}','{2}','{3}','{4}','{5}','{6}')", param.Question, param.Student_ID, param.Teacher_ID, param.Subject_ID, param.Section_ID, param.From, param.Topic);
            Console.WriteLine(sql);
            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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

        [Authorize]
        [HttpPost]
        [Route("[action]")]
        public IActionResult insert_TeacherResponse([FromBody] TeacherReaponseEx param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""InsertTeacherResponse""('{0}','{1}')", param.QuestionId, param.Answer);
            Console.WriteLine(sql);
            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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



        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult insert_MarkExam([FromBody] InsertExam param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""ExamBulkInserttablet""('{0}','{1}','{2}','{3}')", param.list, param.SectionCourseLinkId, param.ProgramCourseLinkId, param.ExamScheduleId);
            Console.WriteLine(sql);
            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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


        [HttpPost]
        [Route("[action]")]
        public IActionResult get_questions([FromBody] GetQuestions param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""get_questions""('{0}','{1}','{2}')", param.Teacher_ID, param.Section_ID, param.Subject_ID);

            var result = dbc.GetQuestionsResponse.FromSql(sql);
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            MyDynamic.Status = "900";
            MyDynamic.Message = "Success";
            MyDynamic.Data = result;
            return Ok(MyDynamic);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult mark_read([FromBody] MarkRead param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""MarkRead""('{0}')", param.Question_ID);

            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult delete_question([FromBody] MarkRead param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""DeleteQuestion""('{0}')", param.Question_ID);

            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult question_count([FromBody] GetQuestions param)
        {
            var sql = String.Format(@"SELECT * FROM ""Message"".""QuestionCount"" ('{0}')", param.Teacher_ID);
            return Ok(this.dbc.Count.FromSql(sql)
            .Select(
                x => new
                {
                    questionCount = x.QuestionCount
                }
            ));
        }
        private void SetAntiforgeryCookies()
        {
            var context = this.HttpContext;
            var tokenSet = antiForgeryService.GetAndStoreTokens(context);

            if (tokenSet.RequestToken != null)
            {
                string clientName = this.serverConfig.AntiForgery.ClientName;
                context.Response.Cookies.Append(clientName, tokenSet.RequestToken, new CookieOptions() { HttpOnly = false, Secure = true });
            }
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult ExamResultStudentApp([FromBody] ExamResultParam param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""Message"".""ExamResultStudentApp1Ex"" ('{0}','{1}','{2}')", param.Student_ID, param.Class_Exam_ID, param.Exm_Dated);

            var result = this.dbc.ExamresultResponse.FromSql(sql).ToList<ExamresultResponse>();

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

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult ExamResultStudentAppEx([FromBody] ExamResultParamEX param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""Message"".""ExamResultStudentApp1Exam2"" ('{0}','{1}','{2}')", param.Student_ID, param.Class_Exam_ID, param.Exm_Title);

            var result = this.dbc.ExamresultResponse.FromSql(sql).ToList<ExamresultResponse>();

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

        //***************************Bank API's**************************
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult Inquiry([FromBody] Inquiry param)
        {
            var rtv = new RTV() { ReturnValue = "" };
            var Data = this.log.GetLog();
            IDbConnection connection = dbc.Database.GetDbConnection();

            try
            {
                string json = String.Format("SELECT \"Fee\".\"APICheckChallan\"('{0}','{1}') as ProvidedString", param.p_ChallanNumber, Data);
                // Console.WriteLine(json);
                // Predicate[] res = (this.dbc.Predicate.FromSql(String.Format("SELECT \"Fee\".\"APICheckChallan\"('{0}','{1}') as ProvidedString", param.p_ChallanNumber,Data))).ToArray<Predicate>();
                // if (res.Length > 0)
                // {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                rtv.ReturnValue = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;


                if (rtv.ReturnValue.ToString() == "0" || rtv.ReturnValue.ToString() == "4")
                {
                    return Ok(GetResponseFromDB(param, Convert.ToInt16(rtv.ReturnValue.ToString())));
                }
                else
                {

                    if (connection.State == ConnectionState.Open)
                    {
                        connection.Close();
                        connection.Dispose();
                    }
                    return Ok(rtv);
                }
                // }
                //return BadRequest ("No Data base been selected from database.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult Payment([FromBody] Payment param)
        {
            var payment = new PaymentController(log, dbc, email);
            return payment.Payment(param);

            // IDbConnection connection = dbc.Database.GetDbConnection();

            // // string json = JsonConvert.SerializeObject(param);
            // var Data = this.log.GetLog();

            // var rtv = new RTV() { ReturnValue = "" };
            // string json = String.Format("SELECT \"Fee\".\"APICheckChallanStatus\"('{0}','{1}',{2},'{3}','{4}') as ProvidedString", param.p_ChallanNumber, param.p_TransactionId, param.p_Amount, Data, param.p_UserName);

            // string jsonq = String.Format("SELECT * from  \"Fee\".\"CheckChallan\"('{0}')", param.p_ChallanNumber);


            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();
            // rtv.ReturnValue = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;
            // if (rtv.ReturnValue == "0" && param.p_Amount == 500)
            // {
            //     var data = this.dbc.ChQuery.FromSql(jsonq).ToList();
            //     if (data[0].FullName != "NAN")
            //     {
            //         var messageEx = "<!DOCTYPE htmlPUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"https://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\"xmlns:o=\"urn:schemas-microsoft-com:office:office\"><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><title>CMS EMAIL</title><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0 \"><meta name=\"format-detection\" content=\"telephone=no\"><style type=\"text/css\">    body {        margin: 0 !important;        padding: 0 !important;        -webkit-text-size-adjust: 100% !important;        -ms-text-size-adjust: 100% !important;        -webkit-font-smoothing: antialiased !important;    }    .em_body {        width: 100%;        height: auto;        background-color: #fafafa;    }    .logo-img {        padding: 20px;    }    .side-img {        height: 100vh;    }    .content {        margin: 30px;    }    table {        width: 100%;        border-collapse: collapse;    }    td,    a,    span {        border-collapse: collapse;    }    p {        font-size: 16px;    }    .em_main_table {        width: 100%;    }    @media only screen and (min-width:480px) and (max-width:699px) {        .em_main_table {            width: 90% !important;            padding-right: 15px;        }    }</style></head><body class=\"em_body\"><table>    <tbody>        <tr>            <td>                <img src=\"https://onlineadmissions.cms.edu.pk/logocms.png\" class=\"logo-img\" width=\"250px\">                <table class=\"content em_main_table\" style=\"padding-right: 10px;\">                    <tbody>                        <tr>                            <td>                                <h3 style=\"margin-bottom: 0; color: #fff;\">Thank you for Registering</h3>                                <span style=\"color: #fff;\"> Dear</span>                                <h3 style=\"display: inline-block; color: #fff;\">Jhon Smith</h3>,                                <br>                                <p style=\"color: #fff; word-wrap: break-word;\">Thank you for your interest in Campus Management System.</p>                                <p style=\"color: #fff; word-wrap: break-word;\">                                    You have successfully created an online account with the following credentials:                                </p>                                <div>                                    <p style=\"display: inline-block;margin: 0; color: #fff;\">Username:</p>                                    <h3 style=\"color: #e13b28; display: inline-block;margin: 0;\">ABC                                    </h3>                                </div>                                <div>                                    <p style=\"display: inline-block; margin: 0; color: #fff;\">Password:</p>                                    <h3 style=\"color: #e13b28; display: inline-block; margin: 0;\">                                        1234567</h3>                                </div>                                <p style=\"color: #fff;word-wrap: break-word;\">                                    Please <span style=\"color:#e13b28 !important; font-weight: 600;\">login</span>                                    and proceed with the                                    application process.                                </p>                                <p style=\"color: #fff; word-wrap: break-word;\">                                    In case of any queries, please call our helpline at <span                                        style=\"color:#e13b28 !important; font-weight: 600;\">0800-78608</span> for                                    assistance.                                </p>                                <h3 style=\"color: #fff;\">Good Luck!</h3>                                <h3 style=\"color: #fff; margin-bottom:0;\">Admissions office</h3>                                <h3 style=\"color: #fff; margin: 0;\">Campus Management</h3>                            </td>                        </tr>                    </tbody>                </table>            </td>            <td width=10%>                <img src=\"https://onlineadmissions.cms.edu.pk/mainbg.png\" class=\"side-img\">            </td>        </tr>    </tbody></table></body></html>";
            //         BackgroundJob.Enqueue(() => this.SendEamilEy(data[0].Email, messageEx));
            //         // var client = new BackgroundJobClient();
            //         // client.Enqueue(() => this.SendEamilEy(data[0].Email, messageEx));
            //     }
            // }

            // if (connection.State == ConnectionState.Open)
            // {
            //     connection.Close();
            //     connection.Dispose();
            // }
            // if (rtv.ReturnValue != null)
            // {
            //     return Ok(rtv);
            // }
            // else
            //     return Ok(null);
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public void SendEamilEy(string v1, string v2)
        {
            var message = this.email.GetMessageObjForAuthLoginEmailEx(v1, v2);
            message.Subject = "Thank You for registering with CMS";
            message.Body = new TextPart("html")
            {
                Text = v1
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("onlineadmissions@cms.edu.pk", "P@kist0n123");
                client.Send(message);
                client.Disconnect(true);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult Reverse([FromBody] Reverse param)
        {
            //string json = JsonConvert.SerializeObject(param);

            IDbConnection connection = dbc.Database.GetDbConnection();
            var Data = this.log.GetLog();
            string json = (String.Format("SELECT \"Fee\".\"APIReverse\"('{0}','{1}','{2}') as ProvidedString", param.p_OriginalTransactionId, param.p_ReverseTransactionId, Data));
            // Console.WriteLine(json);
            var rtv = new RTV() { ReturnValue = "" };
            //// Console.WriteLine((String.Format("SELECT \"Fee\".\"APIReverse\"('{0}','{1}','{2}',) as ProvidedString", param.p_OriginalTransactionId, param.p_ReverseTransactionId, Data)));

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            rtv.ReturnValue = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            if (rtv.ReturnValue != null)
            {
                return Ok(rtv);
            }
            else
                return Ok(null);
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IList<InquiryResponseModel> GetResponse([FromBody] Inquiry param)
        {
            string sql = String.Format(@"SELECT
""Admission"".""Students"".""FullName"" AS ""p_StudentName"",
""Admission"".""AdmissionForm"".""RefferenceNo"" AS ""p_ReferenceNo"",
""Fee"".""StudentChallan"".""InstallmentNo"",
""Fee"".""StudentChallan"".""ChallanNo"" AS ""p_challanNumber"",
""Fee"".""StudentChallan"".""FeeAmount"" AS ""p_Amount"",
date_part('year', ""Fee"".""StudentChallan"".""DueDate"") || '-' || date_part('month', ""Fee"".""StudentChallan"".""DueDate"") || '-' || date_part('day', ""Fee"".""StudentChallan"".""DueDate"") AS ""p_DueDate"",
date_part('year', ""Fee"".""StudentChallan"".""DueDate"") || '-' || date_part('month', ""Fee"".""StudentChallan"".""DueDate"") AS ""p_BillingMonth"",
""Setup"".""VWCampusProgramLink"".""CampusName"" AS ""p_CampusName"",
""Setup"".""BusinessUnit"".""FullName"" AS ""p_CompanyName"",
""Setup"".""Campus"".""CustomerCode"" AS ""p_CustomerCode"",
'0' AS ""ReturnValue""
FROM
""Admission"".""AdmissionForm""
INNER JOIN ""Admission"".""Students"" ON ""Admission"".""AdmissionForm"".""StudentId"" = ""Admission"".""Students"".""StudentId"" AND ""Admission"".""AdmissionForm"".""StatusId"" = ""Admission"".""Students"".""StatusId""
INNER JOIN ""Fee"".""StudentChallan"" ON ""Fee"".""StudentChallan"".""AdmissionFormId"" = ""Admission"".""AdmissionForm"".""AdmissionFormId"" AND ""Admission"".""AdmissionForm"".""StatusId"" = ""Fee"".""StudentChallan"".""StatusId""
INNER JOIN ""Setup"".""VWCampusProgramLink"" ON ""Admission"".""AdmissionForm"".""CampusProgramId"" = ""Setup"".""VWCampusProgramLink"".""CampusProgramId""
INNER JOIN ""Setup"".""Campus"" ON ""Setup"".""VWCampusProgramLink"".""CampusId"" = ""Setup"".""Campus"".""CampusId"" AND ""Setup"".""VWCampusProgramLink"".""StatusId"" = ""Setup"".""Campus"".""StatusId""
INNER JOIN ""Setup"".""Institution"" ON ""Setup"".""Campus"".""InstitutionId"" = ""Setup"".""Institution"".""InstitutionId"" AND ""Setup"".""Campus"".""StatusId"" = ""Setup"".""Institution"".""StatusId""
INNER JOIN ""Setup"".""BusinessUnit"" ON ""Setup"".""Institution"".""BusinessUnitID"" = ""Setup"".""BusinessUnit"".""BusinessUnitId"" AND ""Setup"".""Institution"".""StatusId"" = ""Setup"".""BusinessUnit"".""StatusId""
where  ""Fee"".""StudentChallan"".""ChallanNo""='{0}'", param.p_ChallanNumber);
            return this.dbc.InquiryResponseModel.FromSql(sql).ToList<InquiryResponseModel>();
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IList<InquiryResponseModel> GetResponseFromDB([FromBody] Inquiry param, Int16 code)
        {
            string sql = String.Format(@"select * from  ""Fee"".""APITestingData""({0},'{1}')", code, param.p_ChallanNumber);
            // Console.WriteLine(sql);
            return this.dbc.InquiryResponseModel.FromSql(sql).ToList<InquiryResponseModel>();
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult GetStudentProfileDBEx([FromBody] dynamic param)
        {
            string studentid = param.Student_ID;
            string deviceid = param.Device_ID;

            string sql = String.Format(@"select * from  ""Message"".""GetStudentProfileEx2""('{0}')", studentid);
            // Console.WriteLine(sql);
            return Ok(this.dbc.APIStudentProfileResponseEx.FromSql(sql));
        }




        [HttpPost]
        [Authorize]
        [Route("[action]")]

        public IActionResult GetStudentProfileDB([FromBody] dynamic param)
        {
            var rtv = new ApIStudentResponse() { Status = "", Message = "No Data Found" };
            string studentid = param.Student_ID;
            string deviceid = param.Device_ID;
            try
            {
                Predicate[] res = (this.dbc.Predicate.FromSql(String.Format("SELECT \"Message\".\"Get_Student_Info\"('{0}') as ProvidedString", studentid))).ToArray<Predicate>();
                if (res.Length > 0)
                {
                    rtv.Status = res[0].ProvidedString.ToString();

                    if (res[0].ProvidedString.ToString() == "900")
                    {
                        return Ok(GetStudentResponseFromDbOld(studentid, (res[0].ProvidedString.ToString())));
                    }
                    else
                    {
                        return Ok(rtv);
                    }
                }
                return BadRequest("No Data base been selected from database.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        // [Authorize]
        [Route("[action]")]

        public IActionResult GetStudentProfileDB_Encrypt([FromBody] dynamic param)
        {
            var rtv = new ApIStudentResponse() { Status = "", Message = "No Data Found" };
            var std = param?.Student_ID?.ToString() ?? "";
            var device = param?.Device_ID?.ToString() ?? "";
            string studentid = this.encryptionService.Decrypt(std);
            string deviceid = this.encryptionService.Decrypt(device);
            try
            {
                Predicate[] res = (this.dbc.Predicate.FromSql(String.Format("SELECT \"Message\".\"Get_Student_Info\"('{0}') as ProvidedString", studentid))).ToArray<Predicate>();
                if (res.Length > 0)
                {
                    rtv.Status = res[0].ProvidedString.ToString();

                    if (res[0].ProvidedString.ToString() == "900")
                    {
                        var resp = GetStudentResponseFromDb(studentid, (res[0].ProvidedString.ToString()));
                        string jsonResponse = JsonConvert.SerializeObject(resp);
                        string encryptedResponse = this.encryptionService.Encrypt_plain(jsonResponse);
                        return Ok(encryptedResponse);
                    }
                    else
                    {
                        string jsonResponse = JsonConvert.SerializeObject(rtv);
                        string encryptedResponse = this.encryptionService.Encrypt_plain(jsonResponse);
                        return Ok(encryptedResponse);
                    }
                }
                return BadRequest("No Data base been selected from database.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult GetStudentProfileRef([FromBody] dynamic param)
        {
            var rtv = new ApIStudentResponse() { Status = "", Message = "No Data Found" };
            string reffno = param.RefferenceNo;
            string deviceid = param.Device_ID;
            try
            {
                Predicate[] res = (this.dbc.Predicate.FromSql(String.Format("SELECT \"Message\".\"Get_Student_Info_ref\"('{0}') as ProvidedString", reffno))).ToArray<Predicate>();
                if (res.Length > 0)
                {
                    rtv.Status = res[0].ProvidedString.ToString();

                    if (res[0].ProvidedString.ToString() == "900")
                    {
                        return Ok(GetStudentResponseFromRef(reffno, (res[0].ProvidedString.ToString())));
                    }
                    else
                    {
                        return Ok(rtv);
                    }
                }
                return BadRequest("No Data base been selected from database.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]

        [Route("[action]")]
        public IList<APIStudentProfileResponseNewEx> GetStudentResponseFromDb(string Stdid, string status)
        {

            string sql = String.Format(@"select * from  ""Message"".""GetStudentProfile""('{0}','{1}')", Stdid, status);
            // Console.WriteLine(sql);
            return this.dbc.APIStudentProfileResponseNewEx.FromSql(sql).ToList<APIStudentProfileResponseNewEx>();
        }

        [HttpPost]

        [Route("[action]")]
        public IList<APIStudentProfileResponseNew> GetStudentResponseFromDbOld(string Stdid, string status)
        {

            string sql = String.Format(@"select * from  ""Message"".""GetStudentProfile_old""('{0}','{1}')", Stdid, status);
            // Console.WriteLine(sql);
            return this.dbc.APIStudentProfileResponseNew.FromSql(sql).ToList<APIStudentProfileResponseNew>();
        }



        //         [HttpPost]
        //    [AllowAnonymous]
        //         [IgnoreAntiforgeryToken]
        //         [Route("[action]")]
        //         public IList<StudentProfileMarchantile> GetStudentProfileMarchantile(Guid Stdid)
        //         {

        //             string sql = String.Format(@"select * from  ""Message"".""GetStudentProfileMarchantile""('{0}')", Stdid);
        //             // Console.WriteLine(sql);
        //             return this.dbc.StudentProfileMarchantile.FromSql(sql).ToList<StudentProfileMarchantile>();
        //         }


        // [HttpPost]
        // [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        // [Route("[action]")]
        // public IList<StudentProfileMarchantile> GetStudentProfileMarchantile([FromBody] JObject payload)
        // {
        //     if (payload == null || !payload.ContainsKey("Student_ID"))
        //     {
        //         return new List<StudentProfileMarchantile>(); // Return empty list if input is invalid
        //     }

        //     Guid Stdid;
        //     if (!Guid.TryParse(payload["Student_ID"]?.ToString(), out Stdid))
        //     {
        //         return new List<StudentProfileMarchantile>(); // Return empty list if GUID is invalid
        //     }

        //     string sql = @"select * from  ""Message"".""GetStudentProfileMarchantile""(@p0)";
        //     return this.dbc.StudentProfileMarchantile.FromSql(sql, Stdid).ToList();
        // }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetStudentProfileMerchandise([FromBody] Predicate model)
        {
            try
            {
                // Extracting the parameters
                var admissionFormId = new Guid(model.ProvidedString.Split("?")[0]);

                // Raw SQL query
                string sql = String.Format(@"SELECT * FROM ""Message"".""GetStudentProfileMarchantile""('{0}')", admissionFormId);
                Console.WriteLine(sql);

                // Execute the SQL and map to the model
                var attendanceExamData = dbc.StudentProfileMarchantile.FromSql(sql).ToList();

                // Deserialize JSON fields to their respective classes
                foreach (var record in attendanceExamData)
                {
                    record.DetailJsonString = JsonConvert.DeserializeObject<List<Detail>>(record.DetailData);
                    record.CampusDetailJsonString = JsonConvert.DeserializeObject<List<CampusDetail>>(record.CampusDetailData);
                    record.DetailData = string.Empty;
                    record.CampusDetailData = string.Empty;
                }



                return Ok(attendanceExamData);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Error fetching student exam attendance report.");
            }
        }

        [HttpPost]

        [Route("[action]")]
        public IList<APIStudentProfileResponseReff> GetStudentResponseFromRef(string Stdid, string status)
        {

            string sql = String.Format(@"select * from  ""Message"".""GetStudentProfileRef""('{0}','{1}')", Stdid, status);
            // Console.WriteLine(sql);
            return this.dbc.APIStudentProfileResponseReff.FromSql(sql).ToList<APIStudentProfileResponseReff>();
        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetStudentNotification([FromBody] NotificationParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""StudentNotification""('{0}','{1}')", obj.Student_ID, obj.limits);
            return Ok(this.dbc.NotificationOutPut.FromSql(sql));
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]

        [Route("[action]")]
        public IActionResult GetParentNotification([FromBody] NotificationParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""ParentNotification""('{0}','{1}')", obj.Cnic, obj.limits);
            return Ok(this.dbc.NotificationOutPut.FromSql(sql));
        }


        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]

        [Route("[action]")]
        public IActionResult GetTeacherNotification([FromBody] NotificationParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""TeacherNotification""('{0}','{1}')", obj.Teacher_ID, obj.limits);
            return Ok(this.dbc.NotificationOutPut.FromSql(sql));
        }




        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]

        [Route("[action]")]
        public IActionResult GetStudentChat([FromBody] ChatParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""StudentChat""('{0}','{1}')", obj.Student_ID, obj.Teacher_ID);
            return Ok(this.dbc.ChatOutPut.FromSql(sql));
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]

        [Route("[action]")]//teacher name and subject name
        public IActionResult GetStudentChatEx([FromBody] ChatParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""StudentChat""('{0}')", obj.Student_ID);
            return Ok(this.dbc.ChatOutPut.FromSql(sql));
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("[action]")]//teacher name and subject name
        public IActionResult GetStudentChatWithTeacher([FromBody] ChatParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""StudentChatEx""('{0}')", obj.Student_ID);
            return Ok(this.dbc.ChatOutPutWithTeacher.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetStudentQuestion([FromBody] ChatParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""GetQuestionH""('{0}')", obj.Teacher_ID);
            return Ok(this.dbc.ChatOutPutEx.FromSql(sql));
        }


        [HttpPost]
        // [AllowAnonymous]
        [Authorize]

        [IgnoreAntiforgeryToken]

        [Route("[action]")]
        public IActionResult GetStudentQuestionSub([FromBody] ChatParams obj)
        {
            string sql = String.Format(@"select * from  ""Message"".""GetQuestionCourse""('{0}')", obj.Teacher_ID);
            return Ok(this.dbc.ChatOutPutCourse.FromSql(sql));
        }


        // [HttpPost]
        // [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        // [Route("[action]")]
        // public IActionResult GetStudentNotification([FromBody] NotificationParams obj)
        // {
        //     var connection = new NpgsqlConnection(DISdbString);
        //     connection.Open();
        //     var result = connection.Query(String.Format(@"select * from  ""Message"".""StudentNotificationEx""('{0}','{1}')", obj.Student_ID, obj.limits));
        //     if (connection.State == ConnectionState.Open)
        //         connection.Close();
        //     connection.Dispose();
        //     return Ok(result);
        // }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> StudentPortalLogin([FromBody] UserParams param)
        {
            var identity = await this.authService.ResolveUser(param.User_name, param.User_Password);
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();

            if (identity == null)
            {
                string username = param.User_name.ToLower();
                string password = param.User_Password;

                var query = String.Format(@"SELECT * FROM ""Role"".""StudentUserLink"" WHERE lower(""Username"")='{0}' and ""Password""='{1}'", username, password);
                var result = this.dbc.StudentUserLink.FromSql(query).FirstOrDefault();
                if (result != null)
                {
                    this.log.Insert(JsonConvert.SerializeObject(param), "Student_Login", "Login From Mobile/Tab");
                    MyDynamic.Status = "900";
                    MyDynamic.Message = "Student login successfully";

                    return Ok(MyDynamic);
                }
                MyDynamic.Status = "901";
                MyDynamic.Message = "Invalid User";
                this.log.Insert(JsonConvert.SerializeObject(param), "Invalid User", "Login From Mobile/Tab");

                return Ok(MyDynamic);
            }
            else
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Teacher login successfully.";
                this.log.Insert(JsonConvert.SerializeObject(param), "Teacher_Login From Student App ", "Login From Mobile/Tab");

                return Ok(MyDynamic);
            }
        }

        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> StudentPortalLoginTest([FromBody] UserParams param)
        // {
        //     var identity = await this.authService.ResolveUser(param.User_name, param.User_Password);
        //     dynamic MyDynamic = new System.Dynamic.ExpandoObject();

        //     if (identity == null)
        //     {
        //         string username = param.User_name.ToLower();
        //         string password = param.User_Password;

        //         var query = String.Format(@"SELECT * FROM ""Role"".""StudentUserLink"" WHERE lower(""Username"")='{0}' and ""Password""='{1}'", username, password);

        //         var result = this.dbc.StudentUserLink.FromSql(query).FirstOrDefault();
        //         Predicate[] resApp = (this.dbc.Predicate.FromSql(String.Format(@"SELECT ""Apps"" as ProvidedString FROM ""Role"".""UserApp"" WHERE ""StudentUserId"" = (select ""StudentUserId"" from ""Role"".""StudentUserLink"" where lower(""Username"") = '{0}')", username))).ToArray<Predicate>();


        //         if (result != null)
        //         {
        //             if (resApp.Length > 0)
        //             {
        //                 if (param.App_Name == resApp[0].ProvidedString)
        //                 {
        //                     this.log.Insert(JsonConvert.SerializeObject(param), "Student_Login", "Login From Mobile/Tab");
        //                     MyDynamic.Status = "900";
        //                     MyDynamic.Message = "Student login successfully";

        //                     return Ok(MyDynamic);
        //                 }
        //                 else
        //                 {
        //                     this.log.Insert(JsonConvert.SerializeObject(param), "Invalid User", "Login From Mobile/Tab");
        //                     MyDynamic.Status = "901";
        //                     MyDynamic.Message = "You Are Not Authorize To Use This App!";

        //                     return Ok(MyDynamic);
        //                 }
        //             }
        //         }
        //         MyDynamic.Status = "901";
        //         MyDynamic.Message = "Invalid User";
        //         this.log.Insert(JsonConvert.SerializeObject(param), "Invalid User", "Login From Mobile/Tab");

        //         return Ok(MyDynamic);
        //     }
        //     else
        //     {
        //         MyDynamic.Status = "900";
        //         MyDynamic.Message = "Teacher login successfully.";
        //         this.log.Insert(JsonConvert.SerializeObject(param), "Teacher_Login From Student App ", "Login From Mobile/Tab");

        //         return Ok(MyDynamic);
        //     }
        // }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> StudentPortalLoginLocal([FromBody] UserParams param)
        {
            var identity = await this.authService.ResolveUser(param.User_name, param.User_Password);
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();

            if (identity == null)
            {
                string username = param.User_name.ToLower();
                string password = param.User_Password;

                var query = String.Format(@"SELECT * FROM ""Message"".""StudentPortalLogin""('{0}', '{1}', '{2}') as ProvidedString", username, password, param.App_Name);
                Predicate[] res = this.dbc.Predicate.FromSql(query).ToArray<Predicate>();

                if (res.Length > 0)
                {
                    if (res[0].ProvidedString == "900")
                    {
                        this.log.Insert(JsonConvert.SerializeObject(param), "Student_Login", "Login From Mobile/Tab");
                        MyDynamic.Status = "900";
                        MyDynamic.Message = "Student login successfully";
                        return Ok(MyDynamic);
                    }
                    else if (res[0].ProvidedString == "800")
                    {
                        this.log.Insert(JsonConvert.SerializeObject(param), "Student_Login", "Login From Mobile/Tab");
                        MyDynamic.Status = "800";
                        MyDynamic.Message = "Student login successfully For Step Hadaf!";
                        return Ok(MyDynamic);
                    }
                    else if (res[0].ProvidedString == "901")
                    {
                        MyDynamic.Status = "901";
                        MyDynamic.Message = "Invalid User";
                        this.log.Insert(JsonConvert.SerializeObject(param), "Invalid User", "Login From Mobile/Tab");
                        return Ok(MyDynamic);
                    }
                }
                MyDynamic.Status = "901";
                MyDynamic.Message = "Invalid User";
                this.log.Insert(JsonConvert.SerializeObject(param), "Invalid User", "Login From Mobile/Tab");
                return Ok(MyDynamic);
            }
            else
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Teacher login successfully.";
                this.log.Insert(JsonConvert.SerializeObject(param), "Teacher_Login From Student App ", "Login From Mobile/Tab");
                return Ok(MyDynamic);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalChangePassword([FromBody] dynamic param)
        {
            string username = param.Student_ID + "@cms.edu.pk";
            string newPass = param.New_Password;
            string oldPass = param.Old_Password;

            var query = String.Format(@"SELECT * FROM ""Role"".""StudentUserLink"" WHERE ""Username""='{0}' and ""Password""='{1}'", username, oldPass);
            var result = this.dbc.StudentUserLink.FromSql(query).FirstOrDefault();
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (result != null)
            {
                var query2 = String.Format(@"UPDATE ""Role"".""StudentUserLink"" set ""Password""='{0}' WHERE ""Username""='{1}'", newPass, username);
                var res = this.dbc.Database.ExecuteSqlCommand(query2);
                MyDynamic.Status = "900";
                MyDynamic.Message = "Password has been successfully changed";

                return Ok(MyDynamic);
            }
            MyDynamic.Status = "901";
            MyDynamic.Message = "Invalid User";
            return Ok(MyDynamic);

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalBoardInfo([FromBody] dynamic param)
        {
            string rollNo = param.Student_ID;
            var result = this.dbc.BoardInfoVM.Where(s => s.ClgRollNo == rollNo).ToList();
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
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult DailySurveyNotification([FromBody] NotificationSurvey predicate)
        {

            var obj = new Predicate() { ProvidedString = "" };
            //var Data = this.log.GetLog();

            var Data = this.log.GetLog();


            string query = String.Format("select   \"Message\".\"DailySurveyNotificationEx\"('{0}','{1}','{2}','{3}') as \"ProvidedString\"", predicate.Operation, predicate.RollNo, predicate.Remarks, Data);


            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ProvidedString = connection.Query<Predicate>(query).FirstOrDefault().ProvidedString;

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj.ProvidedString);


        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalGetExamType([FromBody] StudentPortalExamTypeParam param)
        {


            string sql = string.Format(@"select * from ""Message"".""StudentPortalExamType""('{0}')", param.Student_ID);

            var result = this.dbc.StudentPortalExamType.FromSql(sql).ToList<StudentPortalExamType>();


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

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalGetExamTypeEx([FromBody] StudentPortalExamTypeParam param)
        {


            string sql = string.Format(@"select * from ""Message"".""StudentPortalExamTypeEx""('{0}')", param.Student_ID);

            var result = this.dbc.StudentPortalExamType.FromSql(sql).ToList<StudentPortalExamType>();


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


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult StudentPortalGetExamTypeAll([FromBody] StudentPortalExamTypeParam param)
        {


            string sql = string.Format(@"select * from ""Message"".""StudentPortalExamTypeAll""('{0}')", param.Student_ID);

            var result = this.dbc.StudentPortalExamTypeAll.FromSql(sql).ToList<StudentPortalExamTypeAll>();


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
        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalGetAllExamsResult([FromBody] StudentPortalExamTypeParam param)
        {
            string sql = string.Format(@"select * from ""Message"".""StudentPortalExamTypeAllwithMarks""('{0}')", param.Student_ID);
            var result = this.dbc.StudentPortalGetAllExamsResult.FromSql(sql).ToList<StudentPortalGetAllExamsResult>();
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



        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult StudentPortalGetAllExamsResultNew([FromBody] Attendance_CMS param)
        {
            string sql = string.Format(@"select * from ""Message"".""StudentPortalExamTypeAllwithMarksNew""('{0}' , '{1}')", param.Student_ID, param.Class_Level_ID);
            var result = this.dbc.StudentPortalGetAllExamsResult.FromSql(sql).ToList<StudentPortalGetAllExamsResult>();
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

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult ParentsRegistration([FromBody] dynamic param)
        {

            string CNIC = param.CNIC;
            string AppName = param.AppName;
            var query = String.Format(@"SELECT * FROM ""public"".""ParentLogin""('{0}') as ProvidedString", CNIC);
            Predicate[] res = this.dbc.Predicate.FromSql(query).ToArray<Predicate>();
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();

            if (res.Length > 0)
            {
                if (res[0].ProvidedString == "0")
                {

                    MyDynamic.Status = "901";
                    MyDynamic.Message = "Parent CNIC Does not exist";
                    return Ok(MyDynamic);
                }
                else if (res[0].ProvidedString == "1")
                {

                    MyDynamic.Status = "900";
                    MyDynamic.Message = "PIN has been sent to your registered Number.";
                    return Ok(MyDynamic);
                }


                else if (res[0].ProvidedString == "10")
                {

                    MyDynamic.Status = "915";
                    MyDynamic.Message = "This CNIC is already registered in the system, please click on forgot password to get your PIN.";
                    return Ok(MyDynamic);
                }
            }

            else
            {
                return Ok(true);
            }

            return Ok(true);

        }




        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]

        public IActionResult Forget([FromBody] dynamic param)
        {

            string CNIC = param.CNIC;
            string AppName = param.AppName;
            var query = String.Format(@"SELECT * FROM ""public"".""ForgetPass""('{0}') as ProvidedString", CNIC);
            Predicate[] res = this.dbc.Predicate.FromSql(query).ToArray<Predicate>();
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();

            if (res.Length > 0)
            {
                if (res[0].ProvidedString == "0")
                {

                    MyDynamic.Status = "901";
                    MyDynamic.Message = "Parent CNIC Does not exist";
                    return Ok(MyDynamic);
                }
                else if (res[0].ProvidedString == "1")
                {

                    MyDynamic.Status = "900";
                    MyDynamic.Message = "PIN has been sent to your registered Number.";
                    return Ok(MyDynamic);
                }
            }

            else
            {
                return Ok(true);
            }

            return Ok(true);

        }




        // Parent API's

        [HttpPost]

        [Route("[action]")]
        public IActionResult GetParentResponseFromDb([FromBody] ParentsLoginParam param)
        {

            string sql = String.Format(@"select * from  ""Message"".""GetStudentProfileFromParentCNIC""('{0}','{1}','{2}')", param.CNIC, '1', param.PIN);


            var result = this.dbc.APIStudentProfileResponse.FromSql(sql).ToList<APIStudentProfileResponse>();
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (result.Count > 0)
            {

                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = result;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found.Invalid CNIC Or Pin";
            MyDynamic.Data = result;
            return Ok(MyDynamic);

        }
        ////////////////////////////////////////////////////////////////////


        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherCalendarApi([FromBody] TeacherCalendarParam param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""TeacherCalendarApi"" ('{0}','{1}','{2}','{3}')", param.Teacher_ID, param.Course_ID, param.ClassID, param.SubCityID);

            var result = this.dbc.TeacherCalendar.FromSql(sql).ToList<TeacherCalendar>();

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
        [HttpPost]
        [Authorize]

        [Route("[action]")]
        public IActionResult TeacherCalendarApiEx([FromBody] TeacherCalendarParamEx param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""TeacherCalendarApiEx"" ('{0}','{1}','{2}','{3}','{4}')", param.Teacher_ID, param.Course_ID, param.ClassID, param.SubCityID, param.SectionCourseLinkId);

            var result = this.dbc.TeacherCalendar.FromSql(sql).ToList<TeacherCalendar>();

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


        [HttpPost]
        [Route("[action]")]
        public IActionResult NewTeacherCalendarApiTeacherApp([FromBody] TeacherCalendarParamEx param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""NewTeacherCalendarApi"" ('{0}','{1}','{2}','{3}','{4}')", param.Teacher_ID, param.Course_ID, param.ClassID, param.SubCityID, param.SectionCourseLinkId);

            var result = this.dbc.NewTeacherCalendar.FromSql(sql).ToList<NewTeacherCalendar>();

            var orderedResult = result.OrderBy(e => e.WeekNo).ThenBy(e => e.ChapterName).ThenBy(e => e.DateRange).ToList();
            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (orderedResult.Count > 0)
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = orderedResult;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found";
            MyDynamic.Data = orderedResult;
            return Ok(MyDynamic);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherSearchApi([FromBody] TeacherSearchParam param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""TeacherApiVW"" where ""StaffId"" = '{0}'", param.Teacher_ID);

            // string sql = string.Format("select * from \"AcademicCalendar\".\"TeacherApiVW\" where \"st\".\"StaffId\"='{0}'", param.Teacher_ID);
            Console.WriteLine(sql);
            var result = this.dbc.TeacherSearchApi.FromSql(sql).ToList<TeacherSearchApi>();

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

        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherSearchApiEx([FromBody] TeacherSearchParam param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""TeacherApiVWEx"" where ""StaffId"" = '{0}'", param.Teacher_ID);

            // string sql = string.Format("select * from \"AcademicCalendar\".\"TeacherApiVW\" where \"st\".\"StaffId\"='{0}'", param.Teacher_ID);
            Console.WriteLine(sql);
            var result = this.dbc.TeacherSearchApiEx.FromSql(sql).ToList<TeacherSearchApiEx>();

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
        // [AllowAnonymous]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult TeacherAcdemicSearchApiEx([FromBody] TeacherSearchParam param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""GetTeacherAccedmiccalender""  ('{0}')", param.Teacher_ID);

            // string sql = string.Format("select * from \"AcademicCalendar\".\"TeacherApiVW\" where \"st\".\"StaffId\"='{0}'", param.Teacher_ID);
            Console.WriteLine(sql);
            var result = this.dbc.TeacherSearchApiEx.FromSql(sql).ToList<TeacherSearchApiEx>();

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


        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentCalendarApi([FromBody] StudentCalendarParam param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""StudentCalendarApi"" ('{0}')", param.Student_ID);

            var result = this.dbc.StudentCalendar.FromSql(sql).ToList<StudentCalendar>();

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
        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentAcedemicCalendarApiEx([FromBody] StudentCalendarParamEx param)
        {


            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            var samsdata = this.dbc.ARVOConfiguration.Where(e => e.FullName == "AcademicCalendarTopicTree");
            _config = samsdata.FirstOrDefault(e => e.FullName == "AcademicCalendarTopicTree");

            string apiUrl, accessToken = string.Empty;


            if (_config != null)
            {
                apiUrl = _config.BaseURL + _config.APIURL;
                accessToken = _config.ARVOAccessToken;

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                HttpResponseMessage response1 = client.GetAsync(apiUrl).Result;

                if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                {
                    string responseData = response1.Content.ReadAsStringAsync().Result;
                    resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                }
                else
                {
                    _config = ARVOLoginEx(_config).Result;
                    accessToken = _config.ARVOAccessToken;

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    HttpResponseMessage response2 = client.GetAsync(apiUrl).Result;

                    string responseData = response2.Content.ReadAsStringAsync().Result;
                    resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                }
            }
            else
            {


                return Ok("Error");
            }



            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""StudentAcdemicCalendarApi"" ('{0}','{1}')", param.Student_ID, param.Class_ID);
            List<StudentAcademicCalendar> result = new List<StudentAcademicCalendar>();

            result = this.dbc.StudentAcademicCalendar.FromSql(sql).ToList<StudentAcademicCalendar>();

            List<StudentAcademicCalendarEX> mappedResult = new List<StudentAcademicCalendarEX>();

            result.ForEach(item =>
            {
                StudentAcademicCalendarEX mappedResultex = new StudentAcademicCalendarEX();

                mappedResultex.NewID = item.NewID;
                mappedResultex.AcademicCalendarMasterId = item.AcademicCalendarMasterId;
                mappedResultex.StudentName = item.StudentName;
                mappedResultex.SubCityName = item.SubCityName;
                mappedResultex.DateRange = item.DateRange;
                mappedResultex.Class = item.Class;
                mappedResultex.Code = item.Code;
                mappedResultex.Day = item.Day;
                mappedResultex.AcademicCalendarId = item.AcademicCalendarId;
                mappedResultex.YearlyWeekNo = item.YearlyWeekNo;
                mappedResultex.WeekNo = item.WeekNo;
                mappedResultex.TopicDescription = item.TopicDescription;
                mappedResultex.TopicId = item.TopicId;
                mappedResultex.Topic = item.Topic;
                mappedResultex.Link = item.Link;
                mappedResultex.ChapterName = item.ChapterName;
                mappedResultex.Abbreviation = item.Abbreviation;
                mappedResultex.CourseName = item.CourseName;
                mappedResultex.TopicDetail = new List<TopicContentVir>();
                mappedResult.Add(mappedResultex);

            });

            var ch = "";


            List<int> frontendTopicIds = new List<int>();


            foreach (var obj in result.OrderByDescending(e => e.ChapterName))
            {
                if (obj.ChapterName != ch && ch != "" && frontendTopicIds.Count > 0)
                {
                    var res = GetARVOTopicView(_config, "CMS", frontendTopicIds).Result;

                    // Logic to update TopicDetail
                    if (res != null && res.Any())
                    {
                        foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                        {
                            calendarItem.TopicDetail = res;
                        }
                    }

                    frontendTopicIds.Clear();


                    if (int.TryParse(obj.TopicId, out int topicId))
                    {
                        frontendTopicIds.Add(topicId);
                    }
                    else
                    {
                        // Handle the case where TopicId cannot be converted to an integer
                        // For example, log an error or skip the current item
                        ch = obj.ChapterName;
                        List<TopicContentVir> EmsTopicDetailexList = new List<TopicContentVir>();
                        var calendarItems = mappedResult.Where(e => e.ChapterName == ch).ToList();
                        for (int i = 0; i < calendarItems.Count; i++)
                        {
                            var calendarItem = calendarItems[i];

                            TopicContentVir EmsTopicDetailex = new TopicContentVir
                            {
                                FrontEndTopicId = calendarItem.TopicId,
                                TopicName = calendarItem.Topic,
                                BookId = null,
                                BookName = calendarItem.CourseName,
                                Language = null,
                                Sequence = null,
                                ParentId = null,
                                FrontendTopicContents = new List<TopicContentVir>(),
                                TotalMcqsCount = 0,
                                TotalShortQuestionCount = 0,
                                TotalLongQuestionCount = 0,
                                TotalVideosCount = 0,
                                TotalExamCount = 0,
                            };
                            EmsTopicDetailexList.Add(EmsTopicDetailex);


                        }


                        foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                        {
                            calendarItem.TopicDetail = EmsTopicDetailexList;
                        }
                        // Console.WriteLine($"Invalid TopicId: {obj.TopicId}");

                        // Optionally, you can continue or break the loop, depending on your requirement
                        //  continue;
                    }

                }
                else
                {
                    if (int.TryParse(obj.TopicId, out int topicId))
                    {
                        frontendTopicIds.Add(topicId);
                    }
                    else
                    {
                        ch = obj.ChapterName;
                        // Handle the case where TopicId cannot be converted to an integer
                        // For example, log an error or skip the current item
                        List<TopicContentVir> EmsTopicDetailexList = new List<TopicContentVir>();

                        var calendarItems = mappedResult.Where(e => e.ChapterName == ch).ToList();
                        for (int i = 0; i < calendarItems.Count; i++)
                        {
                            var calendarItem = calendarItems[i];
                            TopicContentVir EmsTopicDetailex = new TopicContentVir
                            {
                                FrontEndTopicId = calendarItem.TopicId,
                                TopicName = calendarItem.Topic,
                                BookId = null,
                                BookName = calendarItem.CourseName,
                                Language = null,
                                Sequence = null,
                                ParentId = null,
                                FrontendTopicContents = new List<TopicContentVir>(),
                                TotalMcqsCount = 0,
                                TotalShortQuestionCount = 0,
                                TotalLongQuestionCount = 0,
                                TotalVideosCount = 0,
                                TotalExamCount = 0,
                            };
                            EmsTopicDetailexList.Add(EmsTopicDetailex);

                        }
                        foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                        {
                            calendarItem.TopicDetail = EmsTopicDetailexList;
                        }
                        //  Console.WriteLine($"Invalid TopicId: {obj.TopicId}");

                        // Optionally, you can continue or break the loop, depending on your requirement
                        // continue;
                    }

                }

                ch = obj.ChapterName;
            }

            // Handle the last batch if needed
            if (frontendTopicIds.Count > 0)
            {
                var res = GetARVOTopicView(_config, "CMS", frontendTopicIds).Result;

                if (res != null && res.Any())
                {
                    foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                    {
                        calendarItem.TopicDetail = res;
                    }
                }
            }



            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (mappedResult.Count > 0)
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = mappedResult;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found";
            MyDynamic.Data = mappedResult;
            return Ok(MyDynamic);


        }



        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> StudentAcedemicCalendarApiExy([FromBody] StudentCalendarParamEx param)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();

            var samsdata = this.dbc.ARVOConfiguration.Where(e => e.FullName == "AcademicCalendarTopicTree");
            _config = samsdata.FirstOrDefault(e => e.FullName == "AcademicCalendarTopicTree");

            string apiUrl, accessToken = string.Empty;

            if (_config != null)
            {
                apiUrl = _config.BaseURL + _config.APIURL;
                accessToken = _config.ARVOAccessToken;

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                {
                    string responseData = await response1.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    accessToken = _config.ARVOAccessToken;

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    string responseData = await response2.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                }
            }
            else
            {
                return Ok("Error");
            }

            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""StudentAcdemicCalendarApi"" ('{0}','{1}')", param.Student_ID, param.Class_ID);
            List<StudentAcademicCalendar> result = await this.dbc.StudentAcademicCalendar.FromSql(sql).ToListAsync();

            List<StudentAcademicCalendarEX> mappedResult = new List<StudentAcademicCalendarEX>();

            result.ForEach(item =>
            {
                StudentAcademicCalendarEX mappedResultex = new StudentAcademicCalendarEX
                {
                    NewID = item.NewID,
                    AcademicCalendarMasterId = item.AcademicCalendarMasterId,
                    StudentName = item.StudentName,
                    SubCityName = item.SubCityName,
                    DateRange = item.DateRange,
                    Class = item.Class,
                    Code = item.Code,
                    Day = item.Day,
                    AcademicCalendarId = item.AcademicCalendarId,
                    YearlyWeekNo = item.YearlyWeekNo,
                    WeekNo = item.WeekNo,
                    TopicDescription = item.TopicDescription,
                    TopicId = item.TopicId,
                    Topic = item.Topic,
                    Link = item.Link,
                    ChapterName = item.ChapterName,
                    Abbreviation = item.Abbreviation,
                    CourseName = item.CourseName,
                    TopicDetail = new List<TopicContentVir>()
                };
                mappedResult.Add(mappedResultex);
            });

            var ch = "";

            List<int> frontendTopicIds = new List<int>();

            foreach (var obj in result.OrderByDescending(e => e.ChapterName))
            {
                if (obj.ChapterName != ch && ch != "" && frontendTopicIds.Count > 0)
                {
                    var res = await GetARVOTopicView(_config, "CMS", frontendTopicIds);

                    if (res != null && res.Any())
                    {
                        foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                        {
                            calendarItem.TopicDetail = res;
                        }
                    }

                    frontendTopicIds.Clear();

                    if (int.TryParse(obj.TopicId, out int topicId))
                    {
                        frontendTopicIds.Add(topicId);
                    }
                    else
                    {
                        ch = obj.ChapterName;
                        List<TopicContentVir> EmsTopicDetailexList = new List<TopicContentVir>();
                        var calendarItems = mappedResult.Where(e => e.ChapterName == ch).ToList();
                        for (int i = 0; i < calendarItems.Count; i++)
                        {
                            var calendarItem = calendarItems[i];

                            TopicContentVir EmsTopicDetailex = new TopicContentVir
                            {
                                FrontEndTopicId = calendarItem.TopicId,
                                TopicName = calendarItem.Topic,
                                BookId = null,
                                BookName = calendarItem.CourseName,
                                Language = null,
                                Sequence = null,
                                ParentId = null,
                                FrontendTopicContents = new List<TopicContentVir>(),
                                TotalMcqsCount = 0,
                                TotalShortQuestionCount = 0,
                                TotalLongQuestionCount = 0,
                                TotalVideosCount = 0,
                                TotalExamCount = 0,
                            };
                            EmsTopicDetailexList.Add(EmsTopicDetailex);


                        }


                        foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                        {
                            calendarItem.TopicDetail = EmsTopicDetailexList;
                        }
                        // Console.WriteLine($"Invalid TopicId: {obj.TopicId}");

                        // Optionally, you can continue or break the loop, depending on your requirement
                        //  continue;
                    }

                }
                else
                {
                    if (int.TryParse(obj.TopicId, out int topicId))
                    {
                        frontendTopicIds.Add(topicId);
                    }
                    else
                    {
                        ch = obj.ChapterName;
                        // Handle the case where TopicId cannot be converted to an integer
                        // For example, log an error or skip the current item
                        List<TopicContentVir> EmsTopicDetailexList = new List<TopicContentVir>();

                        var calendarItems = mappedResult.Where(e => e.ChapterName == ch).ToList();
                        for (int i = 0; i < calendarItems.Count; i++)
                        {
                            var calendarItem = calendarItems[i];
                            TopicContentVir EmsTopicDetailex = new TopicContentVir
                            {
                                FrontEndTopicId = calendarItem.TopicId,
                                TopicName = calendarItem.Topic,
                                BookId = null,
                                BookName = calendarItem.CourseName,
                                Language = null,
                                Sequence = null,
                                ParentId = null,
                                FrontendTopicContents = new List<TopicContentVir>(),
                                TotalMcqsCount = 0,
                                TotalShortQuestionCount = 0,
                                TotalLongQuestionCount = 0,
                                TotalVideosCount = 0,
                                TotalExamCount = 0,
                            };
                            EmsTopicDetailexList.Add(EmsTopicDetailex);

                        }
                        foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                        {
                            calendarItem.TopicDetail = EmsTopicDetailexList;
                        }
                        //  Console.WriteLine($"Invalid TopicId: {obj.TopicId}");

                        // Optionally, you can continue or break the loop, depending on your requirement
                        // continue;
                    }

                }

                ch = obj.ChapterName;
            }

            // Handle the last batch if needed
            if (frontendTopicIds.Count > 0)
            {
                var res = GetARVOTopicView(_config, "CMS", frontendTopicIds).Result;

                if (res != null && res.Any())
                {
                    foreach (var calendarItem in mappedResult.Where(e => e.ChapterName == ch))
                    {
                        calendarItem.TopicDetail = res;
                    }
                }
            }



            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (mappedResult.Count > 0)
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = mappedResult;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found";
            MyDynamic.Data = mappedResult;
            return Ok(MyDynamic);


        }

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult StudentAcedemicCalendarApiMobileApp([FromBody] StudentCalendarParamEx param)
        {


            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();

            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""StudentAcdemicCalendarApiNewMobileApp"" ('{0}','{1}')", param.Student_ID, param.Class_ID);
            List<StudentAcademicCalendar> result = new List<StudentAcademicCalendar>();

            result = this.dbc.StudentAcademicCalendar.FromSql(sql).ToList<StudentAcademicCalendar>();

            List<StudentAcademicCalendarNewModel> mappedResult = new List<StudentAcademicCalendarNewModel>();

            result.ForEach(item =>
            {
                StudentAcademicCalendarNewModel mappedResultex = new StudentAcademicCalendarNewModel();

                mappedResultex.NewID = item.NewID;
                mappedResultex.AcademicCalendarMasterId = item.AcademicCalendarMasterId;
                mappedResultex.StudentName = item.StudentName;
                mappedResultex.SubCityName = item.SubCityName;
                mappedResultex.DateRange = item.DateRange;
                mappedResultex.Class = item.Class;
                mappedResultex.Code = item.Code;
                mappedResultex.Day = item.Day;
                mappedResultex.AcademicCalendarId = item.AcademicCalendarId;
                mappedResultex.YearlyWeekNo = item.YearlyWeekNo;
                mappedResultex.WeekNo = item.WeekNo;
                mappedResultex.TopicDescription = item.TopicDescription;
                mappedResultex.TopicId = item.TopicId;
                mappedResultex.Topic = item.Topic;
                mappedResultex.Link = item.Link;
                mappedResultex.ChapterName = item.ChapterName;
                mappedResultex.Abbreviation = item.Abbreviation;
                mappedResultex.CourseName = item.CourseName;
                mappedResultex.TopicDetail = new List<string>();
                mappedResult.Add(mappedResultex);

            });


            foreach (var obj in mappedResult.OrderByDescending(e => e.ChapterName).ThenByDescending(e => e.WeekNo))
            {
                var sameWeekItems = mappedResult
                    .Where(e => e.WeekNo == obj.WeekNo && e.ChapterName == obj.ChapterName)
                    .OrderBy(o => o.DateRange)
                    .ToList();

                if (sameWeekItems.Count > 0)
                {
                    var frontendTopicIdweek = sameWeekItems.Select(s => s.TopicId).Distinct().ToList();

                    var calendarItems = mappedResult
                        .Where(e => e.ChapterName == obj.ChapterName && e.WeekNo == obj.WeekNo)
                        .ToList();

                    foreach (var calendarItem in calendarItems)
                    {
                        calendarItem.TopicDetail = new List<string>(frontendTopicIdweek);
                    }
                }
            }




            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (mappedResult.Count > 0)
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = mappedResult;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found";
            MyDynamic.Data = mappedResult;
            return Ok(MyDynamic);


        }

        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentAcedemicCalendarApiNew([FromBody] StudentCalendarParamEx param)
        {


            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();

            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""StudentAcdemicCalendarApiNew"" ('{0}','{1}')", param.Student_ID, param.Class_ID);
            List<StudentAcademicCalendar> result = new List<StudentAcademicCalendar>();

            result = this.dbc.StudentAcademicCalendar.FromSql(sql).ToList<StudentAcademicCalendar>();

            List<StudentAcademicCalendarNewModel> mappedResult = new List<StudentAcademicCalendarNewModel>();

            result.ForEach(item =>
            {
                StudentAcademicCalendarNewModel mappedResultex = new StudentAcademicCalendarNewModel();

                mappedResultex.NewID = item.NewID;
                mappedResultex.AcademicCalendarMasterId = item.AcademicCalendarMasterId;
                mappedResultex.StudentName = item.StudentName;
                mappedResultex.SubCityName = item.SubCityName;
                mappedResultex.DateRange = item.DateRange;
                mappedResultex.Class = item.Class;
                mappedResultex.Code = item.Code;
                mappedResultex.Day = item.Day;
                mappedResultex.AcademicCalendarId = item.AcademicCalendarId;
                mappedResultex.YearlyWeekNo = item.YearlyWeekNo;
                mappedResultex.WeekNo = item.WeekNo;
                mappedResultex.TopicDescription = item.TopicDescription;
                mappedResultex.TopicId = item.TopicId;
                mappedResultex.Topic = item.Topic;
                mappedResultex.Link = item.Link;
                mappedResultex.ChapterName = item.ChapterName;
                mappedResultex.Abbreviation = item.Abbreviation;
                mappedResultex.CourseName = item.CourseName;
                mappedResultex.TopicDetail = new List<string>();
                mappedResult.Add(mappedResultex);

            });


            foreach (var obj in mappedResult.OrderByDescending(e => e.ChapterName).ThenByDescending(e => e.WeekNo))
            {
                var sameWeekItems = mappedResult
                    .Where(e => e.WeekNo == obj.WeekNo && e.ChapterName == obj.ChapterName)
                    .OrderBy(o => o.DateRange)
                    .ToList();

                if (sameWeekItems.Count > 0)
                {
                    var frontendTopicIdweek = sameWeekItems.Select(s => s.TopicId).Distinct().ToList();

                    var calendarItems = mappedResult
                        .Where(e => e.ChapterName == obj.ChapterName && e.WeekNo == obj.WeekNo)
                        .ToList();

                    foreach (var calendarItem in calendarItems)
                    {
                        calendarItem.TopicDetail = new List<string>(frontendTopicIdweek);
                    }
                }
            }




            dynamic MyDynamic = new System.Dynamic.ExpandoObject();
            if (mappedResult.Count > 0)
            {
                MyDynamic.Status = "900";
                MyDynamic.Message = "Success";
                MyDynamic.Data = mappedResult;
                return Ok(MyDynamic);
            }
            MyDynamic.Status = "902";
            MyDynamic.Message = "No Data Found";
            MyDynamic.Data = mappedResult;
            return Ok(MyDynamic);


        }




        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]

        private async Task<List<TopicContentVir>> GetARVOTopicView(ARVOConfiguration _config, string organization, List<int> frontendTopicIds)
        {
            ApiResponseVr resp = new ApiResponseVr();
            List<TopicContentVir> resp1 = new List<TopicContentVir>();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                frontendTopicIds = frontendTopicIds
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<ApiResponseVr>(responseData);

                }
            }
            resp1 = resp.Data;
            return resp1;
        }




        [HttpPost]
        [AllowAnonymous]
        [Route("[action]")]

        public async Task<ECompilerResponseData> GetARVOCompilers([FromBody] CompilerPayload payload)
        {
            CompilerResponse resp = new CompilerResponse();
            ARVOConfiguration _config = new ARVOConfiguration();

            var samsdata = this.dbc.ARVOConfiguration.Where(e => e.srNo == 21);
            _config = samsdata.FirstOrDefault();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                code = payload.Code,
                languageId = payload.LanguageId,
                userEmail = payload.UserEmail,
                module = payload.Module,
                organizationCode = "CMS",
                device = payload.Device,
                organization = "CMS"
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<CompilerResponse>(responseData);

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<CompilerResponse>(responseData);
                    }

                }
            }


            return MapApiResponseToCompilerResponse(resp.Data);
        }


        public static ECompilerResponseData MapApiResponseToCompilerResponse(CompilerResponseData apiResponse)
        {
            return new ECompilerResponseData
            {
                Stdout = apiResponse.Stdout?.ToString(),
                Time = apiResponse.Time?.ToString(),
                Memory = apiResponse.Memory.ToString(),
                Stderr = apiResponse.Stderr?.ToString(),
                Token = apiResponse.Token?.ToString(),
                Compile_Output = apiResponse.Compile_Output?.ToString(),
                Message = apiResponse.Message?.ToString(),
                Status = new ECompilerStatus
                {
                    Id = apiResponse.Status?.Id.ToString(),
                    Description = apiResponse.Status?.Description?.ToString()
                }
            };
        }



        private async Task<ARVO_Configurations> ARVOLogin(ARVO_Configurations _config)
        {
            // SAMS_Configurations _config = await _unitOfWork.SAMS_Configurations.GetFirstOrDefaultAsync(r => r.srNo == 1);

            lock (updateLock)
            {
                if (_config != null)
                {
                    var loginRequest = new
                    {
                        email = _config.ARVOLoginEmail,
                        password = _config.ARVOLoginPassword
                    };

                    string jsonRequest = JsonConvert.SerializeObject(loginRequest);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    using (HttpClient client = new HttpClient())
                    {
                        HttpResponseMessage response = client.PostAsync(_config.LoginURL, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = response.Content.ReadAsStringAsync().Result;
                            JObject json = JObject.Parse(responseData);
                            _config.ARVOAccessToken = json["data"]["token"].ToString();
                        }
                    }

                    arvorepository.Update(_config);
                }
            }

            return _config;
        }



        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentAcedemicTopicApi([FromBody] StudentCalendarParamEx param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""StudentGetTopicCalenderApi"" ('{0}','{1}','{2}')", param.Student_ID, param.Class_ID, param.TopicId);

            var result = this.dbc.StudentAcademicTopics.FromSql(sql).ToList<StudentAcademicTopics>();

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

        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult StudentCalendarApiEx([FromBody] StudentCalendarParamEx param)
        {
            //Previou Function Name
            //ExamResultStudentApp1
            string sql = string.Format(@"SELECT * FROM ""AcademicCalendar"".""StudentCalendarApi"" ('{0}','{1}')", param.Student_ID, param.Class_ID);

            var result = this.dbc.StudentCalendar.FromSql(sql).ToList<StudentCalendar>();

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


        [AllowAnonymous]

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult insert_FeedBack([FromBody] FeedbackReaponse param)
        {
            var sql = String.Format(@"SELECT * FROM ""Examination"".""InsertFeedback""('{0}','{1}','{2}','{3}','{4}')", param.Admissionformid, param.feedbacktext, param.paraentcnic, param.divceinfo, param.deviceType);
            Console.WriteLine(sql);
            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
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

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetWHIZStudentsList()
        {
            return Ok(this.dbc.SlotWiseTotal.ToList());
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetStudentInfoStepAcademy()
        {
            return Ok(this.dbc.GetStudentInfoStepAcademy.ToList());
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentAssesmentAllWeitagePercentage([FromBody] ExamWeitageParam predicate)
        {




            string sql = string.Format(@"select * from ""Assessment"".""StudentOverAllWeitageprec""('{0}')", predicate.RollNo);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentOverAllWeitage.FromSql(sql));
        }





        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentAssesmentAllWeitage([FromBody] ExamWeitageParam predicate)
        {

            string sql = string.Format(@"select * from ""Assessment"".""StudentAllWeitageData""('{0}')", predicate.RollNo);
            // Console.WriteLine(sql);
            return Ok(this.dbc.StudentOverAllWeitageData.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult SaveRating([FromBody] ProvidingString predicate)
        {
            var userid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var topicid = new string(predicate.ProvidedString.Split("?")[1]);
            var rating = int.Parse(predicate.ProvidedString.Split("?")[2]);
            //var Date = DateTime.Now;

            string sql = string.Format("SELECT * FROM  \"EL\".\"SavevideoRating\"('{0}','{1}','{2}')", userid, topicid, rating);
            // Console.WriteLine(sql);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(sql);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok("Saved Successfully");
        }


       


   [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetStaffCheck([FromBody] ProvidingString predicate)
        {
            var userid = new string(predicate.ProvidedString.Split("?")[0]);
            string sql = string.Format(@"select * from ""HumanResource"".""CheckStaffStatus""('{0}')", userid);
            // Console.WriteLine(sql);
            return Ok(this.dbc.GetStaffCheckData.FromSql(sql));
        }




        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult SaveRatingList([FromBody] ProvidingString predicate)
        {
            var userid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var topicid = new string(predicate.ProvidedString.Split("?")[1]);
            var rating = predicate.ProvidedString.Split("?")[2];
            var remarks = predicate.ProvidedString.Split("?")[3];


            var ratingPairs = rating.Split("&");

            using (IDbConnection connection = dbc.Database.GetDbConnection())
            {
                if (connection.State == ConnectionState.Closed)
                    connection.Open();

                foreach (var pair in ratingPairs)
                {
                    var parts = pair.Split("=");
                    var negativeVideoRattingId = parts[0];
                    var videoRating = parts[1];

                    string sql = string.Format("SELECT * FROM  \"EL\".\"SavevideoRatingNew\"('{0}','{1}','{2}','{3}')", userid, topicid, negativeVideoRattingId, videoRating);
                    connection.Execute(sql);
                }

                if (!string.IsNullOrEmpty(remarks))
                {
                    var Date = DateTime.Now;
                    var negativeVideoRattingId = Guid.Empty;

                    string sql1 = @"SELECT COUNT(*)
                                    FROM ""EL"".""VideosRating""
                                    WHERE ""Userid"" = @Userid
                                    AND ""Topicid"" = @Topicid
                                    AND ""NegativeVideoRattingId"" = @NegativeVideoRattingId";



                    int count = connection.ExecuteScalar<int>(sql1, new
                    {
                        Userid = userid,
                        Topicid = topicid,
                        NegativeVideoRattingId = negativeVideoRattingId
                    });

                    if (count == 0)
                    {
                        string sql = @"INSERT INTO ""EL"".""VideosRating"" 
                   (""Userid"", ""Topicid"", ""Videorating"", ""Dated"", ""NegativeVideoRattingId"", ""Remarks"") 
                   VALUES (@Userid, @Topicid, @Videorating, @Dated, @NegativeVideoRattingId, @Remarks)";

                        var parameters = new
                        {
                            Userid = userid,
                            Topicid = topicid,
                            Videorating = 0,
                            Dated = Date,
                            NegativeVideoRattingId = negativeVideoRattingId,
                            Remarks = remarks
                        };
                        connection.Execute(sql, parameters);
                    }



                    else
                    {
                        string sql = @"UPDATE ""EL"".""VideosRating""
                            SET 
                            ""Videorating"" = @Videorating,
                            ""Dated"" = @Dated,
                            ""Remarks"" = @Remarks
                            WHERE 
                            ""Userid"" = @Userid
                            AND ""Topicid"" = @Topicid
                            AND ""NegativeVideoRattingId"" = @NegativeVideoRattingId";
                        var parameters = new
                        {
                            Userid = userid,
                            Topicid = topicid,
                            Videorating = 0,
                            Dated = Date,
                            NegativeVideoRattingId = negativeVideoRattingId,
                            Remarks = remarks
                        };
                        connection.Execute(sql, parameters);
                    }

                    // connection.Execute(sql, parameters);
                }


                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
            }

            return Ok("Saved Successfully");
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult GetVideoRating([FromBody] ProvidingString predicate)
        {
            var userid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var topicid = new string(predicate.ProvidedString.Split("?")[1]);


            string sql = string.Format(@"select * from ""EL"".""Getvideorating""('{0}','{1}')", userid, topicid);
            // Console.WriteLine(sql);
            return Ok(this.dbc.getVideoRating.FromSql(sql));
        }


        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public IActionResult InsertTopicWatch([FromBody] TopicsWatched obj)
        {
            try
            {
                // this.repo.Add(obj.val);
                if (!string.IsNullOrEmpty(obj.TopicId))
                {
                    this.dbc.TopicsWatched.Add(obj);
                    this.dbc.SaveChanges();
                }

                return new ObjectResult(obj);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
        private async Task<ARVOConfiguration> ARVOLoginEx(ARVOConfiguration _config)
        {
            // SAMS_Configurations _config = await _unitOfWork.SAMS_Configurations.GetFirstOrDefaultAsync(r => r.srNo == 1);

            lock (updateLock)
            {
                if (_config != null)
                {
                    var loginRequest = new
                    {
                        email = _config.ARVOLoginEmail,
                        password = _config.ARVOLoginPassword
                    };

                    string jsonRequest = JsonConvert.SerializeObject(loginRequest);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    using (HttpClient client = new HttpClient())
                    {
                        HttpResponseMessage response = client.PostAsync(_config.LoginURL, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = response.Content.ReadAsStringAsync().Result;
                            JObject json = JObject.Parse(responseData);
                            _config.ARVOAccessToken = json["data"]["token"].ToString();
                        }
                    }

                    arvorepositoryEx.Update(_config);
                }
            }

            return _config;
        }
        [HttpPost]
        [Authorize]
        [Route("[action]")]

        public async Task<bool> LoggingAccessLog([FromBody] AccessLogApi payload)
        {
            bool resp = false;
            ARVOConfiguration _config = new ARVOConfiguration();

            var samsdata = this.dbc.ARVOConfiguration.Where(e => e.srNo == 28);
            _config = samsdata.FirstOrDefault();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                email = payload.Email,
                module = payload.Module,
                device = payload.Device,
                organization = payload.Organization
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = true;

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = true;
                    }

                }
            }


            return resp;
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GenerateMerchandiseChallan([FromBody] MerchandiseChallanModel model)
        {
            try
            {
                using (IDbConnection connection = dbc.Database.GetDbConnection())
                {
                    if (connection.State == ConnectionState.Closed)
                        connection.Open();

                    // SQL Query to call PostgreSQL function and get challan number
                    string query = "SELECT \"Fee\".\"GenerateMerchandiseChallan\"(@AdmissionFormId, @Amount, @OrderId);";

                    var challanNo = connection.ExecuteScalar<string>(query, new
                    {
                        AdmissionFormId = model.AdmissionFromId,
                        Amount = model.Amount,
                        OrderId = model.OrderId
                    });

                    if (connection.State == ConnectionState.Open)
                    {
                        connection.Close();
                        connection.Dispose();
                    }

                    return Ok(new { VoucherNo = challanNo });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Error generating challan", Error = ex.Message });
            }
        }

    }

}


public class MerchandiseChallanModel
{
    public Guid AdmissionFromId { get; set; }
    public int Amount { get; set; }
    public int OrderId { get; set; }
}
public class TeacherCalendarParam
{
    public Guid Teacher_ID { get; set; }
    public Guid Course_ID { get; set; }
    public Guid ClassID { get; set; }
    public Guid SubCityID { get; set; }

}
public class TeacherCalendarParamEx
{
    public Guid Teacher_ID { get; set; }
    public Guid Course_ID { get; set; }
    public Guid ClassID { get; set; }
    public Guid SubCityID { get; set; }
    public Guid SectionCourseLinkId { get; set; }
    public string listtopic { get; set; }



}

public class TeacherSearchParam
{
    public Guid Teacher_ID { get; set; }

}
public class StudentCalendarParam
{
    public Guid Student_ID { get; set; }

}
public class StudentCalendarParamEx
{
    public Guid Student_ID { get; set; }
    public Guid Class_ID { get; set; }
    public string TopicId { get; set; }

}
public class StudentCalendarParamHadaf
{
    public Guid Student_ID { get; set; }
    public Guid Class_ID { get; set; }

}

public class UserParams
{
    public string User_name { get; set; }
    public string User_Password { get; set; }
    public string App_Name { get; set; }
}
public class RTV
{
    public string ReturnValue { get; set; }
}

public class ApIStudentResponse
{
    [JsonProperty("Status")]
    public string Status { get; set; }

    [JsonProperty("Message")]
    public string Message { get; set; }

}
public class AttendenceDetailParam
{
    public string Student_Id { get; set; }

    public string Start_Date { get; set; }
    public string End_Date { get; set; }



}

public class AttendenceCourseParam
{
    public string TimeTable_Id { get; set; }

    public string Start_Date { get; set; }
    public string End_Date { get; set; }



}

public class ExamCourseParam
{
    public string SectionCourseLinkId { get; set; }

    public string ProgramCourseLinkId { get; set; }
    public string ExamTypeId { get; set; }



}
public class ProvidingString
{

    public string ProvidedString { get; set; }

}

public class ExamWeitageParam
{
    public string RollNo { get; set; }
}


public class AttendanceSectionParam
{
    public string SectionCourseLinkId { get; set; }

    public string ProgramCourseLinkId { get; set; }
    public string Start_Date { get; set; }



}
public class ExamCourseParam2
{
    public string SectionCourseLinkId { get; set; }

    public string ProgramCourseLinkId { get; set; }
    public string examnames { get; set; }



}


public class StudentExamCourseParam
{
    public string RollNo { get; set; }


    public string ExamNames { get; set; }

    public string CourseId { get; set; }



}

public class AccessLogApi
{
    public string Organization { get; set; }
    public string Email { get; set; }
    public string Module { get; set; }
    public string Device { get; set; }
}