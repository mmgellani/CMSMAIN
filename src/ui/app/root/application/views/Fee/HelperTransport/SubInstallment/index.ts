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

import { IFeeStudentChallanEx, IFeeStudentChallanVM, ITransportSubinstallmentVM, IFeeStudentChallanSubIns } from '../../../../models';
import { FeeStudentChallanService, AdmissionAdmissionFormService } from '../../../../service';

import * as helper from '../../../../helper';
import { arrayMax } from 'highcharts';

type ValidateFeeStudentChallan = { model: IFeeStudentChallanEx, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeStudentChallan> = {
    model: {
        studentChallanId: { required },
        admissionFormId: { required },
        classId: { required },
        installmentNo: { required },
        challanNo: { required },
        feeAmount: { required },
        dueDate: { required },
        statusId: { required },
        loggerId: { required },
    }
};

interface IFeeStudentChallanVMSubInstallments extends IFeeStudentChallanVM {

    subinstallmentAmount: number;
}

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'student-sub-installment-add-edit-model',
    template: require('./index.html')
})


export class TransportSubInstallmentAddEdit extends Vue {
    studentInfo: any = {};
    private fullName: string = '';
    private repository: FeeStudentChallanService;
    private data: Array<ITransportSubinstallmentVM> = [];
    private Tempdata: Array<ITransportSubinstallmentVM> = [];
    private TempChallandata: Array<IFeeStudentChallanSubIns> = [];
    private ManualInstallmentList: Array<IFeeStudentChallanVMSubInstallments> = [];
    private tempManualInstallmentList: Array<IFeeStudentChallanVMSubInstallments> = [];
    private StudentChallandata: Array<IFeeStudentChallanEx> = [];
    private finalManualInstallmentList: Array<IFeeStudentChallanVMSubInstallments> = [];
    AdmissionformService: AdmissionAdmissionFormService = null;
    private installNo: number = 1;
    private count: number = 0;
    private TotalSubintamount = 0;
    private ChallanNo: string = '';
    private program: string = '';
    private FeeSum: number = 0;
    private subIntallmentNo: number = 0;
    private showSubinstallment: boolean = false;
    private manualSubinstallment: boolean = true;
    private amountnew: number = 0;
    private sum: number = 0;
    private admissionformid: string = '';

    private ChallanNoList: Array<String> = [];
    private RefrenceNo: string = '';
    private title: string = 'Student Subinstallments';
    private hasSubInst = false;
    private isValid = true;
    private shouldDisable: boolean = true;

    created() {
        this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
        this.repository = new FeeStudentChallanService(this.$store);
    }

