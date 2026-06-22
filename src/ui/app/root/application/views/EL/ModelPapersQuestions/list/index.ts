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

import { IELModelPapersQuestions, RegistrationProgramCourseLinkVM, ISetupClass, IELModelPapers } from '../../../../models';
import { ELModelPapersQuestionsService, RegistrationProgramCourseLinkService, SetupClassService, ELModelPapersService } from '../../../../service';

import { ELModelPapersQuestionsAddEdit } from '../add-edit';
import { ELModelPapersQuestionsDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ELModelPapersQuestionsAddEdit,
        'delete-model': ELModelPapersQuestionsDelete
    }
})

export class ELModelPapersQuestionsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ELModelPapersQuestionsService;
    private data: Array<IELModelPapersQuestions> = [];
    private filterString: string = '';
    private classId = '';
    private courseId = '';
    private modelPaperId = '';

    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []
    private modelPaperList: Array<IELModelPapers> = []

    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private modelPaperRepo: ELModelPapersService = new ELModelPapersService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'fullQuestion', caption: 'FullQuestion' }, 
        { key: 'orderNumber', caption: "OrderNumber" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ELModelPapersQuestionsService(this.$store);
        this.loadClass();
        this.loadModelPaper();
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.classList = r as Array<ISetupClass>
            })
    }
    loadCourse() {
        if (this.classId.length > 0) {
            this.programCourseRepo.GetByClassId(this.classId)
                .then(r => {
                    this.courseList = r as Array<RegistrationProgramCourseLinkVM>
                    this.refreshData();
                })
        }

    }
    loadModelPaper() {
        this.modelPaperRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.modelPaperList = r as Array<IELModelPapers>
            })
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
           
            if (('elModelPapersQuestions' in this.user.claims) == true) {
               
                if (this.user.claims['elModelPapersQuestions'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['elModelPapersQuestions'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['elModelPapersQuestions'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['elModelPapersQuestions'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.modelPaperId.length > 0 && this.courseId.length > 0 && this.classId.length > 0) {

            this.repository.GetFindBy('s=>s.ModelPaperId.ToString()=="' + this.modelPaperId + '" && s.CourseId.ToString()=="'+this.courseId+'" && s.StatusId!=2')
                .then(response => this.data = (response as Array<IELModelPapersQuestions>));
        }

    }
    insertModel() {
        this.$modal.show('add-edit-model', { model: { modelPapersQuestionsId: '', modelPaperId: this.modelPaperId, courseId: this.courseId, fullQuestion: '', orderNumber: 0, answers: '', isActive: 0, }, IsNewRecord: true });
    }

    editModel(model: IELModelPapersQuestions) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IELModelPapersQuestions) {
        this.$modal.show('delete-model', { model: model });
    }
}