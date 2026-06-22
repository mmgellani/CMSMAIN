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
import { SessionBoardFeeAddEdit } from '../add-edit';
import { SessionBoardFeeDelete } from '../delete';
import { ISetupBoard } from '../../../../models/Setup/Board';
import { SetupBoardService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';
import { ISessionBoardFee, ISessionBoardFeeVM } from '../../../../models/Board/sessionboardfee';
import { SessionBoardFeeService } from '../../../../service/Board/sessionboardfee';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SessionBoardFeeAddEdit,
        'delete-model': SessionBoardFeeDelete
    }
})

export class SessionBoardFeeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SessionBoardFeeService;
    private data: Array<ISessionBoardFeeVM> = [];
    private filterString: string = "";
    private boardId: string = '';
    private boardList: Array<ISetupBoard> = [];
    private boardRepo: SetupBoardService = new SetupBoardService(this.$store);


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'session', caption: 'Session' },
        { key: 'board', caption: "Board" },
        { key: 'feeHead', caption: 'FeeHead' },
        { key: 'amount', caption: 'Amount' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SessionBoardFeeService(this.$store);
        //this.loadBoard();
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }

    loadBoard() {
        this.boardRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.boardList = r as Array<ISetupBoard>
            })
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('sessionboardfee' in this.user.claims) == true) {
                if (this.user.claims['sessionboardfee'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['sessionboardfee'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['sessionboardfee'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['sessionboardfee'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISessionBoardFeeVM>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { sessionBoardFeeId: '', sessionId: '', boardId: '', amount: 0, statusId: 1, feeHeadId: '' }, IsNewRecord: true });
    }

    editModel(model: ISessionBoardFeeVM) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false, CHALLANTYPEID: model.challanTypeId });
    }

    deleteModel(model: ISessionBoardFee) {
        this.$modal.show('delete-model', { model: model });
    }
}