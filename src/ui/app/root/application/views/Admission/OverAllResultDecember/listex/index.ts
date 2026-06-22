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
  ISetupClass,
  ISetupProgram,
  ISetupSession,
  ISetupSubCity,
  ISurveyOverAllResult,
  ITeacherRatingList,
  ITeacherRatingOverAllList,
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
} from "../../../../service";
import { IVWCampusBaseProgram } from "../../../../models/Setup/CampusBaseProgram";
import { orderBy } from "lodash";

@Component({
  name: "notification-overall",
  template: require("./index.html"),
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    "form-collection-p": charts.FormCollectionPieWidget,
    collapsibleWidget,
  },
})
export class OverAllResultDecember extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private subCheck: boolean = false;
  private teachCheck: boolean = false;
  dueDate = new Date();
  private toDate = new Date();
  sessionId: string = "";
  cityId: string = "";
  campusId: string = "";
  programId: string = "";
  classId: string = "";
  subCityId: string = "";
  campusProgramId: string = "";
  quetion1Name: string = "";
  quetion2Name: string = "";
  quetion3Name: string = "";
  quetion4Name: string = "";
  quetion5Name: string = "";
  quetion6Name: string = "";
  quetion7Name: string = "";
  quetion8Name: string = "";
  quetion9Name: string = "";
  quetion10Name: string = "";
  quetion11Name: string = "";
  quetion12Name: string = "";
  quetion13Name: string = "";
  guage: number = 0;
  guage1: number = 0;
  private repository: PublicVWDashBoardVMService = new PublicVWDashBoardVMService(
    this.$store
  );
  private subCityList: Array<CitySubCity> = [];
  private cityList: Array<ISetupCity> = [];
  private data: Array<ISetupSubCity> = [];
  private surveyOverAllResultList: Array<ISurveyOverAllResult> = [];
  private teacherRatingList: Array<ITeacherRatingOverAllList> = [];
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
  question1 = [];
  question2 = [];
  question3 = [];
  question4 = [];
  question5 = [];
  question6 = [];
  question7 = [];
  question8 = [];
  question9 = [];
  question10 = [];
  question11 = [];
  question12 = [];
  question13 = [];

  // filterArr: any = [];

  created() {
    this.loadCity();
    //this.refreshData();
    this.$watch("cityId", this.loadSubCity);
    this.$watch("subCityId", this.loadCityCampus);
    this.$watch("campusId", this.loadPrograms);
    this.$watch("programId", this.loadClass);
    // this.$watch("cityId", this.loadData);
    // this.$watch("subCityId", this.loadData);
    // this.$watch("campusId", this.loadData);
    // this.$watch("programId", this.loadData);
    // this.$watch("classId", this.loadData);
  }

  mounted() { }

  loadTeachers(course) {
    this.teacherRatingList = [];
    this.subCheck = false;
    this.teachCheck = true;

    if (
      this.cityId.length == 0 &&
      this.subCityId.length == 0 &&
      this.campusId.length == 0 &&
      this.programId.length == 0 &&
      this.classId.length == 0
    ) {
      var key = course + "?" + this.user.userId;
      this.repository.GetTeachersRatingEx1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length == 0 &&
      this.campusId.length == 0 &&
      this.programId.length == 0 &&
      this.classId.length == 0
    ) {
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
        course +
        "?" +
        this.user.userId;
      this.repository.GetTeachersRating1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length == 0 &&
      this.programId.length == 0 &&
      this.classId.length == 0
    ) {
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
        course +
        "?" +
        this.user.userId;
      this.repository.GetTeachersRating1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.programId.length == 0 &&
      this.classId.length == 0
    ) {
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
        course +
        "?" +
        this.user.userId;
      this.repository.GetTeachersRating1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.programId.length > 0 &&
      this.classId.length == 0
    ) {
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        this.programId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "program" +
        "?" +
        course +
        "?" +
        this.user.userId;
      this.repository.GetTeachersRating1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.programId.length > 0 &&
      this.classId.length > 0
    ) {
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        this.programId +
        "?" +
        this.classId +
        "?" +
        "class" +
        "?" +
        course +
        "?" +
        this.user.userId;
      this.repository.GetTeachersRating1(key).then((r) => {
        this.teacherRatingList = r as Array<ITeacherRatingOverAllList>;
      });
    }
  }


  loadPrevious() {
    if (this.teachCheck == true) {
      this.subCheck = true;
      this.teachCheck = false;
    }
  }

  loadQuestions() {
    this.subCheck = true;
    this.teachCheck = false;
    this.question1 = [];
    this.question2 = [];
    this.question3 = [];
    this.question4 = [];
    this.question5 = [];
    this.question6 = [];
    this.question7 = [];
    this.question8 = [];
    this.question9 = [];
    this.question10 = [];
    this.question11 = [];
    this.question12 = [];
    this.question13 = [];
    this.guage = 0;

    this.question1 = this.surveyOverAllResultList.filter((e) => e.question == "How well do you understand the lectures of the following subjects? Please rate out of 5, with 1 being the lowest and 5 being the highest.");
    this.question2 = this.surveyOverAllResultList.filter((e) => e.question == "How satisfied are you with the response of the administrative staff when they are handling your queries? Please rate out of 5, with 1 being the lowest and 5 being the highest.");
    this.question3 = this.surveyOverAllResultList.filter((e) => e.question == "How satisfied are you with the examination/testing system in your campus?  Please rate out of 5, with 1 being the lowest and 5 being the highest.");
    this.question4 = this.surveyOverAllResultList.filter((e) => e.question == "How satisfied are you with the following facilities available in your campus?  Please rate out of 5, with 1 being the lowest and 5 being the highest.");
    this.question5 = this.surveyOverAllResultList.filter((e) => e.question == "Rate the general cleanliness of the following facilities. Please rate out of 5, with 1 being the lowest and 5 being the highest.");
    this.question6 = this.surveyOverAllResultList.filter((e) => e.question == "Were you provided with your Microsoft Username and Password at the start of the session?");
    this.question7 = this.surveyOverAllResultList.filter((e) => e.question == "Were you given proper information regarding the Campus Student Portal and Mobile App at the start of the session?");
    this.question8 = this.surveyOverAllResultList.filter((e) => e.question == "How would you rate the Student Portal and Mobile App? Please rate out of 5, with 1 being the lowest and 5 being the highest.");
    this.question9 = this.surveyOverAllResultList.filter((e) => e.question == "Do you find your personal information updated in your Student Portal and Mobile App?");
    this.question10 = this.surveyOverAllResultList.filter((e) => e.question == "How likely are you to recommend Campus to another student? Please rate out of 10, with 0 being the lowest and 10 being the highest.");
    this.question11 = this.surveyOverAllResultList.filter((e) => e.question == "How satisfied are you with the E-Learning content provided by Campus? Please rate out of 5, with 1 being the lowest and 5 being the highest.");
    this.question12 = this.surveyOverAllResultList.filter((e) => e.question == "How likely are you to recommend Campus to another student? Please rate out of 10, with 0 being the lowest and 10 being the highest.");
    this.question13 = this.surveyOverAllResultList.filter((e) => e.question == "Please suggest how we can improve your learning experience.");

    this.quetion1Name = this.question1[0] != null ? this.question1[0].question : '';
    this.quetion2Name = this.question2[0] != null ? this.question2[0].question : '';
    this.quetion3Name = this.question3[0] != null ? this.question3[0].question : '';
    this.quetion4Name = this.question4[0] != null ? this.question4[0].question : '';
    this.quetion5Name = this.question5[0] != null ? this.question5[0].question : '';
    this.quetion6Name = this.question6[0] != null ? this.question6[0].question : '';
    this.quetion7Name = this.question7[0] != null ? this.question7[0].question : '';
    this.quetion8Name = this.question8[0] != null ? this.question8[0].question : '';
    this.quetion9Name = this.question9[0] != null ? this.question9[0].question : '';
    this.quetion10Name = this.question10[0] != null ? this.question10[0].question : '';
    this.quetion11Name = this.question11[0] != null ? this.question11[0].question : '';
    this.quetion12Name = this.question12[0] != null ? this.question12[0].question : '';
    this.quetion13Name = this.question13[0] != null ? this.question13[0].question : '';

    var rating = this.question13[0] != null ? this.question13[0].rating : 0;
    var overAllRating = this.question13[0] != null ? this.question13[0].overAllRating : 0;

    if (rating + 90 < 0) {
      this.guage = 0;
    } else if (rating + 90 > 180) {
      this.guage = 180;
    } else {
      this.guage = rating + 90;
    }

    if (overAllRating + 90 < 0) {
      this.guage1 = 0;
    } else if (overAllRating + 90 > 180) {
      this.guage1 = 180;
    } else {
      this.guage1 = overAllRating + 90;
    }
  }

  refreshData() {
    this.surveyOverAllResultList = [];
    var key = this.user.userId;
    this.repository.GetOverAllResultEx1(key).then((r) => {
      this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;

      this.loadQuestions();
    });
  }

  loadData() {
    this.surveyOverAllResultList = [];

    if (
      this.cityId.length > 0 &&
      this.subCityId.length == 0 &&
      this.campusId.length == 0 &&
      this.programId.length == 0 &&
      this.classId.length == 0
    ) {
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
      this.repository.GetOverAllResult1(key).then((r) => {

        this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;
        this.loadQuestions();
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length == 0 &&
      this.programId.length == 0 &&
      this.classId.length == 0
    ) {
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
      this.repository.GetOverAllResult1(key).then((r) => {
        this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;

        this.loadQuestions();
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.programId.length == 0 &&
      this.classId.length == 0
    ) {
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
      this.repository.GetOverAllResult1(key).then((r) => {
        this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;

        this.loadQuestions();
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.programId.length > 0 &&
      this.classId.length == 0
    ) {
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        this.programId +
        "?" +
        "00000000-0000-0000-0000-000000000000" +
        "?" +
        "program" +
        "?" +
        this.user.userId;
      this.repository.GetOverAllResult1(key).then((r) => {
        this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;
        this.loadQuestions();
      });
    }
    if (
      this.cityId.length > 0 &&
      this.subCityId.length > 0 &&
      this.campusId.length > 0 &&
      this.programId.length > 0 &&
      this.classId.length > 0
    ) {
      var key =
        this.cityId +
        "?" +
        this.subCityId +
        "?" +
        this.campusId +
        "?" +
        this.programId +
        "?" +
        this.classId +
        "?" +
        "class" +
        "?" +
        this.user.userId;
      this.repository.GetOverAllResult1(key).then((r) => {
        this.surveyOverAllResultList = r as Array<ISurveyOverAllResult>;
        this.loadQuestions();
      });
    }
  }

  loadCity() {
    this.cityRepo.GetAllEx().then((r) => {
      this.cityList = r as Array<ISetupCity>;
      this.cityList = this.cityList.sort((one, two) =>
        one.fullName < two.fullName ? -1 : 1
      );
    });
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
  }

  loadClass() {
    // this.programId = this.campusProgramLinkList.find(
    //   (e) => e.campusProgramId == this.campusProgramId
    // ).programId;
    this.classRepository.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.classList = r as Array<ISetupClass>;
    });
  }
}
