export interface IFeeFeeStructureDetail {
	feeStructureDetailId : string;
	feeStructureId : string;
	installmentNo : number;
	challanTypeId : string;
	feeAmount : number;
	statusId : number;
	loggerId : string;

}

export interface IFeeFeeStructureDetailVM {
	feeStructureDetailId : string;
	feeStructureId : string;
	installmentNo : number;
	challanTypeId : string;
	feeHeadName:string;
	fullName:string;
	feeAmount : number;
	statusId : number;
	loggerId : string;

}