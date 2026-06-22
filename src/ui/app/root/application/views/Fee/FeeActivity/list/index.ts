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

import { IFeeFeeActivity } from '../../../../models';
import { FeeFeeActivityService } from '../../../../service';

import { FeeFeeActivityAddEdit } from '../add-edit';
import { FeeFeeActivityDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeFeeActivityAddEdit,
        'delete-model': FeeFeeActivityDelete
    }
})

export class FeeFeeActivityList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeActivityService;
    private data: Array<IFeeFeeActivity> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'challanNo', caption: 'ChallanNo' },
        { key: 'date', caption: 'Date' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeFeeActivityService(this.$store);
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
            if (('feeFeeActivity' in this.user.claims) == true) {
                if (this.user.claims['feeFeeActivity'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeFeeActivity'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeFeeActivity'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeFeeActivity'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId != 2')
            .then(response => this.data = (response as Array<IFeeFeeActivity>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { feeActivityId: '', studentChallanId: '', dated: new Date(), description: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: IFeeFeeActivity) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeFeeActivity) {
        this.$modal.show('delete-model', { model: model });
    }
}