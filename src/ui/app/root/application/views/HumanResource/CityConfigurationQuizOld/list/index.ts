import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IHumanResourceStaff,
  ITimeTableTimeTableVM,
  ISetupZone,
  ISetupCity,
  ISetupSubCity,
  ISetupSession,
  ICampusCityVM,
  HolidayType,
  AcademicCalendarVM,
  ISetupCitySubCityLink,
  IELTopics,
  IBoards,
  ISetupClass,
  IAcademicCalendarType,
  IAcademicCalendar,
  IAcademicCalendarMaster,
  ProgramCourseList,
} from "../../../../models";
import {
  HumanResourceStaffService,
  TimeTableTimeTableService,
  SetupZoneService,
  SetupCityService,
  SetupSubCityService,
  SetupSessionService,
  SetupCampusService,
  ELTopicsService,
  BoardsService,
  SetupClassService,
  AcademicCalendarTypeService,
  AcademicCalendarService,
  AcademicCalendarMasterService,
  AdmissionStudentsService,
} from "../../../../service";
import { StoreTypes } from "../../../../../../store";

import { Calendar } from "@toast-ui/vue-calendar";
import { HolidayTypeService } from "../../../../service/AcademicCalendar/holidaytype";
import * as helper from "../../../../helper";
 import moment from "moment"; 

@Component({
  name: "quiz-configuration",
  template: require("./index.html"),
  components: {
  },
})
export class CityConfigurationQuiz extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
  private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
    this.$store
  );
  sessionList: Array<ISetupSession> = [];
  private classList: Array<ISetupClass> = [];
  private repoClass: SetupClassService = new SetupClassService(this.$store);


  private cityRepo: SetupCityService = new SetupCityService(
    this.$store
  );
  private cityList: Array<ISetupCity> = []; 
   boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  sessionId: string = "";
  campusId: string = "";
  holidaytypeid: string = "";
  topicId: string = "";
  boardId: string = "";
  classId: string = "";
  cityId: string = "";
  quizName: string = ""; 
  testFrequency: string = ""; 
  private fromdate = new Date();
  private todate = new Date();
  private calendarfromdate = new Date();
  private calendartodate = new Date();

  private currDate = new Date();
  academicCalendarTypeList: IAcademicCalendarType[] = [];
  repoAcademicCalendarType: AcademicCalendarTypeService = new AcademicCalendarTypeService(
    this.$store
  );
  acadmiccalendarepo: AcademicCalendarService = new AcademicCalendarService(
    this.$store
  );
  private useCreationPopup = false;
  private useDetailPopup = false;
  viewBtn: boolean = false;

  repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(
    this.$store
  );
  academicCalendarMasterList: IAcademicCalendarMaster[] = [];
  calMasterList: Array<IAcademicCalendarMaster> = [];
  academicCalendarMasterId: string = "";
 
  holidayError: boolean = false;
  viewPopUp = false; 
 
  mounted() {
    this.loadSession();
    this.loadCitySubCity();
    this.loadClass();
    this.viewBtn = false;
  }



  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }
  

  loadClass() {
    this.classList = [];

    this.repoClass.GetFindBy("e=>e.StatusId==1").then((res) => {
      this.classList = res as Array<ISetupClass>;
    });
  }
  loadBoards() {
    this.boardRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.boardList = r;
    });
  }
  loadCitySubCity() {
    this.cityList = [];
    this.cityRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.cityList = r as Array<ISetupCity>;
    });
  }
  allowshow() {
    if (
      this.sessionId.length > 0 &&
      this.cityId.length > 0 &&
      this.classId.length > 0 &&
      this.fromdate.toString().length>0 &&
      this.todate.toString().length>0 &&
      this.calendarfromdate.toString().length>0 &&
      this.calendartodate.toString().length>0 &&
      this.testFrequency.length>0 &&
      this.quizName.length>0

    )
      return true;
    return false;
  }


  cancel() {
    this.sessionId="";
    this.cityId="";
    this.classId="";
    this.fromdate= new Date();
    this.todate= new Date();
    this.calendarfromdate= new Date();
    this.calendartodate= new Date();
    this.testFrequency="";
    this.quizName="";

}

save() { 
  
var key = this.sessionId +'?'+this.cityId+'?'+this.classId+'?'+moment(this.fromdate).format("YYYY-MM-DD HH:mm:ss")+'?'+moment(this.todate).format("YYYY-MM-DD HH:mm:ss")+'?'+moment(this.calendarfromdate).format("YYYY-MM-DD")+'?'+moment(this.calendartodate).format("YYYY-MM-DD")+'?'+this.quizName+'?'+this.testFrequency;
 
this.cityRepo.SaveQuizConfigration(key).then(() => {
  this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: "Record has been inserted successfully",
      title: "Success",
      messageTypeId: PayloadMessageTypes.success
  });
  this.cancel();
});  
}

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("cityConfigurationQuiz" in this.user.claims == true) {
        if (this.user.claims["cityConfigurationQuiz"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["cityConfigurationQuiz"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["cityConfigurationQuiz"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["cityConfigurationQuiz"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

 

}
