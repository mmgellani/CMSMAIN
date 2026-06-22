export interface IExaminationFailCriteria {

    failMasterId: string;
    fail_In: string;
    absentConsiderFail: Boolean;
    failMarks: number;
    statusId: number;
    loggerId: string;
    description: string;
    failDetailId: string;
}
export interface IExaminationFailMasterCriteria {

    failMasterId: string;
    fail_In: number;
    absentConsiderFail: Boolean;
    failMarks: number;
    statusId: number;
    loggerId: string;
    fullName: string;
}

export interface IExaminationFailDetailCriteria {

    failDetailId: string;
    failMasterId: string;
    fail_In: number;
    statusId: number;
    loggerId: string;
    description: string;
}
export interface IExaminationVWFailMasterCriteria {
    failMasterId: string;
    fail_In: number;
    absentConsiderFail: Boolean;
    failMarks: number;
    statusId: number;
    loggerId: string;
    fullName: string;
}