/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import * as helper from "../../../../helper";
import { State } from "vuex-class";
import { DllPlugin } from "webpack";
import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";
import {
  CitySubCity,
  IAcademicCalendarMaster,
  IBuildingData,
  ICampusCityVM,
  ISetupCampusProgramVM,
  ISetupCity,
  ISetupClass,
  ISetupProgram,
  ISetupSession,
  ISetupSubCity,
  ISurvey2,
  ISurveyCommentDash,
  ISurveyQuestionDash,
  ISurveyMaster,
  ISurveyRatingList,
  ISurveyRatingListEx,
  ISurveyStatistics,
} from "../../../../models";
import { IVWCampusBaseProgram } from "../../../../models/Setup/CampusBaseProgram";
import {
  AcademicCalendarMasterService,
  SetupCampusProgramLinkService,
  SetupCampusService,
  SetupCityService,
  SetupClassService,
  SetupProgramService,
  SetupSessionService,
  SetupSubCityService,
} from "../../../../service";
import { PublicVWDashBoardVMService } from "../../../../service/DashBoard/DashBoard";
import { SurveyDashboardMasterService } from "../../../../service/DashBoard/dashboardsurveymaster";
import { StoreTypes } from "../../../../../../store";
// import {  OverAllResultJuly23 } from "../../OverAllResultJuly23/list";
import { SurveyDashBoardComparisionApril } from "../../SurveyDashBoardComparisionApril/list";
import { timingSafeEqual } from "crypto";
// import { TeacherSearchSurveyJuly23 } from "../../TeacherSearchSurveyJuly/list";
import { OverAllResultEbook24 } from "../../OverAllResultEbook24/list";
import { TeacherSearchSurveyJune24 } from "../../TeacherSearchSurveyJune24/list";

