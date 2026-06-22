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
  CitySubCity,
  ICampusCityVM,
  IDashboardComment,
  ISetupCampusProgramVM,
  ISetupCity,
  ISetupCitySubCityLink,
  ISurvey2,
  ISetupClass,
  ISetupProgram,
  ISetupSession,
  ISetupSubCity,
  ISurveyOverAllResultApril,
  ITeacherRatingList,
  ITeacherRatingOverAllList,
  IGeneral,
  IComparisonData,
  ISurveyStatistics,
  ITeacherRatingGraphEXSection,
  ITeacherRatingOverAllListwithid,
  ITeacherRatingGraphEXSectionwithtotal,
  IBuildingData,
  ITotalSurveyJanuary2024,
  Survey26,


} from "../../../../models";
import * as helper from "../../../../helper";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import collapsibleWidget from "../../../../../../components/collapsibleWidget";
import * as charts from "../../../../../home/admission-role";
import Highcharts from "highcharts";
import { genComponent } from "vue-highcharts";
import * as chartPerser from "../../../../../home/admission-role/index";
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
import { IVWCampusBaseProgram } from "../../../../models/Setup/CampusBaseProgram";
import { orderBy } from "lodash";
import { systemSetting } from "../../../../../../admin/layout/navigation/svgPath";

