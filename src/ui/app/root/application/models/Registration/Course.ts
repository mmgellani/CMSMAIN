export interface IRegistrationCourse {
	courseId : string;
	title : string;
	fullName : string;
	statusId : number;
	loggerId : string;
	departmentId:string;

}
export interface IRegistrationCourseVM {
	courseId: string;
		title: string;
		fullName: string;
		statusId: number;
		loggerId: string;
		departmentId: string | null;
		subDepartmentId: string | null;
		departmentName: string;
		subDepartmentName: string;

}

export interface ICourseSelected{
	courseId : string;
	title : string;
	fullName : string;
	isChecked:boolean;

}

export interface IEmailTemplate {
    emailTemplateId: string;
    subject: string;
    body: string;
    statusId: number;
}