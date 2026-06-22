export interface HolidayType {
    holidayTypeId: string;
    name: string;
    description: string;
    statusId: number;
    isRecursive:boolean;
}
export  interface AcademicCalendarVM {
    holidayDetailId: string;
    calendarName: string;
    description: string;
    dates: string;
    holidayType: string;
    myProperty: number;
    session: string;
    fullName: string;
} 