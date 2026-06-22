/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'Comparison/';

export class ComparisonService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }

    public ParamsDashboard(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ParamsDashboard', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AverageDashboard(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AverageDashboard', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AverageDashboardEx() {
        return this.exec<any>(Axios.get(BASE_URL + 'AdmissionAverageEx'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
}