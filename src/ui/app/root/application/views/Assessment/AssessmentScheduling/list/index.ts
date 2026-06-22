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

import { ISetupBuilding, ISetupBuildingAddressLink, ISetupCampusProgramVM, ISetupRoom, ISetupRoomBuildingLink, RegistrationProgramCourseLinkVM, SetupBuildingAddressPossessionVM } from '../../../../models';
import { SetupBuildingService, SetupRoomService, SetupRoomBuildingLinkService, RegistrationProgramCourseLinkService } from '../../../../service';

import { AssessmentSchedulingDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { IAssessmentSchedulingList } from '../../../../models/Assessment/AssessmentSchedulingDetail';
import { AssessmentSchedulingDeatilService } from '../../../../service/Assessment/AssessmentSchedulingDeatil';
import { AssessmentSchedulingAddEdit } from '../add-edit';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'AssessmentScheduling-add-edit-model': AssessmentSchedulingAddEdit,
        'delete-model': AssessmentSchedulingDelete
    }
})

export class AssessmentScheduling extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AssessmentSchedulingDeatilService;
    private data: Array<IAssessmentSchedulingList> = [];
    private filterString: string = ''; 
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false; 
    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store);

    private courseLists: Array<RegistrationProgramCourseLinkVM> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private campusProgramId: string = "";

    programDetailId: string = '';

    private columns = [
        { key: 'assessmentName', caption: 'AssessmentName' },
        { key: 'totalWeightage', caption: "TotalWeightage" },
        { key: 'gradingPolicy', caption: "GradingPolicy" },
        { key: 'failCriteris', caption: "FailCriteris" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new AssessmentSchedulingDeatilService(this.$store); 
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
            if (('assessmentScheduling' in this.user.claims) == true) {
                if (this.user.claims['assessmentScheduling'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['assessmentScheduling'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['assessmentScheduling'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['assessmentScheduling'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.AssessmentSchedulingList()
            .then(response => this.data = (response as Array<IAssessmentSchedulingList>));
    }

 

    insertModel() {  
        this.$modal.show('AssessmentScheduling-add-edit-model', {
            model: {
            assessmentSchedulingMasterId: "",
            assessmentSchemeMasterId: "",
            assessmentName: "",
            totalWeightage: 0,
            failCriteris: "",
            gradingPolicy: "",
            statusId: 1,
            }, 
            IsNewRecord: true
        });
    }

    editModel(model: IAssessmentSchedulingList) {
        
        this.$modal.show('AssessmentScheduling-add-edit-model', { model: { 
            assessmentSchedulingMasterId:  model.assessmentSchedulingMasterId,
            assessmentSchemeMasterId: model.assessmentSchemeMasterId,
            assessmentName: model.assessmentName,
            totalWeightage: model.totalWeightage,
            failCriteris: model.failCriteris,
            gradingPolicy: model.gradingPolicy,
            statusId: model.statusId,
         }, IsNewRecord: false });
    }

    deleteModel(model: IAssessmentSchedulingList) { 
            this.$modal.show('delete-model', { model: model }); 
    }
}