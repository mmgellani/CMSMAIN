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

import { IFeeStudentChallan, IFeeStudentChallanVM, IFeeSubinstallmentVM, IFeeStudentChallanSubIns, IFeeChallanType, IFeeBulkModel, ISetupClass, SubInstallmentNo } from '../../../../models';
import { FeeStudentChallanService, AdmissionAdmissionFormService, FeeChallanTypeService, SetupClassService } from '../../../../service';

import * as helper from '../../../../helper';
import { arrayMax, dateFormat } from 'highcharts';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import moment from 'moment';

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
    @State((state: IRootStoreState) => state.feeStudentInfo) studentInfo: any;
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
    private challanType: string = '';
    private count: number = 0;
    private str = '';
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
    private FeeChallanTypeService: FeeChallanTypeService = null;
    private ChallanTypeList: Array<IFeeChallanType> = [];

    private classList: Array<ISetupClass> = [];
    private classId = '';
private checkconcession :Array<SubInstallmentNo>=[];

    private classRepo: SetupClassService = new SetupClassService(this.$store)


    created() {
        this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
        this.repository = new FeeStudentChallanService(this.$store);
        this.FeeChallanTypeService = new FeeChallanTypeService(this.$store);
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



    
    private bulkModel: IFeeBulkModel = { feeStudentChallan: [], feeSubinstallmentVM: [] }

    mounted() {
        // this.studentInfo = this.$parent.$parent.$props['studentInfo'];
        this.firstTime = true;

        this.FeeChallanTypeService.GetFindBy('e=>e.StatusId==1').then(r => {
            this.ChallanTypeList = r as Array<IFeeChallanType>
            if (this.ChallanTypeList.length > 0) {
                this.challanType = this.ChallanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')).challanTypeId;
            }
        })

        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.classList = r as Array<ISetupClass>
                this.classId = this.classList.find(s => s.fullName == 'Part-I').classId;
                
       // this.getfilterData();

                this.data = [];
                this.StudentChallandata = [];
                if (this.studentInfo) {
                    if (this.studentInfo.admissionFormId) {
                        if (this.studentInfo.refferenceNo) {
                            var key = this.studentInfo.refferenceNo + "?" + this.studentInfo.admissionFormId + "?" + this.classId
                            this.repository.GetBulkModel(key)
                                .then(r => {
                                    this.bulkModel = r as IFeeBulkModel;
                                    this.StudentChallandata = this.bulkModel.feeStudentChallan;
                                    this.data = this.bulkModel.feeSubinstallmentVM;
                                    this.RefrenceNo = this.data[0].refferenceNo;
                                    this.fullName = this.data[0].fullName;
                                    this.program = this.data[0].description;
                                    this.filterData();
                                })
                        }
                    }
                }
            })
        // if (this.studentInfo) {

        //     if (this.studentInfo.refferenceNo) {
        //         this.repository.GetFeeByRefrenceNo(this.studentInfo.refferenceNo)
        //             .then(res => {
        //                 this.data = res as Array<IFeeSubinstallmentVM>
        //                 this.RefrenceNo = this.data[0].refferenceNo;
        //                 this.fullName = this.data[0].fullName;
        //                 this.program = this.data[0].description;

        //                 if (this.studentInfo.admissionFormId) {
        //                     this.repository.GetFindBy(`e => (e.AdmissionFormId.ToString() == "` + this.studentInfo.admissionFormId + `") && (e.StatusId==1)`)
        //                         .then(res => {
        //                             this.StudentChallandata = res as Array<IFeeStudentChallan>;
        //                             this.filterData();
        //                         });
        //                 }
        //             });
        //     }
        // }


    }

    loadClassData() {
        this.data = [];
        this.StudentChallandata = [];
        this.TempChallandata = [];
        this.Tempdata = [];
        if (this.studentInfo) {
            if (this.studentInfo.admissionFormId) {
                if (this.studentInfo.refferenceNo) {
                    debugger;
                    var key = this.studentInfo.refferenceNo + "?" + this.studentInfo.admissionFormId + "?" + this.classId
                    this.repository.GetBulkModel(key)
                        .then(r => {
                            this.bulkModel = r as IFeeBulkModel;
                            this.StudentChallandata = this.bulkModel.feeStudentChallan;
                            this.data = this.bulkModel.feeSubinstallmentVM;
                            this.RefrenceNo = this.data[0].refferenceNo;
                            this.fullName = this.data[0].fullName;
                            this.program = this.data[0].description;
                            this.filterData();
                        })
                }
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

//     maxInstallments=[];

//  getfilterData(){
//   console.log(this.studentInfo);

//     var key =   this.studentInfo.admissionFormId+ '?' +this.classId +'?'+ 'Installment' ;
//     this.AdmissionformService.GetCheckInstallment(key).then(r =>{
//     this.checkconcession = r as Array<SubInstallmentNo>;
//     if(this.checkconcession &&this.checkconcession.length != 0)
//     {

//         this.maxInstallments=[];
//         this.checkconcession.forEach(element => {
//             this.maxInstallments.push({item:+element.checkInstallment});
//         });
        
   
//     }
// else {
//     this.maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }]
    
// }
//     })


//     }
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }]
maxSubInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];

    filterData() {
     
        this.hasSubInst = false;
        this.TempChallandata = [];
        this.Tempdata = [];
        console.log('Loading Data . . .');
        this.Tempdata = this.data.filter(e => e.installmentNo == this.installNo && e.refferenceNo == this.RefrenceNo && e.challanTypeId == this.challanType && e.statusId == 1)

        this.StudentChallandata.filter(e => e.installmentNo == this.installNo && e.challanTypeId == this.challanType)
            .forEach(e => {

                var dated = new Date(e.dueDate);
                this.str = dated.getFullYear() + '/' + (dated.getMonth() + 1) + '/' + dated.getDate();
                console.log(this.str)

                this.TempChallandata.push({
                    admissionFormId: e.admissionFormId, challanNo: e.challanNo
                    , classId: e.classId, dueDate: new Date(this.str), feeAmount: e.feeAmount, installmentNo: e.installmentNo,
                    loggerId: e.loggerId, paidDate: e.paidDate, statusId: e.statusId, studentChallanId: e.studentChallanId
                    , subInstallmentAmount: 0
                })
                this.str = '';
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

    SaveSubInstallment(subinstallment: number) {
        this.isValid = true;
        var key = this.Tempdata[0].admissionFormId + "?" + (subinstallment > 0 ? subinstallment : this.subIntallmentNo);
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
                        this.AdmissionformService.CheckFeePaidCl(admissonformid + '?' + this.installNo + '?' + this.challanType + '?' + this.classId).then(prs => {
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
                                            this.repository.GenerateSubInstallment(key).then(() => {
                                                this.firstTime = false;
                                                if (this.subIntallmentNo == 1) {
                                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                        text: "Sub Installment has been Reverted successfully",
                                                        title: "Success",
                                                        messageTypeId: PayloadMessageTypes.success
                                                    });
                                                } else {
                                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                        text: "Sub Installment has been Generated successfully",
                                                        title: "Success",
                                                        messageTypeId: PayloadMessageTypes.success
                                                    });
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

                                                    this.TempChallandata.forEach(element => {
                                                        element.dueDate = new Date(helper.formateDate(element.dueDate))

                                                    });
                                                    var key = JSON.stringify(this.TempChallandata) + "?" + this.TempChallandata[0].challanNo;

                                                    this.repository.GenerateManualSubInst(key)
                                                        .then(() => {
                                                            this.firstTime = false;
                                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                                text: "Sub Installment has been Generated successfully",
                                                                title: "Success",
                                                                messageTypeId: PayloadMessageTypes.success
                                                            });
                                                            this.cancel();
                                                        });
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

        this.cancel();
    }

    cancel() {
        this.hasSubInst = false;
        // this.$modal.hide('student-sub-installment-add-edit-model');
        // this.$emit("submit");
    }


    $v: Vuelidate<any>;
}