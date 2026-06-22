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

import { IFeeContinuationPolicy, IFeeScholarshipCriteriaVM } from '../../../../models';
import { FeeContinuationPolicyService, FeeScholarshipCriteriaService } from '../../../../service';

import { FeeContinuationPolicyAddEdit } from '../add-edit';
import { FeeContinuationPolicyDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'ContinuationPolicy-add-edit-model': FeeContinuationPolicyAddEdit,
        'delete-model': FeeContinuationPolicyDelete
    }
})

export class FeeContinuationPolicyList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeContinuationPolicyService;
    private data: Array<IFeeContinuationPolicy> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private scholarshipCriteriaModel: Array<IFeeScholarshipCriteriaVM> = [];
    private repositoryScholarshipCriteria: FeeScholarshipCriteriaService;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'code', caption: 'Code' },
        { key: 'maxInstallmentNo', caption: "MaxInstallmentNo" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeContinuationPolicyService(this.$store);
        // this.repositoryScholarshipCriteria = new FeeScholarshipCriteriaService(this.$store);
        this.refreshData();
    }

    mounted() {
        this.validatePage();
        // this.getScholarshipCriteria();
    }

    getScholarshipCriteria() {
        this.scholarshipCriteriaModel = [];
        this.repositoryScholarshipCriteria.GetFindBy('e => e.StatusId!=2')
            .then(response => this.scholarshipCriteriaModel = (response as Array<IFeeScholarshipCriteriaVM>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeContinuationPolicy' in this.user.claims) == true) {
                if (this.user.claims['feeContinuationPolicy'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeContinuationPolicy'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeContinuationPolicy'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeContinuationPolicy'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IFeeContinuationPolicy>));
    }

    insertModel() {
        this.$modal.show('ContinuationPolicy-add-edit-model', { model: { continuationPolicyId: '', code: '', fullName: '', maxInstallmentNo: 0, statusId: 0, loggerId: '', }, IsNewRecord: true,listData: this.data  });
    }

    editModel(model: IFeeContinuationPolicy) {
        this.$modal.show('ContinuationPolicy-add-edit-model', { model: model, IsNewRecord: false, listData: this.data });
    }

    deleteModel(model: IFeeContinuationPolicy) {
        // if (this.scholarshipCriteriaModel.filter(e => e.continuationPolicyId == model.continuationPolicyId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }
        // else {
        this.$modal.show('delete-model', { model: model });
        // }
    }
}