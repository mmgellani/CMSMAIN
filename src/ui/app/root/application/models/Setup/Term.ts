export interface ISetupTerm {
	termId : string;
	fullName : string;
	sessionId : string;
	code : string;
	statusId : number;
	loggerId : string;

}
export interface ISetupTermSessionVM {
    termId: string;
    fullName: string;
    sessionId: string;
    code: string;
    statusId: number;
    loggerId: string;
    sessionName: string;
}