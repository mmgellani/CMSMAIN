export interface IAdmissionStudentsImage {
	studentsImageId : string;
	studentId : string;
	image : string;
	statusId : number;
	loggerId : string;

}


export interface IAdmissionStudentsImageVM {
    studentsImageId: string;
    studentId: string;
    fullName: String;
    image: string;
    statusId: number;
    loggerId: string;
}