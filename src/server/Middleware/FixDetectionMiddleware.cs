using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.DependencyInjection;

namespace Cms360.Server
{
    public class FixDetectionMiddleware
    {
        public FixDetectionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        readonly RequestDelegate _next;

        public async Task Invoke(HttpContext context, IHostingEnvironment hostingEnviroment)
        {
            var userAgent = context.Request.Headers["User-Agent"].FirstOrDefault();

            if (userAgent == null)
            {
                context.Request.Headers["User-Agent"] = string.Empty;
            }

            await _next.Invoke(context);
        }
    }
}