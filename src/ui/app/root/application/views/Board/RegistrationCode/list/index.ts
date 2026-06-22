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
//import { BoardProgramCampusAddEdit } from '../add-edit';
import { BoardRegistrationCodeAddEdit } from '../add-edit';
import { BoardProgramCampusDelete } from '../delete';
import { ISetupBoard } from '../../../../models/Setup/Board';
import { SetupBoardService, SetupSessionService, SetupCampusService, SetupProgramService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';
import { ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupProgram } from '../../../../models';
import { IVWCampusBaseProgram } from '../../../../models/Setup/CampusBaseProgram';
import { BoardProgramCampusService } from '../../../../service/Board/ProgramCampus';
import { IBoardProgramCampus } from '../../../../models/Board/ProgramCampus';
import { IRegistrationCode } from '../../../../models/Board/RegistrationBoard';
import { RegistrationCodeService } from '../../../../service/Board/registrationCode';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': BoardRegistrationCodeAddEdit,
        'delete-model': BoardProgramCampusDelete
    }
})

export class BoardRegistrationCodeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RegistrationCodeService;
    private data: Array<IRegistrationCode> = [];
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
    private programList: Array<ISetupProgram> = [];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'title', caption: 'Title' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
       // this.Sessionrepository = new SetupSessionService(this.$store);
        this.programSRepo = new SetupProgramService(this.$store);
        this.repository = new RegistrationCodeService(this.$store);
        //this.loadSession();
        this.loadBoard();
        this.loadPrograms();
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
        this.loadPrograms();
    }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('registrationCode' in this.user.claims) == true) {
                if (this.user.claims['registrationCode'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['registrationCode'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['registrationCode'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['registrationCode'].indexOf('D') >= 0) {
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

    loadBoard() {
        this.boardRepo.GetFindBy("s=>s.StatusId==1")
            .then(r => { this.boardList = r as Array<ISetupBoard> })
    }

    // loadCityCampus() {
    //     if (this.sessionid.length > 0) {
    //         this.campusddl = [];
    //         this.cityDDL = [];
    //         let oldObj: ICampusCityVM;
    //         this.campusRepo.GetCityVM().then(r => {
    //             this.campusCityList = r as Array<ICampusCityVM>;
    //         });
    //     }

    // }
    loadPrograms() {
        this.programSRepo.GetFindBy("s=>s.StatusId==1")
            .then(r => { this.programList = r as Array<ISetupProgram> })
    }
        // if (this.campusid.length > 0) {
        //     this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusid + '"')
        //         .then(r => {
        //             this.programList = r as Array<IVWCampusBaseProgram>
        //         });
        // }
    

    refreshData() {
        if (this.programId.length > 0) {
            this.data = [];
            var key=this.programId+'?'+this.boardId
            this.repository.GetFindBy(key)
                .then(response => this.data = (response as Array<IRegistrationCode>));
        }
    }

    insertModel() {
        if (this.programId.length > 0) {
            this.$modal.show('add-edit-model', { model: { boardId: this.boardId, title: '', description: '', programId: this.programId, statusId: 0, }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please select the Dropdowns',
                title: 'Danger',
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }

    editModel(model: IRegistrationCode) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IRegistrationCode) {

        this.$modal.show('delete-model', { model: model });
    }
}