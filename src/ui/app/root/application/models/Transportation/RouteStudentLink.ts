export interface ITransportationRouteStudentLink {
	routeStudentLinkId : string;
	routeDetailId : string;
	admissionFormId : string;
	exemption : number;
	startingDtae : Date;
	statusId : number;
	loggerId : string;
	isChecked : boolean;

}

export interface routestudentlinkVM {
    admissionFormId: string;
    studentId: string;
    rollNo: string;
    fullName: string;
    address: string;
    zoneId: string;
    sessionId: string;
    campusId: string;
    campusName: string;
    subCityId: string;
    subCityName: string;
    cityId: string;
    cityName: string;
}
export interface IRouteStudentLinkEx {
    admissionFormId: string;
    studentId: string;
    rollNo: string;
    refferenceNo: string;
    fullName: string;
    address: string;
    campusProgramId: string;
    sessionId: string;
    campusId: string;
    campusName: string;
    subCityId: string;
    subCityName: string;
    cityId: string;
    cityName: string;
    routeDetailId: string;
    routeId: string;
    stopName: string;
    routeTitle: string;
    startingDtae: Date;
    statusId: number;
    classId: string;
}

export interface routestudentlinklistVM {
    admissionFormId: string;
    studentId: string;
    rollNo: string;
    fullName: string;
    address: string;
    zoneId: string;
    sessionId: string;
    campusId: string;
    campusName: string;
    subCityId: string;
    subCityName: string;
    cityId: string;
    cityName: string;
    routeDetailId: string;
    routeId: string;
    stopName: string;
    routeTitle: string;
    startingDtae: Date;
    statusId: number;
    refferenceNo: string;
}
export interface IStudentsCampusVM {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    studentLoggerId: string;
    sessionId: string;
    campusId: string;
    classId: string;
    subCityId: string;
    subCityName: string;
    cityName: string;
    paidDate: string;
    installmentNo: number;
}
export interface IStudentSubCityVM {
    admissionFormId: string;
    campusProgramId: string;
    studentId: string;
    admissionTypeId: string;
    rollNo: string;
    refferenceNo: string;
    academicInfo: string;
    statusId: number;
    loggerId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    parentCNIC: string;
    studentContactNo: string;
    parentContactNo: string;
    guardians: string;
    genderId: string;
    dateOfBirth: string;
    address: string;
    bloodGroupId: string;
    religionId: string;
    studentLoggerId: string;
    sessionId: string;
    campusId: string;
    zoneId: string;
    subCityId: string;
    subCityName: string;
    cityName: string;
}