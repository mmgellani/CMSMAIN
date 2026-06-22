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
import { SetupBloodGroupService, AdmissionAdmissionFormService, HumanResourceStaffService } from '../../../../service';

import { SetupBloodGroupAddEdit } from '../add-edit';
import { SetupBloodGroupDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupBloodGroupAddEdit,
        'delete-model': SetupBloodGroupDelete
    }
})

export class SetupBloodGroupList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupBloodGroupService;
    private data: Array<ISetupBloodGroup> = [];
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
        { key: 'fullName', caption: 'Blood Group Type' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupBloodGroupService(this.$store);
        this.reposadmission = new AdmissionAdmissionFormService(this.$store);
        this.repoStaff = new HumanResourceStaffService(this.$store);
        this.refreshData();
    }

    mounted() {
        this.validatePage();
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
            if (('setupBloodGroup' in this.user.claims) == true) {
                if (this.user.claims['setupBloodGroup'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupBloodGroup'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupBloodGroup'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupBloodGroup'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAllActive()
            .then(response => this.data = (response as Array<ISetupBloodGroup>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { bloodGroupId: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupBloodGroup) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupBloodGroup) {
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