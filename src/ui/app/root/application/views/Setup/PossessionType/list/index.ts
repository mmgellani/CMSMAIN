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

import { ISetupPossessionType, ISetupPossession } from '../../../../models';
import { SetupPossessionTypeService, SetupPossessionService } from '../../../../service';

import { SetupPossessionTypeAddEdit } from '../add-edit';
import { SetupPossessionTypeDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'PossessionType-add-edit-model': SetupPossessionTypeAddEdit,
        'delete-model': SetupPossessionTypeDelete
    }
})

export class SetupPossessionTypeList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupPossessionTypeService;
    private data: Array<ISetupPossessionType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private possessionModel: Array<ISetupPossession> = [];
    private repositoryPossession: SetupPossessionService;

    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupPossessionTypeService(this.$store);
        this.repositoryPossession = new SetupPossessionService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getPossession();
    }

    getPossession() {
        this.possessionModel = [];
        this.repositoryPossession.GetFindBy('e => e.StatusId!=2')
            .then(response => this.possessionModel = (response as Array<ISetupPossession>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupPossessionType' in this.user.claims) == true) {
                if (this.user.claims['setupPossessionType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupPossessionType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupPossessionType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupPossessionType'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupPossessionType>));
    }

    insertModel() {
        this.$modal.show('PossessionType-add-edit-model', { model: { possessionTypeId: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupPossessionType) {
        this.$modal.show('PossessionType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupPossessionType) {
        // if (this.possessionModel.filter(e => e.possessionTypeId == model.possessionTypeId).length > 0) {
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