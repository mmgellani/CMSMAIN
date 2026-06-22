using System;
using System.IO;
using System.Web;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Principal;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http.Internal;

using Newtonsoft.Json;

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;
using Cms360.Server.Model;

namespace Cms360.Server
{
    public interface IUserLogService
    {
        bool Insert(string ProcessedModel, string operation);
        bool Insert(string ProcessedModel, string operation, string module);
        string GetLog();
    }
    public class UserLogService : IUserLogService
    {
        private IHttpContextAccessor context;
        private DbContextBase _dbcontext;
        private IDomainContext domainContext;
        protected IDomainContextResolver Resolver;

        public UserLogService(IHttpContextAccessor _context, DbContextBase _dbcontext, IDomainContextResolver _Resolver)
        {
            this.context = _context;
            this._dbcontext = _dbcontext;
            this.Resolver = _Resolver;
        }

        public bool Insert(string ProcessedModel, string operation, string module)
        {
            var headers = context.HttpContext.Request.Headers;
            var remoteIp = headers.ContainsKey("X-Forwarded-For") ? headers["X-Forwarded-For"].ToString() : context.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();            

            var model = new UserLog()
            {
                AuditId = Guid.NewGuid(),
                DateTime = DateTime.Now,
                UserId = DomainContext.User.UserId,
                LocalIpPort = headers.ContainsKey("X-Real-IP") ? headers["X-Real-IP"].ToString() : remoteIp,
                PublicIpPort = headers.ContainsKey("X-Agent-Info") ? headers["X-Agent-Info"].ToString() : headers["User-Agent"].ToString(),
                User = module,
                ControllerAction = operation,
                Operation = ProcessedModel
            };

            _dbcontext.UserLog.AddAsync(model);
            _dbcontext.SaveChanges();

            return true;
        }

        public bool Insert(string ProcessedModel, string operation)
        {
            var headers = context.HttpContext.Request.Headers;
            var remoteIp = headers.ContainsKey("X-Forwarded-For") ? headers["X-Forwarded-For"].ToString() : context.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();            

            var model = new UserLog()
            {
                AuditId = Guid.NewGuid(),
                DateTime = DateTime.Now,
                UserId = DomainContext.User.UserId,
                LocalIpPort = headers.ContainsKey("X-Real-IP") ? headers["X-Real-IP"].ToString() : remoteIp,
                PublicIpPort = headers.ContainsKey("X-Agent-Info") ? headers["X-Agent-Info"].ToString() : headers["User-Agent"].ToString(),
                User = Environment.GetEnvironmentVariable("USERNAME") ?? Environment.GetEnvironmentVariable("USER"),
                ControllerAction = operation,
                Operation = ProcessedModel
            };

            _dbcontext.UserLog.AddAsync(model);
            _dbcontext.SaveChanges();

            return true;
        }

        public string GetLog()
        {
            var headers = context.HttpContext.Request.Headers;
            var remoteIp = headers.ContainsKey("X-Forwarded-For") ? headers["X-Forwarded-For"].ToString() : context.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();            

            var model = new UserLog()
            {
                AuditId = Guid.NewGuid(),
                DateTime = DateTime.Now,
                UserId = DomainContext.User.UserId,
                LocalIpPort = headers.ContainsKey("X-Real-IP") ? headers["X-Real-IP"].ToString() : remoteIp,
                PublicIpPort = headers.ContainsKey("X-Agent-Info") ? headers["X-Agent-Info"].ToString() : headers["User-Agent"].ToString(),
                User = "",
                ControllerAction = "",
                Operation = ""
            };

            return JsonConvert.SerializeObject(model);
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
    }
}