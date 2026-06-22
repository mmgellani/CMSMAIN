/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { IEmailTemplate, IHumanResourceDepartments, IRegistrationCourse, IRegistrationCourseVM, IRegistrationProgramCourseLink, IRegistrationSectionCourseLinkVM, ISetupProgram, ITimeTableTimeTableVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { EmailTemplateService, HumanResourceDepartmentsService, RegistrationCourseService, RegistrationProgramCourseLinkService, RegistrationSectionCourseLinkService, SetupProgramService, TimeTableTimeTableService } from '../../../../service';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { RegistrationCourseAddEdit } from '../add-edit';
import { RegistrationCourseDelete } from '../delete';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { RegistrationEmailProgramService } from '../../../../service/Registration/EmailProgramLink';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'Course-add-edit-model': RegistrationCourseAddEdit,
        'delete-model': RegistrationCourseDelete
    }
})

export class RegistrationEmailProgramList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RegistrationEmailProgramService;
    private data: Array<IRegistrationCourseVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
   

    private repoEmailTemplate: EmailTemplateService = new EmailTemplateService(this.$store)

    

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

    private EmailList: IEmailTemplate[] = []
    private programRepo: SetupProgramService = new SetupProgramService(this.$store);

    private programList: Array<ISetupProgram> = [];
    private programId = '';



    private isAll:boolean = true;
    created() {
        this.repository = new RegistrationEmailProgramService(this.$store);
     
    }

    loadPrograms() {
        this.programRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.programList = r as Array<ISetupProgram>
            })
    }


    mounted() {
        this.validatePage();
        this.refreshData();
        this.loadEmailTemplate();

    }
    loadEmailTemplate() {
        this.repoEmailTemplate.GetFindByAsync('e=>e.StatusId==1')
            .then(r => {
                this.EmailList = r as IEmailTemplate[]
            })
    }
    

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('registrationEmailProgram' in this.user.claims) == true) {
                if (this.user.claims['registrationEmailProgram'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['registrationEmailProgram'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['registrationEmailProgram'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['registrationEmailProgram'].indexOf('D') >= 0) {
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

        // if (this.programcourseModel.filter(e => e.courseId == model.courseId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "Record Already Mapped",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }
  

        // else if (this.timeTableModel.filter(e => e.sectionCourseLinkId == model.courseId).length > 0) {
        //     this.$store.dispatch(StoreTypes.updateStatusBar, {
        //         text: "This Parent Child Relation Cannot be Deleted",
        //         title: "Success",
        //         messageTypeId: PayloadMessageTypes.success
        //     });
        // }

        // else {
        //     this.$modal.show('delete-model', { model: model });
        // }
    }
}