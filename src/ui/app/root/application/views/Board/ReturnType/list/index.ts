/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

// import { IUser, PayloadMessageTypes } from '../../../../../../model';
// import { IRootStoreState } from '../../../../../store';

// import { ISetupMedium, ISetupProgramDetails } from '../../../../models';
// import { SetupMediumService, SetupProgramDetailsService } from '../../../../service';
// import { StoreTypes } from '../../../../../../store';
import { BoardBoardCampusService } from '../../../../service/Board/BoardCampus';
import { IBoardBoardCampus } from '../../../../models/Board/BoardCampus';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import {    BoardReturnTypeAddEdit } from '../add-edit';
import {   BoardReturnTypeDelete } from '../delete';
import { ISetupBoard } from '../../../../models/Setup/Board';
import { SetupBoardService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';
import { ISessionBoardFee, ISessionBoardFeeVM } from '../../../../models/Board/sessionboardfee';
import { SessionBoardFeeService } from '../../../../service/Board/sessionboardfee';
import { ReturnTypeService } from '../../../../service/Board/ReturnType';
import { IBoardExamType } from '../../../../models/Board/BoardExamType';
import { IReturnType } from '../../../../models/Board/ReturnType';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': BoardReturnTypeAddEdit,
        'delete-model': BoardReturnTypeDelete
    }
})

export class ReturnTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ReturnTypeService;
    private data: Array<IReturnType> = [];
    private filterString: string = "";
    private boardId: string = '';
    private boardList: Array<ISetupBoard> = [];
    private boardRepo: SetupBoardService = new SetupBoardService(this.$store);


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fullName', caption: 'Return Type ' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ReturnTypeService(this.$store);
        //this.loadBoard();
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
            if (('boardreturntype' in this.user.claims) == true) {
                if (this.user.claims['boardreturntype'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['boardreturntype'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['boardreturntype'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['boardreturntype'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy("e=>e.StatusId!=2")
            .then(response => this.data = (response as Array<IReturnType>));
    }

    insertModel() {
       
            this.$modal.show('add-edit-model', { model: { returnTypeId: '',
                fullName: '',
                description: '',
                statusId: 1}, IsNewRecord: true });
        
        
    }

    editModel(model: IBoardExamType) {
        
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IBoardExamType) {

        this.$modal.show('delete-model', { model: model });
    }
}