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

import { ISetupSession, ISetupTerm, IFeeConcessionVM } from '../../../../models';
import { SetupSessionService, SetupTermService, FeeConcessionService } from '../../../../service';

import { SetupSessionAddEdit } from '../add-edit';
import { SetupSessionDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

import * as $ from 'jquery';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Session-add-edit-model': SetupSessionAddEdit,
        'delete-model': SetupSessionDelete
    }
})

export class SetupSessionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupSessionService;
    private data: Array<ISetupSession> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private sessionModel: Array<ISetupTerm> = [];
    private repositorySession: SetupTermService;
    private concessionModel: Array<IFeeConcessionVM> = [];
    private repoconcession: FeeConcessionService;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'code', caption: "Code" },
        { key: 'description', caption: "Description" },
        { key: 'workingDays', caption: "WorkingDays" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupSessionService(this.$store);
        this.repositorySession = new SetupTermService(this.$store);
        this.repoconcession = new FeeConcessionService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getTerm();
        // this.getconcession();
    }
    getconcession() {
        this.concessionModel = [];
        this.repoconcession.GetFindBy('e => e.StatusId!=2')
            .then(response => this.concessionModel = (response as Array<IFeeConcessionVM>));
    }

    getTerm() {
        this.sessionModel = [];
        this.repositorySession.GetFindBy('e => e.StatusId!=2')
            .then(response => this.sessionModel = (response as Array<ISetupTerm>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupSession' in this.user.claims) == true) {
                if (this.user.claims['setupSession'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupSession'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupSession'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupSession'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindByEx('e=> e.StatusId !=2')
            .then(response => this.data = (response as Array<ISetupSession>));
    }

    insertModel() {
        this.$modal.show('Session-add-edit-model', { model: { sessionId: '', code: '', fullName: '', description: '', workingDays: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupSession) {
        this.$modal.show('Session-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupSession) {
        if(this.sessionModel.filter(e => e.sessionId == model.sessionId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }
        else if(this.concessionModel.filter(e => e.sessionId == model.sessionId).length > 0)  {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
              });
        }
        else {
        this.$modal.show('delete-model', { model: model });
        }
    }
}