export interface IAssessmentType {

	assessmentTypeId : string;
	assessmentCategoryId : string;
	examTypeId : string;
	assessmentCategory : string;
	assessmentType : string;
	code : string;
	statusId : number;


}
export interface IAssessmentTypeAdd {
	assessmentTypeId : string;
	assessmentCategoryId : string;
	examTypeId : string;
	code : string;
	statusId : number;


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