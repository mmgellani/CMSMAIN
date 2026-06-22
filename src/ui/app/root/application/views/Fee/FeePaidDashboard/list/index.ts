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
  StudentFeePaid
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
  RegistrationEnrollmentsService
} from "../../../../service";


import { StoreTypes } from "../../../../../../store";
import { IAttendenceDashboard, StudntListEx } from "../../../../models/Attendance/attendenceDashboard";
import { checkServerIdentity } from "tls";
import { StudentList } from "../add-edit";
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import moment from "moment";
import tableGraph from "../../../../../../components/table-graph";
import collapsibleWidget from "../../../../../../components/collapsibleWidget";
import preAdmission from "../../../../../../components/preAdmission";
import * as helper from "../../../../helper";
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    'add-edit-model': StudentList,
    'table-graph': tableGraph,
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    'form-collection-b': charts.FormCollectionBarWidget,
    'collapsible-widget': collapsibleWidget,
    'pre-admission-widget': preAdmission
  }
})
export class FeePaidDashboard extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceStatusService;
  private data: Array<StudentFeePaid> = [];
  private Studentdata: Array<StudntListEx> = [];
  private DeviceInfo: Array<DeviceInfoEx> = [];
  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  private classList: Array<ISetupClass> = [];
  private tabRef = '';
  public tabOne: boolean = false;
  public tabTwo: boolean = true;


  private classId = '';
  private classes: any = [];
  private records: any = [];
  public showDashboard: boolean = false;

  private sessionId: string = '';
  // private datestring: string = "";
  private date: Date = new Date();
  private checkIt: string = "";
  private displayName: string = "";
  private dated: string = "";

  private goBack = [{ id: 1, key: '' },
  { id: 2, key: '' },
  { id: 3, key: '' },
  { id: 4, key: '' },
  { id: 5, key: '' },
  { id: 6, key: '' },
  { id: 7, key: '' }
  ]
  private sumData = { scheduled: 0, held: 0, approved: 0, unApproved: 0 }



  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private sessionList: Array<ISetupSession> = [];
  private repositorySession: SetupSessionService;
  private Id: number = 0;
  private key: string = '';
  private preferenceArr = [
    {
      item: 'Table'
    }, {
      item: 'Graph'
    }
  ];

  public viewAttendance: boolean = false;
  private cityList: Array<ISetupCity> = []
  private cityId = '';
  private programDetailId = '';
  private programDDL: Array<DDLGroupModel> = [];
  private preDataList: Array<PreDashoboard> = [];
  private ddl: Array<DDLModel> = [];
  private campusProgramLinkList: Array<VWCampusProgramCity> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);

  private admissionRepository: AdmissionAdmissionFormService;
  private FeeChallanrepository: FeeStudentChallanService = null;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)



  // private paidData: Array<IFeeStudentChallan> = [];
  // private data: Array<IAdmissionAdmissionForm> = [];
  // private EnrollData: Array<IRegistrationEnrollments> = [];

  private paidData: Array<FeeStudentChallanCount> = [];

  private EnrollData: Array<EnrollmentsCount> = [];
  private admissionCount: number = 0;
  private paidChallanCount: number = 0;
  private enrollmentCount: number = 0;
  private admissionCountDaily: number = 0;
  private paidChallanCountDaily: number = 0;
  private enrollmentCountDaily: number = 0;
  private dataList = []
  private fromDate = new Date(new Date().setDate(new Date().getDate() - 20));
  private toDate = new Date();
  private currDate = new Date();

  private columns = [
    { key: "refferenceNo", caption: "RefferenceNo" },
    { key: "fullName", caption: "FullName" },
    { key: "challanNo", caption: "ChallanNo" },
    { key: "installmentNo", caption: "InstallmentNo" },
    { key: "feeAmount", caption: "FeeAmount" },
    { key: "dueDate", caption: "DueDate" },
    { key: "paidDate", caption: "PaidDate" },
    { key: "challanType", caption: "ChallanType" },
    { key: "collector", caption: "Collector" },
    { key: "campus", caption: "Campus" },
    { key: "description", caption: "Description" },

  ];

  created() {
    this.repository = new AttendanceAttendenceStatusService(this.$store);
    this.admissionRepository = new AdmissionAdmissionFormService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
    this.checkIt = 'CITY'
    this.repositorySession = new SetupSessionService(this.$store);
    this.dated = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
    this.dataList = [{ cityName: "Lahore", ninteen: 21000, eighteen: 20000, seventeen: 19000, sixteen: 18000 },
    { cityName: "Rawalpindi", ninteen: 17000, eighteen: 16000, seventeen: 15000, sixteen: 14000 },
    { cityName: "Faislabad", ninteen: 16000, eighteen: 15000, seventeen: 14000, sixteen: 13000 },
    { cityName: "Gujranwala", ninteen: 12000, eighteen: 11000, seventeen: 10000, sixteen: 9000 }]
    // this.$watch('cityId', this.loadcityWiseData);
  }

  mounted() {
    this.validatePage();
    this.refreshData();

  }

  formatDate(value) {
    return moment(value).format('DD-MMM-YYYY')

  }

  PreData() {
    this.admissionRepository.GetPreData(helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
      .then(r => {

        this.preDataList = r as Array<PreDashoboard>;
      })

  }
  changedEvent() {
    if (this.tabRef == 'Table') {

      this.tabOne = true;
      this.tabTwo = false;

    }
    else if (this.tabRef == 'Graph') {

      this.tabOne = false;
      this.tabTwo = true;

    }
  }
  loadCity() {
    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }

  refreshData() {
    this.data = [];

    //var key = this.sessionId + '?' + this.cityId + '?' + this.programDetailId;
    this.FeeChallanrepository.GetFeePaid(moment(this.dated).format('YYYY-MM-DD') + "?" + this.user.userId)
      .then(r => {

        this.data = r as Array<StudentFeePaid>;


      })

  }





  loadProgramsOfCampus() {
    if (this.cityId.length > 0 && this.sessionId.length > 0) {
      this.ddl = [];
      this.programDDL = [];
      let oldObj: VWCampusProgramCity;
      var key = this.sessionId + "?" + this.cityId;
      this.campusProgramLinkRepo.GetCityProgram(key).then(r => {
        this.campusProgramLinkList = r as Array<VWCampusProgramCity>;
      });
    }
  }

  getSession() {
    this.sessionList = [];
    this.repositorySession
      .GetFindBy("e => e.StatusId == 1")
      .then(
        response => {
          this.sessionList = response as Array<ISetupSession>
          this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
          this.sessionId = this.sessionList[0].sessionId;
          this.refreshData();
        }
      );
  }

  loadClass() {
    this.classRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => { this.classList = r as Array<ISetupClass> });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("feePaidDashboard" in this.user.claims == true) {
        if (this.user.claims["feePaidDashboard"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["feePaidDashboard"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["feePaidDashboard"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["feePaidDashboard"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  options = {
    chart: {
      backgroundColor: '#959cb61a',
      type: 'line'
    },
    title: {
      text: 'Sample Data'
    },

    yAxis: {
      title: {
        text: null
      }
    },

    xAxis: {
      categories: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 2010
      }
    },

    series: [{
      name: 'Admission',
      data: [13934, 14503, 16177, 17658, 18031, 19031, 19133, 19844, 20823, 24441]
    }],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }

  }

  options1 = {
    chart: {
      type: 'column'
    },
    colors:
      ['#8b8abb', '#ff9dab', '#a2a0fe', '#ffc1ca'],
    title: {
      text: 'Sample Data'
    },
    subtitle: {
      text: null
    },
    xAxis: {
      categories: [
        'Lahore',
        'Rawalpindi',
        'Faisalabad',
        'Gujranwala'
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Students'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} Students</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -5,
      y: 40,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    series: [{
      name: '2016',
      data: [18000, 14000, 13000, 9000]

    }, {
      name: '2017',
      data: [19000, 15000, 14000, 10000]

    }, {
      name: '2018',
      data: [20000, 16000, 15000, 11000]

    }, {
      name: '2019',
      data: [21000, 17000, 16000, 12000]

    }]
  }
}