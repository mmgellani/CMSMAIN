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

import { ISetupBuildingAddressLink,ISetupBuildingAddressLinkVM } from '../../../../models';
import { SetupBuildingAddressLinkService } from '../../../../service';

import { SetupBuildingAddressLinkAddEdit } from '../add-edit';
import { SetupBuildingAddressLinkDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupBuildingAddressLinkAddEdit,
        'delete-model': SetupBuildingAddressLinkDelete
    }
})

export class SetupBuildingAddressLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupBuildingAddressLinkService;
    private data: Array<ISetupBuildingAddressLinkVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    created() {
        this.repository = new SetupBuildingAddressLinkService(this.$store);
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
            if (('setupBuildingAddressLink' in this.user.claims) == true) {
                if (this.user.claims['setupBuildingAddressLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupBuildingAddressLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupBuildingAddressLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupBuildingAddressLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllVM()
            .then(response => this.data = (response as Array<ISetupBuildingAddressLinkVM>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { addressLinkId: '', addressId: '', statusId: 0, loggerId: '', buildingId: '', preferenceNo: 0,  }, IsNewRecord: true });
    }

    editModel (model : ISetupBuildingAddressLink) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupBuildingAddressLink) {
        this.$modal.show('delete-model', { model: model });
    }
}