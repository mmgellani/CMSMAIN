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

import { ISetupBloodGroup, IAdmissionAdmissionFormVM, IHumanResourceStaff } from '../../../../models';
import { SetupBloodGroupService, AdmissionAdmissionFormService, HumanResourceStaffService, AssessmentCategoryService } from '../../../../service';

import { AssessmentCategoryAddEdit } from '../add-edit'; 
import { StoreTypes } from '../../../../../../store';
import { IAssessmentCategory } from '../../../../models/Assessment/AssessmentCategory';
import { AssessmentCategoryDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'AssessmentCategory-add-edit-model': AssessmentCategoryAddEdit, 
        'delete-model': AssessmentCategoryDelete
    }
})

export class AssessmentCategory extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupBloodGroupService;
    private assessmentRepository: AssessmentCategoryService;
    private data: Array<IAssessmentCategory> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private AdmissionformModel: Array<IAdmissionAdmissionFormVM> = [];
    private reposadmission: AdmissionAdmissionFormService;
    private staffModel: Array<IHumanResourceStaff> = [];
    private repoStaff: HumanResourceStaffService;

    private columns = [
        { key: 'fullName', caption: 'Assessment Category' },
        { key: 'code', caption: 'Code' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupBloodGroupService(this.$store);
        this.assessmentRepository = new AssessmentCategoryService(this.$store);
        this.reposadmission = new AdmissionAdmissionFormService(this.$store);
        this.repoStaff = new HumanResourceStaffService(this.$store);
        this.refreshData();
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }
    getstaff() {
        this.staffModel = [];
        this.repoStaff.GetFindBy('e => e.StatusId!=2')
            .then(response => this.staffModel = (response as Array<IHumanResourceStaff>));
    }
    getAdmissionform() {
        this.AdmissionformModel = [];
        this.reposadmission.GetFindBy('e => e.StatusId!=2')
            .then(response => this.AdmissionformModel = (response as Array<IAdmissionAdmissionFormVM>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('assessmentCategory' in this.user.claims) == true) {
                if (this.user.claims['assessmentCategory'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['assessmentCategory'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['assessmentCategory'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['assessmentCategory'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.assessmentRepository.GetFindBy('e => e.StatusId!=2')
            .then(response => this.data = (response as Array<IAssessmentCategory>));
    }
    
   

    insertModel() { 
        this.$modal.show('AssessmentCategory-add-edit-model', { model: { assessmentCategoryId: '', fullName: '', code: '', statusId: 0 }, IsNewRecord: true });
    }

    editModel(model: IAssessmentCategory) {
        this.$modal.show('AssessmentCategory-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IAssessmentCategory) {
        //     if (this.AdmissionformModel.filter(e => e.bloodGroupId == model.bloodGroupId).length > 0) {
        //         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //             text: "This Parent Child Relation Cannot be Deleted",
        //             title: "Success",
        //             messageTypeId: PayloadMessageTypes.success
        //         });
        //     }
        //    else if (this.staffModel.filter(e => e.bloodGroupId == model.bloodGroupId).length > 0) {
        //         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //             text: "This Parent Child Relation Cannot be Deleted",
        //             title: "Success",
        //             messageTypeId: PayloadMessageTypes.success
        //         });
        //     }
        //     else{
        this.$modal.show('delete-model', { model: model });
        // }
    }

    
}