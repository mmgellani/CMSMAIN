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
  ITeacherRatingGraphEX,ITeacherRatingGraphEXSection,
  ITeacherRatingGraphEXSectionwithtotal,
} from "../../../../models";
import * as helper from "../../../../helper";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import collapsibleWidget from '../../../../../../components/collapsibleWidget';
import * as charts from '../../../../../home/admission-role';
import Highcharts from "highcharts";
import { genComponent } from 'vue-highcharts';
import * as chartPerser from '../../../../../home/admission-role/index';
import { StoreTypes } from "../../../../../../store";
import {
  SetupCampusService,
  SetupCityService,
  SetupClassService,
  SetupProgramService,
  SetupSessionService,
  SetupSubCityService,
  ComparisonService,
} from "../../../../service";
import {
  CitySubCity,
  ISetupCity,
} from "../../../../models";


@Component({
  name: "notification-overall",
  template: require("./index.html"),
  components: {
    Highcharts: genComponent('Highcharts', Highcharts),
    'form-collection-p': charts.FormCollectionPieWidget,
    collapsibleWidget,
  }
})
export class TeacherSearchSurveyDec2021 extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private cityList: Array<ISetupCity> = [];
  private subCityList: Array<CitySubCity> = [];
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkSurvey: boolean = false;
  private data1: boolean = false;
  dueDate = new Date();
  private toDate = new Date();
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(this.$store);
  private filterString: string = '';
  private currIndex = null;
  private data: Array<ITeacherSearch> = [];
  private CourseData: Array<ITeacherRatingGraphEX> = [];
  private SectionData: Array<ITeacherRatingGraphEXSectionwithtotal> = [];
  private classId: string = "";
  private subCityId: string = '';
  private TotalSubmitted: number = 0;
     cityId: string = "";
     private DATA : boolean = true;
  private monthlyRating: Array<ITeacherRatingGraphMonth> = [];
  private dataSurvey: Array<ITeacherSurvey> = [];
  private columns = [
    { key: "dated", caption: "Date" },
    { key: "subCity", caption: "SubCity" },
    { key: "comment", caption: "Comments" }
  ];
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  private subCityRepo: SetupSubCityService = new SetupSubCityService(
    this.$store
  );
  model: string;
  searchArr = [];
  duplicateArr: any = [];
  filterArr: any = [];

  // filterArr: any = [];
  created() {
 
    this.$watch("cityId", this.loadSubCity); 
  }

  mounted() {
    this.loadCity();
  }

  loadTeacherSearch() {
    this.data1=false;
    if (this.filterString.length > 0) {
      this.checkSurvey = false;
      this.data = [];
      this.repository.GetTeacherSearch(this.filterString + "?" + this.user.userId)
        .then(response => {
          this.data = response as Array<ITeacherSearch>
        });
    }
  }
  BackSelection(){
  this.DATA=true;
  this.data1=false;

  }
  loadCourseData(id) { 
  
    this.CourseData=[];  
    var key = id + "?" + this.user.userId;
    this.repository.GetTeacherGraphSubject(key).then((r) => {
      this.CourseData = r as Array<ITeacherRatingGraphEX>;
      debugger;
      this.data1=true;
    });
  }
  loadSectionData(id) { 
   
    this.SectionData=[];
    var key = id + "?" + this.user.userId;
    this.repository.GetTeacherGraphSectionWisewithtotal(key).then((r) => {
      this.SectionData = r as Array<ITeacherRatingGraphEXSectionwithtotal>;
      this.data1=true;
         this.SectionData.forEach((data)=>{
this.TotalSubmitted=this.TotalSubmitted+data.total;

         });



      
    });
  }
 
 selectedItem: any = {};
  pushData(item) {
    this.DATA=false;
    this.selectedItem = item;
    this.loadTeacherData(this.selectedItem.teacherId,0);
    this.loadCourseData(this.selectedItem.teacherId);
    this.loadSectionData(this.selectedItem.teacherId);
    //this.data.push(item);
  }
  loadTeacherData(teacherId, i) {
    this.checkSurvey = true;
    this.currIndex = i;
    this.dataSurvey = [];
    this.repository.GetTeacherSurveyEx(teacherId + "?" + this.user.userId)
      .then(response => {
        this.dataSurvey = response as Array<ITeacherSurvey>
        console.log( this.dataSurvey );
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
  index=0;
  loadCity() {
    this.cityRepo.GetAllEx().then((r) => {
    
      this.cityList = r as Array<ISetupCity>;
      this.cityList = this.cityList.sort((one, two) => (one.fullName < two.fullName ? -1 : 1));
      this.index++;
    });
  
  }
  loadData(){
    this.data=[];
    this.DATA=true;
    this.data1=false;
    if (this.cityId.length > 0 && this.subCityId.length > 0) {
      this.checkSurvey = false;
      this.data = [];
      this.model='subcity';
      var key = this.cityId+"?"+this.subCityId+"?"+this.model+"?"+this.filterString ;
      this.repository.GetTeacherSearchwithcity(key+ "?" + this.user.userId)
        .then(response => {
          this.data = response as Array<ITeacherSearch>
        });
    }
   else if (this.cityId.length > 0) {
      this.checkSurvey = false;
      this.data = [];
      this.model='city';
      this.subCityId='00000000-0000-0000-0000-000000000000'
      var key = this.cityId+"?"+this.subCityId+"?"+this.model+"?"+this.filterString;
      this.repository.GetTeacherSearchwithcity(key+ "?" + this.user.userId)
        .then(response => {
          this.data = response as Array<ITeacherSearch>
        });
    }
    
     else {}

  }
  loadSubCity() {
    this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
      this.subCityList = r as Array<CitySubCity>;
    }); 
  }

  clearSelection() {
    this.checkSurvey=false;
    this.dataSurvey=[];
    this.SectionData=[];
    this.CourseData=[];
    this.data=[];
    this.selectedItem = {};
    this.DATA=false;
    this.data1=false;
    this.subCityId = '00000000-0000-0000-0000-000000000000';
    this.cityId = '00000000-0000-0000-0000-000000000000';
    this.filterString='';

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