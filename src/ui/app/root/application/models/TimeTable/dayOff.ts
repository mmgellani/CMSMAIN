export interface IDayOff {
    dayOffId: string;
    timeTableId: string;
    fromDate: Date;
    toDate: Date;
    statusId: number;
}
export interface IDayOffVM {
    dayOffId: string;
    timeTableId: string;
    fromDate: Date;
    toDate: Date;
    statusId: number;
    fullName:string;
}