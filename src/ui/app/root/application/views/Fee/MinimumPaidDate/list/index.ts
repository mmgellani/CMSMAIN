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

import { IFeeFeeHead, IFeeFeeActivity, IFeeConcessionDetail, IMinimumPaidDateVM, IMinimumPaidDate } from '../../../../models';
import { FeeFeeHeadService, FeeFeeActivityService, FeeConcessionDetailService } from '../../../../service';

import { MinimumPaidDateAddEdit } from '../add-edit';
import { MinimumPaidDateDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { MinimumPaidDateService } from '../../../../service/Fee/minimumpaiddate';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': MinimumPaidDateAddEdit,
        'delete-model': MinimumPaidDateDelete
    }
})

export class MinimumPaidDateList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: MinimumPaidDateService;
    private data: Array<IMinimumPaidDateVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'city', caption: 'City' },
        { key: 'subCity', caption: 'SubCity' },
        { key: 'minDays', caption: "Min" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new MinimumPaidDateService(this.$store);
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
            if (('minimumPaidDate' in this.user.claims) == true) {
                if (this.user.claims['minimumPaidDate'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['minimumPaidDate'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['minimumPaidDate'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['minimumPaidDate'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllVM()
            .then(response => this.data = (response as Array<IMinimumPaidDateVM>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', {
            model: { minimumPaidDateId: '', subCityId: '', minDays: 0, statusId: 1 }, IsNewRecord: true
        });
    }

    editModel(model: IMinimumPaidDateVM) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
        // alert(JSON.stringify(model));
    }

    deleteModel(model: IMinimumPaidDateVM) {
        this.$modal.show('delete-model', { model: model });
    }
}