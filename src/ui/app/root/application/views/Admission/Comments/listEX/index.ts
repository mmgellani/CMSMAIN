/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes
 } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IDashboardComment, ISetupCitySubCityLink, ISetupSession,  ISetupCity,  CitySubCity,
} from "../../../../models";
import * as helper from "../../../../helper";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import { StoreTypes } from "../../../../../../store";
import { SetupSessionService, SetupSubCityService,  SetupCityService, } from "../../../../service";

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
  private cityList: Array<ISetupCity> = [];
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  cityId: string = "";
  private subCityList: Array<CitySubCity> = [];
  private csvdata: any = [];
  private fromDate = new Date();
  private columns = [
    { key: "dated", caption: "Date" },
    { key: "subCity", caption: "Sub City" },
    { key: "campusCode", caption: "Campus" },
    { key: "sectionName", caption: "Section" },
     {key:"category",caption:"Category"},
    { key: "comment", caption: "Comments" }
  ];

  searchArr = [];
  duplicateArr: any = [];
  filterArr: any = [];

  // filterArr: any = [];


  created() {
    this.loadCity();
    this.$watch("cityId", this.loadData);
   // this.$watch("cityId", this.loadCitySubCity);
    this.$watch("cityId", this.loadSubCity);
    // this.$watch('subCityId', this.loadCommentsSubcity);
    //this.$watch('sessionId', this.loadComments);
    //this.$watch('sessionId', this.loadCitySubCity);
    //this.$watch('subCityId', this.loadCommentsSubcity);
  }

  mounted() {
    this.filterArr=[];
    this.loadSession();
   // this.loadCommentsAll();
  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }
  loadCity() { 
      this.subCityId = '';
      this.cityRepo.GetAllEx().then((r) => {
        this.cityList = r as Array<ISetupCity>;
        this.cityList = this.cityList.sort((one, two) =>
          one.fullName < two.fullName ? -1 : 1
        );
      });
    
  }    
  loadSubCity() {

    this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
      this.subCityList = r as Array<CitySubCity>;
    });
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
    var key = this.cityId + "?" + this.user.userId;
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
    var key = this.cityId + "?" + this.subCityId + "?" + this.user.userId;
    this.repository.GetCommentsSubcity(key)
      .then(response => {
        this.data = response as Array<IDashboardComment>
        this.duplicateArr = this.data;
        this.filterArr = this.data;

      });
  }

  loadData() {
    this.data = [];
    this.duplicateArr = [];
    this.filterArr = [];
    this.searchArr = [];
    var key = this.cityId + "?" + this.subCityId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetCommentsCitySubCityDateWise(key)
      .then(response => {
        this.data = response as Array<IDashboardComment>
        this.duplicateArr = this.data;
        this.filterArr = this.data;

      });
  }
  clearSelection(){
    this.sessionId = '00000000-0000-0000-0000-000000000000';
    this.cityId='00000000-0000-0000-0000-000000000000';
    this.subCityId = '00000000-0000-0000-0000-000000000000';
    this.toDate = new Date();
    this.fromDate = new Date();

   // this.loadCommentsAll();
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
          Category:element.category,
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