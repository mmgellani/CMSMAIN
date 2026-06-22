/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ISetupTerm, ISetupTermSessionVM } from '../../../../models';
import { SetupTermService } from '../../../../service';

// import { MessageSMSAPIAddEdit } from '../add-edit';
import { MessageSMSAPIDelete } from '../delete';
import { ISmsAPI } from '../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        // 'add-edit-model': MessageSMSAPIAddEdit,
        'delete-model': MessageSMSAPIDelete
    }
})

export class MessageSMSAPIList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: MessageService;
    private data: Array<ISmsAPI> = [];
    private dataVM: Array<ISmsAPI> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'loginId', caption: 'Login ID' },
        { key: 'password', caption: "Password" },
        { key: 'shortCodePref', caption: "Code" },
        { key: 'isUnicode', caption: 'UniCode' },
        { key: 'mask', caption: 'Mask' },
        // { key: 'action', caption: 'Action', width: 120 }
    ];
    created() {
        this.repository = new MessageService(this.$store);
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
            if (('smsApi' in this.user.claims) == true) {
                if (this.user.claims['smsApi'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['smsApi'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['smsApi'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['smsApi'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<ISmsAPI>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { termId: '', fullName: '', sessionId: '', code: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISmsAPI) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISmsAPI) {
        this.$modal.show('delete-model', { model: model });
    }
}