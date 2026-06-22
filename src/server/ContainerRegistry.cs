using System;
using StructureMap;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using Cms360.Data;
using Cms360.Contract;
using Microsoft.AspNetCore.Http;
using Cms360.Service;
using Microsoft.Extensions.Localization;
using Cms360.Service.Localization;

namespace Cms360.Server
{
    internal class ContainerRegistry : Registry
    {
        public ContainerRegistry()
        {
            var targets = new Filters.ApiExceptionFilterTargets()
            {
                { typeof(Cms360.Service.ServiceException), PayloadMessageType.Failure}
            };

            For<IConfiguration>().Use(WebApp.Configuration).Singleton();
            For<DbContextBase>().Use<NpgSqlContext>();
            // For<DbContextBase>().Use<MsSqlContext>();

            For<HttpServiceContextFactory>();
            For<IHttpContextAccessor>().Use<HttpContextAccessor>().Transient();
            For<IHttpServiceContextResolver>().Use<HttpServiceContextResolver>();
            For<IDomainContextResolver>().Use<HttpServiceContextResolver>();
            For<ILocalizationResolver>().Add<LocalizationResolver>().Singleton();
            For<ILocalizationService>().Add<LocalizationService>();

            For<Filters.ApiResultFilter>();
            For<Filters.ApiExceptionFilterTargets>().Use(targets);
            For<Filters.ApiExceptionFilter>();
            For<Filters.IdentityMappingFilter>();

            For<CultureService>();
            For<IDeviceProfiler>().Use<HttpDeviceProfiler>();
            For<IVerificationProvider>().Use<HttpVerificationProvider>();

            For<IUserLogService>().Use<UserLogService>();
            For<IEmailService>().Use<EmailService>();
        }
    }
}