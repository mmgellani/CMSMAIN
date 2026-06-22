export interface ISetupZoneCityLink {
    zoneCityId: string;
    zoneId: string;
    cityId: string;
    statusId: number;
    loggerId: string;

}

export interface ISetupZoneCityLinkVM {
    zoneCityId: string;
    zoneId: string;
    subCityId: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    name: string;
    campusId: string;
    campusName: string;
}

export interface IZoneCityVM {
    zoneCityId: string;
    zoneId: string;
    cityId: string;
    statusId: number;
    loggerId: string;
    zoneName: string;
    name: string;
}