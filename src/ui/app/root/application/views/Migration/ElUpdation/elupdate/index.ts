import { AdmissionStudentsService, SetupCampusProgramLinkService, SetupProgramService,SetupBatchService } from '../../../../service';
import Component from 'vue-class-component';
import { IAdmissionStudents, ISetupCampusProgramVM,BatchData } from '../../../../models';
import { IElUsersModel } from './../../../../models/Admission/AdmissionForm';
import { MigrationService } from './../../../../service/Migration/migration-service';
import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { IVWCampusBaseProgram } from '../../../../models/Setup/CampusBaseProgram';

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
    private migrep: MigrationService;
    private batchno = 0;
    private batchId = 0;
    private varification = '';
    private rollno = '';
    private batchid= '';
    private username = '';
    private isnew = true;
    private batchLinkList:Array<BatchData> = []
    private batchRepo: SetupBatchService = new SetupBatchService(this.$store)

    //batch = [{ item: 1,show:'Batch 1' }, { item: 2 ,show:'Batch 2' }, { item: 3 ,show:'Batch 3' }, { item: 4 ,show:'Batch 4' },{ item: 5 ,show:'Batch 5' },{ item: 6 ,show:'Batch 6' },{ item: 7 ,show:'Batch 7' }, { item: 8 ,show:'Batch 8' }, { item: 9 ,show:'Batch 9' },  { item: 10 ,show:'Batch 10' }, { item: 11 ,show:'Batch 11' }, { item: 12 ,show:'Batch 12' }, { item: 13 ,show:'Batch 13' }, { item: 14 ,show:'Batch 14' }, { item: 15 ,show:'Batch 15' }, { item: 16 ,show:'Batch 16' }, { item: 17 ,show:'Batch 17' }, { item: 18 ,show:'Batch 18' }, { item: 19 ,show:'Batch 19' }, { item: 20 ,show:'Batch 20' } ]

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private title: string = ' Update Record';

    private name: string = '';

    private data: IElUsersModel = {
        userId: 'b35a8482-a630-11ea-bb37-0242ac130002',
        roleId: '69830c49-30ba-4d1e-ad06-bca0de2fb66a',
        userName: '',
        password: '',
        varification: '',
        isEnable: 0,
        batch: 0

    }
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    campusId: string = '';
    sessionId: string = ''

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.migrep = new MigrationService(this.$store);
    }
    // loadPrograms() {
    //     this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
    //         .then(r => {
    //             this.programList = r as Array<IVWCampusBaseProgram>
    //             this.programList.forEach(s=>{
    //                 var si=s.programName.indexOf('(')
    //                 //var ei=s.programName.indexOf(')')
    //                 s.programName=s.programName.slice(0,si)
    //             })
    //         })
    // }

    loadProgramsOfCampus() {


        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVMEx2(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
           
        });
    }
    beforeModalOpen(event) {

        this.rollno = event.params.ROLNO;
        this.campusId = event.params.campusId;
        this.sessionId = event.params.sessionId;
        this.loadProgramsOfCampus()
        this.loadBatch();
       
        this.varification = '';
        this.username = this.rollno + '@cms.edu.pk'
        this.migrep.GetElUpdatedData(this.rollno).then(r => {

            if (r) {
                this.isnew = false
                this.data = r as IElUsersModel
                this.batchId = r.batch;
                this.varification = r.varification
            }
            else {
                this.isnew = true;
            }


        })




    }

               
    loadBatch() {
        this.batchRepo.GetFindBy('e=>e.StatusId==1')
        .then(r => {
            this.batchLinkList= r as Array<BatchData>
        })

        
    }

    cancel() {
        this.$modal.hide('el-model');

    }

    UpdateEldata() {

        var pass = this.rollno.substr(this.rollno.length - 5).toString();
        debugger;
        if (this.isnew == true) {
            this.data = {
                
                userId: 'b35a8482-a630-11ea-bb37-0242ac130002',
                roleId: '69830c49-30ba-4d1e-ad06-bca0de2fb66a',
                userName: this.rollno + '@cms.edu.pk',
                password: 'Pu' + pass,
                isEnable: 1,
                varification: this.varification,
                batch: this.batchId
            }
            this.migrep.InsertElXData(this.data).then(r => {

                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "El Data Updated SuccessFully",
                    title: '',
                    messageTypeId: PayloadMessageTypes.success
                });


            })
        }
        else {

            this.data.varification = this.varification;
            this.data.batch = this.batchId;
            this.migrep.UpdateElData(this.data).then(r => {

                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "El Data Updated SuccessFully",
                    title: '',
                    messageTypeId: PayloadMessageTypes.success
                });


            })


        }


    }


}


