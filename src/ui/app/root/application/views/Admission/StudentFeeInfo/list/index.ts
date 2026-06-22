/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';

import { IAdmissionStudents, IAdmissionStudentsImage, IAdmissionAdmissionFormCplVM, IVWAdmissionFormCpl3, IVWStudentsProfile, IVWStudentFeeProfile, StudentChallanINfoData, StudentChallanReportEx, ICampusBank, IFeeCampusChallanNoteLinkVM, IFeeStudentChallan, IFeeBulkModel, IStudentOfSection, ISetupClass, IStudentOfSectionEx } from '../../../../models';
import { AdmissionStudentsService, FeeStudentChallanService, FeeCampusBankLinkService, FeeCampusChallanNoteLinkService, SetupClassService } from '../../../../service';

import { StoreTypes } from '../../../../../../store';
import { StudentFeeInfoAddEdit } from '../add-edit';
export interface IStudentChallanInfo {
    challanNo: string;
    studentName: string;
    concession: string;
    fatherName: string;
    rollNo: string;
    description: string;
    installmentNo: number;
    fullName: string;
    dueDate: string;
    paidDate?: string;
    feeAmount: number;
    exemptionAmount: number;
    refferenceNo: string;
    challanTypeId: string;
    admissionFormId: string;
    className: string;
}export interface IStudentChallanInfonew {
    challanNo: string;
    studentName: string;
    concession: string;
    fatherName: string;
    rollNo: string;
    description: string;
    installmentNo: number;
    fullName: string;
    dueDate: string;
    paidDate?: string;
    feeAmount: number;
    exemptionAmount: number;
    refferenceNo: string;
    challanTypeId: string;
    admissionFormId: string;
    className: string;
    allowButton:boolean;
}
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'challan-info': StudentFeeInfoAddEdit
    }
})

export class AdmissionStudentFeeInfo extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionStudentsService;
    private data: Array<IAdmissionStudents> = [];
    private datas: Array<IVWStudentFeeProfile> = [];
    private filterString: string = '';
    private admissionFormId: string = "";
    private password: string = '';
    private showpassword: boolean = false;
    private studentName: string = '';
    private fatherName: string = '';
    private rollNo: string = '';
    private description: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private classList: Array<ISetupClass> = []

    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private classId = '';

    private studentRecord: Array<IStudentChallanInfonew> = [];
    private reposstudent: AdmissionStudentsService;
    private stdservice: AdmissionStudentsService = new AdmissionStudentsService(this.$store);
    private displayList: Array<IStudentOfSectionEx> = [];
    private columns = [
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'className', caption: 'Class Name' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    viewData(param,classid) {
        this.$modal.show('studentFee-info-model', { filterString: param,classString:  classid})

    }

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.reposstudent = new AdmissionStudentsService(this.$store);
    }

    mounted() {
        this.validatePage();

    //     this.classRepo.GetFindBy('s=>s.StatusId==1')
    // .then(r => {
    // this.classList = r as Array<ISetupClass>
    // this.classId = this.classList.find(s => s.fullName == 'Part-I').classId;
    // })
    }

    loadStudents() {
        this.displayList = []

        if (this.filterString.length > 0) {
            var key = this.filterString + "?" + this.user.userId;
            this.stdservice.GetStudentsByRollNo(key).then(r => {

                this.displayList = r as any;
                // this.displayList = list
                if (this.displayList.length == 0) {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Sorry No Record Found',
                        title: 'Warning',
                        messageTypeId: PayloadMessageTypes.warning
                    })


                }
            })
        }
        else{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Enter Roll No',
                title: 'Warning',
                messageTypeId: PayloadMessageTypes.warning
            })


        }

    }

    getstudent() {
        this.studentRecord = [];
        this.reposstudent.GetStudentFeeInfo(this.filterString).then(r => {
            this.studentRecord = r as Array<IStudentChallanInfonew>
            this.studentName = this.studentRecord[0].studentName
            this.fatherName = this.studentRecord[1].fatherName
            this.rollNo = this.studentRecord[2].rollNo
            this.description = this.studentRecord[3].description
        })
    }
    getAddress(item) {
        var k = JSON.parse(item);
        alert(k);
        return k;


    }

    editStudent(model: IVWStudentsProfile) {
        this.$modal.show('edit-model', { model: model, IsNewRecord: false });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('admissionStudentFeeInfo' in this.user.claims) == true) {
                if (this.user.claims['admissionStudentFeeInfo'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['admissionStudentFeeInfo'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['admissionStudentFeeInfo'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['admissionStudentFeeInfo'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    getPhone(item) {
        return JSON.parse(item);
    }

    editModel(model: IVWStudentsProfile) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }


    ShowPassword(model: IVWStudentsProfile) {
        this.password = '';
        this.repository.GetStudentPassword(model.studentId).then(
            r => {

                if (r.length > 0) {
                    this.password = r[0].providedString;
                    this.$modal.show('student-password-model', { model: model, PASSWORD: this.password });
                }
                else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Student is not Enroll',
                        title: 'Error',
                        messageTypeId: PayloadMessageTypes.error
                    })


                }




            }
        )

    }


}