export interface IFeeCampusChallanNoteLink {
	campusChallanNoteLinkId : string;
	campusId : string;
	challanNoteId : string;
	installmentNo : number;
	challanTypeId : string;
	statusId : number;
	loggerId : string;

}
export interface IFeeCampusChallanNoteLinkVM {
    campusChallanNoteLinkId: string;
    campusId: string;
    challanNoteId: string;
    installmentNo: number;
    challanTypeId: string;
    statusId: number;
    campusName: String;
    description: String;
    fullName: String;
    loggerId: string;
}