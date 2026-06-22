/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { GlobalConfig } from '../../../../common';
import { IHumanResourceStaff } from '../../models';
import { Store } from 'vuex';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'HumanResourceStaff/';
const BASE_URL2 = GlobalConfig.uri.services + 'LevelDefinition/';
const BASE_URL3 = GlobalConfig.uri.services + 'SetupCampusProgramLink/';
const BASE_URL4 = GlobalConfig.uri.services + 'LevelProgramClassMap/';

export class HumanResourceStaffService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetEvaluationMaster() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetEvaluationData'))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetFindByVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindByVM', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetTeacherProfile(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTeacherProfile', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
      public GetStaffByCampus(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStaffByCampus', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetStaffCourseDepVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStaffCourseDepVM', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetEvaluationDetail(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetEvalutionDetail', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public ChangePassword(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ChangePassword', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public UpMicroPass(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpMicroPass', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetAllVM(key:number) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVM',{ProvidedString:key}))
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

    
    public CheckTeacherexist(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckTeacherExist', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetFindBy(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetFindByLevel(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'GetFindBy', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetProgramDetail(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL3 + 'AssesmentProgDetailByProgram', { text: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetClassName(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL3 + 'GetClassName', { text: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    
    public GetAssessmentNames(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL3 + 'GetAssessmentNames', { text: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetAssessmentSections(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL3 + 'GetAssessmentSections', { text: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetStaff(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStaff', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public GetFindByAsync(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindByAsync', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }

    public AddOne(entity: any) {
        
        return this.exec<any>(Axios.post(BASE_URL + 'AddOne',  { ProvidedString: entity }))
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
    GetStaffHODData(predicate:string)
    {
        
            return this.exec<any>(Axios.post(BASE_URL + 'GetStaffHODData', { ProvidedString: predicate }))
                        .then((value) => this.processPayload(value))
                        .catch((error) => console.error(error));
        

    }

    GetHODData(predicate:string)
    {
        
            return this.exec<any>(Axios.post(BASE_URL + 'GetHODData', { ProvidedString: predicate }))
                        .then((value) => this.processPayload(value))
                        .catch((error) => console.error(error));
        

    }
    GetHODDataEx(predicate:string)
    {
        
            return this.exec<any>(Axios.post(BASE_URL + 'GetHODDataEx', { ProvidedString: predicate }))
                        .then((value) => this.processPayload(value))
                        .catch((error) => console.error(error));
        

    }
    InsertStaffHODData(predicate:string)
    {
        
            return this.exec<any>(Axios.post(BASE_URL + 'InsertStaffHODData', { ProvidedString: predicate }))
                        .then((value) => this.processPayload(value))
                        .catch((error) => console.error(error));
        

    }
    InsertTeacherEvaluation(predicate:string)
    {
        
            return this.exec<any>(Axios.post(BASE_URL + 'InsertEvaluationData', { ProvidedString: predicate }))
                        .then((value) => this.processPayload(value))
                        .catch((error) => console.error(error));
        

    }
    deleteTeacherEvaluation(predicate:string)
    {
        
            return this.exec<any>(Axios.post(BASE_URL + 'DeleteTeacherEvaluation', { ProvidedString: predicate }))
                        .then((value) => this.processPayload(value))
                        .catch((error) => console.error(error));
        

    }
    DeleteHODData(predicate:string)
    {


        
        
            return this.exec<any>(Axios.post(BASE_URL + 'DeleteStaffHODData', { ProvidedString: predicate }))
                        .then((value) => this.processPayload(value))
                        .catch((error) => console.error(error));
        

    }
}