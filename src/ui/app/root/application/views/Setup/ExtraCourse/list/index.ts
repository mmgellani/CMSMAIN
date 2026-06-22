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

import { ISetupInstitutionType, ISetupInstitution, ISetupSession, ISetupCampus, ICampusCityVM } from '../../../../models';
import { SetupInstitutionTypeService, SetupInstitutionService, SetupCampusService, SetupSessionService, RegistrationCourseService } from '../../../../service';

import { SetupExtraCourseAddEdit } from '../add-edit';
import { SetupExtraCourseDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';
import { SetupExtraCourseService } from '../../../../service/Setup/ExtraCourse';
import { ISetupExtraCourse, ISetupExtraCourseVM } from '../../../../models/Setup/ExtraCourse';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'ExtraCourse-add-edit-model': SetupExtraCourseAddEdit,
        'delete-model': SetupExtraCourseDelete
    }
})

export class SetupExtraCourseList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SetupExtraCourseService;
    private data: Array<ISetupExtraCourseVM> = [];
    private filterString: string = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private institutionModel: Array<ISetupInstitution> = [];
    private repositoryInstitution: SetupInstitutionService;

    private sessionList: Array<ISetupSession> = [];
    private sessionId = "";
    private campusId = "";
    private campusList: Array<ISetupCampus> = [];
    private campusCityList: Array<ICampusCityVM> = [];

    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);


    private courseRepo: RegistrationCourseService = new RegistrationCourseService(this.$store);



    private columns = [
        { key: 'courseName', caption: 'CourseName' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new SetupExtraCourseService(this.$store);
        this.repositoryInstitution = new SetupInstitutionService(this.$store);
    }

    mounted() {
        this.validatePage();
        // this.refreshData();
        // this.getInstitution();
        this.loadSession();
        this.loadCityCampus();
    }

    loadCityCampus() {
        this.campusCityList = [];
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadSession() {
        this.sessionList = [];
        this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
            this.sessionList = r as Array<ISetupSession>;
        });
    }

    getInstitution() {
        this.institutionModel = [];
        this.repositoryInstitution.GetFindBy('e => e.StatusId!=2')
            .then(response => this.institutionModel = (response as Array<ISetupInstitution>));
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('setupExtraCourse' in this.user.claims) == true) {
                if (this.user.claims['setupExtraCourse'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['setupExtraCourse'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['setupExtraCourse'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['setupExtraCourse'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.sessionId.length > 0 && this.campusId.length > 0) {
            this.data = [];
            this.repository.GetFindByVM(this.sessionId + "?" + this.campusId)
                .then(response => this.data = (response as Array<ISetupExtraCourseVM>));
        }
    }

    insertModel() {
        this.$modal.show('ExtraCourse-add-edit-model', { model: { extraCourseId: '', sessionId: this.sessionId, campusId: this.campusId, courseId: '', statusId: 1 }, IsNewRecord: true });
    }

    editModel(model: ISetupExtraCourse) {
        this.$modal.show('ExtraCourse-add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: ISetupExtraCourse) {

        this.$modal.show('delete-model', { model: model });

    }
}