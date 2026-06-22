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

// import { SetupMediumAddEdit } from '../add-edit';
// import { SetupMediumDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { ExaminationCampusFailCriteriaMappingService } from '../../../../service/Examination/CampusFailCriteriaMapping';
// import { ISessionDuration, IVWSessionDuration } from '../../../../models/Examination/CampusFailCriteriaMapping';
import { ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampusProgramVM, ISetupClass } from '../../../../models';
import { SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupClassService } from '../../../../service';
import { SessionDurationDelete } from '../delete';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
// import { FailCriteria } from '../../FailCriteria/list';
import { IExaminationFailCriteria, IExaminationFailMasterCriteria } from '../../../../models/Examination/FailCriteria';
import { SessionDuration } from '../add-edit';
import { SessionDurationService } from '../../../../service/Attendance/SessionDuration';
import { ISessionDuration, IVWSessionDuration } from '../../../../models/Attendance/SessionDuration';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'SessionDuration-add-edit-model': SessionDuration,
        'delete-model': SessionDurationDelete
    }
})

export class SessionDurationList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SessionDurationService = null;
    private data: Array<ISessionDuration> = [];
    private datas: Array<IVWSessionDuration> = [];


    private sessionList: Array<ISetupSession> = [];
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);

    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private programDDL: Array<DDLGroupModel> = [];
    private ddl: Array<DDLModel> = [];
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private classList: Array<ISetupClass> = []

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private failCriteriaList: Array<IVWSessionDuration> = [];
    private failCriteriaRepo: ExaminationFailCriteriaService = new ExaminationFailCriteriaService(this.$store);

    private sessionId: string = '';
    private campusId: string = '';
    private classId: string = '';

    private programDetailId: string = '';
    private failMasterId: string = '';

    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'startDate', caption: 'Start Date' },
        { key: 'endDate', caption: 'End Date' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    // getMonth(dates:string){
    //     return dates.substr(0,7);
    // }
    created() {
        this.repository = new SessionDurationService(this.$store);
        this.loadSession();
        this.loadClass();
    }

    loadClass() {
            this.classRepo.GetFindBy('s=>s.StatusId==1')
                .then(r => { this.classList = r as Array<ISetupClass> });

    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    loadCityCampus() {
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
    }

    loadProgramsOfCampus() {
        if (this.campusId.length > 0) {
            this.ddl = [];
            this.programDDL = [];
            let oldObj: ISetupCampusProgramVM;
            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }
    }

    // loadFailCriteria() {
    //     this.failCriteriaList = [];
    //     this.failCriteriaRepo.GetFindByCampusFailCriteria('e=>e.StatusId==1')
    //         .then(r => {
    //             this.failCriteriaList = r as Array<IVWSessionDuration>
    //         })
    // }

    mounted() {
        this.validatePage();
        // this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('sessionDuration' in this.user.claims) == true) {
                if (this.user.claims['sessionDuration'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['sessionDuration'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['sessionDuration'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['sessionDuration'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.programDetailId.length > 0 && this.classId.length > 0) {
            this.datas = [];
            var key = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId + '?' + this.classId;
            if (key.length > 0) {
                /// var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId
                this.repository.GetFindByVM(key)
                    .then(response => this.datas = (response as Array<IVWSessionDuration>));
            }
        }
    }

    insertModel() {

        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0) {
            this.$modal.show('SessionDuration-add-edit-model', { model: { sessionDurationId: '', campusProgramId: this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId, classId: this.classId, startDate: new Date(), endDate: new Date(), statusId: 0 }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: IVWSessionDuration) {
        this.$modal.show('SessionDuration-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IVWSessionDuration) {

        this.$modal.show('delete-model', { model: model });
    }
}