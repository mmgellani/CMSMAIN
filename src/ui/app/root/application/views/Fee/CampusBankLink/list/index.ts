/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { DDLGroupModel, DDLModel, ICampusCityVM, IFeeCampusBankAccountVM, IFeeCampusBankLink, IFeeCampusBankVM, ISetupCampus, ISetupCampusProgramVM, ISetupSession } from '../../../../models';
import { FeeCampusBankLinkService, SetupCampusProgramLinkService, SetupCampusService, SetupSessionService } from '../../../../service';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { FeeCampusBankLinkAddEdit } from '../add-edit';
import { FeeCampusBankLinkDelete } from '../delete';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from "../../../../../../store";
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeCampusBankLinkAddEdit,
        'delete-model': FeeCampusBankLinkDelete
    }
})

export class FeeCampusBankLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeCampusBankLinkService;
    // private data: Array<IFeeCampusBankVM> = [];
    private data: Array<IFeeCampusBankAccountVM> = [];

    // private datas: Array<IFeeCampusBankVM> = [];
    private datas: Array<IFeeCampusBankAccountVM> = [];

    private filterString: string = '';

    private campusId = '';
    private sessionId = "";
    private cityId = "";
    private programDetailId = '';

    private campusList: Array<ISetupCampus> = []
    private campusCityList: Array<ICampusCityVM> = []
    private ddl: Array<DDLModel> = [];
    private programDDL: Array<DDLGroupModel> = [];

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private sessionList: Array<ISetupSession> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];


    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(
        this.$store
    );
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
        this.$store
    );

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        //  { key: 'campusName', caption: 'Campus' },
        { key: 'description', caption: 'Program' },
        { key: 'bankName', caption: "Bank Name" },
        { key: 'accountNo', caption: "Account Name" },
        { key: 'statusId', caption: 'Status' },
        {key:'showInChallan',caption:'ShownInChallan'},
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeCampusBankLinkService(this.$store);
        this.loadSession();
    }
    loadSession() {
        this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
            this.sessionList = r as Array<ISetupSession>;
        });
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
    }

    // loadProgramsOfCampus() {
    //     this.ddl = [];
    //     this.programDDL = [];
    //     let oldObj: ISetupCampusProgramVM;
    //     var key = this.sessionId + "?" + this.campusId;
    //     this.campusProgramLinkRepo.GetAllVM(key).then(r => {
    //         this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
    //     });
    // }

    loadCityCampus() {
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeCampusBankLink' in this.user.claims) == true) {
                if (this.user.claims['feeCampusBankLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeCampusBankLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeCampusBankLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeCampusBankLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {
        if (this.campusId.length > 0) {
            // this.data = [];
            this.repository.GetByCampus(this.campusId)
                .then(response => this.data = (response as Array<IFeeCampusBankAccountVM>));
                this.cityId = this.campusCityList.find(e=> e.campusId == this.campusId).cityId;
            // this.datas = this.data.filter(
            //     e => e.campusId == this.campusId && e.statusId == 1
            // );
        }
    }

    insertModel() {

        if (this.campusId.length > 0 && this.sessionId.length > 0) {
            this.$modal.show('add-edit-model', { model: { campusBankLinkId: '', campusId: this.campusId, programDetailId: '', bankId: '', statusId: 0, loggerId: '', }, sessionId: this.sessionId, IsNewRecord: true, campusid: this.campusId,cityId:this.cityId });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: IFeeCampusBankAccountVM) {
        this.$modal.show('add-edit-model', { model: model, sessionId: this.sessionId, IsNewRecord: false, campusid: this.campusId ,cityId:this.cityId});
    }

    deleteModel(model: IFeeCampusBankAccountVM) {
        this.$modal.show('delete-model', { model: model });
    }
}