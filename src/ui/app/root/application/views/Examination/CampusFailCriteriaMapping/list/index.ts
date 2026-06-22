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
import { IExaminationCampusFailCriteriaMapping, IExaminationVWCampusFailCriteria } from '../../../../models/Examination/CampusFailCriteriaMapping';
import { ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampusProgramVM } from '../../../../models';
import { SetupSessionService, SetupCampusService, SetupCampusProgramLinkService } from '../../../../service';
import { ExaminationCampusFailCriteriaMappingDelete } from '../delete';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { FailCriteria } from '../../FailCriteria/list';
import { IExaminationFailCriteria, IExaminationFailMasterCriteria } from '../../../../models/Examination/FailCriteria';
import { ExaminationCampusFailCriteriaMapping } from '../add-edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'CampusFailCriteria-add-edit-model': ExaminationCampusFailCriteriaMapping,
        'delete-model': ExaminationCampusFailCriteriaMappingDelete
    }
})

export class ExaminationCampusFailCriteriaMappingList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ExaminationCampusFailCriteriaMappingService = null;
    private data: Array<IExaminationCampusFailCriteriaMapping> = [];
    private datas: Array<IExaminationVWCampusFailCriteria> = [];


    private sessionList: Array<ISetupSession> = [];
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);

    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private programDDL: Array<DDLGroupModel> = [];
    private ddl: Array<DDLModel> = [];
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

    private failCriteriaList: Array<IExaminationVWCampusFailCriteria> = [];
    private failCriteriaRepo: ExaminationFailCriteriaService = new ExaminationFailCriteriaService(this.$store);

    private sessionId: string = '';
    private campusId: string = '';
    private programDetailId: string = '';
    private failMasterId: string = '';

    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fail_In', caption: 'Fail In' },
        { key: 'failMarks', caption: 'Fail Marks' },
        { key: 'examType', caption: 'Exam Type' },
        { key: 'month', caption: 'Month' },
        { key: 'absentConsiderFail', caption: 'Absent Consider' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    // getMonth(dates:string){
    //     return dates.substr(0,7);
    // }
    created() {
        this.repository = new ExaminationCampusFailCriteriaMappingService(this.$store);
        this.loadSession();
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

    loadFailCriteria() {
        this.failCriteriaList = [];
        this.failCriteriaRepo.GetFindByCampusFailCriteria('e=>e.StatusId==1')
            .then(r => {
                this.failCriteriaList = r as Array<IExaminationVWCampusFailCriteria>
            })
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('campusFailCriteriaMapping' in this.user.claims) == true) {
                if (this.user.claims['campusFailCriteriaMapping'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['campusFailCriteriaMapping'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['campusFailCriteriaMapping'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['campusFailCriteriaMapping'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.programDetailId.length > 0) {
            this.datas = [];
            var key = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
            if (key.length > 0) {
                /// var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId
                this.failCriteriaRepo.GetFindByCampusFailCriteria(key)
                    .then(response => this.datas = (response as Array<IExaminationVWCampusFailCriteria>));
            }
        }
    }

    insertModel() {

        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.programDetailId.length > 0) {
            this.$modal.show('CampusFailCriteria-add-edit-model', { model: { campusFailCriteriaId: '', campusProgramId: this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId, failMasterId: '', statusId: 0, loggerId: '', examTypeId: '', month: new Date() }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: IExaminationVWCampusFailCriteria) {
        this.$modal.show('CampusFailCriteria-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IExaminationVWCampusFailCriteria) {

        this.$modal.show('delete-model', { model: model });
    }
}