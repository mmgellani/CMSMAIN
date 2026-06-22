/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { IAdmissionStudents } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'AdmissionStudents/';
const BASE_URL2 = GlobalConfig.uri.services + 'OnlineAdmission/';


export class AdmissionStudentsService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentFeeInfo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentFeeInfo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentPreAcademic(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentPreAcademic', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAcademicMarks(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAcademicMarks', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetPreAcademicDegreeWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetPreAcademicDegreeWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetProgramCourse() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetProgramCourse'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsetPreAcademicInfo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsetPreAcademicInfo', { ProvidedString: predicate }))
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
    public ReverseConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ReverseConcession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'checkAdmission', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionDataEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'checkAdmissionEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionPaidDateEnable(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'GetAdmissionPaidDateEnable', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public GetStudentPassword(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'StudentPassword', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddMessage(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'AddMessage', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetFindBy(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetStudentChallanInfo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentChallanInfo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentChallanInfoUnpaid(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentChallanInfoUnpaid', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentChallanPaidInfo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentChallanPaidInfo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentTransferRecord(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentTransferRecord', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetTransferMigratedRecord(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTransferMigratedRecord', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetMessageCount(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetMessageCount', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetMessageDetail(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetMessageDetail', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public GetStudentMigratedRec(predicate: string) {
       
        return this.exec<any>(Axios.post(BASE_URL + 'GetMigratedRecord', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindByVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindByVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsDetails(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsDetails', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsDetailsC(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsDetailsC', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentsExamUpd(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsExamUpd', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsExamUpdES(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsExamUpdES', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentsExamUpdESNew(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsExamUpdESNew', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }



    public GetStudentsSectionDetails(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsSectionDetails', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetLeaveStudentsSectionWise(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetLeaveStudentsSectionWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentDetails(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentDetails', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentsByRollNo(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsByRollNo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindByAsync(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindByAsync', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertStudentAttachment(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertStudentAttachment', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

      public GetStudentAttachments(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentAttachments', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


       public DeleteStudentAttachments(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'DeleteStudentAttachments', { ProvidedString: predicate }))
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