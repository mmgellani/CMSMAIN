/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

//import { IRootStoreState } from '../../../../../../store';

import { SeatingPlanDateSheetService, SetupCampusService, SetupSessionService, SetupProgramDetailsService, SetupCampusProgramLinkService } from '../../../../service';
import { ISeatingPlanDateSheet } from '../../../../models/Seating Plan/datesheet';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { SeatingPlanDateSheetDetailService } from '../../../../service/seatingplan/datesheetdetail';
import { ISeatingPlanDateSheetDetail, IVWDateSheetDetail } from '../../../../models/Seating Plan/datesheetdetail';
import { IRootStoreState } from '../../../../../store';
import { DateSheetDetailAddEdit } from '../add-edit';
import { DateSheetDetailDelete } from '../delete';
import { ISetupCampus, ISetupSession, DDLModel, ICampusCityVM, DDLGroupModel, ISetupCampusProgramVM } from '../../../../models';
import { StoreTypes } from '../../../../../../store';



@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': DateSheetDetailAddEdit,
        'delete-model': DateSheetDetailDelete
    }
})

export class seatingPlanDateSheetDetailList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SeatingPlanDateSheetDetailService;
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private data: Array<ISeatingPlanDateSheetDetail> = [];
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private campusProgramId = ''
    private dateSheetId = ''
    private ddl: Array<DDLModel> = []
    private datas: Array<IVWDateSheetDetail> = [];

    private campusCityList: Array<ICampusCityVM> = []
    private datalist: Array<ISeatingPlanDateSheetDetail> = [];

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []


    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private dateSheetList: Array<ISeatingPlanDateSheet> = [];
    // private campusProgramLinkList: Array<ISetupCampusProgramLinkVM> = []


    private programDDL: Array<DDLGroupModel> = []
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store)
    private dateSheetRepo: SeatingPlanDateSheetService = new SeatingPlanDateSheetService(this.$store);

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'examName', caption: 'Exam Name' },
        { key: 'dateSheetDate', caption: "Date" },
        { key: 'fromTime', caption: "From Time" },
        { key: 'toTime', caption: "To Time" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SeatingPlanDateSheetDetailService(this.$store);
        this.loadSession();
        this.datalist = [];
    }
    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    loadDateSheet() {
        if (this.campusProgramId.length > 0) {
            this.dateSheetRepo.GetFindByVM(this.campusProgramId).then(r => {
                this.dateSheetList = r as Array<ISeatingPlanDateSheet>
            });
        }
    }
    // ('e=>e.StatusId==1'
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

    mounted() {
        this.validatePage();
        //this.refreshData();
        //this.getProgramDetails();
    }

    getProgramDetails() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId=1')
            .then(response => this.data = (response as Array<ISeatingPlanDateSheetDetail>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('seatingPlanDateSheetDetailList' in this.user.claims) == true) {
                if (this.user.claims['seatingPlanDateSheetDetailList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['seatingPlanDateSheetDetailList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['seatingPlanDateSheetDetailList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['seatingPlanDateSheetDetailList'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.dateSheetId.length > 0) {
            this.data = [];
            var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramId + '?' + this.dateSheetId
            this.repository.GetAllDateSheetDetailVM(key)
                .then(response => this.datas = (response as Array<IVWDateSheetDetail>));
        }

    }

    insertModel() {
        if (this.dateSheetId.length > 0) {
            this.$modal.show('datesheetdetail-add-edit-model', { model: { dateSheetDetailId: '', dateSheetDate: '', fromTime: '', toTime: '', statusId: 0, dateSheetId: this.dateSheetId, }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select the Dropdowns',
                title: 'Danger',
                messageTypeId: PayloadMessageTypes.error
            });
        }

    }

    editModel(model: ISeatingPlanDateSheetDetail) {
        this.$modal.show('datesheetdetail-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISeatingPlanDateSheetDetail) {
        {
            this.$modal.show('delete-model', { model: model });
        }
    }
}