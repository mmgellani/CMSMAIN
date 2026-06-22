export interface ISetupAddress {
	addressId : string;
	address : string;
	phoneNo : string;
	postalCode : string;
	cityId : string;
	statusId : number;
	loggerId : string;
	subCityId : string;

}



export interface IAddressJsonB {
	addressType: string;
	address : string;
}

export interface IGuardianJsonB {
	name : string;
}