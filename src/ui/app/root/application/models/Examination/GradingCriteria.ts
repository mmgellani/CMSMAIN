export interface IExaminationGradingCriteriaVM 
{
    gradingDetailId: string;
    maxMarks: number;
    gradeLetter: string;
    gradingMasterId: string;
    name: string;
    statusId: number;
    loggerId: string;
}

export interface IExaminationGradingDetail 
{
    gradingDetailId: string;
    maxMarks: number;
    gradeLetter: string;
    gradingMasterId: string;
    statusId: number;
    loggerId: string;
}

export interface IExaminationGradingMaster 
{
    gradingMasterId: string;
    name: string;
    statusId: number;
    loggerId: string;
}

export interface GradingMasterDetailData {
   
    gradingMasterId: string;
    name: string;
   
}