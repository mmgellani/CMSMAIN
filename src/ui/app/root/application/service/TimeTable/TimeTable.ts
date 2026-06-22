/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { ITimeTableTimeTable } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'TimeTableTimeTable/';

export class TimeTableTimeTableService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    //ading
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

    public CheckClash(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckClash', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertBulkDayOff(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertBulkDayOff', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetTimetablebyroom(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTimetablebyroom', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetTimeTableViaSession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTimeTableViaSession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertTimeTableClosedData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertTimeTableClosedData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetTimeTableCloseData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTimeTableCloseData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetBulkDayoffUnHeld(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBulkDayoffUnHeld', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetBulkDayoffUnHeldForAllSection(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBulkDayoffUnHeldForAllSection', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetRemoveDayOFFUnheldData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetRemoveDayOFFUnheldData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetTimeTableMerge(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTimeTableMerge', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetTimeTableMergeEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTimeTableMergeEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetMergeTimeTableData(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetMergeTimeTableData', { ProvidedString: predicate }))
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
    public GetCourceVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCourceVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCoursesVM(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCoursesVM', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCourse(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCourse', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetTimeTableData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTimeTableData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetTeacherTimeTableReport(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetTeacherTimeTableReport', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetUserTimeTableData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetUserTimeTableData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetUserTimeTableRib(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetUserTimeTableRib', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetUserDayClose(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetUserDayClose', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertDayClose(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertDayClose', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetCourceVMD(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCourceVMD', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCourceVMDEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCourceVMDEx', { ProvidedString: predicate }))
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
    public UpdateEx(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateEx', entity))
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

    public InsertMergeTimeTable(predicate: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertMergeTimeTable', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertAcademicCalendar(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertAcademicCalendar', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAcademicCalendar(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAcademicCalendar', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    GetSectionincharge(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetSectionincharge', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }
    GetSectionData(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetSectionData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }
    InsertSectionIncharge(predicate: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'InsertSectionIncharge', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }
    DeleteSectionInchargeData(predicate: string) {


        return this.exec<any>(Axios.post(BASE_URL + 'DeleteSectionInchargeData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));


    }
    public RemoveBulkDayOff(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'RemoveBulkDayOff', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetDailyAttendanceStatus(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetDailyAttendanceStatus', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetDailyAttendanceTeacherDeatail(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetDailyAttendanceTeacherDeatail', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

}
