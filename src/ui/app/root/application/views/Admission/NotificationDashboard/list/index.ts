/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */
import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";
import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";
import {
  ITeacherRatingGraph,
  IAttendanceAttendenceStatus,
  IExaminationExamDetailVM,
  ISetupSession,
  DeviceInfoEx,
  ISetupClass,
  ISetupCity,
  DDLGroupModel,
  DDLModel,
  VWCampusProgramCity,
  AdmissionsCount,
  FeeStudentChallanCount,
  EnrollmentsCount,
  PreDashoboard,
  ProgramMult,
  VWCampusProgramLevel,
  VWProgramLevel,
  CityMult,
  AdmissionAgingData, AdmissiontrendClass, ICampusCityVM, ISetupCampusProgramVM, IRegistrationSectionCourseLinkVM, INotificationDashboardListEx, CalculateMonthAverageList
} from "../../../../models";
import {
  AttendanceAttendenceStatusService,
  ExaminationExamDetailService,
  SetupSessionService,
  SetupClassService,
  SetupCityService,
  SetupCampusProgramLinkService,
  AdmissionAdmissionFormService,
  FeeStudentChallanService,
  RegistrationEnrollmentsService,
  SetupCampusService
} from "../../../../service";
import { StoreTypes } from "../../../../../../store";
import { IAttendenceDashboard, StudntListEx } from "../../../../models/Attendance/attendenceDashboard";
import { checkServerIdentity } from "tls";
import * as chartPerser from '../../../../../home/admission-role/index';
import moment from "moment";
import * as helper from "../../../../helper";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import { NotificationDash } from "./../../NotificationDash/list";
import { Comments } from "../../Comments/listEX";
import { TeacherSearch } from "../../TeacherSearch/list";
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    collapsibleWidget,
    'notification-overall': NotificationDash,
    'comments': Comments,
    'teacherSearch': TeacherSearch
  }
})
export class NotificationDashboard extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);
  private data: Array<INotificationDashboardListEx> = [];
  private MonthlyData: Array<CalculateMonthAverageList> = [];
  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  private classList: Array<ISetupClass> = [];
  private classId = '';
  private sectionId: string = '';
  private subjects = [];
  private sessionId: string = '';
  private filterString: string = "";
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private sessionList: Array<ISetupSession> = [];
  private repositorySession: SetupSessionService;
  private Id: number = 0;
  private key: string = '';
  public viewAttendance: boolean = false;
  private cityList: Array<ISetupCity> = []
  private cityId = '';
  private programDetailId = '';
  private sectionCourseLinkId: string = "";
  private classid: string = "";
  private programId = "";
  private data2: Array<INotificationDashboardListEx> = [];
  private campusId = ""
  private campusProgramId = "";
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  private campusCityList: Array<ICampusCityVM> = []
  private programDDL: Array<DDLGroupModel> = [];
  private preDataList: Array<PreDashoboard> = [];
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private ddl: Array<DDLModel> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private ProgramLinkList: Array<VWProgramLevel> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);
  private admissionRepository: AdmissionAdmissionFormService;
  private FeeChallanrepository: FeeStudentChallanService = null;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
  private repoClass: SetupClassService = new SetupClassService(this.$store)
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
  private curIndex: number = null;
  private addVal: boolean = false;
  private monthlyData: Array<ITeacherRatingGraph> = [];
  private columns = [
    { key: "courseName", caption: "Subject" },
    { key: "teacherName", caption: "Teacher" },
    { key: "average", caption: "Overall Rating" },
    { key: "currentAverage", caption: "Current Month Rating" },
    { key: "previousAverage", caption: "Previous Month Rating" }
  ];
  clearMain() {
    if (this.addVal == true) {
      return this.addVal = false
    }
  }
  addDiv(courseid, teacherid, subCity) {
    if (this.addVal == true) {
      if (this.curIndex > 0) {
        this.MonthlySummary(courseid, teacherid, subCity);
        return this.addVal = true
      }
      return this.addVal = false
    }
    else {
      this.MonthlySummary(courseid, teacherid, subCity);
      return this.addVal = true;
    }
  }
  created() {
    this.repositorySession = new SetupSessionService(this.$store);
    // this.refreshData();
    this.loadSession();
    this.$watch('sessionId', this.loadCityCampus);
    this.$watch('campusId', this.loadProgramsOfCampus);
    this.$watch('sessionId', this.refreshData);
    this.$watch('campusId', this.refreshData);
    this.$watch('campusProgramId', this.loadProgramWise);
    // this.$watch('campusProgramId', this.refreshData);
    this.$watch('campusId', this.refreshData);
    this.$watch('sectionCourseLinkId', this.refreshData);
    this.$watch('classid', this.loadSections);
    // this.$watch('cityId', this.loadcityWiseData);
  }
  loadProgramWise() {
    this.data = [];
    this.addVal = false;
    this.curIndex = null;
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0) {
      var key = this.sessionId + "?" + this.campusId + "?" + this.campusProgramId + "?" + this.user.userId;
      this.repository.GetNotificationDashboardProgramWise(key)
        .then(response => { this.data = (response as Array<INotificationDashboardListEx>); this.SubjectsSummary(); });
    }
  }
  refreshData() {
    this.data = [];
    this.addVal = false;
    this.curIndex = null;
    if (this.sessionId.length > 0 && this.campusId.length == 0) {
      var key = this.sessionId + "?" + this.user.userId;
      this.repository.GetNotificationDashboardSessionWise(key)
        .then(response => { this.data = (response as Array<INotificationDashboardListEx>); this.SubjectsSummary(); });
    }
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length == 0) {
      var key = this.sessionId + "?" + this.campusId + "?" + this.user.userId;
      this.repository.GetNotificationDashboardCampusWise(key)
        .then(response => { this.data = (response as Array<INotificationDashboardListEx>); this.SubjectsSummary(); });
    }
    // if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0 && this.sectionCourseLinkId.length == 0) {
    //   this.programId = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId).programId;
    //   var key = this.sessionId + "?" + this.campusId + "?" + this.programId;
    //   this.repository.GetNotificationDashboardProgramWise(key)
    //     .then(response => this.data = (response as Array<INotificationDashboardListEx>));
    // }
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionCourseLinkId.length > 0) {
      var key = this.sessionId + "?" + this.campusId + "?" + this.campusProgramId + "?" + this.classid + "?" + this.sectionCourseLinkId + "?" + this.user.userId;
      this.repository.GetNotificationDashboard(key)
        .then(response => {
          this.data = (response as Array<INotificationDashboardListEx>);
          this.SubjectsSummary();
        });
    }
  }
  MonthlySummary(courseid, teacherid, subCity) {
    this.MonthlyData = [];
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionCourseLinkId.length > 0) {
      var key = courseid + "?" + teacherid + "?" + this.sessionId + "?" + this.campusId + "?" + this.campusProgramId + "?" + this.classid + "?" + this.sectionCourseLinkId + "?" + subCity + "?" + this.user.userId;
      this.repository.GetCalculateMonthAverageSection(key)
        .then(response => {
          this.MonthlyData = (response as Array<CalculateMonthAverageList>);
          console.log(JSON.stringify(this.MonthlyData))
          this.options = chartPerser.getChartJson(this.MonthlyData, 'lastMonthsBarRating');
        });
    }

    
    else if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0) {
      var key = courseid + "?" + teacherid + "?" + this.sessionId + "?" + this.campusId + "?" + this.campusProgramId + "?" + subCity + "?" + this.user.userId;
      this.repository.GetCalculateMonthAverageProgram(key)
        .then(response => {
          this.MonthlyData = (response as Array<CalculateMonthAverageList>);
          console.log(JSON.stringify(this.MonthlyData))
          this.options = chartPerser.getChartJson(this.MonthlyData, 'lastMonthsBarRating');
        });
    }
    else if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = courseid + "?" + teacherid + "?" + this.sessionId + "?" + this.campusId + "?" + subCity + "?" + this.user.userId;
      this.repository.GetCalculateMonthAverageCampus(key)
        .then(response => {
          this.MonthlyData = (response as Array<CalculateMonthAverageList>);
          console.log(JSON.stringify(this.MonthlyData))
          this.options = chartPerser.getChartJson(this.MonthlyData, 'lastMonthsBarRating');
        });
    }
    else if (this.sessionId.length > 0) {
      var key = courseid + "?" + teacherid + "?" + this.sessionId + "?" + subCity + "?" + this.user.userId;
      this.repository.GetCalculateMonthAverageSession(key)
        .then(response => {
          this.MonthlyData = (response as Array<CalculateMonthAverageList>);
          console.log(JSON.stringify(this.MonthlyData))
          this.options = chartPerser.getChartJson(this.MonthlyData, 'lastMonthsBarRating');
        });
    }

  }
  MonthlySummary1(teacherId) {
    this.monthlyData = [];
    var key = teacherId + "?" + this.user.userId;
    this.repository.GetTeacherGraphSection(key)
      .then(response => {
        this.monthlyData = (response as Array<ITeacherRatingGraph>);
        this.options = chartPerser.getChartJson(this.monthlyData, 'SectionBarRating');
      });


  }
  
  mounted() {
    this.validatePage();
  }
  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionList = r as Array<ISetupSession>
      })
  }
  append(i, cn) {
    if (this.curIndex == i) {
      return this.curIndex = null;
    }
    this.SummaryData(cn)
    return this.curIndex = i;
  }
  loadClass() {
    this.classList = [];
    this.classid = '';
    this.sectionCourseLinkId = '';
    this.sectionList = [];
    this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
      this.classList = res as Array<ISetupClass>
    });
  }
  loadProgramsOfCampus() {
    this.campusProgramId = ''
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        // this.refreshData()
      });
    }
  }
  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }
  loadSections() {
    this.sectionList = [];
    if (this.campusProgramId.length > 0 && this.classid.length > 0) {
      var key = this.campusProgramId + '?' + this.classid
      this.enrollmentRepo.GetSectionList(key)
        .then(r => {
          this.sectionList = r as Array<IRegistrationSectionCourseLinkVM>;
          // console.log(this.sectionList==null)
          if (this.sectionList == null) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'Section not Defined',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });
          }
          // this.sectionCourseLinkList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
          // this.datas = [];
          // this.sectionCourseLinkId = '';
        })
    }
  }
  clearSelection() {
    this.curIndex = null;
    this.addVal = false;
    this.subjects = [];
    this.sectionCourseLinkId = '',
      this.classid = '',
      this.campusProgramId = '',
      this.campusId = '',
      this.sessionId = ''
  }
  SubjectsSummary() {
    this.subjects = [];
    this.data.forEach(element => {
      if (this.subjects.filter(e => e.value == element.courseName).length == 0) {
        let average = 0;
        let counted = 0;
        this.data.filter(e => e.courseName == element.courseName).forEach(el => {
          average += (el.average);
          counted++;
        });
        this.subjects.push({ value: element.courseName, average: ((average / counted).toFixed(2)) });
      }
    });
    console.log(JSON.stringify(this.subjects));
  }
  SummaryData(option: string) {
    this.data2 = [];
    this.data2 = this.data.filter(e => e.courseName == option);
  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("surveyDashboard" in this.user.claims == true) {
        if (this.user.claims["surveyDashboard"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["surveyDashboard"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["surveyDashboard"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["surveyDashboard"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
  options = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };
}