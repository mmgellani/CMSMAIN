import { IMessage, ISms, ITemplates } from '../../models/Message/message';

import { default as Axios } from 'axios';
import { GlobalConfig } from '../../../../common';
import { Store } from 'vuex';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'Migration/';

export class MigrationService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }

    public GetHadafTransfer() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetHadafTransfer'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAccessToken(entity:any)
    {
        return this.exec<any>(Axios.post('https://login.microsoftonline.com/12b221b3-0464-4223-89e5-888835778b58/oauth2/v2.0/token', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));

    }

    public GetCmsTransfer() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetCmsTransfer'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddManyStudents(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddManyStudents', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCmsSections(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCmsSections', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertElData(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'InsertElData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }
    public UpdateElData(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateUserData', entity))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public InsertElXData(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertUserData', entity))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetElUpdatedData(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetUserData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }

    public DeleteStudentEnrooll(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'DeleteStdEnrooll', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }
    public UpdateMicrosoftPas(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'UpdateUserPassword', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }

    public CreateMicrosoftUser(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'CreateMicrosoftUser', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }

    public GetCmsData(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCmsData', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetHadafData(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetHadafData', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertHadafList(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertHadafList', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertCmsList(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertCmsList', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
}