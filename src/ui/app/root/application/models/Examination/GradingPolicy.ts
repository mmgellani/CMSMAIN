export interface IExaminationGradingPolicy {
    gradingPolicyId: string;
    fullName: string;
    fromRange: number;
    toRange: number;
    statusId: number;
    loggerId: string;
    remarks: string;
    classId: string;
    sectionId: string;
    campusProgramId: string;
}