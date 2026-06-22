import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';

import { IHumanResourceStaff, ITimeTableTimeTableVM, ISetupZone, ISetupCity, ISetupSubCity, ISetupSession, ICampusCityVM, HolidayType, AcademicCalendarVM, ISetupCitySubCityLink, IELTopics, IBoards, ISetupClass, IAcademicCalendarType, IAcademicCalendar, IAcademicCalendarMaster, ISetupProgramDetailsVM, ProgramCourseList } from '../../../../models';
import { HumanResourceStaffService, TimeTableTimeTableService, SetupZoneService, SetupCityService, SetupSubCityService, SetupSessionService, SetupCampusService, ELTopicsService, BoardsService, SetupClassService, AcademicCalendarTypeService, AcademicCalendarService, AcademicCalendarMasterService, SetupProgramService, SetupCampusProgramLinkService, AdmissionStudentsService } from '../../../../service';
import { StoreTypes } from '../../../../../../store';

import { Calendar } from '@toast-ui/vue-calendar';
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';
import * as helper from "../../../../helper";
import { IAcademicCalendarView } from '../../../../models/academiccalendar/academicCalendar';
import moment from 'moment';
import { board } from '../../../../../../admin/layout/navigation/svgPath';
import { IVWCampusBaseProgram } from '../../../../models/Setup/CampusBaseProgram';


@Component({
  name: 'teacher-timetable',
  template: require('./index.html'),
  components: {

  }
})



export class AcademicCalendarReport extends Vue {

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  sessionRepo: SetupSessionService = new SetupSessionService(this.$store);

  sessionList: Array<ISetupSession> = [];
  calendarviewList: Array<IAcademicCalendarView> = [];
  campusddl: any[];
  cityDDL: any[];
  campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  campusCityList: any = [];
  sessionId: string = '';
  campusId: string = ''
  private reportData: any = [];
  holidaytypeid: string = '';
  topicId = ''
  boardId = ''
  academiccalendarlist: Array<AcademicCalendarVM> = [];
  private classList: Array<ISetupClass> = [];
  private repoClass: SetupClassService = new SetupClassService(this.$store)

