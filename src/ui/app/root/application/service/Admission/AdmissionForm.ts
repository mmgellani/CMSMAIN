/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { GlobalConfig } from '../../../../common';
import { IAdmissionAdmissionForm } from '../../models';
import { Store } from 'vuex';
import { StoreService } from '../../../../store';

const BASE_URL = GlobalConfig.uri.services + 'AdmissionAdmissionForm/';
const BASE_URL2 = GlobalConfig.uri.services + 'OnlineAdmission/';
const BASE_URL_Program = GlobalConfig.uri.services + 'SetupProgram/';


export class AdmissionAdmissionFormService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCityWiseAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetCityWiseAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAdmissionDateWiseEx() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAdmissionDateWiseEx'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }



    public GetMarks() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetMarks'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllVM(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVM', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentPromoted(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentPromoted', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllVMByProgram(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVMByProgram', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAllVMBySelectedProgram(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVMBySelectedProgram', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetDpData(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetDpData', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetConcessKinsStudent(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessKinsStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));

    }

    public GetElStudent(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetElStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetElStudentEx(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetElStudentEx', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetKinshipStudent(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetKinshipStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetConcessStudent(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetApprovalStudent(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetApprovalStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionStatus(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAdmissionStatus', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertApprovalStudent(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertApprovalStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertPaidDate(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertPaidDate', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetConcessionlist(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetConcession', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetKinshipConcession(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetKinshipConcession', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetConcessionBulkList(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetConcessionBulkList', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public ApplyConcession(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'ApplyConcessionStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetSessionWise(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSessionWise', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentList(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentList', { providedString: key }))
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

    public isTestCampus(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'isTestCampus', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindBy(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetFindByProgram(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL_Program + 'GetFindBy', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionDateWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAdmissionDateWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionDateWiseFx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAdmissionDateWiseFx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetPreData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetPreData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetCityWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAdmissionPgDateWiseFx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAdmissionPgDateWiseFx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCityWiseFxx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWiseFxx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetVWProgramMult(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWProgramMult', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetVWProgramSession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWProgramSession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetVWCitySession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWCitySession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWCitySessionDrill(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWCitySessionDrill', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionGenderCount(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionGenderCount', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionOnlineCount(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionOnlineCount', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionGenderCountCity(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionGenderCountCity', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionOnlineCountCity(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionOnlineCountCity', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionGenderDashboardCityLevelWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionGenderDashboardCityLevelWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public CheckStudentExist(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckStudentExist', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckStudentFeeIspaid(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckStudentFeeisPaid', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionOnlineDashboardCityLevelWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionOnlineDashboardCityLevelWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionGenderDashboardCityProgramWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionGenderDashboardCityProgramWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionOnlineDashboardCityProgramWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionOnlineDashboardCityProgramWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionGenderDashboardCityProgramDetailWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionGenderDashboardCityProgramDetailWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionOnlineDashboardCityProgramDetailWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionOnlineDashboardCityProgramDetailWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public VWCityDateEXCity(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'VWCityDateEXCity', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public VWCityDateEXProgram(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'VWCityDateEXProgram', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionTrendGraph(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionTrendGraph', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionTrendGraphCity(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionTrendGraphCity', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionTrendGraphlevel(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionTrendGraphlevel', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public AdmissionTrendGraphProgram(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionTrendGraphProgram', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AdmissionTrendGraphProgramD(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdmissionTrendGraphProgramD', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetVWProgramDate(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWProgramDate', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }



    public GetVWCityDate(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWCityDate', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetVWCityDateEX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWCityDateEX', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetVWCityDateEXX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWCityDateEXX', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public VWCityDateEXlevel(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'VWCityDateEXlevel', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWProgramDateEX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWProgramDateEX', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetVWProgramDateEXX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWProgramDateEXX', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWCityDatePgd(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWCityDatePgd', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWShiftDateEX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWShiftDateEX', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWShiftDate(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWShiftDate', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWShiftDateEXX(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWShiftDateEXX', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWShiftDatePgd(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWShiftDatePgd', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWShiftSession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWShiftSession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetVWProgramDatePgd(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetVWProgramDatePgd', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCityWiseDateMult(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWiseDateMult', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCityWiseFx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWiseFx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetCityWiseAllEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWiseAllEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetCityWiseMultLevel(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWiseMultLevel', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetCityWiseProgramLevel(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWiseProgramLevel', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetCityWiseProgram(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityWiseProgram', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAdmissionPgDateWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAdmissionPgDateWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionFormData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAdmissionFormData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetAdmissionWidgetData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAdmissionWidgetData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentAdmitData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetStudentAdmitData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertAdmission(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertAdmission', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertAdmissionBr(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertAdmissionBr', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public InsertAdmissionEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertAdmissionEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public InsertBulkConessoin(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'InsertBulkConcess', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetChallaNo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetChallaNo', { ProvidedString: predicate }))
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

    public GenerateStudentFee(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GenerateStudentFee', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    //Check SubInstallment of Installment
    public SubinstallmentofInstallment(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'CheckSubInstallmentofInstallment', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckFeeStructure(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'CheckFeeStructure', { providedString: key }))
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

    public CheckFeePaid(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckFeePaid', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckFeePaidCl(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckFeePaidCl', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckStudent(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckStudent', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckFeePaidEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckFeePaidEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public CheckSubInstallment(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckSubInstallment', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public CheckFeeExemption(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckFeeExemption', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public CheckFeeExemptionByEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckFeeExemptionByEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public RevertConcession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'RevertConcession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckChallanValidity(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckChallanValidity', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetadmissionAging(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetadmissionAging', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetKinshipConcessScholar(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'GetAdmissionConcessoin', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public UpdateConcessKinStudent(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL2 + 'UpdateConcessionKinsStaus', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckConcessionValdity(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckConcessionValdity', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckinstallmentValdity(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'CheckinstallmentValdity', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetCheckInstallment(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCheckInstallment', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
}