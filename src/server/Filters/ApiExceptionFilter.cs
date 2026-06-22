using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace Cms360.Server.Filters {
    public class ApiExceptionFilter : IAsyncExceptionFilter {
        private readonly ILogger<ApiExceptionFilter> logger;
        private readonly ApiExceptionFilterTargets targets;
        private DbContextBase _context;

        public ApiExceptionFilter (ApiExceptionFilterTargets targets, DbContextBase _context, ILogger<ApiExceptionFilter> logger) {
            this.logger = logger;
            this.targets = targets;
            this._context = _context;
        }

        public Task OnExceptionAsync (ExceptionContext context) {
            var exceptionType = context.Exception.GetType ();

            PayloadMessageType messageType = PayloadMessageType.Error;

            AppException app = new AppException ();

            if (this.targets.Keys.Contains (exceptionType)) {
                messageType = this.targets[exceptionType];
                app.Message = context.Exception.Message;
                app.Time = DateTime.Now;
                app.Data = context.Exception.StackTrace;

                this.logger.LogWarning (context.Exception, $"Targetted exception of type {context.Exception.GetType().FullName} was converted to api payload with status {messageType}");
            } else {
                app.Message = context.Exception.Message;
                app.Time = DateTime.Now;
                app.Data = context.Exception.StackTrace;
                this.logger.LogWarning (context.Exception, $"Untargetted exception of type {context.Exception.GetType().FullName} was converted to api payload with status {messageType}");
            }

            var payload = new Model.Payload<object> () {
                Data = context.Exception.StackTrace,
                Message = new PayloadMessage () {
                MessageType = messageType,
                Text = context.Exception.Message
                }
            };

            _context.AppException.AddAsync (app);
            _context.SaveChanges ();
            context.Exception = null;
            context.Result = new JsonResult (payload);

            return Task.FromResult<bool> (true);
        }
    }
}