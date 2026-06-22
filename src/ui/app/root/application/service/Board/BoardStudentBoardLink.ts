/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'BoardStudentBoardLink/';

export class BoardStudentBoardLinkService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
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
    // public GetFindByVM(predicate: string) {
    //     return this.exec<any>(Axios.post(BASE_URL + 'GetFindByVM', { ProvidedString: predicate }))
    //         .then((value) => this.processPayload(value))
    //         .catch((error) => console.error(error));
    // }
    public AddOne(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddOne', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetBoardFee(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBoardFee', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    
    public InsertStudentBoardLink(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'insertStudentBoardLink', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertStudentRegistration(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertStudentRegistration', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertUniversityExamEntry(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertUniversityExamEntry', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public InsertBoardUniversityRollNo(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertBoardUniversityRollNo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertBoardUniversityResultCard(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertBoardUniversityResultCard', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public UpdateStudentBoardLink(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateStudentBoardLink', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public DeleteRegistrationNo(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'DeleteRegistrationNo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public DeleteStudentBoardExamEntry(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'DeleteBoardExamEntry', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentBoardLink(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentBoardLink', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public BoardUniversityResultCard(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBoardUniversityResultCard', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentBoardRegistration(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentBoardRegistration', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentBoardUniversityExam(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentBoardExamUniversity', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentBoardRegistrationEx(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentBoardRegistrationEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetBoardUniversityExamEx(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBoardUniversityExamEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetBoardUniversityRollData(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentBoardUniRollData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetBoardUniversityRollList(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBoardUniversityRollno', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetBoardUniversityRollListEx(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBoardUniversityRollnoEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetBoardUniversitySearch(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBoardUniversitySearch', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    

    public GetStudentList(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentListEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public BoardFeePaidStudent(predicate:string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'BoardFeePaidStudent', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    

    public GetFindByAsync(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindByAsync', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddOneAsync(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddOneAsync', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddMany(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddMany', { ProvidedString: predicate }))
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
    
    public UpdateExamEntry(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateExamEntry', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    UpdateboardRollNoslip(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateBoardRollNoSlip', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    UpdateboardUniResultCard(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateBoardUniResultCard', entity))
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