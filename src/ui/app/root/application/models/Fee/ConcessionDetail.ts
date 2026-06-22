export interface IFeeConcessionDetail {
	concessionDetailId : string;
	concessionId : string;
	feeHeadId : string;
	percentage : number;
	feeAmount : number;
	statusId : number;
	loggerId : string;

}
export interface IConcessionVM {
    scholarshipCriteriaId: string;
    concessionId: string;
    concession: string;
}

export interface IFeeConcessionDetailVM {
	concessionDetailId : string;
	concessionId : string;
	feeHeadId : string;
	fullName:string;
	feeHeadName:string;
	percentage : number;
	feeAmount : number;
	statusId : number;
	loggerId : string;
	zoneId : string;
	sessionId : string;
	programId : string;
	shiftId : string;

}

export interface IGetStudentsVM {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    campusId: string;
    programDetailId: string;
    sessionId: string;
    studentCNIC: string;
    parentCNIC: string;
    obtained: string;
    total: string;
    studentContact: string;
    parentContact: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    shiftId: string;
    zoneId: string;
    studentFeeStructureId: string;
    classId: string;
    installmentNo: number;
    feeHeadId: string;
    feeAmount: number;
    concessionDetailId: string;
    payableAmount: number;
    admissionTypeName: string;
}