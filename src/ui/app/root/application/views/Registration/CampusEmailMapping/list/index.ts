/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { IHumanResourceDepartments, IEmailTemplate, IRegistrationProgramCourseLink, IRegistrationSectionCourseLinkVM, ITimeTableTimeTableVM, ISetupCampus, ICampusCityVM } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { HumanResourceDepartmentsService, EmailTemplateService, RegistrationProgramCourseLinkService, RegistrationSectionCourseLinkService, TimeTableTimeTableService, SetupCampusService } from '../../../../service';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { CampusEmailMappingAddEdit } from '../add-edit';
import { CampusEmailMappingDelete } from '../delete';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { CampusEmailMappingService } from '../../../../service/Registration/EmailMapping';
import { IEmailMapping } from '../../../../models/Registration/EmailMapping';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'CampusEmailMapping-add-edit-model': CampusEmailMappingAddEdit,
        'delete-model': CampusEmailMappingDelete
    }
})

export class CampusEmailMapping extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: CampusEmailMappingService;
    private data: Array<IEmailMapping> = [];

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private campusCityList: Array<ICampusCityVM> = []
    private columns = [
        { key: 'email', caption: 'Email' },
        { key: 'password', caption: 'Password' },
        { key: 'mailBox', caption: 'Mail Box' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];
    private departmentId: string = '';
    private campusId: string = '';
    private departmentList: IHumanResourceDepartments[] = []
    created() {
        this.repository = new CampusEmailMappingService(this.$store);

    }

    mounted() {
        this.validatePage();
        // this.refreshData();
        this.loadCampus();
    }

    loadCampus() {
        this.campusCityList = []
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('CampusEmailMapping' in this.user.claims) == true) {
                if (this.user.claims['CampusEmailMapping'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['CampusEmailMapping'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['CampusEmailMapping'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['CampusEmailMapping'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.data = [];
        this.repository.GetEmailMappinglist(this.campusId).then(response => this.data = (response as Array<IEmailMapping>));
    }

    insertModel() {
        this.$modal.show('CampusEmailMapping-add-edit-model', { model: { campusId: this.campusId, campusEmailLinkId: '', email: '', password: '', statusId: 1, operationName: '', mailBox: '' }, IsNewRecord: true });
    }

    editModel(model: IEmailMapping) {
        this.$modal.show('CampusEmailMapping-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IEmailMapping) {
        this.$modal.show('delete-model', { model: model });
    }
}