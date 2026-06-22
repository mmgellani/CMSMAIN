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
import { BoardProgramCampusAddEdit } from '../add-edit';
import { BoardProgramCampusDelete } from '../delete';
import { ISetupBoard } from '../../../../models/Setup/Board';
import { SetupBoardService, SetupSessionService, SetupCampusService, SetupProgramService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';
import { ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM } from '../../../../models';
import { IVWCampusBaseProgram } from '../../../../models/Setup/CampusBaseProgram';
import { BoardProgramCampusService } from '../../../../service/Board/ProgramCampus';
import { IBoardProgramCampus } from '../../../../models/Board/ProgramCampus';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': BoardProgramCampusAddEdit,
        'delete-model': BoardProgramCampusDelete
    }
})

export class BoardProgramCampusList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: BoardProgramCampusService;
    private data: Array<IBoardProgramCampus> = [];
    private filterString: string = "";
    private boardId: string = '';
    private boardList: Array<ISetupBoard> = [];
    private sessionList: Array<ISetupSession> = [];
    private boardRepo: SetupBoardService = new SetupBoardService(this.$store);
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private programSRepo: SetupProgramService = new SetupProgramService(this.$store);
    private Sessionrepository: SetupSessionService = null;
    private Campusrepository: SetupCampusService = null;
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private campusid: string = "";
    private sessionid: string = "";
    programId: string = "";
    campusId: string = "";
    private code: string = "";
    private programList: Array<IVWCampusBaseProgram> = [];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'title', caption: 'Title' },
        { key: 'description', caption: "Description" },
        { key: 'programName', caption: "Program" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.Sessionrepository = new SetupSessionService(this.$store);
        this.programSRepo = new SetupProgramService(this.$store);
        this.repository = new BoardProgramCampusService(this.$store);
        this.loadSession();
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
    }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('BoardProgramCampusList' in this.user.claims) == true) {
                if (this.user.claims['BoardProgramCampusList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['BoardProgramCampusList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['BoardProgramCampusList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['BoardProgramCampusList'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadSession() {
        this.Sessionrepository.GetFindBy("e=>e.StatusId==1").then(r => {
            this.sessionList = r as Array<ISetupSession>;
        });
    }

    loadCityCampus() {
        if (this.sessionid.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }

    }
    loadPrograms() {
        if (this.campusid.length > 0) {
            this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusid + '"')
                .then(r => {
                    this.programList = r as Array<IVWCampusBaseProgram>
                });
        }
    }

    refreshData() {
        if (this.programId.length > 0) {
            this.data = [];
            this.repository.GetFindBy(this.programId)
                .then(response => this.data = (response as Array<IBoardProgramCampus>));
        }
    }

    insertModel() {
        if (this.programId.length > 0) {
            this.$modal.show('add-edit-model', { model: { programCampusId: '', title: '', description: '', programId: this.programId, statusId: 0, }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please select the Dropdowns',
                title: 'Danger',
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }

    editModel(model: IBoardProgramCampus) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IBoardProgramCampus) {

        this.$modal.show('delete-model', { model: model });
    }
}