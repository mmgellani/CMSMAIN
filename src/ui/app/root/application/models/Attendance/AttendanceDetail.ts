export interface IAttendanceAttendanceDetail {
    attendanceDetailId: string;
    attendanceMasterId: string;
    admissionFormId: string;
    attendenceStatusId: string;
    statusId: number;
    loggerId: string;

}
export interface IAttendanceAttendanceIndividSummary {
    newID: string;
    admissionFormId: string;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
    startDate: string;
    endDate: string;
    month: string;
    monthNbr: number;
    studentName: string;
    fatherName: string;
    address: string;
    refferenceNo: string;
    campusName: string;
    sessionName: string;
    rollNo: string;
    description: string;
    programName: string;
    sectionName: string;
    className: string;
    shiftName: string;
    installmentNo: number;
    concessionName: string;
}

export interface IAttendanceAttendanceDetailVM {
    attendanceDetailId: string;
    attendanceMasterId: string;
    admissionFormId: string;
    attendenceStatusId: string;
    statusId: number;
    loggerId: string;
    isApproved: boolean;
    dayName: string;
    roomName: string;
    name: string;
    startTime: Date;
    endTime: Date;
    staffName: string;
    sectionName: string;
    attendanceStatus: string;
    fullName: string;
    dated: Date;
    classId: string;
    sectionId: string;
    session: string;
    sessionId: string;
    programDetailId: string;
    campusId: string;
    courseId: string;
    courseName: string;
    isChecked: boolean;
    rollNo: string;
    refferenceNo: string;
    timeTableId: string;

}

export interface IAttendanceAttendanceDetailVMEx {
    attendanceDetailId: string;
    attendanceMasterId: string;
    admissionFormId: string;
    attendenceStatusId: string;
    statusId: number;
    loggerId: string;
    isApproved: boolean;
    dayName: string;
    roomName: string;
    name: string;
    startTime: Date;
    endTime: Date;
    staffName: string;
    sectionName: string;
    attendanceStatus: string;
    fullName: string;
    dated: Date;
    classId: string;
    sectionId: string;
    session: string;
    sessionId: string;
    programDetailId: string;
    campusId: string;
    courseId: string;
    courseName: string;
    isChecked: boolean;
    rollNo: string;
    refferenceNo: string;
    timeTableId: string;
    programCourseLinkId: string;
    shouldAbsent: boolean;

}
export interface IAttendanceUpdateVM {
    attendanceDetailId: string;
    attendanceMasterId: string;
    admissionFormId: string;
    attendenceStatusId: string;
    statusId: number;
    loggerId: string;
    isApproved: boolean;
    dayName: string;
    roomName: string;
    name: string;
    startTime: Date;
    endTime: Date;
    staffName: string;
    sectionName: string;
    attendanceStatus: string;
    fullName: string;
    dated: Date;
    classId: string;
    sectionId: string;
    session: string;
    sessionId: string;
    programDetailId: string;
    campusId: string;
    courseId: string;
    courseName: string;
    isChecked: boolean;
    rollNo: string;
    refferenceNo: string;
    timeTableId: string;
    programCourseLinkId: string;
    shouldAbsent: boolean
}
export interface IStudentOfSection {
    admissionFormId: string;
    fullName: string;
    rollNo: string;
}

export interface IStudentOfSectionEx {
    admissionFormId: string;
    fullName: string;
    rollNo: string;
    classId: string;
    className: string;
}
export interface IAttendenceData {
    serialId: number;
    admissionFormId: string;
    campusProgramId: string;
    rollNo: string;
    refferenceNo: string;
    studentId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    sectionCourseLinkId: string;
    dayName: string;
    slotTimingId: string;
    startTime: string;
    endTime: string;
    classId: string;
    courseName: string;
    courseId: string;
    timeTableId: string;
    attendenceStatusId: string;
    isChecked: boolean;
    sessionId: string;
    sectionId: string;
}

