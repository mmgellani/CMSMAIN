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

import { ISetupBoardType, ISetupBoard } from '../../../../models';
import { SetupBoardTypeService, SetupBoardService } from '../../../../service';

import { SetupBoardTypeAddEdit } from '../add-edit';
import { SetupBoardTypeDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'BoardType-add-edit-model': SetupBoardTypeAddEdit,
        'delete-model': SetupBoardTypeDelete
    }
})

export class SetupBoardTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupBoardTypeService;
    private data: Array<ISetupBoardType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private boardModel: Array<ISetupBoard> = [];
    private repoboard: SetupBoardService;

    private columns = [ 
        { key: 'fullName', caption: 'Full Name' }, 
        { key: 'statusId', caption: 'Status'},
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupBoardTypeService(this.$store);
        this.repoboard = new SetupBoardService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getboardtype();
    }

    getboardtype() {
        this.boardModel = [];
        this.repoboard.GetFindBy('e => e.StatusId!=2')
            .then(response => this.boardModel = (response as Array<ISetupBoard>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupBoardType' in this.user.claims) == true) {
                if (this.user.claims['setupBoardType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupBoardType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupBoardType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupBoardType'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupBoardType>));
    }

    insertModel () {
        this.$modal.show('BoardType-add-edit-model', { model: { boardTypeId: '', fullName: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupBoardType) {
        this.$modal.show('BoardType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupBoardType) {
        if(this.boardModel.filter(e => e.boardTypeId == model.boardTypeId).length > 0) {
            alert("This Parent Child Relation Cannot be Deleted");
        }
        else{
        this.$modal.show('delete-model', { model: model });
    }
}
}