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

import { IHumanResourceDepartments, IHumanResourceStaff } from '../../../../models';
import { HumanResourceDepartmentsService, HumanResourceStaffService } from '../../../../service';

import { HumanResourceDepartmentsAddEdit } from '../add-edit';
import { HumanResourceDepartmentsDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Departments-add-edit-model': HumanResourceDepartmentsAddEdit,
        'delete-model': HumanResourceDepartmentsDelete
    }
})

export class HumanResourceDepartmentsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: HumanResourceDepartmentsService;
    private data: Array<IHumanResourceDepartments> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private staffModel: Array<IHumanResourceStaff> = [];
    private repoStaff: HumanResourceStaffService;



    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'statusId', caption: 'Status' },
        {key:'level',caption:'Level'},
        {key:'code',caption:'Code'},
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new HumanResourceDepartmentsService(this.$store);
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
            if (('humanResourceDepartments' in this.user.claims) == true) {
                if (this.user.claims['humanResourceDepartments'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['humanResourceDepartments'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['humanResourceDepartments'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['humanResourceDepartments'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<IHumanResourceDepartments>));
    }

    insertModel() {
        this.$modal.show('Departments-add-edit-model', { model: {departmentId: '', fullName: '', statusId: 0, loggerId: '',code:'',departmentParentId:'',level:1
 }, IsNewRecord: true });
    }

    editModel(model: IHumanResourceDepartments) {
        
        this.$modal.show('Departments-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IHumanResourceDepartments) {
        this.$modal.show('delete-model', { model: model });
    }
}