@Component({
  name: "Survery-Dashoard",
  template: require("./index.html"),
  components: {
    "over-all-result": OverAllResultEbook24,
    "Teacher-Search": TeacherSearchSurveyJune24,
    "over-all-result-New-Component": SurveyDashBoardComparisionApril,
  },
})
export class SurveyDashEbook24 extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private surveyInfo: any = {};
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkCity: boolean = false;
  private checkSubCity: boolean = false;
  private checkCampus: boolean = false;
  private isBuilding: boolean = false;
  private search: string = "";
  surveyMasterId: string = "";
  sessionId: string = "";
  cityId: string = "";
  campusId: string = "";
  buildingname: string = "";
  programId: string = "";
  classId: string = "";
  campusProgramId: string = "";
  subCityId: string = "";
  subCityId1: string = "";
  subCityId2: string = "";
  subCityId3: string = "";
  subCity1Name: string = "";
  subCity2Name: string = "";
  subCity3Name: string = "";
  filterArr: any = [];
  newArr = [];

  private survey: Array<ISurvey2> = [];
  private building: Array<IBuildingData> = [];
  private surveyStatistics: Array<ISurveyStatistics> = [];
  private subCityData: Array<ISurveyStatistics> = [];
  private subCampusData: Array<ISurveyStatistics> = [];
  sessionList: Array<ISetupSession> = [];
  cityComparisonList: Array<ISurveyRatingList> = [];
  cityComparisonListEx: Array<ISurveyRatingListEx> = [];
  surveyCommentDashList: Array<ISurveyCommentDash> = [];
  surveyQuestionDashList: Array<ISurveyQuestionDash> = [];

  surveyDashboardMasterList: Array<ISurveyMaster> = [];
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  private data: Array<ISetupSubCity> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
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
  repoSurveyDashboardMaster: SurveyDashboardMasterService = new SurveyDashboardMasterService(
    this.$store
  );
  private cityRepo: SetupCityService = new SetupCityService(this.$store);
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(
    this.$store
  );
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

  private columns = [{ key: "comment", caption: "Comments" }];

  //   private comparisonColumns = [
  //     { key: 'question', caption: 'Refference No' },
  //     { key: 'course', caption: '' },
  //     { key: 'subCity1Rating', caption: 'Sub-City 1' },
  //     { key: 'subCity2Rating', caption: 'Sub-City 2' },
  //     { key: 'subCity4Rating', caption: 'Sub-City 3' },
  //     { key: 'rating', caption: 'OverAll' }
  //     // { key: 'action', caption: 'Action', width: 120 }
  // ];
  private breadcrums = [];
  searchArr = [];
  duplicateArr: any = [];

  created() {

    // this.loadSurveyDashboardMaster();
    this.loadCity();
    this.$watch("cityId", this.loadSubCity);
    this.$watch("subCityId", this.loadCityCampus);
    this.$watch("campusId", this.loadPrograms);
    this.$watch("programId", this.loadClass);
    this.$watch("cityId", this.refreshData);
    this.$watch("subCityId", this.refreshData);
    this.$watch("campusId", this.refreshData);
    this.$watch("programId", this.ProgramData);
    this.$watch("classId", this.ClassData);
    this.$watch("subCityId3", this.loadCityWise);
    this.$watch("buildingname", this.laoddatawithbuilding);
    this.$watch("buildingname", this.laoddatawithbuildingEx);
    this.$watch("cityId", this.refreshDataEx);
    this.$watch("subCityId", this.refreshDataEx);
    this.$watch("campusId", this.refreshDataEx);
  }

  mounted() {
    debugger;
    this.validatePage();
    this.loadSession();
    this.loadTotalSurvey();
    this.loadCityData();
    this.loadSubCityEx();
    this.loadData();
    this.loadDataEx();
  }

  querySearch() {
    this.filterArr = [];
    if (this.search) {
      let check = this.searchArr.find((x) => x == this.search);
      if (!check) {
        this.searchArr.push(this.search.toLowerCase());
        this.search = "";
      }
      this.search = "";
    }
    this.searchArr.forEach((value) => {
      // this.duplicateArr = this.data.filter(item =>
      //   Object.keys(item).some(k => item[k] != null &&
      //     item[k].toString().toLowerCase()
      //       .includes(value))
      // );
      //
      this.duplicateArr = this.surveyCommentDashList.filter((e) =>
        e.comment.toLowerCase().includes(value)
      );
      console.log(this.duplicateArr);
      this.duplicateArr.forEach((e) => {
        let search = this.filterArr.find((x) => x.newID == e.newID);
        if (!search) {
          this.filterArr.unshift({
            ...e,
            comment: e.comment
              .toLowerCase()
              .replaceAll(
                value,
                `<span class="font-weight-bold">${value}</span>`
              ),
          });
        }
      });
    });
  }
  querySearchEx() {
    this.filterArr = [];
    if (this.search) {
      let check = this.searchArr.find((x) => x == this.search);
      if (!check) {
        this.searchArr.push(this.search.toLowerCase());
        this.search = "";
      }
      this.search = "";
    }
    this.searchArr.forEach((value) => {
      // this.duplicateArr = this.data.filter(item =>
      //   Object.keys(item).some(k => item[k] != null &&
      //     item[k].toString().toLowerCase()
      //       .includes(value))
      // );
      //
      this.duplicateArr = this.surveyQuestionDashList.filter((e) =>
        e.comment.toLowerCase().includes(value)
      );
      console.log(this.duplicateArr);
      this.duplicateArr.forEach((e) => {
        let search = this.filterArr.find((x) => x.newID == e.newID);
        if (!search) {
          this.filterArr.unshift({
            ...e,
            comment: e.comment
              .toLowerCase()
              .replaceAll(
                value,
                `<span class="font-weight-bold">${value}</span>`
              ),
          });
        }
      });
    });
  }
  private csvdata: any = [];

  loadcsv() {
    this.csvdata = [];
    if (this.surveyCommentDashList.length > 0) {
      this.surveyCommentDashList.forEach((element) => {
        this.csvdata.push({
          Comments: element.comment,
        });
      });
      helper.exportToCsv("Comments.csv", this.csvdata);
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "No Data Found",
        title: "warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
    }
  }
  loadcsvEx() {
    this.csvdata = [];
    if (this.surveyQuestionDashList.length > 0) {
      this.surveyQuestionDashList.forEach((element) => {
        this.csvdata.push({
          Comments: element.comment,
        });
      });
      helper.exportToCsv("Comments.csv", this.csvdata);
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "No Data Found",
        title: "warning",
        messageTypeId: PayloadMessageTypes.warning,
      });
    }
  }
  deleteSearch(i) {
    debugger;
    this.searchArr.splice(i, 1);
    this.querySearch();
    if (this.searchArr.length == 0) {
      this.filterArr = this.surveyCommentDashList;
    }
  }
  deleteSearchEx(i) {
    this.searchArr.splice(i, 1);
    this.querySearch();
    if (this.searchArr.length == 0) {
      this.filterArr = this.surveyQuestionDashList;
    }
  }
  loadCity() {
    debugger;
    this.cityRepo.GetAllOwnedCitiesForEbook().then((r) => {
      this.cityList = r as Array<ISetupCity>;
      this.cityList = this.cityList.sort((one, two) =>
        one.fullName < two.fullName ? -1 : 1
      );
    });
  }

  loadSubCity() {
    this.subCityRepo.GetFindBySubcitiesEx(this.cityId).then((r) => {
      this.subCityList = r as Array<CitySubCity>;
    });
  }

  loadSubCityEx() {
    this.data = [];
    this.subCityRepo.GetFindByOwnedSubCitites("e => e.StatusId!=2").then((r) => {
      this.data = r as Array<ISetupSubCity>;
    });
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

  loadClass() {
    // this.programId = this.campusProgramLinkList.find(
    //   (e) => e.campusProgramId == this.campusProgramId
    // ).programId;
    this.classRepository.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }
  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
      // this.ddl = [];
      // this.programDDL = [];
      // let oldObj: ISetupCampusProgramVM;
      // var key = this.campusId;
      // this.campusProgramLinkRepo.GetAllVMEx(key).then((r) => {
      //   this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      // });
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

  loadSurveyDashboardMaster() {
    this.surveyDashboardMasterList = [];
    this.repoSurveyDashboardMaster.GetAllEx().then((r) => {
      this.surveyDashboardMasterList = r as Array<ISurveyMaster>;
    });
  }

  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  loadCityWise() {
    this.subCity1Name = this.data.find(
      (e) => e.subCityId == this.subCityId1
    ).name;
    this.subCity2Name = this.data.find(
      (e) => e.subCityId == this.subCityId2
    ).name;
    this.subCity3Name = this.data.find(
      (e) => e.subCityId == this.subCityId3
    ).name;

    this.cityComparisonListEx = [];
    this.cityComparisonList = [];
    var key = this.subCityId1 + "?" + this.subCityId2 + "?" + this.subCityId3;
    this.repository.GetSurveyRatingAllExEBook24(key).then((r) => {
      this.cityComparisonList = r as Array<ISurveyRatingList>;
    });
  }

  loadCityWiseEx() {
    if (
      this.subCityId1.length > 0 &&
      this.subCityId2.length &&
      this.subCityId3.length == 0
    ) {
      this.subCity1Name = this.data.find(
        (e) => e.subCityId == this.subCityId1
      ).name;
      this.subCity2Name = this.data.find(
        (e) => e.subCityId == this.subCityId2
      ).name;
      this.cityComparisonList = [];
      this.cityComparisonListEx = [];
      var key = this.subCityId1 + "?" + this.subCityId2;
 
      this.repository.GetSurveyRatingAllEBook2024(key).then((r) => {
        this.cityComparisonListEx = r as Array<ISurveyRatingListEx>;
      });
    }
  }
  ProgramData() {
    this.surveyInfo = "Posession";
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];

    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.buildingname.length > 0 &&
      this.programId != "00000000-0000-0000-0000-000000000000"
    ) {
      console.log("program");
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        this.buildingname +
        "?" +
        this.programId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "program" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    }
  }
  ClassData() {
    this.surveyInfo = "Posession";
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];

    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.buildingname.length > 0 &&
      this.programId.length > 0 &&
      this.classId != "00000000-0000-0000-0000-000000000000"
    ) {
      console.log("class");
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        this.buildingname +
        "?" +
        this.programId +
        "?" +
        this.classId +
        "?" +
        "class" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    }
  }
  laoddatawithbuilding() {
    debugger;
    if (this.buildingname.length > 0) {
      var buildingnewdata = this.building.filter(
        (e) => e.buildingName == this.buildingname
      );
      this.isBuilding = buildingnewdata[0].isBuilding;
      if (this.isBuilding == true) {
        this.surveyInfo = "Posession";
        this.surveyCommentDashList = [];
        this.filterArr = [];
        this.searchArr = [];

        if (
          this.cityId.length > 0 &&
          this.subCityId.length > 0 &&
          this.building[0].isBuilding == true &&
          this.buildingname.length > 0
        ) {
          console.log("building");
          var key =
            this.cityId +
            "?" +
            this.subCityId +
            "?" +
            "00000000-0000-0000-0000-000000000000" +
            "?" +
            this.buildingname +
            "?" +
            "00000000-0000-0000-0000-000000000000" +
            "?" +
            "00000000-0000-0000-0000-000000000000" +
            "?" +
            "building" +
            "?" +
            this.user.userId;

          this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
            this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
            this.duplicateArr = this.surveyCommentDashList;
            this.filterArr = this.surveyCommentDashList;
          });
        } else {
          this.refreshData();
        }
      } else {
      }
    } else {
    }
  }
  laoddatawithbuildingEx() {
    debugger;
    if (this.buildingname.length > 0) {
      var buildingnewdata = this.building.filter(
        (e) => e.buildingName == this.buildingname
      );
      this.isBuilding = buildingnewdata[0].isBuilding;
      if (this.isBuilding == true) {
        this.surveyInfo = "Posession";
        this.surveyQuestionDashList = [];
        this.filterArr = [];
        this.searchArr = [];

        if (
          this.cityId.length > 0 &&
          this.subCityId.length > 0 &&
          this.building[0].isBuilding == true &&
          this.buildingname.length > 0
        ) {
          console.log("building");
          var key =
            this.cityId +
            "?" +
            this.subCityId +
            "?" +
            "00000000-0000-0000-0000-000000000000" +
            "?" +
            this.buildingname +
            "?" +
            "00000000-0000-0000-0000-000000000000" +
            "?" +
            "00000000-0000-0000-0000-000000000000" +
            "?" +
            "building" +
            "?" +
            this.user.userId;

          this.repository
            .GetSurveyQuestionDashJun24WithBuilding(key)
            .then((r) => {
              this.surveyQuestionDashList = r as Array<ISurveyQuestionDash>;
              this.duplicateArr = this.surveyQuestionDashList;
              this.filterArr = this.surveyQuestionDashList;
            });
        } else {
          this.refreshDataEx();
        }
      } else {
      }
    } else {
    }
  }

  refreshData() {
    debugger;
    this.surveyInfo = "Posession";
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];

    if (
      this.campusId != "00000000-0000-0000-0000-000000000000" &&
      this.campusId != ""
    ) {
      console.log("campus");

      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "campus" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
      this.loadbuildingdata();
    } else if (
      this.subCityId != "00000000-0000-0000-0000-000000000000" &&
      this.subCityId != ""
    ) {
      console.log("subcity");

      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "subcity" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    } else if (
      this.cityId != "00000000-0000-0000-0000-000000000000" &&
      this.cityId != ""
    ) {
      console.log("city");

      var key =
        this.cityId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "city" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      });
    }

    // var key =
    //   this.cityId +
    //   "?" +
    //   this.subCityId +
    //   "?" +
    //   this.campusId +
    //   "?" +
    //   this.programId +
    //   "?" +
    //   this.classId +
    //   "?" +
    //   this.user.userId;
    // this.repository.GetSurveyCommentDash(key).then((r) => {
    //   this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
    //   this.duplicateArr = this.surveyCommentDashList;
    //   this.filterArr = this.surveyCommentDashList;
    // });
  }
  refreshDataEx() {
    this.surveyInfo = "Posession";
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];

    if (
      this.campusId != "00000000-0000-0000-0000-000000000000" &&
      this.campusId != ""
    ) {
      console.log("campus");

      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "campus" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyQuestionDashList = r as Array<ISurveyQuestionDash>;
        this.duplicateArr = this.surveyQuestionDashList;
        this.filterArr = this.surveyQuestionDashList;
      });
      this.loadbuildingdata();
    } else if (
      this.subCityId != "00000000-0000-0000-0000-000000000000" &&
      this.subCityId != ""
    ) {
      console.log("subcity");

      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "subcity" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyQuestionDashList = r as Array<ISurveyQuestionDash>;
        this.duplicateArr = this.surveyQuestionDashList;
        this.filterArr = this.surveyQuestionDashList;
      });
    } else if (
      this.cityId != "00000000-0000-0000-0000-000000000000" &&
      this.cityId != ""
    ) {
      console.log("city");

      var key =
        this.cityId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "city" +
        "?" +
        this.user.userId;
      this.repository.GetSurveyCommentDashEBook2024(key).then((r) => {
        this.surveyQuestionDashList = r as Array<ISurveyQuestionDash>;
        this.duplicateArr = this.surveyQuestionDashList;
        this.filterArr = this.surveyQuestionDashList;
      });
    }
  }
  noData: boolean = false;
  loadData() {
    this.surveyCommentDashList = [];
    this.filterArr = [];
    this.searchArr = [];
    let key: string = String(this.user.userId);
    this.repository.GetSurveyQuestionDashEbook2024(key).then((r) => {
      if (r.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
        this.surveyCommentDashList = r as Array<ISurveyCommentDash>;
        this.duplicateArr = this.surveyCommentDashList;
        this.filterArr = this.surveyCommentDashList;
      }
    });
  }
  loadDataEx() {
    this.surveyQuestionDashList = [];
    this.filterArr = [];
    this.searchArr = [];
    let key: string = String(this.user.userId);
    this.repository.GetSurveyQuestionDashEbook2024(key).then((r) => {
      if (r.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
        this.surveyQuestionDashList = r as Array<ISurveyQuestionDash>;
        this.duplicateArr = this.surveyQuestionDashList;
        this.filterArr = this.surveyQuestionDashList;
      }
    });
  }

  loadbuildingdata() {
    if (this.subCityId.length > 0) {
      this.repository
        .BuildingSectionDataWithSessionAndClass(this.subCityId)
        .then((r) => {
          this.building = r as Array<IBuildingData>;
        });
    }
  }
  loadCityData() {
    this.checkCity = true;
    this.checkSubCity = false;
    this.checkCampus = false;
    this.surveyStatistics = [];
    var key =
      "00000000-0000-0000-0000-000000000000" +
      "?" +
      "city" +
      "?" +
      this.user.userId +
      "?" +
      "f36f5089-c160-4e97-902d-48b230c85e6a";
    this.repository.SurveyStatisticsEbook24(key).then((r) => {
      this.surveyStatistics = r as Array<ISurveyStatistics>;
    });
  }

  loadSubCityData(id, next, name) {
    this.checkCity = false;
    this.checkCampus = false;
    this.checkSubCity = true;
    this.subCityData = [];
    this.breadcrums = [];
    this.breadcrums[0] = name;
    var key =
      id +
      "?" +
      next +
      "?" +
      this.user.userId +
      "?" +
      "e03292cf-244e-4435-b530-4ff0653bae4c" +
      "?" +
      "bb638a38-670c-4471-bf45-4ce602404cd8";
    this.repository.SurveyStatisticsJun24(key).then((r) => {
      this.subCityData = r as Array<ISurveyStatistics>;
    });
  }

  loadCampusData(id, next, name) {
    this.loadbuildingdata();
    this.breadcrums[1] = name;
    this.checkCity = false;
    this.checkSubCity = false;
    this.checkCampus = true;
    this.subCampusData = [];
    var key =
      id +
      "?" +
      next +
      "?" +
      this.user.userId +
      "?" +
      "e03292cf-244e-4435-b530-4ff0653bae4c" +
      "?" +
      "bb638a38-670c-4471-bf45-4ce602404cd8";
    this.repository.SurveyStatisticsJul23(key).then((r) => {
      this.subCampusData = r as Array<ISurveyStatistics>;
    });
  }

  loadTotalSurvey() {
    this.survey = [];
    this.repository
      .TotalSurveyEbooks24("f36f5089-c160-4e97-902d-48b230c85e6a")
      .then((response) => (this.survey = response as Array<ISurvey2>));
  }

  loadPrevious() {
    if (this.checkSubCity == true) {
      this.checkSubCity = false;
      this.checkCampus = false;
      this.checkCity = true;
      this.breadcrums.splice(0, 1);
    }
    if (this.checkCampus == true) {
      this.checkSubCity = true;
      this.checkCampus = false;
      this.checkCity = false;
      this.breadcrums.splice(1, 1);
    }
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("CMSStudentCountEbook2024" in this.user.claims == true) {
        if (this.user.claims["CMSStudentCountEbook2024"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["CMSStudentCountEbook2024"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["CMSStudentCountEbook2024"].indexOf("U") >= 0) {
          if (this.user.claims[""].indexOf("U") >= 0) {
            this.canEdit = true;
          }
          if (this.user.claims["CMSStudentCountEbook2024"].indexOf("D") >= 0) {
            this.canDelete = true;
          }
        } else {
          this.$router.push("Home");
        }
      }
    }
    // transform(val, course) {
    //   return val.replace("following", course);
    // }
  }
}
