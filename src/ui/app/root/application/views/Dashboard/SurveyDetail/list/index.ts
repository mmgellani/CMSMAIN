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

import { ISetupMedium, ISetupProgramDetails, ISurveyMaster, SurveyDetail, SurveyDetailVM } from '../../../../models';
import { SetupProgramDetailsService } from '../../../../service';

import { SetupMediumAddEdit } from '../add-edit';
import { SetupMediumDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { SurveyDashboardMasterService } from '../../../../service/DashBoard/dashboardsurveymaster';
import { SurveyDashboardDetailService } from '../../../../service/DashBoard/dashboardsurveydetail';
import { SetupPreview } from '../preview';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Medium-add-edit-model': SetupMediumAddEdit,
        'delete-model': SetupMediumDelete,
        'preview': SetupPreview
    }
})

export class DashboardSurveyDetailList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SurveyDashboardDetailService;
    private data: Array<SurveyDetailVM> = [];
    private filterString: string = '';

    private surveyMasterId: string = '';

    private surveyMasterList: Array<ISurveyMaster> = [];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private programDetailsModel: Array<ISetupProgramDetails> = [];
    private repositoryProgramDetails: SetupProgramDetailsService;

    private surveyMasterRepository: SurveyDashboardMasterService;

    private columns = [

        { key: 'surveyMaster', caption: "Master" },
        { key: 'surveyDescription', caption: "Description" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SurveyDashboardDetailService(this.$store);
        this.repositoryProgramDetails = new SetupProgramDetailsService(this.$store);
        this.surveyMasterRepository = new SurveyDashboardMasterService(this.$store);

    }

    mounted() {
        this.validatePage();
        // this.refreshData();
        this.surveyMaster();
    }

    surveyMaster() {
        this.data = [];
        this.surveyMasterRepository.GetAllActive()
            .then(response => this.surveyMasterList = (response as Array<ISurveyMaster>));
    }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('dashboardSurveyDetail' in this.user.claims) == true) {
                if (this.user.claims['dashboardSurveyDetail'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['dashboardSurveyDetail'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['dashboardSurveyDetail'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['dashboardSurveyDetail'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.surveyMasterId.length > 0) {
            this.data = [];
            this.repository.GetAllSurveyDetail()
                .then(response => { 
                    this.data = (response as Array<SurveyDetailVM>)
                    this.data = this.data.filter(e=> e.surveyMasterId == this.surveyMasterId)
                });
        }
    }

    insertModel() {
        this.$modal.show('Medium-add-edit-model', { model: { surveyMasterId: '', name: '', description: '', statusId: 0 }, IsNewRecord: true });
    }

    editModel(model: SurveyDetailVM) {
        console.log(JSON.stringify(model))
        this.$modal.show('Medium-add-edit-model', { model: model, IsNewRecord: false });
    }

    Preview(model: SurveyDetailVM) {
        console.log(JSON.stringify(model))
        this.$modal.show('preview', { model: model, IsNewRecord: false });
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