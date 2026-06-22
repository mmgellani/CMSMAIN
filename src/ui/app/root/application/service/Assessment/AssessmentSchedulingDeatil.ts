/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { IExaminationExamType } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'AssessmentSchedulingDetail/';

export class AssessmentSchedulingDeatilService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public AssessmentSchedulingList() {
        return this.exec<any>(Axios.get(BASE_URL + 'AssessmentSchedulingList'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public AssessmentSchedulingListData() {
        return this.exec<any>(Axios.get(BASE_URL + 'AssessmentSchedulingListData'))
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

    public GetStudentResultCard(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentResultCard', { ProvidedString: predicate }))
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
    public UpdateExamData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateExamData', { ProvidedString: predicate }))
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

    public AssessmentSchedulingData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AssessmentSchedulingData', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public EditAssessmentSchedulingData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'EditAssessmentSchedulingData', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    } 
    public AddAssessmentSchedulingData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddAssessmentSchedulingData', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public UpdateAssessmentSchedulingData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateAssessmentSchedulingData', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public DeleteAssessmentSchedulingData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'DeleteAssessmentSchedulingData', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public MonthList() {
        return this.exec<any>(Axios.get(BASE_URL + 'MonthList'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
}