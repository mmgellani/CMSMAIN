export interface ISetupSession {
	sessionId : string;
	code : string;
	fullName : string;
	description : string;
	workingDays : string;
	statusId : number;
	loggerId : string;
}

export interface IFeeHead {
	feeHeadId : string;
	fullName : string;
	description : string;
	challanTypeId : string;
}
    
export interface IconcessionContinutionRules{
	concessionRulesId: string;
	concessionContinutionRules:string;
}