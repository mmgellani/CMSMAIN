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

import { ISetupGender, IAdmissionBulitanSale, IHumanResourceStaff } from '../../../../models';
import { SetupGenderService, AdmissionBulitanSaleService, HumanResourceStaffService } from '../../../../service';

import { SetupGenderAddEdit } from '../add-edit';
import { SetupGenderDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': SetupGenderAddEdit,
        'delete-model': SetupGenderDelete
    }
})

export class SetupGenderList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupGenderService;
    private data: Array<ISetupGender> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private bulletinsaleModel: Array<IAdmissionBulitanSale> = [];
    private repositorybulletinsale: AdmissionBulitanSaleService;
    private staffModel: Array<IHumanResourceStaff> = [];
    private repoStaff: HumanResourceStaffService;

    private columns = [ 
        { key: 'description', caption: 'Description' },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupGenderService(this.$store);
        this.repositorybulletinsale = new AdmissionBulitanSaleService (this.$store);
        this.repoStaff = new HumanResourceStaffService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        // this.getbulletinsale();
        // this.getstaff();
    }
    getstaff() {
        this.staffModel = [];
        this.repoStaff.GetFindBy('e => e.StatusId!=2')
            .then(response => this.staffModel = (response as Array<IHumanResourceStaff>));
    }
    getbulletinsale() {
        this.bulletinsaleModel = [];
        this.repositorybulletinsale.GetFindBy('e => e.StatusId!=2')
            .then(response => this.bulletinsaleModel = (response as Array<IAdmissionBulitanSale>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupGender' in this.user.claims) == true) {
                if (this.user.claims['setupGender'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupGender'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupGender'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupGender'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetFindBy('e => e.StatusId != 2')
            .then(response => this.data = (response as Array<ISetupGender>));
    }

    insertModel () {
        this.$modal.show('add-edit-model', { model: { genderId: '', description: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupGender) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupGender) {
        if (this.bulletinsaleModel.filter(e => e.genderId == model.genderId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else  if (this.staffModel.filter(e => e.genderId == model.genderId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else{
        this.$modal.show('delete-model', { model: model });
    }
}
}