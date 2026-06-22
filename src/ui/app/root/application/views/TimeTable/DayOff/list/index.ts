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
  ITimeTableSlotTimings,
  ICourseSection,
  ITimeTableVWSlotTimings
} from "../../../../models";
import {
  TimeTableTimeTableService,
  SetupCampusService,
  SetupSessionService,
  SetupProgramDetailsService,
  SetupClassService,
  SetupCampusProgramLinkService,
  RegistrationSectionCourseLinkService,
  TimeTableSlotTimingsService,
  RegistrationEnrollmentsService
} from "../../../../service";

import { DayOffAddEdit } from "../add-edit";
import { DayOffDelete } from "../delete";
import { ISetupSection } from "../../../../models/Setup/Section";
import { SetupSectionService } from "../../../../service/Setup/Section";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { ReportEngine } from "../../../../../../components";
import { TimeTableTimeTableBulkAddEdit } from "../../TimeTableBulk/add-edit";
import { ITimeTableTimeTableMerge } from "../../../../models/TimeTable/timetablemerge";
import { IDayOff, IDayOffVM } from "../../../../models/TimeTable/dayOff";
import { DayOffService } from "../../../../service/TimeTable/dayOff";
import { StoreTypes } from "../../../../../../store";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": DayOffAddEdit,
    "delete-model": DayOffDelete,
    // "report-engine": ReportEngine,
    "bulk-timetable": TimeTableTimeTableBulkAddEdit
  }
})
export class DayOff extends Vue {
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

  private TimetableList: Array<string> = [];

  private TimetableMergeList: Array<ITimeTableTimeTableMerge> = [];


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
  private slotTimingList: Array<ITimeTableVWSlotTimings> = []
  private repoService: TimeTableSlotTimingsService = new TimeTableSlotTimingsService(this.$store)
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private dayOffList: Array<IDayOffVM> = []
  private repoDayOff: DayOffService = new DayOffService(this.$store)
  private slotTimingId: string = '';
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

  loadSlotTiming() {
    this.repoService.GetFindByVM('s=>s.StatusId==1')
      .then(r => {
        this.slotTimingList = r as Array<ITimeTableVWSlotTimings>
      })
  }

  isBreak(slot) {
    var startTiming: string = slot.split('-')[0];
    var endTiming: string = slot.split('-')[1];
    return !this.data.filter(e => e.startTime == startTiming && e.endTime == endTiming)[0].isBreak;
  }
  loadDayOffList() {

    var key = this.sectionCourseLinkId + "?" + this.slotTimingId
    this.repoDayOff.GetAllVM(key)
      .then(r => {
        this.dayOffList = r as Array<IDayOffVM>
      });
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
    this.loadSession();
    this.loadSlotTiming();
    // this.loadDayOffList();
  }

  mounted() {
    this.validatePage();
    // this.loadSession();
    // this.loadCityCampus();
    // this.loadClass();
    // this.loadSection();

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

  loadClass() {
    if (this.campusProgramId.length > 0) {
      this.ClassRepository.GetFindBy("e=>e.StatusId==1").then(r => {
        this.classList = r as Array<ISetupClass>;
      });
    }
  }

  loadProgramSection() {
    this.SectionCourserepository.GetSectionData(this.campusid + `?` + this.campusProgramId + `?` + this.classid)
      .then(response => {
        this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
      });
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
    if (this.classid.length > 0) {
      this.TimetableList = [];
      var key = this.sessionid + "?" + this.campusid + "?" + this.classid + "?" + this.user.userId;
      this.data = [];
      this.repository
        .GetTimeTableMergeEx(key)
        .then(response => {
          this.data = response as Array<ITimeTableTimeTableVM>;

          this.days = [];
          this.slots = [];
          this.fslots = [];

          this.data.forEach(element => {
            this.TimetableList.push("'" + element.timeTableId + "'");
          });
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

          this.loadDayOffList()
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
      if ("dayOff" in this.user.claims == true) {
        if (this.user.claims["dayOff"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["dayOff"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["dayOff"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["dayOff"].indexOf("D") >= 0) {
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
    if (this.sessionid.length > 0 && this.campusid.length > 0 && this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionCourseLinkId.length > 0 && this.slotTimingId.length > 0) {

      this.$modal.show("add-edit-model", { modelVM: this.data, IsNewRecord: true })
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please select the Dropdowns",
        title: "Danger",
        messageTypeId: PayloadMessageTypes.error
      });
    }


  }
  private courseList: Array<ICourseSection> = [];
  private sectionCourseLinkId = '';
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)

  loadSections() {
    if (this.classid.length > 0) {
      this.courseList = []
      this.sectionCourseLinkId = ''
      //  this.loadScholarships();


      if (this.campusProgramId.length > 0 && this.classid.length > 0) {
        //  var campusProgramid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionid && s.campusId == this.campusid && s.programDetailId == this.programdetailid).campusProgramId;
        var key = this.campusProgramId + "?" + this.classid;
        this.enrollmentRepo.GetSectionList(key)
          .then(r => {
            this.courseList = r as Array<ICourseSection>

            // console.log(this.sectionList==null)
            //alert(this.courseList.length)
            if (this.courseList.length == 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Section not Defined',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
              });
            }
          })
      }
    }
  }

  insertModelBulk() {
    this.programdetailid = this.campusProgramLinkList.find(
      s =>
        s.sessionId == this.sessionid &&
        s.campusId == this.campusid &&
        s.campusProgramId == this.campusProgramId
    ).programDetailId;
    this.$modal.show("add-edit-modelBulk", {
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
  editModel(model: IDayOff) {

    this.$modal.show("add-edit-model", { modelVM2: model, modelVM: this.data, IsNewRecord: false })

  }

  // editModelVM(key, key1) {
  //   this.Tempdata = [];
  //   var startTiming: string = key.split('-')[0];
  //   var endTiming: string = key.split('-')[1];
  //   this.Tempdata = this.data.filter(e => e.startTime == startTiming && e.endTime == endTiming && e.dayName == key1)
  //   this.editModel(this.Tempdata[0])
  // }

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
