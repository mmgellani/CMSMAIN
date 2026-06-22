export interface IRegistrationSectionCourseLink {
	sectionCourseLinkId: string;
	campusProgramId: string;
	classId: string;
	sectionId: string;
	fromSerial: number;
	toSerial: number;
	statusId: number;
	loggerId: string;


}
export interface IRegistrationSectionCourseLink1 {
	sectionCourseLinkId: string;
	campusProgramId: string;
	classId: string;
	sectionId: string;
	fromSerial: number;
	toSerial: number;
	statusId: number;
	loggerId: string;
	roomBuildingLinkId:string;

}
export interface IRegistrationSectionCourseLinkVM {
	sectionCourseLinkId: string;
	campusProgramId: string;
	classId: string;
	className: string;
	sectionName: string;
	fullName: string;
	description: string;
	sectionId: string;
	sessionid: string;
	campusid: string;
	programDetailId: string;
	fromSerial: number;
	toSerial: number;
	statusId: number;
	loggerId: string;
	rollNo: number;
	roomBuildingLinkId:string;
	buildingRooms:string;

}
export interface IRegistrationSectionCourseLinkVM1 {
	sectionCourseLinkId: string;
	campusProgramId: string;
	classId: string;
	className: string;
	sectionName: string;
	fullName: string;
	description: string;
	sectionId: string;
	sessionid: string;
	campusid: string;
	programDetailId: string;
	fromSerial: number;
	toSerial: number;
	statusId: number;
	loggerId: string;
	rollNo: number;
	roomBuildingLinkId:string;
}

export interface IRegistrationSectionCourseLinkVMEX {
	sectionCourseLinkId: string;
	campusProgramId: string;
	classId: string;
	className: string;
	sectionName: string;
	fullName: string;
	description: string;
	sectionId: string;
	sessionid: string;
	campusid: string;
	programDetailId: string;
	fromSerial: number;
	toSerial: number;
	statusId: number;
	loggerId: string;
	rollNo: number;
}
export interface IRegistrationSectionCourseLinkList {
    sectionCourseLinkId: string;
    campusProgramId: string;
    classId: string;
    sectionId: string;
    fromSerial: number;
    toSerial: number;
    statusId: number;
    loggerId: string;
    fullName: string;
}
export interface IRegistrationSectionCourseLinkList {
    sectionCourseLinkId: string;
    campusProgramId: string;
    classId: string;
    sectionId: string;
    fromSerial: number;
    toSerial: number;
    statusId: number;
    loggerId: string;
    fullName: string;
}

export interface IRegistrationRoom {
    
    roomBuildingLinkId: string;
	buildingName:string;
	roomName:string;
	campusId:string;
}


export interface StudentProfile {
	 
	admissionFormId: string;
	studentId:  string;
   rollNo:  string;
	studentName:  string;
   fatherName:  string;
	parentContactNo: string;
	studentContactNo: number;
	programId:  string;
	programName:  string;
   sectionId:  string;
	sectionName: string;
	studentCNIC:  string;
	password: string;
	classId:  string;
	className :  string;
}

export interface StudentProfileMask {
	 
	smsApId: string;
	loginId:  string;
	password:  string;
	shortCodePref:  string;
	isUnicode:  string;
	mask: string;
	 
}