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
  ISurveyOverAllResult,
  ITeacherRatingList,
  ITeacherRatingOverAllList,
  IGeneral,
  IComparisonData,
  ISurveyStatistics,
  ISurveyOverAllResult1,
  ITeacherRatingOverAllList1,
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
export class SurveyDashBoardComparision extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private survey: Array<ISurvey2> = [];
  private survey1: Array<ISurvey2> = [];
  private surveyStatistics: Array<ISurveyStatistics> = [];
  private CityData: Array<ISurveyStatistics> = [];
  private CityData1: Array<ISurveyStatistics> = [];
  private subCityData: Array<ISurveyStatistics> = [];
  private subCityData1: Array<ISurveyStatistics> = [];
  private subCampusData: Array<ISurveyStatistics> = [];
  private subCampusData1: Array<ISurveyStatistics> = [];
  private typeChk: boolean = false;
  private finalData: Array<IComparisonData> = [];
  private typeId: string = '';
  private campusTypeList: Array<IGeneral> = [];
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private subCheck: boolean = false;
  private subCheckpre: boolean = false;
  private teachCheck: boolean = false;
  private teachCheckpre: boolean = false;
  private totalsurvey:boolean = true;
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

  indexd: number = 1;

  guage: number = 0;
  guage1: number = 0;
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(
    this.$store
  );
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  private data: Array<ISetupSubCity> = [];
  private surveyOverAllResultList: Array<ISurveyOverAllResult> = [];
  private surveyOverAllResultListpre: Array<ISurveyOverAllResult1> = [];
  private teacherRatingList: Array<ITeacherRatingOverAllList> = [];
  private teacherRatingListpre: Array<ITeacherRatingOverAllList1> = [];
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
  private totalsur: boolean = true;
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
  questionspre = [];
  created() {
    this.$store.dispatch(StoreTypes.loadingState, true)

    this.loadCity();
    this.$watch("cityId", this.loadSubCity);
    this.$watch("subCityId", this.loadCityCampus);
    this.$watch("campusId", this.loadPrograms);
    this.$watch("programId", this.loadClass);
    this.totalsur = true;
    this.loadTotalSurvey();
    this.loadTotalSurvey1();
  }

  mounted() {
    this.refreshData();
    this.refreshDatapre();

  }
  loadTotalSurvey() {
    this.survey = [];
    this.repository
      .GetSurvey3('26ab291f-414b-4d76-b6ac-764a89f8680a?5db2389f-a049-4a39-853b-ee04482c9a97')
      .then((response) => (this.survey = response as Array<ISurvey2>));
  }
  loadTotalSurvey1() {
    this.survey1 = [];
    this.repository
      .GetSurvey3pree('4b910f5f-931b-4a96-bf51-1f16fc2498a4?3b29866b-cedf-4422-9fc6-7ba2144c7d55')
      .then((response) => (this.survey1 = response as Array<ISurvey2>));
  }
  loadCityDataSurvey(id) {
    this.totalsur=false;
    this.checkCity = true;
    this.checkCampus = false;
    this.checkSubCity = false;
    this.totalsurvey=false;
    this.CityData = [];
    var key = id + "?" + 'city' + "?" + this.user.userId;
    this.repository.GetSurveyCityEX1(key).then((r) => {
      this.CityData = r as Array<ISurveyStatistics>;


    });
  }
  loadCityDataSurvey1(id) {
    this.totalsur=false;

    this.checkCity = true;
    this.totalsurvey=false;
    this.checkCampus = false;
    this.checkSubCity = false;
    this.CityData1 = [];
    var key = id + "?" + 'city' + "?" + this.user.userId;
    //var key ='fbadc9ec-9797-4fca-ad14-9ed39882be77?city?11387';
    this.repository.GetSurveyCityEX2(key).then((r) => {
      this.CityData1 = r as Array<ISurveyStatistics>;

    });
  }
  loadSubCityData(id) {
    this.totalsurvey=false;
    this.checkCity = false;
    this.checkCampus = false;
    this.checkSubCity = true;
    this.subCityData = [];
    this.breadcrums = [];

    var key = id + "?" + 'subcity' + "?" + this.user.userId;
    this.repository.GetSurveyCityEX1(key).then((r) => {
      this.subCityData = r as Array<ISurveyStatistics>;
    });
  }
  loadSubCityData1(id) {
    this.totalsurvey=false;
    this.checkCity = false;
    this.checkCampus = false;
    this.checkSubCity = true;
    this.subCityData1 = [];
    this.breadcrums = [];

    var key = id + "?" + 'subcity' + "?" + this.user.userId;
    this.repository.GetSurveyCityEX2(key).then((r) => {
      this.subCityData1 = r as Array<ISurveyStatistics>;
    });
  }

  loadCampusData(id) {
    this.totalsurvey=false;
    this.checkCity = false;
    this.checkSubCity = false;
    this.checkCampus = true;
    this.subCampusData = [];
    var key = id + "?" + 'campus' + "?" + this.user.userId;
    this.repository.GetSurveyCityEX1(key).then((r) => {
      this.subCampusData = r as Array<ISurveyStatistics>;
    });
  }
  loadCampusData1(id) {
    this.totalsurvey=false;
    this.checkCity = false;
    this.checkSubCity = false;
    this.checkCampus = true;
    this.subCampusData1 = [];
    var key = id + "?" + 'campus' + "?" + this.user.userId;
    this.repository.GetSurveyCityEX2(key).then((r) => {
      this.subCampusData1 = r as Array<ISurveyStatistics>;
    });
  }

  isTeacherTable(serial: number) {
    return serial == 1 && this.teachCheck === true;
  }
  isTeacherTablepre(serial: number) {
    return serial == 1 && this.teachCheckpre === true;
  }

  loadTeachers(course) {
    this.teacherRatingList = [];
    this.subCheck = false;

    this.indexd++;

    if (this.cityId.length == 0 && this.subCityId.length == 0 && this.campusId.length == 0 && this.programId.length == 0 && this.classId.length == 0) {
      var key = course + "?" + this.user.userId;
      this.repository.GetTeachersRatingEx1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;

        this.teachCheck = true;
      });
    } else {
      var key =
        `${this.cityId.length > 0 ? this.cityId : this.empty}?
        ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
        ${this.campusId.length > 0 ? this.campusId : this.empty}?
        ${this.programId.length > 0 ? this.programId : this.empty}?
        ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${course}?${this.user.userId}`;

      this.repository.GetTeachersRating1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;

        this.teachCheck = true;
      });
    }
  }
  loadTeacherspre(course) {
    this.teacherRatingListpre = [];
    this.subCheckpre = false;

    this.indexd++;

    if (this.cityId.length == 0 && this.subCityId.length == 0 && this.campusId.length == 0 && this.programId.length == 0 && this.classId.length == 0) {
      var key = course + "?" + this.user.userId;
      this.repository.GetTeachersRatingEx1pre(key).then((r) => {
        this.teacherRatingListpre = r as Array<ITeacherRatingOverAllList1>;

        this.teachCheckpre = true;
      });
    } else {
      var key =
        `${this.cityId.length > 0 ? this.cityId : this.empty}?
        ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
        ${this.campusId.length > 0 ? this.campusId : this.empty}?
        ${this.programId.length > 0 ? this.programId : this.empty}?
        ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${course}?${this.user.userId}`;

      this.repository.GetTeachersRating1pre(key).then((r) => {
        this.teacherRatingListpre = r as Array<ITeacherRatingOverAllList>;

        this.teachCheckpre = true;
      });
    }
  }
  loadPrevious() {
    if (this.teachCheck == true) {
      this.subCheck = true;
      this.teachCheck = false;
    }
  }
  loadPreviouspre() {
    if (this.teachCheckpre == true) {
      this.subCheckpre = true;
      this.teachCheckpre = false;
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
  loadQuestionspre() {
    this.indexd++;
    this.subCheckpre = true;
    this.teachCheckpre = false;
    this.questionspre = [];

    this.surveyOverAllResultListpre.forEach(element => {
      if (this.questionspre.filter(e => e.q == element.question).length <= 0) {
        this.questionspre.push({ o: element.order, q: element.question });
      }
    });

    var lastQuestionpre = this.filteredDatapre(this.questionspre[this.questionspre.length - 1].q)[0];

    var rating = lastQuestionpre.rating;
    var overAllRating = lastQuestionpre.overAllRating;

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
  get questionsspre() {
    if (this.questionspre.length > 0) {
      return this.questionspre.sort((a, b) => a.o > b.o && 1 || -1);
    }
  }
  isLastQuestion(serial: number) {
    return this.questionss[this.questionss.length - 1].o != serial;
  }
  isLastQuestionpre(serial: number) {
    return this.questionsspre[this.questionsspre.length - 1].o != serial;
  }
  get whichModule() {
    if (this.cityId.length > 0 && this.subCityId.length > 0 && this.campusId.length > 0 && this.programId.length > 0 && this.classId.length > 0) {
      return 'class';
    } else if (this.cityId.length > 0 && this.subCityId.length > 0 && this.campusId.length > 0 && this.programId.length > 0) {
      return 'program';
    } else if (this.cityId.length > 0 && this.subCityId.length > 0 && this.campusId.length > 0) {
      return 'campus';
    } else if (this.cityId.length > 0 && this.subCityId.length > 0) {
      return 'subcity';
    } else if (this.cityId.length > 0) {
      return 'city';
    } else {
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
  isPercentagepre(q: string) {
    if (q.indexOf("5") > 0 || q.indexOf("10") > 0) {
      return true;
    } else {
      return false;
    }
  }

  refreshData() {
    this.$store.dispatch(StoreTypes.loadingState, true)
    this.surveyOverAllResultList = [];
    var key = this.user.userId;
    this.repository.GetOverAllResultEx1(key).then((r) => {
      this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;
      this.loadQuestions();

    });
  }
  refreshDatapre() {
    this.$store.dispatch(StoreTypes.loadingState, true)
    this.surveyOverAllResultListpre = [];
    var key = this.user.userId;
    this.repository.GetOverAllResultEx1pre(key).then((r) => {
      this.surveyOverAllResultListpre = r as Array<ISurveyOverAllResult1>;
      this.loadQuestionspre();

    });
  }
  loadData() {
    if (this.whichModule.length > 0) {
      if (this.campusId.length > 0 && this.subCityId.length > 0 && this.cityId.length > 0) {
        this.totalsur = false;
        this.loadCampusData(this.campusId);
        this.loadCampusData1(this.campusId);
      }
      else if (this.subCityId.length > 0 && this.cityId.length > 0) {
        this.totalsur = false;
        this.loadSubCityData(this.subCityId);
        this.loadSubCityData1(this.subCityId);
      }
      else if (this.cityId.length > 0) {
        this.totalsur = false;
        this.loadCityDataSurvey(this.cityId);
        this.loadCityDataSurvey1(this.cityId);
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
        this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;
        this.loadQuestions();
      });
    } else {
      this.refreshData();
    }
    this.loadDatapre();
  }

  loadDatapre() {
    if (this.whichModule.length > 0) {
      if (this.campusId.length > 0 && this.subCityId.length > 0 && this.cityId.length > 0) {
        this.totalsur = false;
        this.loadCampusData1(this.campusId);
      }
      else if (this.subCityId.length > 0 && this.cityId.length > 0) {
        this.totalsur = false;
        this.loadSubCityData1(this.subCityId);
      }
      else if (this.cityId.length > 0) {
        this.totalsur = false;
        this.loadCityDataSurvey1(this.cityId);
      }
    }

    this.surveyOverAllResultListpre = [];

    if (this.whichModule.length > 0) {
      var key =
        `${this.cityId.length > 0 ? this.cityId : this.empty}?
      ${this.subCityId.length > 0 ? this.subCityId : this.empty}?
      ${this.campusId.length > 0 ? this.campusId : this.empty}?
      ${this.programId.length > 0 ? this.programId : this.empty}?
      ${this.classId.length > 0 ? this.classId : this.empty}?${this.whichModule}?${this.user.userId}`;

      this.repository.GetOverAllResult1pre(key).then((r) => {
        this.surveyOverAllResultListpre = r as Array<ISurveyOverAllResult1>;
        this.loadQuestionspre();
      });
    } else {
      this.refreshDatapre();
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
  showldShowTablepre(questionpre: string) {
    var isTable: boolean = false;
    this.surveyOverAllResultListpre.filter(e => e.question == questionpre).forEach(e => {
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
          deepCopy.push({ course: ex.course, rating: ex.rating, overAllRating: ex.overAllRating, order: ex.order,total: ex.total });
        }
      }
    });

    return deepCopy;
  }
  filteredDatapre(question: string) {
    var deepCopy = [];
    this.surveyOverAllResultListpre.filter(e => e.question == question).forEach(ex => {
      if (deepCopy.filter(x => x.course === ex.course).length == 0) {
        if (this.showldShowTablepre(question)) {
          if (ex.course != '') {
            if (ex.course.indexOf('randomItem') < 0) {
              deepCopy.push({ course: ex.course, rating: ex.rating, overAllRating: ex.overAllRating, order: ex.order,total: ex.total });
            }
          }
        } else {
          deepCopy.push({ course: ex.course, rating: ex.rating, overAllRating: ex.overAllRating, order: ex.order,total: ex.total });
        }
      }
    });

    return deepCopy;
  }

  loadCity() {

    this.subCityId = '';
    this.campusId = '';
    this.cityRepo.GetAllEx().then((r) => {
      this.cityList = r as Array<ISetupCity>;
      this.cityList = this.cityList.sort((one, two) =>
        one.fullName < two.fullName ? -1 : 1
      );
    });
    this.$store.dispatch(StoreTypes.loadingState, true)
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
    if (module == "city") {
      if (this.typeId.length > 0) {
        param = `WHERE "CampusType"='${this.typeId}'`;
      } else {
        alert("Please Chose Posission Type.");
        return;
      }
    }

    this.repo.ParamsDashboard(`${module}:${param}`).then((response) => {
      switch (module) {
        case "type":
          this.campusTypeList = [];
          this.campusTypeList = response as Array<IGeneral>;
          break;
        case "result":
          this.finalData = [];
          this.finalData = response as Array<IComparisonData>;
          break;
        default:
          console.error(JSON.stringify(response));
      }
    });
  }
  clearSelection() {
    this.$store.dispatch(StoreTypes.loadingState, true)
    this.subCityId = '';
    this.campusId = '';
    this.programId = '';
    this.classId = '';
    this.totalsur = true;
    this.checkCity = false;
    this.checkSubCity = false;
    this.checkCampus = false;

    this.refreshData();
    this.refreshDatapre();

  }
}
