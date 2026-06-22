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

import { ISetupPossession, ISetupBuilding } from '../../../../models';
import { SetupPossessionService, SetupBuildingService } from '../../../../service';

import { SetupPossessionAddEdit } from '../add-edit';
import { SetupPossessionDelete } from '../delete';
import { ISetupPossessionTypeVM } from '../../../../models/Setup/PossessionTypeVM';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Possession-add-edit-model': SetupPossessionAddEdit,
        'delete-model': SetupPossessionDelete
    }
})

export class SetupPossessionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupPossessionService;
    private data: Array<ISetupPossessionTypeVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private buildingModel: Array<ISetupBuilding> = [];
    private repobuilding: SetupBuildingService;


    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'description', caption: "Description" },
        { key: 'name', caption: "PossessionType" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupPossessionService(this.$store);
        this.repobuilding = new SetupBuildingService(this.$store)
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getbuilding();
    }

    getbuilding() {
        this.buildingModel = [];
        this.repobuilding.GetFindBy('e => e.StatusId!=2')
            .then(response => this.buildingModel = (response as Array<ISetupBuilding>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupPossession' in this.user.claims) == true) {
                if (this.user.claims['setupPossession'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupPossession'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupPossession'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupPossession'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupPossessionTypeVM>));

    }

    insertModel() {
        this.$modal.show('Possession-add-edit-model', { model: { possessionId: '', fullName: '', description: '', statusId: 0, loggerId: '', possessionTypeId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupPossession) {
        this.$modal.show('Possession-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupPossession) {
        // if(this.buildingModel.filter(e => e.possessionId == model.possessionId).length > 0) {
        //     alert("This Parent Child Relation Cannot be Deleted");
        // }
        // else{
        this.$modal.show('delete-model', { model: model });
        // }
    }
}