  timetableser: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store);
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);
  private citySubCityList: Array<ISetupCitySubCityLink> = [];
  private topicList: Array<IELTopics> = []
  private topicRepo: ELTopicsService = new ELTopicsService(this.$store)
  boardList: IBoards[] = [];
  boardRepo: BoardsService = new BoardsService(this.$store);
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkbutton: boolean = false;
  private checkDate: boolean = false;
  private fromDate = new Date();
  private toDate = new Date();
  private check = '';
  subCityId = ''
  courseId = ''
  subCity = ''
  programId: string = "";
  programDetailId: string = "";
  class = ''
  board = ''
  program = ''
  academicCalendarTypeId = ''
  academicCalendarTypeList: IAcademicCalendarType[] = []
  private programList: Array<IVWCampusBaseProgram> = [];
  private programDetailList: Array<ISetupProgramDetailsVM> = [];
  repoAcademicCalendarType: AcademicCalendarTypeService = new AcademicCalendarTypeService(this.$store)
  acadmiccalendarepo: AcademicCalendarService = new AcademicCalendarService(this.$store);
  private programSRepo: SetupProgramService = new SetupProgramService(this.$store);
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

  private courseRepository: AdmissionStudentsService = new AdmissionStudentsService(
    this.$store
  );
  holidayDate = "";
  private programCourse: Array<ProgramCourseList> = [];
  private useCreationPopup = false;
  private useDetailPopup = true;
  viewBtn: boolean = false;
  classId = '';
  repoAcademicCalendarMaster: AcademicCalendarMasterService = new AcademicCalendarMasterService(this.$store)
  academicCalendarMasterList: IAcademicCalendarMaster[] = []
  academicCalendarMasterId: string = ''

  mounted() {


    this.loadSession();
    this.loadCitySubCity();
    // this.loadTopics();
    this.loadBoards();
    // this.loadAcademicCalendarType();
    this.loadClass(); 
    this.viewBtn = false;
  }

  created() {
    this.$watch('subCityId', this.loadCityCampus);
    this.$watch('campusId', this.loadPrograms);
    this.$watch('programId', this.loadProgramsOfCampus);
  }
  
  loadPrograms() {
    this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
      .then(r => {
        this.programList = r as Array<IVWCampusBaseProgram>
      })
  }

  loadProgramsOfCampus() {
    var key = this.sessionId + '?' + this.campusId + '?' + this.programId
    this.campusProgramLinkRepo.ProgDetailByProgram(key)
      .then(r => {
        this.programDetailList = r as Array<ISetupProgramDetailsVM>
      })
  }


  loadCourse() {
    this.courseRepository.GetProgramCourse().then((r) => {
      this.programCourse = r as Array<ProgramCourseList>;
    });
  }

  loadCityCampus() {
    this.campusRepo.GetCityVM()
      .then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
        this.campusCityList = this.campusCityList.filter(e => e.subCityId == this.subCityId);
      })
  }
  selectReport() {
    if (this.check == 'Monthly Planner Report') {
      this.checkbutton = true
      this.checkDate = true
    }
    if (this.check == 'Breakup Report') {
      this.checkbutton = true
      this.checkDate = false
    }

  }


  generate() {
    this.subCity = '';
    this.class = '';
    this.board = '';
    this.program = ''
    if (this.check == 'Monthly Planner Report') {
      this.subCity = this.citySubCityList.find(e=> e.subCityId == this.subCityId).subCityName;
      console.log(this.subCity);
      this.class = this.classList.find(e=> e.classId == this.classId).fullName;
      this.boardId = this.academicCalendarMasterList.find(e=> e.academicCalendarMasterId == this.academicCalendarMasterId).boardId;
      this.board = this.boardList.find(e=> e.boardId == this.boardId).fullName
      this.board = this.board.split("Board", 1).toString();
      // this.program = this.programList.find(e=> e.programId == this.programId).programName;
      this.program = this.programDetailList.find(e=> e.programDetailId == this.programDetailId).description;
      this.program = this.program.split("(Mor", 1).toString();
      this.program = this.program.split("(Aft", 1).toString();
      this.reportData = [];
      var key = this.academicCalendarMasterId + "?" + this.campusId + "?" + this.subCityId + "?" + this.programDetailId + "?" +  helper.formateDate(this.fromDate) + "?" +  helper.formateDate(this.toDate)
      this.acadmiccalendarepo.GetMonthlyPlanner(key).then(response => {
        this.reportData = response as any;
        if (this.reportData.length > 0) {
          this.reportData.forEach(element => {
            element.subCity = this.subCity
            element.class = this.class
            element.board = this.board
            element.program = this.program
  
          });
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/AcademicCalendar/monthly-planner.xml',
            show: true
          });
        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Sorry No Record Found",
            title: "Success",
            messageTypeId: PayloadMessageTypes.warning
          });

        }

      });
    } else if (this.check == 'Breakup Report') {
      this.reportData = [];
      let key = this.academicCalendarMasterId + "?" + this.campusId + "?" + this.subCityId + "?" + this.programDetailId + "?" + this.courseId
      this.acadmiccalendarepo.GetSubWiseCalendarReport(key).then(response => {
        this.reportData = response as any;
        if (this.reportData.length > 0) {
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/AcademicCalendar/breakup.xml',
            show: true
          });
        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Sorry No Record Found",
            title: "Success",
            messageTypeId: PayloadMessageTypes.warning
          });

        }

      });
    }
  }


  loadAcademicCalendarMaster() {
    this.academicCalendarMasterList = []
    if (this.sessionId.length > 0 && this.subCityId.length > 0 && this.classId.length > 0) {
      var key = this.sessionId + "?" + this.subCityId + "?" + this.classId
      this.repoAcademicCalendarMaster.GetFindByIds(key)
        .then(r => {
          this.academicCalendarMasterList = r as IAcademicCalendarMaster[]
        })
    }

  }
  loadAcademicCalendarType() {
    this.academicCalendarTypeList = [];

    this.repoAcademicCalendarType.GetFindByEx('e=>e.StatusId==1').then(res => {
      this.academicCalendarTypeList = res as Array<IAcademicCalendarType>
    });
  }
  loadClass() {
    this.classList = [];

    this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
      this.classList = res as Array<ISetupClass>
    });
  }
  loadBoards() {
    this.boardRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.boardList = r

      })
  }
  loadCitySubCity() {
    this.citySubCityList = [];
    this.subCityRepo.GetFindByCitySubCityEx("e=>e.StatusId==1")
      .then(r => {
        this.citySubCityList = r as Array<ISetupCitySubCityLink>;
      });
  }
  loadTopics() {
    this.topicRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.topicList = r as Array<IELTopics>

      })
  }
  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("academicCalendarReport" in this.user.claims == true) {
        if (this.user.claims["academicCalendarReport"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["academicCalendarReport"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["academicCalendarReport"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["academicCalendarReport"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }


  // loadCityCampus() {
  //   this.campusddl = [];
  //   this.cityDDL = [];
  //   let oldObj: ICampusCityVM;
  //   this.campusRepo.GetCityVM().then(r => {
  //     this.campusCityList = r as Array<ICampusCityVM>;
  //   });
  // }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionList = r as Array<ISetupSession>
      })

  }

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

  timezones = [{

    displayLabel: 'GMT+05:00',
    tooltip: 'Asia/Karachi',
    timezoneOffset: 540,
  }]

  private taskView = false;
  private scheduleView = ['allday'];


  private calendarList = [
    { id: '0', name: 'home' },
    { id: '1', name: 'office' }
  ];
  private scheduleList = [];

  // private useCreationPopup = false

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
    this.$modal.show('cal-add-edit-model', {
      SESSIONID: this.sessionId, CAMPUSID: this.campusId, STARTDTE: e.start, ENDATE: e.end,
      SUBCITYID: this.subCityId, AcademicCalendarMasterId: this.academicCalendarMasterId
      , CLASSID: this.classId, isNewRecord: true
    });
  }



  onBeforeDeleteScheduleEx() {

    if (this.calendarviewList.length > 0) {
      this.scheduleList = [];
      this.calendarviewList.forEach((element, i) => {

        let schedule = {
          id: element.academicCalendarId,
          title: element.calendarName,
          // isAllDay: e.isAllDay,

          course: element.course,
          start: element.fromDate,
          end: element.toDate,
          location: element.subCity,
          category: "allday",
          bgColor: '#454545'
        };

        this.scheduleList.push(schedule);
        console.log('schedurelist' + JSON.stringify(this.scheduleList))


      });

      this.calendarviewList = [];

    }
    else {
      this.scheduleList = [];
    }

  }



  allowshow() {
    if (this.sessionId.length > 0 && this.subCityId.length > 0 && this.classId.length > 0 && this.academicCalendarMasterId.length > 0)
      return true;
    return false;
  }

  private template = {
    monthDayname: function (dayname) {
      // debugger
      return '<span class="calendar-week-dayname-name" style="color:#454545">' + dayname.label + '</span>';
    },
    allday: function (schedule) {
      return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + schedule.bgColor + ';color:#fff;">' + schedule.title + '</span>';
    },
    popupEdit: function () {
      return 'view detail';
    },
    popupDelete: function () {
      return 'edit';
    }
  }

  onBeforeUpdateSchedule(e) {
    this.$modal.show('view-model', {
      SESSIONID: this.sessionId, CAMPUSID: this.campusId,
      SUBCITYID: this.subCityId
      , CLASSID: this.classId,
      MODEL: e, isNewRecord: false
    })
  }

  moveTo(val) {
    if (val == 0) {
      (this.$refs["tuiCalendar"] as any).invoke('prev');
    } else {
      (this.$refs["tuiCalendar"] as any).invoke('next')
    }
    this.getMonth();
  }

  monthText = '';

  getMonth() {
    var dtes = (this.$refs["tuiCalendar"] as any).invoke('getDateRangeEnd')["_date"];

    dtes.setMonth(dtes.getMonth() - 1);

    this.monthText = helper.formateDateEx(dtes, "MMM - YYYY");
  }

  today() {
    (this.$refs["tuiCalendar"] as any).invoke('today')
    this.getMonth()
  }

  onBeforeDeleteSchedule(e) {

    console.log(e)
    this.$modal.show('cal-add-edit-model', {
      SESSIONID: this.sessionId, CAMPUSID: this.campusId,
      SUBCITYID: this.subCityId
      , CLASSID: this.classId,
      MODEL: e, isNewRecord: false
    })
  }

}