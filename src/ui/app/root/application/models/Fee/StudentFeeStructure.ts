export interface IFeeStudentFeeStructure {
	studentFeeStructureId: string;
	admissionFormId: string;
	classId: string;
	installmentNo: number;
	feeHeadId: string;
	feeAmount: number;
	concessionDetailId: string;
	payableAmount: number;
	statusId: number;
	loggerId: string;

}


export interface IFeeStudentFeeStructureVM {
	admissionFormId: string;
	refferenceNo: string;
	fullName: string;
	fatherName: string;
	campusId: string;
	programDetailId:string;
	sessionId:string;
	description: string;
	statusId: number;


}
