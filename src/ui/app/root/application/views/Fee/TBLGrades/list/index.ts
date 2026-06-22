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

import { StoreTypes } from '../../../../../../store';
import { FeeTBLGradesService } from '../../../../service/Fee/TBLGrades';
import { IFeeTBLGrades } from '../../../../models/Fee/TBLGrades';
import { FeeTBLGradesDelete } from '../delete';
import { FeeTBLGradesAddEdit } from '../add-edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'TBLGrades-add-edit-model': FeeTBLGradesAddEdit,
        'delete-model': FeeTBLGradesDelete
    }
})

export class FeeTBLGradesList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeTBLGradesService;
    private data: Array<IFeeTBLGrades> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'grades', caption: 'Grade Name' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new FeeTBLGradesService(this.$store);
        this.refreshData();
    }

    mounted() {
        this.validatePage();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('feeTBLGrades' in this.user.claims) == true) {
                if (this.user.claims['feeTBLGrades'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['feeTBLGrades'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['feeTBLGrades'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['feeTBLGrades'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IFeeTBLGrades>));
    }

    insertModel() {
        this.$modal.show('TBLGrades-add-edit-model', { model: { scholarshipTypeId: '', grades: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: IFeeTBLGrades) {
        this.$modal.show('TBLGrades-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeTBLGrades) {

        this.$modal.show('delete-model', { model: model });

    }
}