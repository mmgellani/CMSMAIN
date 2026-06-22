import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { ISetupCampusProgramLink } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'SetupCampusProgramLink/';

export class SetupCampusProgramLinkService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAllPrograms() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAllPrograms'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetCampusProgramData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetCampusProgramData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public ProgDetailByProgram(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ProgDetailByProgram', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public ProgDetailByMultipleProgram(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ProgDetailByMultipleProgram', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetAllVMData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAllVMData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAllVM(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVM', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllVMAdmission(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVMAdmission', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    } 
    public GetAllVMEx2(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVMEx2', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllVMEx(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVMEx', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCityProgram(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityProgram', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetLevelProgram(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLevelProgram', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetLevel(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLevel', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetLevelProgramDetail(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLevelProgramDetail', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllVMActive(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVMActive', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAllActive(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllActive', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetAllVMActiveOrdeByCampus(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVMActiveOrdeByCampus', { text: param }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllByZoneId(param: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllByZoneId', { text: param }))
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

    public AddBulk(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddBulk', { ProvidedString: predicate }))
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
}