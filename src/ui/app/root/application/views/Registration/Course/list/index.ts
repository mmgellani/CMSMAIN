/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { IHumanResourceDepartments, IRegistrationCourse, IRegistrationCourseVM, IRegistrationProgramCourseLink, IRegistrationSectionCourseLinkVM, ITimeTableTimeTableVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { HumanResourceDepartmentsService, RegistrationCourseService, RegistrationProgramCourseLinkService, RegistrationSectionCourseLinkService, TimeTableTimeTableService } from '../../../../service';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { RegistrationCourseAddEdit } from '../add-edit';
import { RegistrationCourseDelete } from '../delete';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Course-add-edit-model': RegistrationCourseAddEdit,
        'delete-model': RegistrationCourseDelete
    }
})

export class RegistrationCourseList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RegistrationCourseService;
    private data: Array<IRegistrationCourseVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private programcourseModel: Array<IRegistrationProgramCourseLink> = [];
    private repoprogramcourse: RegistrationProgramCourseLinkService;
    private sectioncourseModel: Array<IRegistrationSectionCourseLinkVM> = [];
    private reposectioncourse: RegistrationSectionCourseLinkService;
    private timeTableModel: Array<ITimeTableTimeTableVM> = [];
    private repositoryTimeTable: TimeTableTimeTableService;
    private repoDepartment: HumanResourceDepartmentsService = new HumanResourceDepartmentsService(this.$store)

    private columns = [
        { key: 'title', caption: 'Title' },
        { key: 'fullName', caption: 'FullName' },
        { key: 'departmentName', caption: 'FullName' },
        { key: 'subDepartmentName', caption: 'FullName' },
        { key: 'statusId', caption: 'StatusId' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    private departmentId: string = '';
    private departmentList: IHumanResourceDepartments[] = []
    private isAll:boolean = true;
    created() {
        this.repository = new RegistrationCourseService(this.$store);
        this.repoprogramcourse = new RegistrationProgramCourseLinkService(this.$store);
        this.reposectioncourse = new RegistrationSectionCourseLinkService(this.$store);
        this.repositoryTimeTable = new TimeTableTimeTableService(this.$store);
        this.loadDepartments();
        this.getprogramcourse();
        this.getsectioncourse();
        this.getTimeTable();
    }

    mounted() {
        this.validatePage();
        this.refreshData();

    }
    loadDepartments() {
        this.repoDepartment.GetFindBy('e=>e.StatusId!=2')
            .then(r => {
                this.departmentList = r as IHumanResourceDepartments[]
            })
    }
    getsectioncourse() {
        this.sectioncourseModel = [];
        this.reposectioncourse.GetFindBy('e => e.StatusId!=2')
            .then(response => this.sectioncourseModel = (response as Array<IRegistrationSectionCourseLinkVM>));
    }

    getprogramcourse() {
        this.programcourseModel = [];
        this.repoprogramcourse.GetFindBy('e => e.StatusId!=2')
            .then(response => this.programcourseModel = (response as Array<IRegistrationProgramCourseLink>));
    }

    getTimeTable() {
        this.timeTableModel = [];
        this.repositoryTimeTable.GetFindBy('e => e.StatusId!=2')
            .then(response => this.timeTableModel = (response as Array<ITimeTableTimeTableVM>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('registrationCourse' in this.user.claims) == true) {
                if (this.user.claims['registrationCourse'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['registrationCourse'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['registrationCourse'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['registrationCourse'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        // console.log(this.isAll)
        //if(this.isAll) this.departmentId=''
        // if (this.isAll) {
        //     console.log('in all' +this.isAll)
        //     //this.repository.GetFindBy('e=>e.StatusId!=2')
        //     this.repository.GetFindBy('s=> s.StatusId!=2')

        //         .then(response => this.data = (response as Array<IRegistrationCourse>));
        // } else {

            console.log('in else' +this.isAll)

            this.repository.GetFindBy('e=>e.StatusId!=2') .then(response => this.data = (response as Array<IRegistrationCourseVM>));
             


            // if (this.departmentId.length > 0) {
            //     this.repository.GetFindBy('s=>s.DepartmentId.ToString()=="' + this.departmentId + '" && s.StatusId!=2')

            //         .then(response => this.data = (response as Array<IRegistrationCourse>));
            // }

        
    }

    insertModel() {
        //if (this.departmentId.length > 0) {
            this.$modal.show('Course-add-edit-model', { model: { departmentId: '', courseId: '', title: '', fullName: '', statusId: 0, loggerId: '', }, IsNewRecord: true });

        //}
    
    }

    editModel(model: IRegistrationCourseVM) {

        this.$modal.show('Course-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IRegistrationCourse) {

        if (this.programcourseModel.filter(e => e.courseId == model.courseId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Mapped",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }
        // else if (this.sectioncourseModel.filter(e => e.courseId == model.courseId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }

        else if (this.timeTableModel.filter(e => e.sectionCourseLinkId == model.courseId).length > 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "This Parent Child Relation Cannot be Deleted",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });
        }

        else {
            this.$modal.show('delete-model', { model: model });
        }
    }
}