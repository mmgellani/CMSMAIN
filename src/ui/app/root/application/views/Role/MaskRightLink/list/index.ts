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

import { IRolePrevilages, IRoles, IRoleAssignedList, IUserList, PrevilagesData } from '../../../../models';
import { RolePrevilagesService } from '../../../../service';

import { RolePrevilagesServiceDelete } from '../delete';
import { SectionRightLinkAddEdit } from '../add-edit';

@Component({
    name: 'sectionRightLink',
    template: require('./index.html'),
    components: {
        'add-edit-model': SectionRightLinkAddEdit
        // 'delete-model': RolePrevilagesServiceDelete,
        // 'single-edit': RolePrevilageEdit
    }
})

export class MaskRightLink extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RolePrevilagesService;
    private data: Array<IRoleAssignedList> = [];
    private filterString: string = '';
    private RoleList: Array<IRoles> = [];
    private UserList: Array<IUserList> = [];
    private Roleid: string = '';
    private userid: number = 0;
    private ModuleType: string = '';

    

    Rolename: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'name', caption: 'User' },
        { key: 'type', caption: 'Type' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new RolePrevilagesService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
       

        this.repository.GetAllUserList().then(
            res => {
                this.UserList = res as Array<IUserList>


            }
        )
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('maskRightLink' in this.user.claims) == true) {
                if (this.user.claims['maskRightLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['maskRightLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['maskRightLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['maskRightLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        // this.data = [];
        // this.repository.GetAll()
        //     .then(response => this.data = (response as Array<IRoleAssignedList>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { roleId: this.Rolename, moduleStore: '', moduleType: '' }, IsNewRecord: true });
    }

    editModel(model: IUserList) {
         this.userid = model.uid;
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false,  UserID: this.userid });
    }

    deleteModel(model: IRolePrevilages) {
        this.$modal.show('delete-model', { model: model });
    }
    get filteredData() {
        return this.data.filter(e => e.roleId == this.Rolename)
    }
}