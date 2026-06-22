export interface IExaminationCampusFailCriteriaMapping {
    campusFailCriteriaId: string;
    campusProgramId: string;
    failMasterId: string;
    statusId: number;
    loggerId: string;
    examTypeId: string;
    month: Date;

}

export interface IExaminationVWCampusFailCriteria {
    campusProgramId: string;
    failMasterId: string;
    fail_In: number;
    absentConsiderFail: Boolean;
    failMarks: number;
    statusId: number;
    id: string;
    loggerId: string;
    campusFailCriteriaId: string;
    examTypeId: string;
    month: Date;
    examType: string;
}