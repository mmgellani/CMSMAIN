export interface ISetupProvince {
	provinceId : string;
	fullName : string;
	code : string;
	description : string;
	countryId : string;
	statusId : number;
	loggerId : string;

}

export interface ISetupProvinceVM {
    provinceId: string;
    fullName: string;
    code: string;
    description: string;
    countryId: string;
    statusId: number;
    loggerId: string;
    countryName: string;
}