/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { GlobalConfig } from '../../../../common';
import { ISetupCampus } from '../../models';
import { Store } from 'vuex';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'SetupCampus/';
const BASE_URL2 = GlobalConfig.uri.services + 'AssessmentSchemeMaster/';
const BASE_URL3 = GlobalConfig.uri.services + 'AssessmentSchedulingDetail/';
const BASE_URL4 = GlobalConfig.uri.services + 'AssessmentSectionMap/';

export class SetupCampusService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
  
    public GetCityVM() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetCityVM'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    
    public GetHadafCityVM() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetHadafCityVM'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetStepCityVM() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetStepCityVM'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetAllowUser() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAllowUser'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetCityVMByZone(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityVMByZone', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetCampusCustomize(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCustomizeCampus', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetAssessmentScheme(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'GetFindBy', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetAssessment(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL3 + 'GetFindBy', { ProvidedString: predicate }))
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
    public GetCampusAgainstCity(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCampusAgainstCity', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetCampusAgainstSubCity(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCampusAgainstSubCity', { ProvidedString: predicate }))
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

    public GetAssessmentOnClass(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL4 + 'GetAllAssessmentOnClass', { text: predicate }))
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

      public BulkCopyProgramDetail(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'BulkCopyProgramDetail', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
}