    calculateRemaining(feeAmount: number, subInsAmount: number) {
        if (feeAmount - subInsAmount == 0 || subInsAmount == 0) {
            if (subInsAmount == 0) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Sub Installment Amount must be greater than 0',
                    title: 'Warning',
                    messageTypeId: PayloadMessageTypes.warning
                })
            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Further SubInstallment cannot be generated',
                    title: 'Warning',
                    messageTypeId: PayloadMessageTypes.warning
                })
            }
        }
        else {
            this.TempChallandata.push({
                admissionFormId: this.data[0].admissionFormId, challanNo: ''
                , classId: this.StudentChallandata[0].classId, dueDate: null, feeAmount: feeAmount - subInsAmount, installmentNo: this.installNo,
                loggerId: helper.newGuid(), paidDate: null, statusId: 1, studentChallanId: ''
                , subInstallmentAmount: feeAmount - subInsAmount
            });
        }
    }

    firstTime: boolean = true;

    get shouldSave() {
        if (this.manualSubinstallment) {
            if (this.TempChallandata.findIndex(e => e.dueDate == null) > -1) {
                return false;
            }
            var smChallan = this.TempChallandata.reduce((a, b) => { return a + Number(b.subInstallmentAmount); }, 0);
            var smFeeStructure = this.Tempdata.reduce((a, b) => { return a + Number(b.payableAmount); }, 0);

            return smChallan == smFeeStructure;
        } else {
            return true;
        }
    }

    checkAmount() {
        this.shouldDisable = true;


        this.TempChallandata.forEach(element => {
            if (element.subInstallmentAmount - element.feeAmount == 0) {
                this.shouldDisable = false;
            }
        });
    }

    isPaid(paidDate) {
        //console.log(paidDate)
        return paidDate != null;
    }



    mounted() {
        this.studentInfo = this.$parent.$parent.$props['studentInfo'];
        this.firstTime = true;

        this.data = [];
        this.StudentChallandata = [];

        if (this.studentInfo) {

            if (this.studentInfo.refferenceNo) {
                this.repository.TransportGetFeeByRefrenceNo(this.studentInfo.refferenceNo)
                    .then(res => {
                        this.data = res as Array<ITransportSubinstallmentVM>
                        this.RefrenceNo = this.data[0].refferenceNo;
                        this.fullName = this.data[0].fullName;
                        this.program = this.data[0].description;

                        if (this.studentInfo.admissionFormId) {
                            this.repository.TransportGetFindBy(`e => (e.AdmissionFormId.ToString() == "` + this.studentInfo.admissionFormId + `") && (e.StatusId==1)`)
                                .then(res => {
                                    this.StudentChallandata = res as Array<IFeeStudentChallanEx>;
                                    this.filterData();
                                });
                        }
                    });
            }
        }

    }

    // beforeModalOpen(event) {
    //     this.StudentChallandata = [];
    //     this.data = [];
    //     this.ChallanNoList = [];
    //     this.data = event.params.modelVM as Array<IFeeSubinstallmentVM>;

    //     if (this.data.length > 0) {
    //         this.admissionformid = this.data[0].admissionFormId;
    //     }
    //     this.repository.GetFindBy(`e => (e.AdmissionFormId.ToString() == "` + this.admissionformid + `") && (e.StatusId==1)`).then(
    //         res => {

    //             this.StudentChallandata = res as Array<IFeeStudentChallan>
    //             this.RefrenceNo = this.data[0].refferenceNo;
    //             this.fullName = this.data[0].fullName;
    //             this.program = this.data[0].description;
    //             this.filterData();
    //         }
    //     )

    // }

    filterData() {
        this.hasSubInst = false;
        this.TempChallandata = [];
        this.Tempdata = this.data.filter(e => e.installmentNo == this.installNo && e.refferenceNo == this.RefrenceNo && e.statusId == 1)
        // this.TempChallandata = this.StudentChallandata.filter(e => e.installmentNo == this.installNo
        //     //  && e.admissionFormId == this.data[0].admissionFormId
        // )
        this.StudentChallandata.filter(e => e.installmentNo == this.installNo)
            .forEach(e => {
                this.TempChallandata.push({
                    admissionFormId: e.admissionFormId, challanNo: e.challanNo
                    , classId: e.classId, dueDate: e.dueDate, feeAmount: e.feeAmount, installmentNo: e.installmentNo,
                    loggerId: e.loggerId, paidDate: e.paidDate, statusId: e.statusId, studentChallanId: e.studentChallanId
                    , subInstallmentAmount: 0
                })
            })
        if (this.TempChallandata.length > 1) {
            this.hasSubInst = true;

        }
        else if (this.TempChallandata.length == 1) {
            this.TempChallandata[0].dueDate = null;
        }


        for (var i = 0; i < this.TempChallandata.length; i++) {

            if (this.TempChallandata[i].feeAmount < 0) {
                this.TempChallandata[i].feeAmount = 0;

            }

        }
    }

    GetSubinstallmentNo() {
        this.showSubinstallment = true;
    }


    TSaveSubInstallment() {
        var totalamount = 0;
        if (this.manualSubinstallment == false) {
        }
        else if (this.manualSubinstallment == true) {
            this.subIntallmentNo = 2;
            var key = this.Tempdata[0].admissionFormId + '?' + this.TempChallandata[0].challanNo + '?' + this.Tempdata[0].installmentNo + '?' + this.subIntallmentNo + '?' + this.sum

            this.repository.GenerateSubInstallment(key).then(res => {
                () => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Sub Installment has been Generated successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                }
                this.cancel();
            });
        }

        this.cancel();
    }

    SaveSubInstallment() {
        this.isValid = true;
        var key = this.Tempdata[0].admissionFormId + "?" + this.subIntallmentNo;
        var admissonformid = this.Tempdata[0].admissionFormId;
        var key = JSON.stringify(this.TempChallandata) + "?" + this.TempChallandata[0].challanNo;
        this.repository.TransportGenerateManualSubInst(key)
            .then(() => {
                this.firstTime = false;
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Sub Installment has been Generated successfully",
                    title: "Success",
                    messageTypeId: PayloadMessageTypes.success
                });
                this.cancel();
            });




















        // this.AdmissionformService.CheckFeeExemption(admissonformid).then(res => {
        //     if (res) {
        //         if (res.length > 0) {
        //             if (res[0].val > 100) { // fahad satar's fix, timely update needed
        //                 this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                     text: "Exemption Applied,SubInstallment cannot be applied to this student.",
        //                     title: "Error",
        //                     messageTypeId: PayloadMessageTypes.error
        //                 });
        //                 return false;
        //             } else {
        //                 this.AdmissionformService.CheckFeePaid(admissonformid + '?' + this.installNo).then(prs => {
        //                     if (prs) {
        //                         if (prs.length > 0) {
        //                             if (prs[0].val > 0) {
        //                                 this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                                     text: "Fee Already Paid,SubInstallment cannot be applied to this student.",
        //                                     title: "Error",
        //                                     messageTypeId: PayloadMessageTypes.error
        //                                 });
        //                                 return false;
        //                             } else {
        //                                 //data put here
        //                                 var totalamount = 0;
        //                                 if (this.manualSubinstallment == false) {
        //                                     var key = this.Tempdata[0].admissionFormId + '?' + this.TempChallandata[0].challanNo + '?' + this.Tempdata[0].installmentNo + '?' + this.subIntallmentNo + '?' + totalamount
        //                                     this.repository.GenerateSubInstallment(key).then(() => {
        //                                         this.firstTime = false;
        //                                         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                                             text: "Sub Installment has been Generated successfully",
        //                                             title: "Success",
        //                                             messageTypeId: PayloadMessageTypes.success
        //                                         });
        //                                         this.cancel();
        //                                     });
        //                                 }
        //                                 else if (this.manualSubinstallment == true) {
        //                                     if (this.TempChallandata.length > 0) {
        //                                         for (var v = 0; v < this.TempChallandata.length; v++) {
        //                                             if (this.TempChallandata[v].dueDate == null) {
        //                                                 this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                                                     text: 'Please select Due Date ',
        //                                                     title: 'Warning',
        //                                                     messageTypeId: PayloadMessageTypes.warning
        //                                                 })
        //                                                 this.isValid = false;
        //                                                 break;
        //                                             }
        //                                         }
        //                                         if (this.isValid) {
        //                                             var key = JSON.stringify(this.TempChallandata) + "?" + this.TempChallandata[0].challanNo;
        //                                             this.repository.GenerateManualSubInst(key)
        //                                                 .then(() => {
        //                                                     this.firstTime = false;
        //                                                     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                                                         text: "Sub Installment has been Generated successfully",
        //                                                         title: "Success",
        //                                                         messageTypeId: PayloadMessageTypes.success
        //                                                     });
        //                                                     this.cancel();
        //                                                 });
        //                                         }
        //                                     }
        //                                 }
        //                             }
        //                         } else {
        //                             this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                                 text: "SubInstallment cannot be applied to this student.",
        //                                 title: "Error",
        //                                 messageTypeId: PayloadMessageTypes.error
        //                             });
        //                             return false;
        //                         }
        //                     } else {
        //                         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                             text: "SubInstallment cannot be applied to this student.",
        //                             title: "Error",
        //                             messageTypeId: PayloadMessageTypes.error
        //                         });
        //                         return false;
        //                     }
        //                 });
        //             }
        //         } else {
        //             this.$store.dispatch(StoreTypes.updateStatusBar, {
        //                 text: "SubInstallment cannot be applied to this student.",
        //                 title: "Error",
        //                 messageTypeId: PayloadMessageTypes.error
        //             });
        //             return false;
        //         }
        //     } else {
        //         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //             text: "SubInstallment cannot be applied to this student.",
        //             title: "Error",
        //             messageTypeId: PayloadMessageTypes.error
        //         });
        //         return false;
        //     }

        //     return true;
        // });

        this.cancel();
    }

    cancel() {
        this.hasSubInst = false;
        // this.$modal.hide('student-sub-installment-add-edit-model');
        // this.$emit("submit");
    }


    $v: Vuelidate<any>;
}