export interface ISetupClass {
	classId : string;
	fullName : string;
	description : string;
	classCode : string;
	isAdmissionTest : number;
	isInterview : number;
	statusId : number;
	loggerId : string;

}
export interface ISetupSectionList {
	sectionId : string;
	fullName : string;
	description : string;
	statusId : number;
	loggerId : string;

}

export interface ISetupSectionListData {
	sectionId : string;
	section : string;
	description : string;
	statusId : number;

}
export interface IGetConcessionStudentsList {
    admissionFormId: string;
    rollNo:string;
    studentName:string;
    AdmissionType: string;
    installmentNo:number;
    classId:string;
    isChecked:boolean;
    remarks:string;
    scholarshipCriteriaId:string;
}
export interface VWClassLevel {
    fullName: string;
    description: string;
    classCode: string;
    levelId: string;
    programId: string;
    classId: string;
    levelProgramClassId: string;
  }

  export interface AssessmentViewList {
    assessmentScheduleId: string;
    scheduleDate: Date;
    totalMarks: number;
    assessmentStatus: number;
    assessmentName: string;
    month: string;
    weightage: number;
    sectionName: string;
    sectionId: string;
    gradingMasterId: string;
    failMasterId: string;
    gradingCriteria: string;
    failCriteria: string;
    assessmentSchedulingDetailId: string;
    assessmentSectionMapId: string;
    programCourseLinkId: string;
    statusId: number;
}
export interface IGetConcessionStudentsListEX {
    admissionFormId: string;
    admissionType:string;
    continuationPolicy :string;
    rollNo:string;
    refferrenceNo:string;
    fullName:string;
    fatherName:string;
    scholarshipCriteriaId:string;
    concessionName:string;
    isChecked:boolean;


}
export interface ISetupClassCheckBox extends ISetupClass{
	
	isChecked:boolean
	}