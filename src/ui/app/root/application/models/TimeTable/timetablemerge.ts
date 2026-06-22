export interface ITimeTableTimeTableMerge {
    mergeTimeTableId: string;
    timeTableId: string[];
    fromDate: string;
    toDate: string;
    statusId: number;
    fullName: string;

}

export interface ITimeTableVWTimeTableMerge {
    timeTableId: string;
    sectionCourseLinkId: string;
    staffId: string;
    roomId: string;
    dayName: string;
    slotTimingId: string;
    statusId: number;
    loggerId: string;
    roomName: string;
    name: string;
    startTime: string;
    endTime: string;
    staffName: string;
    campusName: string;
    campusId: string;
    description: string;
    programDetailId: string;
    sessionId: string;
    session: string;
    sectionId: string;
    classId: string;
    fullName: string;
    sectionName: string;
    programCourseLinkId: string;
    courseId: string;
    isBreak: boolean;
}