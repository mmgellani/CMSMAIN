using Castle.Core.Internal;
using Cms360.Contract;
using Cms360.Contract.Security;
using Cms360.Data;
using Cms360.Service;
using Cms360.Service.Model;
using Cms360.Service.Security;
using common.Crypto;
using Dapper;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Cms360.Server.Controllers
{
    [Route("auth/[action]")]
    [ServiceFilter(typeof(Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Filters.IdentityMappingFilter))]
    public class AuthController : ControllerBase
    {
        private readonly IAntiforgery antiForgeryService;
        private readonly ILocalAuthenticationService authService;
        private readonly CultureService cultureService;
        private readonly Cms360.Server.Config serverConfig;
        private readonly Service.Config serviceConfig;
        private readonly ISignupService signupService;
        private readonly ITokenProviderService<Token> tokenService;
        private readonly EncryptionService _encryptionService;

        private readonly DbContextBase db;


        public AuthController(IAntiforgery antiForgeryService, EncryptionService encryptionService, DbContextBase db, ILocalAuthenticationService authService, CultureService cultureService, IOptions<Cms360.Server.Config> serverConfig, IOptions<Cms360.Service.Config> serviceConfig, ISignupService signupService, ITokenProviderService<Token> tokenService, IDomainContextResolver resolver, ILocalizationService localization) : base(resolver, localization)
        {
            this.antiForgeryService = antiForgeryService;
            this.authService = authService;
            this.cultureService = cultureService;
            this.serverConfig = serverConfig.Value;
            this.serviceConfig = serviceConfig.Value;
            this.signupService = signupService;
            this.tokenService = tokenService;
            this.db = db;
            this._encryptionService = encryptionService;

        }

        [Authorize]
        [HttpGet()]
        public async Task<object> IssueVerificationCode(string providerKey = null)
        {
            IUser user = this.ApplicationUser();

            if (user == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);

            if (string.IsNullOrWhiteSpace(providerKey))
                providerKey = HttpVerificationProvider.ProviderKey;

            string code = await this.signupService.SendVerificationCode(user, providerKey);

            if (code == null)
                this.ThrowLocalizedServiceException(Constants.FailedToVerifyUser);

            return code;
        }

        [HttpPut()]
        [IgnoreAntiforgeryToken(Order = 1000)]
        public async Task<Object> Logout()
        {
            string cookieName = this.serverConfig.AntiForgery.CookieName;

            if (this.HttpContext.Request.Cookies[cookieName] != null)
                this.HttpContext.Response.Cookies.Delete(cookieName);

            string clientName = this.serverConfig.AntiForgery.ClientName;

            if (this.HttpContext.Request.Cookies[clientName] != null)
                this.HttpContext.Response.Cookies.Delete(clientName);

            return await Task.FromResult(true);
        }

        [HttpPost()]
        [IgnoreAntiforgeryToken(Order = 1000)]
        public async Task<object> Signup([FromBody] LocalSignupOptions options)
        {
            if (!await this.authService.ValidateUser(options.Username))
                this.ThrowLocalizedServiceException(Constants.EmailAddressInUse);

            var identity = await this.signupService.SignupUser(options);

            if (identity == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);

            var z = InsertStaffUserRightLink(options.Username);

            this.SetAntiforgeryCookies();

            return await this.tokenService.IssueToken(identity, identity.Name);
        }

        [HttpGet]
        public bool InsertStaffUserRightLink(string name)
        {
            string json = String.Format("SELECT \"Role\".\"InsertStaffUserRightlink\"('{0}')", name);
            // Console.WriteLine(json);

            IDbConnection connection = db.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return true;
        }

        [HttpPost()]
        [IgnoreAntiforgeryToken(Order = 1000)]
        public async Task<object> Token([FromBody] Model.TokenRequest credentials)
        {
            var identity = await this.authService.ResolveUser(credentials.Username.ToLower(), credentials.password);

            if (identity == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);

            this.SetAntiforgeryCookies();

            string cultureClaimKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.CultureName;
            string timeZoneIdKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.TimeZoneId;

            string cultureName = identity.Claims.FirstOrDefault(o => o.Type == cultureClaimKey).Value;
            string timeZoneId = identity.Claims.FirstOrDefault(o => o.Type == timeZoneIdKey).Value;

            this.cultureService.RefreshCookie(this.HttpContext, cultureName, timeZoneId);

            return await this.tokenService.IssueToken(identity, identity.Name);
        }


        // [HttpPost()]
        // [IgnoreAntiforgeryToken(Order = 1000)]
        // public async Task<object> TokenEx([FromBody] Model.TokenRequest credentials)
        // {
        //     var identity = await this.authService.ResolveUserEx(credentials.Username.ToLower());

        //     if (identity == null)
        //         this.ThrowLocalizedServiceException(Constants.UnknownUser);

        //     this.SetAntiforgeryCookies();

        //     string cultureClaimKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.CultureName;
        //     string timeZoneIdKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.TimeZoneId;

        //     string cultureName = identity.Claims.FirstOrDefault(o => o.Type == cultureClaimKey).Value;
        //     string timeZoneId = identity.Claims.FirstOrDefault(o => o.Type == timeZoneIdKey).Value;

        //     this.cultureService.RefreshCookie(this.HttpContext, cultureName, timeZoneId);

        //     return await this.tokenService.IssueToken(identity, identity.Name);
        // }

        [HttpPost()]
        [IgnoreAntiforgeryToken(Order = 1000)]
        public async Task<object> TokenEx([FromBody] Model.TokenRequest credentials)
        {
            var identity = await this.authService.ResolveUserEx(credentials.Username.ToLower());

            if (identity == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);



            string sql = $@"select * from ""HumanResource"".""CheckStaffStatus""('{credentials.Username}')";

            var staffStatus = this.db.GetStaffCheckData.FromSql(sql).ToList();

            if (staffStatus != null && staffStatus.Count > 0)
            {
                var isActive = staffStatus.FirstOrDefault()?.Status;

                if (isActive == false)
                {
                    return BadRequest("User is inactive");
                }
            }


            this.SetAntiforgeryCookies();

            string cultureClaimKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.CultureName;
            string timeZoneIdKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.TimeZoneId;

            string cultureName = identity.Claims.FirstOrDefault(o => o.Type == cultureClaimKey).Value;
            string timeZoneId = identity.Claims.FirstOrDefault(o => o.Type == timeZoneIdKey).Value;

            this.cultureService.RefreshCookie(this.HttpContext, cultureName, timeZoneId);

            return await this.tokenService.IssueToken(identity, identity.Name);
        }


        [HttpPost()]
        [IgnoreAntiforgeryToken(Order = 1000)]
        [AllowAnonymous]
        public async Task<object> TokenMobileApps([FromBody] Model.TokenRequestEx credentials)
        {
            string usernamevalues = _encryptionService.Decrypt(credentials.UserName);
            string passwordvalues = _encryptionService.Decrypt(credentials.Password);
            string useremailvalues = _encryptionService.Decrypt(credentials.UserEmail);
            string deviceidvalues = _encryptionService.Decrypt(credentials.DeviceId);
            string deviceipvalues = _encryptionService.Decrypt(credentials.DeviceIP);
            string loginwithvalues = _encryptionService.Decrypt(credentials.LoginWith);

            var identity = await this.authService.ResolveUserMobile(usernamevalues.ToLower(), passwordvalues, useremailvalues, deviceidvalues, deviceipvalues, loginwithvalues);

            if (identity == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);

            this.SetAntiforgeryCookies();

            string cultureClaimKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.CultureName;
            string timeZoneIdKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.TimeZoneId;

            string cultureName = identity.Claims.FirstOrDefault(o => o.Type == cultureClaimKey).Value;
            string timeZoneId = identity.Claims.FirstOrDefault(o => o.Type == timeZoneIdKey).Value;

            this.cultureService.RefreshCookie(this.HttpContext, cultureName, timeZoneId);
            string jsonResponse = "";
            string encryptedResponse = "";
            jsonResponse = JsonConvert.SerializeObject(this.tokenService.IssueToken(identity, useremailvalues));
            encryptedResponse = _encryptionService.Encrypt(jsonResponse);
            return Ok(encryptedResponse);
        }

        [HttpPost()]
        [IgnoreAntiforgeryToken(Order = 1000)]
        public async Task<object> TokenWebSite([FromBody] Model.TokenRequestEx credentials)
        {
            string usernamevalues = _encryptionService.Decrypt(credentials.UserName);
            string passwordvalues = _encryptionService.Decrypt(credentials.Password);
            string useremailvalues = _encryptionService.Decrypt(credentials.UserEmail);
            string deviceidvalues = _encryptionService.Decrypt(credentials.DeviceId);
            string deviceipvalues = _encryptionService.Decrypt(credentials.DeviceIP);
            string loginwithvalues = _encryptionService.Decrypt(credentials.LoginWith);

            var identity = await this.authService.ResolveUserWebsite(usernamevalues.ToLower(), passwordvalues, useremailvalues, deviceidvalues, deviceipvalues, loginwithvalues);

            if (identity == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);

            this.SetAntiforgeryCookies();

            string cultureClaimKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.CultureName;
            string timeZoneIdKey = this.serviceConfig.ClaimsNamespace + ProfileClaimTypes.TimeZoneId;

            string cultureName = identity.Claims.FirstOrDefault(o => o.Type == cultureClaimKey).Value;
            string timeZoneId = identity.Claims.FirstOrDefault(o => o.Type == timeZoneIdKey).Value;

            this.cultureService.RefreshCookie(this.HttpContext, cultureName, timeZoneId);
            string jsonResponse = "";
            string encryptedResponse = "";
            jsonResponse = JsonConvert.SerializeObject(this.tokenService.IssueToken(identity, identity.Name));
            encryptedResponse = _encryptionService.Encrypt(jsonResponse);
            return Ok(encryptedResponse);
            //return await this.tokenService.IssueToken(identity, identity.Name);
        }

        [HttpGet()]
        [IgnoreAntiforgeryToken(Order = 1000)]
        public async Task<object> ValidateUser(string username)
        {
            try
            {
                if (username.IsNullOrEmpty())
                {
                    username = "";
                }
                bool available = await this.authService.ValidateUser(username);

                if (!available)
                    this.ThrowLocalizedServiceException(Constants.EmailAddressInUse);

                return "";
            }
            catch (Exception ex)
            {
                return "";

            }
        }

        [Authorize]
        [HttpPut()]
        public async Task<object> RedeemVerificationCode(string code)
        {
            IUser user = this.ApplicationUser();

            if (user == null)
                this.ThrowLocalizedServiceException(Constants.UnknownUser);

            var identity = await this.signupService.RedeemVerificationCode(user, code);

            if (identity == null)
                this.ThrowLocalizedServiceException(Constants.FailedToVerifyUser);

            return await this.tokenService.IssueToken(identity, identity.Name);
        }

        private void ClearAntiforgeryCookies()
        {
            string cookieName = this.serverConfig.AntiForgery.CookieName;

            if (this.HttpContext.Request.Cookies[cookieName] != null)
                this.HttpContext.Response.Cookies.Delete(cookieName);

            string clientName = this.serverConfig.AntiForgery.ClientName;

            if (this.HttpContext.Request.Cookies[clientName] != null)
                this.HttpContext.Response.Cookies.Delete(clientName);
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
    }
}
