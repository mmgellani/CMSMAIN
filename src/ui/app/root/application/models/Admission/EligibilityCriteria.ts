export interface IAdmissionEligibilityCriteria {
	eligibilityCriteriaId : string;
	campusProgramId : string;
	admissionTypeId : string;
	genderId : string;
	markPercentage : number;
	minPassingYear : Date;
	fromDob : Date;
	toDob : Date;
	statusId : number;
	loggerId : string;

}

export interface IAdmissionEligibilityCriteriaVM {
    eligibilityCriteriaId: string;
    campusProgramId: string;
    admissionTypeId: string;
    genderId: string;
    markPercentage: number;
    minPassingYear: string;
    fromDob: string;
    toDob: string;
    statusId: number;
    fullName: String;
    gender: String;
    description: String;
    sessionId:string;
    campusId:string;
    loggerId: string;
}