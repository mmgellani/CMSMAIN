export interface ITransportationRouteInfo {
    routeId: string;
    routeTitle: string;
    subCityId: string;
    maxInstallmentNo: number;
    driverName: string;
    driverPhoneNo: string;
    routeStartPoint: string;
    routeEndPoint: string;
    statusId: number;
    loggerId: string;
    vehicleId: string;
    longitude:string;
    latitude:string;
}

export interface ITransportationRouteInfoByStudent {
    routeId: string;
    routeTitle: string;
    statusId: number;
}