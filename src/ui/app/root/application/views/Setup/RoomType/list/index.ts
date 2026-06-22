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

import { ISetupRoomType, ISetupRoom } from '../../../../models';
import { SetupRoomTypeService, SetupRoomService } from '../../../../service';

import { SetupRoomTypeAddEdit } from '../add-edit';
import { SetupRoomTypeDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'RoomType-add-edit-model': SetupRoomTypeAddEdit,
        'delete-model': SetupRoomTypeDelete
    }
})

export class SetupRoomTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupRoomTypeService;
    private data: Array<ISetupRoomType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private roomModel: Array<ISetupRoom> = [];
    private repositoryRoom: SetupRoomService;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupRoomTypeService(this.$store);
        this.repositoryRoom = new SetupRoomService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getRoom();
    }
    getRoom() {
        this.roomModel = [];
        this.repositoryRoom.GetFindBy('e => e.StatusId!=2')
            .then(response => this.roomModel = (response as Array<ISetupRoom>));
    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupRoomType' in this.user.claims) == true) {
                if (this.user.claims['setupRoomType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupRoomType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupRoomType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupRoomType'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e=>e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupRoomType>));
    }

    insertModel() {
        this.$modal.show('RoomType-add-edit-model', { model: { roomTypeId: '', fullName: '', description: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupRoomType) {
        this.$modal.show('RoomType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupRoomType) {
        if (this.roomModel.filter(e => e.roomTypeId == model.roomTypeId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else {
            this.$modal.show('delete-model', { model: model });
        }
    }
}