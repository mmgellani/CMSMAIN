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

import { ISetupMedium, ISetupProgramDetails } from '../../../../models';
import { SetupProgramDetailsService, SetupMediumService } from '../../../../service';

import { SetupMonthAddEdit } from '../add-edit';
import { SetupMonthDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { SetupMonthService } from '../../../../service/Setup/Month';
import { ISetupMonth } from '../../../../models/Setup/Month';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Month-add-edit-model': SetupMonthAddEdit,
        'delete-model': SetupMonthDelete
    }
})

export class SetupMonthList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupMonthService;
    private data: Array<ISetupMonth> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private programDetailsModel: Array<ISetupProgramDetails> = [];
    private repositoryProgramDetails: SetupProgramDetailsService;

    private columns = [
        { key: 'fullName', caption: 'Full Name' },
        { key: 'code', caption: "Code" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupMonthService(this.$store);
        this.repositoryProgramDetails = new SetupProgramDetailsService(this.$store);
    }

    mounted() {
        this.validatePage();
        this.refreshData();
        this.getProgramDetails();
    }

    getProgramDetails(){
        this.programDetailsModel = [];
        this.repositoryProgramDetails.GetFindBy('e => e.StatusId!=2')
            .then(response => this.programDetailsModel = (response as Array<ISetupProgramDetails>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupMonth' in this.user.claims) == true) {
                if (this.user.claims['setupMonth'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupMonth'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupMonth'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupMonth'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISetupMonth>));
    }

    insertModel() {
        this.$modal.show('Month-add-edit-model', { model: { monthId: '', fullName: '', description: '', code: '', statusId: 0, loggerId: '', }, IsNewRecord: true });
    }

    editModel(model: ISetupMonth) {
        this.$modal.show('Month-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupMonth) {
        // if (this.programDetailsModel.filter(e => e.monthId == model.monthId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        
        // else {
            this.$modal.show('delete-model', { model: model });
        
    }
}