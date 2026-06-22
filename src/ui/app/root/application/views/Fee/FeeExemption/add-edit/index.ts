import * as helper from '../../../../helper';

import { AdmissionAdmissionFormService, FeeChallanTypeService, FeeStudentChallanService } from '../../../../service';
import { IFeeChallanType, IFeeStudentChallan, IFeeStudentChallanVM, IFeeSubinstallmentVM, ISetupClass } from '../../../../models';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { PayloadMessageTypes } from '../../../../../../model';
import { SetupClassService } from './../../../../service/Setup/Class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/













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

interface IFeeStudentChallanExemption extends IFeeStudentChallan {

    exemptedAmount: number;
}

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'fee-student-exemption-add-edit-model',
    template: require('./index.html')
})


export class FeeStudentExemptionAddEdit extends Vue {
    private repository: FeeStudentChallanService;
    private clsrepository: SetupClassService;
    classid: string = '';

    private data: Array<IFeeSubinstallmentVM> = [];
    private classlist: Array<ISetupClass> = [];
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
    private title: string = 'Full Fee Challan';
    private admissionformid: string = '';
    private RevertFullFee: boolean = false;
    private FeeChallanTypeService: FeeChallanTypeService = null;
    private ChallanTypeList: Array<IFeeChallanType> = [];
    private challanType: string = '';

    private call: number = 1;

    created() {
        this.AdmissionformService = new AdmissionAdmissionFormService(this.$store);
        this.clsrepository = new SetupClassService(this.$store);
        this.repository = new FeeStudentChallanService(this.$store);
        // this.repository.GetFindBy('e=>e.StatusId==1').then(
        //     res => {

        //         this.StudentChallandata = res as Array<IFeeStudentChallan>
        //     }
        // )
        this.FeeChallanTypeService = new FeeChallanTypeService(this.$store);
        this.clsrepository.GetFindBy('e=>e.StatusId==1').then(r => {
            this.classlist = r as Array<ISetupClass>
        })

    }
    loadFeeChallanType() {
        this.FeeChallanTypeService.GetFindBy('e=>e.StatusId==1').then(r => {
            this.ChallanTypeList = r as Array<IFeeChallanType>
            if (this.ChallanTypeList.length > 0) {
                this.challanType = this.ChallanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')).challanTypeId;
            }
        });
    }

    loadFeeChallanData() {
        this.StudentChallandata = [];

        this.repository.GetData(this.admissionformid).then(
            res => {

                // if(this.StudentChallandata.length<1)
                // {

                this.StudentChallandata = res as Array<IFeeStudentChallan>
                this.filterData();


                //}





            }
        )



    }

    beforeModalOpen(event) {

        // this.$v.$reset();
        this.RevertFullFee = false;
        this.installNo = 1;
        this.Tempdata = [];
        this.StudentChallandata = [];
        this.data = [];
        this.ChallanNoList = [];
        this.TempChallandata = [];
        this.data = event.params.modelVM as Array<IFeeSubinstallmentVM>;
        if (this.data.length > 0) {
            this.admissionformid = this.data[0].admissionFormId;
            this.loadFeeChallanData();
        }


        this.campusid = event.params.campusid;
        this.sessionid = event.params.sessionid;

        this.RefrenceNo = this.data[0].refferenceNo
        this.studentName = this.data[0].fullName
        this.program = this.data[0].description;
        this.exemptionAmount = 0;


        this.loadFeeChallanType();











    }

    // get maxInstallments() {
    //     if (this.data) {
    //         if (this.data.length > 0) {
    //             return this.data.reduce((a, b) => Number(a.installmentNo) > Number(b.installmentNo) ? a : b).installmentNo;
    //         }
    //     }

    //     return 0;
    // }

    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }];

    filterData() {



        //  if(this.call<=2)
        //  {

        if (this.challanType.length > 0 && this.classid.length > 0) {

            this.TempChallandata = [];
            this.Tempdata = [];




            this.Tempdata = this.data.filter(e => e.installmentNo == this.installNo && e.refferenceNo == this.RefrenceNo && e.statusId == 1 && e.classId == this.classid && e.challanTypeId == this.challanType)


            if (this.StudentChallandata.length > 0) {
                this.TempChallandata = this.StudentChallandata.filter(e => e.installmentNo == this.installNo && e.classId == this.classid && e.challanTypeId == this.challanType

                )
                // this.call++;
            }

            //}


        }
    }









    GenerateFullFeeChallan() {


        if (this.Tempdata) {
            if (this.Tempdata.length > 0) {
                var admissonformid = this.Tempdata[0].admissionFormId;
                var key = admissonformid + '?' + this.classid;
                // var response = confirm('Are you sure to Generate Full Fee');
                // if (response) {
                this.repository.GenerateFullFeeChallan(key).then(() => {
                    this.cancel();
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Full Fee Challan Generated successfully",
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.success



                    });
                    this.cancel();
                });
                // }
            }

        }


        this.cancel();



    }

    RevertFeeChallan() {


        if (this.Tempdata) {
            if (this.Tempdata.length > 0) {


                var admissonformid = this.Tempdata[0].admissionFormId;

                var key = this.admissionformid + '?' + this.classid;
                // var response = confirm('Are you sure to Revert Full Fee');
                // if (response) {
                this.repository.RevertFullFeeChallan(key).then(r => {
                    if (r.length > 0) {
                        // alert((r[0].ProvidedString))
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Full Fee Challan Reverted Successfully",
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.success
                        });
                    }
                    this.cancel();
                });
                // }
            }

        }




    }

    SaveFeeExemption() {

        var admissonformid = this.Tempdata[0].admissionFormId;
        // var classid = this.insModel.classId;
        this.AdmissionformService.CheckFeeExemption(admissonformid).then(res => {
            if (res) {
                if (res.length > 0) {
                    if (res[0].val > 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Exemption already Applied, cannot be applied to this student.",
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
                                            text: "Fee Already Paid,Exemption cannot be applied to this student.",
                                            title: "Error",
                                            messageTypeId: PayloadMessageTypes.error
                                        });
                                        return false;
                                    } else {

                                        //data put here
                                        if (this.challanwiseExemption == false) {

                                            if (this.exemptionAmount < this.TempChallandata[0].feeAmount) {

                                                var key = this.Tempdata[0].admissionFormId + '?' + this.Tempdata[0].installmentNo + '?' + this.exemptionAmount + '?' + this.campusid + '?' + this.sessionid + '?' + this.TempChallandata[0].challanNo

                                                this.repository.GenerateExemption(key).then(() => {
                                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                        text: "Fee Exemption has been Generated successfully",
                                                        title: "Success",
                                                        messageTypeId: PayloadMessageTypes.success
                                                    });
                                                    this.cancel();
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

                                        }

                                    }
                                } else {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Fee Exemption cannot be applied to this student.",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error
                                    });
                                    return false;
                                }
                            } else {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Fee Exemption cannot be applied to this student.",
                                    title: "Error",
                                    messageTypeId: PayloadMessageTypes.error
                                });
                                return false;
                            }
                        });
                    }
                } else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Fee Exemption cannot be applied to this student.",
                        title: "Error",
                        messageTypeId: PayloadMessageTypes.error
                    });
                    return false;
                }
            } else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Fee Exemption cannot be applied to this student.",
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
        this.data = [];
        this.StudentChallandata = [];
        this.TempChallandata = [];
        this.Tempdata = [];
        this.$modal.hide('fee-student-exemption-add-edit-model');

    }


    $v: Vuelidate<any>;
}