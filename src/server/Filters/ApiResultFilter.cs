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

using Newtonsoft.Json;

namespace Cms360.Server.Filters
{
    public class ApiResultFilter : IAsyncResultFilter
    {
        private DbContextBase _context;
        private IDomainContext domainContext;
        protected IDomainContextResolver Resolver;

        public ApiResultFilter(ILoggerFactory logger, IDomainContextResolver Resolver, DbContextBase _context)
        {
            this._context = _context;
            this.Resolver = Resolver;
        }

        public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            ObjectResult obj = context.Result as ObjectResult;

            if (obj != null)
            {
                var payload = new Model.Payload<object>()
                {
                    Data = obj.Value,
                    Message = new PayloadMessage()
                };

                obj.Value = payload;
            }

            await next.Invoke();
        }
    }
}