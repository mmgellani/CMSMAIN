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
import {
  ITeacherRatingGraph,ITeacherRatingGraphMonth,
 } from "../../../../models";
import { IRootStoreState } from "../../../../../store";

import {
  INotificationRatingGraph,
  ISubjectRatingList,
  ISurvey, ISurveyCampusList, ISurveyCourseList, ISurveyList, ISurveySubCityList, ISurveySubjectList, ITeacherRatingList, ITopTeachers,
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
export class NotificationDash extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;


  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkCity: boolean = false;
  private checkSubj: boolean = false;
  private checkCamp: boolean = false;
  private checkTchr: boolean = false;
  private checkSub: boolean = false;
  private teachermonthgraph : boolean = false;
  private checkSubCity: boolean = false;
  private checkCrs: boolean = false;
  private campus: string = "";
  private city: string = "";
  private course: string = "";
  private currIndex = null;
  private subCity: string = "";
  private fromDate = new Date("2022-08-01");

  dueDate=new Date();
  private toDate = new Date();
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);

  private survey: Array<ISurvey> = [];
  private data: Array<ISurveyList> = [];
  private topData: Array<ITopTeachers> = [];
  private bottomData: Array<ITopTeachers> = [];
  private crsData: Array<ISurveyCourseList> = [];
  private graphData: Array<INotificationRatingGraph> = []
  private tchrData: Array<ITeacherRatingList> = [];
  private subjData: Array<ISurveySubjectList> = [];
  private subData: Array<ISubjectRatingList> = [];
  private subCityData: Array<ISurveySubCityList> = [];
  private campData: Array<ISurveyCampusList> = [];
  private monthlyData: Array<ITeacherRatingGraph> = [];
  private monthlyRating: Array<ITeacherRatingGraphMonth> = [];

  private columns = [
    { key: "cityName", caption: "City" },
    { key: "formCollection", caption: "Form Collection" },
    { key: "feePaid", caption: "Fee Paid" }
  ];

  private breadcrums = new Array();
  private secondBreadcrums = new Array();


  created() {
    this.$watch('fromDate', this.loadTotalSurvey);
    this.$watch('toDate', this.loadTotalSurvey);
    this.$watch('fromDate', this.loadData);
    this.$watch('toDate', this.loadData);
    this.$watch('fromDate', this.loadTopData);
    this.$watch('toDate', this.loadTopData);
    this.$watch('fromDate', this.loadBottomData);
    this.$watch('toDate', this.loadBottomData);
    // this.$watch('fromDate', this.loadTeacherData);
    // this.$watch('toDate', this.loadTeacherData);
  }

  mounted() {
    this.teachermonthgraph=false;
    this.validatePage();
    this.loadTotalSurvey();
    this.loadData();
    this.loadTopData();
    this.loadBottomData();
    // this.loadTeacherData();
  }
  loadTeacherGraph(teacherId, i) {

    this.currIndex = i;
    // alert(teacherId);
    this.graphData = [];
    var key = this.course + "?" + this.subCity + "?" + teacherId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetGraphData(key)
      .then(response => {
        this.graphData = response as Array<INotificationRatingGraph>
        this.options = chartPerser.getChartJson(this.graphData, 'SectionBarRating');
      });

  }

  loadTopData() {
    this.topData = [];
    var key = helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetTopTeachers(key)
      .then(response => this.topData = (response as Array<ITopTeachers>));
  }
  loadBottomData() {
    this.bottomData = [];
    var key = helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetBottomTeachers(key)
      .then(response => this.bottomData = (response as Array<ITopTeachers>));
  }
  loadSubCityData(cityId, name) {
    this.checkCity = false;
    this.checkCamp = false;
    this.checkCrs = false;
    this.checkSubj = false;
    this.checkSubCity = true;
    this.subCityData = [];
    this.city = cityId;
    this.breadcrums = [];
    this.breadcrums[0] = name
    var key = cityId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetSubCityList(key)
      .then(response => this.subCityData = (response as Array<ISurveySubCityList>));
  }

  loadSubData(courseId, name) {
    this.checkCity = false;
    this.checkCamp = false;
    this.checkCrs = false;
    this.checkSubCity = false;
    this.checkSubj = true;
    this.course = courseId
    this.subjData = [];
    this.breadcrums[2] = name
    var key = this.subCity + "?" + courseId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetSubjectList(key)
      .then(response => this.subjData = (response as Array<ISurveySubjectList>));
  }

  loadTotalSurvey() {
    this.teachermonthgraph=false;
    var key = helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetTotalSurvey(key)
      .then(response => this.survey = (response as Array<ISurvey>));
  }

  loadCampusData(subCityId, name) {
    this.checkCity = false;
    this.checkCrs = false;
    this.checkSubj = false;
    this.checkSubCity = false;
    this.checkCamp = true;
    this.campData = [];
    this.breadcrums[1] = name
    var key = this.city + "?" + subCityId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetSurveyCapmusList(key)
      .then(response => this.campData = (response as Array<ISurveyCampusList>));
  }

  loadCrsData(subCityId, name) {
    this.checkCity = false;
    this.checkCamp = false;
    this.checkSubj = false;
    this.checkSubCity = false;
    this.checkCrs = true;
    this.crsData = [];
    // this.campus = campusId;
    this.subCity = subCityId
    this.breadcrums[1] = name
    var key = subCityId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetSurveyCrsList(key)
      .then(response => this.crsData = (response as Array<ISurveyCourseList>));
  }
  MonthlySummary(teacherId) {
    this.monthlyData = [];
    var key = teacherId + "?" + this.user.userId;
    this.repository.GetTeacherGraphSection(key)
      .then(response => {
        this.monthlyData = (response as Array<ITeacherRatingGraph>);
        this.options = chartPerser.getChartJson(this.monthlyData, 'SectionBarRating');
      }); 
  }
  
  MonthlyRating(teacherId) {
    this.monthlyRating = [];
    this.teachermonthgraph=true;
    var key = this.course + "?" + this.subCity + "?" + teacherId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetTeacherGraphMonthEX(key)
      .then(response => {
        this.monthlyRating = (response as Array<ITeacherRatingGraphMonth>);
        this.optionsEx = chartPerser.getChartJson(this.monthlyRating, 'MonthLineRating');
      });


  }
  

  loadData() {
    this.teachermonthgraph=false;
    this.breadcrums = [];
    this.checkCrs = false;
    this.checkCamp = false;
    this.checkSubj = false;
    this.checkSubCity = false;
    this.checkCity = true;
    this.graphData = [];
    this.data = [];
    var key = helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.user.userId;
    this.repository.GetSurveyList(key)
      .then(response =>
        {
          this.data = (response as Array<ISurveyList>)
          
          if(this.data.length==0)
          {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Record Found',
              title: '',
              messageTypeId: PayloadMessageTypes.warning
          });



          }
        }
        );
  }

  loadTeacherData() {
    this.tchrData = [];
    this.checkSub = false;
    this.checkTchr = true;
    var key = helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetTeacherRatingList(key)
    .then(response =>
      {
        this.tchrData = (response as Array<ITeacherRatingList>)
        
        if(this.tchrData.length==0)
        {

          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'No Record Found',
            title: '',
            messageTypeId: PayloadMessageTypes.warning
        });



        }
      }
      );
      // .then(response => 
      //   this.tchrData = (response as Array<ITeacherRatingList>));


  }

  loadSubjectWise(teacherId, name) {
    // alert(teacherId);
    this.checkTchr = false;
    this.checkSub = true;
    this.subData = [];
    var key = teacherId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetSubjectRatingList(key)
      .then(response => this.subData = (response as Array<ISubjectRatingList>));
    this.secondBreadcrums[0] = name
  }

  loadPreviousEx() {
    this.teachermonthgraph=false;
    if (this.checkSub == true) {
      this.checkSub = false;
      this.checkTchr = true;
      this.secondBreadcrums = [];
   
    }
  }

  loadPrevious() {
    this.teachermonthgraph=false;
    if (this.checkSubCity == true) {

      this.graphData = [];
      this.checkSubj = false;
      this.checkCamp = false;
      this.checkCrs = false;
      this.checkSubCity = false;
      this.checkCity = true;
      this.breadcrums.splice(0, 1)
    }
    // if (this.checkCamp == true) {
    //   this.checkCamp = false;
    //   this.graphData = [];
    //   this.checkCrs = false;
    //   this.checkSubj = false;
    //   this.checkSubCity = true;
    //   this.checkCity = false;
    //   this.breadcrums.splice(1, 1)
    // }
    if (this.checkCrs == true) {
      this.checkCamp = false;
      this.graphData = [];
      this.checkCrs = false;
      this.checkSubj = false;
      this.checkSubCity = true;
      this.checkCity = false;
      this.breadcrums.splice(1, 1)
    }
    if (this.checkSubj == true) {
      this.checkSubj = false;
      this.graphData = [];
      this.checkSubCity = false;
      this.checkCamp = false;
      this.checkCrs = true;
      this.checkCity = false;
      this.breadcrums.splice(2, 1)
    }

  }



  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("surveyDashboard" in this.user.claims == true) {
        if (this.user.claims["surveyDashboard"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["surveyDashboard"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["surveyDashboard"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["surveyDashboard"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
  returnBack(i) {
    if (i == 0) {
      this.checkCity = true;
      this.checkCamp = false;
      this.checkCrs = false;
      this.checkSubCity = false;
      this.graphData = [];
      this.checkSubj = false;
      this.breadcrums = []
    }
    else if (i == 1) {
      this.checkCity = false;
      this.checkCamp = false;
      this.graphData = [];
      this.checkSubCity = true;
      this.checkCrs = false;
      this.checkSubj = false;
      this.breadcrums.splice(i, 2)
    }
    // else if (i == 2) {
    //   this.checkSubj = false;
    //   this.checkCity = false;
    //   this.graphData = [];
    //   this.checkSubCity = false;
    //   this.checkCamp = true;
    //   this.checkCrs = false;
    //   this.breadcrums.splice(i, 2)
    // }
    else if (i == 2) {
      this.checkCity = false;
      this.graphData = [];
      this.checkCamp = false;
      this.checkSubCity = false;
      this.checkCrs = true;
      this.checkSubj = false;
      this.breadcrums.splice(i, 1)
    }
  }
  returnSecondBack(i) {
    this.checkSub = false;
    this.checkTchr = true;
    this.secondBreadcrums = []

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