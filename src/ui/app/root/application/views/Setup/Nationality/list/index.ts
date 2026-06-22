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

import { ISetupNationality } from '../../../../models';
import { SetupNationalityService } from '../../../../service';

import { SetupNationalityAddEdit } from '../add-edit';
import { SetupNationalityDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupNationalityAddEdit,
        'delete-model': SetupNationalityDelete
    }
})

export class SetupNationalityList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupNationalityService;
    private data: Array<ISetupNationality> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupNationalityService(this.$store);
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
            if (('setupNationality' in this.user.claims) == true) {
                if (this.user.claims['setupNationality'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupNationality'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupNationality'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupNationality'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupNationality>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { nationalityId: '', fullName: '', description: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupNationality) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupNationality) {
        this.$modal.show('delete-model', { model: model });
    }
}