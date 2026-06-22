import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState, RootStoreTypes } from "../../../../../store";

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
  IRegistrationSectionCourseLinkVM
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
// import { ReportEngine, timetableTogggle } from "../../../../../../components";
import { timetableTogggle } from "../../../../../../components";
import { TimeTableTimeTableBulkAddEdit } from "../../TimeTableBulk/add-edit";
import { StoreTypes } from "../../../../../../store";


@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": TimeTableTimeTableAddEdit,
    "delete-model": TimeTableTimeTableDelete,
    // "report-engine": ReportEngine,
    "bulk-timetable": TimeTableTimeTableBulkAddEdit,
    "timetable-toggle": timetableTogggle
  }
})
export class TimeTableTimeTableList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: TimeTableTimeTableService = null;
  private Campusrepository: SetupCampusService = null;
  private Sessionrepository: SetupSessionService = null;
  private ProgramDetailRepository: SetupProgramDetailsService = null;
  private ClassRepository: SetupClassService = null;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );

  private SectionCourserepository: RegistrationSectionCourseLinkService;

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);

  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private data: Array<ITimeTableTimeTableVM> = [];
  private Tempdata: Array<ITimeTableTimeTableVM> = [];
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

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  public selectedIndex = -1;
  private toggleTimeTable: boolean = false;

  private columns = [
    // { key: "sectionName", caption: "Section" },
    // { key: "fullName", caption: "Course" },
    // { key: "staffName", caption: "StaffName" },
    // { key: "roomName", caption: "Room" },
    // { key: "dayName", caption: "DayName" },
    // { key: "startTime", caption: "StartTime" },
    // { key: "endTime", caption: "EndTime" },
    // { key: "statusId", caption: "Status" },
    // { key: "action", caption: "Action", width: 120 }
  ];

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
    this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
  }

  toggle(index) {

    if (this.selectedIndex == index) {
      this.selectedIndex = -1;
    }
    else {
      this.selectedIndex = index;
    }
  }

  mounted() {
    this.validatePage();
    this.loadSession();
  }

  loadSession() {
    this.Sessionrepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
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

      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: 'assets/Reports/Resource/TimeTable/TimeTable.xml',
        show: true
      });

      // this.report = "assets/Reports/Resource/TimeTable/TimeTable.xml";
      // this.$modal.show("report-viewer-eng");
    });
  }

  GetTimeTableViaSession() {
    debugger
    if (this.sectionid.length > 0) {
      var ProgramDetialid = this.campusProgramLinkList.find(
        s =>
          s.sessionId == this.sessionid &&
          s.campusId == this.campusid &&
          s.campusProgramId == this.campusProgramId
      ).programDetailId;

      var key =
        this.sessionid +
        "?" +
        this.campusid +
        "?" +
        ProgramDetialid +
        "?" +
        this.classid +
        "?" +
        this.sectionid;

      this.data = [];

      this.repository
        .GetTimeTableViaSession(key)
        .then(response => {
          this.data = response as Array<ITimeTableTimeTableVM>;
          this.days = [];
          this.slots = [];
          this.fslots = [];

          (this.data.filter(e => e.dayName.trim() != 'Friday')).forEach(element => {
            if (this.days.findIndex(e => e == element.dayName) < 0) {
              this.days.push(element.dayName);
            }

            if (this.slots.findIndex(e => e == (element.startTime + '-' + element.endTime)) < 0) {
              this.slots.push((element.startTime + '-' + element.endTime));
            }
          });

          (this.data.filter(e => e.dayName.trim() == 'Friday')).forEach(element => {
            if (this.fslots.findIndex(e => e == (element.startTime + '-' + element.endTime)) < 0) {
              this.fslots.push((element.startTime + '-' + element.endTime));
            }
          });

          this.slots.sort();
          this.fslots.sort();
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
  
  getClass(day: string, slot: string) {
    // 
    var text = `<span style="font-size:14px; display:block; color:#57555d;">$course</span>
    <span style="font-size:13px; display:block;color:#6879fe;">[$room]</span>
    <span style="font-size:12px; display:block;color:#b0b0b1;">$staff</span>`;



    if (this.data) {
      if (this.data.length > 0) {
        var startTiming: string = slot.split('-')[0];
        var endTiming: string = slot.split('-')[1];

        text = this.data.find(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming) ?
          text
            //.replace('$section', this.data.find(e => e.dayName == day && e.startTime == startTiming && e.endTime == endTiming).sectionName)
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
      if ("timeTableTimeTable" in this.user.claims == true) {
        if (this.user.claims["timeTableTimeTable"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["timeTableTimeTable"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["timeTableTimeTable"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["timeTableTimeTable"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }


  // refreshData() {
  //   this.data = [];
  //   this.repository
  //     .GetAllAsync()
  //     .then(response => (this.data = response as Array<ITimeTableTimeTableVM>));
  // }

  insertModel() {
    this.programdetailid = this.campusProgramLinkList.find(
      s =>
        s.sessionId == this.sessionid &&
        s.campusId == this.campusid &&
        s.campusProgramId == this.campusProgramId
    ).programDetailId;

    this.$modal.show("add-edit-model", {
      model: {
        timeTableId: "",
        sectionCourseLinkId: "",
        programCourseLinkId: "",
        staffId: "",
        roomId: "",
        dayName: "",
        slotTimingId: "",
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true,
      ClassID: this.classid,
      SessionID: this.sessionid,
      CampusId: this.campusid,
      ProgramDetailID: this.programdetailid,
      SectionId: this.sectionid,
      CityId: this.campusCityList.find(s => s.campusId == this.campusid).cityId
    });
  }
  insertModelBulk() {


    if (this.sessionid.length > 0 && this.campusid.length > 0 && this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionid.length > 0) {
      this.programdetailid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionid && s.campusId == this.campusid && s.campusProgramId == this.campusProgramId).programDetailId;
      this.$modal.show("add-edit-modelBulk", {
        model: { timeTableId: "", sectionCourseLinkId: "", programCourseLinkId: "", staffId: "", roomId: "", dayName: "", slotTimingId: "", statusId: 0, loggerId: "" },
        IsNewRecord: true, ClassID: this.classid, SessionID: this.sessionid, CampusId: this.campusid, ProgramDetailID: this.programdetailid, SectionId: this.sectionid, CityId: this.campusCityList.find(s => s.campusId == this.campusid).cityId
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }



  }
  editModel(model: ITimeTableTimeTable) {
    this.programdetailid = this.campusProgramLinkList.find(
      s =>
        s.sessionId == this.sessionid &&
        s.campusId == this.campusid &&
        s.campusProgramId == this.campusProgramId
    ).programDetailId;
    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false,
      ClassID: this.classid,
      SessionID: this.sessionid,
      CampusId: this.campusid,
      ProgramDetailID: this.programdetailid,
      SectionId: this.sectionid,
      CityId: this.campusCityList.find(s => s.campusId == this.campusid).cityId
    });
  }

  editModelVM(key, key1) {
    this.Tempdata = [];
    var startTiming: string = key.split('-')[0];
    var endTiming: string = key.split('-')[1];
    this.Tempdata = this.data.filter(e => e.startTime == startTiming && e.endTime == endTiming && e.dayName == key1)
    this.editModel(this.Tempdata[0])
  }

  insertModelVM(key, key1) {
    this.Tempdata = [];
    var startTiming: string = key.split('-')[0];
    var endTiming: string = key.split('-')[1];
    this.Tempdata = this.data.filter(e => e.startTime == startTiming && e.endTime == endTiming)

    this.programdetailid = this.campusProgramLinkList.find(
      s =>
        s.sessionId == this.sessionid &&
        s.campusId == this.campusid &&
        s.campusProgramId == this.campusProgramId
    ).programDetailId;
    console.log(this.campusCityList.find(s => s.campusId == this.campusid).cityId)
    this.$modal.show("add-edit-model", {
      model: {
        timeTableId: "",
        sectionCourseLinkId: "",
        programCourseLinkId: "",
        staffId: "",
        roomId: "",
        dayName: key1,
        slotTimingId: this.Tempdata[0].slotTimingId,
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true,
      ClassID: this.classid,
      SessionID: this.sessionid,
      CampusId: this.campusid,
      ProgramDetailID: this.programdetailid,
      SectionId: this.sectionid,
      CityId: this.campusCityList.find(s => s.campusId == this.campusid).cityId
    });


  }

  deleteModelVM(key, key1) {
    this.Tempdata = [];
    var startTiming: string = key.split('-')[0];
    var endTiming: string = key.split('-')[1];
    this.Tempdata = this.data.filter(e => e.startTime == startTiming && e.endTime == endTiming && e.dayName == key1)
    this.deleteModel(this.Tempdata[0])


  }

  deleteModel(model: ITimeTableTimeTable) {
    this.$modal.show("delete-model", { model: model });
  }
}
