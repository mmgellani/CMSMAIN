/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { IAdmissionAdmissionFormCplVM, IAdmissionStudents, IAdmissionStudentsImage, IVWAdmissionFormCpl3, IVWStudentFeeProfile, IVWStudentsProfileEx, ISetupClass } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import { AdmissionStudentEdit } from '../edit-student';
import { AdmissionStudentsAddEdit } from '../add-edit';
import { AdmissionStudentsDelete } from '../delete';
import { AdmissionStudentsPassword } from '../studentpassword';
import { AdmissionStudentsService, SetupClassService } from '../../../../service';
import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import { StudentMicrosoftPassword } from '../resetmicrosotfpass';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': AdmissionStudentsAddEdit,
        'edit-model': AdmissionStudentEdit,
        'studentpass': AdmissionStudentsPassword,
        'microsofpass':StudentMicrosoftPassword
    }
})

export class AdmissionStudentsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionStudentsService;
    private data: Array<IAdmissionStudents> = [];
    private datas: Array<IVWStudentFeeProfile> = [];
    private filterString: string = '';
    private admissionFormId: string = "";
    private password: string = '';
    classId='';
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private studentRecord: Array<IVWStudentsProfileEx> = [];
    private reposstudent: AdmissionStudentsService;
    private classrepo:SetupClassService=new SetupClassService(this.$store);
    classList:Array<ISetupClass>=[];



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
private sessionName=''
private fullName=''
    getstudent() {
        this.studentRecord = [];
        if(this.filterString.length>0 && this.classId.length>0)
        {
            this.reposstudent.GetStudentsDetails(this.filterString + "?" + this.user.userId+"?"+this.classId)
            .then(response =>{ this.studentRecord = (response as Array<IVWStudentsProfileEx>)
            if(this.studentRecord.length>0){
                this.sessionName=this.studentRecord[0].sessionName;
                this.fullName=this.studentRecord[0].fullName;
            }
            }
            );

           

        }
        
    }
    getAddress(item) {
        var k = JSON.parse(item);
        
        return k;


    }
    getclass()
    {
        this.classrepo.GetFindBy('e=>e.StatusId==1').then(r=>{
            this.classList=r as Array<ISetupClass>
        })


    }

    editStudent(model: IVWStudentsProfileEx) {
        this.$modal.show('edit-model', { model: model, IsNewRecord: false });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('admissionStudents' in this.user.claims) == true) {
                if (this.user.claims['admissionStudents'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['admissionStudents'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['admissionStudents'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['admissionStudents'].indexOf('D') >= 0) {
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
        var classname=this.classList.find(e=>e.classId==this.classId).fullName;
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false,CLASSID:this.classId,CLASSNAME:classname});
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
                        text: 'Student is not Enroll',
                        title: 'Error',
                        messageTypeId: PayloadMessageTypes.error
                    })


                }




            }
        )

    }

    ResetPassword(model: IVWStudentsProfileEx) {
        this.password = '';
        this.repository.GetStudentPassword(model.studentId).then(
            r => {

                if (r.length > 0) {
                    this.password = r[0].providedString;
                    this.$modal.show('microsof-password-model', { model: model, PASSWORD: this.password,sessionName:this.sessionName,fullName:this.fullName });
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
    // CreatNewUser(model: IVWStudentsProfileEx) {
    //     this.password = '';
    //     this.repository.GetStudentPassword(model.studentId).then(
    //         r => {

    //             if (r.length > 0) {
    //                 this.password = r[0].providedString;
    //                 this.$modal.show('microsof-password-model', { model: model, PASSWORD: this.password,sessionName:this.sessionName,fullName:this.fullName });
    //             }
    //             else {
    //                 this.$store.dispatch(StoreTypes.updateStatusBar, {
    //                     text: 'Student is not Enroll',
    //                     title: 'Error',
    //                     messageTypeId: PayloadMessageTypes.error
    //                 })


    //             }




    //         }
    //     )

    // }

}