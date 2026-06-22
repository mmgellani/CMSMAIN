/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { IFeeConcessionDetail } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'FeeConcessionDetail/';

export class FeeConcessionDetailService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ApplyBulkConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ApplyBulkConcession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ApplyConcessionBulkViaInstallmentNew(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ApplyConcessionBulkViaInstallmentNew', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ApplySubInstallmentBulkPre(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ApplySubInstallmentBulkPre', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public AddBulkConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddBulkConcession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public AddBulkConcessionEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddBulkConcessionEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ReNewConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ReNewConcession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
     public ReNewConcessionForConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ReNewConcessionforConcessionRules', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ReNewConcessionEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ReNewConcessionEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public AttendancePercentage(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AttendancePercentage', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AttendancePercentageEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AttendancePercentageEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetScholarships(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetScholarships', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ReNewConcessionBulk(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ReNewConcessionBulk', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public AddBulkScholarshipCriteria(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddBulkScholarshipCriteria', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetConcession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllAsync() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAllAsync'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
public getAllConcessionContinutionRules() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAllConceccionRules'))
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
    public GetFindByVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindByVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudents(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudents', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentsPre(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsPre', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public UpdateSection(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateSection', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentSingle(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentSingle', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public StudentByRef(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'StudentByRef', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetBulkData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBulkData', { ProvidedString: predicate }))
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

    public AddManyStudents(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddManyStudents', { ProvidedString: predicate }))
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