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

import { ISetupInstitutionType, ISetupInstitution } from '../../../../models';
import { SetupInstitutionTypeService, SetupInstitutionService } from '../../../../service';

import { SetupInstitutionTypeAddEdit } from '../add-edit';
import { SetupInstitutionTypeDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'InstitutionType-add-edit-model': SetupInstitutionTypeAddEdit,
        'delete-model': SetupInstitutionTypeDelete
    }
})

export class SetupInstitutionTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupInstitutionTypeService;
    private data: Array<ISetupInstitutionType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private institutionModel: Array<ISetupInstitution> = [];
    private repositoryInstitution: SetupInstitutionService;

 private columns = [ 
    { key: 'name', caption: 'Name' }, 
    { key: 'description', caption: "Description" },
    { key: 'statusId', caption: 'Status'  },
    { key: 'action', caption: 'Action', width: 120 }
];

    created() {
        this.repository = new SetupInstitutionTypeService(this.$store);
        this.repositoryInstitution = new SetupInstitutionService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getInstitution();
    }

    getInstitution(){
        this.institutionModel = [];
        this.repositoryInstitution.GetFindBy('e => e.StatusId!=2')
            .then(response => this.institutionModel = (response as Array<ISetupInstitution>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupInstitutionType' in this.user.claims) == true) {
                if (this.user.claims['setupInstitutionType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupInstitutionType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupInstitutionType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupInstitutionType'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupInstitutionType>));
    }

    insertModel () {
        this.$modal.show('InstitutionType-add-edit-model', { model: { institutionTypeID: '', name: '', description: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupInstitutionType) {
        this.$modal.show('InstitutionType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupInstitutionType) {
        if (this.institutionModel.filter(e => e.institutionTypeId == model.institutionTypeID).length > 0) {
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