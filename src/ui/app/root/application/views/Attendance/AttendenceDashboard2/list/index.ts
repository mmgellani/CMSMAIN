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
  ISetupCampusProgramVM,
  ISetupProgramDetailsVM
} from "../../../../models";
import {
  AttendanceAttendenceStatusService,
  ExaminationExamDetailService,
  SetupSessionService,
  SetupClassService,
  SetupCampusService,
  SetupCampusProgramLinkService,
  SetupProgramDetailsService
} from "../../../../service";


import { StoreTypes } from "../../../../../../store";
import { IAttendanceDashboard2CityWise, IAttendanceDashboard2LastMonths, IAttendanceDashboard2LastMonthsEx, IAttendenceDashboard, IAttendenceDashboard2, StudntListEx } from "../../../../models/Attendance/attendenceDashboard";
import { checkServerIdentity } from "tls";
import { StudentList } from "../add-edit";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import moment from "moment";
import attendanceApproved from "../../../../../../components/attendance-approved";
import { GroupModel } from "../../../../models/general";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    'add-edit-model': StudentList,
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    collapsibleWidget,
    'attendance-approved': attendanceApproved

  }
})
export class AttendenceDashboard2 extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceStatusService;
  private data: Array<IAttendenceDashboard2> = [];
  private dataEx: Array<IAttendanceDashboard2LastMonthsEx> = [];
  private dataEy: Array<IAttendanceDashboard2CityWise> = [];

  private Studentdata: Array<StudntListEx> = [];
  private DeviceInfo: Array<DeviceInfoEx> = [];
  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private classList: Array<ISetupClass> = []

  private classId = '';
  private classes: any = [];
  private records: any = [];
  public showDashboard: boolean = false;

  private sessionId: string = '';
  // private datestring: string = "";
  private date: Date = new Date();
  private checkIt: string = "CITY";
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

  private DataHigh: any = [];
  private DataLow: any = [];




  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private sessionList: Array<ISetupSession> = [];
  private repositorySession: SetupSessionService;
  private Id: number = 0;
  private key: string = '';

  private programDetailId: string = '';

  private programDetailIdEx: string = '';
  private campusIdEx: string = '';
  private campusSubCityModel: Array<GroupModel> = [];

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

  private ProgramDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store)


  private campusProgramLinkList: Array<ISetupCampusProgramVM> = []

  private ProgramDetailList: Array<ISetupProgramDetailsVM> = []


  public viewAttendance: boolean = false;
  public viewCities: boolean = false;
  public viewPrograms: boolean = false;

  private columns = [
    { key: "code", caption: "Code" },
    { key: "fullName", caption: "FullName" },
    { key: "statusId", caption: "Status" },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.repository = new AttendanceAttendenceStatusService(this.$store);
    // this.checkIt = 'CITY'
    this.repositorySession = new SetupSessionService(this.$store);
    this.dated = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

  }

  mounted() {
    this.validatePage();
    this.getSession();
    this.loadCityCampus();
    this.loadPrograms();
    this.GetCityData();
    // this.loadClass();
    // var id =2;
    // var key = '['

    // this.goBack.forEach(e=> {
    //   if(e.id==id)
    //   e.key=key;

    // })
  }

  clearSelection() {
    this.campusId = '';
    this.programDetailId = '';
   
    this.refreshData();
  }


  GetCityData() {
    this.dataEy = [];
    this.repository.GetAttendenceDashboardData2CityWise(moment(this.dated).format('YYYY-MM-DD') + '?' + this.user.userId).then(r => {
      this.dataEy = r as Array<IAttendanceDashboard2CityWise>;
      this.sumDataEX(this.dataEy)

    })
  }


  sumDataEX(list: Array<IAttendanceDashboard2CityWise>) {
    this.DataHigh = [];
    this.DataLow = [];
    for (var i = 0; i < 5; i++) {
      this.DataHigh.push({
        percentage: list[i].percentage,
        cityName: list[i].cityName
      })
    }

    for (var i = list.length; i > list.length - 5; i--) {
      this.DataLow.push({
        percentage: list[i - 1].percentage,
        cityName: list[i - 1].cityName
      })
    }

    // console.log(JSON.stringify(this.DataHigh))
    // console.log(JSON.stringify(this.DataLow))


    this.optionsL = chartPerser.getChartJson(this.DataHigh, 'highCityBar');
    this.optionsM = chartPerser.getChartJson(this.DataLow, 'lowCityBar');
    //  console.log(JSON.stringify(this.options));
    // 
  }

  loadProgramsOfCampus() {
    // this.ddl = [];
    // this.programDDL = [];
    // let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      });
    }

  }

  loadPrograms() {


    this.ProgramDetailRepo.GetAllVM('').then(r => {
      this.ProgramDetailList = r as Array<ISetupProgramDetailsVM>;
    });


  }

  loadCityCampus() {
    // this.campusddl = [];
    // this.cityDDL = [];
    this.campusId = "";
    // let oldObj: ICampusCityVM;

    this.campusRepo.GetCityVM().then(r => {
      this.campusSubCityModel = r;
    });

  }

  getSession() {
    this.sessionList = [];
    this.repositorySession
      .GetFindBy("e => e.StatusId==1")
      .then(
        response => {
          this.sessionList = response as Array<ISetupSession>
          this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
          this.sessionId = this.sessionList[0].sessionId;
        });

  }

  loadClass() {
    this.classRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.classList = r as Array<ISetupClass>
        var classId = this.classList.find(e => e.fullName == 'Part-I').classId;
        this.classId = classId;
      });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("attendanceAttendenceDashboard2" in this.user.claims == true) {
        if (this.user.claims["attendanceAttendenceDashboard2"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["attendanceAttendenceDashboard2"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["attendanceAttendenceDashboard2"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["attendanceAttendenceDashboard2"].indexOf("D") >= 0) {
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

    if (this.viewCities) {
      this.campusIdEx = '00000000-0000-0000-0000-000000000000';
    }
    else {
      this.campusIdEx = this.campusId.toString().replace('"', '');
    }

    if (this.viewPrograms) {
      this.programDetailIdEx = '00000000-0000-0000-0000-000000000000';
    }
    else {
      this.programDetailIdEx = this.programDetailId.toString().replace('"', '');
    }




    if (this.sessionId.length > 0 && this.dated != null && this.classId.length > 0 && this.campusIdEx.length > 0 && this.programDetailIdEx.length > 0) {
      // var dated = (new Date(this.datestring).getFullYear()) + '-' + (new Date(this.datestring).getMonth() + 1) + '-' + (new Date(this.datestring).getDate());
      var key = this.sessionId + '?' + this.campusIdEx + '?' + this.programDetailIdEx + '?' + this.classId + '?' + moment(this.dated).format('YYYY-MM-DD') + '?' + this.user.userId;
      this.repository.GetAttendenceDashboardData2(key).then(r => {
        this.data = r as Array<IAttendenceDashboard2>;

        this.sumDataPie(this.data);


      })
      this.repository.GetAttendenceDashboardData2LastMonth(key).then(r => {
        this.dataEx = r as Array<IAttendanceDashboard2LastMonthsEx>;

        this.options = chartPerser.getChartJson(this.dataEx, 'lastMonthsBar');
      })

    }





  }





  campusId: string = '';
  // sessionId: string = '00000000-0000-0000-0000-000000000000';

  showAllRecord() {
    // this.viewCities != this.viewCities;

  }

  showAllRecordEx() {
    // this.viewPrograms != this.viewPrograms;
    this.refreshData();

  }


  loadStudentList(key) {

    this.Studentdata = [];

    this.repository.GetAttendenceStudentList(key).then(r => {
      this.Studentdata = r as Array<StudntListEx>;

      this.repository.GetDeviceInfo(key).then(r => {
        this.DeviceInfo = r as Array<DeviceInfoEx>;

        this.$modal.show('add-edit-model', { model: this.Studentdata, Status: this.data, DeviceInfo: this.DeviceInfo, IsNewRecord: false });

      })

      // this.$modal.show('add-edit-model', { model: this.Studentdata,Status:this.data, IsNewRecord: false });

    })

  }





  sumDataPie(list: Array<IAttendenceDashboard2>) {
    this.sumData = { scheduled: 0, held: 0, approved: 0, unApproved: 0 };
    list.forEach(e => {
      this.sumData.scheduled += e.scheduled;
      this.sumData.approved += e.approved;
      this.sumData.held += e.held;
      this.sumData.unApproved += e.unApproved;

    })

    this.optionsK = chartPerser.getChartJson(this.sumData, 'attenanceBar');
    this.optionsH = chartPerser.getChartJson(this.sumData, 'heldPie');
    //  console.log(JSON.stringify(this.options));
    // 
  }


  options = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

  optionsH = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

  optionsK = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

  optionsL = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

  optionsM = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

}