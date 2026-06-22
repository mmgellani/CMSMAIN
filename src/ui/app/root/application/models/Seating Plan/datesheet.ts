export interface ISeatingPlanDateSheet {
    dateSheetId: string;
    campusProgramId: string;
    examName: string;
    roomBuildingLinkId: string;
    statusId: number;
}

export interface SeatingPlanDateSheetVM {
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
}