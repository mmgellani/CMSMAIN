/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeStudentChallanEx, IFeeStudentChallanVM, ITransportSubinstallmentVM } from '../../../../models';
import { FeeStudentChallanService, AdmissionAdmissionFormService } from '../../../../service';

import * as helper from '../../../../helper';
import { IVWExemptionRemarksVM, IVWConcessionRemarksVM } from '../../../../models/Setup/ConcessionRemarks';
import { SetupConcessionRemarksService } from '../../../../service/Setup/ConcessionRemarks';

interface IFeeStudentChallanExemption extends IFeeStudentChallanEx {

    exemptedAmount: number;
}

@Component({
    name: 'fee-student-exemption-add-edit-model',
    template: require('./index.html')
})


export class TransportExemptionAddEdit extends Vue {
    studentInfo: any = {};

    private repository: FeeStudentChallanService;
    private data: Array<ITransportSubinstallmentVM> = [];
    private Tempdata: Array<ITransportSubinstallmentVM> = [];
    private TempChallandata: Array<IFeeStudentChallanEx> = [];
    private ManualExemptionList: Array<IFeeStudentChallanExemption> = [];
    private tempManualExemptionList: Array<IFeeStudentChallanExemption> = [];
    private StudentChallandata: Array<IFeeStudentChallanEx> = [];
    private ManualExemptionChallanList: Array<IFeeStudentChallanEx> = [];
    private installNo = 1;
    private count: number = 0;
    private ChallanNo: string = '';
    private program: string = '';
    private FeeSum: number = 0;
    private subIntallmentNo: number = 0;
    private showSubinstallment: boolean = false;
    private manualSubinstallment: boolean = false;
    private amountnew: number = 0;
    private sum: number = 0;
    private exemptionAmount: number = 0;
    private campusid: string = '';
    private sessionid: string = '';
    private studentName: string = '';
    private challanwiseExemption: boolean = false;
    private errorMessage: string = "";
    AdmissionformService: AdmissionAdmissionFormService = null;
    private ChallanNoList: Array<String> = [];
    private RefrenceNo: string = '';
    private title: string = 'Fee Exemption';
    private showbutton: boolean = false;
    private showRevert: boolean = false;
    remarksconcess: string = '';
    private concessionmarkrepository: SetupConcessionRemarksService;
    private concessionremarksmarkslist: Array<IVWConcessionRemarksVM> = [];


    created() {
        this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
        this.repository = new FeeStudentChallanService(this.$store);
        this.concessionmarkrepository = new SetupConcessionRemarksService(this.$store);
    }

    mounted() {
        this.studentInfo = this.$parent.$parent.$props['studentInfo'];

        this.data = [];
        this.ChallanNoList = [];
        this.TempChallandata = [];
        this.StudentChallandata = [];

        if (this.studentInfo) {
            if (this.studentInfo.admissionFormId) {
                this.repository.TransportGetFindBy(`e => (e.AdmissionFormId.ToString() == "` + this.studentInfo.admissionFormId + `") && (e.StatusId==1)`)
                    .then(res => {
                        this.StudentChallandata = res as Array<IFeeStudentChallanEx>;
                        this.hasExecumption();
                    });
            }

            if (this.studentInfo.refferenceNo) {
                this.repository.TransportGetFeeByRefrenceNo(this.studentInfo.refferenceNo)
                    .then(res => this.data = res as Array<ITransportSubinstallmentVM>);
            }

            this.exemptionAmount = 0;

            this.getConcessionMarks();
        }

    }

    getProperty(propertyName) {
        if (this.data) {
            if (this.data.length > 0) {
                return this.data[0][propertyName];
            }
        }
    }

    hasExecumption() {
        this.showRevert = false;
        if (this.feeHeadData) {
            if (this.feeHeadData.length > 0) {
                if (this.feeHeadData.find(e => e.feeHead.toLowerCase().substr(0, 3) == 'exe' && e.installmentNo == this.installNo)) {
                    this.showRevert = true;
                }
            }
        }
    }

    sumFeeHead(propertyName) {
        if (this.feeHeadData) {
            return this.feeHeadData.reduce((a, b) => a + b[propertyName], 0);
        } else {
            return 0;
        }
    }

    get showRevertExumption() {
        var should = false;
        if (this.feeDetail) {
            if (this.feeDetail.length > 0) {
                if ((this.feeDetail[0].paidDate == null) && (this.showRevert)) {
                    should = true;
                }
            }
        }

        return should;
    }
    getConcessionMarks() {
        this.concessionmarkrepository.GetFindBy(`e=>e.StatusId==1 && (e.CampusId.ToString() == "` + this.studentInfo.campusId + `")`).then(res => {
            this.concessionremarksmarkslist = res as Array<IVWConcessionRemarksVM>;

        });
    }

