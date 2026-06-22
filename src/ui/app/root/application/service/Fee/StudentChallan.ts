/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { IFeeStudentChallan } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'FeeStudentChallan/';

export class FeeStudentChallanService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }
    public GetAll() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetAll'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFeeByChallanNo(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeByChallandata', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    
      public GetFeeByChallanNoPaid(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeByChallanNoPaid', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public PrChallanEx(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'PrChallanEx', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }




    public GetAllChallandata(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetAllChallandata', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFeeByChallanEx(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeByChallanNoEx', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetPreviousFee(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetPreviousFee', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public AddPreFirstYearChallan(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AddPreFirstYearChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetDisableChallans(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllDisableChallans', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetStudentReportData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetStudentReportData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    //Newly Made Function
    public GetStudentReportDatas(key: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetStudentReportDatas', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetStudentPaidData() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetStudentPaidData'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetStudentPaidCount() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetStudentPaidCount'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetAllVM(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetAllVM', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFeeByRefrenceNo(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeByRefrenceNo', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public TransportGetFeeByRefrenceNo(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'TransportGetFeeByRefrenceNo', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GenerateCustomChallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GenerateCustomChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GenerateEducationChallanForPre(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GenerateEducationChallanForPre', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFeePaid(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeePaid', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GenerateBulkCustomChallan(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GenerateBulkCustomChallanFee', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetFeeRData(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeRData', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetTansportData(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetTansportData', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFeeByPaidDate(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeByPaidDate', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GenerateSubInstallment(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GenerateSubInstallment', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GenerateManualSubInst(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GenerateManualSubInst', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public TransportGenerateManualSubInst
        (key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'TransportGenerateManualSubInst', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GenerateExemption(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GenerateExemption', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public TransportGenerateExemption(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'TransportGenerateExemption', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public TransportCheckSubInstallmentofInstallment(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'TransportCheckSubInstallmentofInstallment', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public CheckPaidInstallment(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'CheckPaidInstallment', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GenerateFullFeeChallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GenerateFullFeeChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public RevertFullFeeChallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'RevertFullFeeChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public StudentFeeDetailDescription(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'StudentFeeDetailDescription', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public RevertExemption(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'RevertExemption', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public ChallanExemptionManually(entity: Array<any>) {

        return this.exec<any>(Axios.post(BASE_URL + 'ChallanExemptionManually', entity))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));

    }
    public GetFeeByChallandataReversal(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeByChallandataReversal', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

      public GetFeeBychallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeByChallanNo', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
     public Getrefundchallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetRefundFeeByChallanNo', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
      public CheckAllRefundChallanPaid(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'CheckAllrefundchallanofAchallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public getAllreadyRefundChallan(key: string){
        return this.exec<any>(Axios.post(BASE_URL + 'GetAllRfundChallanofaChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
      public GetStudentPaidChallanTorefund(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetRefundChallanOfStudent', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetFeeCancelByChallanNo(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetFeeCancelByChallanNo', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public CancelChallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'CancelChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetSearchBychallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetSearchBychallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public MultipleInstallments(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'MultipleInstallments', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    
   public InsertRefundChalan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'InsertPaidStudenChallanForRefund', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

 public UpdateRefundChalan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'UpdateStudenChallanForRefund', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public InsertPaidStudenChallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'InsertPaidStudenChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

     public GetReversalChallan(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'GetReversalChallan', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


      public InsertPaidDate(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'InsertPaidDate', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertPaidDateAdmins(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'InsertPaidDateAdmins', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public InsertPaidDateEx(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'InsertPaidDateEx', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public updatePaidDate(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'updatePaidDate', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public RemovePaidDate(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'RemovePaidDate', { providedString: key }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public SaveManualExemption(key: string) {

        return this.exec<any>(Axios.post(BASE_URL + 'SaveManualExemption', { providedString: key }))
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

    public GetFinanceData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFinanceData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetFindBy2(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy2', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetFindBy3(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy3', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetBulkModel(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBulkModel', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetBulkModels(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBulkModels', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetBulkModelinfo(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetBulkModelinfo', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetFindByEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetFindBy', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public TransportGetFindBy(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'TransportGetFindBy', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetData', { ProvidedString: predicate }))
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

    public GetSingleConcessionFeeByRefrenceNo(entity: any) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSingleConcessionFeeByRefrenceNo', { ProvidedString: entity }))
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

    public updateDueDate(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'UpdateDueDate', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
       public AdhocChallanEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'AdhocChallanEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
}