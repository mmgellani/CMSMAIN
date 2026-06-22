/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { AdmissionStudentsService, SetupClassService } from '../../../../service';
import { IAdmissionAdmissionFormCplVM, IAdmissionStudents, IAdmissionStudentsImage, ISetupClass, IVWAdmissionFormCpl3, IVWStudentFeeProfile, IVWStudentsProfile, StudentsProfileCon } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

// import { AdmissionStudentsAddEdit } from '../add-edit';
// import { AdmissionStudentsDelete } from '../delete';

// import { AdmissionStudentEdit } from '../edit-student';

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': AdmissionStudentsAddEdit,
    //     'edit-model': AdmissionStudentEdit
    // }
})

export class ReverseConcessionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionStudentsService;
    private classrepository: SetupClassService;
    private data: Array<IAdmissionStudents> = [];
    private datas: Array<IVWStudentFeeProfile> = [];
    private filterString: string = '';
    private admissionFormId: string = "";
    private classlist:Array<ISetupClass>=[];
    private classid:string=''

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private installmentNo = 1;

    private studentRecord: Array<StudentsProfileCon> = [];
    private saveStudentRecord: Array<StudentsProfileCon> = [];
    private reposstudent: AdmissionStudentsService;
    private columns = [
        { key: 'refferenceNo', caption: 'Reff #' },
        { key: 'rollNo', caption: "Roll #" },
        { key: 'fullName', caption: "Name" },
        { key: 'action', caption: "Action"}
    ];

    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];
    
    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.reposstudent = new AdmissionStudentsService(this.$store);
        this.classrepository=new SetupClassService(this.$store);
    }

GetClass()
{
    this.classrepository.GetFindBy('e=>e.StatusId==1').then(r=>{
        this.classlist=r as Array<ISetupClass>

    })


}
    mounted() {
        this.validatePage();
        this.GetClass();
    }

    getstudent() {
        this.studentRecord = [];
        this.reposstudent.GetStudentsDetailsC(this.filterString + "?" + this.installmentNo + "?" + this.user.userId)
            .then(response =>
                { 
                    this.studentRecord = response as Array<StudentsProfileCon>
                    if(this.studentRecord.length==0)
                    {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'No Record found',
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.error
                        });




                    }
                });
    }
    getAddress(item) {
        var j='';
        j.toLowerCase().startsWith('error')
        var k = JSON.parse(item);
        alert(k);
        return k;

    }
    
    editStudent(model: StudentsProfileCon) {
        //this.$modal.show('edit-model', { model: model, IsNewRecord: false});
        // var response = confirm('Are you sure to reverse concession?')
        // if (response) {
            var key = model.admissionFormId + '?' + model.challanTypeId + '?' + this.installmentNo+'?'+this.classid;
            this.reposstudent.ReverseConcession(key).then(r => {
                // alert(JSON.stringify(r))
                if(r[0].providedString.toLowerCase().startsWith('error')){
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: r[0].providedString,
                        title: "Error",
                        messageTypeId: PayloadMessageTypes.error
                    });
                }
                else{
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: r[0].providedString,
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.success
                    });
                }
              

            })
        // }
    }
    saveModal(list)
    {
        this.saveStudentRecord = [];
        this.saveStudentRecord = list;
        // alert(JSON.stringify(this.saveStudentRecord))
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeReverseConcessionList' in this.user.claims) == true) {
                if (this.user.claims['feeReverseConcessionList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeReverseConcessionList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeReverseConcessionList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeReverseConcessionList'].indexOf('D') >= 0) {
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

}