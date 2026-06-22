using System;
using System;
using System.Collections.Generic;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http.Headers;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Cors;
using System.Globalization;
using MimeKit;
using static System.Net.Mime.MediaTypeNames;
using Azure.Storage.Blobs;
namespace Cms360.Server.Controllers
{
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [Route("api/[controller]")]
    [EnableCors("AllowPolicy")]
    public class OnlineAdmissionController : Controller
    {

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
        private readonly IOnlineAdmissionRepository repo;
        private IEmailService email;

        public OnlineAdmissionController(ICryptoService crypto,
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
            IOnlineAdmissionRepository repo,
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
            this.repo = repo;
            this.email = email;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SignUp([FromBody] Predicate predicate)
        {
            var obj = new AdmissionUserVM();
            obj.AdmissionUserId = new Guid(predicate.ProvidedString.Split("?")[0]);
            obj.Email = (predicate.ProvidedString.Split("?")[1]);
            obj.Password = (predicate.ProvidedString.Split("?")[2]);
            obj.DocumentLink = (predicate.ProvidedString.Split("?")[3]);
            obj.Flag = Convert.ToBoolean(predicate.ProvidedString.Split("?")[4]);
            obj.FullName = (predicate.ProvidedString.Split("?")[5]);
            obj.PhoneNo = (predicate.ProvidedString.Split("?")[6]);
            obj.StudentType = (predicate.ProvidedString.Split("?")[7]);
            obj.RefferenceNo = (predicate.ProvidedString.Split("?")[8]);
            obj.SubCityId = new Guid(predicate.ProvidedString.Split("?")[9]);
            obj.ProgramDetailId = new Guid(predicate.ProvidedString.Split("?")[10]);
            var dated = DateTime.Now;

            // var re = this.dbc.AdmissionUserVM.FromSql(String.Format(@"Select * from  ""OnlineAdmission"".""AdmissionUser"" where lower(""Email"")=lower('{0}') and ""StudentType"" = '{1}'", obj.Email, obj.StudentType)).ToList();

            // if (re.Count < 1)
            // {
            this.dbc.Database.ExecuteSqlCommand($"INSERT INTO \"OnlineAdmission\".\"AdmissionUser\" VALUES({obj.AdmissionUserId}, {obj.Email}, {obj.Password}, {obj.DocumentLink}, {obj.Flag}, {obj.FullName}, {obj.PhoneNo}, {obj.StudentType}, {obj.RefferenceNo}, {obj.SubCityId}, {obj.ProgramDetailId}, {dated})");
            return Ok(1);
            // }

            // else
            // {

            //     return Ok(0);

            // }

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityEx()
        {
            List<CitySubCity> res = new List<CitySubCity>();
            return Ok(this.dbc.CitySubCity);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityHadaf()
        {
            List<CityHadaf> res = new List<CityHadaf>();
            return Ok(this.dbc.CityHadaf);
        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityOnlineAdmissionPortalHadaf()
        {
            List<GetCityOnlineAdmissionPortalHadaf> res = new List<GetCityOnlineAdmissionPortalHadaf>();
            return Ok(this.dbc.GetCityOnlineAdmissionPortalHadaf);
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCityEx2([FromBody] Predicate param)
        {
            Console.WriteLine("-----------------Enterl;iudfnsd daskfklsdjfa----------------------" + param.ProvidedString);
            if (param.ProvidedString == "1")

            {
                return Ok(this.dbc.CitySubCity.FromSql("Select * from  \"Setup\".\"VWCitySubCityEx\"  "));

            }
            else
            {
                return Ok(this.dbc.CitySubCity.FromSql("Select * from  \"Setup\".\"VWCitySubCityEx\" where \"CityName\"='STEP' "));

            }


        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityEx3()
        {

            return Ok(this.dbc.CitySubCity.FromSql("Select * from  \"Setup\".\"VWCitySubCity2\"  "));

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCityOnlineAdmissionPortal()
        {

            return Ok(this.dbc.GetCityOnlineAdmissionPortal.FromSql("Select * from  \"Setup\".\"VWCitySubCityOnlineAdmission\"  "));

        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetOnlineData()
        {
            return Ok(this.dbc.OnlineAdmissionVM.ToList());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCampusData()
        {
            return Ok(this.dbc.CampusCityVMEx.ToList());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCampusDataHadaf()
        {
            return Ok(this.dbc.CampusCityVMExHadaf.ToList());
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllGeneralCitiesData()
        {
            string json = String.Format(@"select ""CityLocation"" as ""ProvidedString"" from public.""AllCities""");

            return Ok(this.dbc.Predicate.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetProgramDt([FromBody] OA_CityParameter param)
        {
            return Ok(this.dbc.ProgramListVM.Where(s => s.DDL_ID == param.City_ID));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetProgramDt2([FromBody] OA_CityParameter param)
        {
            return Ok(this.dbc.ProgramListVM2.Where(s => s.DDL_ID == param.City_ID));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetProgramDtEx([FromBody] OA_CityParameter param)
        {
            return Ok(this.dbc.ProgramListEx.Where(s => s.DDL_ID == param.City_ID));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetProgramDtHadaf([FromBody] OA_CityParameter param)
        {
            return Ok(this.dbc.ProgramListHadaf.Where(s => s.DDL_ID == param.City_ID));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalCityDDL([FromBody] SetupSubCity param)
        {
            var respon = new PopulateAll();
            respon.ResponseCode = "0";
            respon.Message = "";

            var result = this.dbc.SetupSubCity.Where(s => s.StatusId == 1).Select(x => new R_List()
            {
                DDL_ID = x.SubCityId.ToString(),
                DDL_Title = x.Name
            }).ToList();
            if (result.Count > 0)
            {
                respon.Message = "Cities Loaded Successfully";
                respon.R_List = result.AsEnumerable();
            }
            else
            {
                respon.Message = "Cities Loaded UnSuccessfully";
            }
            return Ok(respon);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalWebGenericDDL([FromBody] OA_Parameter param)
        {
            var respon = new PopulateAll();
            respon.ResponseCode = "0";
            respon.Message = "";
            var result = new List<R_List>();

            switch (param.DDL_Name)
            {
                case "Religion":
                    result = this.dbc.SetupReligion.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.ReligionId.ToString(),
                        DDL_Title = x.FullName
                    }).ToList();
                    break;
                case "Institutes":
                    result = this.dbc.SetupInstitution.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.InstitutionId.ToString(),
                        DDL_Title = x.FullName
                    }).ToList();
                    break;
                case "Nationality":
                    result = this.dbc.SetupNationality.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.NationalityId.ToString(),
                        DDL_Title = x.FullName
                    }).ToList();
                    break;
                case "Degree":
                    result = this.dbc.SetupDegree.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.DegreeId.ToString(),
                        DDL_Title = x.FullName
                    }).ToList();
                    break;
                case "Gender":
                    result = this.dbc.SetupGender.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.GenderId.ToString(),
                        DDL_Title = x.Description
                    }).ToList();
                    break;

                case "Board":
                    result = this.dbc.SetupBoard.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.BoardId.ToString(),
                        DDL_Title = x.FullName
                    }).ToList();
                    break;
                case "Group":
                    result = this.dbc.SetupGroup.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.GroupId.ToString(),
                        DDL_Title = x.FullName
                    }).ToList();
                    break;
                case "AdmYear":
                    result = this.dbc.SetupSession.FromSql(String.Format(@"SELECT * FROM ""Setup"".""Session"" WHERE ""Session"".""StatusId"" = 1 ORDER BY ""Session"".""FullName"" DESC LIMIT 1")).Select(x => new R_List()
                    {
                        DDL_ID = x.SessionId.ToString(),
                        DDL_Title = x.FullName
                    }).ToList();
                    break;
                case "Year":

                    var currentYear = DateTime.Today.Year;
                    for (int i = 5; i >= 0; i--)
                    {
                        var temp = new R_List();
                        temp.DDL_ID = ((currentYear).ToString());
                        temp.DDL_Title = ((currentYear).ToString());
                        result.Add(temp);
                        currentYear--;
                    }
                    break;
                case "City":
                    result = this.dbc.SetupSubCity.Where(s => s.StatusId == 1).Select(x => new R_List()
                    {
                        DDL_ID = x.SubCityId.ToString(),
                        DDL_Title = x.Name
                    }).ToList();
                    break;
                default:
                    // Console.WriteLine("Invalid grade");
                    break;
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult RefferenceNoGen([FromBody] Predicate predicate)
        {
            var subCityId = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programDetailId = new Guid(predicate.ProvidedString.Split("?")[1]);
            var list = (predicate.ProvidedString.Split("?")[2]);


            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"RefferenceNo\"('{0}','{1}','{2}')", subCityId, programDetailId, list);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            RefferenceNoResp[] obj = connection.Query<RefferenceNoResp>(json).ToArray<RefferenceNoResp>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertOnlineadmission([FromBody] Predicate predicate)
        {
            var list = new string(predicate.ProvidedString);
            var Data = this.log.GetLog();

            string json = string.Format("SELECT * FROM \"Admission\".\"insertonlineAdmissionEx\"('{0}','{1}')", list, Data);
            Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            OnlineAdmissionResponse[] obj = connection.Query<OnlineAdmissionResponse>(json).ToArray<OnlineAdmissionResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpLoadFileEx([FromBody] Predicate predicate)
        {
            var serverFilePath = (predicate.ProvidedString.Split("?")[0]);
            var localFilePath = (predicate.ProvidedString.Split("?")[1]);
            localFilePath = (localFilePath.Split("base64,")[1]);
            this.UpLoadFile(serverFilePath, localFilePath);


            return Ok("1");
        }



        public void UpLoadFile(String serverFilePath, string localFilePath)
        {
            String serverFullPath = "ftp://" + "172.19.10.82:21/Notification/" + serverFilePath;
            FtpWebRequest ftp = (FtpWebRequest)FtpWebRequest.Create(serverFullPath);
            ftp.Credentials = new NetworkCredential("steppics", "ttl123");
            ftp.KeepAlive = true;
            ftp.Method = WebRequestMethods.Ftp.UploadFile;
            ftp.UseBinary = true;


            //   using (FileStream fs = System.IO.File.OpenRead(@"C:\Users\CMS\Downloads\ic_call.png"))
            // {
            //     byte[] buffer = new byte[fs.Length];
            //     fs.Read(buffer, 0, buffer.Length);
            //     fs.Close();
            //     Stream ftpStream = ftp.GetRequestStream();
            //     Console.WriteLine("i m here");
            //     ftpStream.Write(buffer, 0, buffer.Length);
            //     ftpStream.Flush();
            //     ftpStream.Close();
            // }
            byte[] buffer = Convert.FromBase64String(localFilePath);
            Stream ftpStream = ftp.GetRequestStream();
            // Console.WriteLine("i m here");
            ftpStream.Write(buffer, 0, buffer.Length);
            ftpStream.Flush();
            ftpStream.Close();

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetOnlineStudent([FromBody] Predicate model)

        {
            var refferenceNo = model.ProvidedString;

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetOnlineStudent""('{0}')", refferenceNo);

            // Console.WriteLine(json);
            return Ok(this.dbc.OnlineApprovalStudent.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetProcessFee([FromBody] Predicate model)

        {
            var admissionformid = model.ProvidedString;

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetProcessFee""('{0}')", admissionformid);

            // Console.WriteLine(json);
            return Ok(this.dbc.OnlineProcessFee.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetProgramInfo([FromBody] Predicate model)

        {
            var campusprogramid = model.ProvidedString;

            string json = String.Format(@"select * from ""OnlineAdmission"".""GetProgramInfo""('{0}')", campusprogramid);

            // Console.WriteLine(json);
            return Ok(this.dbc.OnlineProgramInfo.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckStudentExist([FromBody] Predicate model)

        {
            var studentcnic = new string(model.ProvidedString.Split("?")[0]);
            var programdetailid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[3]);

            string json = String.Format(@"select * from ""Admission"".""CheckStudentExist""('{0}','{1}','{2}','{3}')", studentcnic, programdetailid, campusid, sessionid);

            Console.WriteLine(json);
            return Ok(this.dbc.GetResult.FromSql(json));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckValidityligibilityCriteria([FromBody] Predicate model)

        {
            var campusprogramid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderid = new Guid(model.ProvidedString.Split("?")[1]);

            string json = String.Format(@"select * from ""Admission"".""CheckValidityEligibility""('{0}','{1}')", campusprogramid, genderid);

            Console.WriteLine(json);
            return Ok(this.dbc.GetResult.FromSql(json));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult checkAdmission([FromBody] Predicate predicate)
        {


            var list = new string(predicate.ProvidedString);

            string json = string.Format("SELECT * FROM \"Admission\".\"GetAdmissionUpdData\"('{0}')", list);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            OnlineAdmissionUpdData[] obj = connection.Query<OnlineAdmissionUpdData>(json).ToArray<OnlineAdmissionUpdData>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult checkAdmissionEx([FromBody] Predicate predicate)
        {
            var list = new string(predicate.ProvidedString);

            string json = string.Format("SELECT * FROM \"Admission\".\"GetAdmissionUpdDataEx\"('{0}')", list);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            OnlineAdmissionUpdDataEx[] obj = connection.Query<OnlineAdmissionUpdDataEx>(json).ToArray<OnlineAdmissionUpdDataEx>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAdmissionPaidDateEnable([FromBody] Predicate predicate)
        {
            var list = new string(predicate.ProvidedString);

            string sql = string.Format("SELECT * FROM \"Admission\".\"GetAdmissionPaidDateEnable\"('{0}')", list);

            IDbConnection connection = dbc.Database.GetDbConnection();

            if (connection.State == ConnectionState.Closed)
                connection.Open();

            var data = connection.Query<bool>(sql);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            Console.WriteLine(data);
            return Ok(data);

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllSectionPrevileges([FromBody] Predicate model)
        {
            IDbConnection connection = dbc.Database.GetDbConnection();

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
        public IActionResult InsertOnlineadmission2([FromBody] Predicate predicate)
        {
            var list = new string(predicate.ProvidedString);
            var Data = this.log.GetLog();

            string json = string.Format("SELECT * FROM \"Admission\".\"insertonlineAdmission2\"('{0}','{1}')", list, Data);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            OnlineAdmissionResponseEx[] obj = connection.Query<OnlineAdmissionResponseEx>(json).ToArray<OnlineAdmissionResponseEx>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult updateCMSAdmission([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            var list = new string(predicate.ProvidedString.Split("?")[0]);
            var admissionFormId = new Guid(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"Admission\".\"UpdateOnlineCms\"('{0}','{1}')as \"ProvidedString\" ", list, admissionFormId);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            obj.ProvidedString = connection.Query<Predicate>(json).FirstOrDefault().ProvidedString;

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult getStdChallaninfor([FromBody] Predicate predicate)
        {

            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"getStudentChallanInfo\"('{0}')", predicate.ProvidedString);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            StdChllnResponse[] obj = connection.Query<StdChllnResponse>(json).ToArray<StdChllnResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckScholarship([FromBody] Predicate predicate)
        {
            try
            {
                var admissiionformid = new Guid(predicate.ProvidedString);
                var z = this.dbc.IntModel.FromSql(String.Format("SELECT * from \"OnlineAdmission\".\"getStudentscholarshipInfo\"('{0}') AS val", admissiionformid));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckScholarship()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.dbc.Add(app.Message);
                this.dbc.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertOnlineadmissionEx([FromBody] Predicate predicate)
        {
            var list = new string(predicate.ProvidedString);
            var Data = this.log.GetLog();

            string json = string.Format("SELECT * FROM \"Admission\".\"insertonlineAdmissionPre\"('{0}','{1}')", list, Data);
            Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            OnlineAdmissionResponse[] obj = connection.Query<OnlineAdmissionResponse>(json).ToArray<OnlineAdmissionResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertOnlineadmissionHadafPre([FromBody] Predicate predicate)
        {
            var list = new string(predicate.ProvidedString);
            var Data = this.log.GetLog();

            string json = string.Format("SELECT * FROM \"Admission\".\"insertonlineAdmissionHadafPre\"('{0}','{1}')", list, Data);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            OnlineAdmissionResponse[] obj = connection.Query<OnlineAdmissionResponse>(json).ToArray<OnlineAdmissionResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Sendsms([FromBody] Predicate predicate)
        {
            var fullname = predicate.ProvidedString.Split("?")[0];
            var email = predicate.ProvidedString.Split("?")[1];
            var pin = predicate.ProvidedString.Split("?")[2];
            var contactno = predicate.ProvidedString.Split("?")[3];
            var link = predicate.ProvidedString.Split("?")[4];
            IDbConnection connection = dbc.Database.GetDbConnection();

            string json = String.Format("SELECT \"OnlineAdmission\".\"Sms\"('{0}','{1}','{2}','{3}','{4}') as val", fullname, email, pin, contactno, link);

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
        public IActionResult GetloginData([FromBody] Predicate predicate)
        {
            var email = new string(predicate.ProvidedString.Split("?")[0]);
            var passw = new string(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"GetLoginData\"('{0}','{1}')", email, passw);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            LoginAdmResponse[] obj = connection.Query<LoginAdmResponse>(json).ToArray<LoginAdmResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetloginDataEx([FromBody] Predicate predicate)
        {
            var reff = new string(predicate.ProvidedString.Split("?")[0]);
            var passw = new string(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"GetLoginDataEx\"('{0}','{1}')", reff, passw);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            LoginAdmResponseEx[] obj = connection.Query<LoginAdmResponseEx>(json).ToArray<LoginAdmResponseEx>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetChallnInfo([FromBody] Predicate predicate)
        {
            var rollno = new string(predicate.ProvidedString.Split("?")[0]);

            string json = string.Format("SELECT * FROM \"Fee\".\"PrintChallanInfo\"('{0}')", rollno);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            ChallanResp[] obj = connection.Query<ChallanResp>(json).ToArray<ChallanResp>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentKinship([FromBody] Predicate predicate)
        {
            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);

            string json = string.Format("SELECT * FROM \"Admission\".\"GetKinshipStudentEx\"('{0}')", admissionformid);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            KinshipResponse[] obj = connection.Query<KinshipResponse>(json).ToArray<KinshipResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetConcessionStudent([FromBody] Predicate predicate)
        {
            var admissionformid = new Guid(predicate.ProvidedString.Split("?")[0]);

            string json = string.Format("SELECT * FROM \"Admission\".\"GetConcessionStudentEx\"('{0}')", admissionformid);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            ConcessionResponse[] obj = connection.Query<ConcessionResponse>(json).ToArray<ConcessionResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetUserNamePasword([FromBody] Predicate predicate)
        {
            var refno = new string(predicate.ProvidedString);

            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"GetUserNamePass\"('{0}')", refno);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            GetUserPassResponse[] obj = connection.Query<GetUserPassResponse>(json).ToArray<GetUserPassResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult sendStepSms([FromBody] Predicate predicate)
        {
            var mob = new string(predicate.ProvidedString.Split("?")[0]);
            var msg = new string(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"SendStepSms\"('{0}','{1}')", mob, msg);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            GetUserPassResponse[] obj = connection.Query<GetUserPassResponse>(json).ToArray<GetUserPassResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult sendCmsSms([FromBody] Predicate predicate)
        {
            var mob = new string(predicate.ProvidedString.Split("?")[0]);
            var msg = new string(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"SendCmsSms\"('{0}','{1}')", mob, msg);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            GetUserPassResponse[] obj = connection.Query<GetUserPassResponse>(json).ToArray<GetUserPassResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SubmitForm([FromBody] Predicate predicate)
        {
            var userid = new Guid(predicate.ProvidedString.Split("?")[0]);
            // var msg = new string(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"SubmitForm\"('{0}')", userid);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            GetUserPassResponse[] obj = connection.Query<GetUserPassResponse>(json).ToArray<GetUserPassResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertStudentKinship([FromBody] Predicate predicate)
        {
            var list = (predicate.ProvidedString.Split("?")[0]);
            // var msg = new string(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"Admission\".\"InsertStudentKinship\"('{0}')", list);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            GetUserPassResponse[] obj = connection.Query<GetUserPassResponse>(json).ToArray<GetUserPassResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertConcessionStudent([FromBody] Predicate predicate)
        {
            var list = (predicate.ProvidedString.Split("?")[0]);
            // var msg = new string(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"Admission\".\"InsertConcessionStudent\"('{0}')", list);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            GetUserPassResponse[] obj = connection.Query<GetUserPassResponse>(json).ToArray<GetUserPassResponse>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(obj);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalProgramDDL([FromBody] OA_CityParameter param)
        {
            var respon = new PopulateAll();
            respon.ResponseCode = "0";
            respon.Message = "";

            var result = this.dbc.ProgramListVM.Where(s => s.DDL_ID == param.City_ID).Select(x => new R_List()
            {
                DDL_ID = x.ProgramDetailId.ToString(),
                DDL_Title = x.Description
            }).ToList();
            if (result.Count > 0)
            {
                respon.Message = "Program Loaded Successfully";
                respon.R_List = result.AsEnumerable();
            }
            else
            {
                respon.Message = "Program Loaded UnSuccessfully";
            }
            return Ok(respon);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentPortalTotMarks([FromBody] OA_ProgramParameter param)
        {
            var respon = new PopulateAll();
            respon.ResponseCode = "0";
            respon.Message = "";

            var result = this.dbc.MarksData.FromSql(String.Format(@"select * from ""Setup"".""TotalMarks"" ")).Select(x => new R_List()
            {
                DDL_ID = x.Marks.ToString(),
                DDL_Title = x.Marks.ToString()
            }).ToList();
            if (result.Count > 0)
            {
                respon.Message = "Program Detail Loaded Successfully.";
                respon.R_List = result.AsEnumerable();
            }
            else
            {
                respon.Message = "Program Detail Loaded UnSuccessfully";
            }
            return Ok(respon);
        }

        [HttpPost]
        [Route("PrChallan")]
        public IActionResult PrChallan([FromBody] Predicate predicate)
        {
            var challan = predicate.ProvidedString.Split("?")[0];
            var challantypeid = new Guid(predicate.ProvidedString.Split("?")[1]);

            var challanReport = new List<ChallanBReport>();
            var generalList = new GeneralList();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReport();
            var infod = new InfoList();
            var bank = new BankDataList();
            string strRes = "<br/> Note: <br/> ";

            string strRr = "<strong> ";
            model = new ChallanBReport();
            string ql = String.Format(@"Select * from ""Fee"".""ChallanReport""('{0}')", challan);
            var data = this.dbc.StudentChallanReportFu.FromSql(ql).ToList();
            model.ChallanNo = data[0].ChallanNo;
            // var bankNote = this.dbc.BankIbanVM.Where(e => e.CampusId == data[0].CampusId).ToList();
            // var jk = data[0].InstallmentNo.Substring(13,1);
            // var inst = Convert.ToInt32(jk);
            var challanNote = this.dbc.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.ChallanTypeId == challantypeid).ToList();
            if (challanNote.Count > 0)
            {
                foreach (var cNote in challanNote)
                {
                    cNote.Description = String.Concat("<li>", cNote.Description);
                    cNote.Description = String.Concat(cNote.Description, "</li>");
                    strRes = String.Concat(strRes, cNote.Description);
                }
            }

            generalList = new GeneralList();
            generalList.BusinessUnit = data[0].BusinessUnit;
            generalList.CampusName = data[0].CampusName;
            generalList.Cap = data[0].Cap;
            generalList.ChallanAmount = data[0].ChallanAmount;
            generalList.ChallanNo = data[0].ChallanNo;
            generalList.CustomerCode = data[0].CustomerCode;
            generalList.Description = data[0].Description;
            generalList.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
            generalList.DueDate = data[0].DueDate;
            generalList.FatherName = data[0].FatherName;
            generalList.FullName = data[0].FullName;
            generalList.InstallmentNo = data[0].InstallmentNo;
            generalList.ObtainMarks = data[0].ObtainMarks;
            generalList.TotalMarks = data[0].TotalMarks;
            generalList.RefferenceNo = data[0].RefferenceNo;
            generalList.SectionName = data[0].SectionName;
            generalList.UserName = "1814";

            strRr = String.Concat(strRr, data[0].ZoneNote);
            strRr = String.Concat(strRr, "</strong>");
            strRr = String.Concat(strRr, strRes);
            generalList.ChallanNote = strRr;
            // generalList.BankIban = bankNote[0].BankDetail;
            model.General = generalList;

            string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
            // Console.WriteLine(sqlex);
            var bankresult = this.dbc.CampusBank.FromSql(sqlex);
            foreach (var itemdata in data)
            {
                infod = new InfoList();
                infod.ChallanNo = itemdata.ChallanNo;
                infod.ConcessionName = itemdata.ConcessionName;
                infod.FeeAmount = itemdata.FeeAmount;
                infod.FeeHead = itemdata.FeeHead;
                infod.PayableAmount = itemdata.PayableAmount;
                infoList.Add(infod);
            }

            model.ChallanInfo.AddRange(infoList);
            infoList = new List<InfoList>();

            foreach (var bankdata in bankresult)
            {
                bank = new BankDataList();
                bank.ChallanNo = data[0].ChallanNo;
                bank.BankName = bankdata.BankName;
                bank.Address = bankdata.Address;
                bank.AccountNo = bankdata.AccountNo;
                bankList.Add(bank);

            }

            model.Banks.AddRange(bankList);
            bankList = new List<BankDataList>();
            subinst = new SubInstList();
            subinst.ChallanNo = data[0].ChallanNo;
            subinst.ChallanNoEx = "";
            subinst.DueDate = null;
            subinst.FeeAmount = 0;
            NextInstallment.Add(subinst);

            model.NextInstallment.AddRange(NextInstallment);
            NextInstallment = new List<SubInstList>();
            challanReport.Add(model);

            return Ok(challanReport);

        }

        [HttpPost]
        [Route("PrChallanEx")]
        public IActionResult PrChallanEx([FromBody] Predicate predicate)
        {
            var challan = predicate.ProvidedString.Split("?")[0];
            var challantypeid = new Guid(predicate.ProvidedString.Split("?")[1]);

            var challanReport = new List<ChallanBReportExLatest>();
            var generalList = new GeneralListExLatest();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportExLatest();
            var infod = new InfoList();
            var bank = new BankDataList();
            var challanNote = new List<FeeCampusChallanNoteLinkVM>();
            string strRes = "<br/> Note: <br/> ";

            string strRr = "<strong> ";
            model = new ChallanBReportExLatest();
            string ql = String.Format(@"Select * from ""Fee"".""ChallanReportLatest""('{0}')", challan);
            var data = this.dbc.StudentChallanReportFuLatest.FromSql(ql).ToList();
            model.ChallanNo = data[0].ChallanNo;
            var bankNote = this.dbc.ClassNote.Where(e => e.ClassId == data[0].ClassId).ToList();
            if (challantypeid.ToString() == "73d41647-8f68-4af1-a365-75e286f3f59b")
            {
                var jk = data[0].InstallmentNo.Substring(13, 1);
                var inst = Convert.ToInt32(jk);
                challanNote = this.dbc.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.InstallmentNo == inst && e.ChallanTypeId == challantypeid).ToList();
            }
            else
            {
                challanNote = this.dbc.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.ChallanTypeId == challantypeid).ToList();

            }
            if (challanNote.Count > 0)
            {
                foreach (var cNote in challanNote)
                {
                    cNote.Description = String.Concat("<li>", cNote.Description);
                    cNote.Description = String.Concat(cNote.Description, "</li>");
                    strRes = String.Concat(strRes, cNote.Description);
                }
            }

            generalList = new GeneralListExLatest();
            generalList.BusinessUnit = data[0].BusinessUnit;
            generalList.Prefix = data[0].Prefix;
            generalList.MobileApp = data[0].MobileApp;
            generalList.MobileApp1 = data[0].MobileApp1;
            generalList.MobileApp2 = data[0].MobileApp2;
            generalList.MobileApp3 = data[0].MobileApp3;
            generalList.MobileApp4 = data[0].MobileApp4;
            generalList.MobileApp5 = data[0].MobileApp5;
            generalList.CampusName = data[0].CampusName;
            generalList.Cap = data[0].Cap;
            generalList.ChallanAmount = data[0].ChallanAmount;
            generalList.ChallanNo = data[0].ChallanNo;
            generalList.CustomerCode = data[0].CustomerCode;
            generalList.Description = data[0].Description;
            generalList.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
            generalList.DueDate = data[0].DueDate;
            generalList.FatherName = data[0].FatherName;
            generalList.FullName = data[0].FullName;
            generalList.InstallmentNo = data[0].InstallmentNo;
            generalList.ObtainMarks = data[0].ObtainMarks;
            generalList.TotalMarks = data[0].TotalMarks;
            generalList.RefferenceNo = data[0].RefferenceNo;
            generalList.SectionName = data[0].SectionName;
            generalList.UserName = "1814";

            strRr = String.Concat(strRr, data[0].ZoneNote);
            strRr = String.Concat(strRr, "</strong>");
            strRr = String.Concat(strRr, strRes);
            generalList.ChallanNote = strRr;
            if (bankNote.Count > 0)
            {
                generalList.BankIban = bankNote[0].ChallanNote;
            }
            else
            {
                generalList.BankIban = "";
            }
            model.General = generalList;

            string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
            // Console.WriteLine(sqlex);
            var bankresult = this.dbc.CampusBank.FromSql(sqlex);
            foreach (var itemdata in data)
            {
                infod = new InfoList();
                infod.ChallanNo = itemdata.ChallanNo;
                infod.ConcessionName = itemdata.ConcessionName;
                infod.FeeAmount = itemdata.FeeAmount;
                infod.FeeHead = itemdata.FeeHead;
                infod.PayableAmount = itemdata.PayableAmount;
                infoList.Add(infod);
            }

            model.ChallanInfo.AddRange(infoList);
            infoList = new List<InfoList>();

            foreach (var bankdata in bankresult)
            {
                bank = new BankDataList();
                bank.ChallanNo = data[0].ChallanNo;
                bank.BankName = bankdata.BankName;
                bank.Address = bankdata.Address;
                bank.AccountNo = bankdata.AccountNo;
                bankList.Add(bank);

            }

            model.Banks.AddRange(bankList);
            bankList = new List<BankDataList>();
            subinst = new SubInstList();
            subinst.ChallanNo = data[0].ChallanNo;
            subinst.ChallanNoEx = "";
            subinst.DueDate = null;
            subinst.FeeAmount = 0;
            NextInstallment.Add(subinst);

            model.NextInstallment.AddRange(NextInstallment);
            NextInstallment = new List<SubInstList>();
            challanReport.Add(model);

            return Ok(challanReport);

        }



        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult PrintChallanMerchandise([FromBody] Predicate predicate)
        {
            var challan = predicate.ProvidedString.Split("?")[0];
            var challantypeid = new Guid(predicate.ProvidedString.Split("?")[1]);

            var challanReport = new List<ChallanBReportLatestEx>();
            var generalList = new GeneralListLatestEx();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportLatestEx();
            var infod = new InfoList();
            var bank = new BankDataList();
            var challanNote = new List<FeeCampusChallanNoteLinkVM>();
            string strRes = "<br/> Note: <br/> ";

            string strRr = "<strong> ";
            model = new ChallanBReportLatestEx();
            string ql = String.Format(@"Select * from ""Fee"".""ChallanReportMerchandise""('{0}')", challan);
            var data = this.dbc.StudentChallanReportFuLatest.FromSql(ql).ToList();
            model.ChallanNo = data[0].ChallanNo;
            var bankNote = this.dbc.ClassNote.Where(e => e.ClassId == data[0].ClassId).ToList();
            if (challantypeid.ToString() == "73d41647-8f68-4af1-a365-75e286f3f59b")
            {
                var jk = data[0].InstallmentNo.Substring(13, 1);
                var inst = Convert.ToInt32(jk);
                challanNote = this.dbc.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.InstallmentNo == inst && e.ChallanTypeId == challantypeid).ToList();
            }
            else
            {
                challanNote = this.dbc.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == data[0].CampusId && e.ChallanTypeId == challantypeid).ToList();

            }
            if (challanNote.Count > 0)
            {
                foreach (var cNote in challanNote)
                {
                    cNote.Description = String.Concat("<li>", cNote.Description);
                    cNote.Description = String.Concat(cNote.Description, "</li>");
                    strRes = String.Concat(strRes, cNote.Description);
                }
            }

            generalList = new GeneralListLatestEx();
            generalList.BusinessUnit = data[0].BusinessUnit;
            generalList.Prefix = data[0].Prefix;
            generalList.MobileApp = data[0].MobileApp;
            generalList.MobileApp1 = data[0].MobileApp1;
            generalList.MobileApp2 = data[0].MobileApp2;
            generalList.MobileApp3 = data[0].MobileApp3;
            generalList.MobileApp4 = data[0].MobileApp4;
            generalList.MobileApp5 = data[0].MobileApp5;
            generalList.CampusName = data[0].CampusName;
            generalList.Cap = data[0].Cap;
            generalList.ChallanAmount = data[0].ChallanAmount;
            generalList.ChallanNo = data[0].ChallanNo;
            generalList.CustomerCode = data[0].CustomerCode;
            generalList.Description = data[0].Description;
            generalList.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
            generalList.DueDate = data[0].DueDate;
            generalList.FatherName = data[0].FatherName;
            generalList.FullName = data[0].FullName;
            generalList.InstallmentNo = data[0].InstallmentNo;
            generalList.ObtainMarks = data[0].ObtainMarks;
            generalList.TotalMarks = data[0].TotalMarks;
            generalList.RefferenceNo = data[0].RefferenceNo;
            generalList.AdmissionFormId = data[0].AdmissionFormId;

            generalList.SectionName = data[0].SectionName;
            generalList.UserName = "1814";

            strRr = String.Concat(strRr, data[0].ZoneNote);
            strRr = String.Concat(strRr, "</strong>");
            strRr = String.Concat(strRr, strRes);
            generalList.ChallanNote = strRr;
            if (bankNote.Count > 0)
            {
                generalList.BankIban = bankNote[0].ChallanNote;
            }
            else
            {
                generalList.BankIban = "";
            }
            model.General = generalList;

            string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
            // Console.WriteLine(sqlex);
            var bankresult = this.dbc.CampusBank.FromSql(sqlex);
            foreach (var itemdata in data)
            {
                infod = new InfoList();
                infod.ChallanNo = itemdata.ChallanNo;
                infod.ConcessionName = itemdata.ConcessionName;
                infod.FeeAmount = itemdata.FeeAmount;
                infod.FeeHead = itemdata.FeeHead;
                infod.PayableAmount = itemdata.PayableAmount;
                infoList.Add(infod);
            }

            model.ChallanInfo.AddRange(infoList);
            infoList = new List<InfoList>();

            foreach (var bankdata in bankresult)
            {
                bank = new BankDataList();
                bank.ChallanNo = data[0].ChallanNo;
                bank.BankName = bankdata.BankName;
                bank.Address = bankdata.Address;
                bank.AccountNo = bankdata.AccountNo;
                bankList.Add(bank);

            }

            model.Banks.AddRange(bankList);
            bankList = new List<BankDataList>();
            subinst = new SubInstList();
            subinst.ChallanNo = data[0].ChallanNo;
            subinst.ChallanNoEx = "";
            subinst.DueDate = null;
            subinst.FeeAmount = 0;
            NextInstallment.Add(subinst);

            model.NextInstallment.AddRange(NextInstallment);
            NextInstallment = new List<SubInstList>();
            challanReport.Add(model);

            return Ok(challanReport);

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult CheckFeePaid([FromBody] Predicate predicate)
        {
            try
            {


                var z = this.dbc.IntModel.FromSql(String.Format("select count(*) as val from \"Fee\".\"StudentChallan\"  where \"ChallanNo\"='{0}' and \"PaidDate\" is not null", predicate.ProvidedString));
                return Ok(z);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE PAID CONTROLLER.CheckFeePaid()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.dbc.Add(app.Message);
                this.dbc.SaveChangesAsync();
                return BadRequest(app.Message);

            }

        }

        [HttpPost]
        [Route("[action]")]
        public void SendEamilSubj([FromBody] EmailObjectEx emb)
        {
            var message = this.email.GetMessageObjForAuthLoginEmailEx(emb.Email, emb.Message);
            message.Subject = emb.Subject;
            message.Body = new TextPart("html")
            {
                Text = emb.Message
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
        [Route("[action]")]
        public void SendEamilEx([FromBody] EmailObject emb)
        {
            var message = this.email.GetMessageObjForAuthLoginEmailEx(emb.Email, emb.Message);
            message.Subject = "Thank You for registering with CMS";
            message.Body = new TextPart("html")
            {
                Text = emb.Message
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
        [Route("[action]")]
        public void SendEamilHadaf([FromBody] EmailObject emb)
        {
            var message = this.email.GetMessageObjForAuthLoginEmailHadaf(emb.Email, emb.Message);
            message.Subject = "Thank you for your application";
            message.Body = new TextPart("html")
            {
                Text = emb.Message
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("admissions@hadaf.edu.pk", "Coc06558");
                client.Send(message);
                client.Disconnect(true);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public void SendEamilStep([FromBody] EmailObject emb)
        {
            var message = this.email.GetMessageObjForAuthLoginEmailStep(emb.Email, emb.Message);
            message.Subject = "Confirmation of Registration";
            message.Body = new TextPart("html")
            {
                Text = emb.Message
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("admissions@step.cms.edu.pk", "P@kist0n123");
                client.Send(message);
                client.Disconnect(true);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public void SendEamil([FromBody] EmailObject emb)
        {
            var message = this.email.GetMessageObjForAuthLoginEmail(emb.Email, emb.Message);
            message.Subject = "From Campus Managment System";
            message.Body = new TextPart("Plain")
            {
                Text = emb.Message
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("webmaster@cms.edu.pk", "GvpF[4adX1Hd7hC");
                client.Send(message);
                client.Disconnect(true);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetPassword([FromBody] ForgotPassword emb)
        {
            var result = this.dbc.UserCredencials.FromSql($"SELECT sul.\"Password\" FROM \"Admission\".\"Students\" std JOIN \"Admission\".\"AdmissionForm\" adf ON adf.\"StudentId\" = std.\"StudentId\" LEFT JOIN \"Role\".\"StudentUserLink\" sul ON sul.\"StudentId\" = std.\"StudentId\" WHERE adf.\"RollNo\" ILIKE {emb.RollNo} AND std.\"ParentCNIC\" = {emb.Cnic}").FirstOrDefault();
            if (result == null)
            {
                Cms360.UI.Controllers.Account.MigrationController mc = new Cms360.UI.Controllers.Account.MigrationController(dbc, log);
                result = mc.GetPassword(emb.RollNo, emb.Cnic);
            }
            if (result.Password.Length < 1)
            {
                result.Password = "Dear student, Seems like you are facing an issue logging in. Kindly call on 080078608 to get your issue resolved promptly.";
            }

            return Ok(result);
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult imagepath([FromBody] Predicate prms)
        {
            try
            {




                string ImageFolder = prms.ProvidedString.Split("?")[0].ToLower();
                string imgtype = (prms.ProvidedString.Split("?")[1]);
                string connectionString = @"BlobEndpoint=https://pcadmissiondata.blob.core.windows.net/;QueueEndpoint=https://pcadmissiondata.queue.core.windows.net/;FileEndpoint=https://pcadmissiondata.file.core.windows.net/;TableEndpoint=https://pcadmissiondata.table.core.windows.net/;SharedAccessSignature=sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-12-09T20:12:45Z&st=2020-09-19T12:12:45Z&spr=https,http&sig=vBSp583pF0ReZeOEcDe%2BdGnyVMRGsXjYyVZE0YNNbu4%3D";


                BlobClient client = new BlobClient(connectionString, ImageFolder.ToLower(), imgtype + ".jpg");
                string downloadPath = imgtype;
                MemoryStream ms = new MemoryStream();
                client.DownloadTo(ms);
                byte[] imageArray = ms.ToArray();
                string base64ImageRepresentation = Convert.ToBase64String(imageArray);

                return Ok(base64ImageRepresentation);

                // if (directoryFiles.Length == 0)
                // {
                //     return Ok(null);

                // }
                // string imgpath = "";

                // if (prms.ProvidedString != null)
                // {
                //     foreach (var item in directoryFiles)
                //     {

                //         if (item.Contains(imgtype.ToString()))
                //         {
                //             imgpath = item;
                //             break;

                //         }

                //     }
                // if (imgpath != "")
                // {
                //     byte[] imageArray = System.IO.File.ReadAllBytes(imgpath);
                //     string base64ImageRepresentation = Convert.ToBase64String(imageArray);
                //     return Ok(base64ImageRepresentation);

                //     //return Ok(imgpath);
                // }

                //return Ok(imgpath);


            }

            catch (Exception ex)
            {
                // Console.WriteLine(ex);
                return Ok(null);
            }

        }






        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult imagedelete([FromBody] Predicate prms)
        {
            try
            {
                string ImageFolder = prms.ProvidedString.Split("?")[0].ToLower();
                string imgtype = (prms.ProvidedString.Split("?")[1]);
                string connectionString = @"BlobEndpoint=https://pcadmissiondata.blob.core.windows.net/;QueueEndpoint=https://pcadmissiondata.queue.core.windows.net/;FileEndpoint=https://pcadmissiondata.file.core.windows.net/;TableEndpoint=https://pcadmissiondata.table.core.windows.net/;SharedAccessSignature=sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-12-09T20:12:45Z&st=2020-09-19T12:12:45Z&spr=https,http&sig=vBSp583pF0ReZeOEcDe%2BdGnyVMRGsXjYyVZE0YNNbu4%3D";
                BlobClient client = new BlobClient(connectionString, ImageFolder.ToLower(), imgtype + ".jpg");
                var result = client.DeleteIfExists();
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Console.WriteLine(ex);
                return Ok(null);
            }

        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateAdmissionLinks([FromBody] Predicate model)
        {

            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var links = (model.ProvidedString.Split("?")[1]);
            string json = string.Format("SELECT * FROM \"OnlineAdmission\".\"UpdateUserLink\"('{0}','{1}')", admissionformid, links);
            // Console.WriteLine(json);
            IDbConnection connection = dbc.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var con = connection.Execute(json);

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            //      // Console.WriteLine((String.Format("Update \"Admission\".\"AdmissionForm\" set \"Operation\"='{0}'   Where \"AdmissionFormId\"=('{1}')", links,admissionformid)));

            //   var z = (this.dbc.Database.ExecuteSqlCommand(String.Format("Update \"Admission\".\"AdmissionForm\" set \"Operation\"='{0}'   Where \"AdmissionFormId\"=('{1}')", links,admissionformid)));



            return Ok("Images Link Updated SuccessFully");
        }


        [HttpPost]
        [Route("[action]")]
        public string FileUploaded()
        {
            // HttpPostedFileBase files
            try

            {
                var file = Request.Form.Files[0];

                var TeacherID = Request.Form["std"];

                var doctype = Request.Form["filetype"];
                string folderName = TeacherID;


                string connectionString = @"BlobEndpoint=https://pcadmissiondata.blob.core.windows.net/;QueueEndpoint=https://pcadmissiondata.queue.core.windows.net/;FileEndpoint=https://pcadmissiondata.file.core.windows.net/;TableEndpoint=https://pcadmissiondata.table.core.windows.net/;SharedAccessSignature=sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-12-09T20:12:45Z&st=2020-09-19T12:12:45Z&spr=https,http&sig=vBSp583pF0ReZeOEcDe%2BdGnyVMRGsXjYyVZE0YNNbu4%3D";
                string containerName = TeacherID;
                containerName = containerName.ToLower();
                string blobName = TeacherID;
                string filePath = doctype;
                // string fileName = "sample-file";
                // string newPath = Path.Combine(webRootPath, folderName);
                // if (!Directory.Exists(newPath))
                // {
                //     Directory.CreateDirectory(newPath);
                // }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');


                    string date = DateTime.Now.ToString("yyyy-MM-dd hh-mm-sstt");
                    // string FileExtenstion = Path.GetExtension(fileName);
                    string newFile = doctype + ".jpg";

                    BlobContainerClient container = new BlobContainerClient(connectionString, containerName);
                    if (!container.Exists())
                    {
                        container.Create();
                    }
                    BlobClient blob = container.GetBlobClient(newFile);




                    using (var stream = new FileStream(newFile, FileMode.Create))
                    {

                        file.CopyTo(stream);

                    }
                    blob.Upload(newFile);
                }

                //this.log.Insert((newPath), "FileUploaded");

                return "Upload Successfully.";

            }
            catch (Exception e)
            {
                return "Error in File Uploaded";
            }
        }
        // ONline Admission Entry
        [HttpGet]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetConcessionType()
        {

            var sql = String.Format(@"Select * From   ""OnlineAdmission"".""ConcessionType"" ");
            return Ok(this.dbc.ConcessionType.FromSql(sql));


        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetConcessionPost([FromBody] Predicate model)
        {
            var subcityId = new Guid(model.ProvidedString);

            var sql = String.Format(@"Select * From   ""OnlineAdmission"".""GetConcessionType""('{0}')", subcityId);
            return Ok(this.dbc.ConcessionType.FromSql(sql));
        }
        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCampusProgramInfo([FromBody] Predicate model)
        {

            var CampusId = new Guid(model.ProvidedString);


            var sql = String.Format(@"Select * from ""Setup"".""GetCampusProgramInfo""('{0}')", CampusId);

            return Ok(this.dbc.CampusProgramInfo.FromSql(sql));


        }


        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCampusProgramInfoGender([FromBody] Predicate model)
        {

            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderid = new Guid(model.ProvidedString.Split("?")[1]);


            var sql = String.Format(@"Select * from ""Setup"".""GetCampusProgramInfo""('{0}','{1}')", subcityid, genderid);

            return Ok(this.dbc.CampusProgramInfo.FromSql(sql));


        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCampusProgramInfoGenderHadaf([FromBody] Predicate model)
        {

            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderid = new Guid(model.ProvidedString.Split("?")[1]);
            var sql = String.Format(@"Select * from ""Setup"".""GetCampusProgramInfoHadaf""('{0}','{1}')", subcityid, genderid);

            return Ok(this.dbc.CampusProgramInfo.FromSql(sql));


        }

                [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCampusProgramInfoGenderHadafWithCampus([FromBody] Predicate model)
        {

            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusId = new Guid(model.ProvidedString.Split("?")[2]);
            var sql = String.Format(@"Select * from ""Setup"".""GetCampusProgramInfoHadafCampusWise""('{0}','{1}','{2}')", subcityid, genderid,campusId);

            return Ok(this.dbc.CampusProgramInfo.FromSql(sql));


        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCampusProgramInfoGenderCampusWise([FromBody] Predicate model)
        {

            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);

            var sql = String.Format(@"Select * from ""Setup"".""GetCampusProgramInfoGenderCampusWise""('{0}','{1}','{2}')", subcityid, genderid, campusid);

            return Ok(this.dbc.CampusProgramInfo.FromSql(sql));


        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCampusProgramInfoGenderCampusWiseHadaf([FromBody] Predicate model)
        {

            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderid = new Guid(model.ProvidedString.Split("?")[1]);
            var campusid = new Guid(model.ProvidedString.Split("?")[2]);

            var sql = String.Format(@"Select * from ""Setup"".""GetCampusProgramInfoGenderCampusWiseHadaf""('{0}','{1}','{2}')", subcityid, genderid, campusid);

            return Ok(this.dbc.CampusProgramInfo.FromSql(sql));


        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCampusDataGenderWise([FromBody] Predicate model)
        {

            var subcityid = new Guid(model.ProvidedString.Split("?")[0]);
            var genderid = new Guid(model.ProvidedString.Split("?")[1]);
            var sql = String.Format(@"Select * from ""Setup"".""GetCampusDataGenderWise""('{0}','{1}')", subcityid, genderid);

            return Ok(this.dbc.CampusCityVMExGenderWise.FromSql(sql));


        }
        [HttpGet]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetCityList()
        {

            CultureInfo[] cultures = CultureInfo.GetCultures(CultureTypes.SpecificCultures);
            List<RegionInfo> countries = new List<RegionInfo>();
            foreach (CultureInfo ci in cultures)
            {
                RegionInfo regionInfo = new RegionInfo(ci.Name);
                if (countries.Count(x => x.EnglishName == regionInfo.EnglishName) <= 0)
                    countries.Add(regionInfo);
            }
            foreach (RegionInfo regionInfo in countries.OrderBy(x => x.EnglishName))
                Console.WriteLine(regionInfo.EnglishName);

            return Ok(countries);


        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetAdmissionConcessoin([FromBody] Predicate model)
        {

            var admissionFormId = new Guid(model.ProvidedString);


            var sql = String.Format(@"Select * from ""OnlineAdmission"".""GetAdmissionConcession""('{0}')", admissionFormId);

            return Ok(this.dbc.AdmissionConcession.FromSql(sql));


        }


        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult GetChallanInfo([FromBody] Predicate model)
        {

            var challanno = (model.ProvidedString);


            var sql = String.Format(@"SELECT ""ChallanNo"",""FeeAmount"",""ChallanTypeId"" from ""Fee"".""StudentChallan"" where ""ChallanNo"" = '{0}'", challanno);

            return Ok(this.dbc.StudentChallanInfoExx.FromSql(sql));


        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertConcessionKinshipScholarship([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = dbc.Database.GetDbConnection();



                string json = String.Format("SELECT \"OnlineAdmission\".\"InsertConcessionKinshipScholarship\"('{0}') as ProvidedString", predicate.ProvidedString);
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
        public IActionResult UpdateConcessionKinsStaus([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = dbc.Database.GetDbConnection();
                var admissionconcessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var concessionid = new Guid(predicate.ProvidedString.Split("?")[1]);


                string json = String.Format("SELECT \"OnlineAdmission\".\"GetStudentGrantConcession\"('{0}','{1}') as ProvidedString", admissionconcessionid, concessionid);
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


        public string DocsUploaded()
        {
            // HttpPostedFileBase files
            try

            {
                var file = Request.Form.Files[0];

                var TeacherID = Request.Form["std"];
                // string folderName = "images/" + NewFolderName;
                string folderName = "StepDocument";
                //Get Root path of folder i.e wwwroot
                //string webRootPath = this._env.WebRootPath;

                //Assign Path outside root directory
                //var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "dist\\upload");

                string webRootPath = @"http://172.19.10.82:7223/";
                Console.WriteLine("+++++++++++++++++++++" + webRootPath + "+++++++++++++++");

                string newPath = Path.Combine(webRootPath, folderName);

                Console.WriteLine("+++++++++++++++++++++" + newPath + "+++++++++++++++");
                if (!Directory.Exists(newPath))
                {
                    Console.WriteLine("+++++++++++++++++++++" + newPath + "+++++++++++++++");
                    //newPath=Server.MapPath(newPath);
                    Console.WriteLine("+++++++++++++++++++++" + newPath + "+++++++++++++++");
                    Directory.CreateDirectory(newPath);
                    Console.WriteLine("After File Crate+++++++++++++++++++++" + newPath + "+++++++++++++++");

                }
                if (file.Length > 0)
                {

                    Console.WriteLine("+++++++++++++++++++++" + newPath + "+++++++++++++++");
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

                    //File.Encrypt(fileName);
                    string date = DateTime.Now.ToString("yyyy-MM-dd hh-mm-sstt");
                    // string newFile = TeacherID.ToString() + "_" + fileName;
                    string FileExtenstion = Path.GetExtension(fileName);
                    string newFile = TeacherID + "_" + FileExtenstion;
                    //  var SplitFileName=newFile.Split('_');
                    //  var splitFileExt=SplitFileName[1].Split('.');

                    // //string newFile = TeacherID.ToString() + "_" + fileName;
                    // // string newFile=fileNameTeacherID.toString;
                    // string fullPath = Path.Combine(newPath, SplitFileName[0],splitFileExt[1]);                    // EncryptFile(fileName,fullPath,"HignDlPs");

                    using (var stream = new FileStream(Path.Combine(newPath, newFile), FileMode.Create))
                    {
                        Console.WriteLine("+++++++++++++++++++++" + newPath + "+++++++++++++++");


                        file.CopyTo(stream);

                    }

                }

                return "Upload Successfully.";

            }
            catch (Exception e)

            {

                return e.ToString();
            }

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFinalStatus([FromBody] Predicate predicate)
        {
            try
            {
                var admissionFormid = new Guid(predicate.ProvidedString);
                string json = $"SELECT * from \"OnlineAdmission\".\"GetStudentStatus\"('{admissionFormid}')";
                return Ok(this.dbc.GetStatus.FromSql(json));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult ApplyConcessionStudent([FromBody] Predicate model)
        {

            try
            {
                IDbConnection connection = dbc.Database.GetDbConnection();
                var scholarshop = new Guid(model.ProvidedString.Split("?")[0]);
                var admissionform = new Guid(model.ProvidedString.Split("?")[1]);
                var classid = new String(model.ProvidedString.Split("?")[2]);
                var Data = this.log.GetLog();

                string json = String.Format("SELECT \"OnlineAdmission\".\"ApplyConcessiononStudentCMS\"('{0}','{1}','{2}',{3},'{4}')", scholarshop, admissionform, Data, 1, classid);
                // Console.WriteLine(json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                var con = connection.Execute(json);
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }

                return Ok("Concession Applied");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private const string SubCityQuery = @"SELECT
""VWCampuCity"".""CityId"",
ct.""FullName"" AS ""CityName"",
""VWCampuCity"".""SubCityId"",
""VWCampuCity"".""CityName"" AS ""SubCityName""
FROM
""Setup"".""VWCampuCity""
JOIN ""Setup"".""City"" ct on ""VWCampuCity"".""CityId"" = ct.""CityId""
WHERE ""Setup"".""VWCampuCity"".""CampusId"" IN ((
		SELECT CAST
			(( jsonb_array_elements ( ""ModuleStore"" ) :: jsonb ) ->> 'id' AS UUID ) 
		FROM
			""Role"".""RolePrevilages"" 
		WHERE
		""UserId"" = {0}
	)) GROUP BY ""VWCampuCity"".""CityId"",
""VWCampuCity"".""CityName"",
""VWCampuCity"".""SubCityId"",
ct.""FullName""";
    }

    public class EmailObject
    {
        public string Email { get; set; }
        public string Message { get; set; }
    }

    public class EmailObjectEx
    {
        public string Email { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }

    }

    public class ForgotPassword
    {
        public string RollNo { get; set; }
        public string Cnic { get; set; }
    }

    public class LoginAdmResponse
    {

        [Key]
        public Guid UserId { get; set; }
        public string Message { get; set; }

        public DateTime CurrDate { get; set; }

        public string Doclink { get; set; }

        public string Name { get; set; }

        public string ContactNo { get; set; }

        public string Email { get; set; }
    }

    public class LoginAdmResponseEx
    {

        [Key]
        public Guid UserId { get; set; }
        public string Message { get; set; }

        public DateTime CurrDate { get; set; }

        public string Doclink { get; set; }

        public string Name { get; set; }

        public string ContactNo { get; set; }

        public string Email { get; set; }
        public string RefferenceNo { get; set; }

        public Guid SubCityId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public bool Flag { get; set; }
        public string Password { get; set; }
    }

    public class GetUserPassResponse
    {

        public string UserName { get; set; }

        [Key]
        public string Password { get; set; }

    }

    public class KinshipResponse
    {

        public string RollNo_TeacherId { get; set; }


        public string Name { get; set; }
        public string FatherName { get; set; }
        [Key]
        public Guid AdmissionFormId { get; set; }
        public int Status_Code { get; set; }
        public string Type { get; set; }
        public string City { get; set; }
        public string Session { get; set; }
        public string Program { get; set; }
        public string Section { get; set; }
        public string Address { get; set; }

    }

    public class ConcessionResponse
    {

        [Key]
        public Guid AdmissionFormId { get; set; }
        public int Status { get; set; }


    }
    public class StdChllnResponse
    {

        [Key]
        public string ChallanNo { get; set; }

        public Guid ChallanTypeId { get; set; }

    }
}