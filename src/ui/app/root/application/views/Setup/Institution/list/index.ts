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

import { ISetupInstitution, ISetupInstitutionVM, ISetupCampus } from '../../../../models';
import { SetupInstitutionService, SetupCampusService } from '../../../../service';

import { SetupInstitutionAddEdit } from '../add-edit';
import { SetupInstitutionDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'institution-add-edit-model': SetupInstitutionAddEdit,
        'delete-model': SetupInstitutionDelete
    }
})

export class SetupInstitutionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupInstitutionService;
    private data: Array<ISetupInstitutionVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campusModel: Array<ISetupCampus> = [];
    private repocampus: SetupCampusService;

    private columns = [ 
        { key: 'fullName', caption: 'Full Name' }, 
        { key: 'code', caption: "Code" },
        { key: 'businessUnitName', caption: "Business Unit" },
        { key: 'institutionTypeName', caption: "Institution Type" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupInstitutionService(this.$store);
        this.repocampus =  new SetupCampusService (this.$store);
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
            if (('setupInstitution' in this.user.claims) == true) {
                if (this.user.claims['setupInstitution'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupInstitution'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupInstitution'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupInstitution'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetAll()
            .then(response => this.data = (response as Array<ISetupInstitutionVM>));
    }

    insertModel () {
        this.$modal.show('institution-add-edit-model', { model: { institutionId: '', fullName: '', description: '', businessUnitID: '', code: '', institutionTypeId: '', statusId: 0, loggerId: '',  }, IsNewRecord: true });
    }

    editModel (model : ISetupInstitutionVM) {
        
        this.$modal.show('institution-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : ISetupInstitution) {
        if(this.campusModel.filter(e => e.institutionId == model.institutionId).length > 0) {
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
