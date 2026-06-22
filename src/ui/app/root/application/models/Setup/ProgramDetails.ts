export interface ISetupProgramDetails {
	programDetailId : string;
	description : string;
	code : string;
	programId : string;
	shiftId : string;
	mediumId : string;
	statusId : number;
	loggerId : string;

}

export interface ISetupProgramDetailsVM {
    programDetailId: string;
    description: string;
    code: string;
    programId: string;
    shiftId: string;
    mediumId: string;
    statusId: number;
    loggerId: string;
    shiftName: string;
    mediumName: string;
    fullName: string;
}