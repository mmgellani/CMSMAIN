/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { FeeConcessionDetailService, FeeFeeActivityService, FeeFeeHeadService } from '../../../../service';
import { IFeeConcessionDetail, IFeeFeeActivity, IFeeFeeHead } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { FeeFeeHeadAddEdit } from '../add-edit';
import { FeeFeeHeadDelete } from '../delete';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'FeeHead-add-edit-model': FeeFeeHeadAddEdit,
        'delete-model': FeeFeeHeadDelete
    }
})

export class FeeFeeHeadList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeHeadService;
    private data: Array<IFeeFeeHead> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private feeActivityModel: Array<IFeeFeeActivity> = [];
    private repositoryFeeActivity: FeeFeeActivityService;
    private concessiondetailmodel : Array<IFeeConcessionDetail> = [];
    private repoconcessiondetail : FeeConcessionDetailService;



    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'description', caption: 'Description' },
        { key: 'feeType', caption: "FeeType" },
        { key: 'orderBy', caption: "OrderBy" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeFeeHeadService(this.$store);
        this.repositoryFeeActivity = new FeeFeeHeadService(this.$store);
        this.repoconcessiondetail = new FeeConcessionDetailService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getFeeActivity();
        this.getconcessiondetail();
    }
    getconcessiondetail() {
        this.concessiondetailmodel = [];
        this.repoconcessiondetail.GetFindBy('e => e.StatusId!=2')
            .then(response => this.concessiondetailmodel = (response as Array<IFeeConcessionDetail>));
    }


    getFeeActivity() {
        this.feeActivityModel = [];
        this.repositoryFeeActivity.GetFindBy('e => e.StatusId!=2')
            .then(response => this.feeActivityModel = (response as Array<IFeeFeeActivity>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeFeeHead' in this.user.claims) == true) {
                if (this.user.claims['feeFeeHead'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeFeeHead'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeFeeHead'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeFeeHead'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IFeeFeeHead>));
    }

    insertModel() {
        this.$modal.show('FeeHead-add-edit-model', { model: { feeHeadId: '', fullName: '', description: '', feeType: 0, statusId: 0, loggerId: '', orderBy: 0, }, IsNewRecord: true });
    }

    editModel(model: IFeeFeeHead) {
        this.$modal.show('FeeHead-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeFeeHead) {
        if (this.feeActivityModel.filter(e => e.feeActivityId == model.feeHeadId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
       else if (this.concessiondetailmodel.filter(e => e.feeHeadId == model.feeHeadId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else {
            this.$modal.show('delete-model', { model: model });
        }
    }
}