export interface ITimeTableTimeTableVM {
    timeTableId: string;
    sectionCourseLinkId: string;
    staffId: string;
    staffName: string;
    sectionName: string;
    fullName: string;
    roomId: string;
    classId: string;
    dayName: string;
    roomName: string;
    sectionId: string;
    name: string;
    startTime: string;
    endTime: string;
    slotTimingId: string;
    session: string;
    campusName: string;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    description: string;
    statusId: number;
    loggerId: string;
    programCourseLinkId: string;
    courseId: string;
    isBreak: boolean;
}
export interface ITimeTableClose {
    timeTableCloseId: string;
    campusProgramId: string;
    programDetailId: string;
    campusName: string;
    description: string;
    programName: string;
    programId: string;
    shiftId: string;
    shiftName: string;
    mediumName: string;
    isChecked: boolean;
}
export interface ITimeTableTimeTableVMEx {
    timeTableId: string;
    sectionCourseLinkId: string;
    staffId: string;
    staffName: string;
    sectionName: string;
    fullName: string;
    roomId: string;
    classId: string;
    dayName: string;
    roomName: string;
    sectionId: string;
    name: string;
    startTime: string;
    endTime: string;
    slotTimingId: string;
    session: string;
    campusName: string;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    description: string;
    statusId: number;
    loggerId: string;
    programCourseLinkId: string;
    courseId: string;
    isBreak: boolean;
    isDayOff: number;
}

export interface ITimeTableTimeTableTeacher {
    timeTableId: string;
    sectionCourseLinkId: string;
    staffId: string;
    staffName: string;
    sectionName: string;
    fullName: string;
    roomId: string;
    classId: string;
    dayName: string;
    roomName: string;
    sectionId: string;
    name: string;
    startTime: string;
    endTime: string;
    slotTimingId: string;
    session: string;
    campusName: string;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    description: string;
    statusId: number;
    loggerId: string;
    programCourseLinkId: string;
    courseId: string;
    isBreak: boolean;
    userId: number;
    className: string;
    ribbon: number;
    isDayOff: number;
}



export interface ITimeTableTimeTableDayClose {
    timeTableId: string;
    sectionCourseLinkId: string;
    staffId: string;
    staffName: string;
    sectionName: string;
    fullName: string;
    roomId: string;
    classId: string;
    dayName: string;
    roomName: string;
    sectionId: string;
    name: string;
    startTime: string;
    endTime: string;
    slotTimingId: string;
    session: string;
    campusName: string;
    sessionId: string;
    campusId: string;
    programDetailId: string;
    description: string;
    statusId: number;
    loggerId: string;
    programCourseLinkId: string;
    courseId: string;
    isBreak: boolean;
    userId: number;
    className: string;
    ribbon: number;
    isChecked: boolean;
    attendenceMasterId: string;
}
export interface ITimeTableTimeTableDayClose3 {

    sectionCourseLinkId: string;
    sectionName: string;
    sectonId: string;
    campusId: string;
    classId: string;
    className: string;
    programDetailId: string;
    programDetail: string;
    totalLecture: number;
    lecturesApproved: number;
    lecturesUnApproved: number;
    unMarkedLectures: number;
    isBreak: boolean;
    isChecked: boolean;
    isdisabled: boolean;


}


export interface ITimeTableTimeTable {
    timeTableId: string;
    sectionCourseLinkId: string;
    staffId: string;
    roomId: string;
    dayName: string;
    slotTimingId: string;
    statusId: number;
    loggerId: string;
    programCourseLinkId: string;
    isBreak: boolean;
}

export interface ITimeTableReport {
    timeTableId: string;
    sessionId: string;
    campusId: string;
    sectionId: string;
    programDetailId: string;
    campusProgramId: string;
    classId: string;
    staffId: string;
    day: string;
    startTime: string;
    endTime: string;
    period: string;
    class: string;
    room: string;
    staff: string;
    course: string;
    courseId: string;
    sectionName: string;
    description: string;
    campusName: string;
    sessionName: string;
    statusId: number;
    loggerId: string;
}

export interface IVWTeacherTimeTableReport {
    newId: string;
    timeTableId: string;
    staffId: string;
    staffName: string;
    sessionId: string;
    sessionName: string;
    campusId: string;
    campusName: string;
    programDetailId: string;
    description: string;
    detail: string;
    classId: string;
    className: string;
    shiftId: string;
    shiftName: string;
    mediumId: string;
    mediumName: string;
    courseId: string;
    courseName: string;
    roomId: string;
    roomName: string;
    dayName: string;
    startEndTime: string;
    slotTimingId: string;
    lectureNo: string;
    userId: number;
    sectionId: string;
    sectionName: string;
}

export interface dayofweek {
    dayId: number;
    dayName: string;
    isChecked: boolean;
    slotId: string;
}
export interface SectionIncharge {
    ide: string;
    fullName: string;
    email: string;
    isChecked: boolean;
}
export interface GetResponse {

    ReturnValue: string;
}

export interface TimeTableDailyAttendanceStatus {

    staffId: string;
    teacherName: string;
    email: string;
    contactNo:string;
    totalLecture: number;
    lecturesMarked: number;
    lecturesUnMarked: number;
    totalApproved: number;
    onTime: number;
    offTime: number;
    isChecked: boolean;

}

export interface TimeTableDailyAttendanceDetailmodel {
    newID :string
    staffId: string;
    sectionName: string;
    sectionId: string;
    startTime: string;
    endTime: string;
    courseName: string;
    programDetail: string;
    progamDeatilId: string;
    class: string;
    classid: string;
    location: string;
    status: string;
    

}
