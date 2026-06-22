import { AdmissionAdmissionFormService, AdmissionStudentsService } from '../../../../service';
import { IElUsersModel, KinshipConcession } from '../../../../models/Admission/AdmissionForm';

import Component from 'vue-class-component';
import { IAdmissionStudents } from '../../../../models';
import { MigrationService } from '../../../../service/Migration/migration-service';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { timeStamp } from 'console';
import { trimCharsStart } from 'lodash/fp';

/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/








export interface studentPasswordInfo {
    refferenceNo: string;
    rollNo: string;
    password: string;
    studentid: string;
    fullName: string;


}

@Component({
    name: 'delete-modal',
    template: require('./index.html')
})


export class ElUpdation extends Vue {
    private repository: AdmissionStudentsService;
    private addrep: AdmissionAdmissionFormService;
    private   name='';
    private campusprogramid='';
    private admisionformid='';
    private classid='';
    private list:Array<KinshipConcession>=[];
    private fathername = '';
    private type = '';
    private city = '';
    private session = '';
    private program = '';
    private section = '';
    private scholarshipid='';
    private rollno = '';
    private username='';
    private rolteachid='';
    batch = [{ item: 1,show:'Batch 1' }, { item: 2 ,show:'Batch 2' }, { item: 3 ,show:'Batch 3' }, { item: 4 ,show:'Batch 4' },{ item: 5 ,show:'Batch 5' } ]

  
    private title: string = ' Update Record';


    private data: IElUsersModel = {
        userId: 'b35a8482-a630-11ea-bb37-0242ac130002',
        roleId: '69830c49-30ba-4d1e-ad06-bca0de2fb66a',
        userName: '',
        password: '',
        varification: '',
        isEnable: 0,
        batch: 0

    }

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.addrep = new AdmissionAdmissionFormService(this.$store);
    }

    beforeModalOpen(event) {

        this.rollno = event.params.ReffNO;
        this.name=event.params.NAME;
        this.fathername=event.params.FATHERNAME;
        this.rolteachid=event.params.ROLLTEACHID;
        this.campusprogramid=event.params.CAMPUSPROGRAMID;
        this.admisionformid=event.params.ADMSIONFORMID;
        this.type=event.params.TYPE;
        this.city=event.params.CITY;
        this.session=event.params.SESSION;
        this.program=event.params.PROGRAM;
        this.section=event.params.SECTION;

        this.addrep.GetKinshipConcession(this.campusprogramid).then(r=>{
            this.list= r as Array<KinshipConcession>
        })
        
        



    }

    cancel() {
        this.$modal.hide('el-model');

    }

    UpdateEldata() {
        this.classid='18b9b02e-8213-4883-8cd6-6059ac5aa733';
        var key=this.scholarshipid+'?'+this.admisionformid+'?'+this.classid;
        this.addrep.ApplyConcession(key).then(r=>{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Concession has been Applied SuccessFully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });


            
        })
     

       
    }


}


