import { IMessage, ISms, ISmsApproval, ITemplates } from '../../models/Message/message';

import { default as Axios } from 'axios';
import { GlobalConfig } from '../../../../common';
import { Store } from 'vuex';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'Message/';

export class MessageService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    // public SendSms(model: IMessage) {
    //     return this.exec<any>(Axios.post(BASE_URL + 'SendSms', model))
    //                 .then((value) => this.processPayload(value))
    //                 .catch((error) => console.error(error));
    // }
    public AddOne(model: ISmsApproval) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddOne', model))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public Add(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'Add', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFilteredSmsNumbers(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFilteredSmsNumbers', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public SmsApproval(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSmsApproval', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetSmsMask(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSmsMask', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public UnApproveNotification(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UnApproveNotification', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public UpLoadFileEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpLoadFileEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetSmsReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSmsReport', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetNotificationReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetNotificationReport', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetSmsDeliveryReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSmsDeliveryReport', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertSmsBulk(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertSmsBulk', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public Approve(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'Approve', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public UnApprove(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UnApprove', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public Save(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'Save', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllVM() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAllVM'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindByVM() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetFindByVM'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddOneVM(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddOneVM', model))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public Update(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'Update', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public SendTemplateMsg(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'SendTemplateMsg', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public SendMsgWithoutTemplate(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'SendMsgWithoutTemplate', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public SendNotification(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'BulkNotification', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public BulkNotificationSelection(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'BulkNotificationSelection', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public BulkNotificationSelectionEx(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'BulkNotificationSelectionEx', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public BulkUpdateNotificationSelection(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'BulkUpdateNotificationSelection', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetNotificationSelection(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetNotificationSelection', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetNotificationSelectionEx(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetNotificationSelectionEx', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public BulkNotificationSelectionList(model: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'BulkNotificationSelectionList', { ProvidedString: model }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public NotificationSave(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'NotificationSave', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public NotificationApprove(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'NotificationApprove', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetNotificationSelectionSend(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetNotificationSelectionSend', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsContactExx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsContactExx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsContact(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsContact', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsContactEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsContactEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public SendResetMessage(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'SendResetMessage', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public ssatStudentData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ssatStudentData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    
}