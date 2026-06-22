/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { IAttendanceAttendenceStatus } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'AttendanceAttendenceStatus/';

export class AttendanceAttendenceStatusService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAllAsync() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAllAsync'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetSingle(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSingle', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetSingleAsync(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSingleAsync', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindBy(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindByAsync(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindByAsync', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddOne(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddOne', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddOneAsync(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddOneAsync', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddMany(entity: Array<any>) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddMany', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddManyAsync(entity: Array<any>) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddManyAsync', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public Update(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'Update', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public UpdateAsync(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateAsync', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public Delete(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'Delete', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public DeleteAsync(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'DeleteAsync', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public DeleteWhere(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'DeleteWhere', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public DeleteWhereAsync(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'DeleteWhereAsync', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAttendenceDashboardData(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendenceDashboardData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAttendenceDashboardData2(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendenceDashboardData2', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAttendenceDashboardData2CityWise(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendenceDashboardData2CityWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAttendenceDashboardData2LastMonth(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendenceDashboardData2LastMonth', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetConcessionDashboardData(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessionDashboardData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetConcessionDashboardDataEx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessionDashboardDataEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ConcessionDrillDownClassEx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'ConcessionDrillDownClassEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ConcessionDrillDownInsatlEx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'ConcessionDrillDownInsatlEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetRevenueDashboardData(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetRevenueDashboardData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetRevenueDashboardDataFx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetRevenueDashboardDataFx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetConcessionDashboardDataFx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessionDashboardDataFx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetConcessionDashboardDataFxCity(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessionDashboardDataFxCity', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    
    public GetRevenueDashboardDataEx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetRevenueDashboardDataEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    


    public GetConcessionDashboardDataExx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessionDashboardDataExx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ConcessionDrillDownWithExemptionExx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'ConcessionDrillDownWithExemptionExx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ConcessionDrillDownLevelEx(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'ConcessionDrillDownLevelEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendenceStudentList(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendenceStudentList', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetDeviceInfo(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetDeviceInfo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

}