export interface IExaminationCampusGradingMapping {
    campusGradingLinkId: string;
    campusProgramId: string;
    gradingMasterId: string;
    statusId: number;
    loggerId: string;
    examTypeId: string;
    month: Date;
}

export interface ExaminationCampusGradingMappingVM {
    campusGradingLinkId: string;
    campusProgramId: string;
    gradingMasterId: string;
    statusId: number;
    session: string;
    name: string;
    campus: string;
    description: string;
    loggerId: string;
    examTypeId: string;
    month: Date;
    examType: string;
} 