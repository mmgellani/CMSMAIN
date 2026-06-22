export interface IFeeConcession {
	concessionId : string;
	zoneId : string;
	sessionId : string;
	programId : string;
	shiftId : string;
	challanTypeId : string;
	fullName : string;
	statusId : number;
	loggerId : string;

}
export interface IFeeConcessionExtended {
	concessionId : string;
	zoneId : string;
	sessionId : string;
	programId : string;
	shiftId : string;
	challanTypeId : string;
	fullName : string;
	statusId : number;
	loggerId : string;
	admissionTypeId : string;

}
export interface IFeeConcessionVM {
    concessionId: string;
    zoneId: string;
    sessionId: string;
    programId: string;
    shiftId: string;
    shiftName: String;
    zoneName: String;
    programName: String;
    sessionName: String;
    challanTypeName: String;
    challanTypeId: string;
    fullName: string;
    statusId: number;
    loggerId: string;
}
export interface CheckValidity {
   
    admissionFormId:string;
    concessionId :string;
    concessionName :string;
    installmentNo :number;
    paidDate :Date;
    scholarshipCriteriaId:string;
}
export interface CheckInstallmentP {
   
    admissionFormId:string;
    installmentNo :number;
    paidDate :Date ;

}
