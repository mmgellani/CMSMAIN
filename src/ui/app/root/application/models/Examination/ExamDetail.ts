export interface IExaminationExamDetail {
	examDetailId : string;
	examMasterId : string;
	admissionFormId : string;
	attendanceStatusId : string;
	obtainMarks : number;
	statusId : number;
    loggerId : string;
   

}
export interface ITeacherSection {
    sectionCourseLinkId: string;
    sectionName: string;
    programCourseLinkId: string;
    sectionId:string;
}

export interface ITeacherCourse {
    programCourseLinkId: string;
    courseName: string;
    courseId:string;
}
export interface IExaminationExamDetailVM {
    examDetailId: string;
    examMasterId: string;
    admissionFormId: string;
    attendanceStatusId: string;
    obtainMarks: number;
    statusId: number;
    studentName: string;
    exammasterName: string;
    sectionName: string;
    className: string;
    code: string;
    totalMarks: number;
    dated: Date;
    loggerId: string;
}


export interface IExamCourseVM {
    sectionCourseLinkId: string;
    course: string;
    campusProgramId: string;
    classId: string;
}
export interface IExamDataVM {
    examDetailId: string;
    admissionFormId: string;
    rollNo: string;
    fullName: string;
    examMasterId: string;
    attendanceStatusId: string;
    obtainMarks: number;
    statusId: number;
    code: string;
    dated: Date;
    totalMarks: number;
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    courseId: string;
    courseName: string;
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    sessionId: string;
    
}

export interface IExamBulkVM {
    serialId: number;
    admissionFormId: string;
    studentId: string;
    rollNo: string;
    refferenceNo: string;
    fullName: string;
    campusId: string;
    programDetailId: string;
    sessionId: string;
    shiftId: string;
    classId: string;
    courseId: string;
    courseName: string;
    statusId: number;
    obtainMarks: number;
    attendanceStatusId: string;
    sectionId: string;
    isApproved:boolean;
    shouldAbsent:boolean
    
}