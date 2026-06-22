export interface IExamResultApproval {

    courseId: string;
    examMasterId: string;
    studentId: string;
    rollNo: string;
    studentName: string;
    courseName: string;
    dated: string;
    dayname: string;
    totalMarks: number;
    obtainMarks: number;
    statusId: number;
    isApproved: boolean;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    classId: string;
    sectionId: string;
}