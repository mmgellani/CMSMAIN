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

import { ISetupBoard } from '../../../../models';
import { SetupBoardService } from '../../../../service';

import { SetupBoardAddEdit } from '../add-edit';
import { SetupBoardDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupBoardAddEdit,
        'delete-model': SetupBoardDelete
    }
})

export class SetupBoardList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupBoardService;
    private data: Array<ISetupBoard> = [];
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
        this.repository = new SetupBoardService(this.$store);
        this.refreshData();
    }

    mounted() {
        this.validatePage();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupBoard' in this.user.claims) == true) {
                if (this.user.claims['setupBoard'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupBoard'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupBoard'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupBoard'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupBoard>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { boardId: '', fullName: '', description: '', provinceId: '', boardTypeId: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupBoard) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupBoard) {
        this.$modal.show('delete-model', { model: model });
    }
}