/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { AdmissionAdmissionFormService, SetupCampusService, SetupSessionService, SetupProgramDetailsService, SetupCampusProgramLinkService } from '../../../../service';
import { IAdmissionAdmissionFormCplVM, ISetupCampus, ISetupSession, ISetupCampusProgramVM, ICampusCityVM, DDLGroupModel, DDLModel } from '../../../../models';
import { AddEditProgramTransfer } from '../add-edit';




@Component({
    name: 'stateChange',
    template: require('./index.html'),
    components: {
        'add-edit-model': AddEditProgramTransfer
    }
})

export class StateChange extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;



    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private repository: AdmissionAdmissionFormService;
    private data: Array<IAdmissionAdmissionFormCplVM> = [];
    private Tempdata: Array<IAdmissionAdmissionFormCplVM> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private PassingTempdata: Array<IAdmissionAdmissionFormCplVM> = [];
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private filterString: string = '';

    private campusId = ''
    private sessionId = ''
    private campusProgramId = ''
    private ddl: Array<DDLModel> = []

    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []


    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    // private campusProgramLinkList: Array<ISetupCampusProgramLinkVM> = []


    private programDDL: Array<DDLGroupModel> = []


    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store)

    private columns = [
        { key: 'refferenceNo', caption: 'RefferenceNo' },
        { key: 'fullName', caption: 'StudentName' },
        { key: 'fatherName', caption: "FatherName" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];



    created() {
        this.repository = new AdmissionAdmissionFormService(this.$store);
        this.loadSession();
        this.$watch('sessionId', this.loadCityCampus);
        this.$watch('campusId', this.loadProgramsOfCampus);
        this.$watch('campusProgramId', this.refreshData);
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

    refreshData() {
        this.data = [];
        if (this.sessionId.length > 0 && this.campusId.length > 0) {
            var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramId
            this.repository.GetStudentList(key)
                .then(response => this.data = (response as Array<IAdmissionAdmissionFormCplVM>));
        }
    }
    editModel(refrenceNo: string, admissionFormId: any) {
        this.Tempdata = this.data.filter(e => e.refferenceNo == refrenceNo)
        Object.assign(this.PassingTempdata, this.Tempdata)
        this.$modal.show('add-edit-model', { sessionid: this.sessionId, campusid: this.campusId, modelVM: this.PassingTempdata })
        // this.repository.CheckFeePaid(admissionFormId).then(res => {
        //     if (res) {
        //         if (res.length > 0) {
        //             if (res[0].val == 0) {
        //                 this.$modal.show('add-edit-model', { sessionid: this.sessionId, campusid: this.campusId, modelVM: this.PassingTempdata })
        //             } else {
        //                 alert('cannot change state');
        //             }
        //         }
        //     }
        // });
    }
    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('stateChange' in this.user.claims) == true) {
                if (this.user.claims['stateChange'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['stateChange'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['stateChange'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['stateChange'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


}