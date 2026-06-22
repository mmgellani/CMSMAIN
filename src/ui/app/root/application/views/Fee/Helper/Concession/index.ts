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
import { IFeeStudentChallan, IFeeStudentChallanVM, IFeeSubinstallmentVM, IGetStudentsVM, IFeeScholarshipCriteriaVM, IFeeChallanType, ISetupClass, CheckValidity, CheckInstallmentP } from '../../../../models';
import { FeeStudentChallanService, AdmissionAdmissionFormService, FeeConcessionDetailService, FeeScholarshipCriteriaService, FeeChallanTypeService, SetupClassService } from '../../../../service';
import * as helper from '../../../../helper';
import { ISetupConcessoinRemarks, IVWConcessionRemarksVM } from '../../../../models/Setup/ConcessionRemarks';
import { SetupConcessionRemarksService } from '../../../../service/Setup/ConcessionRemarks';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
interface IFeeStudentChallanVMSubInstallments extends IFeeStudentChallanVM {
    subinstallmentAmount: number;
}
@Component({
    name: 'apply-concession-model',
    template: require('./index.html')
})
export class FeeStudentChallanApplyConcession extends Vue {
    // private studentInfo: any = {};
    @State((state: IRootStoreState) => state.feeStudentInfo) studentInfo: any;
    private selc = '';
    private fullName: string = '';
    private repository: FeeStudentChallanService;
    shouldapplyconc: boolean = true;
    isInstallmentchecked :boolean=false;
    private concessionRepository: FeeConcessionDetailService;
    private datas: Array<IGetStudentsVM> = [];
    private tempDatas: Array<IGetStudentsVM> = [];
    private StudentChallandata: Array<IFeeStudentChallan> = [];
    private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = [];
    AdmissionformService: AdmissionAdmissionFormService = null;
    challantypeser: FeeChallanTypeService = new FeeChallanTypeService(this.$store);
    challantypelist: Array<IFeeChallanType> = [];
    private scholarshipCriteriaId = "";
    private campusId: string = '';
    private challantypeid: string = '';
    private ChallanNo: string = '';
    private newDatas: any = [];
    private percentage = 0;
    private installno: number = 0;
    remarksconcess: string = '';
    private checkconcession: Array<CheckValidity> = [];
    private checkinstallmentpaid: Array<CheckInstallmentP> = [];
    private concessionmarkrepository: SetupConcessionRemarksService = new SetupConcessionRemarksService(
        this.$store
    );
    private concessionremarksmarkslist: Array<IVWConcessionRemarksVM> = [];
    private scholarshipCriteriaRepo: FeeScholarshipCriteriaService = new FeeScholarshipCriteriaService(
        this.$store
    );
    private concessionDetailRepo: FeeConcessionDetailService = new FeeConcessionDetailService(
        this.$store
    );
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private classList: Array<ISetupClass> = []
    private classId = '';
    private ChallanNoList: Array<String> = [];
    private RefrenceNo: string = '';
    private title: string = 'Apply Concession';
    created() {
        debugger;
        this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
        this.concessionRepository = new FeeConcessionDetailService(this.$store);
        this.repository = new FeeStudentChallanService(this.$store);
    }
    mounted() {
        //  this.studentInfo = this.$parent.$parent.$props['studentInfo'];
        if (this.studentInfo) {
          this.isInstallmentchecked=false;
            debugger;
            this.classRepo.GetFindBy('s=>s.StatusId==1')
                .then(r => {
                    this.classList = r as Array<ISetupClass>
                    this.classId = this.classList.find(s => s.fullName == 'Part-I').classId;
                    this.repository.GetFindBy2(this.studentInfo.admissionFormId + "?" + this.classId)
                        .then(res => {
                            this.StudentChallandata = res as Array<IFeeStudentChallan>;
                            this.contrinuation = [];
                            this.loadScholarship();
                            this.getConcessionMarks();
                            this.getchallanType();
                        })
                })
                //
        }
    }
    loadClassData() {
        this.repository.GetFindBy2(this.studentInfo.admissionFormId + "?" + this.classId)
            .then(res => {
                this.StudentChallandata = res as Array<IFeeStudentChallan>;
                this.loadScholarship();
                this.getConcessionMarks();
                this.getchallanType();
            })
    }
    getchallanType() {
        this.challantypeser.GetFindBy('e=>e.StatusId==1').then(r => {
            this.challantypelist = r as Array<IFeeChallanType>
            this.challantypeid = this.challantypelist.find(e => e.code == 'Edu').challanTypeId;
        })
    }
    getConcessionMarks() {
        this.concessionmarkrepository.GetFindBy(`e=>e.StatusId==1 && (e.CampusId.ToString() == "` + this.studentInfo.campusId + `")`).then(res => {
            this.concessionremarksmarkslist = res as Array<IVWConcessionRemarksVM>;
        });
    }
    // CheckValidityy(installno, classId) {
    //     this.isInstallmentchecked = true;
    //     this.checkconcession = [];
    //     debugger;
    //     var key = this.studentInfo.admissionFormId + '?' + installno + '?' + classId;
    //     this.AdmissionformService.CheckConcessionValdity(key).then(r => {
    //         this.checkconcession = r as Array<CheckValidity>;
    //         console.log(this.checkconcession);
    //         if (classId == '8931d744-acc9-4776-a03a-2b705038ea48') {
    //             if (installno == '1') {
    //                 this.CheckFeePaid();
    //                 this.checkconcession.forEach(element => {
    //                     if (element.scholarshipCriteriaId == null) {
    //                         this.contrinuation = [];
    //                         this.contrinuation.push("General");
    //                         //this.contrinuation.push("Referral");
    //                     }
    //                     else if (element.scholarshipCriteriaId !== null) {
    //                         this.contrinuation = [];
    //                         //this.contrinuation.push("Referral");
    //                     }
    //                 });
    //             }
    //             else {
    //                 this.checkconcession.forEach(element => {
    //                     if (element.paidDate !== null) {
    //                         if (element.concessionName !== null) {
    //                             this.contrinuation = [];
    //                         }
    //                         else {
    //                             this.contrinuation = [];
    //                             //this.contrinuation.push("Referral");
    //                         }
    //                     }
    //                     else {
    //                         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //                             text: "You Cannot Apply Concession on this Installment, Firstly Pay the Previous Installment ",
    //                             title: "Error",
    //                             messageTypeId: PayloadMessageTypes.warning
    //                         });
    //                         this.contrinuation = [];
    //                         this.data = [];
    //                         this.concessionremarksmarkslist = [];
    //                     }
    //                 });
    //             }
    //         }
    //         else {
    //             if (installno == '1') {
    //                 this.CheckFeePaid();
    //                 this.checkconcession.forEach(element => {
    //                     if (element.concessionName == 'General' || element.concessionName == 'Special' || element.concessionName == 'Referral' || element.concessionName == 'Scholarship') {
    //                         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //                             text: "Concession Already Applied",
    //                             title: "Error",
    //                             messageTypeId: PayloadMessageTypes.warning
    //                         });
    //                         this.contrinuation = [];
    //                     }
    //                     else {
    //                         this.contrinuation = [];
    //                         this.contrinuation.push("Scholarship");
    //                         //this.contrinuation.push("Referral");
    //                         this.contrinuation.push("General");
    //                         this.contrinuation.push("Special");
    //                     }
    //                 });
    //             }
    //             else {
    //                 this.checkconcession.forEach(element => {
    //                     if (element.paidDate !== null) {
    //                         if (element.concessionName !== null) {
    //                             this.contrinuation = [];
    //                         }
    //                         else {
    //                             this.contrinuation = [];
    //                             //this.contrinuation.push("Referral");
    //                         }
    //                     }
    //                     else {
    //                         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //                             text: "You Cannot Apply Concession on this Installment, Firstly Pay the Previous Installment ",
    //                             title: "Error",
    //                             messageTypeId: PayloadMessageTypes.warning
    //                         });
    //                         this.contrinuation = [];
    //                         this.data = [];
    //                         this.concessionremarksmarkslist = [];
    //                     }
    //                 });
    //             }
    //         }
    //     })
    // }
    CheckFeePaid() {
        this.shouldapplyconc = true;
        var key = this.studentInfo.admissionFormId + '?' + this.installno + '?' + this.challantypeid + '?' + this.classId;
        this.AdmissionformService.CheckFeePaidCl(key).then(r => {
            if (r) {
                if (r[0].val > 0) {
                    this.shouldapplyconc = false;
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Challan Paid Concession Cannot Be Applied",
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.warning
                    });
                    this.contrinuation = [];
                }
            }
        })
    }
    loadScholarship() {
        this.scholarshipCriteriaList = [];
        this.scholarshipCriteriaId = '';
        var key =
            this.studentInfo.sessionId +
            "?" +
            this.studentInfo.campusId +
            "?" +
            this.studentInfo.programDetailId +
            "?" +
            this.studentInfo.shiftId +
            "?" +
            this.studentInfo.admissionTypeId;
        this.scholarshipCriteriaRepo.GetAllVMByAdmissionConcession(key)
            .then(r => {
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
        debugger;
        if (this.scholarshipCriteriaList) {
            if (this.scholarshipCriteriaList.length > 0) {
                this.data = this.scholarshipCriteriaList.filter(e => e.continuationPolicyName == cont);
            }
        }
    }
    // filterData(cont, installno) {
    //     debugger;
    //     if (cont !==null && installno == 0) {
    //         this.contrinuation= [];
    //         this.data =null;
    //     }
    //     else {
    //         if (this.scholarshipCriteriaList) {
    //             if (this.scholarshipCriteriaList.length > 0) {
    //                 this.data = this.scholarshipCriteriaList.filter(e => e.continuationPolicyName == cont);
    //             }
    //         }
    //     }
    // }s
    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }]
    IsAppliedConcession() {
        this.newDatas = [];
        this.newDatas.push({ admissionFormId: this.studentInfo.admissionFormId, remarks: this.remarksconcess });
        if (this.StudentChallandata) {
            if (this.StudentChallandata.length > 0) {
                this.AdmissionformService.CheckFeeExemptionByEx(this.studentInfo.admissionFormId + '?' + this.installno + '?' + this.classId).then(res => {
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
                                var response = confirm('Are you sure to Grant Concession to this student');
                                if (response) {
                                    var key = this.scholarshipCriteriaId + "?" + JSON.stringify(this.newDatas) + '?' + this.installno + '?' + this.classId;
                                    this.concessionDetailRepo.ApplyBulkConcession(key).then(r => {
                                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                                            text: "Record has been updated successfully",
                                            title: "Success",
                                            messageTypeId: PayloadMessageTypes.success
                                        });
                                    });
                                }
                                // });
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
            }
        }
        return true;
    }
    get allowSubmit() {
        return (
            this.scholarshipCriteriaId.length > 0 &&
            this.remarksconcess.length > 0 &&
            this.installno > 0 &&
            this.shouldapplyconc == true
        );
    }
}