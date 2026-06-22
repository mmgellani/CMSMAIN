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
  IGeneral,
  IComparisonData,
  IAverageDashboard,
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
  ComparisonService,
} from "../../../../service";
export interface IAdmissionGenderDashboard {
  description: string;
  genderCount: number;
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
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import { T } from "lodash/fp";
import { el } from "../../../../../../admin/layout/navigation/svgPath";

export interface IAdmissionSessionWise {
  id: string;
  fullName: string;
  formSubmition: number;
  feePaidCount: number;
  nDateAdmission: number;
  feePaidCountToday: number;
  formSubmitionPrevious: number;
  conversion: number;
}

export interface IAdmissionSessionWise2 {
  id: string;
  fullName: string;
  currentFormSubmission: number;
  currentAdmission: number;
  currentFormConversion: number;
  previousFormSubmission: number;
  previousAdmission: number;
  previousFormConversion: number;
  differenceValue: number;
  differencePercentage: number;
  currentNDateAdmission: number;
  previousNDateAdmission: number;
  previousAdmissionEx: number;
}

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
export class AdmissionComaprisonDashboard extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private myData: IAdmissionSessionWise2[] = [];
  private repository: PublicVWDashBoardVMService;
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
  private sessionList1: Array<IGeneral> = [];
  private campusTypeList: Array<IGeneral> = [];
  private cityList1: Array<IGeneral> = [];
  private subCityList: Array<IGeneral> = [];
  private programList: Array<IGeneral> = [];

  private finalData: Array<IComparisonData> = [];
  private averageData: Array<IAverageDashboard> = [];

  private tabRef = "";
  public tabOne: boolean = false;
  public tabTwo: boolean = true;
  private typeChk: boolean = false;
  private typeId: string = "Owned";

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
  private posessionid: string = "";

  // private goBack = [
  //   { id: 1, key: "" },
  //   { id: 2, key: "" },
  //   { id: 3, key: "" },
  //   { id: 4, key: "" },
  //   { id: 5, key: "" },
  //   { id: 6, key: "" },
  //   { id: 7, key: "" },
  // ];
  private sumData = { scheduled: 0, held: 0, approved: 0, unApproved: 0 };

  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private sessionList: Array<ISetupSession> = [];

  private posessionList: Array<ISetupSession> = [];
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

  private paidData: Array<FeeStudentChallanCount> = [];
  private EnrollData: Array<EnrollmentsCount> = [];
  private admissionCount: number = 0;
  private totalGenderCount: number = 0;
  private totalMaleCount: number = 0;
  private totalFemaleCount: number = 0;
  private paidChallanCount: number = 0;
  private enrollmentCount: number = 0;
  private onlineCount: number = 0;
  private ondeskCount: number = 0;
  private admissionCountDaily: number = 0;
  private paidChallanCountDaily: number = 0;
  private enrollmentCountDaily: number = 0;
  private dataList = [];
  private LevelList = [];
  private fromDate = new Date(new Date().setDate(new Date().getDate() - 20));
  private toDate = new Date();
  // private fromDateEx = new Date(new Date().setDate(new Date().getDate() - 7));
  private fromDateEx = new Date("2024-07-09");
  private toDateEx = new Date();
  private currDate = new Date();
  private levelName = "";
  private lastadmissiondate:string = "";
  private currentadmissiondate:string = "";
  private dayNumber:number = 0;
  private viewCities: boolean = false;
  private viewLevel: boolean = false;
 // public newloader: boolean = true;
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
  currentFormSubmissionTotal: number = 0;
  currentAdmissionTotal: number = 0;
  currentFormConversionTotal: number = 0;
  previousFormSubmissionTotal: number = 0;
  previousAdmissionTotal: number = 0;
  previousAdmissionTotalEx: number = 0;

