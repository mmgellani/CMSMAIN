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

import { IExaminationExamType, IExaminationExamMasterVM } from '../../../../models';
import { ExaminationExamTypeService, ExaminationExamMasterService } from '../../../../service';

import { ExaminationExamTypeAddEdit } from '../add-edit';
import { ExaminationExamTypeDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'ExamType-add-edit-model': ExaminationExamTypeAddEdit,
        'delete-model': ExaminationExamTypeDelete
    }
})

export class ExaminationExamTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ExaminationExamTypeService;
    private data: Array<IExaminationExamType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private examMasterModel: Array<IExaminationExamMasterVM> = [];
    private repositoryExamMaster: ExaminationExamMasterService;

    private columns = [
        { key: 'fullName', caption: "FullName" },
        { key: 'code', caption: 'Code' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ExaminationExamTypeService(this.$store);
        this.repositoryExamMaster = new ExaminationExamMasterService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getExamMaster();
    }

    // getExamMaster() {
    //     this.examMasterModel = [];
    //     this.repositoryExamMaster.GetFindBy('e => e.StatusId!=2')
    //         .then(response => this.examMasterModel = (response as Array<IExaminationExamMasterVM>));
    // }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examinationExamType' in this.user.claims) == true) {
                if (this.user.claims['examinationExamType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examinationExamType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examinationExamType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examinationExamType'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e=> e.StatusId != 2')
            .then(response => this.data = (response as Array<IExaminationExamType>));
            
    }

    insertModel() {
        this.$modal.show('ExamType-add-edit-model', { model: { examTypeId: '', code: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: IExaminationExamType) {
        this.$modal.show('ExamType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IExaminationExamType) {

        if (this.examMasterModel.filter(e => e.examTypeId == model.examTypeId).length > 0) {
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