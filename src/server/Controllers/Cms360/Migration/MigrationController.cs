using System.IO.Enumeration;
using System.Runtime.InteropServices;
using System.ComponentModel;
using System.Data.Common;
using System.Dynamic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Newtonsoft.Json.Linq;

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
using System.Web;
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
using Microsoft.Graph;
using Microsoft.Graph.Auth;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using Npgsql;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class MigrationController : Controller
    {
        private static string HadafDbString = "Data Source=172.23.1.35\\SQLSERVER2017;Initial Catalog=CMS_ONE_NEW;User ID=CoreTeam;Password=coreteam;Max Pool Size=10000;MultipleActiveResultSets=True;User Instance=False;timeout=10000;";
        //private static string HadafDbString = "Server=172.23.1.127;Database=CMS_ONE_NEW;User Id=hadafapp;Password=vDH8j8EULAqnJRZ;timeout=10000;";
        // private static string CmsDb = "Data Source=172.23.1.35\\MSSQLSERVER2016;Initial Catalog=CMS_FEES_latest;User ID=sa;Password=pgeec@TTL15;timeout=10000;";
        private static string CmsDbString = "Data Source=172.23.1.26\\CMSM15;Initial Catalog=CMS;User ID=CMS;Password=AYmC55]]GdItb8T;timeout=10000;";
        private static string ELDbString = "Host=eldbflexible.postgres.database.azure.com;Port=5432;User ID=emseducation;Password=RUy368FhdvYN7jPFKY9F#vVGNVpwZfUS9NkV4zWr3RS5gQru#Z;Database=Elp;Pooling=false;Timeout=300;CommandTimeout=300";

        private readonly DbContextBase db;

        private readonly IUserLogService log;
        public MigrationController(DbContextBase db, IUserLogService log)
        {
            this.db = db;
            this.log = log;
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetHadafTransfer()
        {
            return Ok(db.Transfer.FromSql("SELECT * FROM transfer WHERE campus = 'HADAF'"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddManyStudents([FromBody] List<AttendanceModelTemp> list)
        {

            var sqlConnection = new SQLConnection(CmsDbString);
            sqlConnection.openConnection();
            var result = sqlConnection.GetData(String.Format("SELECT * FROM AttendancePercentageforEMS "));

            foreach (var item in list)
            {
                var query = String.Format(@"execute PrInsertIntoAttendanceEmsEx
           '{0}','{1}','{2}','{3}'", item.RollNo, item.AttendancePercentage, item.FromDate, item.toDate);
                // // Console.WriteLine(query);
                sqlConnection.Execute(query);
            }

            sqlConnection.closeConnection();
            // IDbConnection connection = db.Database.GetDbConnection();
            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();
            // connection.Execute(query);
            // if (connection.State == ConnectionState.Open)
            // {
            //     connection.Close();
            //     connection.Dispose();
            // }

            return Ok("Done");
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCmsTransfer()
        {
            return Ok(db.Transfer.FromSql("SELECT * FROM transfer WHERE campus = 'CMS'"));
        }

        public UserCredencials GetPassword(string user, string cnic)
        {
            var sqlConnection = new SQLConnection(CmsDbString);
            sqlConnection.openConnection();
            var result = sqlConnection.GetData($"select \"Password\" from StudentPassword('{user}','{cnic}')");
            sqlConnection.closeConnection();
            if (null == result)
                return new UserCredencials() { Password = "" };
            else
                return result.ElementAt(0) as UserCredencials;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteStdEnrooll([FromBody] Predicate predicate)
        {
            var obj = new Predicate() { ProvidedString = "" };
            try
            {
                IDbConnection connection = db.Database.GetDbConnection();
                var list = (predicate.ProvidedString);

                string json = String.Format("SELECT * From \"OnlineAdmission\".\"DeleteStdEnrol\"('{0}') as ProvidedString", list);
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
        public IActionResult GetCmsSections([FromBody] Predicate model)
        {
            var sqlConnection = new SQLConnection(CmsDbString);
            sqlConnection.openConnection();
            var result = sqlConnection.GetData(String.Format("SELECT DISTINCT SectionTitle FROM StudentInfoForEMSAll WHERE combination = '{0}'", model.ProvidedString));
            sqlConnection.closeConnection();
            return Ok(result);
        }

        // [AllowAnonymous]
        // [IgnoreAntiforgeryToken]
        // [HttpGet]
        // [Route ("[action]")]
        // public async Task<IActionResult> GetTokenAccess () {
        //     var accessToken = await AccessTokenGenerator ();

        //     return Ok (accessToken);
        // }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]

        public async Task<IActionResult> CreateMicrosoftUser([FromBody] Predicate predicate)

        {

            var username = new String(predicate.ProvidedString.Split("?")[0]);
            var fullname = new String(predicate.ProvidedString.Split("?")[1]);
            var password = new String(predicate.ProvidedString.Split("?")[2]);
            var sessionName = new String($"Session {predicate.ProvidedString.Split("?")[3]}");
            var rollNo = new String(predicate.ProvidedString.Split("?")[4]);
            var subCity = new String(predicate.ProvidedString.Split("?")[5]);
            var campus = new String(predicate.ProvidedString.Split("?")[6]);
            var city = new String(predicate.ProvidedString.Split("?")[7]);
            var program = new String(predicate.ProvidedString.Split("?")[8]);

            var puser = username.Substring(username.Length - 7);
            var pfull = fullname.Substring(0, 3);

            IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
                .Create("5150c9e8-c886-436d-9304-a19e06ecb8aa")
                .WithTenantId("12b221b3-0464-4223-89e5-888835778b58")
                .WithClientSecret("YOzKpZIS9:/g_SNGO7G49_W.?ltCOur7")
                .Build();

            ClientCredentialProvider authProvider = new ClientCredentialProvider(confidentialClientApplication);
            GraphServiceClient graphClient = new GraphServiceClient(authProvider);

            var user = new Microsoft.Graph.User
            {
                // AccountEnabled = true,
                // DisplayName = fullname,
                // MailNickname = fullname,
                // Department = sessionName,
                // UserPrincipalName = username,
                // PasswordProfile = new PasswordProfile
                // {
                //     ForceChangePasswordNextSignIn = true,
                //     Password = password
                // }

                AccountEnabled = true,
                DisplayName = rollNo, //Roll #
                GivenName = rollNo,       //Roll #
                Surname = fullname,                 //StudentName
                JobTitle = program,         //Program
                Department = sessionName,  //Session 2122/2021/1920
                OfficeLocation =  subCity  ,              //Sub-City

                StreetAddress = campus, //Campus
                City = city,                        //City

                Country = "Pakistan",
              
                MailNickname = fullname.Split(" ")[0],
                UserPrincipalName = username ,
                PasswordProfile = new PasswordProfile
                {
                    ForceChangePasswordNextSignIn = true,
                    Password = password
                }

            };

            Microsoft.Graph.User res = await graphClient.Users
                .Request()
                .AddAsync(user);

            return Ok(res);
        }

        public async Task<string> CreateMicrosoftIds(string username, string name, string program, string campus, string city, string classnme)
        {

            try
            {
                //Last 7 characters of RollNo
                var pass = username.Substring(username.Length - 7);

                var splitnam = name.Substring(0, 3);

                IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
                    .Create("5150c9e8-c886-436d-9304-a19e06ecb8aa")
                    .WithTenantId("12b221b3-0464-4223-89e5-888835778b58")
                    .WithClientSecret("YOzKpZIS9:/g_SNGO7G49_W.?ltCOur7")
                    .Build();

                ClientCredentialProvider authProvider = new ClientCredentialProvider(confidentialClientApplication);
                GraphServiceClient graphClient = new GraphServiceClient(authProvider);

                var user = new Microsoft.Graph.User
                {
                    AccountEnabled = true,
                    DisplayName = username,
                    GivenName = username,
                    Surname = name,
                    JobTitle = program,
                    Department = classnme,
                    MobilePhone = "-",
                    FaxNumber = "-",
                    StreetAddress = campus,
                    City = city,
                    State = "Campus Management System",
                    Country = "Pakistan",
                    PostalCode = "-",
                    MailNickname = username,
                    UserPrincipalName = username + "@cms.edu.pk",
                    PasswordProfile = new PasswordProfile
                    {
                        ForceChangePasswordNextSignIn = true,
                        Password = splitnam + "P@" + pass
                    }
                };

                await graphClient.Users
                    .Request()
                    .AddAsync(user);

                return ("User Created SuccessFully");

            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetCmsData([FromBody] Predicate model)
        {
            var sqlConnection = new SQLConnection(CmsDbString);
            sqlConnection.openConnection();
            var result = sqlConnection.GetData(String.Format("SELECT * FROM StudentInfoForEMSAll WHERE {0}", model.ProvidedString));
            sqlConnection.closeConnection();
            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetHadafData([FromBody] Predicate model)
        {
            var sqlConnection = new SQLConnection(HadafDbString);
            sqlConnection.openConnection();
            var result = sqlConnection.GetData(String.Format("SELECT * FROM StudentInfoForEMS WHERE CampusProgramId = '{0}'", model.ProvidedString));
            sqlConnection.closeConnection();
            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult InsertHadafList([FromBody] Predicate obj)
        {
            var sqlConnection = new SQLConnection(HadafDbString);
            var list = obj.ProvidedString;
            var Data = this.log.GetLog();

            var templist = JsonConvert.DeserializeObject<List<HadafStudent>>(list);
            string sqlquery = String.Format("SELECT \"Fee\".\"TransferHadafToEms\"('{0}','{1}')", list, Data);

            // Console.WriteLine (sqlquery);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
                var con = connection.Execute(sqlquery);
                connection.Close();
                connection.Dispose();
            }

            sqlConnection.openConnection();
            foreach (var item in templist)
            {
                var queryinsertion = String.Format(@"INSERT INTO TransferStudentData (AdmissionFormId ,IsProcessed) VALUES ('{0}',{1}) ;", item.AdmissionFormId, 1);
                sqlConnection.Execute(queryinsertion);
            }
            sqlConnection.closeConnection();

            return Ok(true);
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]

        public async Task<IActionResult> UpdateUserPassword([FromBody] Predicate predicate)

        {

            string result = "";
            string token = "";

            var username = new String(predicate.ProvidedString.Split("?")[0]);
            var password = new String(predicate.ProvidedString.Split("?")[1]);
            var tokenEndpoint = @"https://login.windows.net/12b221b3-0464-4223-89e5-888835778b58/oauth2/v2.0/token";
            var parameter = new FormUrlEncodedContent(new Dictionary<string, string> { { "grant_type", "password" },
                { "client_id", "5150c9e8-c886-436d-9304-a19e06ecb8aa" },
                { "client_secret", "YOzKpZIS9:/g_SNGO7G49_W.?ltCOur7" },
                { "scope", "https://graph.microsoft.com/.default" },
                { "username", "apicallerttl@cms.edu.pk" },
                { "password", "F@h03024532246" }
            });

            using (HttpClient client = new HttpClient())
            {
                using (var response = await client.PostAsync(tokenEndpoint, parameter))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonresult = JObject.Parse(await response.Content.ReadAsStringAsync());
                        token = (string)jsonresult["access_token"];
                    }
                }
            }

            GraphServiceClient graphClient =
                new GraphServiceClient(new DelegateAuthenticationProvider(async (requestMessage) =>
                {

                    // Retrieve an access token for Microsoft Graph (gets a fresh token if needed).

                    // Add the access token in the Authorization header of the API request.
                    requestMessage.Headers.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);
                }));

            var user = new Microsoft.Graph.User
            {
                PasswordPolicies = "DisablePasswordExpiration,DisableStrongPassword",
                PasswordProfile = new PasswordProfile
                {
                    ForceChangePasswordNextSignIn = false,
                    Password = password,
                }
            };

            try
            {

                await graphClient.Users[username]
                    .Request()
                    .UpdateAsync(user);

                result = "User with  username " + username + "Password Changed SuccessFully";

                return Ok(result);

            }
            catch (Exception ex)
            {

                return Ok(ex.Message);
            }

            return Ok(true);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetUserData([FromBody] Predicate predicate)
        {
            ElUsersModel student = null;


            var connection = new NpgsqlConnection(ELDbString);
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            student = connection.Query<ElUsersModel>($"SELECT \"UserId\", \"RoleId\", \"UserName\", \"Password\", \"Varification\", \"IsEnable\", \"Batch\" FROM \"Users\" WHERE \"UserName\" ilike '{predicate.ProvidedString}%';").FirstOrDefault();

            if (connection.State == ConnectionState.Open)
                connection.Close();
            connection.Dispose();


            return Ok(student);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> InsertUserData([FromBody] ElUsersModel student)
        {
            var connection = new NpgsqlConnection(ELDbString);
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            connection.Execute($"INSERT INTO \"Users\"(\"UserId\", \"RoleId\", \"UserName\", \"Password\", \"Varification\", \"IsEnable\", \"Batch\") VALUES (uuid_generate_v4(), '69830c49-30ba-4d1e-ad06-bca0de2fb66a', '{student.UserName}', 'P@kist0n', '{student.Varification}', 1, {student.Batch});");

            if (connection.State == ConnectionState.Open)
                connection.Close();
            connection.Dispose();

            return Ok(true);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateUserData([FromBody] ElUsersModel student)
        {
            var connection = new NpgsqlConnection(ELDbString);
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            connection.Execute($"UPDATE \"Users\" SET \"Varification\" = '{student.Varification}', \"IsEnable\" = {student.IsEnable}, \"Batch\" = '{student.Batch}' WHERE \"UserId\"='{student.UserId}';");

            if (connection.State == ConnectionState.Open)
                connection.Close();
            connection.Dispose();

            return Ok(true);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> InsertElData([FromBody] Predicate predicate)
        {
            var list = new String(predicate.ProvidedString.Split("?")[0]);
            var batchid = Convert.ToInt32(predicate.ProvidedString.Split("?")[1]);

            string json = string.Format("SELECT * FROM \"Role\".\"StudentEnrollEl\"('{0}')", list);
            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            UsersModel[] obj = connection.Query<UsersModel>(json).ToArray<UsersModel>();

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            connection = new NpgsqlConnection(ELDbString);
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            foreach (var item in obj)
            {
                var student = new ElPusModel() { AdmissionFormId = item.AdmissionFormId, Username = item.UserName, Password = item.Password, Program = item.Program, Batch = batchid };
                var z = String.Format("SELECT * FROM \"PushDataX\" ('{0}'::json)", JsonConvert.SerializeObject(student));

                var con = connection.Execute(z);
            }

            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok(true);
        }

        [HttpPost]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [Route("[action]")]
        public IActionResult InsertCmsList([FromBody] Predicate obj)
        {
            var sqlConnection = new SQLConnection(CmsDbString);
            var list = obj.ProvidedString;
            var templist = JsonConvert.DeserializeObject<List<CmsModel>>(list);
            var dta = this.log.GetLog();
            string sqlquery = String.Format("SELECT \"Fee\".\"TransferCmsToEms\"('{0}','{1}')", list, dta);
            // Console.WriteLine(sqlquery);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
                var con = connection.Execute(sqlquery);
                connection.Close();
                connection.Dispose();
            }

            sqlConnection.openConnection();
            foreach (var item in templist)
            {
                var queryinsertion = String.Format(@"INSERT INTO TransferStudentData (AdmissionFormId ,IsProcessed) VALUES ('{0}',{1}) ;", item.Admission_Form_ID, 1);
                sqlConnection.Execute(queryinsertion);
            }
            sqlConnection.closeConnection();

            return Ok(true);
        }
    }
}

public class AttendanceModelTemp
{
    public string RollNo { get; set; }
    public decimal AttendancePercentage { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime toDate { get; set; }

}

// public class User{

//       public bool AccountEnabled { get; set; }  
//       public string DisplayName  { get; set; }  

//       public string MailNickname  { get; set; }  

//       public string UserPrincipalName  { get; set; }  

//       public PasswordProfile  PasswordProfile {get;set;}

// }

// public class PasswordProfile
// {

//     public bool ForceChangePasswordNextSignIn { get; set; }

//      public string Password { get; set; }
// }

public class UsersModel
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public String UserName { get; set; }
    public String Password { get; set; }
    public String Varification { get; set; }

    public String FullName { get; set; }

    public String Program { get; set; }

    public String Campus { get; set; }

    public String City { get; set; }
    public Guid AdmissionFormId { get; set; }
}

public class ElPusModel
{
    public Guid AdmissionFormId { get; set; }
    public String Username { get; set; }
    public String Password { get; set; }
    public String Program { get; set; }
    public int Batch { get; set; }
}

public class ElUsersModel
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public String UserName { get; set; }
    public String Password { get; set; }
    public String Varification { get; set; }
    public Int32 IsEnable { get; set; }
    public Int32 Batch { get; set; }
}