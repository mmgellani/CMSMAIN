export interface IFeeBank {
	bankId : string;
	fullName : string;
	address : string;
	accountTitle : string;
	accountNo : string;
	statusId : number;
	isEnabled : boolean;
	loggerId : string;
	cityId:string;
	abbreviation:string;

}

export interface IFeeBankVM {
	bankId : string;
	fullName : string;
	address : string;
	accountTitle : string;
	accountNo : string;
	statusId : number;
	loggerId : string;
	isEnabled : boolean;
	cityId:string;
	cityName:string;
	abbreviation:string;

}