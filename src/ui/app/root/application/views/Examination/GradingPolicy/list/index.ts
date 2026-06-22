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

import { IExaminationGradingPolicy, ISetupCampus, ISetupSession, ISetupCampusProgramVM, DDLGroupModel, DDLModel, ICampusCityVM, ISetupClass, ISetupSection, IRegistrationSectionCourseLinkVM } from '../../../../models';
import { ExaminationGradingPolicyService, SetupCampusProgramLinkService, SetupCampusService, SetupSessionService, SetupClassService, SetupSectionService, RegistrationSectionCourseLinkService } from '../../../../service';

import { ExaminationGradingPolicyAddEdit } from '../add-edit';
import { ExaminationGradingPolicyDelete } from '../delete';

@Component({
  name: 'models-form-list',
  template: require('./index.html'),
  components: {
    'add-edit-model': ExaminationGradingPolicyAddEdit,
    'delete-model': ExaminationGradingPolicyDelete
  }
})

export class ExaminationGradingPolicyList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: ExaminationGradingPolicyService;
  private data: Array<IExaminationGradingPolicy> = [];
  private filterString: string = '';
  private campusId = ''
  private sessionId = ''
  private campusProgramId = '';
  private programDetailId = '';
  private classId = ''
  private sectionId = '';


  private campusList: Array<ISetupCampus> = []
  private sessionList: Array<ISetupSession> = []
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
  private programDDL: Array<DDLGroupModel> = []
  private ddl: Array<DDLModel> = []
  private campusCityList: Array<ICampusCityVM> = []
  private classList: Array<ISetupClass> = []
  private sectionModel: Array<ISetupSection> = [];
  sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];

  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []

  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
  private classRepo: SetupClassService = new SetupClassService(this.$store)
  private sectionRepo: SetupSectionService;
  private SectionCourserepository: RegistrationSectionCourseLinkService;


  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    { key: 'fullName', caption: 'FullName' },
    { key: 'fromRange', caption: 'From Range' },
    { key: 'toRange', caption: 'To Range' },
    { key: 'remarks', caption: "Remarks" },
    { key: 'statusId', caption: 'Status' },
    { key: 'action', caption: 'Action', width: 120 }
  ];

  created() {
    this.repository = new ExaminationGradingPolicyService(this.$store);
    this.sectionRepo = new SetupSectionService(this.$store);
    this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadSession();
    // this.refreshData();
  }

  getGrades(item) {
    return JSON.parse(item);
  }
  getFailRemarks(item) {
    return JSON.parse(item);
  }
  getSection() {
    this.sectionRepo
      .GetAll()
      .then(response => (this.sectionModel = response as Array<ISetupSection>));
  }
  loadSection() {
    this.sectionCourseLinkList = [];
    var key = this.campusId + "?" + this.campusProgramId + "?" + this.classId
    this.SectionCourserepository.GetSectionData(key)
      .then(response => {
        this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
      });
  }

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('examinationGradingPolicy' in this.user.claims) == true) {
        if (this.user.claims['examinationGradingPolicy'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['examinationGradingPolicy'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['examinationGradingPolicy'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['examinationGradingPolicy'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push('Home');
      }
    }
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

  loadClass() {
    this.classRepo.GetFindBy('s=>s.StatusId!=2')
      .then(r => { this.classList = r as Array<ISetupClass> });
  }

  refreshData() {
    this.data = [];
    if (this.classId.length > 0 && this.campusProgramId.length > 0 && this.sectionId.length > 0) {
      this.repository.GetFindBy('s=>s.ClassId.ToString()=="' + this.classId + '" && s.CampusProgramId.ToString()=="' + this.campusProgramId + '" && s.SectionId.ToString()=="' + this.sectionId + '" && s.StatusId!=2')
        .then(response => this.data = (response as Array<IExaminationGradingPolicy>));

    }
  }

  insertModel() {
    this.$modal.show('add-edit-model', { model: { gradingPolicyId: '', fullName: '', fromRange: 0, toRange: 0, statusId: 0, loggerId: '', remarks: '', classId: this.classId, sectionId: this.sectionId, campusProgramId: this.campusProgramId, }, IsNewRecord: true });
  }

  editModel(model: IExaminationGradingPolicy) {
    this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
  }

  deleteModel(model: IExaminationGradingPolicy) {
    this.$modal.show('delete-model', { model: model });
  }
}