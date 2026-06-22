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

import { IMCQsAnswers, IRegistrationCourse, ISetupClass, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM, IMCQsQuestion } from '../../../../models';
import { MCQsAnswersService, RegistrationCourseService, SetupClassService, RegistrationProgramCourseLinkService, MCQsQuestionService } from '../../../../service';

import { MCQsAnswersAddEdit } from '../add-edit';
import { MCQsAnswersDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': MCQsAnswersAddEdit,
        'delete-model': MCQsAnswersDelete
    }
})

export class MCQsAnswersList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: MCQsAnswersService;
    private data: Array<IMCQsAnswers> = [];
    private filterString: string = '';
    private classId = '';
    private courseId = ''
    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []

    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;

    private columns = [
        { key: 'optionId', caption: 'Option' },
        { key: 'isTrue', caption: 'Answer Status' },

        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    QuestionRepo: MCQsAnswersService;
    questionList: IMCQsQuestion[]=[];
    questionid = ""
    created() {
        this.repository = new MCQsAnswersService(this.$store);
        this.QuestionRepo = new MCQsQuestionService(this.$store);
        this.loadQuestions();
        //  this.loadClass()

    }

    // loadClass() {
    //     this.classRepo.GetFindBy('s=>s.StatusId==1')
    //         .then(r => {
    //             this.classList = r as Array<ISetupClass>

    //         })
    // }
    loadQuestions() {
        this.QuestionRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.questionList = r as Array<IMCQsQuestion>
                // this.refreshData();
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
            if (('MCQsAnswers' in this.user.claims) == true) {
                if (this.user.claims['MCQsAnswers'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['MCQsAnswers'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['MCQsAnswers'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['MCQsAnswers'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.questionid.length > 0 ) {

        this.repository.GetFindBy('s=>s.MCQsQuestionId.ToString()=="'+this.questionid+'" && s.StatusId!=2')
            .then(response => this.data = (response as Array<IMCQsAnswers>));
        }

    }

    insertModel() {
         if (this.questionid.length > 0 ) {
        this.$modal.show('add-edit-model', { model: { optionId: '', isTrue: false, mcQsAnswersId: '', mcQsQuestionId: this.questionid, statusId: 0 }, IsNewRecord: true });
        }
        else{
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Drop Down Values First',
                title: 'Warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
    }

    editModel(model: IMCQsAnswers) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IMCQsAnswers) {
        this.$modal.show('delete-model', { model: model });
    }
}