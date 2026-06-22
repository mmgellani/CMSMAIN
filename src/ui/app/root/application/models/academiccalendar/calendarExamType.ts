export interface ICalendarExamType {
    calendarExamTypeId: string;
    name: string;
    academicCalendarMasterId: string;
    courseId: string;
    fromDate: Date;
    toDate: Date;
    statusId: number;
    topicIds:string;
}