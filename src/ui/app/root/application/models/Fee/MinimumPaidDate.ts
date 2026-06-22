export interface IMinimumPaidDate {
    minimumPaidDateId: string;
    subCityId: string;
    minDays: number;
    statusId: number;
}

export  interface IMinimumPaidDateVM {
    minimumPaidDateId: string;
    subCityId: string;
    cityId: string;
    city: string;
    subCity: string;
    minDays: number;
    statusId: number;
}