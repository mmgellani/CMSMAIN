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

//  totalCount: number;

import {
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
  AdmissionAgingData,
  AdmissiontrendClass,
  ICityMultDrill,
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
} from "../../../../service";
export interface IAdmissionGenderDashboard {
  description: string;
  genderCount: number;
}

export interface IAdmissionOnlineDashboard {
  onlineCount: number;
}

import { StoreTypes } from "../../../../../../store";
import {
  IAttendenceDashboard,
  StudntListEx,
} from "../../../../models/Attendance/attendenceDashboard";
import { checkServerIdentity } from "tls";
import { StudentList } from "../add-edit";
import * as charts from "../../../../../home/admission-role";
import Highcharts from "highcharts";
import { genComponent } from "vue-highcharts";
import * as chartPerser from "../../../../../home/admission-role/index";
import moment from "moment";
import tableGraph from "../../../../../../components/table-graph";
import collapsibleWidget from "../../../../../../components/collapsibleWidget";
import preAdmission from "../../../../../../components/preAdmission";
import * as helper from "../../../../helper";
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": StudentList,
    "table-graph": tableGraph,
    Highcharts: genComponent("Highcharts", Highcharts),
    "form-collection-p": charts.FormCollectionPieWidget,
    "form-collection-b": charts.FormCollectionBarWidget,
    "collapsible-widget": collapsibleWidget,
    "pre-admission-widget": preAdmission,
  },
})
export class AdmissionDashboard extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceStatusService;
  private data: Array<AdmissionsCount> = [];
  private Studentdata: Array<StudntListEx> = [];
  private DeviceInfo: Array<DeviceInfoEx> = [];
  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  private classList: Array<ISetupClass> = [];
  private ProgramMult: Array<ProgramMult> = [];
  private ShiftMult: Array<ProgramMult> = [];
  private cityDrillList: ICityMultDrill[] = [];
  private CityMult: Array<CityMult> = [];
  private admissiontrend: Array<AdmissiontrendClass> = [];

  private tabRef = "";
  public tabOne: boolean = false;
  public tabTwo: boolean = true;

  private classId = "";
  private classes: any = [];
  private records: any = [];
  private aging: any = [];
  public showDashboard: boolean = false;

  private sessionId: string = "";
  // private datestring: string = "";
  private date: Date = new Date();
  private checkIt: string = "";
  private displayName: string = "";
  private dated: string = "";

  private goBack = [
    { id: 1, key: "" },
    { id: 2, key: "" },
    { id: 3, key: "" },
    { id: 4, key: "" },
    { id: 5, key: "" },
    { id: 6, key: "" },
    { id: 7, key: "" },
  ];
  private sumData = { scheduled: 0, held: 0, approved: 0, unApproved: 0 };

  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private sessionList: Array<ISetupSession> = [];
  private repositorySession: SetupSessionService;
  private Id: number = 0;
  private key: string = "";
  private preferenceArr = [
    {
      item: "Table",
    },
    {
      item: "Graph",
    },
  ];

  public viewAttendance: boolean = false;
  private cityList: Array<ISetupCity> = [];
  private cityId = "";
  private cityIdEx = "";
  private programDetailId = "";
  private programDetailIdEx = "";
  private programId = "";
  private programIdEx = "";
  private programDDL: Array<DDLGroupModel> = [];
  private preDataList: Array<PreDashoboard> = [];
  private ddl: Array<DDLModel> = [];
  private campusProgramLinkList: Array<VWCampusProgramLevel> = [];
  private ProgramLinkList: Array<VWProgramLevel> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private admissionRepository: AdmissionAdmissionFormService;
  private FeeChallanrepository: FeeStudentChallanService = null;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(
    this.$store
  );

  // private paidData: Array<IFeeStudentChallan> = [];
  // private data: Array<IAdmissionAdmissionForm> = [];
  // private EnrollData: Array<IRegistrationEnrollments> = [];

  private paidData: Array<FeeStudentChallanCount> = [];

  private EnrollData: Array<EnrollmentsCount> = [];
  private admissionCount: number = 0;
  private totalGenderCount: number = 0;
  private totalMaleCount: number = 0;
  private totalFemaleCount: number = 0;
  private paidChallanCount: number = 0;
  private enrollmentCount: number = 0;
  private onlineCount: number = 0;
  private onlineCountNew: number = 0;
  private ondeskCount: number = 0;
  private admissionCountDaily: number = 0;
  private paidChallanCountDaily: number = 0;
  private enrollmentCountDaily: number = 0;
  private dataList = [];
  private LevelList = [];
  private fromDate = new Date(new Date().setDate(new Date().getDate() - 20));
  private toDate = new Date();
  // private fromDateEx = new Date(new Date().setDate(new Date().getDate() - 7));
  private fromDateEx = new Date("2023-01-01");
  private toDateEx = new Date();
  private currDate = new Date();
  private levelName = "";
  private viewCities: boolean = false;
  private viewLevel: boolean = false;
  private columns = [
    { key: "cityName", caption: "City" },
    { key: "formCollection", caption: "Form Collection" },
    { key: "feePaid", caption: "Fee Paid" },
  ];

  private columnsn = [
    { key: "studentRno", caption: "Roll#", sort: true },
    { key: "studentName", caption: "Candidate Name" },
    { key: "fatherName", caption: "Father Name" },
    { key: "formNo", caption: "Form#" },
    { key: "email", caption: "Email" },
    { key: "phoneNo", caption: "Phone#" },
    { key: "regdate", caption: "Adm Date" },
    { key: "fatherCnicCheck", caption: "Father CNIC", width: "50" },
    { key: "studentCnic", caption: "Student CNIC", width: "50" },
    { key: "studentPic", caption: "Student Pic", width: "50" },
    { key: "resultCard", caption: "Result Card", width: "50" },
  ];

  created() {
    this.repository = new AttendanceAttendenceStatusService(this.$store);
    this.admissionRepository = new AdmissionAdmissionFormService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
    this.checkIt = "CITY";
    this.repositorySession = new SetupSessionService(this.$store);
    this.dated =
      this.date.getFullYear() +
      "-" +
      ("0" + (this.date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.date.getDate()).slice(-2);
    this.dataList = [
      {
        cityName: "Lahore",
        ninteen: 21000,
        eighteen: 20000,
        seventeen: 19000,
        sixteen: 18000,
      },
      {
        cityName: "Rawalpindi",
        ninteen: 17000,
        eighteen: 16000,
        seventeen: 15000,
        sixteen: 14000,
      },
      {
        cityName: "Faislabad",
        ninteen: 16000,
        eighteen: 15000,
        seventeen: 14000,
        sixteen: 13000,
      },
      {
        cityName: "Gujranwala",
        ninteen: 12000,
        eighteen: 11000,
        seventeen: 10000,
        sixteen: 9000,
      },
    ];

    this.LevelList = [
      { levelName: "Intermediate" },
      { levelName: "Graduation" },
      { levelName: "Step" },
      { levelName: "Pre" },
    ];
    // this.$watch('cityId', this.loadcityWiseData);
  }
  genderCountList: IAdmissionGenderDashboard[] = [];
  onlineCountList: IAdmissionOnlineDashboard[] = [];
  mounted() {
    this.validatePage();
    this.getSession();
    this.loadCity();
    this.PreData();
    //this.getagingdata();
    // this.refreshData();
    // this.loadClass();
    // var id =2;
    // var key = '['

    // this.goBack.forEach(e=> {
    //   if(e.id==id)
    //   e.key=key;

    // })
  }
  getGenderCount() {
    this.admissionRepository
      .AdmissionGenderCount(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx)
      )
      .then((s) => {
        this.genderCountList = s as IAdmissionGenderDashboard[];
        this.getTotalGenderCount();
      });
  }

  getOnlineCount() {
    this.admissionRepository
      .AdmissionOnlineCount(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx)
      )
      .then((s) => {
        this.onlineCountList = s as IAdmissionOnlineDashboard[];
        this.onlineCountNew = this.onlineCountList[0].onlineCount;
        //this.ondeskCount = this.admissionCount - this.onlineCountNew;
        //this.getTotalGenderCount();
      });
  }

  getGenderCountCity() {
    debugger;
    this.admissionRepository
      .AdmissionGenderCountCity(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId
      )
      .then((s) => {
        debugger;
        this.genderCountList = s as IAdmissionGenderDashboard[];
        this.onlineCountNew = this.onlineCountList[0].onlineCount;
        this.getTotalGenderCount();
      });
  }

  getOnlineCountCity() {
    debugger;
    this.admissionRepository
      .AdmissionOnlineCountCity(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId
      )
      .then((s) => {
        debugger;
        this.onlineCountList = s as IAdmissionOnlineDashboard[];
        this.onlineCountNew = this.onlineCountList[0].onlineCount;
        //this.getTotalGenderCount();
      });
  }
  getAdmissionGenderDashboardCityLevelWise() {
    this.admissionRepository
      .AdmissionGenderDashboardCityLevelWise(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId +
          "?" +
          this.levelName
      )
      .then((s) => {
        this.genderCountList = s as IAdmissionGenderDashboard[];
        this.getTotalGenderCount();
      });
  }

  getAdmissionOnlineDashboardCityLevelWise() {
    this.admissionRepository
      .AdmissionOnlineDashboardCityLevelWise(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId +
          "?" +
          this.levelName
      )
      .then((s) => {
        this.onlineCountList = s as IAdmissionOnlineDashboard[];
        this.onlineCountNew = this.onlineCountList[0].onlineCount;
        //this.getTotalGenderCount();
      });
  }

  getAdmissionGenderDashboardCityProgramWise() {
    this.admissionRepository
      .AdmissionGenderDashboardCityProgramWise(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId +
          "?" +
          this.levelName +
          "?" +
          this.programId
      )
      .then((s) => {
        this.genderCountList = s as IAdmissionGenderDashboard[];
        this.getTotalGenderCount();
      });
  }

  getAdmissionOnlineDashboardCityProgramWise() {
    this.admissionRepository
      .AdmissionOnlineDashboardCityProgramWise(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId +
          "?" +
          this.levelName +
          "?" +
          this.programId
      )
      .then((s) => {
        this.onlineCountList = s as IAdmissionOnlineDashboard[];
        this.onlineCountNew = this.onlineCountList[0].onlineCount;
        //this.getTotalGenderCount();
      });
  }

  getAdmissionGenderDashboardCityProgramDetailWise() {
    this.admissionRepository
      .AdmissionGenderDashboardCityProgramDetailWise(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId +
          "?" +
          this.levelName +
          "?" +
          this.programDetailId
      )
      .then((s) => {
        this.genderCountList = s as IAdmissionGenderDashboard[];
        this.getTotalGenderCount();
      });
  }

  getAdmissionOnlineDashboardCityProgramDetailWise() {
    this.admissionRepository
      .AdmissionOnlineDashboardCityProgramDetailWise(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId +
          "?" +
          this.levelName +
          "?" +
          this.programDetailId
      )
      .then((s) => {
        this.onlineCountList = s as IAdmissionOnlineDashboard[];
        this.onlineCountNew = this.onlineCountList[0].onlineCount;
        //this.getTotalGenderCount();
      });
  }

  getVWCityDateEXCity() {
    this.admissionRepository
      .VWCityDateEXCity(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId //+
          // "?" +
          // this.levelName +
          // "?" +
          // this.programDetailId
      )
      .then((s) => {
        this.CityMult = s as CityMult[];
        //this.getTotalGenderCount();
      });
  }

  getVWCityDateEXlevel() {
    this.admissionRepository
      .VWCityDateEXlevel(
        this.sessionId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx) +
          "?" +
          this.cityIdEx +
          "?" +
          this.user.userId +
           "?" +
          this.levelName //+
          // "?" +
          // this.programDetailId
      )
      .then((s) => {
        this.CityMult = s as CityMult[];
        //this.getTotalGenderCount();
      });
  }
  isShowDrill = false;
  showDrill(item: CityMult) {
    this.isShowDrill = !this.isShowDrill;
    if (this.isShowDrill) {
      this.admissionRepository
        .GetVWCitySessionDrill(
          this.sessionId +
            "?" +
            this.user.userId +
            "?" +
            helper.formateDate(this.fromDateEx) +
            "?" +
            helper.formateDate(this.toDateEx) +
            "?" +
            item.cityName
        )
        .then((s) => {
          this.cityDrillList = s as ICityMultDrill[];
        });
    }
  }
  getDrillRecord() {}
  showAllRecord() {
    this.viewCities != this.viewCities;
    // if (this.viewCities) {
    this.loadcityWiseData();
    // }
  }

  // showAllLevel() {
  //   this.viewLevel != this.viewLevel;
  // }

  PreData() {
    this.admissionRepository
      .GetPreData(
        helper.formateDate(this.fromDate) +
          "?" +
          helper.formateDate(this.toDate)
      )
      .then((r) => {
        this.preDataList = r as Array<PreDashoboard>;
      });
  }
  changedEvent() {
    if (this.tabRef == "Table") {
      this.tabOne = true;
      this.tabTwo = false;
    } else if (this.tabRef == "Graph") {
      this.tabOne = false;
      this.tabTwo = true;
    }
  }
  loadCity() {
    this.cityRepo.GetAllEx().then((r) => {
      this.cityList = r as Array<ISetupCity>;

      // console.log(JSON.stringify(this.cityList))
      // console.log(this.cityList.length)

      // const items = [1, 2, 3, 4, 5]

      // var allcity = { cityId: "00000000-0000-0000-0000-000000000000", fullName: "All", cityCode: "582", statusId: 1, loggerId: "629e9e0b-6214-4959-9084-dc8d48f076c3", provinceId: "7138babf-2549-4106-8499-ef23cdd03ff2", zoneId: "f260b0cd-8767-410f-b8cb-ee1a481928d7" };

      // const insert = (arr, index, newItem) => [
      //   ...arr.slice(0, index),
      //   newItem,
      //   ...arr.slice(index)
      // ]

      // const result = insert(this.cityList, 0, allcity)

      // this.cityList = result;
    });
  }

  clearSelection() {
    this.cityId = "";
    this.programDetailId = "";
    this.levelName = "";
    this.programId = "";
    this.fromDateEx = new Date(new Date().setDate(new Date().getDate() - 7));
    this.toDateEx = new Date();
    this.refreshData();
  }

  checkparam() {
    // console.log('Inside')
    // console.log(JSON.stringify(this.cityId.toString().length))
    // console.log(JSON.stringify(this.cityId.length))
    if (
      this.sessionId.length > 0 &&
      this.cityId.toString().length > 0 &&
      this.levelName.length > 0 &&
      this.programDetailId.length > 0 &&
      this.programId.length > 0
    ) {
      this.cityWiseData();
    } else if (
      this.sessionId.length > 0 &&
      this.cityId.toString().length > 0 &&
      this.levelName.length > 0 &&
      this.programId.length > 0
    ) {
      this.programWiseData();
    } else if (
      this.sessionId.length > 0 &&
      this.cityId.toString().length > 0 &&
      this.levelName.length > 0
    ) {
      this.loadLevelWise();
    } else if (this.sessionId.length > 0 && this.cityId.toString().length > 0) {
      this.loadcityWiseData();
    } else if (this.sessionId.length > 0) {
      this.programDetailId = "";
      this.levelName = "";
      this.programId = "";
      this.refreshData();
    }
    // this.getagingdata();
  }

  getagingdata() {
    //debugger;

    var where = '"StatusId"=1';

    if (this.sessionId.length > 0) {
      where = where + " AND \"SessionId\"=''" + this.sessionId + "''";
    }
    if (this.cityIdEx.length > 0) {
      where = where + " AND \"CityId\"=''" + this.cityIdEx + "''";
    }
    //  if(this.classId.length > 0)
    //  {
    //   where = where + "AND \"ClassId\"='" + this.classId + "'";
    //  }
    if (this.programId.length > 0) {
      where = where + " AND \"ProgramId\"=''" + this.programId + "''";
    }
    if (this.programDetailId.length > 0) {
      where =
        where + " AND \"ProgramDetailId\"=''" + this.programDetailId + "''";
    }

    where =
      where +
      " AND " +
      ' "AdmissionDate" Between ' +
      "''" +
      helper.formateDate(this.fromDateEx) +
      "''" +
      " AND " +
      "''" +
      helper.formateDate(this.toDateEx) +
      "''";

    // where = where + " " + e.param + "=''" + e.value + "''";

    // var key=`"CampusId"=''079fe61a-be3b-494d-ba62-81be6896284c'' AND "ProgramId"=''e793cabb-2876-4c96-b791-a70a6184dd4c'' AND "CityId"=''33bcf27c-4ddc-450d-95bb-ce8afe5b2bb1''`+ "?" + this.user.userId;
    var key = where + "?" + this.user.userId;
    // alert(key);
    this.aging = [];
    this.admissionRepository.GetadmissionAging(key).then((response) => {
      this.aging = response as Array<AdmissionAgingData>;
      // this.aging.sort((a: any, b: any) => b.studentName - a.studentName);
      //this.sessionId = this.sessionList[0].sessionId;

      // alert(JSON.stringify(this.aging) )
      // this.refreshData();
    });
  }

  refreshData() {
    this.data = [];
    this.paidData = [];
    this.EnrollData = [];
    this.admissionCount = 0;
    this.paidChallanCount = 0;
    this.enrollmentCount = 0;
    this.onlineCount = 0;
    this.onlineCountNew = 0;
    this.ondeskCount = 0;
    this.getGenderCount();
    this.getOnlineCount();

    this.admissionRepository
      .GetCityWiseAllEx(
        this.sessionId +
          "?" +
          this.user.userId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx)
      )
      .then((r) => {
        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.onlineCount = this.EnrollData[0].enrollmentCount;
        this.ondeskCount = this.admissionCount - this.onlineCountNew;
      });

    this.admissionRepository
      .GetVWProgramSession(
        this.sessionId +
          "?" +
          this.user.userId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx)
      )
      .then((r) => {
        this.ProgramMult = r as Array<ProgramMult>;
        this.programchart = chartPerser.getChartJson(
          this.ProgramMult,
          "programBar"
        );
      });

    this.admissionRepository
      .GetVWCitySession(
        this.sessionId +
          "?" +
          this.user.userId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx)
      )
      .then((r) => {
        this.CityMult = r as Array<CityMult>;
      });

    this.admissionRepository
      .AdmissionTrendGraph(
        this.sessionId + "?" + this.user.userId + "?2020-09-16"
      )
      .then((r) => {
        this.admissiontrend = r as Array<AdmissiontrendClass>;
        this.options = chartPerser.getChartJson(
          this.admissiontrend,
          "trendingLine"
        );
      });

    this.admissionRepository
      .GetVWShiftSession(
        this.sessionId +
          "?" +
          this.user.userId +
          "?" +
          helper.formateDate(this.fromDateEx) +
          "?" +
          helper.formateDate(this.toDateEx)
      )
      .then((r) => {
        debugger;
        this.ShiftMult = r as Array<ProgramMult>;
        this.formcolectionPie = chartPerser.getChartJson(
          this.ShiftMult,
          "formcolectionPie"
        );
        this.feePaidPie = chartPerser.getChartJson(
          this.ShiftMult,
          "feePaidPie"
        );
      });
  }

  cityWiseData() {
    if (this.viewCities) {
      this.cityIdEx = "00000000-0000-0000-0000-000000000000";
    } else {
      this.cityIdEx = this.cityId.toString().replace('"', "");
    }
    this.programDetailIdEx = this.programDetailId.toString().replace('"', "");
    if (
      this.sessionId.length > 0 &&
      this.cityIdEx.length > 0 &&
      this.levelName.length > 0 &&
      this.programId.length > 0 &&
      this.programDetailIdEx.length > 0
    ) {
      this.data = [];
      this.paidData = [];
      this.EnrollData = [];
      this.admissionCount = 0;
      this.paidChallanCount = 0;
      this.enrollmentCount = 0;
      this.onlineCount = 0;
      this.onlineCountNew = 0;
      this.ondeskCount = 0;
      this.getAdmissionGenderDashboardCityProgramDetailWise();
      this.getAdmissionOnlineDashboardCityProgramDetailWise();
      var key =
        this.sessionId +
        "?" +
        this.cityIdEx +
        "?" +
        this.user.userId +
        "?" +
        helper.formateDate(new Date(this.fromDateEx)) +
        "?" +
        helper.formateDate(new Date(this.toDateEx)) +
        "?" +
        this.levelName +
        "?" +
        this.programDetailIdEx;
      this.admissionRepository.GetCityWiseProgramLevel(key).then((r) => {
        debugger;
        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.onlineCount = this.EnrollData[0].enrollmentCount;
        this.ondeskCount = this.admissionCount - this.onlineCountNew;
      });
      this.admissionRepository
        .GetVWProgramDatePgd(
          this.sessionId +
            "?" +
            this.cityIdEx +
            "?" +
            this.user.userId +
            "?" +
            helper.formateDate(new Date(this.fromDateEx)) +
            "?" +
            helper.formateDate(new Date(this.toDateEx)) +
            "?" +
            this.levelName +
            "?" +
            this.programDetailIdEx
        )
        .then((r) => {
          this.ProgramMult = r as Array<ProgramMult>;
          this.programchart = chartPerser.getChartJson(
            this.ProgramMult,
            "programBar"
          );
        });
      this.admissionRepository
        .GetVWCityDatePgd(
          this.sessionId +
            "?" +
            this.cityIdEx +
            "?" +
            this.user.userId +
            "?" +
            helper.formateDate(new Date(this.fromDateEx)) +
            "?" +
            helper.formateDate(new Date(this.toDateEx)) +
            "?" +
            this.levelName +
            "?" +
            this.programDetailIdEx
        )
        .then((r) => {
          this.CityMult = r as Array<CityMult>;
        });

      this.admissionRepository
        .AdmissionTrendGraphProgramD(
          this.sessionId +
            "?" +
            this.cityIdEx +
            "?" +
            this.user.userId +
            "?2020-09-16" +
            "?" +
            this.levelName +
            "?" +
            this.programDetailIdEx
        )
        .then((r) => {
          this.admissiontrend = r as Array<AdmissiontrendClass>;
          this.options = chartPerser.getChartJson(
            this.admissiontrend,
            "trendingLine"
          );
        });

      // this.admissionRepository.GetVWShiftDatePgd(this.sessionId + '?' + this.cityIdEx + '?' + this.user.userId + '?' + helper.formateDate(new Date(this.fromDateEx)) + '?' + helper.formateDate(new Date(this.toDateEx)) + '?' + this.levelName + '?' + this.programDetailIdEx)
      // .then(r => {

      //   this.ShiftMult = r as Array<ProgramMult>;
      // })
    }
  }

  programWiseData() {
    this.loadProgramsOfCampus();
    if (this.viewCities) {
      this.cityIdEx = "00000000-0000-0000-0000-000000000000";
    } else {
      this.cityIdEx = this.cityId.toString().replace('"', "");
    }
    // this.programIdEx = this.programId.toString().replace('"', '');
    if (
      this.sessionId.length > 0 &&
      this.cityIdEx.length > 0 &&
      this.levelName.length > 0 &&
      this.programId.length > 0
    ) {
      this.data = [];
      this.paidData = [];
      this.EnrollData = [];
      this.admissionCount = 0;
      this.paidChallanCount = 0;
      this.enrollmentCount = 0;
      this.onlineCount = 0;
      this.onlineCountNew = 0;
      this.ondeskCount = 0;
      var key =
        this.sessionId +
        "?" +
        this.cityIdEx +
        "?" +
        this.user.userId +
        "?" +
        helper.formateDate(new Date(this.fromDateEx)) +
        "?" +
        helper.formateDate(new Date(this.toDateEx)) +
        "?" +
        this.levelName +
        "?" +
        this.programId;
      this.getAdmissionGenderDashboardCityProgramWise();
      this.getAdmissionOnlineDashboardCityProgramWise();
      this.admissionRepository.GetCityWiseProgram(key).then((r) => {
        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.onlineCount = this.EnrollData[0].enrollmentCount;
        this.ondeskCount = this.admissionCount - this.onlineCountNew;
      });
      this.admissionRepository.GetVWProgramDateEXX(key).then((r) => {
        this.ProgramMult = r as Array<ProgramMult>;
        this.programchart = chartPerser.getChartJson(
          this.ProgramMult,
          "programBar"
        );
      });
      this.admissionRepository.GetVWCityDateEXX(key).then((r) => {
        this.CityMult = r as Array<CityMult>;
      });

      this.admissionRepository
        .AdmissionTrendGraphProgram(
          this.sessionId +
            "?" +
            this.cityIdEx +
            "?" +
            this.user.userId +
            "?2020-09-16" +
            "?" +
            this.levelName +
            "?" +
            this.programId
        )
        .then((r) => {
          this.admissiontrend = r as Array<AdmissiontrendClass>;
          this.options = chartPerser.getChartJson(
            this.admissiontrend,
            "trendingLine"
          );
        });

      this.admissionRepository.GetVWShiftDateEXX(key).then((r) => {
        this.ShiftMult = r as Array<ProgramMult>;
        this.formcolectionPie = chartPerser.getChartJson(
          this.ShiftMult,
          "formcolectionPie"
        );
        this.feePaidPie = chartPerser.getChartJson(
          this.ShiftMult,
          "feePaidPie"
        );
      });
    }
  }

  getTotalGenderCount() {
    debugger;
    this.totalGenderCount = 0;
    this.totalFemaleCount = 0;
    this.totalMaleCount = 0;
    if (this.genderCountList.length == 2) {
      this.totalGenderCount =
        this.genderCountList[0].genderCount +
        this.genderCountList[1].genderCount;
      if (this.genderCountList[0].description == "Female") {
        this.totalFemaleCount = this.genderCountList[0].genderCount;
      } else if (this.genderCountList[0].description == "Male") {
        this.totalMaleCount = this.genderCountList[0].genderCount;
      }
      if (this.genderCountList[1].description == "Male") {
        this.totalMaleCount = this.genderCountList[1].genderCount;
      } else if (this.genderCountList[1].description == "Female") {
        this.totalFemaleCount = this.genderCountList[1].genderCount;
      }
    } else if (this.genderCountList.length == 1) {
      this.totalGenderCount = this.genderCountList[0].genderCount;
      if (this.genderCountList[0].description == "Female") {
        this.totalFemaleCount = this.genderCountList[0].genderCount;
      } else {
        this.totalMaleCount = this.genderCountList[0].genderCount;
      }
    } else {
      this.totalGenderCount = 0;
      this.totalFemaleCount = 0;
      this.totalMaleCount = 0;
      // return 0;
    }
  }

  loadcityWiseData() {
    this.programDetailId = "";
    this.levelName = "";
    this.programId = "";
    if (this.viewCities) {
      this.cityIdEx = "00000000-0000-0000-0000-000000000000";
    } else {
      this.cityIdEx = this.cityId.toString().replace('"', "");
    }
    if (this.sessionId.length > 0 && this.cityIdEx.length > 0) {
      this.data = [];
      this.paidData = [];
      this.EnrollData = [];
      this.admissionCount = 0;
      this.paidChallanCount = 0;
      this.enrollmentCount = 0;
      this.onlineCount = 0;
      this.onlineCountNew = 0;
      this.ondeskCount = 0;
      var key =
        this.sessionId +
        "?" +
        this.cityIdEx +
        "?" +
        this.user.userId +
        "?" +
        helper.formateDate(new Date(this.fromDateEx)) +
        "?" +
        helper.formateDate(new Date(this.toDateEx));
      this.getGenderCountCity();
      this.getOnlineCountCity();
      this.admissionRepository.GetCityWiseDateMult(key).then((r) => {
        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.onlineCount = this.EnrollData[0].enrollmentCount;
        this.ondeskCount = this.admissionCount - this.onlineCountNew;
      });
      this.admissionRepository.GetVWProgramDate(key).then((r) => {
        this.ProgramMult = r as Array<ProgramMult>;
        this.programchart = chartPerser.getChartJson(
          this.ProgramMult,
          "programBar"
        );
      });
      this.admissionRepository.GetVWCityDate(key).then((r) => {
        this.CityMult = r as Array<CityMult>;
      });

      this.admissionRepository
        .AdmissionTrendGraphCity(
          this.sessionId +
            "?" +
            this.cityIdEx +
            "?" +
            this.user.userId +
            "?" +
            "2020-09-16"
        )
        .then((r) => {
          this.admissiontrend = r as Array<AdmissiontrendClass>;
          this.options = chartPerser.getChartJson(
            this.admissiontrend,
            "trendingLine"
          );
        });

      this.admissionRepository.GetVWShiftDate(key).then((r) => {
        debugger;
        this.ShiftMult = r as Array<ProgramMult>;
        this.formcolectionPie = chartPerser.getChartJson(
          this.ShiftMult,
          "formcolectionPie"
        );
        if(this.paidChallanCount === 0){
          // this.ShiftMult[0].description = 'Morning';
          // this.ShiftMult[0].feePaid = 0;
          // this.ShiftMult[1].description = 'Afternoon';
          // this.ShiftMult[1].feePaid = 0;
          // this.feePaidPie = chartPerser.getChartJson(
          //   this.ShiftMult,
          //   "feePaidPie"
          // );
        }
         else{
          this.feePaidPie = chartPerser.getChartJson(
            this.ShiftMult,
            "feePaidPie"
          );
       }
        
      });

      // this.admissionRepository.AdmissionGenderCount(key)
      // .then(s=>{
      //   this.genderCountList= s as IAdmissionGenderDashboard[]
      // })
    }
  }
  loadLevelWiseNew() {
    this.programDetailId = "";
    this.levelName = "";
    this.programId = "";
    if (this.viewCities) {
      this.cityIdEx = "00000000-0000-0000-0000-000000000000";
    } else {
      this.cityIdEx = this.cityId.toString().replace('"', "");
    }
    if (this.sessionId.length > 0 && this.cityIdEx.length > 0) {
      this.data = [];
      this.paidData = [];
      this.EnrollData = [];
      this.admissionCount = 0;
      this.paidChallanCount = 0;
      this.enrollmentCount = 0;
      this.onlineCount = 0;
      this.ondeskCount = 0;
      var key =
        this.sessionId +
        "?" +
        this.cityIdEx +
        "?" +
        this.user.userId +
        "?" +
        this.levelName +
        "?" +
        helper.formateDate(new Date(this.fromDateEx)) +
        "?" +
        helper.formateDate(new Date(this.toDateEx));
      this.admissionRepository.GetCityWiseDateMult(key).then((r) => {
        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.onlineCount = this.EnrollData[0].enrollmentCount;
        this.ondeskCount = this.admissionCount - this.onlineCountNew;
      });
      this.admissionRepository.GetVWProgramDate(key).then((r) => {
        this.ProgramMult = r as Array<ProgramMult>;
        this.programchart = chartPerser.getChartJson(
          this.ProgramMult,
          "programBar"
        );
      });
      this.admissionRepository.GetVWCityDate(key).then((r) => {
        this.CityMult = r as Array<CityMult>;
      });

      this.admissionRepository
        .AdmissionTrendGraphCity(
          this.sessionId +
            "?" +
            this.cityIdEx +
            "?" +
            this.user.userId +
            "?2020-09-16"
        )
        .then((r) => {
          this.admissiontrend = r as Array<AdmissiontrendClass>;
          this.options = chartPerser.getChartJson(
            this.admissiontrend,
            "trendingLine"
          );
        });

      this.admissionRepository.GetVWShiftDate(key).then((r) => {
        this.ShiftMult = r as Array<ProgramMult>;
        this.formcolectionPie = chartPerser.getChartJson(
          this.ShiftMult,
          "formcolectionPie"
        );
        this.feePaidPie = chartPerser.getChartJson(
          this.ShiftMult,
          "feePaidPie"
        );
      });
    }
  }

  loadLevelWise() {
    this.loadPrograms();
    if (this.viewCities) {
      this.cityIdEx = "00000000-0000-0000-0000-000000000000";
    } else {
      this.cityIdEx = this.cityId.toString().replace('"', "");
    }
    if (this.sessionId.length > 0 && this.cityIdEx.length > 0) {
      this.data = [];
      this.paidData = [];
      this.EnrollData = [];
      this.admissionCount = 0;
      this.paidChallanCount = 0;
      this.enrollmentCount = 0;
      this.onlineCount = 0;
      this.onlineCountNew = 0;
      this.ondeskCount = 0;
      this.levelName = this.viewLevel ? "All" : this.levelName;
      var key =
        this.sessionId +
        "?" +
        this.cityIdEx +
        "?" +
        this.user.userId +
        "?" +
        helper.formateDate(new Date(this.fromDateEx)) +
        "?" +
        helper.formateDate(new Date(this.toDateEx)) +
        "?" +
        this.levelName;

      this.getAdmissionGenderDashboardCityLevelWise();
      this.getAdmissionOnlineDashboardCityLevelWise();
      this.admissionRepository.GetCityWiseMultLevel(key).then((r) => {
        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
        this.onlineCount = this.EnrollData[0].enrollmentCount;
        this.ondeskCount = this.admissionCount - this.onlineCountNew;
      });
      this.admissionRepository.GetVWProgramDateEX(key).then((r) => {
        this.ProgramMult = r as Array<ProgramMult>;
        this.programchart = chartPerser.getChartJson(
          this.ProgramMult,
          "programBar"
        );
      });
      // this.admissionRepository.GetVWCityDateEX(key).then((r) => {
      //   this.CityMult = r as Array<CityMult>;
      // });

      this.admissionRepository.VWCityDateEXCity(this.sessionId +
        "?" +
        helper.formateDate(this.fromDateEx) +
        "?" +
        helper.formateDate(this.toDateEx) +
        "?" +
        this.cityIdEx +
        "?" +
        this.user.userId).then((r) => {
        this.CityMult = r as Array<CityMult>;
      });
      this.admissionRepository
        .AdmissionTrendGraphlevel(
          this.sessionId +
            "?" +
            this.cityIdEx +
            "?" +
            this.user.userId +
            "?2020-09-16" +
            "?" +
            this.levelName
        )
        .then((r) => {
          this.admissiontrend = r as Array<AdmissiontrendClass>;
          this.options = chartPerser.getChartJson(
            this.admissiontrend,
            "trendingLine"
          );
        });

      this.admissionRepository.GetVWShiftDateEX(key).then((r) => {
        this.ShiftMult = r as Array<ProgramMult>;
        this.formcolectionPie = chartPerser.getChartJson(
          this.ShiftMult,
          "formcolectionPie"
        );
        this.feePaidPie = chartPerser.getChartJson(
          this.ShiftMult,
          "feePaidPie"
        );
      });
    }
  }

  loadProgramsOfCampus() {
    if (this.programId.length > 0) {
      // this.ddl = [];
      // this.programDDL = [];
      // let oldObj: VWCampusProgramCity;
      var key = this.programId;
      this.campusProgramLinkRepo.GetLevelProgram(key).then((r) => {
        this.campusProgramLinkList = r as Array<VWCampusProgramLevel>;
      });
    }
  }

  loadPrograms() {
    if (this.levelName.length > 0) {
      // this.ddl = [];
      // this.programDDL = [];
      // let oldObj: VWCampusProgramCity;
      var key = this.levelName;
      this.campusProgramLinkRepo.GetLevel(key).then((r) => {
        this.ProgramLinkList = r as Array<VWProgramLevel>;
      });
    }
  }

  getSession() {
    this.sessionList = [];
    this.repositorySession
      .GetFindBy("e => e.StatusId == 1")
      .then((response) => {
        this.sessionList = response as Array<ISetupSession>;
        this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
        // this.sessionId = this.sessionList[0].sessionId;
        this.sessionId = this.sessionList.find(
          (e) => e.fullName == "2324"
        ).sessionId;
        this.refreshData();
      });
  }

  loadClass() {
    this.classRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("admissionDashboard" in this.user.claims == true) {
        if (this.user.claims["admissionDashboard"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["admissionDashboard"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["admissionDashboard"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["admissionDashboard"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  options = {
    chart: {
      backgroundColor: "#959cb61a",
      type: "line",
    },
    title: {
      text: "Sample Data",
    },

    yAxis: {
      title: {
        text: null,
      },
    },

    xAxis: {
      categories: [
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
      ],
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    },

    series: [
      {
        name: "Admission",
        data: [
          13934,
          14503,
          16177,
          17658,
          18031,
          19031,
          19133,
          19844,
          20823,
          24441,
        ],
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  options1 = {
    chart: {
      type: "column",
    },
    colors: ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
    title: {
      text: "Sample Data",
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: ["Lahore", "Rawalpindi", "Faisalabad", "Gujranwala"],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total Students",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} Students</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -5,
      y: 40,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      shadow: true,
    },
    series: [
      {
        name: "2016",
        data: [18000, 14000, 13000, 9000],
      },
      {
        name: "2017",
        data: [19000, 15000, 14000, 10000],
      },
      {
        name: "2018",
        data: [20000, 16000, 15000, 11000],
      },
      {
        name: "2019",
        data: [21000, 17000, 16000, 12000],
      },
    ],
  };

  programchart = {
    chart: {
      type: "column",
    },
    colors: ["#8b8abb", "#ff9dab", "#a2a0fe", "#ffc1ca"],
    title: {
      text: "Sample Data",
    },
    subtitle: {
      text: null,
    },
    xAxis: {
      categories: ["Lahore", "Rawalpindi", "Faisalabad", "Gujranwala"],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total Students",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} Students</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -5,
      y: 40,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      shadow: true,
    },
    series: [
      {
        name: "2016",
        data: [18000, 14000, 13000, 9000],
      },
      {
        name: "2017",
        data: [19000, 15000, 14000, 10000],
      },
      {
        name: "2018",
        data: [20000, 16000, 15000, 11000],
      },
      {
        name: "2019",
        data: [21000, 17000, 16000, 12000],
      },
    ],
  };

  formcolectionPie = {
    title: { text: "" },
    colors: [
      "#39B54A",
      "#25ABE2",
      "#262262",
      "#9F1F63",
      "#5A4A42",
      "#BF1E2D",
      "#F7941D",
      "#FFF200",
      "#EE207C",
      "#27368E",
    ],
    credits: {
      enabled: false,
    },
  };

  feePaidPie = {
    title: { text: "" },
    colors: [
      "#39B54A",
      "#25ABE2",
      "#262262",
      "#9F1F63",
      "#5A4A42",
      "#BF1E2D",
      "#F7941D",
      "#FFF200",
      "#EE207C",
      "#27368E",
    ],
    credits: {
      enabled: false,
    },
  };
}