export interface IAttendenceDataDayoff {
    serialId: number;
    admissionFormId: string;
    campusProgramId: string;
    rollNo: string;
    refferenceNo: string;
    studentId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    sectionCourseLinkId: string;
    dayName: string;
    slotTimingId: string;
    startTime: string;
    endTime: string;
    classId: string;
    courseName: string;
    courseId: string;
    timeTableId: string;
    attendenceStatusId: string;
    isChecked: boolean;
    sessionId: string;
    sectionId: string;
    isDayOff: number;
}

export interface IAttendenceDataEx {
    serialId: number;
    admissionFormId: string;
    campusProgramId: string;
    rollNo: string;
    refferenceNo: string;
    studentId: string;
    fullName: string;
    fatherName: string;
    studentCNIC: string;
    sectionCourseLinkId: string;
    dayName: string;
    slotTimingId: string;
    startTime: string;
    endTime: string;
    classId: string;
    courseName: string;
    courseId: string;
    timeTableId: string;
    attendenceStatusId: string;
    isChecked: boolean;
    sessionId: string;
    sectionId: string;
    programCourseLinkId: string;
    sectionName: string;
    shouldAbsent: boolean;
}

export interface IAttendanceBulkModel {
    rollNo: string;
    admissionFormId: string;
    fullName: string;
    isChecked: boolean;
    courses: Array<IAttendanceBulkChild>;

}

export interface IAttendanceBulkChild {
    courseName: string;
    courseId: string;
    timeSlot: string;
    timeTableId: string;
    attendenceStatusId: string;
    admissionFormId: string;
    isUpdate: boolean;
}

export interface IAttendanceBulkModelU {
    rollNo: string;
    admissionFormId: string;
    fullName: string;
    isChecked: boolean;
    loggerId: string;
    courses: Array<IAttendanceBulkChild>;
    isApproved: boolean;

}

export interface IAttendanceBulkChildU {
    courseName: string;
    courseId: string;
    timeSlot: string;
    timeTableId: string;
    attendenceStatusId: string;
    admissionFormId: string;
    attendanceDetailId: string;
    attendanceMasterId: string;
    loggerId: string;
    isApproved: boolean;
    isUpdate: boolean;

}

export interface IReNewConcessionVM {
    admissionFormId: string;
    rollNo: string;
    refferrenceNo: string;
    fullName: string;
    fatherName: string;
    scholarshipCriteriaId: string;
    percentage: number;
    concessionName: string;
    isSelected: boolean;
    admissionType: string;
    continuationPolicy: string;
    isEligible: boolean;
    firstConcession:string;
}

export interface IReNewConcessionVMEx {
    admissionFormId: string;
    rollNo: string;
    refferrenceNo: string;
    fullName: string;
    fatherName: string;
    scholarshipCriteriaId: string;
    percentage: number;
    concessionName: string;
    isSelected: boolean;
    admissionType: string;
    continuationPolicy: string;
    isEligible: boolean;
    classId: string;
}

export interface IScholarshipsVM {
    scholarshipCriteriaId: string;
    campusProgramId: string;
    concessioName: string;
}
export interface IScholarshipsVMEX {
    scholarshipCriteriaId: string;
    campusProgramId: string;
    concessioName: string;
    admissionTypeId: string;
}
export interface ICourseSection {
    sectionCourseLinkId: string;
    sectionName: string;
    campusProgramId: string;
    dayName: string;
    classId: string;
    programCourseLinkId: string;
    sectionId: string;
    courseId: string;
    courseName: string;
}
export interface IAttendanceAttendanceReport {
    attendanceDetailId: string;
    attendenceStatusId: string;
    attendanceStatus: string;
    studentName: string;
    dated: string;
    dayName: string;
    sectionName: string;
    rollNo: string;
    refferenceNo: string;
    campusId: string;
    programDetailId: string;
    sessionId: string;
    shiftId: string;
    statusId: number;
    classId: string;
    courseId: string;
    courseName: string;
    campusName: string;
    description: string;
    programName: string;
    shiftName: string;
    className: string;
    sessionName: string;
    sectionId: string;
    datedParam: string;
}