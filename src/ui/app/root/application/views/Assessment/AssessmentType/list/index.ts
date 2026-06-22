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
import { DeleteAssessmentTypeAdd } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { IAssessmentType,IAssessmentTypeAdd } from '../../../../models/Setup/AssessmentType';
import { AssessmentTypeService } from '../../../../service/Setup/AssessmentType';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'assessmentType-add-edit-model': SetupBusinessUnitAddEdit,
        'delete-model': DeleteAssessmentTypeAdd
    }
})

export class AssessmentType extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AssessmentTypeService;
    private data: Array<IAssessmentType> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private istitutionModel: Array<ISetupInstitution> = [];
    private assesmenttypelist: Array<IAssessmentType> = [];
    private assesmenttypedel: Array<IAssessmentTypeAdd> = []; 
    // private assesmenttypedelEx: Array<IAssessmentTypeAddEx> = []; 

    

    private repositoryInstitution: SetupInstitutionService;

    private columns = [
        { key: 'assessmentCategory', caption: 'AssessmentCategory' },
        { key: 'assessmentType', caption: "AssessmentType" },
        { key: 'code', caption: "Code"  },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new AssessmentTypeService(this.$store);
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
            if (('assessmentType' in this.user.claims) == true) {
                if (this.user.claims['assessmentType'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['assessmentType'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['assessmentType'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['assessmentType'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    // refreshData() {
    //     
    //     this.assesmenttypelist = [];
    //     this.repository.GetAll()
    //         .then(response => this.assesmenttypelist = (response as Array<IAssessmentType>));
    //         console.log(this.assesmenttypelist,'test')
    // }
    
    refreshData() {
        
        this.assesmenttypelist = [];
        this.repository.GetAll()
            .then(response => {
                this.assesmenttypelist = response as Array<IAssessmentType>;
               
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    

    insertModel() {
        this.$modal.show('assessmentType-add-edit-model', { model: { assessmentTypeId: '', assessmentCategoryId: '', examTypeId: '',  statusId: 0, }, IsNewRecord: true });
    }

    editModel(model: IAssessmentType) {
        this.$modal.show('assessmentType-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IAssessmentType) {
        
        if (this.data.filter(e => e.assessmentTypeId == model.assessmentTypeId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        else { 
            this.$modal.show('delete-model', { model:model  });
        }
    }
}