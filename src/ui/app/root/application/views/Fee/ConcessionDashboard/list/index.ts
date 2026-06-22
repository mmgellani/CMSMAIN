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
  VWCampusProgramCity
} from "../../../../models";
import {
  AttendanceAttendenceStatusService,
  ExaminationExamDetailService,
  SetupSessionService,
  SetupClassService,
  SetupCityService,
  SetupCampusProgramLinkService
} from "../../../../service";


import { StoreTypes } from "../../../../../../store";
import { IAttendenceDashboard, StudntListEx, IConcessionDashboard, ConcessionDashboardEx } from "../../../../models/Attendance/attendenceDashboard";
import { checkServerIdentity } from "tls";
import { StudentList } from "../add-edit";
import tableGraph from "../../../../../../components/table-graph";
import collapsibleWidget from "../../../../../../components/collapsibleWidget";
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import { Round } from "../../../../helper";
export interface ConcessionDashboardEx2 {
  pId: string;
  id: string;
  displayName: string;
  className: string;
  students: number;
  challan: number;
  actualAmount: number;
  paidAmount: number;
  exemption: number;
  discountAmount: number;
  avg: number;
}

// PId" uuid, "Exemption" int4, "Id" uuid, "DisplayName" text, "ClassName" text, "Students" int4, "Challan" int4, 
// "ActualAmount" int8, "PaidAmount" int8, "DiscountAmount" int8, "Avg" int8
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    'add-edit-model': StudentList,
    'table-graph': tableGraph,
    'collapsible-widget': collapsibleWidget,
    Highcharts: genComponent('Highcharts', Highcharts)

  }
})
export class ConcessionDashboard extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceStatusService;
  private data: Array<ConcessionDashboardEx2> = [];
  private Studentdata: Array<StudntListEx> = [];
  private DeviceInfo: Array<DeviceInfoEx> = [];


  viewCities: boolean = false;
  private classes: any = [];
  private records: any = [];

  private sessionId: string = '';
  // private datestring: string = "";
  private date: Date = new Date();
  private checkIt: string = "";
  private displayName: string = "";
  private dated: string = "";
  private preferenceArr = [
    {
      item: 'Table'
    }, {
      item: 'Graph'
    }
  ];

  private goBack = [{ id: 1, key: '' },
  { id: 2, key: '' },
  { id: 3, key: '' },
  { id: 4, key: '' },
  { id: 5, key: '' },
  { id: 6, key: '' },
  { id: 7, key: '' }
  ]


  private filterString: string = "";
  private classId = '';
  private cityId = '';
  private programDetailId = '';
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private sessionList: Array<ISetupSession> = [];
  private repositorySession: SetupSessionService;
  private classRepo: SetupClassService = new SetupClassService(this.$store)
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private campusProgramLinkList: Array<VWCampusProgramCity> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);


  private classList: Array<ISetupClass> = []
  private Id: number = 0;
  private students: number = 0;
  private challan: number = 0;
  private actualAmount: number = 0;
  private paidAmount: number = 0;
  private discountAmount: number = 0;
  private avg: number = 0;

  private percentage: number = 0;

  private barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0}
  private key: string = '';
  private tabRef = '';
  public tabOne: boolean = false;
  public tabTwo: boolean = true;
  private cityList: Array<ISetupCity> = []

  private viewLevel: boolean = false;
  private LevelList = []

  public value = true;
  private levelName = '';

  private columns = [
    { key: "code", caption: "Code" },
    { key: "fullName", caption: "FullName" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.LevelList = [{ levelName: "Intermediate" }, { levelName: "Graduation" }, { levelName: "Step" }, { levelName: "Pre" }]

    this.repository = new AttendanceAttendenceStatusService(this.$store);
    this.checkIt = 'CITY'
    this.repositorySession = new SetupSessionService(this.$store);
    this.dated = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
    this.loadClass();
    this.getSession();
    this.loadCity();
    this.refreshEx();
    this.$watch('cityId', this.refreshEx);
    this.$watch('levelName', this.loadProgramsOfCampus);
    this.$watch('cityId', this.loadProgramsOfCampus);
    this.$watch('sessionId', this.loadProgramsOfCampus);


  }

  mounted() {
    this.validatePage();


  }
  showAllRecord() {

    this.viewCities != this.viewCities;
    if (this.viewCities) {
      this.cityId = ''
    }
    // this.cityData();
    this.refreshEx();
    // if (this.viewCities) {
    //   this.cityId='';   
    // this.cityData();
    // } else{
    //   if(this.cityId.length>0){
    //     this.cityData()
    //   }else{
    //     this.mountedData();
    //   }
    // }
  }
  viewClass = false
  toggleClass() {

    this.viewClass != this.viewClass;
    if (this.viewClass) {
      this.classId = ''
    }

    //this.loadClassWise();
    this.refreshEx();
  }

  loadClassWise() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };

    this.campusId = '00000000-0000-0000-0000-000000000000';
    var prgEx = '';

    if (this.sessionId.length > 0 && this.cityId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.user.userId + "?" + this.classId;

      this.repository.ConcessionDrillDownClassEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        //this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)
        this.avg = Round(this.barData.actualAmount / this.barData.students,0)
        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    }
  }
  instllmentNo = 0
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];

  // installmentList= [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];
  loadInstallmentWise() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };

    this.campusId = '00000000-0000-0000-0000-000000000000';
    var prgEx = '';

    if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length > 0 && this.instllmentNo > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.programDetailId + '?' + this.user.userId + "?" + this.classId + "?" + this.instllmentNo;

      this.repository.ConcessionDrillDownInsatlEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg=this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    }
  }
  clearSelection() {
    this.cityId = '';
    this.programDetailId = '';
    this.instllmentNo = 0;
    this.levelName = '';
    this.classId = ''
    this.viewCities = false;
    this.viewClass = false;
    this.viewLevel = false
    this.refreshEx();

  }
  refreshEx() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0};

    this.campusId = '00000000-0000-0000-0000-000000000000';
    if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length > 0 && this.instllmentNo > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.programDetailId + '?' + this.user.userId + "?" + this.classId + "?" + this.instllmentNo;

      this.repository.ConcessionDrillDownInsatlEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    } else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.programDetailId + '?' + this.user.userId + "?" + this.classId;

      this.repository.GetConcessionDashboardDataEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg=this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    } else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.levelName.length > 0) {
      // if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length) {
      //   var key =  this.user.userId;
      this.levelName = this.viewLevel ? 'All' : this.levelName;
      var key = this.sessionId + '?' + this.cityId + '?' + this.levelName + '?' + this.user.userId + "?" + this.classId;

      this.repository.ConcessionDrillDownLevelEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.sessionList[0].fullName + " Concession";
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    } else if (this.sessionId.length > 0 && this.cityId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.user.userId + "?" + this.classId;

      this.repository.ConcessionDrillDownClassEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0,avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    } else if (this.sessionId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.user.userId;

      this.repository.GetConcessionDashboardDataFx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
       // this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName += this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;
          //console.log("barData.avg");

        })

        //this.barData.avg =this.barData.avg
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)
        this.avg = Round(this.barData.actualAmount / this.barData.students,0)
        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    }
  }
  loadCity() {
    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }


  loadProgramsOfCampus() {
    if (this.levelName.length > 0) {
      // this.ddl = [];
      // this.programDDL = [];
      // let oldObj: VWCampusProgramCity;
      var key = this.levelName + "?" + this.sessionId + "?" + this.cityId;
      if (this.sessionId.length > 0 && this.levelName.length > 0 && this.cityId.length > 0) {
        this.campusProgramLinkRepo.GetLevelProgramDetail(key).then(r => {
          this.campusProgramLinkList = r as Array<VWCampusProgramCity>;
        });
      }

    }
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

  getSession() {
    this.sessionList = [];
    this.repositorySession
      .GetFindBy("e => e.StatusId ==1")
      .then(
        response => {
          this.sessionList = response as Array<ISetupSession>
          this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
          this.sessionId = this.sessionList[0].sessionId;
        });
  }

  loadClass() {
    this.classRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => { this.classList = r as Array<ISetupClass> });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("concessionDahboard" in this.user.claims == true) {
        if (this.user.claims["concessionDahboard"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["concessionDahboard"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["concessionDahboard"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["concessionDahboard"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  formatPrice(value) {
    // let val = (value / 1).toFixed(0).replace(',', ',')
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  mountedData() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };

    this.campusId = '00000000-0000-0000-0000-000000000000';

    if (this.sessionId.length > 0) {
      // if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length) {
      //   var key =  this.user.userId;
      this.repository.ConcessionDrillDownWithExemptionExx(this.sessionId + '?' + this.user.userId).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.sessionList[0].fullName + " Concession";
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;

        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    }
    // }
  }
  toggleLevel() {
    this.viewLevel = !this.viewLevel
    this.refreshEx();
    this.loadProgramsOfCampus()
    // this.getDataLevelWise();
  }
  getDataLevelWise() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
    this.campusId = '00000000-0000-0000-0000-000000000000';

    // if(!this.viewLevel) {
    //   this.levelName=''
    // }
    this.levelName = this.viewLevel ? 'All' : this.levelName;
    this.loadProgramsOfCampus()

    if (this.sessionId.length > 0 && this.cityId.length > 0 && this.levelName.length > 0) {
      // if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length) {
      //   var key =  this.user.userId;
      var key = this.sessionId + '?' + this.cityId + '?' + this.levelName + '?' + this.user.userId;

      this.repository.ConcessionDrillDownLevelEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.sessionList[0].fullName + " Concession";
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    }
    // }
  }

  refreshData() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };

    this.campusId = '00000000-0000-0000-0000-000000000000';
    var prgEx = '';

    if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.programDetailId + '?' + this.user.userId + "?" + this.classId;

      this.repository.GetConcessionDashboardDataEx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    }
  }

  cityData() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0 };

    this.campusId = '00000000-0000-0000-0000-000000000000';
    var prgEx = '';

    if (this.sessionId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.user.userId;

      this.repository.GetConcessionDashboardDataFx(key).then(r => {
        this.data = r as Array<ConcessionDashboardEx2>;
        this.students = this.data[0].students;
        this.challan = this.data[0].challan;
        this.actualAmount = this.data[0].actualAmount;
        this.paidAmount = this.data[0].paidAmount;
        this.discountAmount = this.data[0].discountAmount;
        this.avg = this.data[0].avg;
        this.barData = { challan: 0, students: 0, actualAmount: 0, paidAmount: 0, discountAmount: 0, cityName: '', exemption: 0, avg: 0};
        this.data.forEach(e => {
          this.barData.challan += e.challan;
          this.barData.students += e.students;
          this.barData.paidAmount += e.paidAmount;
          this.barData.actualAmount += e.actualAmount;
          this.barData.discountAmount += e.discountAmount;
          this.barData.cityName = this.data[0].displayName;
          this.barData.exemption += e.exemption;
          this.barData.avg += e.avg;


        })
        this.percentage = Round(this.barData.discountAmount * 100 / this.barData.actualAmount, 0)

        this.options = chartPerser.getChartJson(this.barData, 'horizontalBar');

      })
    }
  }





  campusId: string = '00000000-0000-0000-0000-000000000000';



  loadStudentList(key) {

    this.Studentdata = [];

    this.repository.GetAttendenceStudentList(key).then(r => {
      this.Studentdata = r as Array<StudntListEx>;

      this.repository.GetDeviceInfo(key).then(r => {
        this.DeviceInfo = r as Array<DeviceInfoEx>;

        this.$modal.show('add-edit-model', { model: this.Studentdata, Status: this.data, DeviceInfo: this.DeviceInfo, IsNewRecord: false });

      })


    })

  }

  getData(id, cls, typ) {
    var record = this.data.find(e => e.id == id && e.className == cls);

    var rec = '';

    if (record) {
      if (typ == 'C') {
        rec = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 }).format(record.challan);
      }

      if (typ == 'A') {
        rec = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 }).format(record.actualAmount);
      }

      if (typ == 'P') {
        rec = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 }).format(record.paidAmount);
      }

      if (typ == 'D') {
        rec = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 }).format(record.discountAmount);
      }


      if (!rec) {
        rec = '';
      }

      return rec;
    }
  }

  options = {
    chart: {
      type: 'bar'
    },
    colors:
      ['#00FF00'],
    title: {
      text: 'No Data Found',
      align: 'left'
    },
    xAxis: {
      categories: ['Lahore'],
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      max: 97038386,
      title: {
        text: 'PKR',
        align: 'high'
      },
      plotLines: [{
        color: '#F5B038',
        dashStyle: 'shortdash',
        width: 2,
        value: 0,
        zIndex: 5
      }]
    },
    tooltip: {
      valueSuffix: ' PKR'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Concession Amount',
      data: [0]
    }]

  };

}