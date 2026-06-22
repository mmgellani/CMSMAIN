using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Cms360.Contract;
using Cms360.Contract.Security;
using Cms360.Data;
using Cms360.Data.Model;
using Newtonsoft.Json;

namespace Cms360.Service
{
    public class LocalAuthenticationService : ILocalAuthenticationService
    {
        private readonly Config config;
        private ICryptoService crypto;
        private DbContextBase db;
        private readonly IDeviceProfiler deviceProfiler;

        public LocalAuthenticationService(DbContextBase db, IOptions<Config> config, ICryptoService crypto, IDeviceProfiler deviceProfiler)
        {
            this.config = config.Value;
            this.crypto = crypto;
            this.db = db;
            this.deviceProfiler = deviceProfiler;
        }

        public async Task<ClaimsIdentity> ResolveUser(string username, string password)
        {
            UserProviderLocal login = await this.db.LocalProvider.Where(o => o.User.Username.ToLower() == username.ToLower()).FirstOrDefaultAsync();

            if (login != null)
            {
                if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, password))
                {
                    string fingerprint = this.deviceProfiler.DeriveFingerprint(login.User);
                    ClaimsIdentity identity = login.User.ToClaimsIdentity(this.config.ClaimsNamespace, fingerprint);

                    return identity;
                }
            }

