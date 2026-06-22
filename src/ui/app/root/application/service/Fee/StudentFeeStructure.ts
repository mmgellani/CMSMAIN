/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { IFeeStudentFeeStructure } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'FeeStudentFeeStructure/';

export class FeeStudentFeeStructureService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
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

    public GetFindBy(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetAllFilterData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllFilterData', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public SearchStudent(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'SearchStudent', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public ProgramTransfer(predicate: string) {
        
        return this.exec<any>(Axios.post(BASE_URL + 'ProgramTransfer', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public ProgramTransferWithAlreadyPaid(predicate: string) {
        
        return this.exec<any>(Axios.post(BASE_URL + 'ProgramTransferWithPaidBookUnBind', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public ProgramTransferWithAlreadyPaidBulk(predicate: string) {
        
        return this.exec<any>(Axios.post(BASE_URL + 'ProgramTransferWithPaidBulk', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public ProgramTransfernew(predicate: string) {
        
        return this.exec<any>(Axios.post(BASE_URL + 'ProgramTransferWithPaidEX', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public StateChange(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'StateChange', { ProvidedString: predicate }))
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
    public StudentCreditNotes(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'StudentCreditNotes', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public UpdatePaidDateCreditNotes(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdatePaidDateCreditNotes', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public InstallmentNos(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InstallmentNos', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public LoadSections(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'LoadSections', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetScholarships(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetScholarships', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetScholarshipsEX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetScholarshipsEX', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentDataApplyConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentDataApplyConcession', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public ConcessionAppliedOnInstallment(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ConcessionAppliedOnInstallment', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public AttendancecutoffDate(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AttendancecutoffDate', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetConcessionReversalStudents(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessionReversalStudents', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetStudentDataApplyConcessionEX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentDataApplyConcessionEX', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public UpdateConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateConcession', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetFeeHeadId() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAdhocFeeHead'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdhocChallanList(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAdhocChallanList', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
      public AddAdhocChallan(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'GenerateAdhocChallanEx', entity))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public UpdateAdhocChallan(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateAdhocChallanDate', entity))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
}