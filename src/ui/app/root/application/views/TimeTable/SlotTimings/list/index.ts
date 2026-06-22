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

import { ITimeTableSlotTimings, ITimeTableSlotTimingsVM, ISetupSession, ISetupCampus, DDLGroupModel, DDLModel, ICampusCityVM, ITimeTableTimeTableVM } from '../../../../models';
import { TimeTableSlotTimingsService, SetupCampusService, SetupSessionService, TimeTableTimeTableService } from '../../../../service';

import { TimeTableSlotTimingsAddEdit } from '../add-edit';
import { TimeTableSlotTimingsDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': TimeTableSlotTimingsAddEdit,
        'delete-model': TimeTableSlotTimingsDelete
    }
})

export class TimeTableSlotTimingsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: TimeTableSlotTimingsService;
    private data: Array<ITimeTableSlotTimingsVM> = [];
    private TempData: Array<ITimeTableSlotTimingsVM> = [];
    private Campusrepository: SetupCampusService = null;
    private filterString: string = '';
    private campusid: string = '';
    private campusName: string = '';
    private sessionid: string = '';
    private campusList: Array<ISetupCampus> = [];

    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)


    private campusCityList: Array<ICampusCityVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private timeTableModel: Array<ITimeTableTimeTableVM> = [];
    private repositoryTimeTable: TimeTableTimeTableService;

    private columns = [
        // { key: 'campusName', caption: 'Campus' },
        { key: 'campusStartTime', caption: 'Slot Start' },
        { key: 'campusEndTime', caption: 'Slot End' },
        { key: 'fullName', caption: 'Period Name' },
        { key: 'startTime', caption: 'Period Start' },
        { key: 'endTime', caption: "Period End" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new TimeTableSlotTimingsService(this.$store);
        this.Campusrepository = new SetupCampusService(this.$store);
        this.repositoryTimeTable = new TimeTableTimeTableService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.loadCityCampus();
        // this.getTimeTable();
    }

    // getTimeTable() {
    //     this.timeTableModel = [];
    //     this.repositoryTimeTable.GetFindBy('e => e.StatusId!=2')
    //         .then(response => this.timeTableModel = (response as Array<ITimeTableTimeTableVM>));
    // }

    filterData() {
        // alert(this.campusName);

        // this.TempData = this.data.filter(e => e.campusName == this.campusName);


    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('timeTableSlotTimings' in this.user.claims) == true) {
                if (this.user.claims['timeTableSlotTimings'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['timeTableSlotTimings'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['timeTableSlotTimings'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['timeTableSlotTimings'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM()
            .then(r => {
                this.campusCityList = r as Array<ICampusCityVM>

                oldObj = this.campusCityList[0]
                this.campusCityList.forEach(e => {

                    if (e.cityName == oldObj.cityName) {

                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    else {

                        this.cityDDL.push({ title: this.campusCityList[this.campusCityList.indexOf(e) - 1].cityName, group: this.campusddl })
                        this.campusddl = []
                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    oldObj = e;
                })
                this.cityDDL.push({ title: oldObj.cityName, group: this.campusddl })
            })
    }



    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<ITimeTableSlotTimingsVM>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { slotTimingId: '', slotId: '', fullName: '', startTime: '', endTime: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ITimeTableSlotTimings) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ITimeTableSlotTimings) {

        // if (this.timeTableModel.filter(e => e.slotTimingId == model.slotTimingId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }

        // else {
        this.$modal.show('delete-model', { model: model });
        // }

    }
}