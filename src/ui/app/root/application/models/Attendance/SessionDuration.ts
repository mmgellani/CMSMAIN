export interface ISessionDuration {
    sessionDurationId: string;
    campusProgramId: string;
    classId: string;
    startDate: Date;
    endDate: Date;
    statusId: number;
}

export interface IVWSessionDuration {
    sessionDurationId: string;
    campusProgramId: string;
    classId: string;
    description: string;
    className: string;
    startDate: Date;
    endDate: Date;
    statusId: number;
}