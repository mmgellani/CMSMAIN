export interface ISetupConcessoinRemarks {
    concessionRemarksId: string;
    campusId: string;
    remarks: string;
    statusId: number;
    loggerId: string;
}

export interface IVWConcessionRemarksVM {
    concessionRemarksId: string;
    campusId: string;
    campusName: string;
    remarks: string;
    statusId: number;
    loggerId: string;
}


export interface ISetupExemptionRemarks {
    exemptionRemarksId: string;
    campusId: string;
    remarks: string;
    statusId: number;
    loggerId: string;
}

export interface IVWExemptionRemarksVM {
    exemptionRemarksId: string;
    campusId: string;
    campusName: string;
    remarks: string;
    statusId: number;
    loggerId: string;
}