            return null;
        }

        public async Task<ClaimsIdentity> ResolveUserMobile(string username, string password, string useremail, string deviceid, string deviceip, string loginwith)
        {

            return await LoginByFunction(username, password, useremail, deviceid, deviceip, loginwith);
        }
        public async Task<ClaimsIdentity> ResolveUserWebsite(string username, string password, string useremail, string deviceid, string deviceip, string loginwith)
        {
            return await WebsiteFootPrint(username, password, useremail, deviceid, deviceip, loginwith);
        }

        public async Task<IUser> ResolveUser(string username)
        {
            return await this.db.User.SingleOrDefaultAsync(o => o.Username.ToLower() == username.ToLower());
        }

        public async Task<ClaimsIdentity> ResolveUserEx(string username)
        {
            UserProviderLocal login = await this.db.LocalProvider.Where(o => o.User.Username.ToLower() == username.ToLower()).FirstOrDefaultAsync();

            if (login != null)
            {
                // if (this.crypto.CheckKey(login.PasswordHash, login.PasswordSalt, password))
                // {
                string fingerprint = this.deviceProfiler.DeriveFingerprint(login.User);
                ClaimsIdentity identity = login.User.ToClaimsIdentity(this.config.ClaimsNamespace, fingerprint);

                return identity;
                // }
            }

            return null;
        }

        public async Task<bool> ValidateUser(string username)
        {
            UserProviderLocal login = await this.db.LocalProvider.Where(o => o.User.Username.ToLower() == username.ToLower()).FirstOrDefaultAsync();

            return login == null;
        }
        public async Task<ClaimsIdentity> LoginByFunction(string username, string password, string useremail, string deviceid, string deviceip, string loginwith)
        {
            try
            {
                string sql = $@"SELECT * FROM ""Registration"".""UserExistForLogin""('{useremail}')";

                var jsonResult = await this.db.JsonFunctionResult
                    .FromSql(sql)
                    .AsNoTracking()
                    .Select(r => r.UserExistForLogin)
                    .FirstOrDefaultAsync();
                if (string.IsNullOrEmpty(jsonResult))
                {
                    return null;
                }

                dynamic emailData = JsonConvert.DeserializeObject(jsonResult);
                string sourceTable = emailData.source_table?.ToString();
                dynamic data = emailData.data;

                if (sourceTable == "UserProvider")
                {
                    long userId = Convert.ToInt64(data.UserId);
                    string passwordHash = data.PasswordHash?.ToString();
                    string passwordSalt = data.PasswordSalt?.ToString();

                    var providerUserName = await db.LocalProvider
                       .Where(o => o.User.Username.ToLower() == username.ToLower())
                       .FirstOrDefaultAsync();

                    if (providerUserName != null && crypto.CheckKey(providerUserName.PasswordHash, providerUserName.PasswordSalt, password))
                    {
                        string fingerprint = deviceProfiler.DeriveFingerprintMobile(useremail);
                        ClaimsIdentity identity = (await db.LocalProvider
                            .Where(o => o.UserId == userId)
                            .Select(o => o.User)
                            .FirstOrDefaultAsync())
                            ?.ToClaimsIdentity(config.ClaimsNamespace, fingerprint);

                        if (identity != null)
                        {
                            UserLoginDevice input = new UserLoginDevice
                            {
                                LoggerId = Guid.NewGuid(),
                                UserId = userId.ToString(),
                                DeviceId = deviceid,
                                DeviceIP = deviceip,
                                StatusId = 1,
                                CreatedOn = DateTime.Now,
                                LoginWith = loginwith
                            };
                            await db.UserLoginDevice.AddAsync(input);
                            await db.SaveChangesAsync();
                            return identity;
                        }
                    }
                }
                else if (sourceTable == "StudentUserCreationLog")
                {
                    int done = Convert.ToInt32(data.Done);
                    string admissionFormId = data.AdmissionFormId?.ToString();

                    if (done != 2)
                    {
                        return null;
                    }

                    var loginStudent = await db.LocalProvider
                        .Where(o => o.User.Username.ToLower() == username.ToLower())
                        .FirstOrDefaultAsync();

                    if (loginStudent != null && crypto.CheckKey(loginStudent.PasswordHash, loginStudent.PasswordSalt, password))
                    {
                        string fingerprint = deviceProfiler.DeriveFingerprintMobile(loginStudent.User.Username);
                        ClaimsIdentity identity = loginStudent.User.ToClaimsIdentity(config.ClaimsNamespace, fingerprint);

                        UserLoginDevice input = new UserLoginDevice
                        {
                            LoggerId = Guid.NewGuid(),
                            UserId = admissionFormId,
                            DeviceId = deviceid,
                            DeviceIP = deviceip,
                            StatusId = 1,
                            CreatedOn = DateTime.Now,
                            LoginWith = loginwith
                        };
                        await db.UserLoginDevice.AddAsync(input);
                        await db.SaveChangesAsync();
                        return identity;
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }
        public async Task<ClaimsIdentity> WebsiteFootPrint(string username, string password, string useremail, string deviceid, string deviceip, string loginwith)
        {
            try
            {
                string sql = $@"SELECT * FROM ""Registration"".""UserExistForLogin""('{useremail}')";

                var jsonResult = await this.db.JsonFunctionResult
                    .FromSql(sql)
                    .AsNoTracking()
                    .Select(r => r.UserExistForLogin)
                    .FirstOrDefaultAsync();
                if (string.IsNullOrEmpty(jsonResult))
                {
                    return null;
                }

                dynamic emailData = JsonConvert.DeserializeObject(jsonResult);
                string sourceTable = emailData.source_table?.ToString();
                dynamic data = emailData.data;

                if (sourceTable == "UserProvider")
                {
                    long userId = Convert.ToInt64(data.UserId);
                    string passwordHash = data.PasswordHash?.ToString();
                    string passwordSalt = data.PasswordSalt?.ToString();

                     var providerUserName = await db.LocalProvider
                       .Where(o => o.User.Username.ToLower() == username.ToLower())
                       .FirstOrDefaultAsync();

                    if (providerUserName != null && crypto.CheckKey(providerUserName.PasswordHash, providerUserName.PasswordSalt, password))
                    {
                        string fingerprint = deviceProfiler.DeriveFingerprintWebSite(useremail);
                        ClaimsIdentity identity = (await db.LocalProvider
                            .Where(o => o.UserId == userId)
                            .Select(o => o.User)
                            .FirstOrDefaultAsync())
                            ?.ToClaimsIdentity(config.ClaimsNamespace, fingerprint);

                        if (identity != null)
                        {
                            UserLoginDevice input = new UserLoginDevice
                            {
                                LoggerId = Guid.NewGuid(),
                                UserId = userId.ToString(),
                                DeviceId = deviceid,
                                DeviceIP = deviceip,
                                StatusId = 1,
                                CreatedOn = DateTime.Now,
                                LoginWith = loginwith
                            };
                            await db.UserLoginDevice.AddAsync(input);
                            await db.SaveChangesAsync();
                            return identity;
                        }
                    }
                }
                else if (sourceTable == "StudentUserCreationLog")
                {
                    int done = Convert.ToInt32(data.Done);
                    string admissionFormId = data.AdmissionFormId?.ToString();

                    if (done != 2)
                    {
                        return null;
                    }

                    var loginStudent = await db.LocalProvider
                        .Where(o => o.User.Username.ToLower() == username.ToLower())
                        .FirstOrDefaultAsync();

                    if (loginStudent != null && crypto.CheckKey(loginStudent.PasswordHash, loginStudent.PasswordSalt, password))
                    {
                        string fingerprint = deviceProfiler.DeriveFingerprintWebSite(loginStudent.User.Username);
                        ClaimsIdentity identity = loginStudent.User.ToClaimsIdentity(config.ClaimsNamespace, fingerprint);

                        UserLoginDevice input = new UserLoginDevice
                        {
                            LoggerId = Guid.NewGuid(),
                            UserId = admissionFormId,
                            DeviceId = deviceid,
                            DeviceIP = deviceip,
                            StatusId = 1,
                            CreatedOn = DateTime.Now,
                            LoginWith = loginwith
                        };
                        await db.UserLoginDevice.AddAsync(input);
                        await db.SaveChangesAsync();
                        return identity;
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }
    }
}
