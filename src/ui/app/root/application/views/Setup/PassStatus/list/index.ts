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

import { ISetupPassStatus } from '../../../../models';
import { SetupPassStatusService } from '../../../../service';

import { SetupPassStatusAddEdit } from '../add-edit';
import { SetupPassStatusDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupPassStatusAddEdit,
        'delete-model': SetupPassStatusDelete
    }
})

export class SetupPassStatusList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupPassStatusService;
    private data: Array<ISetupPassStatus> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupPassStatusService(this.$store);
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
            if (('setupPassStatus' in this.user.claims) == true) {
                if (this.user.claims['setupPassStatus'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupPassStatus'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupPassStatus'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupPassStatus'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupPassStatus>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { passStatusId: '', fullName: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupPassStatus) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupPassStatus) {
        this.$modal.show('delete-model', { model: model });
    }
}