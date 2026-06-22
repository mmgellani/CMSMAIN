import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  ITimeTableTimeTable,
  ITimeTableTimeTableVM,
  ISetupSession,
  ISetupCampus,
  ISetupProgramDetails,
  ISetupClass,
  DDLGroupModel,
  DDLModel,
  ISetupCampusProgramVM,
  ICampusCityVM,
  IRegistrationSectionCourseLinkVM,
  GetResponse
} from "../../../../models";
import {
  TimeTableTimeTableService,
  SetupCampusService,
  SetupSessionService,
  SetupProgramDetailsService,
  SetupClassService,
  SetupCampusProgramLinkService,
  RegistrationSectionCourseLinkService
} from "../../../../service";

import { TimeTableTimeTableAddEdit } from "../add-edit";
import { TimeTableTimeTableDelete } from "../delete";
import { ISetupSection } from "../../../../models/Setup/Section";
import { SetupSectionService } from "../../../../service/Setup/Section";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { ReportEngine } from "../../../../../../components";
import { TimeTableTimeTableBulkAddEdit } from "../../TimeTableBulk/add-edit";
import { StoreTypes } from "../../../../../../store";
export interface BulkDayOffInsertion extends ITimeTableTimeTableVM {
  ischeck: boolean
}
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": TimeTableTimeTableAddEdit,
    "delete-model": TimeTableTimeTableDelete,
    // "report-engine": ReportEngine,
    "bulk-timetable": TimeTableTimeTableBulkAddEdit
  }
})


