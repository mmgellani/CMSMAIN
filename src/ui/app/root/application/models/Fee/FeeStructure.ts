export interface IFeeFeeStructure {
	feeStructureId : string;
	zoneId : string;
	sessionId : string;
	programId : string;
	shiftId : string;
	classId : string;
	feeHeadId : string;
	feeAmount : number;
	statusId : number;
    loggerId : string;
    isApproved : boolean;

}

export interface IFeeStructureVM {
    feeStructureId: string;
    zoneId: string;
    sessionId: string;
    programId: string;
    shiftId: string;
    classId: string;
    feeHeadId: string;
    feeAmount: number;
    statusId: number;
    loggerId: string;
    shiftName: string;
    className: string;
    feeHeadName: string;
    programName: string;
    percentage:number;
    amount:number;
    isApproved : boolean;
}