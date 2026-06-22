/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { ITransportationRouteStudentLink } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'TransportationRouteStudentLink/';

export class TransportationRouteStudentLinkService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetAllVM(key:string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVM',{providedString:key}))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetStudentsOfSubCity(key:string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsOfSubCity',{providedString:key}))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetStudentsOfCampus(key:string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsOfCampus',{providedString:key}))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetRouteStudent(key:string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetRouteStudent',{providedString:key}))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetRouteStudentList(key:string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetRouteStudentList',{providedString:key}))
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
    public AddBulk(key:string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddBulk',{providedString:key}))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    // public AddBulk(entity: any) {
    //     return this.exec<any>(Axios.post(BASE_URL + 'AddBulk', entity))
    //                 .then((value) => this.processPayload(value))
    //                 .catch((error) => console.error(error));
    // }

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
}