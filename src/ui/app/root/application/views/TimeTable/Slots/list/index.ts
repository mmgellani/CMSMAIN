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

import { ITimeTableSlots, ITimeTableSlotTimingsVM } from '../../../../models';
import { TimeTableSlotsService, TimeTableSlotTimingsService } from '../../../../service';

import { TimeTableSlotsAddEdit } from '../add-edit';
import { TimeTableSlotsDelete } from '../delete';
import { ITimeTableSlotsVM } from '../../../../models/TimeTable/SlotsVM';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Slots-add-edit-model': TimeTableSlotsAddEdit,
        'delete-model': TimeTableSlotsDelete
    }
})

export class TimeTableSlotsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: TimeTableSlotsService;
    private data: Array<ITimeTableSlotsVM> = [];

    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private slotTimingsModel: Array<ITimeTableSlotTimingsVM> = [];
    private repositorySlotTimings: TimeTableSlotTimingsService;

    private columns = [
        { key: 'name', caption: 'Shift Name' },
        { key: 'startTime', caption: 'Start Time' },
        { key: 'endTime', caption: "End Time" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new TimeTableSlotsService(this.$store);
        this.repositorySlotTimings = new TimeTableSlotTimingsService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getSlotTimings();
    }

    getSlotTimings() {
        this.slotTimingsModel = [];
        this.repositorySlotTimings.GetFindBy('e => e.StatusId!=2')
            .then(response => this.slotTimingsModel = (response as Array<ITimeTableSlotTimingsVM>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('timeTableSlots' in this.user.claims) == true) {
                if (this.user.claims['timeTableSlots'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['timeTableSlots'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['timeTableSlots'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['timeTableSlots'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllAsync()
            .then(response => this.data = (response as Array<ITimeTableSlotsVM>));
    }

    insertModel() {
        this.$modal.show('Slots-add-edit-model', { model: { slotId: '', shiftId: '', startTime: '', endTime: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ITimeTableSlots) {
        this.$modal.show('Slots-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ITimeTableSlots) {

        // if (this.slotTimingsModel.filter(e => e.slotId == model.slotId).length > 0) {
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