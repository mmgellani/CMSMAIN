using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Cms360.Contract;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Service.Helpers;
using Cms360.Service.Model;

namespace Cms360.Service
{
    public class AuditService : IAuditService
    {
        private readonly ILogger<AuditService> logger;
        private readonly IDomainContextResolver resolver;

        public AuditService(ILogger<AuditService> logger, IDomainContextResolver resolver)
        {
            this.logger = logger;
            this.resolver = resolver;
        }

        public void Record<T>(IDomainContext domainContext, T data) where T : IAuditEventData
        {
            logger.LogWarning($"AuditEventTypeId: {data.AuditEventTypeId} event. Message: {data.Message}");
        }
    
        public void Record<T>(T data) where T : IAuditEventData
        {
            IDomainContext domainContext = this.resolver.Resolve();
            Record(domainContext, data);
        }
    }
}