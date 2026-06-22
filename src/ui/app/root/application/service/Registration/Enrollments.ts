/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { GlobalConfig } from '../../../../common';
import { IRegistrationEnrollments } from '../../models';
import { Store } from 'vuex';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'RegistrationEnrollments/';

export class RegistrationEnrollmentsService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }

    public Getprofile(rolno:string) {
        return this.exec<any>(Axios.post(BASE_URL + 'Reports/StudentResetMicrosoftPassword' , { rolno }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
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
    public ChecnkEnrolledStudent(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckEnrolledStudentExist', { ProvidedString: predicate }))
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
    public GetStudentEnrollData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetStudentEnrollData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentsToEnroll(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsToEnroll', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentsToBatchEnroll(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsToBatchEnroll', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsByEnrollment(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsByEnrollment', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public UpdateScetion(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateScetion', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public UpdateScetionBulk(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateScetionBulk', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsToEnrollWithoutPaid(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsToEnrollWithoutPaid', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetEnrolledStudent(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetEnrolledStudent', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetEnrolledStudentVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetEnrolledStudentVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentPromotionList(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentPromotionList', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
       public GetStudentBulckTransferList(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentBulckTransferList', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentPromotionPreList(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentPromotionPreList', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public ReverseEnrollment(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ReverseEnrollment', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetSectionList(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSectionList', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsBySection(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsBySection', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertBulkEnrolment(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertBulkEnrolment', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertBulkEnrolmentWithUserCreation(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertBulkEnrolmentWithUserCreation', { ProvidedString: predicate }))
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

    public InsertClassPromotion(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertClassPromotion', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertClassPromotionEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertClassPromotionEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public TransferBulckCampus(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertTransferBulckCampus', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertClassPrePromotion(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertClassPrePromotion', { ProvidedString: predicate }))
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