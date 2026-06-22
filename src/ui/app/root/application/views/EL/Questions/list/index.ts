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

import { IELQuestions, RegistrationProgramCourseLinkVM, ISetupClass, IELChapters, IELTopics } from '../../../../models';
import { ELQuestionsService, RegistrationProgramCourseLinkService, SetupClassService, ELChaptersService, ELTopicsService } from '../../../../service';

import { ELQuestionsAddEdit } from '../add-edit';
import { ELQuestionsDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ELQuestionsAddEdit,
        'delete-model': ELQuestionsDelete
    }
})

export class ELQuestionsList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ELQuestionsService;
    private data: Array<IELQuestions> = [];
    private filterString: string = '';
    private classId = '';
    private courseId = ''
    private chapterId = ''
    private topicId = ''
    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []
    private chapterList: Array<IELChapters> = []
    private topicList: Array<IELTopics> = []

    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private chapterRepo: ELChaptersService = new ELChaptersService(this.$store)
    private topicRepo: ELTopicsService = new ELTopicsService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [ 
        { key: 'fullQuestion', caption: 'FullQuestion' }, 
        { key: 'questionType', caption: 'QuestionType' }, 
        { key: 'difficultyLevel', caption: "DifficultyLevel" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ELQuestionsService(this.$store);
        this.loadClass();
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
    loadChapters() {
        if (this.courseId.length > 0) {
            this.chapterRepo.GetFindBy('s=>s.CourseId.ToString()=="' + this.courseId + '" && s.StatusId==1')
                .then(r => {
                    this.chapterList = r as Array<IELChapters>
                    this.refreshData();

                })
        }
    }

    loadTopics() {
        if (this.chapterId.length > 0) {
            this.topicRepo.GetFindBy('s=>s.ChapterId.ToString()=="' + this.chapterId + '" && s.StatusId==1')
                .then(r => {
                    this.topicList = r as Array<IELTopics>
                    this.refreshData();

                })
        }
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
          
            if (('elQuestions' in this.user.claims) == true) {
                
                if (this.user.claims['elQuestions'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['elQuestions'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['elQuestions'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['elQuestions'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.classId.length > 0 && this.courseId.length > 0 && this.chapterId.length > 0 && this.topicId.length > 0) {
            this.repository.GetFindBy('s=>s.TopicId.ToString()=="' + this.topicId + '" && s.StatusId!=2')
                .then(response => this.data = (response as Array<IELQuestions>));
        }
    }
    insertModel() {
        this.$modal.show('add-edit-model', { model: { questionId: '', topicId: this.topicId, fullQuestion: '', questionType: 0, difficultyLevel: 0, answers: '', orderNumber: 0, statusId: 1 }, IsNewRecord: true });
    }

    editModel(model: IELQuestions) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IELQuestions) {
        this.$modal.show('delete-model', { model: model });
    }
}