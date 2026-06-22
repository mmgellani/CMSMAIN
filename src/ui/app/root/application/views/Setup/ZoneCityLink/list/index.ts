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

import { ISetupZoneCityLink, ISetupZoneCityLinkVM, IZoneCityVM } from '../../../../models';
import { SetupZoneCityLinkService } from '../../../../service';

import { SetupZoneCityLinkAddEdit } from '../add-edit';
import { SetupZoneCityLinkDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupZoneCityLinkAddEdit,
        'delete-model': SetupZoneCityLinkDelete
    }
})

export class SetupZoneCityLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupZoneCityLinkService;
    private data: Array<IZoneCityVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'zoneName', caption: 'Zone' },
        { key: 'name', caption: "City" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupZoneCityLinkService(this.$store);
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
            if (('setupZoneCityLink' in this.user.claims) == true) {
                if (this.user.claims['setupZoneCityLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupZoneCityLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupZoneCityLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupZoneCityLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllVMSM()
            .then(response => this.data = (response as Array<IZoneCityVM>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { zoneCityId: '', zoneId: '', subCityId: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupZoneCityLink) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupZoneCityLink) {
        this.$modal.show('delete-model', { model: model });
    }
}