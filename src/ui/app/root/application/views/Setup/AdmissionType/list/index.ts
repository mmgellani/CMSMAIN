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

import { ISetupAdmissionType, IAdmissionEligibilityCriteria, IFeeScholarshipCriteriaVM } from '../../../../models';
import { SetupAdmissionTypeService, AdmissionEligibilityCriteriaService, FeeScholarshipCriteriaService } from '../../../../service';

import { SetupAdmissionTypeAddEdit } from '../add-edit';
import { SetupAdmissionTypeDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'AdmissionType-add-edit-model': SetupAdmissionTypeAddEdit,
        'delete-model': SetupAdmissionTypeDelete
    }
})

export class SetupAdmissionTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupAdmissionTypeService;
    private data: Array<ISetupAdmissionType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private EligibilityModel: Array<IAdmissionEligibilityCriteria> = [];
    private repositoryeligibility: AdmissionEligibilityCriteriaService;
    private scholarshipCriteriaModel: Array<IFeeScholarshipCriteriaVM> = [];
    private repositoryScholarshipCriteria: FeeScholarshipCriteriaService;


    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'code', caption: "Code" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupAdmissionTypeService(this.$store);
        this.repositoryeligibility = new AdmissionEligibilityCriteriaService(this.$store);
        this.repositoryScholarshipCriteria = new FeeScholarshipCriteriaService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.geteligibilty();
        // this.getScholarshipCriteria();
    }
    geteligibilty() {
        this.EligibilityModel = [];
        this.repositoryeligibility.GetFindBy('e => e.StatusId!=2')
            .then(response => this.EligibilityModel = (response as Array<IAdmissionEligibilityCriteria>));
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
            if (('setupAdmissionType' in this.user.claims) == true) {
                if (this.user.claims['setupAdmissionType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupAdmissionType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupAdmissionType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupAdmissionType'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId!=2')
            .then(response => this.data = (response as Array<ISetupAdmissionType>));
    }

    insertModel() {
        this.$modal.show('AdmissionType-add-edit-model', { model: { admissionTypeId: '', code: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupAdmissionType) {
        this.$modal.show('AdmissionType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupAdmissionType) {

        if (this.EligibilityModel.filter(e => e.admissionTypeId == model.admissionTypeId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }

        else if (this.scholarshipCriteriaModel.filter(e => e.admissionTypeId == model.admissionTypeId).length > 0) {
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