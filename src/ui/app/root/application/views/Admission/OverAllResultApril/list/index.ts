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
export class OverAllResultAprilLatest extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private survey: Array<ISurvey2> = [];
  private surveyStatistics: Array<ISurveyStatistics> = [];
  private PossessionData: Array<ISurveyStatistics> = [];
  private CityData: Array<ISurveyStatistics> = [];
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
      .GetSurvey3('3fe19a14-5186-4c20-9232-55ff46b435fd?340a3de9-146d-4555-ae34-e8b5a7364e9d')
      .then((response) => (this.survey = response as Array<ISurvey2>));
  }

  loadPosessionDataSurvey(id) {
    if (this.typeId == "Owned") {

      this.checkposession = true;
      this.checkCity = false;
      this.checkCampus = false;
      this.checkSubCity = false;
      this.PossessionData = [];
      var key = this.Owned + "?" + 'Possession' + "?" + this.user.userId;
      this.repository.GetSurveyCityEX1posession(key).then((r) => {
        this.PossessionData = r as Array<ISurveyStatistics>;

      });
    }
    else if (this.typeId == "Franchise") {

      this.checkposession = true;
      this.checkCity = false;
      this.checkCampus = false;
      this.checkSubCity = false;
      this.PossessionData = [];
      var key = this.Franchise + "?" + 'Possession' + "?" + this.user.userId;
      this.repository.GetSurveyCityEX1posession(key).then((r) => {
        this.PossessionData = r as Array<ISurveyStatistics>;

      });
    }
  }


  loadCityDataSurvey(id) {
    this.checkCity = true;
    this.checkposession = false;
    this.checkCampus = false;
    this.checkSubCity = false;
    this.CityData = [];
    var key = id + "?" + 'city' + "?" + this.user.userId+"?"+'3fe19a14-5186-4c20-9232-55ff46b435fd'+"?"+'340a3de9-146d-4555-ae34-e8b5a7364e9d';
    this.repository.GetSurveyCityApril(key).then((r) => {
      this.CityData = r as Array<ISurveyStatistics>;

    });
  }

  loadSubCityData(id) {
    this.checkCity = false;
    this.checkposession = false;

    this.checkCampus = false;
    this.checkSubCity = true;
    this.subCityData = [];
    this.breadcrums = [];

    var key = id + "?" + 'subcity' + "?" + this.user.userId+"?"+'3fe19a14-5186-4c20-9232-55ff46b435fd'+"?"+'340a3de9-146d-4555-ae34-e8b5a7364e9d';
    this.repository.GetSurveyCityApril(key).then((r) => {
      this.subCityData = r as Array<ISurveyStatistics>;
    });
  }

  loadCampusData(id) {
    this.checkCity = false;
    this.checkposession = false;

    this.checkSubCity = false;
    this.checkCampus = true;
    this.subCampusData = [];
    var key = id + "?" + 'campus' + "?" + this.user.userId+"?"+'3fe19a14-5186-4c20-9232-55ff46b435fd'+"?"+'340a3de9-146d-4555-ae34-e8b5a7364e9d';
    this.repository.GetSurveyCityApril(key).then((r) => {
      this.subCampusData = r as Array<ISurveyStatistics>;
    });
  }

  isTeacherTable(serial: number) {
    return serial == 1 && this.teachCheck === true;
  }

  loadTeachers(course) {
    this.teacherRatingList = [];
    this.subCheck = false;

    this.indexd++;

    if (this.cityId.length == 0 && this.subCityId.length == 0 && this.campusId.length == 0 && this.programId.length == 0 && this.classId.length == 0) {
      var key = course + "?" + this.user.userId;
      this.repository.April2022TeacherRatingswithid(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllListwithid>;

        this.teachCheck = true;
      });
    } else {
      var key =
        `${this.cityId.length > 0 ? this.cityId : this.empty}?
        ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
        ${this.campusId.length > 0 ? this.campusId : this.empty}?
        ${this.programId.length > 0 ? this.programId : this.empty}?
        ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${course}?${this.user.userId}`;

      this.repository.April2022TeacherRatingswithidSpecificCity(key.trim()).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllListwithid>;

        this.teachCheck = true;
      });
    }
  }
  loadSectionData(id) {
    this.SectionData = [];
    var key = id + "?" + this.user.userId;
    this.repository.GetTeacherGraphSectionWisewithtotalApril(key).then((r) => {
      this.SectionData = r as Array<ITeacherRatingGraphEXSectionwithtotal>;
      this.data1 = true;



    });
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
    console.log('Questions',serial);
    return this.questionss[this.questionss.length - 1].o != serial;
  }

  get whichModule() {
    if (this.typeId.length > 0 && this.cityId.length > 0 && this.subCityId.length > 0 && this.campusId.length > 0 && this.programId.length > 0 && this.classId.length > 0) {
      return 'class';
    } else if (this.typeId.length > 0 && this.cityId.length > 0 && this.subCityId.length > 0 && this.campusId.length > 0 && this.programId.length > 0) {
      return 'program';
    } else if (this.typeId.length > 0 && this.cityId.length > 0 && this.subCityId.length > 0 && this.campusId.length > 0) {
      return 'campus';
    } else if (this.typeId.length > 0 && this.cityId.length > 0 && this.subCityId.length > 0) {
      return 'subcity';
    } else if (this.typeId.length > 0 && this.cityId.length > 0) {
      return 'city';
    } else if (this.typeId.length > 0) {
      return 'Possession';
    }
    else {
      ''
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
    this.loadCity();
    this.surveyOverAllResultList = [];
    var key = this.user.userId+"?" +
    "3fe19a14-5186-4c20-9232-55ff46b435fd"+
    "?"+
    "340a3de9-146d-4555-ae34-e8b5a7364e9d";
    this.repository.GetOverAllResultApril(key).then((r) => {
      this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
      this.loadQuestions();
    });
  }

  loadData() {
    if (this.typeId == 'Owned') {
      if (this.whichModule.length > 0) {
        if (this.campusId.length > 0 && this.subCityId.length > 0 && this.cityId.length > 0) {
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

      this.surveyOverAllResultList = [];

      if (this.whichModule.length > 0) {
        var key =
          `${this.Owned}?
      ${this.cityId.length > 0 ? this.cityId : this.empty}?
      ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
      ${this.campusId.length > 0 ? this.campusId : this.empty}?
      ${this.programId.length > 0 ? this.programId : this.empty}?
      ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${this.user.userId}`;

        this.repository.GetOverAllResult1withposissionApril(key).then((r) => {
          this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
          this.loadQuestions();
        });
      } else {
        this.refreshData();
      }
    }
    else if (this.typeId == 'Franchise') {

      if (this.whichModule.length > 0) {
        if (this.campusId.length > 0 && this.subCityId.length > 0 && this.cityId.length > 0) {
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
          this.loadPosessionDataSurvey(this.Franchise);
        }
      }

      this.surveyOverAllResultList = [];

      if (this.whichModule.length > 0) {
        var key =
          `${this.Franchise}?
    ${this.cityId.length > 0 ? this.cityId : this.empty}?
    ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
    ${this.campusId.length > 0 ? this.campusId : this.empty}?
    ${this.programId.length > 0 ? this.programId : this.empty}?
    ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${this.user.userId}`;

        this.repository.GetOverAllResult1withposissionApril(key).then((r) => {
          this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;

          this.loadQuestions();
        });
      }
      else {
        this.refreshData();
      }
    }
    else {

      if (this.whichModule.length > 0) {
        if (this.campusId.length > 0 && this.subCityId.length > 0 && this.cityId.length > 0) {
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
      }

      this.surveyOverAllResultList = [];
      if (this.whichModule.length > 0) {
        var key =
          `${this.cityId.length > 0 ? this.cityId : this.empty}?
    ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
    ${this.campusId.length > 0 ? this.campusId : this.empty}?
    ${this.programId.length > 0 ? this.programId : this.empty}?
    ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${this.user.userId}`;

        this.repository.GetOverAllResult1(key).then((r) => {
          this.surveyOverAllResultList = r as Array<ISurveyOverAllResultApril>;
          this.loadQuestions();
        });
      } else {
        this.refreshData();
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
    if (this.typeId == 'Franchise') {
      this.possessionId = 'dba795a8-e749-4a59-998c-a73648fef2de';
      this.subCityId = '';
      this.campusId = '';
      this.cityRepo.GetAllExpossession(this.possessionId + '?' + this.user.userId).then((r) => {
        this.cityList = r as Array<ISetupCity>;
        this.cityList = this.cityList.sort((one, two) =>
          one.fullName < two.fullName ? -1 : 1
        );
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

    this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
      this.subCityList = r as Array<CitySubCity>;
    });
  }

  cities = [];
  loadCityCampus() {
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
    this.checkCity = false;
    this.checkSubCity = false;
    this.checkCampus = false;

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
