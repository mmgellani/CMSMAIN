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

import { ISetupGroup } from '../../../../models';
import { SetupGroupService } from '../../../../service';

import { SetupGroupAddEdit } from '../add-edit';
import { SetupGroupDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupGroupAddEdit,
        'delete-model': SetupGroupDelete
    }
})

export class SetupGroupList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupGroupService;
    private data: Array<ISetupGroup> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fullName', caption: 'Name' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupGroupService(this.$store);
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
            if (('setupGroup' in this.user.claims) == true) {
                if (this.user.claims['setupGroup'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupGroup'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupGroup'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupGroup'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupGroup>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { groupId: '', fullName: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupGroup) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupGroup) {
        this.$modal.show('delete-model', { model: model });
    }
}