export interface IAcademicCalendarNew {
    academicCalendarId: string;
    academicCalendarTypeId: string;
    topicId: string;
    fromDate: Date;
    toDate: Date;
    description: string;
    holidayTypeId: string;
    academicCalendarMasterId:string;
}

export interface IAcademicCalendarViewNew {


    academicCalendarId: string;
    calendarName: string;
    subCity: string;
    topic: string;
    topicId?: string;
    courseId?: string;
    chapterId?: string;
    boardId?: string;
    holidayTypeId?: string;
    academicCalendarTypeId?: string;
    course: string;
    chapter: string;
    session: string;
    board: string;
    class: string;
    holidayType: string;
    fromDate: string;
    toDate: string;
    academicCalendarMasterId:string;
}