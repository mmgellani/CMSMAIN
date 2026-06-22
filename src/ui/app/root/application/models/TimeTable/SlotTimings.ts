export interface ITimeTableSlotTimings {
    slotTimingId: string;
    slotId: string;
    fullName: string;
    startTime: string;
    endTime: string;
    statusId: number;
    loggerId: string;

}
export interface ITimeTableVWSlotTimings {
    slotTimingId: string;
    slotId: string;
    fullName: string;
    startTime: string;
    endTime: string;
    statusId: number;
    loggerId: string;
}

export interface ITimeTableSlotTimingsVM {
    slotTimingId: string;
    slotId: string;
    fullName: string;
    startTime: string;
    endTime: string;
    statusId: number;
    loggerId: string;
    campusStartTime: string;
    campusEndTime: string;
    name: string;
}