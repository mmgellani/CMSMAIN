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

import { ISetupRoomBuildingLink, ISetupRoomTypeBuildingVM, ISetupCampus, DDLGroupModel, DDLModel, ICampusCityVM, RoomBuildingLinkVM } from '../../../../models';
import { SetupRoomBuildingLinkService, SetupCampusService } from '../../../../service';

import { SetupRoomBuildingLinkAddEdit } from '../add-edit';
import { SetupRoomBuildingLinkDelete } from '../delete';
import { StoreTypes } from "../../../../../../store";


@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupRoomBuildingLinkAddEdit,
        'delete-model': SetupRoomBuildingLinkDelete
    }
})

export class SetupRoomBuildingLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupRoomBuildingLinkService;
    private data: Array<RoomBuildingLinkVM> = [];
    private filterString: string = '';

    private campusId = ''
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private campusList: Array<ISetupCampus> = [];

    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'fullName', caption: 'BuildingName' },
        { key: 'name', caption: "RoomName" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupRoomBuildingLinkService(this.$store);
        this.loadCityCampus();
    }

    mounted() {
        this.validatePage();
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupRoomBuildingLink' in this.user.claims) == true) {
                if (this.user.claims['setupRoomBuildingLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupRoomBuildingLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupRoomBuildingLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupRoomBuildingLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.campusId.length > 0) {
            this.repository.GetAllRoomBuildingLink(this.campusId)
                .then(response => {
                    this.data = (response as Array<RoomBuildingLinkVM>)

                }

                );
        }
    }

    insertModel() {

        if (this.campusId.length > 0) {
            var subCityId = this.campusCityList.find(e => e.campusId == this.campusId).subCityId;
            this.$modal.show('add-edit-model', { model: { roomBuildingLinkId: '', roomId: '', buildingId: '', remarks: '', statusId: 0, loggerId: '', }, SubCityId: subCityId, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdown",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }

    }

    editModel(model: ISetupRoomBuildingLink) {
        var subCityId = this.campusCityList.find(e => e.campusId == this.campusId).subCityId;

        this.$modal.show('add-edit-model', { model: model, SubCityId: subCityId, IsNewRecord: false });
    }

    deleteModel(model: ISetupRoomBuildingLink) {
        model.loggerId = '079fe61a-be3b-494d-ba62-81be6896284c';
        this.$modal.show('delete-model', { model: model });
    }
}