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

import { MessageTemplateAddEdit } from '../add-edit';
import {  MessageTemplateDelete } from '../delete';
import { ISmsAPI, ITemplates } from '../../../../models/Message/message';
import { MessageService } from '../../../../service/Message/message-service';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': MessageTemplateAddEdit,
        'delete-model': MessageTemplateDelete
    }
})

export class MessageTemplate extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: MessageService;
    private data: Array<ITemplates> = [];
    // private dataVM: Array<ITemplates> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'type', caption: 'Type' },
        { key: 'title', caption: 'Title' },
        { key: 'description', caption: "Description" },
        { key: 'status', caption: "Status" },
        // { key: 'sendSms', caption: 'SendSms' },
        // { key: 'sendNotification', caption: 'SendNotification' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    created() {
        this.repository = new MessageService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }

    characterSplit(value) {
        return value.substring(0, 60);
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('messageTemplate' in this.user.claims) == true) {
                if (this.user.claims['messageTemplate'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['messageTemplate'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['messageTemplate'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['messageTemplate'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindByVM()
            .then(response => this.data = (response as Array<ITemplates>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { templateId: '', type: '', title: '', description: '', status: 0, sendSms: 0, sendNotification: 0, }, IsNewRecord: true });
    }

    editModel(model: ITemplates) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ITemplates) {
        this.$modal.show('delete-model', { model: model });
    }
}