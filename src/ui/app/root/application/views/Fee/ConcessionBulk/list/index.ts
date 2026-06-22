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

import { IFeeConcession, IFeeConcessionVM, ISetupSession, ISetupZone } from '../../../../models';
import { FeeConcessionService, SetupSessionService, SetupZoneService } from '../../../../service';

import { FeeConcessionBulkAddEdit } from '../add-edit';
import { FeeConcessionBulkDelete } from '../delete';
import { StoreTypes } from "../../../../../../store";

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeConcessionBulkAddEdit,
        'delete-model': FeeConcessionBulkDelete
    }
})

export class FeeConcessionBulkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionService;
    private data: Array<IFeeConcessionVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private sessionList: Array<ISetupSession> = [];
    private zoneList: Array<ISetupZone> = []

    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)

    private sessionId = '';
    private zoneId = '';

    private columns = [
        { key: 'zoneName', caption: 'Zone' },
        { key: 'sessionName', caption: 'Session' },
        { key: 'programName', caption: 'Program' },
        { key: 'shiftName', caption: 'Shift' },
        { key: 'challanTypeName', caption: "ChallanType" },
        { key: 'fullName', caption: "FullName" },
        { key: 'statusId', caption: 'Status' }
    ];

    created() {
        this.repository = new FeeConcessionService(this.$store);
        this.loadSession();
        this.loadZone();

    }

    mounted() {
        this.validatePage();
    }

    loadSession() {
        this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
            this.sessionList = r as Array<ISetupSession>;
        });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeConcessionBulk' in this.user.claims) == true) {
                if (this.user.claims['feeConcessionBulk'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeConcessionBulk'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeConcessionBulk'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeConcessionBulk'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    loadZone() {
        this.zoneRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>
            })
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindByVM('e => e.SessionId.ToString() == "' + this.sessionId + '"&&  e.ZoneId.ToString() == "' + this.zoneId + '"')
            .then(response => this.data = (response as Array<IFeeConcessionVM>));

    }

    insertModel() {

        //var sessionName = this.sessionList.find(s => s.sessionId == this.sessionId).fullName;
        //  this.$modal.show('add-edit-model', { model: { concessionId: '', zoneId: '', sessionId: this.sessionId, programId: '', shiftId: '', challanTypeId: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true, sessionId: this.sessionId, sessionName: sessionName });
        if (this.zoneId.length > 0 && this.sessionId.length > 0) {
            var sessionName = this.sessionList.find(s => s.sessionId == this.sessionId).fullName;
            this.$modal.show('add-edit-model', { model: { concessionId: '', zoneId: '', sessionId: this.sessionId, programId: '', shiftId: '', challanTypeId: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true, sessionId: this.sessionId, sessionName: sessionName });
        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }


    }

    editModel(model: IFeeConcession) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeConcession) {
        this.$modal.show('delete-model', { model: model });
    }
}