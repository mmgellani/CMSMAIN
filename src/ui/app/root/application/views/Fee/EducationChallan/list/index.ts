/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IAdmissionStudents, IAdmissionStudentsImage, IAdmissionAdmissionFormCplVM, IVWAdmissionFormCpl3, IVWStudentsProfile, IVWStudentFeeProfile, ISetupClass } from '../../../../models';
import { AdmissionStudentsService, SetupClassService } from '../../../../service';

import { EducationChallanAddEdit } from '../add-edit';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model':EducationChallanAddEdit
    }
})

export class EducationChallanList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionStudentsService;
    private data: Array<IAdmissionStudents> = [];
    private datas: Array<IVWStudentFeeProfile> = [];
    private filterString: string = '';
    private admissionFormId :string ="";

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private check: boolean = false;
    classId='';
  
    private studentRecord: Array<IVWStudentsProfile> = [];
    private reposstudent: AdmissionStudentsService;
    private classrepo:SetupClassService=new SetupClassService(this.$store);
    classList:Array<ISetupClass>=[];

    private columns = [
        { key: 'refferenceNo', caption: 'Reference No' },
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'fullName', caption: 'Students Name' },
        { key: 'fatherName', caption: 'Father Name' },
        { key: 'description', caption: 'Description' },
        { key: 'section', caption: 'Section' },
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

    getstudent() {
        this.check= true;
        this.studentRecord = [];
        if(this.filterString.length>0 && this.classId.length>0)
        {
        this.reposstudent.GetStudentsDetails(this.filterString+"?"+this.user.userId+"?"+this.classId)
            .then(response => this.studentRecord = (response as Array<IVWStudentsProfile>));
        }
    }
    getAddress(item) {
      var k =  JSON.parse(item);
   //  alert(k);
     return k;


    }
    getclass()
    {
        this.classrepo.GetFindBy('e=>e.StatusId==1').then(r=>{
            this.classList=r as Array<ISetupClass>
        })


    }

    editStudent(model: IVWStudentsProfile) {
        this.$modal.show('edit-model', { model: model, IsNewRecord: false});
    }
    
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('educationChallan' in this.user.claims) == true) {
                if (this.user.claims['educationChallan'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['educationChallan'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['educationChallan'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['educationChallan'].indexOf('D') >= 0) {
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
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false});
    }

    
}