  previousFormConversionTotal: number = 0;
  differenceValueTotal: number = 0;
  differencePercentageTotal: number = 0;
  currentNDateAdmissionTotal: number = 0;
  previousNDateAdmissionTotal: number = 0;
  created() {

    this.repository = new PublicVWDashBoardVMService(this.$store);
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
      //setTimeout(() => this.newloader = false, 14000)
  }
  next = "session";
  refresh() {
    var whereClause: string = "WHERE ";

    this.backList = [];
    this.next = "session";
    //this.getDataPosession("result", whereClause);
      if (this.typeId.length > 0) {
        whereClause += ` AND "CampusType" = '${this.typeId}'`;
      } else {
        // alert("Please select Possession Type");
        // return;
      }

      this.getData("result", whereClause);
      
     // setTimeout(() => this.newloader = false, 14000)
     //this.getDataPosession("type",whereClause);


    //this.newloader = false;
  }
  goBack() {
    //var key = `${this.backList[0].id}?${this.backList[0].criteria}?${moment(this.toDateEx).format('YYYY-MM-DD')}`;
    //  var backItem=this.backList.shift();

    this.next = this.backList[0].criteria;
    this.getDataGoBack(this.backList[0].criteria, this.backList[0].id);
    this.backList.shift();
  }
  backList = [];
  getData(provider: string, param: string = "") {
    //this.posessionid=possession;
    //debugger;
    if (this.typeId == "Owned") {
      if (this.next == "session") {
        var key = `${this.sessionId}?${this.next}?${moment(
          this.toDateEx
        ).format("YYYY-MM-DD")}`;
        this.next = "city";
      } else if (this.next == "city") {
        this.backList.unshift({ criteria: "session", id: param });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "program";
      } else if (this.next == "program") {
        this.backList.unshift({ criteria: "city", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "type";
      } else if (this.next == "type") {
        this.backList.unshift({ criteria: "program", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
      }

      this.repository.GetAdmissionSessionWiseDataEx2(key).then((r) => {
       
        if(r.length > 0){
          this.currentFormSubmissionTotal = 0;
          this.currentAdmissionTotal = 0;
          this.currentFormConversionTotal = 0;
          this.previousFormSubmissionTotal = 0;
          this.previousAdmissionTotal = 0;
          this.previousAdmissionTotalEx = 0;
          this.previousFormConversionTotal = 0;
          this.differenceValueTotal = 0;
          this.differencePercentageTotal = 0;
          this.currentNDateAdmissionTotal = 0;
          this.previousNDateAdmissionTotal = 0;
          this.dayNumber = 0;
          this.lastadmissiondate="";
          this.dayNumber=r[0].admissionDay;
          this.currentadmissiondate=moment(this.toDateEx).format(
            "DD-MMM-YYYY"
          );
          this.lastadmissiondate=moment(r[0].lastAdmissionDate).format(
            "DD-MMM-YYYY"
          );
        }else{
          
          this.backList.unshift({ criteria: "session", id: param });

          return;
        }
        this.myData = r;
        this.myData.forEach((s) => {
          console.log(this.myData,'>>>>>>>>');
          this.currentFormSubmissionTotal += s.currentFormSubmission;
          this.currentAdmissionTotal += s.currentAdmission;
          this.currentFormConversionTotal += s.currentFormConversion;
          this.previousFormSubmissionTotal += s.previousFormSubmission;
          this.previousAdmissionTotal += s.previousAdmission;
          this.previousAdmissionTotalEx += s.previousAdmissionEx;
          this.previousFormConversionTotal += s.previousFormConversion;
          this.differenceValueTotal += s.differenceValue;
          this.differencePercentageTotal += s.differencePercentage;
          this.currentNDateAdmissionTotal += s.currentNDateAdmission;
          this.previousNDateAdmissionTotal += s.previousNDateAdmission;
        });
      });
      this.$store.dispatch(StoreTypes.loadingState, true)
    } else if (this.typeId == "Franchise") {
      if (this.next == "session") {
        var key = `${this.sessionId}?${this.next}?${moment(
          this.toDateEx
        ).format("YYYY-MM-DD")}`;
        this.next = "city";
      } else if (this.next == "city") {
        this.backList.unshift({ criteria: "session", id: param });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "program";
      } else if (this.next == "program") {
        this.backList.unshift({ criteria: "city", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "type";
      } else if (this.next == "type") {
        this.backList.unshift({ criteria: "program", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
      }

      this.repository.GetAdmissionSessionWiseDataEx4(key).then((r) => {
        
        if(r.length > 0){
          this.currentFormSubmissionTotal = 0;
        this.currentAdmissionTotal = 0;
        this.currentFormConversionTotal = 0;
        this.previousFormSubmissionTotal = 0;
        this.previousAdmissionTotal = 0;
        this.previousAdmissionTotalEx = 0;
        this.previousFormConversionTotal = 0;
        this.differenceValueTotal = 0;
        this.differencePercentageTotal = 0;
        this.currentNDateAdmissionTotal = 0;
        this.previousNDateAdmissionTotal = 0;
        this.dayNumber = 0;
        this.lastadmissiondate="";
          this.dayNumber=r[0].admissionDay;
          this.currentadmissiondate=moment(this.toDateEx).format(
            "DD-MMM-YYYY"
          );
          this.lastadmissiondate=moment(r[0].lastAdmissionDate).format(
            "DD-MMM-YYYY"
          );
        }
        else{
          
          this.backList.unshift({ criteria: "session", id: param });

          return;
        }
        this.myData = r;
        this.myData.forEach((s) => {
          this.currentFormSubmissionTotal += s.currentFormSubmission;
          this.currentAdmissionTotal += s.currentAdmission;
          this.currentFormConversionTotal += s.currentFormConversion;
          this.previousFormSubmissionTotal += s.previousFormSubmission;
          this.previousAdmissionTotal += s.previousAdmission;
          this.previousAdmissionTotalEx += s.previousAdmissionEx;
          this.previousFormConversionTotal += s.previousFormConversion;
          this.differenceValueTotal += s.differenceValue;
          this.differencePercentageTotal += s.differencePercentage;
          this.currentNDateAdmissionTotal += s.currentNDateAdmission;
          this.previousNDateAdmissionTotal += s.previousNDateAdmission;
        });
      });
    }
    this.$store.dispatch(StoreTypes.loadingState, true)
  }
newgetdata(provider: string, param: string = ""){
  if (this.next == "session") {
    var key = `${this.sessionId}?${this.next}?${moment(
      this.toDateEx
    ).format("YYYY-MM-DD")}`;
    this.next = "city";
  } else if (this.next == "city") {
    this.backList.unshift({ criteria: "session", id: param });
    var key = `${param}?${this.next}?${moment(this.toDateEx).format(
      "YYYY-MM-DD"
    )}`;
    this.next = "program";
  } else if (this.next == "program") {
    this.backList.unshift({ criteria: "city", id: this.backList[0].id });
    var key = `${param}?${this.next}?${moment(this.toDateEx).format(
      "YYYY-MM-DD"
    )}`;
    this.next = "type";
  } else if (this.next == "type") {
    this.backList.unshift({ criteria: "program", id: this.backList[0].id });
    var key = `${param}?${this.next}?${moment(this.toDateEx).format(
      "YYYY-MM-DD"
    )}`;
  }

  this.repository.GetAdmissionSessionWiseDataEx2(key).then((r) => {
   
    if(r.length > 0){
      this.currentFormSubmissionTotal = 0;
      this.currentAdmissionTotal = 0;
      this.currentFormConversionTotal = 0;
      this.previousFormSubmissionTotal = 0;
      this.previousAdmissionTotal = 0;
      this.previousAdmissionTotalEx = 0;
      this.previousFormConversionTotal = 0;
      this.differenceValueTotal = 0;
      this.differencePercentageTotal = 0;
      this.currentNDateAdmissionTotal = 0;
      this.previousNDateAdmissionTotal = 0;
      this.dayNumber = 0;
      this.lastadmissiondate="";
      this.dayNumber=r[0].admissionDay;
      this.currentadmissiondate=moment(this.toDateEx).format(
        "DD-MMM-YYYY"
      );
      this.lastadmissiondate=moment(r[0].lastAdmissionDate).format(
        "DD-MMM-YYYY"
      );
    }
    this.myData = r;
    this.myData.forEach((s) => {
      this.currentFormSubmissionTotal += s.currentFormSubmission;
      this.currentAdmissionTotal += s.currentAdmission;
      this.currentFormConversionTotal += s.currentFormConversion;
      this.previousFormSubmissionTotal += s.previousFormSubmission;
      this.previousAdmissionTotal += s.previousAdmission;
      this.previousAdmissionTotalEx += s.previousAdmissionEx;
      this.previousFormConversionTotal += s.previousFormConversion;
      this.differenceValueTotal += s.differenceValue;
      this.differencePercentageTotal += s.differencePercentage;
      this.currentNDateAdmissionTotal += s.currentNDateAdmission;
      this.previousNDateAdmissionTotal += s.previousNDateAdmission;
    });
  });}
  getDataGoBack(provider: string, param: string = "") {
    //this.posessionid=possession;
    //debugger;
    if (this.typeChk == false) {
      if (this.next == "session") {
        var key = `${this.sessionId}?${this.next}?${moment(
          this.toDateEx
        ).format("YYYY-MM-DD")}`;
        this.next = "city";
      } else if (this.next == "city") {
        this.backList.unshift({ criteria: "session", id: param });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "program";
      } else if (this.next == "program") {
        this.backList.unshift({ criteria: "city", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "type";
      } else if (this.next == "type") {
        this.backList.unshift({ criteria: "program", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
      }

      this.repository.GetAdmissionSessionWiseDataEx2(key).then((r) => {
      
        if(r.length > 0){
          this.currentFormSubmissionTotal = 0;
          this.currentAdmissionTotal = 0;
          this.currentFormConversionTotal = 0;
          this.previousFormSubmissionTotal = 0;
          this.previousAdmissionTotal = 0;
          this.previousAdmissionTotalEx = 0;
          this.previousFormConversionTotal = 0;
          this.differenceValueTotal = 0;
          this.differencePercentageTotal = 0;
          this.currentNDateAdmissionTotal = 0;
          this.previousNDateAdmissionTotal = 0;
          this.dayNumber = 0;
          this.lastadmissiondate="";
          this.dayNumber=r[0].admissionDay;
          this.currentadmissiondate=moment(this.toDateEx).format(
            "DD-MMM-YYYY"
          );
          this.lastadmissiondate=moment(r[0].lastAdmissionDate).format(
            "DD-MMM-YYYY"
          );
        }
        this.myData = r;
        this.myData.forEach((s) => {
          this.currentFormSubmissionTotal += s.currentFormSubmission;
          this.currentAdmissionTotal += s.currentAdmission;
          this.currentFormConversionTotal += s.currentFormConversion;
          this.previousFormSubmissionTotal += s.previousFormSubmission;
          this.previousAdmissionTotal += s.previousAdmission;
          this.previousAdmissionTotalEx += s.previousAdmissionEx;
          this.previousFormConversionTotal += s.previousFormConversion;
          this.differenceValueTotal += s.differenceValue;
          this.differencePercentageTotal += s.differencePercentage;
          this.currentNDateAdmissionTotal += s.currentNDateAdmission;
          this.previousNDateAdmissionTotal += s.previousNDateAdmission;
        });
      });
    } else {
      if (this.next == "session") {
        var key = `${this.sessionId}?${this.next}?${moment(
          this.toDateEx
        ).format("YYYY-MM-DD")}`;
        this.next = "city";
      } else if (this.next == "city") {
        this.backList.unshift({ criteria: "session", id: param });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "program";
      } else if (this.next == "program") {
        this.backList.unshift({ criteria: "city", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
        this.next = "type";
      } else if (this.next == "type") {
        this.backList.unshift({ criteria: "program", id: this.backList[0].id });
        var key = `${param}?${this.next}?${moment(this.toDateEx).format(
          "YYYY-MM-DD"
        )}`;
      }

      this.repository.GetAdmissionSessionWiseDataEx4(key).then((r) => {
       
        if(r.length > 0){
          this.currentFormSubmissionTotal = 0;
          this.currentAdmissionTotal = 0;
          this.currentFormConversionTotal = 0;
          this.previousFormSubmissionTotal = 0;
          this.previousAdmissionTotal = 0;
          this.previousAdmissionTotalEx = 0;
          this.previousFormConversionTotal = 0;
          this.differenceValueTotal = 0;
          this.differencePercentageTotal = 0;
          this.currentNDateAdmissionTotal = 0;
          this.previousNDateAdmissionTotal = 0;
          this.dayNumber = 0;
          this.lastadmissiondate="";
          this.dayNumber=r[0].admissionDay;
          this.currentadmissiondate=moment(this.toDateEx).format(
            "DD-MMM-YYYY"
          );
          this.lastadmissiondate=moment(r[0].lastAdmissionDate).format(
            "DD-MMM-YYYY"
          );
        }
        this.myData = r;
        this.myData.forEach((s) => {
          this.currentFormSubmissionTotal += s.currentFormSubmission;
          this.currentAdmissionTotal += s.currentAdmission;
          this.currentFormConversionTotal += s.currentFormConversion;
          this.previousFormSubmissionTotal += s.previousFormSubmission;
          this.previousAdmissionTotal += s.previousAdmission;
          this.previousAdmissionTotalEx += s.previousAdmissionEx;
          this.previousFormConversionTotal += s.previousFormConversion;
          this.differenceValueTotal += s.differenceValue;
          this.differencePercentageTotal += s.differencePercentage;
          this.currentNDateAdmissionTotal += s.currentNDateAdmission;
          this.previousNDateAdmissionTotal += s.previousNDateAdmission;
        });
      });
    }
  }
  genderCountList: IAdmissionGenderDashboard[] = [];
  mounted() {
   
    this.getDataPosession("type");
    this.validatePage();
    this.getSession();
 
     this.newgetdata("Owned");
     //setTimeout(() => this.newloader = false, 14000)
    // this.getData("city");
    // this.getData("program");
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
          (e) => e.fullName == "2425"
        ).sessionId;
        this.refresh();
        //this.getData('session');
      });
  }

 

  private repo: ComparisonService = new ComparisonService(this.$store);
  getDataPosession(module: string, param: string = "0") {
    if (module == "city") {
        if (this.typeId.length > 0) {
          param = `WHERE "CampusType"='${this.typeId}'`;
        } else {
          alert("Please Chose Posission Type.");
          return;
        }
    }

    this.repo.ParamsDashboard(`${module}:${param}`).then((response) => {
      switch (module) {
        case "session":
          this.sessionList1 = [];
          this.sessionList1 = response as Array<IGeneral>;
          break;
        case "type":
          this.campusTypeList = [];
          this.campusTypeList = response as Array<IGeneral>;
          break;
        case "city":
          this.cityList1 = [];
          this.cityList1 = response as Array<IGeneral>;

          break;
        case "subcity":
          this.subCityList = [];
          this.subCityList = response as Array<IGeneral>;
          break;
        case "program":
          this.programList = [];
          this.programList = response as Array<IGeneral>;
          break;
        case "result":
          this.finalData = [];
          this.finalData = response as Array<IComparisonData>;

          // this.generateChartEx();
          // this.getComparisonEx();
          // this.getData("Posession");
          // this.getData("type");
          // break;
          // case "type":
          //   this.getData("Posession", this.typeId);
          break;
        default:
          console.error(JSON.stringify(response));
      }
    });
    // this.getData("type", this.typeId);
  }

  private averageEx = [];
  // private getComparisonEx() {
  //   this.averageEx = [];
  //   this.repository.AverageDashboardEx().then((result) => {
  //     this.averageEx = result;
  //   });
  // }

  loadClass() {
    this.classRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }
  private session: string = ``;
  private morning: string = ``;
  private evening: string = ``;

  private sessionEx: string = ``;
  private morningEx: string = ``;
  private eveningEx: string = ``;

  // private generateChartEx() {
  //   this.sessionEx = this.morningEx = this.eveningEx = "";

  //   this.averageData.forEach((element: IAverageDashboard) => {
  //     if (this.sessionEx.indexOf(element.session.toString()) < 0)
  //       this.sessionEx += `"${element.session}",`;

  //     if (element.possession == "Owned") {
  //       this.morningEx += `${element.average},`;
  //     } else {
  //       this.eveningEx += `${element.average},`;
  //     }
  //   });

  //   this.sessionEx = this.sessionEx.substring(0, this.sessionEx.length - 1);
  //   this.morningEx = this.morningEx.substring(0, this.morningEx.length - 1);
  //   this.eveningEx = this.eveningEx.substring(0, this.eveningEx.length - 1);

  //   this.optionsTempEx = JSON.parse(
  //     this.optionsEx
  //       .replace("@Session", this.sessionEx)
  //       .replace("@Morning", this.morningEx)
  //       .replace("@Afternoon", this.eveningEx)
  //   );
  // }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("admissionComaprisonDashboard" in this.user.claims == true) {
        if (
          this.user.claims["admissionComaprisonDashboard"].indexOf("R") >= 0
        ) {
          this.canRead = true;
        }
        if (
          this.user.claims["admissionComaprisonDashboard"].indexOf("C") >= 0
        ) {
          this.canAdd = true;
        }
        if (
          this.user.claims["admissionComaprisonDashboard"].indexOf("U") >= 0
        ) {
          this.canEdit = true;
        }
        if (
          this.user.claims["admissionComaprisonDashboard"].indexOf("D") >= 0
        ) {
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

  optionsEx = `{
    "chart":{
       "type":"column"
    },
    "title":{
       "text":""
    },
    "xAxis":{
       "categories":[@Session]
    },
    "yAxis":{
       "min":0,
       "title":{
          "text":"No. of Admissions"
       },
       "stackLabels":{
          "enabled":true,
          "style":{
             "fontWeight":"bold",
             "color": "gray"
          }
       }
    },
    "legend":{
       "align":"center",
       "verticalAlign":"bottom",
       "y":25,
       "floating":true,
       "backgroundColor": "white",
       "borderColor":"#CCC",
       "borderWidth":0,
       "shadow":false
    },
    "tooltip":{
        "useHTML": "true",
       "headerFormat":"<b>{point.x}</b><br/>",
       "pointFormat":"{series.name}:<span>{point.y:.0f}</span><br/>Total: {point.stackTotal}"
    },
    "plotOptions":{
       "column":{
          "stacking":"normal",
          "dataLabels":{
             "enabled":true
          }
       }
    },
    "series":[
       {
          "name":"Owned",
          "data":[@Morning],
          "color": "#38A3A5"
       },
       {
          "name":"Franchise",
          "data":[@Afternoon],
          "color": "#22577A"
       }
    ]
 }`;

  optionsTempEx = JSON.parse(
    this.optionsEx
      .replace("@Session", this.sessionEx)
      .replace("@Morning", this.morningEx)
      .replace("@Afternoon", this.eveningEx)
  );
}
