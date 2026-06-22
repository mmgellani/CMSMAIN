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

import { IMCQsQuestion, IRegistrationCourse, ISetupClass, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM, IELChapters } from '../../../../models';
import { MCQsQuestionService, RegistrationCourseService, SetupClassService, RegistrationProgramCourseLinkService, ELChaptersService } from '../../../../service';

import { MCQsQuestionAddEdit } from '../add-edit';
import { MCQsQuestionDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': MCQsQuestionAddEdit,
        'delete-model': MCQsQuestionDelete
    }
})

export class MCQsQuestionList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: MCQsQuestionService;
    private data: Array<IMCQsQuestion> = [];
    private filterString: string = '';
    private classId = '';
    private courseId = ''
    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []
private chapterId=''
    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private chapterList: Array<IELChapters> = []
    private chapterRepo: ELChaptersService = new ELChaptersService(this.$store);
    private columns = [
        { key: 'question', caption: 'Question' },
        { key: 'answers', caption: 'Answers' },

        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new MCQsQuestionService(this.$store);
         this.loadChapters()

    }

    loadChapters() {
        this.chapterRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.chapterList = r as Array<IELChapters>

            })
    }
    loadCourse() {
        this.programCourseRepo.GetByClassId(this.classId)
            .then(r => {
                this.courseList = r as Array<RegistrationProgramCourseLinkVM>
                this.refreshData();
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
            if (('MCQsQuestionList' in this.user.claims) == true) {
                if (this.user.claims['MCQsQuestionList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['MCQsQuestionList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['MCQsQuestionList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['MCQsQuestionList'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.chapterId.length > 0) {

        this.repository.GetFindBy('s=>s.ChapterId.ToString()=="' + this.chapterId + '" && s.StatusId!=2')
            .then(response => this.data = (response as Array<IMCQsQuestion>));
        }

    }

    insertModel() {
        console.log('calling')
        // if (this.classId.length > 0 && this.courseId.length > 0) {
        this.$modal.show('add-edit-model', { model: { mcqId: '', chapterId: this.chapterId, answers: '', question: '', statusId: 0 }, IsNewRecord: true });
        // }
        // else{
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: 'Please Select Drop Down Values First',
        //         title: 'Warning',
        //         messageTypeId: PayloadMessageTypes.warning
        //     });
        // }
    }

    editModel(model: IMCQsQuestion) {
        console.log(model)
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IMCQsQuestion) {
        this.$modal.show('delete-model', { model: model });
    }
}