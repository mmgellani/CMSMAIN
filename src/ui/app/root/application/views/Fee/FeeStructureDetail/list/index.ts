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

import { IFeeFeeStructureDetail, IFeeFeeStructureDetailVM } from '../../../../models';
import { FeeFeeStructureDetailService } from '../../../../service';

import { FeeFeeStructureDetailAddEdit } from '../add-edit';
import { FeeFeeStructureDetailDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeFeeStructureDetailAddEdit,
        'delete-model': FeeFeeStructureDetailDelete
    }
})

export class FeeFeeStructureDetailList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeStructureDetailService;
    private data: Array<IFeeFeeStructureDetailVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'feeHeadName', caption: 'FeeStructure' },
        { key: 'installmentNo', caption: 'InstallmentNo' },  
        { key: 'fullName', caption: "ChallanType" },
        { key: 'feeAmount', caption: 'FeeAmount' }, 
        { key: 'statusId', caption: 'Status'  },
       
    ];

    created() {
        this.repository = new FeeFeeStructureDetailService(this.$store);
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
            if (('feeFeeStructureDetail' in this.user.claims) == true) {
                if (this.user.claims['feeFeeStructureDetail'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeFeeStructureDetail'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeFeeStructureDetail'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeFeeStructureDetail'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllVM('e=>e.StatusId!=2')
            .then(response => this.data = (response as Array<IFeeFeeStructureDetailVM>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { feeStructureDetailId: '', feeStructureId: '', installmentNo: 0, challanTypeId: '', feeAmount: 0, statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : IFeeFeeStructureDetail) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IFeeFeeStructureDetail) {
        this.$modal.show('delete-model', { model: model });
    }
}