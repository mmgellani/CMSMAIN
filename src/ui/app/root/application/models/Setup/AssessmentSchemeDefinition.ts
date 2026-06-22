export interface IAssessmentSchemeDefinitionAll {

	assessmentSchemeMasterId : string;
	fullName : string;
	gradingMasterId : string;
	failMasterId : string;
	totalWeightage : number;
	statusId : number;
	


}
export interface IAssessmentSchemeDefinitionAllEx {

	assessmentSchemeMasterId : string;
	fullName : string;
	gradingMasterId : string;
	failMasterId : string;
	totalWeightage : number;
	statusId : number;
	failMasterName:string;
	name:string


}
export interface IAssessmentExamType {
	assessmentTypeId : string;
	assessmentCategoryId : string;
	examTypeId : string;
	fullName : string;

}

export class IAssessmentExamTypeEx {
	assessmentTypeId : string;
	assessmentCategoryId : string;
	examTypeId : string;
	fullName : string;

}

export interface IAssessmentExamTypeArray {
	AssessmentExamType : Array<IAssessmentExamTypeEx>

}
// export interface IAssessmentTypeAddEx {
// 	assessmentTypeId : string;
// 	assessmentCategoryId : string;
// 	examTypeId : string; 
// 	statusId : number;

// }
export interface IAssessmentCategory {
	assessmentCategoryId : string;
	FullName : string;
	Code : string;
	statusId : number;


}

export interface IAssessmentSchemeDetailList{
	assessmentTypeId : string;
	examCount : string;
	weightage : string;
	statusId : number;

}

export interface IAssessmentSchemeDetailListAdd{
	assessmentSchemeDetailId:string;
	assessmentSchemeMasterId:string;
	assessmentTypeId : string;
	examCount : string;
	weightage : string;
	statusId : number;


}

export interface IAssessmentSchemeDetailListGet{
	assessmentSchemeDetailId:string;
	assessmentSchemeMasterId:string;
	assessmentTypeId : string;
	examCount : string;
	weightage : string;
	fullName:string;
	examName:string;
	statusId : number;


}

export interface IAssessmentSchemeMasterList {

	assessmentSchemeMasterId : string;
	assessmentSchemeName : string;
	fullName : string;
	gradingMasterId : string;
	failMasterId : string;
	totalWeightage : number;
	statusId : number;
//name:string;

}