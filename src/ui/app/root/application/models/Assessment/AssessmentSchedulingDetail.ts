export interface IAssessmentSchedulingDetail {
    assessmentSchedulingDetailId: string;
    assessmentDetailId: string;
    fullName: string;
    month: string;
    weightage: number;
    order: number;
    statusId: number;
    assessmentSchedulingMasterId: string;
}

export interface IAssessmentSchedulingList {
    assessmentSchedulingMasterId:  string;
	assessmentSchemeMasterId: string;
    assessmentName: string;
    totalWeightage: number;
    failCriteris: string;
    gradingPolicy: string;
    statusId: number; 
}
 
export interface IAssessmentSchedulingListData {
    assessmentSchedulingDetailId:  string;
	assessmentSchemeDetailId: string;
    assessmentCategoryName: string;
    month: string;
    weightage: number;
    order: number;
    statusId: number;
    assessmentSchemeMasterId: string;
     
} 
export interface IMonthList {
    key:  string;
	value: string; 
     
} 
export interface IAssessmentSchedulingMasterAdd {
    AssessmentSchedulingMasterId:  string;
	AssessmentSchemeMasterId: string; 
    statusId: number;
     
} 