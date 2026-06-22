/*
*   Author: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IAdmissionStudents, IAdmissionStudentsImage, IAdmissionAdmissionFormCplVM, IVWAdmissionFormCpl3, IVWStudentsProfileEx, IVWStudentFeeProfile, ISetupClass } from '../../../../models';
import { AdmissionStudentsService, SetupClassService } from '../../../../service';

import { StoreTypes } from '../../../../../../store';
import { AdmissionPreAcademicInfoEdit } from '../edit-student';


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'edit-model': AdmissionPreAcademicInfoEdit
    }
})

export class AdmissionPreAcademicInfoList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionStudentsService;
    private data: Array<IAdmissionStudents> = [];
    private datas: Array<IVWStudentFeeProfile> = [];
    private filterString: string = '';
    private admissionFormId: string = "";
    private password: string = '';
    private   classId='';
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private studentRecord: Array<IVWStudentsProfileEx> = [];
    private reposstudent: AdmissionStudentsService;
    classList:Array<ISetupClass>=[];
    private classrepo:SetupClassService=new SetupClassService(this.$store);




    private columns = [
        { key: 'refferenceNo', caption: 'Refference No' },
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'fatherName', caption: 'father Name' },
        { key: 'description', caption: 'Description' },
        { key: 'action', caption: 'Action', width: 120 }
    ];



    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.reposstudent = new AdmissionStudentsService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.getclass();
    }

    getclass()
    {
        this.classrepo.GetFindBy('e=>e.StatusId==1').then(r=>{
            this.classList=r as Array<ISetupClass>
        })


    }

    getstudent() {
        this.studentRecord = [];
        if (this.filterString.length > 0 && this.classId.length > 0) {
            this.reposstudent.GetStudentsDetails(this.filterString + "?" + this.user.userId + "?" + this.classId)
                .then(response => this.studentRecord = (response as Array<IVWStudentsProfileEx>));
        }
    }
    getAddress(item) {
        var k = JSON.parse(item);
        return k;
    }

    editStudent(model: IVWStudentsProfileEx) {
        this.$modal.show('edit-model', { model: model, IsNewRecord: false });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('admissionPreAcademicInfo' in this.user.claims) == true) {
                if (this.user.claims['admissionPreAcademicInfo'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['admissionPreAcademicInfo'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['admissionPreAcademicInfo'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['admissionPreAcademicInfo'].indexOf('D') >= 0) {
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

    editModel(model: IVWStudentsProfileEx) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    ShowPassword(model: IVWStudentsProfileEx) {
        this.password = '';
        this.repository.GetStudentPassword(model.studentId).then(
            r => {
                if (r.length > 0) {
                    this.password = r[0].providedString;
                    this.$modal.show('student-password-model', { model: model, PASSWORD: this.password });
                }
                else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Student is not Enrolled',
                        title: 'Error',
                        messageTypeId: PayloadMessageTypes.error
                    })
                }
            }
        )
    }
}