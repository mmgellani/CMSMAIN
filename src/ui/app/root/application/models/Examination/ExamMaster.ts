export interface IExaminationExamMaster {
    examMasterId: string;
    examTypeId: string;
    dated: Date;
    totalMarks: number;
    statusId: number;
    loggerId: string;
    sectionCourseLinkId?: string;
    programCourseLinkId: string;
    isApproved: boolean;
    operation:string;
}

export interface IExaminationExamMasterEx {
    examMasterId: string;
    examTypeId: string;
    dated: Date;
    totalMarks: number;
    isAssessment : boolean;
    statusId: number;
    loggerId: string;
    sectionCourseLinkId?: string;
    programCourseLinkId: string;
    isApproved: boolean;
    operation:string;
}

export interface IExaminationExamMasterVM {
    examMasterId: string;
    examTypeId: string;
    dated: Date;
    totalMarks: number;
    statusId: number;
    loggerId: string;
    sectionCourseLinkId: string;
    programCourseLinkId: string;
    classId: string;
    className: string;
    sectionName: string;
    courseId: string;
    courseName: string;
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    sessionId: string;
    campusName: string;
    programName: string;
    fullName: string;
}
export interface ExamStudentResult {
    ide: string;
    dated: string;
    fullName: string;
    rollNo: string;
    totalMarks: number;
    obtainedMarks: number;
    sectionCourseLinkId?: string;
    examTypeId?: string;
    dte?: string;
    admissionFormId?: string;
    examMasterId?: string;
    examDetailId?: string;
    courseName: string;
    programCourseLinkId: string;
    code: string;
    attendenceStatusId:string;

}

export interface ExamMonthWise {
    dated:Date;
    ide: string;
    month: string;
    total: number;
    obtained: number;
    percentage: number;
    passCount: number;
    failCount: number;
    examTypeId: string;
    examType: string;
}

export interface IExamMonthlyReport {
    newID: string;
    admissionFormId: string;
    studentName: string;
    fatherName: string;
    address: string;
    campusName: string;
    sessionName: string;
    examType: string;
    overAllGrades: string;
    overAllRemark: string;
    remarks: string;
    rollNo: string;
    parentContactNo: string;
    totalMarks: number;
    obtainMarks: number;
    description: string;
    programName: string;
    sectionName: string;
    className: string;
    courseName: string;
}
export interface IExamMonthlyReportExx {
    newID: string;
    admissionFormId: string;
    studentName: string;
    fatherName: string;
    address: string;
    campusName: string;
    sessionName: string;
    examType: string;
    overAllGrades: string;
    overAllRemark: string;
    remarks: string;
    rollNo: string;
    parentContactNo: string;
    totalMarks: number;
    obtainMarks: number;
    percentage: number;
    grade: string;
    description: string;
    programName: string;
    sectionName: string;
    className: string;
    courseName: string;
}


export interface  IStudentProfileApproved {
    ide: string; 
    admissionFormId : string;
    classId : string;
    assessmentScheduleId: string;
    month: string;
    assessmentName: string;
    weightage: number;
    totalMarks: number;
    obtainMarks: number;
    weightedScore: number;
    weightedPercentage: number;
    aggregatePercentage: number;
}
 
export interface  IStudentProfileUnApproved {
    ide: string;
    admissionFormId : string;
    classId : string;
    assessmentScheduleId: string;
    month: string;
    assessmentName: string;
    weightage: number;
    totalMarks: number;
    obtainMarks: number;
    weightedScore: number;
    weightedPercentage: number; 
} 
export interface  IStudentProfileCourseView {
    ide: string;
    admissionFormId : string;
    classId : string;
    courseId:string;
    course:string; 
    month: string;
    assessmentName: string;
    weightage: number;
    totalMarks: number;
    obtainMarks: number;
    markesPercentage: number; 
    grade: string;
    overAllRemark: string;
}  
export interface  IStudentProfileCourseViewUnApproved {
    ide: string;
    admissionFormId : string;
    classId : string;
    courseId:string;
    course:string; 
    month: string;
    assessmentName: string;
    weightage: number;
    totalMarks: number;
    obtainMarks: number;
    markesPercentage: number; 
    grade: string;
    overAllRemark: string;
}  
 