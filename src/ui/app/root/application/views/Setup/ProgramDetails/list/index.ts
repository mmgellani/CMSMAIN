/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ISetupProgramDetails, ISetupProgram, ISetupProgramDetailsVM, ISetupCampusProgramLink, IAdmissionBulitanSale, IAdmissionAdmissionFormCplVM } from '../../../../models';
import { SetupProgramDetailsService, SetupProgramService, SetupCampusProgramLinkService, AdmissionBulitanSaleService } from '../../../../service';

import { SetupProgramDetailsAddEdit } from '../add-edit';
import { SetupProgramDetailsDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupProgramDetailsAddEdit,
        'delete-model': SetupProgramDetailsDelete
    }
})

export class SetupProgramDetailsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupProgramDetailsService;
    private data: Array<ISetupProgramDetailsVM> = [];
    private programRepo: SetupProgramService = new SetupProgramService(this.$store);
    private programList: Array<ISetupProgram> = [];
    private filterString: string = '';
    private programId = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campusprogramlinkModel: Array<ISetupCampusProgramLink> = [];
    private repocampusprogramlink: SetupCampusProgramLinkService;
    private bulletinsaleModel: Array<IAdmissionBulitanSale> = [];
    private repositorybulletinsale: AdmissionBulitanSaleService;


    private columns = [
        { key: 'description', caption: 'Program Detail' },
        { key: 'code', caption: "Code" },
        { key: 'shiftName', caption: "Shift" },
        { key: 'mediumName', caption: "Medium" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupProgramDetailsService(this.$store);
        this.repocampusprogramlink = new SetupCampusProgramLinkService (this.$store);
        this.repositorybulletinsale = new AdmissionBulitanSaleService (this.$store);
        this.loadPrograms();
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getcampusprogramlink();
        this.getbulletinsale();
    }
    getbulletinsale() {
        this.bulletinsaleModel = [];
        this.repositorybulletinsale.GetFindBy('e => e.StatusId!=2')
            .then(response => this.campusprogramlinkModel = (response as Array<ISetupCampusProgramLink>));
    }

    getcampusprogramlink() {
        this.campusprogramlinkModel = [];
        this.repocampusprogramlink.GetFindBy('e => e.StatusId!=2')
            .then(response => this.bulletinsaleModel = (response as Array<IAdmissionBulitanSale>));
    }

    loadPrograms() {
        this.programRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.programList = r as Array<ISetupProgram>
            })
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupProgramDetails' in this.user.claims) == true) {
                if (this.user.claims['setupProgramDetails'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupProgramDetails'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupProgramDetails'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupProgramDetails'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.programId.length > 0) {
            this.repository.GetAllByProgramVM(this.programId)
                .then(response => this.data = (response as Array<ISetupProgramDetailsVM>));
        }
    }

    insertModel() {
        if (this.programId.length > 0) {
            this.$modal.show('add-edit-model', { model: { programDetailId: '', description: '', code: '', programId: this.programId, shiftId: '', mediumId: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdown",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error
              });
        }
    }

    editModel(model: ISetupProgramDetails) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupProgramDetails) {
        if(this.campusprogramlinkModel.filter(e => e.programDetailId == model.programDetailId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }

        else if(this.bulletinsaleModel.filter(e => e.programDetailId == model.programDetailId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record already mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }
        else{
        this.$modal.show('delete-model', { model: model });
    }
}
}