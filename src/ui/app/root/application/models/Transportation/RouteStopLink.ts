export interface ITransportationRouteStopLink {
	routeStopLinkIId : string;
	routeId : string;
	vehicleId : string;
	statusId : number;
	loggerId : string;

}

export interface VMTransportationRouteStopLink {
    zoneId: string;
    zoneName: string;
    cityId: string;
    cityName: string;
    subCityId: string;
    subCityName: string;
    routeId: string;
    routeTitle: string;
    vehicleId: string;
    vehicleName: string;
    vehicleNumberPlate: string;
    statusId: number;
    loggerId: string;
    routeStopLinkIId: string;
}