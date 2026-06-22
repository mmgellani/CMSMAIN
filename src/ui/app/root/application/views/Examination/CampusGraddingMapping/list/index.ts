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

import { ISetupMedium, ISetupProgramDetails, ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampusProgramVM } from '../../../../models';
import { SetupMediumService, SetupProgramDetailsService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService } from '../../../../service';

import { ExaminationCampusGradingMappingAddEdit } from '../add-edit';
import { ExaminationCampusGradingMappingDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { ExaminationCampusGradingMappingService } from '../../../../service/Examination/CampusGradingMapping';
import { IExaminationCampusGradingMapping, ExaminationCampusGradingMappingVM } from '../../../../models/Examination/CampusGradingMapping';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ExaminationCampusGradingMappingAddEdit,
        'delete-model': ExaminationCampusGradingMappingDelete
    }
})

export class ExaminationCampusGradingMappingList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ExaminationCampusGradingMappingService;
    private data: Array<ExaminationCampusGradingMappingVM> = [];
    private filterString: string = '';
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


    private canRead: boolean = false;
    private sessionId: string = '';
    private campusId: string = '';
    private programDetailId: string = '';
    private campusprogramid: string = '';

    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private programDetailsModel: Array<ISetupProgramDetails> = [];
    private repositoryProgramDetails: SetupProgramDetailsService;

    private columns = [
        { key: 'name', caption: "Name" },
        { key: 'session', caption: 'Session' },
        { key: 'campus', caption: "Campus" },
        { key: 'examType', caption: 'Exam Type' },
        { key: 'month', caption: 'Month' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ExaminationCampusGradingMappingService(this.$store);

    }

    mounted() {
        this.validatePage();

        this.loadSession();

    }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('campusGradingMapping' in this.user.claims) == true) {
                if (this.user.claims['campusGradingMapping'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['campusGradingMapping'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['campusGradingMapping'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['campusGradingMapping'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.programDetailId.length > 0) {
            this.data = [];
            this.campusprogramid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
            this.repository.GetAllVM(this.campusprogramid)
                .then(response => this.data = (response as Array<ExaminationCampusGradingMappingVM>));
        }

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


    insertModel() {
        // this.$modal.show('add-edit-model', { model: { campusGradingLinkId: '', campusProgramId: this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId, gradingMasterId: '', statusId: 1, loggerId: '', examTypeId: '', month: new Date(), }, IsNewRecord: true });
        if (this.programDetailId.length > 0) {
            this.$modal.show('add-edit-model', { model: { campusGradingLinkId: '', campusProgramId: this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId, gradingMasterId: '', statusId: 1, loggerId: '', examTypeId: '', month: new Date(), }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdown",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }

    editModel(obj: ExaminationCampusGradingMappingVM) {
        // this.$modal.show('add-edit-model', { model: obj, IsNewRecord: false });

        if (this.programDetailId.length > 0) {
            this.$modal.show('add-edit-model', { model: obj, IsNewRecord: false });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Drop Down Values First',
                title: 'Warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
    }

    deleteModel(model: IExaminationCampusGradingMapping) {

        this.$modal.show('delete-model', { model: model });
    }

}