export class TimeTableDayOffBulkList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: TimeTableTimeTableService = null;
  private Campusrepository: SetupCampusService = null;
  private Sessionrepository: SetupSessionService = null;
  private ProgramDetailRepository: SetupProgramDetailsService = null;
  private TimeTableRepository: TimeTableTimeTableService = null;

  private ClassRepository: SetupClassService = null;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private SectionCourserepository: RegistrationSectionCourseLinkService;

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);

  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private data: Array<ITimeTableTimeTableVM> = [];
  private Tempdata: Array<ITimeTableTimeTableVM> = [];
  private Dayofflist: Array<BulkDayOffInsertion> = [];

  CheckAllRec: boolean = false;
  fromDate: Date = new Date();
  ToDate: Date = new Date();
  private showresponse: Array<GetResponse> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusList: Array<ISetupCampus> = [];
  private programdetailList: Array<ISetupProgramDetails> = [];
  private classList: Array<ISetupClass> = [];
  private modelSection: Array<ISetupSection> = [];
  private sectionService: SetupSectionService;
  private filterString: string = "";
  sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];

  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private returnValue :string ="";

  private campusCityList: Array<ICampusCityVM> = [];

  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  private reportService: ReportsService;

  private campusid: string = "";
  private sessionid: string = "";
  private programdetailid: string = "";
  private classid: string = "";
  private campusProgramId: string = "";
  private sectionid: string = "";
  private reportData: any = [];
  private report: String = "";
  private msgShow: string = '';
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private activeDayoff: boolean = false;
  private success: boolean = false;
  private columns = [
    { key: "fullName", caption: "Name" },
    { key: "sectionName", caption: "Section" },
    { key: "staffName", caption: "Staff" },
    { key: "startTime", caption: "Start Time" },
    { key: "endTime", caption: "End Time" },
    { key: "dayName", caption: "Day" },
    { key: "ischeck", caption: "Select" }
  ];
  forAllSection: boolean=false;
  private forAllSectionId = "";
  isBreak(slot) {
    var startTiming: string = slot.split('-')[0];
    var endTiming: string = slot.split('-')[1];
    return !this.data.filter(e => e.startTime == startTiming && e.endTime == endTiming)[0].isBreak;
  }

  created() {
    this.repository = new TimeTableTimeTableService(this.$store);
    this.Campusrepository = new SetupCampusService(this.$store);
    this.Sessionrepository = new SetupSessionService(this.$store);
    this.ProgramDetailRepository = new SetupProgramDetailsService(this.$store);
    this.ClassRepository = new SetupClassService(this.$store);
    this.sectionService = new SetupSectionService(this.$store);
    this.reportService = new ReportsService(this.$store);
    this.TimeTableRepository = new TimeTableTimeTableService(this.$store);
    this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
  }

  mounted() {
    this.validatePage();
    this.loadSession();
    // this.loadCityCampus();
    // this.loadSection();
    this.activeDayoff = false;
    this.success=false;
  }


  loadCityCampus() {
    if (this.sessionid.length > 0) {
      this.campusddl = [];
      this.cityDDL = [];
      let oldObj: ICampusCityVM;
      this.campusRepo.GetCityVM().then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
      });
    }

  }

  loadProgramsOfCampus() {
    if (this.campusid.length > 0) {
      this.ddl = [];
      this.programDDL = [];
      let oldObj: ISetupCampusProgramVM;
      var key = this.sessionid + "?" + this.campusid;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      });
    }

  }
  enableCheckbox() {


    if (this.forAllSection == true) {

        this.sectionid = "";
        this.forAllSectionId = "";
        this.sectionCourseLinkList.forEach(e => {
            this.forAllSectionId = this.forAllSectionId + e.sectionId + ',';

        });
        if (this.forAllSectionId.length > 0) {
            this.forAllSectionId = this.forAllSectionId.substring(0, this.forAllSectionId.length - 1);
        }
     
    }
   
    else {

        this.forAllSectionId = "";
    }
}

  loadSession() {
    this.Sessionrepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  loadSection() {
    this.sectionService.GetFindBy("e=>e.StatusId==1").then(r => {
      this.modelSection = r as Array<ISetupSection>;
    });
  }

  loadCampus() {
    this.Campusrepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }

  loadprogramdetails() {
    this.ProgramDetailRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.programdetailList = r as Array<ISetupProgramDetails>;
    });
  }

  CheckAllrecords() {

    this.activeDayoff=false;
   this.success=false;

    if (this.CheckAllRec == true) {
     
      this.Dayofflist.forEach(element => {
        element.ischeck = true;
      });
    }

    if (this.CheckAllRec == false) {
    
      this.Dayofflist.forEach(element => {
        element.ischeck = false;
      });
    }

  }

  loadClass() {
    if (this.campusProgramId.length > 0) {
      this.ClassRepository.GetFindBy("e=>e.StatusId==1").then(r => {
        this.classList = r as Array<ISetupClass>;
      });
    }
  }

  loadProgramSection() {
    if (this.classid.length > 0) {
      this.SectionCourserepository.GetSectionData(this.campusid + `?` + this.campusProgramId + `?` + this.classid)
        .then(response => {
          this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
        });
    }

  }

  getReport() {
    this.reportData = [];
    var key =
      this.sessionid +
      "?" +
      this.campusid +
      "?" +
      this.sectionid +
      "?" +
      this.campusProgramId +
      "?" +
      this.classid;
    this.reportService.getTimeTableReport(key).then(response => {
      this.reportData = response as any;
      this.report = "assets/Reports/Resource/TimeTable/TimeTable.xml";
      this.$modal.show("report-viewer-eng");
    });
  }

  GetTimeTableViaSession() {
    
    this.activeDayoff=false;
    this.success= false;
    if (this.sectionid.length > 0 && !this.forAllSection) {
      this.Dayofflist = [];
      var ProgramDetialid = this.campusProgramLinkList.find(
        s =>
          s.sessionId == this.sessionid &&
          s.campusId == this.campusid &&
          s.campusProgramId == this.campusProgramId
      ).programDetailId;

      var fdated = this.fromDate.getFullYear() + '/' + (this.fromDate.getMonth() + 1) + '/' + this.fromDate.getDate();
      var tdated = this.ToDate.getFullYear() + '/' + (this.ToDate.getMonth() + 1) + '/' + this.ToDate.getDate();



      var key =
        this.sessionid +
        "?" +
        this.campusid +
        "?" +
        ProgramDetialid +
        "?" +
        this.classid +
        "?" +
        this.sectionid +
        "?" +
        fdated +
        "?" +
        tdated;



      this.data = [];
      this.repository
        .GetBulkDayoffUnHeld(key)
        .then(response => {
          this.data = response as Array<ITimeTableTimeTableVM>;
          this.data.forEach(e => {
            this.Dayofflist.push({
              timeTableId: e.timeTableId,
              sectionCourseLinkId: e.sectionCourseLinkId,
              staffId: e.staffId,
              staffName: e.staffName,
              sectionName: e.sectionName,
              fullName: e.fullName,
              roomId: e.roomId,
              classId: e.classId,
              dayName: e.dayName,
              roomName: e.roomName,
              sectionId: e.sectionId,
              name: e.name,
              startTime: e.startTime,
              endTime: e.endTime,
              slotTimingId: e.slotTimingId,
              session: e.session,
              campusName: e.campusName,
              sessionId: e.sessionId,
              campusId: e.campusId,
              programDetailId: e.programDetailId,
              description: e.description,
              statusId: e.statusId,
              loggerId: e.loggerId,
              programCourseLinkId: e.programCourseLinkId,
              courseId: e.courseId,
              isBreak: e.isBreak,
              ischeck: false
            })
          });

        });
    }
    else{
     
      this.Dayofflist = [];
      var ProgramDetialid = this.campusProgramLinkList.find(
        s =>
          s.sessionId == this.sessionid &&
          s.campusId == this.campusid &&
          s.campusProgramId == this.campusProgramId
      ).programDetailId;

      var fdated = this.fromDate.getFullYear() + '/' + (this.fromDate.getMonth() + 1) + '/' + this.fromDate.getDate();
      var tdated = this.ToDate.getFullYear() + '/' + (this.ToDate.getMonth() + 1) + '/' + this.ToDate.getDate();
      var key =
        this.sessionid +
        "?" +
        this.campusid +
        "?" +
        ProgramDetialid +
        "?" +
        this.classid +
        "?" +
        this.forAllSectionId +
        "?" +
        fdated +
        "?" +
        tdated;
      this.data = [];
      this.repository
        .GetBulkDayoffUnHeldForAllSection(key)
        .then(response => {
          this.data = response as Array<ITimeTableTimeTableVM>;
          this.data.forEach(e => {
            this.Dayofflist.push({
              timeTableId: e.timeTableId,
              sectionCourseLinkId: e.sectionCourseLinkId,
              staffId: e.staffId,
              staffName: e.staffName,
              sectionName: e.sectionName,
              fullName: e.fullName,
              roomId: e.roomId,
              classId: e.classId,
              dayName: e.dayName,
              roomName: e.roomName,
              sectionId: e.sectionId,
              name: e.name,
              startTime: e.startTime,
              endTime: e.endTime,
              slotTimingId: e.slotTimingId,
              session: e.session,
              campusName: e.campusName,
              sessionId: e.sessionId,
              campusId: e.campusId,
              programDetailId: e.programDetailId,
              description: e.description,
              statusId: e.statusId,
              loggerId: e.loggerId,
              programCourseLinkId: e.programCourseLinkId,
              courseId: e.courseId,
              isBreak: e.isBreak,
              ischeck: false
            })
          });

        });
     
    }
  }

  hasValue(day: string, slot: string) {
    var found: boolean = false;
    if (this.data) {
      if (this.data.length > 0) {
        var startTiming: string = slot.split('-')[0];
        var endTiming: string = slot.split('-')[1];

        if (this.data.findIndex(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming) > 0) {
          found = true;
        }
      }
    }

    return found;
  }
  saveModel() {

   

    var z = this.Dayofflist.filter(e => e.ischeck == true);
    var fromdated = this.fromDate.getFullYear() + '/' + (this.fromDate.getMonth() + 1) + '/' + this.fromDate.getDate();
    var todated = this.ToDate.getFullYear() + '/' + (this.ToDate.getMonth() + 1) + '/' + this.ToDate.getDate();
    var res = JSON.stringify(z) + '?' + fromdated + '?' + todated + '?' + '0';
   
    this.TimeTableRepository.InsertBulkDayOff(res).then(r => {
           //this.activeDayoff = true;
           
          this.msgShow = r.returnValue;
          
          
         if(r.returnValue.includes("Bulk Day Off Entered SuccessFully")){
          // this.success=true;
          // this.activeDayoff=false;
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: this.msgShow,
            title: "Success",
            messageTypeId: PayloadMessageTypes.success,
        });
        this.GetTimeTableViaSession();
         }
         else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: this.msgShow,
            title: "Error",
            messageTypeId: PayloadMessageTypes.error,
        });

         // this.success=false;
          //this.activeDayoff=true;
         }
    }
    )

  }

  saveModel2() {

    var z = this.Dayofflist.filter(e => e.ischeck == true);
    var fromdated = this.fromDate.getFullYear() + '/' + (this.fromDate.getMonth() + 1) + '/' + this.fromDate.getDate();
    var todated = this.ToDate.getFullYear() + '/' + (this.ToDate.getMonth() + 1) + '/' + this.ToDate.getDate();
    var res = JSON.stringify(z) + '?' + fromdated + '?' + todated + '?' + '1';
 
    this.TimeTableRepository.InsertBulkDayOff(res).then(
      r => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Bulk Day Off Removed SuccessFully',
          title: 'Success',
          messageTypeId: PayloadMessageTypes.success
        })

      }
    )

  }

  getClass(day: string, slot: string) {
    var text = `<span>
                    [$room]
                    <br> $course ($section)
                    <br> $staff
                  </span>`;

    if (this.data) {
      if (this.data.length > 0) {
        var startTiming: string = slot.split('-')[0];
        var endTiming: string = slot.split('-')[1];

        text = this.data.find(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming) ?
          text
            .replace('$section', this.data.find(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming).sectionName)
            .replace('$room', this.data.find(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming).roomName)
            .replace('$course', this.data.find(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming).fullName)
            .replace('$staff', this.data.find(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming).staffName) :
          ``;

        return text;
      }
    }
  }

  days: Array<string> = [];
  slots: Array<string> = [];
  fslots: Array<string> = [];

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("TimeTableDayOffBulkList" in this.user.claims == true) {
        if (this.user.claims["TimeTableDayOffBulkList"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["TimeTableDayOffBulkList"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["TimeTableDayOffBulkList"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["TimeTableDayOffBulkList"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
  // refreshData() {
  //   this.data = [];
  //   this.activeDayoff=false;
  //   this.success=false;
  //   this.CheckAllRec= null;
  //   ischeck: false;
  //   this.repository.GetAllAsync().then(response => (this.data = response as Array<ITimeTableTimeTableVM>));
  // }




}
