/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { ISetupMedium } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'NotificationSenderClass/';

export class notificationService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
   

    public pushNotification(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'Post', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public pushNotificationHadaf(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'PostHadaf', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

}