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
import { IAttendenceDashboard, StudntListEx, IRevenueDashboard } from "../../../../models/Attendance/attendenceDashboard";
import { checkServerIdentity } from "tls";
import { StudentList } from "../add-edit";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import moment from "moment";
import { Helper } from "../../..";
import * as helper from "../../../../helper";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    'add-edit-model': StudentList,
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    collapsibleWidget

  }
})
export class RevenueDashboard extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceStatusService;
  private data: Array<IRevenueDashboard> = [];
  private Studentdata: Array<StudntListEx> = [];
  private DeviceInfo: Array<DeviceInfoEx> = [];
  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  private classList: Array<ISetupClass> = []

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
    private cityList: Array<ISetupCity> = [];
  private cityId = '';
  private programDetailId = '';
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private campusProgramLinkList: Array<VWCampusProgramCity> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);

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
  private csvdata: any = [];
  private Id: number = 0;
  private key: string = '';

  public viewAttendance: boolean = false;

  private columns = [
    { key: "code", caption: "Code" },
    { key: "fullName", caption: "FullName" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AttendanceAttendenceStatusService(this.$store);
    this.checkIt = 'CITY'
    this.repositorySession = new SetupSessionService(this.$store);
    this.dated = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
    this.$watch('cityId', this.cityData);
  }

  mounted() {
    this.validatePage();
    this.getSession();
    this.refreshData();
    this.loadCity();

    // this.loadClass();
    // var id =2;
    // var key = '['

    // this.goBack.forEach(e=> {
    //   if(e.id==id)
    //   e.key=key;

    // })
  }

  getSession() {
    this.sessionList = [];
    this.repositorySession
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response => {
          this.sessionList = response as Array<ISetupSession>
          this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
          this.sessionId = this.sessionList[0].sessionId;
        }
      );
  }

  loadcsv() {

    this.csvdata = [];
    if (this.data.length > 0) {
      this.data.forEach(element => {
        this.csvdata.push({
          Cluster: element.zoneName,
          City: element.city,
          Students: element.students,
          Revenue: element.revenue,
          "Average/Student": element.averagePrStd
        });
      });
      helper.exportToCsv('Revenue.csv', this.csvdata);
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Data Found',
        title: 'warning',
        messageTypeId: PayloadMessageTypes.warning
      });
    }
  }
  loadCity() {
    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

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

  loadClass() {
    this.classRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => { this.classList = r as Array<ISetupClass> });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("revenueDashboard" in this.user.claims == true) {
        if (this.user.claims["revenueDashboard"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["revenueDashboard"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["revenueDashboard"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["revenueDashboard"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    // this.sessionId = this.sessionList[0].sessionId; 

    if (this.sessionId.length > 0) {

      var key = this.sessionId + '?' + this.user.userId;
      this.repository.GetRevenueDashboardData(key).then(r => {
        this.data = r as Array<IRevenueDashboard>;
        this.options = chartPerser.getChartJson(this.data, 'revenueBar');

      })
      // this.viewAttendance = true;
    }
  }

  cityData() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    // this.sessionId = this.sessionList[0].sessionId; 

    if (this.sessionId.length > 0 && this.cityId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.user.userId;
      this.repository.GetRevenueDashboardDataFx(key).then(r => {
        this.data = r as Array<IRevenueDashboard>;
        this.options = chartPerser.getChartJson(this.data, 'revenueBar');

      })
      // this.viewAttendance = true;
    }
  }

  loadData() {
    this.Id = 0;
    this.classes = [];
    this.records = [];
    this.data = [];
    // this.sessionId = this.sessionList[0].sessionId; 

    if (this.sessionId.length > 0 && this.cityId.length > 0 && this.programDetailId.length > 0) {

      var key = this.sessionId + '?' + this.cityId + '?' + this.programDetailId + '?' + this.user.userId;
      this.repository.GetRevenueDashboardDataEx(key).then(r => {
        this.data = r as Array<IRevenueDashboard>;
        this.options = chartPerser.getChartJson(this.data, 'revenueBar');

      })
      // this.viewAttendance = true;
    }
  }

  sumDataPie(list: Array<IAttendenceDashboard>) {
    this.sumData = { scheduled: 0, held: 0, approved: 0, unApproved: 0 };
    list.forEach(e => {
      this.sumData.scheduled += e.scheduled;
      this.sumData.approved += e.approved;
      this.sumData.held += e.held;
      this.sumData.unApproved += e.unApproved;

    })

    this.options = chartPerser.getChartJson(this.sumData, 'approvedPie');
    this.optionsH = chartPerser.getChartJson(this.sumData, 'heldPie');
    //  console.log(JSON.stringify(this.options));
    // 
  }


  options = {
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

  optionsH = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

}