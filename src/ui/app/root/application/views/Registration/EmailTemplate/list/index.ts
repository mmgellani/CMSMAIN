/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { IHumanResourceDepartments, IEmailTemplate, IRegistrationProgramCourseLink, IRegistrationSectionCourseLinkVM, ITimeTableTimeTableVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { HumanResourceDepartmentsService, EmailTemplateService, RegistrationProgramCourseLinkService, RegistrationSectionCourseLinkService, TimeTableTimeTableService } from '../../../../service';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { EmailTemplateAddEdit } from '../add-edit';
import { EmailTemplateDelete } from '../delete';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'emailTemplate-add-edit-model': EmailTemplateAddEdit,
        'delete-model': EmailTemplateDelete
    }
})

export class EmailTemplateList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: EmailTemplateService;
    private data: Array<IEmailTemplate> = [];
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
        { key: 'subject', caption: 'Subject' },
        { key: 'body', caption: 'Body' },
      
        { key: 'statusId', caption: 'StatusId' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    private departmentId: string = '';
    private departmentList: IHumanResourceDepartments[] = []
    private isAll: boolean = true;
    created() {
        this.repository = new EmailTemplateService(this.$store);
       
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
            if (('EmailTemplate' in this.user.claims) == true) {
                if (this.user.claims['EmailTemplate'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['EmailTemplate'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['EmailTemplate'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['EmailTemplate'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        console.log('in else' + this.isAll)
        this.repository.GetFindByAsync('e=>e.StatusId!=2').then(response => this.data = (response as Array<IEmailTemplate>));
    }

    insertModel() {
        //if (this.departmentId.length > 0) {
        this.$modal.show('emailTemplate-add-edit-model', { model: { body: '', statusId: 1, emailTemplateId: '', subject: '' }, IsNewRecord: true });

        //}

    }

    editModel(model: IEmailTemplate) {

        this.$modal.show('emailTemplate-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IEmailTemplate) {



        //else {
        this.$modal.show('delete-model', { model: model });
        //}
    }
}