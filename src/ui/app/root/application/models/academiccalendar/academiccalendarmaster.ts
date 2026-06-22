export interface IAcademicCalendarMaster {
    academicCalendarMasterId: string;
    sessionId: string;
    subCityId: string;
    classId: string;
    boardId?: string;
    fullName: string;
    fromDate: Date;
    toDate: Date;
    weeks: number;
    statusId: number;
    isApproved: Boolean;
}

export interface IAcademicCalendarMasterCity {
    academicCalendarMasterId: string;
    sessionId: string;
    subCityId: string;
    classId: string;
    boardId?: string;
    fullName: string;
    fromDate: Date;
    toDate: Date;
    weeks: number;
    statusId: number;
    isApproved: Boolean;
    subCity: string;
}