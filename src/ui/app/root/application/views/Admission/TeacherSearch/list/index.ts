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
  ITeacherRatingGraph,
  ITeacherRatingGraphMonth,
  ITeacherSearch, ITeacherSurvey,
} from "../../../../models";
import * as helper from "../../../../helper";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "notification-overall",
  template: require("./index.html"),
  components: {
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    collapsibleWidget,
  }
})
export class TeacherSearch extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;


  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkSurvey: boolean = false;
  dueDate = new Date();
  private toDate = new Date();
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);
  private filterString: string = '';
  private currIndex = null;
  private data: Array<ITeacherSearch> = [];
  private monthlyData: Array<ITeacherRatingGraph> = [];
  private monthlyRating: Array<ITeacherRatingGraphMonth> = [];
  private dataSurvey: Array<ITeacherSurvey> = [];
  // private fromDate = new Date("2022-08-01");
  private fromDate = new Date(this.toDate.getFullYear() - 1, this.toDate.getMonth(), this.toDate.getDate());

  private columns = [
    { key: "dated", caption: "Date" },
    { key: "subCity", caption: "SubCity" },
    { key: "comment", caption: "Comments" }
  ];

  searchArr = [];
  duplicateArr: any = [];
  filterArr: any = [];

  // filterArr: any = [];


  created() {
    this.$watch('fromDate', this.loadTeacherSearch);
    this.$watch('toDate', this.loadTeacherSearch);
  }

  mounted() {

  }
  loadTeacherSearch() {
    if (this.filterString.length > 0) {
      this.checkSurvey = false;
      this.data = [];
      this.repository.GetTeacherSearch(this.filterString + "?" + this.user.userId +"?"+helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
        .then(response => {
          this.data = response as Array<ITeacherSearch>
        });
    }
  }

  MonthlySummary(teacherId) {
    this.monthlyData = [];
    var key = teacherId + "?" + this.user.userId +"?"+helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetTeacherGraphSectionLatest(key)
      .then(response => {
        this.monthlyData = (response as Array<ITeacherRatingGraph>);
        this.options = chartPerser.getChartJson(this.monthlyData, 'SectionBarRating');
      });


  }

  MonthlyRating(teacherId) {
    this.monthlyRating = [];
    var key = teacherId + "?" + this.user.userId;
    this.repository.GetTeacherGraphMonth(key)
      .then(response => {
        this.monthlyRating = (response as Array<ITeacherRatingGraphMonth>);
        this.optionsEx = chartPerser.getChartJson(this.monthlyRating, 'MonthLineRating');
      });


  }
  pushData(item) {
    this.data = [];
    this.data.push(item);
  }
  loadTeacherData(teacherId, i) {
    this.checkSurvey = true;
    this.currIndex = i;
    this.dataSurvey = [];
    this.repository.GetTeacherSurvey(teacherId + "?" + this.user.userId +"?"+helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
      .then(response => {
        this.dataSurvey = response as Array<ITeacherSurvey>
        // const element: HTMLElement = document.getElementById('id');
        // element.scrollIntoView({ behavior: 'smooth' });
        if (this.dataSurvey.length == 0) {

          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'No Record Found',
            title: '',
            messageTypeId: PayloadMessageTypes.warning
          });
        }
      });
  }

  options = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

  optionsEx = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']
    , credits: {
      enabled: false
    }
  };

}