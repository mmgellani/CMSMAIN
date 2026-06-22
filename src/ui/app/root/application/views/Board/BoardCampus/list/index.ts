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
import { BoardBoardCampusAddEdit } from '../add-edit';
import { BoardBoardCampusDelete } from '../delete';
import { ISetupBoard } from '../../../../models/Setup/Board';
import { SetupBoardService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'BoardCampus-add-edit-model': BoardBoardCampusAddEdit,
        'delete-model': BoardBoardCampusDelete
    }
})

export class BoardBoardCampusList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: BoardBoardCampusService;
    private data: Array<IBoardBoardCampus> = [];
    private filterString: string = "";
    private boardId: string = '';
    private boardList: Array<ISetupBoard> = [];
    private boardRepo: SetupBoardService = new SetupBoardService(this.$store);


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'abbrevation', caption: "Abbrevation" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new BoardBoardCampusService(this.$store);
        this.loadBoard();
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
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
            if (('boardBoardCampus' in this.user.claims) == true) {
                if (this.user.claims['boardBoardCampus'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['boardBoardCampus'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['boardBoardCampus'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['boardBoardCampus'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy(this.boardId)
            .then(response => this.data = (response as Array<IBoardBoardCampus>));
    }

    insertModel() {
        if (this.boardId.length > 0) {
            this.$modal.show('BoardCampus-add-edit-model', { model: { boardCampusId: '', abbrevation: '', fullName: '', boardId: this.boardId, statusId: 0, }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Drop Down Values First',
                title: 'Warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
    }

    editModel(model: IBoardBoardCampus) {
        this.$modal.show('BoardCampus-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IBoardBoardCampus) {

        this.$modal.show('delete-model', { model: model });
    }
}