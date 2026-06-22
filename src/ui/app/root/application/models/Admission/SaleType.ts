export interface IAdmissionSaleType {
	saleTypeId : string;
	fullName : string;
	statusId : number;
	loggerId : string;

}

export interface IProgramFeeAdjustment {
	programFeeAdjustmentId : string;
	campusProgramId : string;
	statusId : number;
	isEnabled : boolean;

}

export interface IProgramFeeAdjustmentVM {
	programFeeAdjustmentId: string;
    campusProgramId: string;
    isEnabled: boolean;
    statusId: number;
    program: string;
    shift: string;
    medium: string;
    description: string;

}