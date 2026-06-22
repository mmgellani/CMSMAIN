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
  IDashboardComment, ISetupCitySubCityLink, ISetupSession,
} from "../../../../models";
import * as helper from "../../../../helper";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import { StoreTypes } from "../../../../../../store";
import { SetupSessionService, SetupSubCityService } from "../../../../service";

@Component({
  name: "notification-overall",
  template: require("./index.html"),
  components: {
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    collapsibleWidget,
  }
})
export class Comments extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;


  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  dueDate = new Date();
  private toDate = new Date();
  sessionId: string = "";
  subCityId: string = "";
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);
  private search: string = '';
  private data: Array<IDashboardComment> = [];
  private citySubCityList: Array<ISetupCitySubCityLink> = [];
  private sessionModel: Array<ISetupSession> = [];
  private csvdata: any = [];
  private columns = [
    { key: "dated", caption: "Date" },
    { key: "subCity", caption: "Sub City" },
    { key: "campusCode", caption: "Campus" },
    { key: "sectionName", caption: "Section" },
    { key: "comment", caption: "Comments" }
  ];

  searchArr = [];
  duplicateArr: any = [];
  filterArr: any = [];

  // filterArr: any = [];


  created() {
    this.$watch('sessionId', this.loadComments);
    this.$watch('sessionId', this.loadCitySubCity);
    this.$watch('subCityId', this.loadCommentsSubcity);
  }

  mounted() {
    this.loadSession();
    this.loadCommentsAll();
  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }

  loadCitySubCity() {
    this.citySubCityList = [];
    this.subCityRepo.GetFindByCitySubCityEx("e=>e.StatusId==1")
      .then(r => {
        this.citySubCityList = r as Array<ISetupCitySubCityLink>;
      });
  }
  loadComments() {
    this.data = [];
    this.searchArr = [];
    var key = this.sessionId + "?" + this.user.userId;
    this.repository.GetComments(key)
      .then(response => {
        this.data = response as Array<IDashboardComment>
        this.duplicateArr = this.data;
        this.filterArr = this.data;

      });
  }

  loadCommentsAll() {
    this.data = [];
    this.duplicateArr = [];
    this.filterArr = [];
    this.searchArr = [];
    var key = this.user.userId;
    this.repository.GetCommentAll(key)
      .then(response => {
        this.data = response as Array<IDashboardComment>
        this.duplicateArr = this.data;
        this.filterArr = this.data;

      });
  }
  loadCommentsSubcity() {
    this.data = [];
    this.duplicateArr = [];
    this.filterArr = [];
    this.searchArr = [];
    var key = this.sessionId + "?" + this.subCityId + "?" + this.user.userId;
    this.repository.GetCommentsSubcity(key)
      .then(response => {
        this.data = response as Array<IDashboardComment>
        this.duplicateArr = this.data;
        this.filterArr = this.data;

      });
  }
  clearSelection(){
    this.sessionId = '',
    this.subCityId = ''
    this.loadCommentsAll();
  }
  querySearch() {
    this.filterArr = [];
    if (this.search) {
      let check = this.searchArr.find(x => x == this.search)
      if (!check) {
        this.searchArr.push(this.search.toLowerCase());
        this.search = '';
      }
      this.search = '';
    }
    this.searchArr.forEach((value) => {
      // this.duplicateArr = this.data.filter(item =>
      //   Object.keys(item).some(k => item[k] != null &&
      //     item[k].toString().toLowerCase()
      //       .includes(value))
      // );
      this.duplicateArr = this.data.filter(e =>
        e.comment.toLowerCase().includes(value)
      )
      console.log(this.duplicateArr)
      this.duplicateArr.forEach(e => {
        let search = this.filterArr.find(x => x.newID == e.newID)
        if (!search) {
          this.filterArr.unshift(({
            ...e,
            comment: e.comment.toLowerCase().replaceAll(value, `<span class="font-weight-bold">${value}</span>`)
          }))
        }
      })
    })
  }

  loadcsv() {
    this.csvdata = [];
    if (this.data.length > 0) {
      this.data.forEach(element => {
        this.csvdata.push({
          Date: helper.formateDate(element.dated),
          SubCity: element.subCity,
          Campus: element.campusCode,
          Section: element.sectionName,
          Comments: element.comment
        });
      });
      helper.exportToCsv('Comments.csv', this.csvdata);
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Data Found',
        title: 'warning',
        messageTypeId: PayloadMessageTypes.warning
      });
    }
  }

  deleteSearch(i) {
    this.searchArr.splice(i, 1);
    this.querySearch();
    if (this.searchArr.length == 0) {
      this.filterArr = this.data;
    }
  }
}