@Component({
  name: "notification-overall",
  template: require("./index.html"),
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    "form-collection-p": charts.FormCollectionPieWidget,
    collapsibleWidget,
  },
})
export class OverAllResultJanuary26 extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private survey: Array<ITotalSurveyJanuary2024> = [];
  private surveyStatistics: Array<ISurveyStatistics> = [];
  private PossessionData: Array<ISurveyStatistics> = [];
  private CityData: Array<ISurveyStatistics> = [];
  private building: Array<IBuildingData> = [];
  private subCityData: Array<ISurveyStatistics> = [];
  private subCampusData: Array<ISurveyStatistics> = [];
  private typeChk: boolean = false;
  private finalData: Array<IComparisonData> = [];
  private typeId: string = '';
  private campusTypeList: Array<IGeneral> = [];
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private subCheck: boolean = false;
  private teachCheck: boolean = false;
  private checkposession: boolean = false;
  buildingname: string = "";
  private possessionId = "00000000-0000-0000-0000-000000000000";
  private Owned = 'cb195478-04c1-4f2d-b2ba-f7088c57ea88';
  private Franchise = 'dba795a8-e749-4a59-998c-a73648fef2de';
  private SectionData: Array<ITeacherRatingGraphEXSectionwithtotal> = [];
  private data1: boolean = false;
  dueDate = new Date();
  private toDate = new Date();
  sessionId: string = "";
  cityId: string = "";
  campusId: string = "";
  programId: string = "";
  classId: string = "";
  subCityId: string = "";
  campusProgramId: string = "";
  selectedCourse: string = "";
  empty = "00000000-0000-0000-0000-000000000000";
  private sectionwise: boolean = false;
  private teacherwise: boolean = false;

  indexd: number = 1;

  guage: number = 0;
  guage1: number = 0;
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(
    this.$store
  );
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  private data: Array<ISetupSubCity> = [];
  private surveyOverAllResultList: Array<ISurveyOverAllResultApril> = [];
  private teacherRatingList: Array<ITeacherRatingOverAllListwithid> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  private subCityRepo: SetupSubCityService = new SetupSubCityService(
    this.$store
  );
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private programList: Array<IVWCampusBaseProgram> = [];
  private programListEx: Array<ISetupProgram> = [];
  classList: Array<ISetupClass> = [];
  private classRepository: SetupClassService = new SetupClassService(
    this.$store
  );
  private programSRepo: SetupProgramService = new SetupProgramService(
    this.$store
  );
  private csvdata: any = [];
  private csvdata2: any = [];
  private totalsur: boolean = false;
  private checkCity: boolean = false;
  private checkSubCity: boolean = false;
  private checkCampus: boolean = false;
  private: boolean = false;
  private showloader: boolean = false;
  private showloader1: boolean = false;
  private breadcrums = [];
  private columns = [
    { key: "dated", caption: "Date" },
    { key: "subCity", caption: "Sub City" },
    { key: "campusCode", caption: "Campus" },
    { key: "sectionName", caption: "Section" },
    { key: "comment", caption: "Comments" },
  ];

  searchArr = [];
  duplicateArr: any = [];
  filterArr: any = [];

  questions = [];

  created() {
    this.$store.dispatch(StoreTypes.loadingState, true)
    this.loadCity();
    this.getData('type');
    this.loadTotalSurvey();
    //this.loadCity();
    this.$watch("typeId", this.loadCity);
    this.$watch("cityId", this.loadSubCity);
    this.$watch("subCityId", this.loadCityCampus);
    this.$watch("campusId", this.loadPrograms);
    this.$watch("programId", this.loadClass);
    this.totalsur = true;

  }

  mounted() {
    this.refreshData();
  }
  loadTotalSurvey() {

    this.survey = [];
    this.repository
.TotalSurveyExJan26('733ff453-8e60-427a-af53-ac149067403d?6ad4b623-c763-4202-a9bf-94fd63bc1933?c3bea047-ff28-4dbe-a9ac-9b890990d69d')
.then((response) => (this.survey = response as Array<Survey26>));

  }

  loadPosessionDataSurvey(id) {
    if (this.typeId == "Owned") {

      this.checkposession = true;
      this.checkCity = false;
      this.checkCampus = false;
      this.checkSubCity = false;
      this.PossessionData = [];
      var key = this.Owned + "?" + 'Possession' + "?" + this.user.userId;
      this.repository.SurveyStatisticsEx1LatestJanuary26(key).then((r) => {
        if (r) {
          this.PossessionData = r as Array<ISurveyStatistics>;
          console.log(this.PossessionData, '>>>>>>');

          if (this.PossessionData) {
            //

          }

        }

      });
    }
    else if (this.typeId == "Franchise") {


      this.checkposession = true;
      this.checkCity = false;
      this.checkCampus = false;
      this.checkSubCity = false;
      this.PossessionData = [];

      var key = this.Franchise + "?" + 'Possession' + "?" + this.user.userId;
      this.repository.SurveyStatisticsEx1LatestJanuary26(key).then((r) => {
        if (r) {

          this.PossessionData = r as Array<ISurveyStatistics>;
          console.log(this.PossessionData, '>>>>>>');
          if (this.PossessionData) {


          }

        }

      });
    }
  }


  loadCityDataSurvey(id) {
    this.checkCity = true;

    this.checkposession = false;
    this.checkCampus = false;
    this.checkSubCity = false;
    this.CityData = [];
    if (this.buildingname.length > 0 && this.buildingname != '' && this.building[0].isBuilding == true) {
      this.showloader = true;
      var key = this.subCityId + "?" + 'building' + "?" + this.user.userId + "?" + '733ff453-8e60-427a-af53-ac149067403d'+'?'+'6ad4b623-c763-4202-a9bf-94fd63bc1933'+'?'+ 'c3bea047-ff28-4dbe-a9ac-9b890990d69d' + "?" + this.buildingname;
      this.repository.GetSurveyCityJanuary26WithBuilding(key).then((r) => {
        this.subCampusData = r as Array<ISurveyStatistics>;
      });
    }
    else {
      this.showloader = true;

      var key = id + "?" + 'city' + "?" + this.user.userId + "?" + '733ff453-8e60-427a-af53-ac149067403d'+'?'+'6ad4b623-c763-4202-a9bf-94fd63bc1933'+'?'+ 'c3bea047-ff28-4dbe-a9ac-9b890990d69d';
      this.repository.GetSurveyCityJanuary26(key).then((r) => {
        this.CityData = r as Array<ISurveyStatistics>;
      });
    }
  }


  loadSubCityData(id) {

    this.checkCity = false;
    this.checkposession = false;

    this.checkCampus = false;
    this.checkSubCity = true;
    this.subCityData = [];
    this.breadcrums = [];
    if (this.buildingname.length > 0 && this.buildingname != '' && this.building[0].isBuilding == true) {
      this.showloader = true;
      var key = this.subCityId + "?" + 'building' + "?" + this.user.userId + "?" + '733ff453-8e60-427a-af53-ac149067403d'+'?'+'6ad4b623-c763-4202-a9bf-94fd63bc1933'+'?'+ 'c3bea047-ff28-4dbe-a9ac-9b890990d69d' + "?" + this.buildingname;
      this.repository.GetSurveyCityJanuary26WithBuilding(key).then((r) => {
        this.subCampusData = r as Array<ISurveyStatistics>;
      });
      this.checkCampus = true;
      this.showloader = false;

    }
    else {
      this.showloader = true;
      var key = id + "?" + 'subcity' + "?" + this.user.userId + "?" + '733ff453-8e60-427a-af53-ac149067403d'+'?'+'6ad4b623-c763-4202-a9bf-94fd63bc1933'+'?'+ 'c3bea047-ff28-4dbe-a9ac-9b890990d69d';
      this.repository.GetSurveyCityJanuary26(key).then((r) => {
        this.subCityData = r as Array<ISurveyStatistics>;
        this.showloader = false;
      });
    }

    this.loadbuildingdata();
  }

  loadCampusData(id) {

    this.checkCity = false;
    this.checkposession = false;
    this.checkSubCity = false;
    this.checkCampus = true;
    this.subCampusData = [];

  }
  loadbuildingdata() {
    if (this.subCityId.length > 0) {

      this.repository.BuildingSectionData26(this.subCityId).then((r) => {
        this.building = r as Array<IBuildingData>;
      });
    }

  }
  isTeacherTable(serial: number) {
    return serial == 1 && this.teachCheck === true;
  }

  loadTeachers(course) {

    this.teacherRatingList = [];
    this.subCheck = false;
    this.selectedCourse = course;
    this.indexd++;

    if (this.cityId.length == 0 && this.subCityId.length == 0) {
      var key = course + "?" + this.user.userId;
      this.repository.TeacherRatingswithidJanuary2026(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllListwithid>;

        this.teachCheck = true;

      });
    } else {
      if (this.buildingname.length > 0) {
        var key =
          `${this.cityId.length > 0 ? this.cityId : this.empty}?
  ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
  ${this.campusId.length > 0 ? this.campusId : this.empty}?
  ${this.programId.length > 0 ? this.programId : this.empty}?
  ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${course}?${this.user.userId}?${this.buildingname}`;

        this.repository.Jan26TeacherRatingswithidSpecificCityWithBuilding(key.trim()).then((r) => {
          this.teacherRatingList = r as Array<ITeacherRatingOverAllListwithid>;

          this.teachCheck = true;

        });
      }
      else {
        var key =
          `${this.cityId.length > 0 ? this.cityId : this.empty}?
        ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
        ${this.campusId.length > 0 ? this.campusId : this.empty}?
        ${this.programId.length > 0 ? this.programId : this.empty}?
        ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${course}?${this.user.userId}`;

        this.repository.Januray26TeacherRatingswithidSpecificCity(key.trim()).then((r) => {
          this.teacherRatingList = r as Array<ITeacherRatingOverAllListwithid>;

          this.teachCheck = true;

        });
      }
    }
  }
  loadSectionData(id) {
    this.SectionData = [];
    if (this.cityId.length == 0 && this.subCityId.length == 0) {
      var key = id + "?" + this.user.userId + "?" + this.selectedCourse;
      this.repository.GetTeacherGraphSectionWisewithtotalJanuary26Ex(key).then((r) => {
        this.SectionData = r as Array<ITeacherRatingGraphEXSectionwithtotal>;
        this.data1 = true;


      });
    }
    else {
      var key =
        `${this.cityId.length > 0 ? this.cityId : this.empty}?
    ${this.subCityId.length > 0 ? this.subCityId : this.empty}?${id}?${this.user.userId}?${this.selectedCourse}`;
      this.repository.GetTeacherGraphSectionWisewithtotalJanuary26EXx(key).then((r) => {
        this.SectionData = r as Array<ITeacherRatingGraphEXSectionwithtotal>;
        this.data1 = true;

      });
    }
  }

  loadPrevious() {
    if (this.teachCheck == true) {
      this.subCheck = true;
      this.teachCheck = false;
      this.data1 = false;
    }
  }

  loadQuestions() {
    this.indexd++;
    this.subCheck = true;
    this.teachCheck = false;
    this.questions = [];

    this.surveyOverAllResultList.forEach(element => {
      if (this.questions.filter(e => e.q == element.question).length <= 0) {
        this.questions.push({ o: element.order, q: element.question });
      }
    });

    var lastQuestion = this.filteredData(this.questions[this.questions.length - 1].q)[0];

    var rating = lastQuestion.rating;
    var overAllRating = lastQuestion.overAllRating;

    if (rating + 90 < 0) {
      this.guage = 0;
    } else if (rating + 90 > 180) {
      this.guage = 180;
    } else {
      this.guage = rating + 90;
    }

    this.guage1 = 90 + ((overAllRating * 180) / 100);
  }

  get questionss() {
    if (this.questions.length > 0) {
      return this.questions.sort((a, b) => a.o > b.o && 1 || -1);
    }
  }

  isLastQuestion(serial: number) {
    console.log('Questions', serial);
    return this.questionss[this.questionss.length - 1].o != serial;
  }

  get whichModule() {

    if (this.building != null && this.buildingname != '' && this.cityId.length > 0 && this.subCityId.length > 0) {
      return 'building';
    }
    if (this.cityId.length > 0 && this.subCityId.length > 0) {
      return 'subcity';
    } else if (this.cityId.length > 0) {
      return 'city';
    } else if (this.typeId.length > 0) {
      return 'Possession';
    }
    else {
      return this.typeId;
    }
  }

  isPercentage(q: string) {


    if (q.indexOf("5") > 0 || q.indexOf("10") > 0) {
      return true;
    } else {
      return false;
    }
  }

  refreshData() {
    this.showloader = true;
    this.surveyOverAllResultList = [];
    var key = this.user.userId + "?" +
      '733ff453-8e60-427a-af53-ac149067403d'+"?"+'6ad4b623-c763-4202-a9bf-94fd63bc1933'+"?"+'c3bea047-ff28-4dbe-a9ac-9b890990d69d';
    this.repository.GetOverAllResultJanuary26(key).then((r) => {
      this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
      this.loadQuestions();
      this.loadCity();
      this.showloader = false;
    });

  }
  loadsummery() {
    if (this.whichModule.length > 0) {
      if (this.campusId.length > 0 && this.subCityId.length > 0 && this.buildingname != "") {
        this.totalsur = false;
        this.loadCampusData(this.campusId);
      }
      else if (this.subCityId.length > 0 && this.cityId.length > 0) {
        this.totalsur = false;
        this.loadSubCityData(this.subCityId);
      }
      else if (this.cityId.length > 0) {
        this.totalsur = false;
        this.loadCityDataSurvey(this.cityId);
      }
      else if (this.typeId.length > 0) {
        this.totalsur = false;
        this.loadPosessionDataSurvey(this.Owned);
      }
    }
  }
  loadData() {

    if (this.typeId == 'Owned') {
      this.surveyOverAllResultList = [];

      if (this.whichModule.length > 0) {
        var key =
          `${this.Owned}?${this.cityId != "" ? this.cityId : this.empty}?${this.subCityId != "" ? this.subCityId : this.empty}?${this.campusId != "" ? this.campusId : this.empty}?${this.whichModule}?${this.user.userId}`;


        if (this.buildingname.length > 0 && this.buildingname != '' && this.building[0].isBuilding == true) {

          var key =
            `${this.Owned}?${this.cityId != "" ? this.cityId : this.empty}?${this.subCityId != "" ? this.subCityId : this.empty}?${this.campusId != "" ? this.campusId : this.empty}?${this.whichModule}?${this.user.userId}?${this.buildingname}`;

          if (this.buildingname.length > 0 && this.buildingname != '' && this.building[0].isBuilding == true) {
            this.showloader = true;
            this.checkCampus = true;
            this.showloader = true;
            var key = `${this.cityId != "" ? this.cityId : this.empty}?${this.subCityId != "" ? this.subCityId : this.empty}?${this.campusId != "" ? this.campusId : this.empty}?${this.programId != "" ? this.programId : this.empty}?${this.classId != "" ? this.classId : this.empty}?building?${this.user.userId}?${this.buildingname}`;
            this.repository.GetJanuary26SurveyOverAllWithBuildingCopy(key.trim()).then((r) => {
              this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
              this.loadQuestions();
              this.loadsummery();
            });
          }
          else {
            this.showloader = true;
            this.repository.GetOverAllResult1withposissionJanuary2023(key).then((r) => {
              this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;

              this.loadQuestions();
              this.loadsummery();

            });
          }
          this.showloader = false;
        }

        else {


          this.showloader = true;
          this.repository.GetOverAllResult1withposissionJanuary26(key).then(r => {
            if (r) {


              this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;


              this.loadQuestions();
              this.loadsummery();
              this.showloader = false;
            }



          });
        }

      } else {
        this.refreshData();
      }
    }
    else if (this.typeId == 'Franchise') {

      this.surveyOverAllResultList = [];

      if (this.whichModule.length > 0) {
        var key =
           `${this.Franchise}?${this.cityId || this.empty}?${this.subCityId || this.empty}?${this.campusId || this.empty}?${this.whichModule}?${this.user.userId}`;
        if (this.buildingname.length > 0 && this.buildingname != '' && this.building[0].isBuilding == true) {

          var key = `${this.Owned}?${this.cityId != "" ? this.cityId : this.empty}?${this.subCityId != "" ? this.subCityId : this.empty}?${this.campusId != "" ? this.campusId : this.empty}?${this.whichModule}?${this.user.userId}?${this.buildingname}`;

          if (this.buildingname.length > 0 && this.buildingname != '') {

            this.showloader = true;
            var key = `${this.cityId != "" ? this.cityId : this.empty}?${this.subCityId != "" ? this.subCityId : this.empty}?${this.campusId != "" ? this.campusId : this.empty}?${this.programId != "" ? this.programId : this.empty}?${this.classId != "" ? this.classId : this.empty}?building?${this.user.userId}?${this.buildingname}`;
            this.repository.GetJanuary26SurveyOverAllWithBuildingCopy(key.trim()).then((r) => {
              this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
              this.loadQuestions();
              this.loadsummery();
            });
            this.showloader = false;
          }
          else {
            this.showloader = true;
            this.repository.GetOverAllResult1withposissionJanuary26(key).then((r) => {
              this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;

              this.loadQuestions();
              this.loadsummery();
              this.showloader = false;
            });
          }
        }
        else {
          this.showloader = true;
          this.repository.GetOverAllResult1withposissionJanuary26(key).then(r => {
            if (r) {


              this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;

              this.loadQuestions();
              this.loadsummery();
              this.showloader = false;
            }


          });
        }
      }
      else {
        this.refreshData();
      }
    }
    else {

      this.surveyOverAllResultList = [];

      if (this.buildingname.length > 0 && this.buildingname != '') {
       
      var key = `${this.cityId != "" ? this.cityId : this.empty}?${this.subCityId != "" ? this.subCityId : this.empty}?${this.campusId != "" ? this.campusId : this.empty}?${this.programId != "" ? this.programId : this.empty}?${this.classId != "" ? this.classId : this.empty}?${this.whichModule}?${this.user.userId}?${this.buildingname}`;
        this.showloader = true;

        this.repository.GetJanuary26SurveyOverAllWithBuildingCopy(key.trim()).then((r) => {
          if (r) {
            this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
            this.loadQuestions();
            this.loadsummery();
            this.showloader = false;
          }

        });
      }
      else {
        var key = `${this.cityId != "" ? this.cityId : this.empty}?${this.subCityId != "" ? this.subCityId : this.empty}?${this.campusId != "" ? this.campusId : this.empty}?${this.whichModule}?${this.user.userId}`;
        this.showloader = true;
        this.repository.GetOverAllResult1January26(key.trim()).then((r) => {
          if (r) {
            this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
            this.loadQuestions();
            this.loadsummery();
            this.showloader = false;
          }

        });

      }

    }
  }


  showldShowTable(question: string) {
    var isTable: boolean = false;
    this.surveyOverAllResultList.filter(e => e.question == question).forEach(e => {
      if (e.course.length > 2) {
        isTable = true;
      }
    });

    return isTable;
  }

  filteredData(question: string) {
    var deepCopy = [];
    this.surveyOverAllResultList.filter(e => e.question == question).forEach(ex => {
      if (deepCopy.filter(x => x.course === ex.course).length == 0) {
        if (this.showldShowTable(question)) {
          if (ex.course != '') {
            if (ex.course.indexOf('randomItem') < 0) {
              deepCopy.push({ course: ex.course, rating: ex.rating, overAllRating: ex.overAllRating, order: ex.order, total: ex.total });
            }
          }
        } else {
          deepCopy.push({ course: ex.course, rating: ex.rating, overAllRating: ex.overAllRating, order: ex.order, total: ex.total });
        }
      }
    });

    return deepCopy;
  }

  loadCity() {
    this.buildingname = '';
    if (this.typeId == 'Franchise') {
      this.possessionId = 'dba795a8-e749-4a59-998c-a73648fef2de';
      this.subCityId = '';
      this.campusId = '';
      this.cityRepo.GetAllExpossession(this.possessionId + '?' + this.user.userId).then((r) => {
        this.cityList = r as Array<ISetupCity>;
        this.cityList = this.cityList.sort((one, two) =>
          one.fullName < two.fullName ? -1 : 1
        );
        if (this.cityList.length > 0) {
          this.cityList = this.cityList.filter(item => item.fullName != 'STEP').filter(item => item.fullName != 'Test City');
        }
      });
    }
    else if (this.typeId == 'Owned') {
      this.possessionId = 'cb195478-04c1-4f2d-b2ba-f7088c57ea88';
      this.subCityId = '';
      this.campusId = '';
      this.cityRepo.GetAllExpossession(this.possessionId + '?' + this.user.userId).then((r) => {
        this.cityList = r as Array<ISetupCity>;
        this.cityList = this.cityList.sort((one, two) =>
          one.fullName < two.fullName ? -1 : 1
        );
        if (this.cityList.length > 0) {
          this.cityList = this.cityList.filter(item => item.fullName != 'STEP').filter(item => item.fullName != 'Test City');
        }
      });

    }
    else {
      this.subCityId = '';
      this.campusId = '';
      this.cityRepo.GetAllEx().then((r) => {
        this.cityList = r as Array<ISetupCity>;
        this.cityList = this.cityList.sort((one, two) =>
          one.fullName < two.fullName ? -1 : 1
        );
        if (this.cityList.length > 0) {
          this.cityList = this.cityList.filter(item => item.fullName != 'STEP').filter(item => item.fullName != 'Test City');
        }
      });
    }


  }

  loadcsv() {
    this.csvdata = [];
    if (this.surveyOverAllResultList.length > 0) {
      this.surveyOverAllResultList.forEach((element) => {
        this.csvdata.push({
          Questions: element.question,
          Course: element.course,
          Rating: element.rating,
          OverAllRating: element.overAllRating,
        });
      });
      helper.exportToCsv("OverAll.csv", this.csvdata);
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "No Data Found",
        title: "warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
    }
  }
  loadcsv2() {
    this.csvdata2 = [];
    if (this.teacherRatingList.length > 0) {
      this.teacherRatingList.forEach((element) => {
        this.csvdata2.push({
          Teacher: element.teacherName,
          Rating: element.rating,
        });
      });
      helper.exportToCsv("Teacher-List.csv", this.csvdata2);
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "No Data Found",
        title: "warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
    }
  }
  loadSubCity() {
    if (this.cityId.length > 0) {
      this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
        this.subCityList = r as Array<CitySubCity>;
      });
    }
  }

  cities = [];
  loadCityCampus() {
    this.loadbuildingdata();
    this.campusRepo.GetCityVM().then((r) => {
      this.campusCityList = r as Array<ICampusCityVM>;
      this.campusCityList = this.campusCityList.filter(
        (e) => e.subCityId == this.subCityId
      );
      this.cities = [];
      this.campusCityList.forEach((element) => {
        if (this.cities.indexOf(element.cityName) == -1) {
          this.cities.push(element.cityName);
        }
      });
    });

  }

  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
      this.programSRepo
        .ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '"')
        .then((r) => {
          this.programList = r as Array<IVWCampusBaseProgram>;
        });
    }
  }

  loadPrograms() {
    this.programSRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.programListEx = r as Array<ISetupProgram>;
      this.programListEx = this.programListEx.filter((e) =>
        e.fullName.indexOf("STEP")
      );
    });
    this.loadbuildingdata();
  }

  loadClass() {
    this.classRepository.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }
  private repo: ComparisonService = new ComparisonService(this.$store);
  getData(module: string, param: string = "0") {
    this.repo.ParamsDashboard(`${module}:${param}`).then((response) => {
      switch (module) {
        case "type":
          this.campusTypeList = [];
          this.campusTypeList = response as Array<IGeneral>;

          this.campusTypeList = this.campusTypeList.filter(item => item.fullName !== 'Franchise CO');
          break;

        default:
          console.error(JSON.stringify(response));
      }
    });
  }
  clearSelection() {
    this.$store.dispatch(StoreTypes.loadingState, true)
    this.subCityId = '';
    this.typeChk = false;
    this.campusId = '';
    this.programId = '';
    this.classId = '';
    this.totalsur = true;
    this.checkposession = false;
    this.checkCity = false;
    this.checkSubCity = false;
    this.checkCampus = false;
    this.buildingname = '';
    this.cityList = [];
    this.cityId = '';
    this.typeId = '';



    this.refreshData();

  }

  optionsEx = `{
    "chart":{
       "type":"column"
    },
    "title":{
       "text":""
    },
    "xAxis":{
       "categories":[@Session]
    },
    "yAxis":{
       "min":0,
       "title":{
          "text":"No. of Admissions"
       },
       "stackLabels":{
          "enabled":true,
          "style":{
             "fontWeight":"bold",
             "color": "gray"
          }
       }
    },
    "legend":{
       "align":"center",
       "verticalAlign":"bottom",
       "y":25,
       "floating":true,
       "backgroundColor": "white",
       "borderColor":"#CCC",
       "borderWidth":0,
       "shadow":false
    },
    "tooltip":{
        "useHTML": "true",
       "headerFormat":"<b>{point.x}</b><br/>",
       "pointFormat":"{series.name}:<span>{point.y:.0f}</span><br/>Total: {point.stackTotal}"
    },
    "plotOptions":{
       "column":{
          "stacking":"normal",
          "dataLabels":{
             "enabled":true
          }
       }
    },
    "series":[
       {
          "name":"Owned",
          "data":[@Morning],
          "color": "#38A3A5"
       },
       {
          "name":"Franchise",
          "data":[@Afternoon],
          "color": "#22577A"
       }
    ]
 }`;

}
