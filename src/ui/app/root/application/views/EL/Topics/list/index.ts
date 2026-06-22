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

import { IELTopics, RegistrationProgramCourseLinkVM, ISetupClass, IELChapters } from '../../../../models';
import { ELTopicsService, RegistrationProgramCourseLinkService, SetupClassService, ELChaptersService } from '../../../../service';

import { ELTopicsAddEdit } from '../add-edit';
import { ELTopicsDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ELTopicsAddEdit,
        'delete-model': ELTopicsDelete
    }
})

export class ELTopicsList extends Vue {

    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ELTopicsService;
    private data: Array<IELTopics> = [];
    private filterString: string = '';
    private classId = '';
    private courseId = ''
    private chapterId = ''
    private courseList: Array<RegistrationProgramCourseLinkVM> = []
    private classList: Array<ISetupClass> = []
    private chapterList: Array<IELChapters> = []

    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private chapterRepo: ELChaptersService = new ELChaptersService(this.$store)


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [
        { key: 'fullName', caption: 'FullName' },
        { key: 'tCode', caption: 'TCode' },
        { key: 'description', caption: 'Description' },
        { key: 'videoLink', caption: 'VideoLink' },
        { key: 'orderNumber', caption: "OrderNumber" },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ELTopicsService(this.$store);
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
    mounted() {
        this.validatePage();
        this.refreshData();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('elTopics' in this.user.claims) == true) {
                if (this.user.claims['elTopics'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['elTopics'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['elTopics'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['elTopics'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        if (this.classId.length > 0 && this.courseId.length > 0 && this.chapterId.length > 0) {
            this.repository.GetFindBy('s=>s.ChapterId.ToString()=="' + this.chapterId + '" && s.StatusId!=2')
                .then(response => this.data = (response as Array<IELTopics>));
        }
    }
    insertModel() {
        this.$modal.show('add-edit-model', { model: { topicId: '', chapterId: this.chapterId, tCode: '', fullName: '', description: '', videoLink: '', orderNumber: 0, isEnable: 0, }, IsNewRecord: true });
    }

    editModel(model: IELTopics) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IELTopics) {
        this.$modal.show('delete-model', { model: model });
    }
}