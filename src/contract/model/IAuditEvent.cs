namespace Cms360.Contract
{
    public interface IAuditEventData
    {
        int AuditEventTypeId { get; }
        string Message { get; }
    }
}