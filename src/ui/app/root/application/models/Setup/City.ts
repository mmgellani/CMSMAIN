export interface ISetupCity {
	cityId : string;
	fullName : string;
	cityCode : string;
	statusId : number;
	loggerId : string;
	provinceId : string;
	zoneId : string;

}
 
export interface CitySubCity {
    cityId: string;
    cityName: string;
    subCityId: string;
    subCityName: string;
}