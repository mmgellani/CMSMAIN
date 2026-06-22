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

import { IFeeStudentFeeStructure, IFeeStudentFeeStructureVM } from '../../../../models';
import { FeeStudentFeeStructureService } from '../../../../service';

import { FeeStudentFeeStructureAddEdit } from '../add-edit';
import { FeeStudentFeeStructureDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': FeeStudentFeeStructureAddEdit,
        'delete-model': FeeStudentFeeStructureDelete
    }
})

export class FeeStudentFeeStructureList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeStudentFeeStructureService;
    private data: Array<IFeeStudentFeeStructure> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    created() {
        this.repository = new FeeStudentFeeStructureService(this.$store);
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
            if (('feeStudentFeeStructure' in this.user.claims) == true) {
                if (this.user.claims['feeStudentFeeStructure'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeStudentFeeStructure'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeStudentFeeStructure'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeStudentFeeStructure'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IFeeStudentFeeStructure>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { studentFeeStructureId: '', admissionFormId: '', classId: '', installmentNo: 0, feeHeadId: '', feeAmount: 0, concessionDetailId: '', payableAmount: 0, statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : IFeeStudentFeeStructure) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IFeeStudentFeeStructure) {
        this.$modal.show('delete-model', { model: model });
    }
}