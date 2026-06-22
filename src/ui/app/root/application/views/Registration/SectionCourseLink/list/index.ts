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

import { IRegistrationSectionCourseLink, ISetupCampus, ISetupSession, ISetupProgramDetails, ISetupCampusProgramLinkVM, IRegistrationSectionCourseLinkVM, ISetupClass, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampusProgramVM, IExaminationExamMasterVM, IExaminationExamMaster, IRegistrationSectionCourseLink1 } from '../../../../models';
import { RegistrationSectionCourseLinkService, SetupCampusService, SetupSessionService, SetupProgramDetailsService, SetupCampusProgramLinkService, SetupClassService, ExaminationExamMasterService } from '../../../../service';

import { RegistrationSectionCourseLinkAddEdit } from '../add-edit';
import { RegistrationSectionCourseLinkAddEditBulk } from '../add-edit-bulk';
import { RegistrationSectionCourseLinkDelete } from '../delete';
import { StoreTypes } from '../../../../../../store';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': RegistrationSectionCourseLinkAddEdit,
        'delete-model': RegistrationSectionCourseLinkDelete,
        'add-edit-bulk-model': RegistrationSectionCourseLinkAddEditBulk

    }
})

export class RegistrationSectionCourseLinkList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: RegistrationSectionCourseLinkService;
    private data: Array<IRegistrationSectionCourseLinkVM> = [];
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private campusProgramId = ''
    private Programdetailid = '';
    private classid: string = '';
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []

    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private repoClass = new SetupClassService(this.$store);
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store)
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    classList: Array<ISetupClass> = []
    private campusCityList: Array<ICampusCityVM> = []
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private examMasterModel: Array<IExaminationExamMasterVM> = [];
    private repositoryExamMaster: ExaminationExamMasterService;

    private columns = [
        { key: 'className', caption: 'Class' },
        { key: 'sectionName', caption: 'Section' },
       // { key: 'buildingRooms', caption: "Room" },
        { key: 'fromSerial', caption: "From Serial" },
        { key: 'toSerial', caption: 'To Serial' },
        { key: 'statusId', caption: 'Status' },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new RegistrationSectionCourseLinkService(this.$store);
        this.repositoryExamMaster = new ExaminationExamMasterService(this.$store);
        this.$watch('sessionId', this.loadCityCampus);
        this.$watch('campusId', this.loadProgramsOfCampus);
        this.$watch('campusProgramId', this.loadClass);
        this.$watch('classid', this.refreshData);
        // this.loadCityCampus();
        this.loadSession();
    }
    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }
    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }

    loadProgramDetail() {
        this.Programdetailid = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId).programDetailId

    }
    loadClass() {
        this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList = res as Array<ISetupClass>

        });
    }

    mounted() {
        this.validatePage();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('registrationSectionCourseLink' in this.user.claims) == true) {
                if (this.user.claims['registrationSectionCourseLink'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['registrationSectionCourseLink'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['registrationSectionCourseLink'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['registrationSectionCourseLink'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        debugger;
        this.loadProgramDetail();
        var key = this.sessionId + '?' + this.campusId + '?' + this.classid + '?' + this.Programdetailid

        this.data = [];
        this.repository.GetAllAsync(key)
            .then(response => this.data = (response as Array<IRegistrationSectionCourseLinkVM>) ///add field in model


            );


    }

    insertBulkModel() {
        this.$modal.show('add-edit-bulk-model', { model: { sectionCourseLinkId: '', campusProgramId: this.campusProgramId, classId: this.classid, courseId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '', }, IsNewRecord: true, Programdetailid: this.Programdetailid })

    }
    insertModel()
     {
     debugger;
        if (this.campusId.length > 0 && this.sessionId.length > 0 && this.campusProgramId.length > 0 && this.classid.length > 0) {
            this.$modal.show('add-edit-model', { model: { sectionCourseLinkId: '', campusProgramId: this.campusProgramId, classId: '', courseId: '', sectionId: '', fromSerial: 0, toSerial: 0, statusId: 0, loggerId: '', }, IsNewRecord: true, CampusId: this.campusId });
        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select the Dropdowns",
                title: "Danger",
                messageTypeId: PayloadMessageTypes.error
            });
        }
    }
    //IRegistrationSectionCourseLink1
    editModel(model: IRegistrationSectionCourseLink) { 
    this.$modal.show('add-edit-model', { model: model, IsNewRecord: false,  CampusId: this.campusId, ClassID: this.classid });
    
}
    
//IRegistrationSectionCourseLink1
    deleteModel(model: IRegistrationSectionCourseLink) {

        if (this.examMasterModel.filter(e => e.sectionCourseLinkId == model.sectionCourseLinkId).length > 0) {
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