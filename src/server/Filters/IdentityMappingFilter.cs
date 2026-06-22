using System;
using System.Threading.Tasks;
using Cms360.Contract.Security;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authorization;

namespace Cms360.Server.Filters
{
    [Authorize]
    public class IdentityMappingFilter : IAsyncResourceFilter
    {
        private readonly ILocalAuthenticationService authService;

        public IdentityMappingFilter(ILoggerFactory logger, ILocalAuthenticationService authService)
        {
            this.authService = authService;
        }

        public async Task OnResourceExecutionAsync(ResourceExecutingContext context, ResourceExecutionDelegate next)
        {
            var identity = context.HttpContext.User.Identity;

            if (!string.IsNullOrWhiteSpace(identity.Name))
            {
                var user = await this.authService.ResolveUser(identity.Name);

                if (user != null)
                    context.HttpContext.Items.Add(Cms360.Server.Extensions.HttpContextCurrentUserKey, user);
            }

            await next.Invoke();
        }
    }
}