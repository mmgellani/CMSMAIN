export interface IAttendanceLeaves {
    leaveId: string;
    admissionFormId: string;
    fromDate: Date;
    toDate: Date;
    isPartial: boolean;
    programCourseLinkId: string;
    isApproved: boolean;
    information: string;
}
export interface LeaveInfo {
    leaveId: string;
    admissionFormId: string;
    fromDate: string;
    toDate: string;
    isPartial: boolean;
    programCourseLinkId: string;
    isApproved: boolean;
    information: string;
    fullName: string;
}

