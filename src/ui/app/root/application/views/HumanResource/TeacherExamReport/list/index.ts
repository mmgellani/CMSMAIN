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
import { CalendarPopup } from "../add-edit";
import { IAcademicCalendarView } from "../../../../models/academiccalendar/academicCalendar";
import moment from "moment";

import { ViewCalendarPopup } from "../viewDetail";
import { AcademicCalendarDelete } from "../delete";

@Component({
  name: "teacher-timetable",
  template: require("./index.html"),
  components: {
    calendar: Calendar,
    "add-edit": CalendarPopup,
    "view-Popup": ViewCalendarPopup,
    "delete-model": AcademicCalendarDelete,
  },
})
export class TeacherExamReport extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
  private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
    this.$store
  );
  sessionList: Array<ISetupSession> = [];
  calendarviewList: Array<IAcademicCalendarView> = [];
  campusddl: any[];
  cityDDL: any[];
  campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  campusCityList: any = [];
  sessionId: string = "";
  campusId: string = "";
  holidaytypeid: string = "";
  topicId = "";
  boardId = "";
  academiccalendarlist: Array<AcademicCalendarVM> = [];
  private classList: Array<ISetupClass> = [];
  private repoClass: SetupClassService = new SetupClassService(this.$store);

  timetableser: TimeTableTimeTableService = new TimeTableTimeTableService(
    this.$store
  );
  private subCityRepo: SetupSubCityService = new SetupSubCityService(
    this.$store
  );
  private citySubCityList: Array<ISetupCitySubCityLink> = [];
  private topicList: Array<IELTopics> = [];
  private topicRepo: ELTopicsService = new ELTopicsService(this.$store);
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  subCityId = "";
  academicCalendarTypeId = "";
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
  classId = "";
  repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(
    this.$store
  );
  academicCalendarMasterList: IAcademicCalendarMaster[] = [];
  calMasterList: Array<IAcademicCalendarMaster> = [];
  academicCalendarMasterId: string = "";
  masterFromDate = "";
  masterToDate = "";
  holidayDate = "";
  private programCourse: Array<ProgramCourseList> = [];
  courseId = "";
  holidayError: boolean = false;
  viewPopUp = false;

  mounted() {
    this.loadSession();
    this.loadCitySubCity();
    // this.loadTopics();
    // this.loadBoards();
    // this.loadAcademicCalendarType();
    this.loadClass();
    this.viewBtn = false;
    this.loadCourse();
  }
  loadAcademicCalendarMaster() {
    this.academicCalendarMasterList = [];
    if (
      this.sessionId.length > 0 &&
      this.subCityId.length > 0 &&
      this.classId.length > 0
    ) {
      var key = this.sessionId + "?" + this.subCityId + "?" + this.classId;
      this.repoAcademicCalendarMaster.GetFindByIds(key).then((r) => {
        this.academicCalendarMasterList = r as IAcademicCalendarMaster[];
      });
    }
  }
  loadAcademicCalendarType() {
    this.academicCalendarTypeList = [];

    this.repoAcademicCalendarType
      .GetFindByEx("e=>e.StatusId==1")
      .then((res) => {
        this.academicCalendarTypeList = res as Array<IAcademicCalendarType>;
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
    this.citySubCityList = [];
    this.subCityRepo.GetFindByCitySubCityEx("e=>e.StatusId==1").then((r) => {
      this.citySubCityList = r as Array<ISetupCitySubCityLink>;
    });
  }
  loadTopics() {
    this.topicRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
      this.topicList = r as Array<IELTopics>;
    });
  }

  loadCourse() {
    this.courseRepository.GetProgramCourse().then((r) => {
      this.programCourse = r as Array<ProgramCourseList>;
      this.programCourse = this.programCourse.sort((one, two) =>
        one.fullName < two.fullName ? -1 : 1
      );
    });
  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("academicCalendar" in this.user.claims == true) {
        if (this.user.claims["academicCalendar"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["academicCalendar"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["academicCalendar"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["academicCalendar"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  GetAcadmicCaldenview(a) {
    this.calendarviewList = [];
    var pro =
      this.sessionId +
      "?" +
      this.subCityId +
      "?" +
      this.classId +
      "?" +
      this.academicCalendarMasterId +
      "?" +
      this.courseId;
    this.acadmiccalendarepo.GetAcademicCalendarView(pro).then((r) => {
      this.calendarviewList = r as Array<IAcademicCalendarView>;
      // this.masterFromDate = this.calendarviewList[0].masterFromDate
      // this.masterToDate = this.calendarviewList[0].masterToDate

      this.repoAcademicCalendarMaster
        .GetFindBy(
          's=>s.AcademicCalendarMasterId.ToString()=="' +
            this.academicCalendarMasterId +
            '"'
        )
        .then((r) => {
          let calen = this.$refs["tuiCalendar"] as Calendar;

          if (null != calen) {
            this.calMasterList = r as Array<IAcademicCalendarMaster>;
            this.masterFromDate = this.calMasterList[0].fromDate.toString();
            this.masterToDate = this.calMasterList[0].toDate.toString();
            this.boardId = this.calMasterList[0].boardId
            if (a == 1) {
              calen.invoke("setDate", new Date(this.masterFromDate));
              this.getMonth();
            }
          }
        });

      this.onBeforeDeleteScheduleEx();
      this.viewBtn = true;
    });
  }

  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then((r) => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }

  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  clickDayname() {}

  // GetCalendarData()
  // {

  //     var key=this.sessionId+'?'+this.campusId;
  //     this.timetableser.GetAcademicCalendar(key).then(r=>{
  //         this.academiccalendarlist= r as Array<AcademicCalendarVM>

  //         this.scheduleList=[];

  //         this.academiccalendarlist.forEach(element => {
  //             let schedule = {
  //             id: +new Date(),
  //             title: element.calendarName,
  //             start: (element.dates),
  //             end: (element.dates),
  //             location: element.description,
  //             category: "allday"
  //         };

  //         this.scheduleList.push(schedule);

  //         });

  //     })
  // }

  timezones = [
    {
      displayLabel: "GMT+05:00",
      tooltip: "Asia/Karachi",
      timezoneOffset: 540,
    },
  ];

  private taskView = false;
  private scheduleView = ["allday"];

  private calendarList = [
    { id: "0", name: "home" },
    { id: "1", name: "office" },
  ];
  private scheduleList = [];

  dateRangeCheck(from, to, check) {
    var fDate, lDate, cDate;
    fDate = moment(from).format("YYYY-MM-DD");
    lDate = moment(to).format("YYYY-MM-DD");
    cDate = moment(check).format("YYYY-MM-DD");
    if (fDate <= cDate && cDate <= lDate) {
      return true;
    } else {
      return false;
    }
  }

  onBeforeCreateSchedule(e) {
    // if (this.calendarviewList.length > 0) {
    //   this.scheduleList = [];
    //   this.calendarviewList.forEach(element => {

    //     let schedule = {
    //       id: +new Date(),
    //       title: element.calendarName,
    //       isAllDay: e.isAllDay,
    //       start: element.fromDate,
    //       end: element.toDate,
    //       location: element.subCity,
    //       category: "allday"
    //     };

    //     this.scheduleList.push(schedule);
    //     console.log('schedurelist' + JSON.stringify(this.scheduleList))
    //   });

    // }
    this.holidayDate = "";
    this.holidayError = false;
    this.calendarviewList.forEach((x) => {
      if (x.holidayTypeId != null) {
        let hDate = moment(x.fromDate).format("YYYY-MM-DD");
        let mDate = moment(e.start._date).format("YYYY-MM-DD");
        if (hDate == mDate) {
          this.holidayDate = hDate;
          this.holidayError = true;
        }
      }
    });
    if (
      this.dateRangeCheck(
        this.masterFromDate,
        this.masterToDate,
        e.start._date
      ) &&
      this.dateRangeCheck(
        this.masterFromDate,
        this.masterToDate,
        e.end._date
      ) &&
      this.holidayDate != moment(e.start._date).format("YYYY-MM-DD")
    ) {
      this.$modal.show("cal-add-edit-model", {
        SESSIONID: this.sessionId,
        CAMPUSID: this.campusId,
        STARTDTE: e.start,
        ENDATE: e.end,
        mFromDate: this.masterFromDate,
        mToDate: this.masterToDate,
        courseId: this.courseId,
        SUBCITYID: this.subCityId,
        AcademicCalendarMasterId: this.academicCalendarMasterId,
        CLASSID: this.classId,
        isNewRecord: true,
        BOARDID: this.boardId,
      });
    } else {
      this.onBeforeDeleteScheduleEx();
      if (this.holidayError) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: `Invalid Selection`,
          title: "danger",
          messageTypeId: PayloadMessageTypes.error,
        });
      } else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: `Please enter data between ${moment(this.masterFromDate).format(
            "DD-MM-YYYY"
          )} to ${moment(this.masterToDate).format("DD-MM-YYYY")}  date range`,
          title: "danger",
          messageTypeId: PayloadMessageTypes.error,
        });
      }
    }
    //  console.log(this.calendarviewList)
  }

  onBeforeDeleteScheduleEx() {
    //console.log(this.calendarviewList)
    if (this.calendarviewList.length > 0) {
      this.scheduleList = [];
      this.calendarviewList.forEach((element, i) => {
        let schedule = {
          id: element.academicCalendarId,
          title:
            element.calendarName == null ? element.topic : element.calendarName,
          // isAllDay: e.isAllDay,
          course: element.course,
          start: element.fromDate,
          end: element.toDate,
          location: element.subCity,
          category: "allday",
          bgColor: element.holidayTypeId ? "#fd397a" : "#5867dd",
        };

        this.scheduleList.push(schedule);
        //console.log('schedurelist' + JSON.stringify(this.scheduleList))
      });

      // this.calendarviewList = [];
    } else {
      this.scheduleList = [];
    }
  }

  allowshow() {
    if (
      this.sessionId.length > 0 &&
      this.subCityId.length > 0 &&
      this.classId.length > 0 &&
      this.academicCalendarMasterId.length > 0 &&
      this.courseId.length > 0
    )
      return true;
    return false;
  }

  private template = {
    monthDayname: function(dayname) {
      return (
        '<span class="calendar-week-dayname-name" style="color:#454545">' +
        dayname.label +
        "</span>"
      );
    },
    allday: function(schedule) {
      return (
        '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
        schedule.bgColor +
        ';color:#fff;">' +
        schedule.title +
        "</span>"
      );
    },
    popupEdit: function() {
      return "view detail";
    },
    popupDelete: function() {
      return "edit";
    },
  };

  moveTo(val) {
    if (val == 0) {
      (this.$refs["tuiCalendar"] as any).invoke("prev");
    } else {
      (this.$refs["tuiCalendar"] as any).invoke("next");
    }
    this.getMonth();
  }

  monthText = "";

  getMonth() {
    var dtes = (this.$refs["tuiCalendar"] as any).invoke("getDateRangeEnd")[
      "_date"
    ];

    dtes.setMonth(dtes.getMonth() - 1);

    this.monthText = helper.formateDateEx(dtes, "MMM - YYYY");
  }

  today() {
    (this.$refs["tuiCalendar"] as any).invoke("today");
    this.getMonth();
  }

  clickSchedule(e) {
    if (e.schedule.bgColor == "#fd397a") {
      return false;
    } else {
      this.$modal.show("view-model", {
        SESSIONID: this.sessionId,
        CAMPUSID: this.campusId,
        SUBCITYID: this.subCityId,
        CLASSID: this.classId,
        courseId: this.courseId,
        MODEL: e,
        isNewRecord: false,
        BOARDID: this.boardId,
      });
    }
  }
}
