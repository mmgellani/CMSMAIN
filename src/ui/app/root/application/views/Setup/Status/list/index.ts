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

import { ISetupStatus } from '../../../../models';
import { SetupStatusService } from '../../../../service';

import { SetupStatusAddEdit } from '../add-edit';
import { SetupStatusDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupStatusAddEdit,
        'delete-model': SetupStatusDelete
    }
})

export class SetupStatusList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupStatusService;
    private data: Array<ISetupStatus> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'statusId', caption: 'StatusId' },
        { key: 'status', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupStatusService(this.$store);
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
            if (('setupStatus' in this.user.claims) == true) {
                if (this.user.claims['setupStatus'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupStatus'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupStatus'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupStatus'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupStatus>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { statusId: 0, status: '', loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupStatus) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupStatus) {
        this.$modal.show('delete-model', { model: model });
    }
}