    sumFee(propertyName) {
        if (this.feeDetail) {
            return this.feeDetail.reduce((a, b) => a + b[propertyName], 0);
        }
        return 0;
    }

    get maxInstallments() {
        if (this.data) {
            if (this.data.length > 0) {
                return this.data.reduce((a, b) => Number(a.installmentNo) > Number(b.installmentNo) ? a : b).installmentNo;
            }
        }
        return 0;
    }

    get feeHeadData() {
        if (this.data) {
            if (this.data.length > 0) {
                return this.data.filter(e => e.installmentNo == this.installNo).sort((n1, n2) => {
                    if (n1.feeHead > n2.feeHead) { return 1; }
                    if (n1.feeHead < n2.feeHead) { return -1; }
                    return 0;
                });
            }
        }
    }

    get feeDetail() {
        if (this.StudentChallandata) {
            if (this.StudentChallandata.length > 0) {
                return this.StudentChallandata.filter(e => e.installmentNo == this.installNo).sort((n1, n2) => {
                    if (n1.challanNo > n2.challanNo) { return 1; }
                    if (n1.challanNo < n2.challanNo) { return -1; }
                    return 0;
                });
            }
        }
    }

    updateFeeAmount() {
        this.amountnew = this.sumFee('feeAmount') - this.exemptionAmount;
    }

    get applyExemption() {
        if (this.feeDetail) {
            if (this.feeDetail.length > 0) {
                this.feeDetail.forEach(element => {
                    if (element.paidDate) {
                        return true;
                    }
                });
            }
        }

        return false;
    }

    get shouldSave() {
        return this.sumFee('feeAmount') - this.exemptionAmount > 0;
    }
    show() {
        if (this.exemptionAmount! > 0) {
            this.showbutton = true;
        }

    }

    GetSubinstallmentNo() {
        this.showSubinstallment = true;
    }

    RevertExemption() {
        var key = this.studentInfo.admissionFormId + '?' + this.feeDetail[0].installmentNo
        this.repository.RevertExemption(key).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Fee Exemption has been Reverted successfully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        });


    }

    CheckSubinStallment() {

        if (this.feeDetail) {

            if (this.feeDetail.length > 0) {
                var key = this.feeDetail[0].admissionFormId + '?' + this.feeDetail[0].classId + '?' + this.installNo;
                this.AdmissionformService.SubinstallmentofInstallment(key).then(
                    r => {
                        alert(JSON.stringify(r));
                        if (r.val > 1) {

                            return false;
                        }


                    }
                )
            }
        }


        return true;
    }

    SaveFeeExemption() {

        //Edited by Fahad  5-7-2019
        //Remove Check of if Already Exempted applied 

        if (this.feeDetail) {

            if (this.feeDetail.length > 0) {
                var key = this.feeDetail[0].admissionFormId + '?' + this.feeDetail[0].classId + '?' + this.installNo;
            }
        }

        this.AdmissionformService.CheckFeePaidEx(this.feeDetail[0].admissionFormId+'?'+ this.installNo).then(r=>
        {

            if(r[0].val<1)

            {

                this.repository.TransportCheckSubInstallmentofInstallment(key).then(r => {        
                    if (r.returnValue < 2) {
                        if (this.exemptionAmount < this.sumFee('feeAmount')) {
                            var key = this.studentInfo.admissionFormId + '?' + this.feeDetail[0].installmentNo + '?' + this.exemptionAmount + '?' + this.studentInfo.campusId + '?' + this.studentInfo.sessionId + '?' + this.feeDetail[0].challanNo + '?' + this.remarksconcess
                            this.repository.TransportGenerateExemption(key).then(() => {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Fee Exemption has been Generated successfully",
                                    title: "Success",
                                    messageTypeId: PayloadMessageTypes.success
                                });
                            });
                        }
                        else {
                            this.errorMessage =
                                this.errorMessage +
                                "Fee Exemption Amount must be less Than Fee Amount";
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: this.errorMessage,
                                title: "Danger",
                                messageTypeId: PayloadMessageTypes.error
                            });
                            this.errorMessage = "";
                        }
                    }  else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Exemption Cannot Applied on SubinStallment First Revert SubINstallment ",
                            title: "Error",
                            messageTypeId: PayloadMessageTypes.error
                        });
        
        
        
                    }
                })


            }

            else
            {

                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Fee Paid Exemption Cannot Applied",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
               


            }


        })



        // this.AdmissionformService.CheckFeeExemption(this.studentInfo.admissionFormId).then(res => {
        //     if (res) {
        //         if (res.length > 0) {
        //             if (res[0].val > 0) {
        //                 this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                     text: "Exemption already Applied, cannot be applied to this student.",
        //                     title: "Error",
        //                     messageTypeId: PayloadMessageTypes.error
        //                 });
        //                 return false;
        //             } else {
            
        }

       

    
}





