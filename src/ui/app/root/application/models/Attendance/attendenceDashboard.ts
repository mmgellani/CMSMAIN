export interface IAttendenceDashboard {
    pId: string;
    id: string;
    displayName: string;
    className: string;
    scheduled: number;
    held: number;
    approved: number;
    unApproved: number;
    nextModel: string;
    percentage: number;
}

export interface IAttendenceDashboard2 {
    pId: string;
    scheduled: number;
    held: number;
    approved: number;
    unApproved: number;
    percentage: number;
}

export interface IAttendanceDashboard2LastMonths {
    pId: string;
    held: number;
    approved: number;
    unApproved: number;
    dated: string;
}

export interface IAttendanceDashboard2LastMonthsEx {
    pId: string;
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
    dated: string;
}

export interface IAttendanceDashboard2CityWise {
    pId: string;
    percentage: number;
    cityName: string;
}
export interface IConcessionDashboard {
    pId: string;
    id: string;
    displayName: string;
    className: string;
    students: number;
    challan: number;
    actualAmount: number;
    paidAmount: number;
    discountAmount: number;
    nextModel: string;
}

export interface ConcessionDashboardEx {
    pId: string;
    id: string;
    displayName: string;
    className: string;
    students: number;
    challan: number;
    actualAmount: number;
    paidAmount: number;
    discountAmount: number;
}
export interface IRevenueDashboard {
    pId: string;
    students: number;
    revenue: number;
    averagePrStd: number;
    city: string;
    cityId: string;
    sessionId: string;
    zoneName: string;
}

export interface StudntListEx {
    admissionFormId: string;
    rollNo: string;
    fullName: string;
    status: string;
}