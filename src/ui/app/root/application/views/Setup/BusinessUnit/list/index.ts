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

import { ISetupBusinessUnit, ISetupInstitution } from '../../../../models';
import { SetupBusinessUnitService, SetupInstitutionService } from '../../../../service';

import { SetupBusinessUnitAddEdit } from '../add-edit';
import { SetupBusinessUnitDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'BusinessUnit-add-edit-model': SetupBusinessUnitAddEdit,
        'delete-model': SetupBusinessUnitDelete
    }
})

export class SetupBusinessUnitList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupBusinessUnitService;
    private data: Array<ISetupBusinessUnit> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private istitutionModel: Array<ISetupInstitution> = [];
    private repositoryInstitution: SetupInstitutionService;

    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'description', caption: "Description" },
        { key: 'logo', caption: "Logo"  },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupBusinessUnitService(this.$store);
        this.repositoryInstitution = new SetupInstitutionService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupBusinessUnit' in this.user.claims) == true) {
                if (this.user.claims['setupBusinessUnit'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupBusinessUnit'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupBusinessUnit'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupBusinessUnit'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupBusinessUnit>));
    }

    insertModel() {
        this.$modal.show('BusinessUnit-add-edit-model', { model: { businessUnitId: '', fullName: '', description: '', businessGroupId: '', addressId: '', logo: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupBusinessUnit) {
        this.$modal.show('BusinessUnit-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupBusinessUnit) {
        if (this.istitutionModel.filter(e => e.businessUnitID == model.businessUnitId).length > 0) {
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