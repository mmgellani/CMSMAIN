export interface IHolidays {
    holidayId: string;
    holidayTypeId: string;
    description: string;
    statusId: number;
    dates: Date;
}

export interface HolidaysVM {
    holidayId: string;
    holiday: string;
    description: string;
    statusId: number;
    holidayTypeId: string;
    dated: string;
    holidayType: string;
}