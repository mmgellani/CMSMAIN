export interface IUserLog {
    auditId: string;
    dateTime: string;
    displayName: string;
    localIpPort: string;
    publicIpPort: string;
    user: string;
    controllerAction: string;
    operation: string;
}