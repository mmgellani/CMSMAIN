/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { IVWStudentsProfile, IVWStudentFeeProfile, IFeeChallanType, IFeeFeeHead, ISetupClass } from '../../../../models';
//import { AdmissionStudentEdit } from '../edit';
import { AdmissionStudentsService, FeeChallanTypeService, FeeFeeHeadService, FeeStudentChallanService, SetupClassService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';


type ValidateAdmissionStudents = { model: IVWStudentsProfile, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAdmissionStudents> = {
    model: {
        fullName: { required },
        fatherName: { required },
        studentCNIC: { required },
        parentCNIC: { required },
        genderId: { required },
        dateOfBirth: { required },
        studentContactNo: { required },
        parentContactNo: { required },
        bloodGroupId: { required },
        religionId: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),

})
export class EducationChallanAddEdit extends Vue {
    private isActive: boolean = true;
    private admissionFormId: string = "";
    private repository: AdmissionStudentsService;
    private datas: IVWStudentsProfile = {
        shouldAbsent: false,
        admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
        academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
        studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
        bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "",image:""
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private reposstudent: AdmissionStudentsService;
    private challanTypeList: Array<IFeeChallanType> = []
    private feeHeadList: Array<IFeeFeeHead> = []
    private repoChallanType: FeeChallanTypeService = new FeeChallanTypeService(this.$store)
    private repoFeeHead: FeeFeeHeadService = new FeeFeeHeadService(this.$store)
    private challanTypeId = '';
    private feeHeadId = ''
    private feeHeadName = '';
    private amount = 0;
    private remarks = ''
    private dueDate = new Date();
    private repoStudentchallan: FeeStudentChallanService = new FeeStudentChallanService(this.$store)
    private classList: Array<ISetupClass> = []
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private classId: string = '';
    private hasClass: boolean = false
    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.reposstudent = new AdmissionStudentsService(this.$store);


    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.classList = r as Array<ISetupClass>;
                this.classList=this.classList.filter(s => s.fullName==('Pre 1st Year'));
            })
    }

    loadChallanTypeList() {
        this.repoChallanType.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.challanTypeList = r as Array<IFeeChallanType>
                this.challanTypeList=this.challanTypeList.filter(s => s.fullName.toLowerCase().startsWith('edu'));
                // var index1 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')))
                // this.challanTypeList.splice(index1, 1);
                // var index2 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('trans')))

                // this.challanTypeList.splice(index2, 1);

            })
    }
    loadFeeHeads() {

        if (this.challanTypeId.length > 0) {
            this.repoFeeHead.GetFindBy('s=>s.ChallanTypeId.ToString()=="' + this.challanTypeId + '"')
                .then(r => {
                    this.feeHeadList = r as Array<IFeeFeeHead>
                    //remove Other feehead from list when challan type Other fee is selected
                    if(this.challanTypeId=='9dbb0be3-2082-4839-9f4b-f6d35dbb7b63'){
                        this.feeHeadList= this.feeHeadList.filter(x=>x.feeHeadId!='e71843f9-c855-42a8-8e80-baad997fe25f')
                        //this.feeHeadList.find(s=>s.fullName.trim()=='Other Fee')
                    }
                })

        }
    }

    loadFeeHeadName() {
        this.amount = 0;
        this.feeHeadName = this.feeHeadList.find(s => s.feeHeadId == this.feeHeadId).fullName;
    }


    beforeModalOpen(event) {
        this.loadChallanTypeList();
        this.loadClass();
        //this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        this.title = 'Create Challan';
        Object.assign(this.datas, event.params.model);
        this.IsNewRecord = event.params.IsNewRecord;
        this.admissionFormId = this.datas.admissionFormId;
        // alert(this.admissionFormId);

    }

    save() {
       
        if (this.admissionFormId.length > 0 && this.feeHeadId.length > 0 && this.challanTypeId.length > 0 && this.classId.length > 0) {
            var dated = this.dueDate.getFullYear() + '/' + (this.dueDate.getMonth() + 1) + '/' + this.dueDate.getDate();

            var key = this.admissionFormId + "?" + this.feeHeadId + "?" + this.amount + "?" + dated + "?" + this.challanTypeId + "?" + this.remarks + "?" + this.classId
            console.log(key)
            this.repoStudentchallan.GenerateEducationChallanForPre(key)
                .then(r => {
                    // this.$store.dispatch(StoreTypes.updateStatusBar, {
                    //     text: "Challan Generated Successfully",
                    //     title: "success",
                    //     messageTypeId: PayloadMessageTypes.success
                    // });
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Challan Generated Successfully',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.success
                    });
                    this.cancel();
                })
        }

        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please Select All Values",
                title: "warning",
                messageTypeId: PayloadMessageTypes.warning
            });


        }

    }

    cancel() {
        this.challanTypeId = '';
        this.feeHeadId = ''
        this.dueDate = new Date();
        this.amount = 0;
        this.remarks = ''
        this.$modal.hide('add-edit-model');
        this.$emit("submit");

    }


    $v: Vuelidate<any>;
}
