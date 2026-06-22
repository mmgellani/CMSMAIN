export interface IFeeCampusBankLink {
	campusBankLinkId : string;
	campusId : string;
	programDetailId : string;
	bankId : string;
	statusId : number;
	loggerId : string;
	genderId:string;
	showInChallan:boolean


}

export interface IFeeCampusBankVM {
	campusBankLinkId : string;
	campusId : string;
	programDetailId : string;
	description : string;
	bankId : string;
	campusName:string
	bankName:string
	statusId : number;
	loggerId : string;

}
export interface IFeeCampusBankAccountVM {
	campusBankLinkId : string;
	campusId : string;
	programDetailId : string;
	description : string;
	bankId : string;
	accountNo: string;
	campusName:string
	bankName:string
	statusId : number;
	loggerId : string;
	genderId:string;
	showInChallan:boolean;

}
export interface GetAdhocChallanList {
	adhocChallanId : string;
	feeHead :string;
	feeHeadId:string;
	feeAmount : Number;
	campus : string;
	dueDate : Date;
	challanNo : string;
	status: string;
	challanTypeId:string;
	email:string;
    staffName:string;
	staffId:string;



}

export interface IFeeCampusBankLink {
	campusBankLinkId : string;
	campusId : string;
	programDetailId : string;
	bankId : string;
	statusId : number;
	loggerId : string;
	genderId:string;
	showInChallan:boolean


}
export interface IAdhocChallanFee {
	feeHeadId : string;
	campusId : string;
	amount : number;
	toDate : Date;
	remarks: string;

}




export interface ICampusBank {
    campusBankLinkId: string;
	campusId: string;
	programDetailId : string;
    bankName: String;
    accountNo: string;
	bankId: string;
	address: string;
	accountTitle: string;
    statusId: number;
}

