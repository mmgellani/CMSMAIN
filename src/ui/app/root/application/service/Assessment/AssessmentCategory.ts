/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'AssessmentCategory/';
const BASE_URL2 = GlobalConfig.uri.services + 'AssessmentSchedule/';

export class AssessmentCategoryService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }

    public ParamsDashboard(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ParamsDashboard', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindBy(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAssessmentListVie(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'GetAssessmentListView', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AverageDashboard(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AverageDashboard', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddOne(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddOne', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public Update(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'Update', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
}