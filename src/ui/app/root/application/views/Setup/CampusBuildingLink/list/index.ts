/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ISetupCampusBuildingLink } from '../../../../models';
import { SetupCampusBuildingLinkService } from '../../../../service';

import { SetupCampusBuildingLinkAddEdit } from '../add-edit';
import { SetupCampusBuildingLinkDelete } from '../delete';
import { ISetupCampusBuildingLinkVM } from '../../../../models/Setup/CampusBuildingLinkVM';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupCampusBuildingLinkAddEdit,
        'delete-model': SetupCampusBuildingLinkDelete
    }
})

export class SetupCampusBuildingLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupCampusBuildingLinkService;
    private data: Array<ISetupCampusBuildingLinkVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fullName', caption: 'Building Name' },
        { key: 'campusName', caption: "Campus Name" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupCampusBuildingLinkService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupCampusBuildingLink' in this.user.claims) == true) {
                if (this.user.claims['setupCampusBuildingLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupCampusBuildingLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupCampusBuildingLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupCampusBuildingLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllActive()
            .then(response => this.data = (response as Array<ISetupCampusBuildingLinkVM>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { campusBuildingId: '', buildingId: '', campusId: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupCampusBuildingLink) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupCampusBuildingLink) {
        this.$modal.show('delete-model', { model: model });
    }
}