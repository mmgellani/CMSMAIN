// import Vue from 'vue';
// import { State } from 'vuex-class';
// import Component from 'vue-class-component';



// @Component({
//     name: 'models-form-list',
//     template: require('./index.html'),
  
// })

// export class BoardUniversitySearchStudent extends Vue {
   
// }

/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { IAdmissionAdmissionFormCplVM, IAdmissionStudents, IAdmissionStudentsImage, IVWAdmissionFormCpl3, IVWStudentFeeProfile, IVWStudentsProfileEx, ISetupClass } from '../../../models';
import { IBoardStudentBoardLink, StudentBoardLinkData, StudentBoardRegistration, StudentBoardExamEntry,StudentBoardUnivertySearch } from '../../../models/Board/StudentBoardLink';
import { IUser, PayloadMessageTypes } from '../../../../../model';

// import { AdmissionStudentEdit } from '/../../edit-student';
// import { AdmissionStudentsAddEdit } from '../add-edit';
// import { AdmissionStudentsDelete } from '../delete';
// import { AdmissionStudentsPassword } from '../studentpassword';
import { AdmissionStudentsService, SetupClassService } from '../../../service';
import { BoardStudentBoardLinkService } from '../../../service/Board/BoardStudentBoardLink';
import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../store';
//import { StudentMicrosoftPassword } from '../resetmicrosotfpass';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        // 'add-edit-model': AdmissionStudentsAddEdit,
        // 'edit-model': AdmissionStudentEdit
        //'studentpass': AdmissionStudentsPassword,
        //'microsofpass':StudentMicrosoftPassword
    }
})

export class BoardUniversitySearchStudent extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: BoardStudentBoardLinkService;
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

    //private studentRecord: Array<IVWStudentsProfileEx> = [];
    private studentRecord:Array<StudentBoardUnivertySearch>=[];
    private reposstudent: BoardStudentBoardLinkService;
    private classrepo:SetupClassService=new SetupClassService(this.$store);
    classList:Array<ISetupClass>=[];
    //StudentBoardLink



    private columns = [
        { key: 'rollNo', caption: 'Student ID' },
        { key: 'regNo', caption: 'Registration No' },
        { key: 'student', caption: 'Student Name' },
        { key: 'fatherName', caption: 'father Name' },
        { key: 'examType', caption: 'Exam Type' },
         { key: 'year', caption: 'Exam Year' },
         { key: 'rolln', caption: 'Board/University Roll No' }
        
         
        //  { key: 'action', caption: 'Action', width: 120 }

    ];



    created() {
        this.repository = new BoardStudentBoardLinkService(this.$store);
        this.reposstudent = new BoardStudentBoardLinkService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.getclass();
    }

    getstudent() {

       
        this.studentRecord = [];
        if(this.filterString.length>0 && this.classId.length>0)
        {
            this.reposstudent.GetBoardUniversitySearch(this.filterString + "?" + this.user.userId+"?"+this.classId)
            .then(response => this.studentRecord = (response as Array<StudentBoardUnivertySearch>));

//alert("ok")

            //  var key=this.sessionId+'?'+this.campusId+'?'+this.programId+'?'+this.classId+'?'+this.programDetailIdEx+'?'+this.examtypeid+'?'+this.year+'?'+this.registrationCodeId
            //  this.repository.GetBoardUniversityExamEx(key).then(r=>{
            //   this.studentRecord= r as Array<StudentBoardUnivertySearch>
    
          



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
            if (('boardUniversitySearchStudent' in this.user.claims) == true) {
                if (this.user.claims['boardUniversitySearchStudent'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['boardUniversitySearchStudent'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['boardUniversitySearchStudent'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['boardUniversitySearchStudent'].indexOf('D') >= 0) {
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
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false,CLASSID:this.classId });
    }

    // ShowPassword(model: IVWStudentsProfileEx) {
    //     this.password = '';
    //     this.repository.GetStudentPassword(model.studentId).then(
    //         r => {

    //             if (r.length > 0) {
    //                 this.password = r[0].providedString;
    //                 this.$modal.show('student-password-model', { model: model, PASSWORD: this.password });
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

    // ResetPassword(model: IVWStudentsProfileEx) {
    //     this.password = '';
    //     this.repository.GetStudentPassword(model.studentId).then(
    //         r => {

    //             if (r.length > 0) {
    //                 this.password = r[0].providedString;
    //                 this.$modal.show('microsof-password-model', { model: model, PASSWORD: this.password });
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