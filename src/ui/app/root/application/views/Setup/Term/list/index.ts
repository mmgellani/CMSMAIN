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

import { ISetupTerm, ISetupTermSessionVM } from '../../../../models';
import { SetupTermService, SetupSessionService } from '../../../../service';

import { SetupTermAddEdit } from '../add-edit';
import { SetupTermDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupTermAddEdit,
        'delete-model': SetupTermDelete
    }
})

export class SetupTermList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupTermService;
    private data: Array<ISetupTerm> = [];
    private dataVM: Array<ISetupTermSessionVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'sessionName', caption: "Session" },
        { key: 'code', caption: "Code" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    created() {
        this.repository = new SetupTermService(this.$store);
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
            if (('setupTerm' in this.user.claims) == true) {
                if (this.user.claims['setupTerm'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupTerm'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupTerm'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupTerm'].indexOf('D') >= 0) {
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
            .then(response => this.dataVM = (response as Array<ISetupTermSessionVM>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { termId: '', fullName: '', sessionId: '', code: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupTerm) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupTerm) {
        this.$modal.show('delete-model', { model: model });
    }
}