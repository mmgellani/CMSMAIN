export interface IExaminationExamType {
    examTypeId: string;
    code: string;
    fullName: string;
    statusId: number;
    loggerId: string;

}
export interface IExamBulkUpdateVM {
    rollNo: string;
    fullName: string;
    examMasterId: string;
    totalMarks: number;
    dated: string;
    isApproved: boolean;
    examDetailId: string;
    attendanceStatusId: string;
    obtainMarks: number;
    shouldAbsent: boolean;
}

export interface IExamScheduleName {
    examTypeId: string;
    examName: string;


}

export interface IExamScheduleNameNew {
    examTypeId: string;
    examName: string;
    fullName: string;


}