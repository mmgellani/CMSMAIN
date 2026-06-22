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

import { IFeeStudentChallan, IFeeStudentChallanVM, IFeeSubinstallmentVM, IFeeChallanType, IFeeBulkModel, ISetupClass } from '../../../../models';
import { FeeStudentChallanService, AdmissionAdmissionFormService, FeeChallanTypeService, SetupClassService } from '../../../../service';

import * as helper from '../../../../helper';
import { IVWExemptionRemarksVM, IVWConcessionRemarksVM } from '../../../../models/Setup/ConcessionRemarks';
import { SetupConcessionRemarksService } from '../../../../service/Setup/ConcessionRemarks';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';

interface IFeeStudentChallanExemption extends IFeeStudentChallan {

    exemptedAmount: number;
}

@Component({
    name: 'fee-student-exemption-add-edit-model',
    template: require('./index.html')
})


export class FeeStudentExemptionAddEdit extends Vue {
    @State((state: IRootStoreState) => state.feeStudentInfo) studentInfo: any;

    private repository: FeeStudentChallanService;
    private data: Array<IFeeSubinstallmentVM> = [];
    private Tempdata: Array<IFeeSubinstallmentVM> = [];
    private TempChallandata: Array<IFeeStudentChallan> = [];
    private ManualExemptionList: Array<IFeeStudentChallanExemption> = [];
    private tempManualExemptionList: Array<IFeeStudentChallanExemption> = [];
    private StudentChallandata: Array<IFeeStudentChallan> = [];
    private ManualExemptionChallanList: Array<IFeeStudentChallan> = [];
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
    private challanType: string = '';
    remarksconcess: string = '';
    private concessionmarkrepository: SetupConcessionRemarksService;
    private concessionremarksmarkslist: Array<IVWConcessionRemarksVM> = [];
    private ChallanTypeList: Array<IFeeChallanType> = [];
    private FeeChallanTypeService: FeeChallanTypeService = null;

    private classList: Array<ISetupClass> = []
    private classId = '';
     private isSaving:boolean=false;


    private classRepo: SetupClassService = new SetupClassService(this.$store)


    created() {
        this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
        this.FeeChallanTypeService = new FeeChallanTypeService(this.$store);
        this.repository = new FeeStudentChallanService(this.$store);
        this.concessionmarkrepository = new SetupConcessionRemarksService(this.$store);
    }
    private bulkModel: IFeeBulkModel = { feeStudentChallan: [], feeSubinstallmentVM: [] }

    mounted() {
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

                this.data = [];
                this.ChallanNoList = [];
                this.TempChallandata = [];
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
                                    this.hasExecumption();
                                })
                        }
                    }
                }
            })

        this.getConcessionMarks();
    }

    loadClassData() {
        this.data = [];
        this.ChallanNoList = [];
        this.TempChallandata = [];
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
                            this.hasExecumption();
                        })
                }
            }
        }

        this.getConcessionMarks();

    }


    getProperty(propertyName) {
        if (this.data) {
            if (this.data.length > 0) {
                return this.data[0][propertyName];
            }
        }
    }
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 },{ item: 5 },  { item: 6 }]
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

    // get maxInstallments() {
    //     if (this.data) {
    //         if (this.data.length > 0) {
    //             return this.data.reduce((a, b) => Number(a.installmentNo) > Number(b.installmentNo) ? a : b).installmentNo;
    //         }
    //     }
    //     return 0;
    // }

    get feeHeadData() {
        if (this.data) {
            if (this.data.length > 0) {
                return this.data.filter(e => e.installmentNo == this.installNo && e.challanTypeId == this.challanType).sort((n1, n2) => {
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
                return this.StudentChallandata.filter(e => e.installmentNo == this.installNo && e.challanTypeId == this.challanType).sort((n1, n2) => {
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
    
        if(this.feeDetail.length>1){
       this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Exemption Cannot be Reverted on already created SubInstallments",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
        }
       else  {var key = this.studentInfo.admissionFormId + '?' + this.feeDetail[0].installmentNo + '?' + this.challanType+'?'+this.classId
        this.repository.RevertExemption(key).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Fee Exemption has been Reverted successfully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        });
    } 


    }

    CheckSubinStallment() {

        if (this.feeDetail) {

            if (this.feeDetail.length > 0) {
                var key = this.feeDetail[0].admissionFormId + '?' + this.feeDetail[0].classId + '?' + this.installNo;
                this.AdmissionformService.SubinstallmentofInstallment(key).then(
                    r => {
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
 if (this.isSaving) return; // Prevent duplicate clicks

  this.isSaving = true;
        //Edited by Fahad  5-7-2019
        //Remove Check of if Already Exempted applied 

        if (this.feeDetail) {

            if (this.feeDetail.length > 0) {
                var key = this.feeDetail[0].admissionFormId + '?' + this.feeDetail[0].classId + '?' + this.installNo + '?' + this.challanType;
            }
        }



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


        this.AdmissionformService.SubinstallmentofInstallment(key).then(r => {

            if (r.returnValue < 1) {
                this.AdmissionformService.CheckFeePaidCl(this.studentInfo.admissionFormId + '?' + this.feeDetail[0].installmentNo + '?' + this.challanType + '?' + this.classId).then(prs => {
                    if (prs) {
                        if (prs.length > 0) {
                            if (prs[0].val > 0) {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Fee Already Paid,Exemption cannot be applied to this student.",
                                    title: "Error",
                                    messageTypeId: PayloadMessageTypes.error
                                });
                                this.isSaving = false;
                                return false;
                            } else {
                                if (this.exemptionAmount < this.sumFee('feeAmount')) {
                                    var key = this.studentInfo.admissionFormId + '?' + this.feeDetail[0].installmentNo + '?' + this.exemptionAmount + '?' + this.studentInfo.campusId + '?' + this.studentInfo.sessionId + '?' + this.feeDetail[0].challanNo + '?' + this.remarksconcess
                                    this.repository.GenerateExemption(key).then(() => {
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
                                    this.isSaving = false;
                                }
                            }
                        } else {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Fee Exemption cannot be applied to this student.",
                                title: "Error",
                                messageTypeId: PayloadMessageTypes.error
                            });
                            this.isSaving = false;
                            return false;
                        }
                    } else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Fee Exemption cannot be applied to this student.",
                            title: "Error",
                            messageTypeId: PayloadMessageTypes.error
                        });
                        this.isSaving = false;
                        return false;
                    }
                });
                return true;

            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Exemption Cannot Applied on SubinStallment First Revert SubINstallment ",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
                 this.isSaving = false;


            }

        })



    }
}





