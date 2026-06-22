import { Time } from "highcharts";


export interface ISeatingPlanDateSheetDetail {
    dateSheetDetailId: string;
    dateSheetDate: Date;
    fromTime: string;
    toTime: string;
    dateSheetId: string;
    statusId: number;
}


export interface IVWDateSheetDetail {
    dateSheetDetailId: string;
    dateSheetId: string;
    campusProgramId: string;
    examName: string;
    campusName: string;
    description: string;
    buildingName: string;
    roomName: string;
    roomBuildingLinkId: string;
    statusId: number;
    campusId: string;
    sessionId: string;
    programDetailId: string;
    dateSheetDate: Date;
    fromTime: Time;
    toTime: Time;
}