/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../model";
import { IRootStoreState } from "../../../../store";
import { StoreTypes } from "../../../../../store";
import * as helper from "../../../helper";
import {
  CitySubCity,
  ISetupCity,
  ISetupClass,
  ISetupCollector,
  IGeneral,
  ISetupCampus,
  ISetupSession,
  DDLModel,
  DDLGroupModel,
  IStudentCreditNotes,
  ISetupCampusProgramVM,
  IInstallmentNos,
  IAttendanceCutOffDate,
  IGetConcessionReversalStudents,
} from "../../../models";
import {
  SetupCampusService,
  SetupSessionService,
  SetupCityService,
  SetupSubCityService,
  SetupClassService,
  SetupCollectorService,
  FeeStudentFeeStructureService,
  SetupCampusProgramLinkService
} from "../../../service";
export interface ICampusCityVM {
  campusId: string;
  campusName: string;
  cityName: string;
  zoneId: string;
  subCityId: string;
  cityId: string;
}
import { GroupModel, GeneralModel } from "../../../models/general";

@Component({
  name: "comparison-dashboard",
  template: require("./index.html"),
  components: {},
})


export class WithdrawnConcessionReversal extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private Collectorrepository: SetupCollectorService = null;
  private campusRepo: SetupCampusService = null;
  private sessionRepo: SetupSessionService = null;
  private cityRepo: SetupCityService = null;
  private subCityRepo: SetupSubCityService = null;
  private classRepo: SetupClassService = null;
  private studentfeestructure: FeeStudentFeeStructureService = null;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = null;

  private campusddl: Array<DDLModel> = [];
  private campusId = "";
  private sessionId = "";
  private termModel: Array<GeneralModel> = [];
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  classList: Array<ISetupClass> = [];
  CollectorList: Array<ISetupCollector> = [];
  private cityId: string = "";
  private subCityId: string = "";
  private classId: string = "";
  private collectorId: string = "";
  public tabOne: boolean = false;
  public tabTwo: boolean = true;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private isDisabled: boolean = false;
  private chkall: boolean = false;
  private chksingle: boolean = false;
  private collector: string;
  private dueDate: string;
  private paidDate: string;
  private InstallmentNo: string = "";
  private cutofDate: string = "";
  private currentDate = new Date();
  private alldata: Array<IStudentCreditNotes> = [];
  private installmentnos: Array<IInstallmentNos> = [];
  private attendanceCutOffDate: Array<IAttendanceCutOffDate> = [];
  private cityDDL: Array<DDLGroupModel> = [];
  private campusSubCityModel: Array<GroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private data: Array<IGetConcessionReversalStudents> = [];

  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private campusProgramId = "";

  private columns = [
    { key: "rollNo", caption: "Refference No.", sort: true },
    { key: "studentName", caption: "Student's Name" },
    { key: "percentage", caption: "Attendance %" },
    { key: "currentConcession", caption: "Current Concession" },
    { key: "reConcession", caption: "Re-Apply Concession" },
    { key: 'isSelected', caption: 'Selected', width: 80 }
  ];

  mounted() {
    this.loadSession();
  }
  created() {
    this.data = [];
    this.Collectorrepository = new SetupCollectorService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.cityRepo = new SetupCityService(this.$store);
    this.subCityRepo = new SetupSubCityService(this.$store);
    this.classRepo = new SetupClassService(this.$store);
    this.studentfeestructure = new FeeStudentFeeStructureService(this.$store);
    this.campusProgramLinkRepo = new SetupCampusProgramLinkService(this.$store);
  }
  loadSession() {
    this.data = [];
    this.campusSubCityModel = [];
    this.campusProgramLinkList = [];
    this.classList = [];
    this.attendanceCutOffDate = [];
    this.installmentnos = [];
    this.cityId = "";
    this.subCityId = "";

    this.sessionId = "";
    this.campusId = "";
    this.campusProgramId = "";
    this.classId = "";
    this.InstallmentNo = "";
    this.cutofDate = "";
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.termModel = r;
    });
  }
  loadCityCampus() {
    this.data = [];
    this.campusSubCityModel = [];
    this.campusProgramLinkList = [];
    this.classList = [];
    this.attendanceCutOffDate = [];
    this.installmentnos = [];
    this.campusId = "";
    this.campusProgramId = "";
    this.classId = "";
    this.InstallmentNo = "";
    this.cutofDate = "";
    let oldObj: ICampusCityVM;
    if (this.sessionId.length > 0) {
      this.campusRepo.GetCityVM().then(r => {
        this.campusSubCityModel = r;
      });
    }
  }
  loadProgramsOfCampus() {
    this.data = [];
    this.ddl = [];
    this.programDDL = [];
    this.campusProgramLinkList = [];
    this.classList = [];
    this.attendanceCutOffDate = [];
    this.installmentnos = [];
    this.campusProgramId = "";
    this.classId = "";
    this.InstallmentNo = "";
    this.cutofDate = "";
    let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      });
    }
  }
  loadClass() {
    this.data = [];
    this.classList = [];
    this.attendanceCutOffDate = [];
    this.installmentnos = [];
    this.classId = "";
    this.InstallmentNo = "";
    this.cutofDate = "";
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.campusProgramId.length > 0
    ) {
      this.classRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
        this.classList = r as Array<ISetupClass>;
      });
    }
  }
  loadInstallmentNo() {
    this.data = [];
    this.attendanceCutOffDate = [];
    this.installmentnos = [];
    this.InstallmentNo = "";
    this.cutofDate = "";
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.campusProgramId.length > 0 &&
      this.classId.length > 0
    ) {
      var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramId + '?' + this.classId;
      this.studentfeestructure.InstallmentNos(key)
        .then((res) => {
          this.installmentnos = res as Array<IInstallmentNos>;
        });
    }
  }

  loadcutoffdate() {
    this.cutofDate = "";
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.campusProgramId.length > 0 &&
      this.classId.length > 0 &&
      this.InstallmentNo.length > 0
    ) {
      var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramId + '?' + this.classId + '?' + this.InstallmentNo;
      this.studentfeestructure.AttendancecutoffDate(key)
        .then((res) => {
          this.attendanceCutOffDate = res as Array<IAttendanceCutOffDate>;
          this.cutofDate = this.attendanceCutOffDate[0].cutOffDate;
          this.Getdata();
        });
    }
    this.Getdata();
  }
  Getdata() {
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.campusProgramId.length > 0 &&
      this.classId.length > 0 &&
      this.InstallmentNo.length > 0 &&
      this.cutofDate.length > 0
    ) {
      var key = this.sessionId + '?' + this.campusId + '?' + this.campusProgramId + '?' + this.classId + '?' + this.InstallmentNo + '?' + this.cutofDate;
      this.studentfeestructure.GetConcessionReversalStudents(key).then((res) => {
        this.data = res as Array<IGetConcessionReversalStudents>;
      });
    }
    this.chkall = false;
    this.isDisabled = false;
  }
  Savedata() {
    if (
      this.sessionId.length > 0 &&
      this.campusId.length > 0 &&
      this.campusProgramId.length > 0 &&
      this.classId.length > 0 &&
      this.InstallmentNo.length > 0 &&
      this.cutofDate.length > 0
    ) {
      var list = this.data.filter(x => x.isChecked);
      if (list.length > 0) {
        debugger
        this.studentfeestructure.UpdateConcession(JSON.stringify(list)).then(r => {
          this.Getdata();
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Concession Applied successfully',
            title: '',
            messageTypeId: PayloadMessageTypes.success
          });
        })
      }
    }
  }
  updatechek() {
    if (this.data.filter(e => e.isChecked == true).length > 0) {
      this.isDisabled = true;
      this.chkall = false;
    }
    else {
      this.isDisabled = false;
      this.chkall = false;
    }
  }
  updall() {
    if (this.chkall == true) {
      this.data.forEach(element => {
        element.isChecked = true;
      });
      this.isDisabled = true;
    }
    if (this.chkall == false) {
      this.data.forEach(element => {
        element.isChecked = false;
      });
      this.isDisabled = false;
    }
  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("withdrawnConcessionReversal" in this.user.claims == true) {
        if (this.user.claims["withdrawnConcessionReversal"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["withdrawnConcessionReversal"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["withdrawnConcessionReversal"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["withdrawnConcessionReversal"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
}
