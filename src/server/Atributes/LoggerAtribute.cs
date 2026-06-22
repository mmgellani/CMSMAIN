using System;
using System.Linq;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;

using System.Security.Claims;

namespace Cms360.Server.Atributes
{
    public class LoggingsAttribute : ActionFilterAttribute
    {
        private const string _stopwatchKey = "StopwatchFilter.Value";

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            context.HttpContext.Items[_stopwatchKey] = Stopwatch.StartNew();
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var stopwatch = (Stopwatch)context.HttpContext.Items[_stopwatchKey];
            var claimContext = (ClaimsPrincipal)context.HttpContext.User;
            var email = "";
            var timezone = "";

            foreach (Claim claim in claimContext.Claims)
            {
                if(claim.Type.IndexOf("emailaddress") > -1) {
                    email = claim.Value;
                }

                if(claim.Type.IndexOf("timezoneid") > -1) {
                    timezone = claim.Value;
                }
            }


            stopwatch.Stop();
            var log = string.Format(
@"
{0}==================================================================={0}
User Email: {11}{0}
Time Zone: {12}{0}
Controller: {1}{0},
Action:{2}{0},
Execution Time:{3}ms{0}
Local IP-Port: {4}-{5}{0},
Public IP-Port: {6}-{7}{0},
Agent: {8}{0}
Request: {9}{0}
Response Code: {10}{0}
==================================================================={0}",

                Environment.NewLine,
                context.Controller.GetType().Name,
                context.ActionDescriptor.DisplayName.Split(".")[context.ActionDescriptor.DisplayName.Split(".").Count() - 2].Split(" ")[0],
                stopwatch.ElapsedMilliseconds,
                context.HttpContext.Connection.LocalIpAddress,
                context.HttpContext.Connection.LocalPort,
                context.HttpContext.Connection.RemoteIpAddress,
                context.HttpContext.Connection.RemotePort,
                context.HttpContext.Request.Headers["User-Agent"],
                context.HttpContext.Request.QueryString,
                context.HttpContext.Response.StatusCode,
                email, timezone);
            //// Console.WriteLine(log);
            base.OnActionExecuted(context);
        }

        public override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            return base.OnActionExecutionAsync(context, next);
        }

        public override Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            return base.OnResultExecutionAsync(context, next);
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            base.OnResultExecuting(context);
        }

        public override void OnResultExecuted(ResultExecutedContext context)
        {
            Debug.WriteLine("003 - OnResultExecuted");
            base.OnResultExecuted(context);
        }
    }
}