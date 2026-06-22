export interface IGeneral {
    fullName: string;
};

export interface IComparisonData {
    id: string;
    session: number
    shift: string;
    total: number
};

export interface IAverageDashboard {
    admissionAverageId: string;
    session: number;
    possession: string;
    totalCampus: number;
    average: number;
};

export interface IAverageDashboardEx {
    admissionAverageId: string;
    session: number;
    possession: string;
    totalCampus: number;
    average: number;
    totaladmission: number;
};