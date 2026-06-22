import { StringIterator } from "lodash";

export interface IExamApproval {
  campusProgramId: string;
  classId: string;
  sectionId: string;
  campusId: string;
  programDetailId: string;
  sessionId: string;
  examMasterId: string;
  totalMarks: number;
  dated: string;
  dayname: string;
  statusId: number;
  sectionCourseLinkId: string;
  programCourseLinkId: string;
  courseId: string;
  courseName: string;
  isApproved: boolean;
  examTypeId: string;
}
export interface IExamApproval2 {
  campusProgramId: string;
  classId: string;
  sectionId: string;
  campusId: string;
  programDetailId: string;
  sessionId: string;
  examMasterId: string;
  totalMarks: number;
  dated: string;
  month: string;
  statusId: number;
  sectionCourseLinkId: string;
  programCourseLinkId: string;
  courseId: string;
  courseName: string;
  isApproved: boolean;
  examTypeId: string;
  examName: string;
  examScheduleId: string;
  passCount: number;
  failCount: number;
  absent: number;
  status: string;
  isEnabled: boolean;
  action: boolean;
}

export interface GetStudentExamDetail {
  newID: String;
  rollNo: string;
  studentName: string;
  attendence: string;
  obtainMarks: number;
}

export interface GetExamSMSApprovalData {
  newID: String;
  campusProgramId: string;
  sectionCourseLinkId: string;
  classId: string;
  programDetail: string;
  section: string;
  sectionId: String;
  campusId: string;
  programDetailId: string;
  sessionId: string;
  totalScheduledExams: string;
  approvedExams: string;
  status: string;
  month: string;
  isApproved: boolean;
}

export interface GetExamSMSApprovalDatapopup {
  newID: String;
  campusProgramId: string;
  sectionCourseLinkId: string;
  examName: string;

  classId: string;
  programDetail: string;
  section: string;
  sectionId: String;
  campusId: string;
  programDetailId: string;
  sessionId: string;
  totalScheduledExams: string;
  approvedExams: string;
  status: string;
  month: string;
  className: string;
  approvalDate: string;
}
