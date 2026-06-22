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

import { ISetupBuilding, ISetupBuildingAddressLink, ISetupRoom, ISetupRoomBuildingLink, SetupBuildingAddressPossessionVM } from '../../../../models';
import { SetupBuildingService, SetupRoomService, SetupRoomBuildingLinkService } from '../../../../service';

import { SetupBuildingAddEdit } from '../add-edit';
import { SetupBuildingDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Building-add-edit-model': SetupBuildingAddEdit,
        'delete-model': SetupBuildingDelete
    }
})

export class SetupBuildingList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupBuildingService;
    private data: Array<SetupBuildingAddressPossessionVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private roomModel: Array<ISetupRoom> = [];
    private repositoryRoom: SetupRoomService;
    private roomBuildingLinkModel: Array<ISetupRoomBuildingLink> = [];
    private repositoryRoomBuildingLink: SetupRoomBuildingLinkService;

    private columns = [
        { key: 'buildingName', caption: 'Building Name' },
        { key: 'address', caption: "Address" },
        { key: 'postalCode', caption: "Postal Code" },
        { key: 'fullName', caption: "Possession" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupBuildingService(this.$store);
        this.repositoryRoom = new SetupRoomService(this.$store);
        this.repositoryRoomBuildingLink = new SetupRoomBuildingLinkService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getRoom();
        this.getRoomBuildingLink();
    }

    getRoom() {
        this.roomModel = [];
        this.repositoryRoom.GetFindBy('e => e.StatusId!=2')
            .then(response => this.roomModel = (response as Array<ISetupRoom>));
    }

    getRoomBuildingLink() {
        this.roomBuildingLinkModel = [];
        this.repositoryRoomBuildingLink.GetFindBy('e => e.StatusId!=2')
            .then(response => this.roomBuildingLinkModel = (response as Array<ISetupRoomBuildingLink>));

    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupBuilding' in this.user.claims) == true) {
                if (this.user.claims['setupBuilding'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupBuilding'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupBuilding'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupBuilding'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<SetupBuildingAddressPossessionVM>));
    }

    insertModel() {
        this.$modal.show('Building-add-edit-model', {
            model: {
                buildingId: "",
                fullName: "",
                addressId: "",
                possessionId: "",
                statusId: 0,
                loggerId: "",
                phoneNo: "",
                coordinate: "",
                subCityId: ""
            }, IsNewRecord: true
        });
    }

    editModel(model) {
        this.$modal.show('Building-add-edit-model', { model: { buildingId: model.buildingId, fullName: model.buildingName, addressId: model.addressId, possessionId: model.possessionId, statusId: model.statusId, loggerId: model.loggerId, phoneNo: model.phoneNo, coordinate: model.coordinate, subCityId: model.subCityId }, IsNewRecord: false });
    }

    deleteModel(model: ISetupBuilding) {
        if (this.roomModel.filter(e => e.buildingId == model.buildingId).length > 0 || this.roomBuildingLinkModel.filter(e => e.buildingId == model.buildingId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped (So cannot be deleted)",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else {
            this.$modal.show('delete-model', { model: model });
        }
    }
}