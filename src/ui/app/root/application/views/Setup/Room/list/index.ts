/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { ISetupBuilding, ISetupRoom, ISetupRoomBuildingLink, ISetupRoomTypeBuildingVM, ITimeTableTimeTableVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { SetupBuildingService, SetupRoomBuildingLinkService, SetupRoomService, TimeTableTimeTableService } from '../../../../service';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { SetupRoomAddEdit } from '../add-edit';
import { SetupRoomDelete } from '../delete';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Room-add-edit-model': SetupRoomAddEdit,
        'delete-model': SetupRoomDelete
    }
})

export class SetupRoomList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupRoomService;
    private data: Array<ISetupRoomTypeBuildingVM> = [];
    private filterString: string = '';
    BuidingList: Array<ISetupBuilding> = []
    private buildingId = ''

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    //private roomBuildingLinkModel: Array<ISetupRoomBuildingLink> = [];
    private repositoryRoomBuildingLink: SetupRoomBuildingLinkService;
    private timeTableModel: Array<ITimeTableTimeTableVM> = [];
    private repositoryTimeTable: TimeTableTimeTableService;
    private BuildingRepository: SetupBuildingService = null;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'description', caption: "Description" },
        { key: 'capacity', caption: "Capacity" },
        // { key: 'roomTypeName', caption: "RoomType" },
        // { key: 'buildingName', caption: "Building" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupRoomService(this.$store);
        this.repositoryRoomBuildingLink = new SetupRoomBuildingLinkService(this.$store);
        this.repositoryTimeTable = new TimeTableTimeTableService(this.$store);
        this.BuildingRepository = new SetupBuildingService(this.$store);
    }

    mounted() {
        this.validatePage();
        //this.refreshData();
        //  this.getRoomBuildingLink();
        // this.getTimeTable();
        this.loadBuilding();
    }

    // getRoomBuildingLink(){
    //     this.roomBuildingLinkModel = [];
    //     this.repositoryRoomBuildingLink.GetFindBy('e => e.StatusId!=2')
    //     .then(response => this.roomBuildingLinkModel = (response as Array<ISetupRoomBuildingLink>));

    // }

    loadBuilding() {
        this.BuildingRepository.GetFindBy('s=>s.StatusId==1').then(res => {
            this.BuidingList = res as Array<ISetupBuilding>
        });

    }

    // getTimeTable() {
    //     this.timeTableModel = [];
    //     this.repositoryTimeTable.GetFindBy('e => e.StatusId!=2')
    //         .then(response => this.timeTableModel = (response as Array<ITimeTableTimeTableVM>));
    // }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupRoom' in this.user.claims) == true) {
                if (this.user.claims['setupRoom'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupRoom'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupRoom'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupRoom'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('s=>s.BuildingId.ToString()=="' + this.buildingId + '" && s.StatusId != 2')
            .then(response => this.data = (response as Array<ISetupRoomTypeBuildingVM>));
    }

    insertModel() {
        this.$modal.show('Room-add-edit-model', { model: { roomId: '', fullName: '', description: '', capacity: 0, roomTypeId: '', statusId: 0, loggerId: '', buildingId: this.buildingId, }, IsNewRecord: true });
    }

    editModel(model: ISetupRoom) {
        this.$modal.show('Room-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupRoom) {

        this.timeTableModel = [];
        this.repositoryTimeTable.GetTimetablebyroom(model.roomId)
            .then(response => {
                this.timeTableModel = (response as Array<ITimeTableTimeTableVM>)



                if (this.timeTableModel.length > 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: "Record already mapped (So cannot be deleted)",
                        title: "Warning",
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }

                else {
                    this.$modal.show('delete-model', { model: model });
                }
            });
    }
}