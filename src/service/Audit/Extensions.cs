using Cms360.Contract;

namespace Cms360.Service
{
    public static partial class Extensions
    {
        public static void TokenCreatedEvent(this Cms360.Contract.IAuditService audit, string userName, string issuer, int? exp)
        {
            var eventTypeId = Cms360.Service.AuditServiceEventType.TokenCreated;
            IAuditEventData data = new Cms360.Service.Model.AuditEventData(eventTypeId, $"Token Create. Issuer: {issuer}. User Name: {userName}. Exp: {exp}");
            audit.Record(data);
        }
    }
}