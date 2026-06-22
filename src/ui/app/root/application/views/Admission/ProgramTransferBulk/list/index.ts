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
import { AdmissionAdmissionFormService, SetupCampusService, SetupSessionService, SetupProgramDetailsService, SetupCampusProgramLinkService, SetupClassService } from '../../../../service';
import { IAdmissionAdmissionFormCplVM, ISetupCampus, ISetupSession, ISetupCampusProgramVM, ICampusCityVM, DDLGroupModel, DDLModel, ISetupClass, TransferList, TransferListEx } from '../../../../models';
import { AddEditProgramTransfer } from '../add-edit';
import { HumanResourceStaffAddEdit } from '../../../HumanResource/Staff/add-edit';
import { StoreTypes } from '../../../../../../store';




@Component({
    name: 'programTransfer',
    template: require('./index.html'),
    components: {
        'add-edit-model': AddEditProgramTransfer
    }
})

export class ProgramTransferBulk extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;



    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private repository: AdmissionAdmissionFormService;
    private data: Array<TransferListEx> = [];
    private Tempdata: Array<TransferListEx> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private PassingTempdata: Array<IAdmissionAdmissionFormCplVM> = [];
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private filterString: string = '';

    private campusId = ''
    private classid = ''
    private sessionId = ''
    private campusProgramId = ''
    private ddl: Array<DDLModel> = []

    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []


    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private classList: Array<ISetupClass> = []
    // private campusProgramLinkList: Array<ISetupCampusProgramLinkVM> = []


    private programDDL: Array<DDLGroupModel> = []


    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store)
    chkall = false;


    private columns = [
        { key: 'refferenceNo', caption: 'RefferenceNo', sort: true },
        { key: 'fullName', caption: 'StudentName', sort: true },
        { key: 'fatherName', caption: "FatherName" },
        { key: 'isChecked', caption: 'Select' }
    ];



    created() {
        this.repository = new AdmissionAdmissionFormService(this.$store);
        this.loadSession();
        this.loadclass();
        this.$watch('sessionId', this.loadCityCampus);
        this.$watch('campusId', this.loadProgramsOfCampus);
        this.$watch('classid', this.refreshData);
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }
    mounted() {
        this.validatePage();

    }

    loadclass() {
        this.classRepo.GetFindBy('e=>e.StatusId==1').then(r => {

            this.classList = r as Array<ISetupClass>
        })
    }

    refreshData() {
        this.data = [];
        if (this.sessionId.length > 0 && this.campusId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramId + '?' + this.classid
            this.repository.GetStudentList(key)
                .then(response => {
                    this.data = response as Array<TransferListEx>

                    this.data.forEach(element => {
                        element.isChecked = false;

                    });
                    console.log(JSON.stringify(this.data))
                });
        }
    }

    updall() {
        if (this.chkall == true) {
            this.data.forEach(element => {
                element.isChecked = true;

            });
        }
        if (this.chkall == false) {
            this.data.forEach(element => {
                element.isChecked = false;

            });


        }


    }
    check(item:TransferListEx) {
        
        if (this.data.filter(e => e.isChecked == true).length > 2) {
           var index=this.data.indexOf(item);
            this.data[index].isChecked = false;
            console.log(this.data.filter(e => e.isChecked == true).length)
        }
    }
   
    editModel() {

        this.Tempdata = this.data.filter(e => e.isChecked == true)
        if(this.Tempdata.length>10){
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Selection should be less than 10',
                title: 'Error',
                messageTypeId: PayloadMessageTypes.error
            })
            return;
        }
        if (this.Tempdata.length > 0) {
            Object.assign(this.PassingTempdata, this.Tempdata)



            this.$modal.show('add-edit-model', { sessionid: this.sessionId, campusid: this.campusId, modelVM: this.PassingTempdata })
        }else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please select students to transfer',
                title: 'Error',
                messageTypeId: PayloadMessageTypes.error
            })
        }
    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('ProgramTransferBulk' in this.user.claims) == true) {
                if (this.user.claims['ProgramTransferBulk'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['ProgramTransferBulk'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['ProgramTransferBulk'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['ProgramTransferBulk'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


}