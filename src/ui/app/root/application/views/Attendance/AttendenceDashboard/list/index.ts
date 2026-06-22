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
  ISetupClass
} from "../../../../models";
import {
  AttendanceAttendenceStatusService,
  ExaminationExamDetailService,
  SetupSessionService,
  SetupClassService
} from "../../../../service";


import { StoreTypes } from "../../../../../../store";
import { IAttendenceDashboard, StudntListEx } from "../../../../models/Attendance/attendenceDashboard";
import { checkServerIdentity } from "tls";
import { StudentList } from "../add-edit";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import moment from "moment";
import attendanceApproved from "../../../../../../components/attendance-approved";

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
export class AttendenceDashboard extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: AttendanceAttendenceStatusService;
  private data: Array<IAttendenceDashboard> = [];
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
        // this.classList.sort((a: any, b: any) => b.fullName - a.fullName);
        var classId = this.classList.find(e => e.fullName == 'Part-I').classId;
        this.classId = classId;
        // this.classId = this.classList[0].classId;
      });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("attendanceAttendenceDashboard" in this.user.claims == true) {
        if (this.user.claims["attendanceAttendenceDashboard"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["attendanceAttendenceDashboard"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["attendanceAttendenceDashboard"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["attendanceAttendenceDashboard"].indexOf("D") >= 0) {
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

    this.campusId = '00000000-0000-0000-0000-000000000000';
    // this.sessionId = '00000000-0000-0000-0000-000000000000';


    if (this.sessionId.length > 0 && this.dated != null && this.classId.length > 0) {
      // var dated = (new Date(this.datestring).getFullYear()) + '-' + (new Date(this.datestring).getMonth() + 1) + '-' + (new Date(this.datestring).getDate());
      var key = this.sessionId + '?00000000-0000-0000-0000-000000000000?00000000-0000-0000-0000-000000000000?' + moment(this.dated).format('YYYY-MM-DD') + '?SESSION' + '?' + this.user.userId + '?' + this.classId;
      this.repository.GetAttendenceDashboardData(key).then(r => {
        this.data = r as Array<IAttendenceDashboard>;
        if (this.data.length > 0) {
          this.checkIt = this.data[0].nextModel;
          this.Id++;

          this.goBack.forEach(e => {
            if (e.id == this.Id)
              e.key = key;

          })

          //  alert(JSON.stringify(this.goBack));

          this.data.forEach(element => {
            if (this.classes.indexOf(element.className) < 0) {
              this.classes.push(element.className);
            }

            if (this.records.length == 0) {
              this.records.push({ id: element.id, displayName: element.displayName });
            } else {
              if (this.records.filter(e => e.id === element.id).length == 0) {
                this.records.push({ id: element.id, displayName: element.displayName });
              }
            }
          });
          // console.log(JSON.stringify(this.classes))
          // console.log(JSON.stringify(this.records))
          // console.log(JSON.stringify(this.data))

          this.sumDataPie(this.data);
        }
      })

      this.viewAttendance = true;
    }
  }


  loadStack() {
    // this.Id=0;
    this.classes = [];
    this.records = [];
    this.data = [];


    var key = '';
    this.goBack.forEach(e => {
      if (e.id == this.Id - 1)
        key = e.key;

    })


    this.repository.GetAttendenceDashboardData(key).then(r => {
      this.data = r as Array<IAttendenceDashboard>;
      if (this.data.length > 0) {
        this.checkIt = this.data[0].nextModel;
        this.Id--;





        this.data.forEach(element => {
          if (this.classes.indexOf(element.className) < 0) {
            this.classes.push(element.className);
          }

          if (this.records.length == 0) {
            this.records.push({ id: element.id, displayName: element.displayName });
          } else {
            if (this.records.filter(e => e.id === element.id).length == 0) {
              this.records.push({ id: element.id, displayName: element.displayName });
            }
          }

        });
        this.sumDataPie(this.data);
      }
    })
    // }
  }


  campusId: string = '00000000-0000-0000-0000-000000000000';
  // sessionId: string = '00000000-0000-0000-0000-000000000000';


  loadNextData(id) {
    var record = this.data.find(e => e.id == id);
    // console.log(JSON.stringify(record))
    // console.log(record.nextModel)
    // var dated = (new Date(this.datestring).getFullYear()) + '-' + (new Date(this.datestring).getMonth() + 1) + '-' + (new Date(this.datestring).getDate());

    if (record.nextModel == 'NON') {
      return;
    }

    if (record.nextModel == 'CAMPUS') {
      this.campusId = record.id;
    }
    if (record) {
      var key = this.sessionId + '?' + record.id + '?' + this.campusId + '?' + moment(this.dated).format('YYYY-MM-DD') + '?' + record.nextModel + '?' + this.user.userId + '?' + this.classId;

      this.records = [];
      this.data = [];

      this.repository.GetAttendenceDashboardData(key).then(r => {
        this.data = r as Array<IAttendenceDashboard>;
        if (this.data.length > 0) {
          this.checkIt = this.data[0].nextModel;
          this.displayName = this.data[0].displayName;
          this.Id++;



          this.goBack.forEach(e => {
            if (e.id == this.Id)
              e.key = key;

          })
          //  alert(JSON.stringify(this.goBack));

          this.data.forEach(element => {
            if (this.records.length == 0) {
              this.records.push({ id: element.id, displayName: element.displayName });
            } else {
              if (this.records.filter(e => e.id === element.id).length == 0) {
                this.records.push({ id: element.id, displayName: element.displayName });
              }
            }
          });
          this.sumDataPie(this.data);
        }
      })
    }
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

  getData(id, cls, typ) {
    var record = this.data.find(e => e.id == id && e.className == cls);

    var rec = 0;

    if (record) {
      if (typ == 'S') {
        rec = record.scheduled;
      }

      if (typ == 'H') {
        rec = record.held;
      }

      if (typ == 'A') {
        rec = record.approved;
      }

      if (typ == 'U') {
        rec = record.unApproved;
      }
      if (typ == 'P') {
        rec = record.percentage;
      }

      if (!rec) {
        rec = 0;
      }

      return rec;
    }
  }

  getDataEx(typ) {

    var record = this.data[0];

    var rec = 0;

    if (record) {
      if (typ == 'S') {
        rec = record.scheduled;
      }

      if (typ == 'H') {
        rec = record.held;
      }

      if (typ == 'A') {
        rec = record.approved;
      }

      if (typ == 'U') {
        rec = record.unApproved;
      }
      if (typ == 'P') {
        rec = record.percentage;
      }

      if (!rec) {
        rec = 0;
      }

      return rec;
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

}