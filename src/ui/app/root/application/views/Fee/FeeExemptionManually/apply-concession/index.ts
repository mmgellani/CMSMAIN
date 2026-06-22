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

import { IFeeStudentChallan, IFeeStudentChallanVM, IFeeSubinstallmentVM, IGetStudentsVM, IFeeScholarshipCriteriaVM } from '../../../../models';
import { FeeStudentChallanService, AdmissionAdmissionFormService, FeeConcessionDetailService, FeeScholarshipCriteriaService } from '../../../../service';

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
    name: 'apply-concession-model',
    template: require('./index.html')
})


export class FeeStudentChallanApplyConcession extends Vue {
    private fullName: string = '';
    private repository: FeeStudentChallanService;
    private concessionRepository: FeeConcessionDetailService;
    private datas: Array<IGetStudentsVM> = [];
    private tempDatas: Array<IGetStudentsVM> = [];
    private StudentChallandata: Array<IFeeStudentChallan> = [];
    private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = [];
    AdmissionformService: AdmissionAdmissionFormService = null;
    private scholarshipCriteriaId = "";
    private ChallanNo: string = '';
    private newDatas: any = [];
    private percentage = 0;
    private scholarshipCriteriaRepo: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(
        this.$store
    );
    private concessionDetailRepo: FeeConcessionDetailService = new FeeConcessionDetailService(
        this.$store
    );
    private ChallanNoList: Array<String> = [];
    private RefrenceNo: string = '';
    private title: string = 'Apply Concession';

    created() {

        this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
        this.concessionRepository = new FeeConcessionDetailService(this.$store);

        this.repository = new FeeStudentChallanService(this.$store);
        // this.repository.GetFindBy('e=>e.StatusId==1').then(
        //     res => {

        //         this.StudentChallandata = res as Array<IFeeStudentChallan>
        //     }
        // )

    }

    beforeModalOpen(event) {
        this.datas = [];
        this.tempDatas = [];
        this.ChallanNoList = [];
        this.newDatas = [];

        this.datas = event.params.modelVM as Array<IGetStudentsVM>;
        if (this.datas.length > 0) {
            this.tempDatas.push(this.datas[0]);

            this.percentage = parseInt(this.tempDatas[0].obtained) / parseInt(this.tempDatas[0].total) * 100
            this.percentage = Math.round(this.percentage);

            this.newDatas.push({
                fullName: this.tempDatas[0].fullName,
                admissionFormId: this.tempDatas[0].admissionFormId,
                fatherName: this.tempDatas[0].fatherName,
                isChecked: false,
                percentage: this.percentage,
                referrenceNo: this.tempDatas[0].refferenceNo,
                rollNo: this.tempDatas[0].rollNo,
                studentCNIC: this.tempDatas[0].studentCNIC,
                studentContactNo: this.tempDatas[0].studentContact,
                studentId: this.tempDatas[0].studentId,
                zoneId: this.tempDatas[0].zoneId,
                classId: this.tempDatas[0].classId,
                concessionDetailId: this.tempDatas[0].concessionDetailId
            });

        }
        this.loadScholarship();
    }
    
    loadScholarship() {
        this.scholarshipCriteriaList = [];
        this.scholarshipCriteriaId = '';

        var key =
            this.tempDatas[0].sessionId +
            "?" +
            this.tempDatas[0].campusId +
            "?" +
            this.tempDatas[0].programDetailId +
            "?" +
            this.tempDatas[0].shiftId;

        this.scholarshipCriteriaRepo.GetAllVMBy(key).then(r => {
            this.scholarshipCriteriaList = r as Array<IFeeScholarshipCriteriaVM>;

            this.contrinuation = [];
            this.scholarshipCriteriaList.forEach(element => {
                if (this.contrinuation.indexOf(element.continuationPolicyName) == -1) {
                    this.contrinuation.push(element.continuationPolicyName);
                }
            });
        });
    }

    contrinuation = [];
    data = [];
    filterData(cont) {
        if (this.scholarshipCriteriaList) {
            if (this.scholarshipCriteriaList.length > 0) {
                this.data = this.scholarshipCriteriaList.filter(e => e.continuationPolicyName == cont);
            }
        }
    }

    IsAppliedConcession() {
        var admissonformid = this.newDatas[0].admissionFormId;
        var classid = this.newDatas[0].classId;

        this.AdmissionformService.CheckFeeExemption(admissonformid).then(res => {
            if (res) {
                if (res.length > 0) {
                    if (res[0].val > 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Exemption Applied,Concession cannot be applied to this student.",
                            title: "Error",
                            messageTypeId: PayloadMessageTypes.error
                        });
                        return false;
                    } else {
                        this.AdmissionformService.CheckFeePaid(admissonformid).then(prs => {
                            if (prs) {
                                if (prs.length > 0) {
                                    if (prs[0].val > 0) {
                                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                                            text: "Fee Already Paid,Concession cannot be applied to this student.",
                                            title: "Error",
                                            messageTypeId: PayloadMessageTypes.error
                                        });
                                        return false;
                                    } else {
                                        this.AdmissionformService.CheckSubInstallment(admissonformid + '?' + classid)
                                            .then(cst => {
                                                if (cst) {
                                                    if (cst.length > 0) {
                                                        if (cst[0].val > 0) {
                                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                                text: "Subinstallment Generated,Concession cannot be applied to this student.",
                                                                title: "Error",
                                                                messageTypeId: PayloadMessageTypes.error
                                                            });
                                                            return false;
                                                        } else {
                                                            var response = confirm('Are you sure to apply Concession to this student');

                                                            if (response) {
                                                                var key = this.scholarshipCriteriaId + "?" + JSON.stringify(this.newDatas);

                                                                this.concessionDetailRepo.ApplyBulkConcession(key).then(r => {
                                                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                                        text: "Record has been updated successfully",
                                                                        title: "Success",
                                                                        messageTypeId: PayloadMessageTypes.success
                                                                    });
                                                                });
                                                            }
                                                            this.cancel();
                                                            return true;
                                                        }
                                                    } else {
                                                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                            text: "Concession cannot be applied to this student.",
                                                            title: "Error",
                                                            messageTypeId: PayloadMessageTypes.error
                                                        });
                                                        return false;
                                                    }
                                                } else {
                                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                        text: "Concession cannot be applied to this student.",
                                                        title: "Error",
                                                        messageTypeId: PayloadMessageTypes.error
                                                    });
                                                    return false;
                                                }
                                            })
                                    }
                                } else {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Concession cannot be applied to this student.",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error
                                    });
                                    return false;
                                }
                            } else {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Concession cannot be applied to this student.",
                                    title: "Error",
                                    messageTypeId: PayloadMessageTypes.error
                                });
                                return false;
                            }
                        });
                    }
                } else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Concession cannot be applied to this student.",
                        title: "Error",
                        messageTypeId: PayloadMessageTypes.error
                    });
                    return false;
                }
            } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Concession cannot be applied to this student.",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
                return false;
            }

            return true;
        });

        return true;
    }


    cancel() {
        this.$modal.hide('apply-concession-model');
        this.$emit("submit");
    }


    $v: Vuelidate<any>;
}