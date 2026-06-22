export interface IRegistrationProgramCourseLink {
	programCourseLinkId : string;
	programDetailId : string;
	classId : string;
	courseId : string;
	statusId : number;
	loggerId : string;

}

export  interface RegistrationProgramCourseLinkVM {
    programCourseLinkId: string;
    programDetailId: string;
    classId: string;
    courseId: string;
    statusId: number;
    courseName: string;
    className: String;
    description: String;
    loggerId: string;
}

export  interface Examcourselist {
    
    examScheduleId: string;
    examTypeId: string;
    courseId: string;
    fullName: string;
    sectionCourseLinkId: string;
    programCourseLinkId: string;
    programDetailId: string;
    classId: string;
    totalMarks:number;
    examDate:Date;
    campusProgramId :string;
    failMasterId:string;
    gradingMasterId :string;
    statusId :number;
    month:string;
}