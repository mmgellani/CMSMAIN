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

import { ISetupReligion, IAdmissionAdmissionForm, IAdmissionAdmissionFormVM, IHumanResourceStaff } from '../../../../models';
import { SetupReligionService, AdmissionAdmissionFormService, HumanResourceStaffService } from '../../../../service';

import { SetupReligionAddEdit } from '../add-edit';
import { SetupReligionDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupReligionAddEdit,
        'delete-model': SetupReligionDelete
    }
})

export class SetupReligionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupReligionService;
    private data: Array<ISetupReligion> = [];
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
        { key: 'fullName', caption: 'FullName' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupReligionService(this.$store);
        this.reposadmission = new AdmissionAdmissionFormService(this.$store);
        this.repoStaff = new HumanResourceStaffService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getAdmissionform();
        this.getstaff();
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
            if (('setupReligion' in this.user.claims) == true) {
                if (this.user.claims['setupReligion'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupReligion'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupReligion'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupReligion'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupReligion>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { religionId: '', fullName: '', description: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupReligion) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupReligion) {
        // if (this.AdmissionformModel.filter(e => e.religionId == model.religionId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }
        // else if (this.staffModel.filter(e => e.religionId == model.religionId).length > 0) {
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
