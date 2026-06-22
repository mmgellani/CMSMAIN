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

import { IFeeConcessionDetail, IFeeConcessionDetailVM, ISetupZone, ISetupSession, ISetupProgram, ISetupShift } from '../../../../models';
import { FeeConcessionDetailService, SetupZoneService, SetupSessionService, SetupProgramService, SetupShiftService, FeeConcessionService } from '../../../../service';

import { FeeConcessionDetailAddEdit } from '../add-edit';
import { FeeConcessionDetailDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeConcessionDetailAddEdit,
        'delete-model': FeeConcessionDetailDelete
    }
})

export class FeeConcessionDetailList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private data: Array<IFeeConcessionDetailVM> = [];
    private filterString: string = '';
    private zoneId = ''
    private sessionId = ''
    private programId = ''
    private shiftId = ''

    private zoneList: Array<ISetupZone> = []
    private sessionList: Array<ISetupSession> = []
    private programList: Array<ISetupProgram> = []
    private shiftList: Array<ISetupShift> = []

    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private programRepo: SetupProgramService = new SetupProgramService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private concessionRepo: FeeConcessionService = new FeeConcessionService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'fullName', caption: 'Concession' }, 
        { key: 'feeHeadName', caption: 'FeeHead' },
        { key: 'percentage', caption: 'Percentage' },
        { key: 'feeAmount', caption: "FeeAmount" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.loadZone();
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }
    loadZone() {
        this.zoneRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>

            })
    }
    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    loadShift() {
        this.shiftRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.shiftList = r as Array<ISetupShift>
            })
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
            if (('feeConcessionDetail' in this.user.claims) == true) {
                if (this.user.claims['feeConcessionDetail'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeConcessionDetail'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeConcessionDetail'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeConcessionDetail'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.zoneId.length > 0 && this.sessionId.length > 0 && this.programId.length > 0 && this.shiftId.length > 0) {
            var key = this.zoneId + '?' + this.sessionId + '?' + this.programId + '?' + this.shiftId;
            this.repository.GetFindByVM(key)
                .then(response => this.data = (response as Array<IFeeConcessionDetailVM>));
        }
    }
    insertModel() {

        if (this.zoneId.length > 0 && this.sessionId.length > 0 && this.programId.length > 0 && this.shiftId.length > 0) {
            this.$modal.show('add-edit-model', { model: { concessionDetailId: '', concessionId: '', feeHeadId: '', percentage: 0, feeAmount: 0, statusId: 0, loggerId: '', }, IsNewRecord: true, zoneId: this.zoneId, sessionId: this.sessionId, programId: this.programId, shiftId: this.shiftId });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please select the Dropdowns',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }

    editModel(model: IFeeConcessionDetail) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false, zoneId: this.zoneId, sessionId: this.sessionId, programId: this.programId, shiftId: this.shiftId });
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }
}