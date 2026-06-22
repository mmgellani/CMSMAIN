export interface ISetupSubCity {

    subCityId: string;
    name: string;
    statusId: number;
    loggerId: string;
    cityId: string;
    code: string;
}

export interface ISetupCitySubCityLink {

    subCityId: string;
    subCityName: string;
    statusId: number;
    loggerId: string;
    cityId: string;
    code: string;
    cityName: string;
}
