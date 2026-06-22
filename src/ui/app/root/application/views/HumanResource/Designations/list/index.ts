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

import { IHumanResourceDesignations, IHumanResourceStaff } from '../../../../models';
import { HumanResourceDesignationsService, HumanResourceStaffService } from '../../../../service';

import { HumanResourceDesignationsAddEdit } from '../add-edit';
import { HumanResourceDesignationsDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Designations-add-edit-model': HumanResourceDesignationsAddEdit,
        'delete-model': HumanResourceDesignationsDelete
    }
})

export class HumanResourceDesignationsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: HumanResourceDesignationsService;
    private data: Array<IHumanResourceDesignations> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private staffModel: Array<IHumanResourceStaff> = [];
    private repoStaff: HumanResourceStaffService;

    private columns = [
        { key: 'fullName', caption: 'Designation Title' },
        { key: 'category', caption: "Company" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new HumanResourceDesignationsService(this.$store);
        this.repoStaff = new HumanResourceStaffService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getstaff();
    }
    getstaff() {
        this.staffModel = [];
        this.repoStaff.GetFindBy('e => e.StatusId!=2')
            .then(response => this.staffModel = (response as Array<IHumanResourceStaff>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('humanResourceDesignations' in this.user.claims) == true) {
                if (this.user.claims['humanResourceDesignations'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['humanResourceDesignations'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['humanResourceDesignations'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['humanResourceDesignations'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e=>e.StatusId!=2')
            .then(response => this.data = (response as Array<IHumanResourceDesignations>));
    }

    insertModel() {
        this.$modal.show('Designations-add-edit-model', { model: { designationId: '', fullName: '', category: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: IHumanResourceDesignations) {
        this.$modal.show('Designations-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IHumanResourceDesignations) {
        // if (this.staffModel.filter(e => e.designationId == model.designationId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }else{
        this.$modal.show('delete-model', { model: model });
        // }
    }
}