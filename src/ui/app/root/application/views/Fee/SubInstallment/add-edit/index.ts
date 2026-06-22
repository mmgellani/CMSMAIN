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

import { IFeeStudentChallan, IFeeStudentChallanVM, IFeeSubinstallmentVM, IFeeStudentChallanSubIns } from '../../../../models';
import { FeeStudentChallanService, AdmissionAdmissionFormService } from '../../../../service';

import * as helper from '../../../../helper';

type ValidateFeeStudentChallan = { model: IFeeStudentChallan, validationGroup: string[] };
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


export class FeeStudentSubInstallmentAddEdit extends Vue {
    private fullName: string = '';
    private repository: FeeStudentChallanService;
    private data: Array<IFeeSubinstallmentVM> = [];
    private Tempdata: Array<IFeeSubinstallmentVM> = [];
    private TempChallandata: Array<IFeeStudentChallanSubIns> = [];
    private ManualInstallmentList: Array<IFeeStudentChallanVMSubInstallments> = [];
    private tempManualInstallmentList: Array<IFeeStudentChallanVMSubInstallments> = [];
    private StudentChallandata: Array<IFeeStudentChallan> = [];
    private finalManualInstallmentList: Array<IFeeStudentChallanVMSubInstallments> = [];
    AdmissionformService: AdmissionAdmissionFormService = null;
    private installNo: number = 1;
    private count: number = 0;
    private ChallanNo: string = '';
    private program: string = '';
    private FeeSum: number = 0;
    private subIntallmentNo: number = 0;
    private showSubinstallment: boolean = false;
    private manualSubinstallment: boolean = false;
    private amountnew: number = 0;
    private sum: number = 0;
    private admissionformid: string = '';

    private ChallanNoList: Array<String> = [];
    private RefrenceNo: string = '';
    private title: string = 'Student Subinstallments';
    private hasSubInst = false;
    private isValid = true;
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
            })
        }

    }
    isPaid(paidDate) {
        //console.log(paidDate)
        return paidDate != null;
    }

    beforeModalOpen(event) {
        this.StudentChallandata = [];
        this.data = [];
        this.ChallanNoList = [];
        this.data = event.params.modelVM as Array<IFeeSubinstallmentVM>;

        if (this.data.length > 0) {
            this.admissionformid = this.data[0].admissionFormId;
        }
        this.repository.GetData(this.admissionformid).then(
            res => {

                this.StudentChallandata = res as Array<IFeeStudentChallan>
                this.RefrenceNo = this.data[0].refferenceNo;
                this.fullName = this.data[0].fullName;
                this.program = this.data[0].description;
                this.filterData();
            }
        )

    }

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
        if (this.manualSubinstallment) {
            if (this.TempChallandata.length > 1) {
                this.hasSubInst = true;

            }
            else if (this.TempChallandata.length == 1) {
                this.TempChallandata[0].dueDate = null;
            }
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
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }];
    subInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];

    SaveSubInstallment() {
        this.isValid = true;
        var key = this.Tempdata[0].admissionFormId + "?" + this.subIntallmentNo;
        var admissonformid = this.Tempdata[0].admissionFormId;
        this.AdmissionformService.CheckFeeExemption(admissonformid).then(res => {
            if (res) {
                if (res.length > 0) {
                    if (res[0].val > 100) { // fahad satar's fix, timely update needed
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Exemption Applied,SubInstallment cannot be applied to this student.",
                            title: "Error",
                            messageTypeId: PayloadMessageTypes.error
                        });
                        return false;
                    } else {
                        this.AdmissionformService.CheckFeePaid(admissonformid + '?' + this.installNo).then(prs => {
                            if (prs) {
                                if (prs.length > 0) {
                                    if (prs[0].val > 0) {
                                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                                            text: "Fee Already Paid,SubInstallment cannot be applied to this student.",
                                            title: "Error",
                                            messageTypeId: PayloadMessageTypes.error
                                        });
                                        return false;
                                    } else {

                                        //data put here

                                        var totalamount = 0;

                                        if (this.manualSubinstallment == false) {

                                            var key = this.Tempdata[0].admissionFormId + '?' + this.TempChallandata[0].challanNo + '?' + this.Tempdata[0].installmentNo + '?' + this.subIntallmentNo + '?' + totalamount

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

                                        else if (this.manualSubinstallment == true) {

                                            if (this.TempChallandata.length > 0) {
                                                for (var v = 0; v < this.TempChallandata.length; v++) {
                                                    if (this.TempChallandata[v].dueDate == null) {
                                                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                            text: 'Please select Due Date ',
                                                            title: 'Warning',
                                                            messageTypeId: PayloadMessageTypes.warning
                                                        })
                                                        this.isValid = false;
                                                        break;
                                                    }

                                                }
                                                if (this.isValid) {
                                                    var key = JSON.stringify(this.TempChallandata) + "?" + this.TempChallandata[0].challanNo;
                                                    this.repository.GenerateManualSubInst(key)
                                                        .then(r => {
                                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                                text: 'Sub Installment has been Generated successfully',
                                                                title: 'Success',
                                                                messageTypeId: PayloadMessageTypes.success
                                                            })
                                                            this.cancel();
                                                        })
                                                }




                                            }
                                        }
                                    }
                                } else {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "SubInstallment cannot be applied to this student.",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error
                                    });
                                    return false;
                                }
                            } else {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "SubInstallment cannot be applied to this student.",
                                    title: "Error",
                                    messageTypeId: PayloadMessageTypes.error
                                });
                                return false;
                            }
                        });
                    }
                } else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "SubInstallment cannot be applied to this student.",
                        title: "Error",
                        messageTypeId: PayloadMessageTypes.error
                    });
                    return false;
                }
            } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "SubInstallment cannot be applied to this student.",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
                return false;
            }

            return true;
        });

        //this.cancel();
    }

    cancel() {
        this.hasSubInst = false;
        this.$modal.hide('student-sub-installment-add-edit-model');
        this.$emit("submit");
    }


    $v: Vuelidate<any>;
}