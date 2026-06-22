/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IAttendanceAttendenceMaster,
  IAttendanceAttendenceMasterVM,
  ISetupSession,
  ISetupCampus,
  ISetupCampusProgramVM,
  IAttendanceAttendenceStatus,
  IAttendanceAttendanceDetail,
  DDLGroupModel,
  DDLModel,
  ICampusCityVM,
  ISetupClass,
  IRegistrationSectionCourseLinkVM,
  ICourseSection,
  IAttendenceData
} from "../../../../models";
import { AttendanceAttendenceMasterService, SetupSessionService, SetupCampusProgramLinkService, SetupCampusService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, AttendanceAttendenceStatusService, SetupClassService } from "../../../../service";

import { AttendanceAttendenceMasterAddEdit } from "../add-edit";
import { AttendanceAttendenceMasterDelete } from "../delete";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "AttendenceMaster-add-edit-model": AttendanceAttendenceMasterAddEdit,
    "delete-model": AttendanceAttendenceMasterDelete
  }
})
export class AttendanceAttendenceMasterList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceMasterService;
  private data: Array<IAttendanceAttendenceMasterVM> = [];
  private filterString: string = "";
  private campusId :string = "";
  private sessionId :string = "";
  private campusProgramId :string = "";
  private programDetailId :string = "";
  private classId :string = "";
  private datestring :string = "";
  private date: Date = new Date();


  private campusList: Array<ISetupCampus> = []
  private sessionList: Array<ISetupSession> = []
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
  private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
  private attendanceMaster: IAttendanceAttendenceMaster;
  private attendanceDetailList: Array<IAttendanceAttendanceDetail> = []
  private programDDL: Array<DDLGroupModel> = []
  private ddl: Array<DDLModel> = []
  private campusCityList: Array<ICampusCityVM> = []
  private classList: Array<ISetupClass> = []

  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private courseList: Array<ICourseSection> = [];



  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
  //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
  private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
  private attendanceMasterRepo: AttendanceAttendenceMasterService = new AttendanceAttendenceMasterService(this.$store)
  private classRepo: SetupClassService = new SetupClassService(this.$store)
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  private columns = [
    // { key: "fullName", caption: "Course" },
    { key: "staffName", caption: "Teacher" },
    { key: "startTime", caption: "Start Time" },
    { key: "endTime", caption: "End Time" },
    { key: "dated", caption: "Dated" },
    { key: "isApproved", caption: "IsApproved" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AttendanceAttendenceMasterService(this.$store);
    this.loadSession();
    // this.loadCityCampus();
    // this.loadProgramsOfCampus();
    // this.loadClass();
    this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
  }

  mounted() {
    this.validatePage();
    // this.refreshData();
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("attendanceAttendenceMaster" in this.user.claims == true) {
        if (this.user.claims["attendanceAttendenceMaster"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["attendanceAttendenceMaster"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["attendanceAttendenceMaster"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["attendanceAttendenceMaster"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.data = [];
    //let oldobj: IAttendanceAttendenceMasterVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId + '?' + this.datestring;
      //alert(JSON.stringify(key))
      this.repository.GetFindByVM(key)
        .then(
          response =>
            (this.data = response as Array<IAttendanceAttendenceMasterVM>)
        );
    }
    else {
      console.log(key);
    }
  }

  insertModel() {
    this.$modal.show("AttendenceMaster-add-edit-model", {
      model: {
        attendenceMasterId: "",
        timeTableId: "",
        dated: new Date(),
        isApproved: true,
        statusId: 0,
        loggerId: "",
        campusId: this.campusId,
        programDetailId: this.programDetailId,
        classId: this.classId,
        sessionId: this.sessionId
      },
      IsNewRecord: true
    });
  }

  editModel(model: IAttendanceAttendenceMaster) {
    this.$modal.show("AttendenceMaster-add-edit-model", {
      model: model,
      campusId: this.campusId,
      programDetailId: this.programDetailId,
      classId: this.classId,
      sessionId: this.sessionId,
      IsNewRecord: false
    });
  }

  deleteModel(model: IAttendanceAttendenceMaster) {
    this.$modal.show("delete-model", { model: model });
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
  loadCampus() {
    this.campusRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.campusList = r as Array<ISetupCampus>

      })
  }


}
