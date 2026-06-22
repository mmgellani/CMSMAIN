/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { IAttendanceAttendanceDetail } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'AttendanceAttendanceDetail/';
const BASE_URLex = GlobalConfig.uri.services + "Reports/";

//const BASE_URL2 = GlobalConfig.uri.services + 'Mobile/';


export class AttendanceAttendanceDetailService extends StoreService {
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
    public GetAttendaceData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetMergeAttendaceData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetMergeAttendaceData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetTeacherData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTeacherData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetTeacherMergeAttendaceData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTeacherMergeAttendaceData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public GetAttendaceDataTeacher(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URLex + 'GetAttendaceDataTeacher', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetAttendaceDatas(predicate: string) {
        
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceDatas', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendaceDatasDayOff(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceDatasDayOff', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendaceVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetMergeAttendaceVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetMergeAttendaceVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public CheckDayOff(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckDayOff', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendaceTVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceTVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetMergeTeacherAttendaceVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetMergeTeacherAttendaceVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentLeaveInfo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentLeaveInfo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendaceStruckOFFDatas(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceDatasStruckOFF', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentsOfSection(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentsOfSection', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
    public GetAttendaceTeacher(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceTeacher', { ProvidedString: predicate }))
                    .then((value) => this.processPayload(value))
                    .catch((error) => console.error(error));
    }
    public GetAttendaceVMS(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendaceVMS', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCourseSection(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCourseSection', { ProvidedString: predicate }))
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
    public GetFindByVM() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetFindByVM'))
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

    public AddBulkAttendenceTeacher(entity: any)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'submit_attendance', entity))
        .then((value) => this.processPayload(value))
        .catch((error) => console.error(error));
    }

    public AddMany(entity: Array<any>) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddMany', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public AddBulkAttendance(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddBulkAttendance', { ProvidedString: entity }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public UpdateBulkAttendance(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateBulkAttendance', { ProvidedString: entity }))
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

    public GetAttendanceReportVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceReportVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendanceReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceReport', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendanceReports(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceReports', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAttendanceReportsEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceReportsEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendanceReportsExx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceReportsExx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public  GenerateAttendenceStatusSubjectWise(predicate: string)
    {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendenceStatusSubjectWise', { ProvidedString: predicate }))
        .then((value) => this.processPayload(value))
        .catch((error) => console.error(error));


    }

    public GetAttendanceElReports(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceElReports', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendanceRegister(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceRegister', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendanceSummary(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceSummary', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetDirectlyMarkedAttendanceReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetDirectlyMarkedAttendanceReport', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public TeacherReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + "GetTeacherAttendanceReport", {
          ProvidedString: predicate
        }))
          .then(value => this.processPayload(value))
          .catch(error => console.error(error));
      }
    public GetSubjectWiseReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSubjectWiseReport', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAttendanceReportWithoutCourseVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAttendanceReportWithoutCourseVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public WithoutToDateFromDateVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'WithoutToDateFromDateVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public WithoutToDateFromDateCourseVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'WithoutToDateFromDateCourseVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertLeave(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertLeave', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetLeaveInfo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLeaveInfo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
}