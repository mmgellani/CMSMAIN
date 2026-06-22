export interface ISetupCampusProgramLink {
	campusProgramId : string;
	campusId : string;
	programDetailId : string;
	statusId : number;
	loggerId : string;
	sessionId : string;

}

export interface ISetupCampusProgramLinkVM {
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    statusId: number;
    loggerId: string;
    sessionId: string;
    description: string;
}

export interface ISetupCampusProgramVM {
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    statusId: number;
    loggerId: string;
    sessionId: string;
    description: string;
    campusName: string;
    programName: string;
    programId: string;
    shiftId:string;
    shiftName:string;
}
export interface ISetupCampusProgramVMEx {
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    statusId: number;
    loggerId: string;
    sessionId: string;
    description: string;
    campusName: string;
    programName: string;
    programId: string;
    shiftId:string;
    shiftName:string;
    isChecked : boolean;
}
export interface ISetupCampusProgramVMEX {
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    statusId: number;
    loggerId: string;
    sessionId: string;
    description: string;
    campusName: string;
    programName: string;
    programId: string;
    shiftId:string;
    shiftName:string;
}
export interface VWCampusProgramCity {
    programDetailId: string;
    description: string;
    programName: string;
    programId: string;
    cityId: string;
}

export interface VWCampusProgramLevel {
    programDetailId: string;
    description: string;
    programName: string;
    programId: string;
}

export interface VWProgramLevel {
    programId: string;
    programName: string;
}
export interface CampusProgramZoneVM {
    campusProgramId?: string;
    campusId?: string;
    programDetailId?: string;
    statusId?: number;
    loggerId?: string;
    sessionId?: string;
    description: string;
    campusName: string;
    programName: string;
    programId?: string;
    shiftId?: string;
    shiftName: string;
    zoneId?: string;
    zoneName: string;
}

export interface ISetupCampusProgramVMCB {
    campusProgramId: string;
    campusId: string;
    programDetailId: string;
    statusId: number;
    loggerId: string;
    sessionId: string;
    description: string;
    campusName: string;
    programName: string;
    programId: string;
    shiftId:string;
    shiftName:string;
    isChecked:boolean;
}

export interface CampusProgramData {
    campusProgramId: string;
    statusId: number;
    session: string;
    campus: string;
    description: string;
}

export interface BatchData {
    batchId: string;
    fullName:string;
    statusId: number;
}