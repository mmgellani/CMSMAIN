export interface IEvents {
    eventId: string;
    holidayTypeId: string;
    academicCalendarMasterId: string;
    description: string;
    statusId: number;
    fromDate: Date;
    toDate: Date;
}

export interface IEventsVW {
    eventId: string;
    holidayTypeId: string;
    academicCalendarMasterId: string;
    description: string;
    statusId: number;
    fromDate: string;
    toDate: string;
    holidayType: string;
}