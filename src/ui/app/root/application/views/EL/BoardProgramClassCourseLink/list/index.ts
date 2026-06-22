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

import { IBoardProgramClassCourseLink, IRegistrationCourse, ISetupClass, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM, IELChapters, IBoards, ISetupProgram } from '../../../../models';
import { BoardProgramClassCourseLinkService, RegistrationCourseService, SetupClassService, RegistrationProgramCourseLinkService, ELChaptersService, BoardsService, SetupProgramService } from '../../../../service';

import { BoardProgramClassCourseLinkAddEdit } from '../add-edit';
import { BoardProgramClassCourseLinkDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': BoardProgramClassCourseLinkAddEdit,
        'delete-model': BoardProgramClassCourseLinkDelete
    }
})

export class BoardProgramClassCourseLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: BoardProgramClassCourseLinkService;
    private data: Array<IBoardProgramClassCourseLink> = [];
    private filterString: string = '';
    private classId = '';
    private courseId = ''
    boardId = "";
    programId = ""
    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []
    private chapterId = ''
    private programCourseRepo: RegistrationCourseService = new RegistrationCourseService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private chapterList: Array<IELChapters> = []
    private chapterRepo: ELChaptersService = new ELChaptersService(this.$store);
    private columns = [
        { key: 'program', caption: 'Program' },
        { key: 'class', caption: 'Class' },
        { key: 'course', caption: 'Course' },
        { key: 'board', caption: 'Board' },

        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    boardList: IBoards[] = [];
    boardRepo: BoardsService = new BoardsService(this.$store);
    programList: ISetupProgram[] = [];
    programRepo: SetupProgramService = new SetupProgramService(this.$store);

    created() {
        this.repository = new BoardProgramClassCourseLinkService(this.$store);
        this.loadBoards()
        this.loadClass()
        this.loadPrograms()
        this.loadCourse();
    }

    loadPrograms() {
        this.programRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.programList = r

            })
    }
    loadBoards() {
        this.boardRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.boardList = r

            })
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.classList = r

            })
    }
    loadCourse() {
        this.programCourseRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.courseList = r as Array<RegistrationProgramCourseLinkVM>
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
            if (('BoardProgramClassCourseLinkList' in this.user.claims) == true) {
                if (this.user.claims['BoardProgramClassCourseLinkList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['BoardProgramClassCourseLinkList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['BoardProgramClassCourseLinkList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['BoardProgramClassCourseLinkList'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
       // if (this.programId.length > 0 && this.courseId.length > 0 && this.classId.length > 0 && this.boardId.length > 0) {
            this.repository.GetAllVM()
                .then(r => {
                    this.data = r
                })
            // this.repository.GetFindBy('s=>s.ChapterId.ToString()=="' + this.chapterId + '" && s.StatusId!=2')
            //     .then(response => this.data = (response as Array<IBoardProgramClassCourseLink>));
       // }

    }

    insertModel() {
        console.log('calling')
        // if (this.classId.length > 0 && this.courseId.length > 0) {
        this.$modal.show('add-edit-model', { model: { boardId: '', boardProgramClassCourseLinkId: '', classId: '', courseId: '', programId: '', statusId: 0 }, IsNewRecord: true });
        // }
        // else{
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: 'Please Select Drop Down Values First',
        //         title: 'Warning',
        //         messageTypeId: PayloadMessageTypes.warning
        //     });
        // }
    }

    editModel(model: IBoardProgramClassCourseLink) {
        console.log(model)
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IBoardProgramClassCourseLink) {
        this.$modal.show('delete-model', { model: model });
    }
}