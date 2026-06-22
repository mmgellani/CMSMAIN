import { StringifyOptions } from "querystring";
import { Time } from "highcharts";

export interface IAttendanceAttendenceMaster {
    attendenceMasterId: string;
    timeTableId: string;
    dated: Date;
    isApproved: boolean;
    statusId: number;
    loggerId: string;
    operation: string;
}

export interface IOperationAttendanceMaster {
    insertedBy: number;
    browserInfo: string;
    insertionTime: string;
    inTime: boolean;
    approvalTime: string;
    approvedBy: number;
}

export interface IAttendanceAttendenceMasterVM {
    attendenceMasterId: string;
    timeTableId: string;
    dated: string;
    isApproved: boolean;
    statusId: number;
    loggerId: string;
    sectionName: string;
    name: string;
    roomName: string;
    dayName: string;
    staffName: string;
    startTime: string;
    endTime: string;
    session: string;
    campusId: string;
    campusName: string;
    sessionId: string;
    sectionId: string;
    programDetailId: string;
    // campusProgramId: string;
    classId: string;
}

export interface IAttendanceApprovalDataVM {
    attendenceMasterId: string;
    timeTableId: string;
    dated: string;
    date: string;
    isApproved: boolean;
    statusId: number;
    loggerId: string;
    fullName: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    courseId: string;
    sectionName: string;
    dayName: string;
    operation: string;
}

export interface IAttendanceApprovalDataExVM {
    attendenceMasterId: string;
    timeTableId: string;
    dated: string;
    date: string;
    isApproved: boolean;
    statusId: number;
    loggerId: string;
    course: string;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    courseId: string;
    sectionName: string;
    dayName: string;
    operation: string;
    staffName: string;
    startTime: string;
    endTime: string;
}
export interface AttendanceApprovalExNotificationVM {
    attendenceMasterId: string;
    dated: string;
    course: string;
    sessionId: string;
    campusId: string;
    campusProgramId: string;
    classId: string;
    sectionCourseLinkId: string;
    rollNo: string;
    code: string;
    name: string;
}


export interface AttendenceMonthWise {
    iD: string;
    month: string;
    total: number;
    presents: number;
    leave: number;
    startDate: Date;
    endDate: Date;
    absents: number;
    attendencePercentage: number;
    aggrePercentage: number;
}

export interface AttendencePercentages {
    iD: string;
    total: number;
    presents: number;
    leave: number;
    absents: number;
    attendencePercentage: number;
  
}


export interface VWAttendanceHistory {
    attendenceMasterId: string;
    dated: string;
    inTime: string;
    approvedBy: string;
    insertedBy: string;
    browserInfo: string;
    approvalTime: string;
    insertionTime: string;
    statusId: number;
    startTime: string;
    endTime: string;

}
export interface AttendanceDevice {

    browserInfo: string;
    count: number;
    dated: string;
}
export interface IDayCloseInsert {
    attendenceMasterId: string;
    operation: string;
}

export interface IOperationDayClose {
    insertedBy: number;
    browserInfo: string;
    insertionTime: string;
}

export interface StudentToSend {
    id: string;
    phoneNo: string;
    fullName: string;
    programCourseLinkId: string;
    sectionCourseLinkId: string;
    courseName: string;
    admissionFormId: string;
}







export interface IAttendanceAttendanceStudentInfo {
    newID: string;
    admissionFormId: string;
    studentName: string;
    dated: string;
    dayName: string;
    refferenceNo: string;
    campusName: string;
    sessionName: string;
    rollNo: string;
    description: string;
    programName: string;
    sectionName: string;
    className: string;
    shiftName: string;
    courseName: string;
    attendanceStatus: string;
}

export interface DeviceInfoEx {
    operation: string;
}


export interface SmartAttendence {
    id: string;
    cityId: string;
    cityName: string;
    subCityId: string;
    subCityName: string;
    campusId: string;
    campusName: String;
}