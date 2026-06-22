export interface IAdmissionStudents {
	studentId: string;
	fullName: string;
	fatherName: string;
	studentCNIC: string;
	parentCNIC: string;
	studentContactNo: string;
	parentContactNo: string;
	guardians: string;
	genderId: string;
	dateOfBirth: Date;
	address: string;
	bloodGroupId: string;
	religionId: string;
	statusId: number;
	loggerId: string;
	academicInfo: string;
	image: string;
	operation:string;
}
export interface IAdmissionStudentsEx {
	studentId: string;
	fullName: string;
	fatherName: string;
	studentCNIC: string;
	parentCNIC: string;
	studentContactNo: string;
	parentContactNo: string;
	guardians: string;
	genderId: string;
	dateOfBirth: Date;
	address: string;
	bloodGroupId: string;
	religionId: string;
	statusId: number;
	loggerId: string;
	academicInfo: string;
	image: string;
	guardianName: string;
	degreeId: string;
	groupId: string;
	rollNo: string;
	obtainMarks: string;
	totalMarks: string;
	year: string;
	board: string;
	institute: string;
	registrationNo: string;


}
export interface ExamUpdList
{
	examDetailId: string;
	examMasterId: string;
	examTypeId: string;
	programCourseLinkId: string;
	total: number;
	obtained: number;
	examType: string;
	fullName: string;
	checked:boolean;
	admissionFormId:string;
	month:string;
	monthDate:string;
	examTypeName:string;
	attendanceStatusId:string;
	attendance:string;



}

export interface IAdmissionStudentsExx {
	campusProgramId: string;
	studentId: string;
	fullName: string;
	fatherName: string;
	studentCNIC: string;
	parentCNIC: string;
	studentContactNo: string;
	parentContactNo: string;
	guardians: string;
	genderId: string;
	dateOfBirth: Date;
	address: string;
	bloodGroupId: string;
	religionId: string;
	statusId: number;
	loggerId: string;
	academicInfo: string;
	image: string;
	guardianName: string;
	degreeId: string;
	groupId: string;
	rollNo: string;
	obtainMarks: string;
	totalMarks: string;
	year: string;
	board: string;
	institute: string;
	registrationNo: string;


}

export interface StudentChallanINfoData {
	challanNo: string;
	installmentNo: number;
	fullName: string;
	dueDate: string;
	paidDate?: string;
	feeAmount: number;
	concession: string;
}

export interface PreviousAcademicRecord {
	previousAcademicId: string;
	studentId: string;
	degreeId: string;
	academicMarksDetail: string;
	statusId: number;
}

export interface IAcademicMarks {
    newID: string;
    studentId: string;
    courseName: string;
    totalMarks: string;
    obtainedMarks: string;
    degree: string;
}
export interface ProgramCourseList {
	courseId: string;
	fullName: string;
}
export interface IAcademicInfoss {
    degreeId: string;
    groupId: string;
    institute: string;
    board: string;
    rollNo: string;
    year: string;
    obtainMarks: number;
    totalMarks: number;
}
export interface IAdmissionformList {


 
    subcity: string;
    programdetailid: string;
    genderid: string;
    year: string;
    percentage: number;
    dob: Date;
    fullname: string;
    fathername: string;
    studentcnic: string;
    parentcnic: string;
    studentcontactno: string;
    parentcontactno: string;
    guardian: string;
    address: string;
    academicinfo: string;
    boardregistrationno: string;
    email: string;
    flag: string;
    degreeid: string;
    mail: string;
    refferenceNo: string;


 
}export interface IAdmissionformListEx {


 
    subcity: string;
    programdetailid: string;
    genderid: string;
    year: string;
    percentage: number;
    dob: Date;
    fullname: string;
    fathername: string;
    studentcnic: string;
    parentcnic: string;
    studentcontactno: string;
    parentcontactno: string;
    guardian: string;
    address: string;
    academicinfo: string;
    boardregistrationno: string;
    email: string;
    flag: string;
    degreeid: string;
    mail: string;
    refferenceNo: string;
    challanNo:string;
	feeAmount:string;

 
}