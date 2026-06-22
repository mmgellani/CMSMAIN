/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com.
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ISetupMedium, ISetupProgramDetails, ISurveyMaster } from '../../../../models';
import { SetupProgramDetailsService } from '../../../../service';

import { SetupMediumAddEdit } from '../add-edit';
import { SetupMediumDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { SurveyDashboardMasterService } from '../../../../service/DashBoard/dashboardsurveymaster';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Medium-add-edit-model': SetupMediumAddEdit,
        'delete-model': SetupMediumDelete
    }
})

export class DashboardSurveyList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SurveyDashboardMasterService;
    private data: Array<ISurveyMaster> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private programDetailsModel: Array<ISetupProgramDetails> = [];
    private repositoryProgramDetails: SetupProgramDetailsService;

    private columns = [
        { key: 'name', caption: 'Full Name' },
        { key: 'description', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SurveyDashboardMasterService(this.$store);
        this.repositoryProgramDetails = new SetupProgramDetailsService(this.$store);
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
            if (('dashboardSurveyMaster' in this.user.claims) == true) {
                if (this.user.claims['dashboardSurveyMaster'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['dashboardSurveyMaster'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['dashboardSurveyMaster'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['dashboardSurveyMaster'].indexOf('D') >= 0) {
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
            .then(response => this.data = (response as Array<ISurveyMaster>));
    }

    insertModel() {
        this.$modal.show('Medium-add-edit-model', { model: { surveyMasterId: '', name: '', description: '', statusId: 0}, IsNewRecord: true });
    }

    editModel(model: ISetupMedium) {
        this.$modal.show('Medium-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupMedium) {
        // if (this.programDetailsModel.filter(e => e.mediumId == model.mediumId).length > 0) {
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