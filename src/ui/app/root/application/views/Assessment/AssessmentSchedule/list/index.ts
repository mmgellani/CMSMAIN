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
  ISetupBloodGroup,
  IAdmissionAdmissionFormVM,
  IHumanResourceStaff,
  ISetupClass,
  ISetupCampus,
  ISetupSession,
  ISetupCampusProgramVM,
  IAttendanceAttendenceStatus,
  IAttendanceAttendenceMaster,
  IAttendanceAttendanceDetail,
  DDLGroupModel,
  DDLModel,
  ICampusCityVM,
  IExaminationExamType,
  IRegistrationSectionCourseLinkVM,
  ICourseSection,
  ILevel,
  IProgramDetail,
  VWClassLevel,
  IAssessmentScheme,
  IAssessmentNames,
  VWAssessmentSections,
  VWAssessmentSectionMap,
  AssessmentViewList,
  RegistrationProgramCourseLinkVM,
} from "../../../../models";
import {
  SetupBloodGroupService,
  AdmissionAdmissionFormService,
  HumanResourceStaffService,
  AssessmentCategoryService,
  SetupCampusProgramLinkService,
  ExaminationExamTypeService,
  SetupCampusService,
  SetupSessionService,
  RegistrationEnrollmentsService,
  ExaminationExamDetailService,
  ExaminationExamMasterService,
  AttendanceAttendenceStatusService,
  SetupClassService,
  RegistrationSectionCourseLinkService,
  RegistrationProgramCourseLinkService,
  AssessmentScheduleService,
} from "../../../../service";
// import { ISetupBloodGroup, IAdmissionAdmissionFormVM, IHumanResourceStaff, ISetupClass, ISetupCampus, ISetupSession, ISetupCampusProgramVM, IAttendanceAttendenceStatus, IAttendanceAttendenceMaster, IAttendanceAttendanceDetail, DDLGroupModel, DDLModel, ICampusCityVM, IExaminationExamType, IRegistrationSectionCourseLinkVM, ICourseSection, ILevel, IProgramDetail, VWClassLevel, IAssessmentScheme, IAssessmentNames, VWAssessmentSections, VWAssessmentSectionMap, AssessmentViewList } from '../../../../models';
// import { SetupBloodGroupService, AdmissionAdmissionFormService, HumanResourceStaffService, AssessmentCategoryService, SetupCampusProgramLinkService, ExaminationExamTypeService, SetupCampusService, SetupSessionService, RegistrationEnrollmentsService, ExaminationExamDetailService, ExaminationExamMasterService, AttendanceAttendenceStatusService, SetupClassService, RegistrationSectionCourseLinkService, AssessmentScheduleService } from '../../../../service';

// import { AssessmentScheduleAddEdit } from '../add-edit';
import { StoreTypes } from "../../../../../../store";
import { IAssessmentCategory2 } from "../../../../models/Assessment/AssessmentCategory";
import { AssessmentCategoryDelete } from "../delete";
import { IExamApproval } from "../../../../models/Examination/ExamApproval";
import { ExaminationExamScheduleAddEdit } from "../add-edit";
import { ExaminationExamSchedulePreview } from "../../AssessmentSchemeMaster/preview";
import { IAssessmentClassLevel } from "../../../../models/Assessment/AssessmentSectionMap";
import { forEach } from "lodash";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "ExamSchedule-add-edit-model": ExaminationExamScheduleAddEdit,
    "delete-model": AssessmentCategoryDelete,
    "preview-model": ExaminationExamSchedulePreview,
  },
})
export class AssessmentSchedule extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: SetupBloodGroupService;
  private assessmentRepository: AssessmentCategoryService;
  private data: Array<AssessmentViewList> = [];
  private dataList: Array<AssessmentViewList> = [];

  private filterString: string = "";

  private canRead: boolean = false;
  private Scheduleture: boolean = false;
  private msgShow = "";
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private AdmissionformModel: Array<IAdmissionAdmissionFormVM> = [];
  private assessmentSectionList: Array<VWAssessmentSectionMap> = [];
  private reposadmission: AdmissionAdmissionFormService;
  private staffModel: Array<IHumanResourceStaff> = [];
  private repoStaff: HumanResourceStaffService;

  // private filterString: string = '';
  private campusId = "";
  private sessionId = "";
  private checkProgram = false;
  private checkStatus = false;
  private id1: "";
  private sectionId = "";
  private assessmentSectionMapId = "";
  private sectionCourseLinkId = "";
  private classId = "";
  private levelId = "";
  private programDetailId = "";
  private LevelProgramClassId = "";
  private scholarshipCriteriaId = "";
  private campusProgramId = "";
  private date: Date = new Date();
  private datestring = "";
  private sectionCourseid = "";
  private fullDayAbsent = false;
  private dateMonth: string = "";
  private title = "Confirmation";
  private campus = "";
  private CampusProgramId = "";
  private ProgramDetailId = "";
  private cclassid = "";
  private sectionCourseLink = "";
  private srollno = "";
  private assessmentSchemeMasterId = "";
  // private assessmentSchemeMasterId2 = '';
  private Messaage = "";
  private titletxt = "";
  private imagetxt = "";
  private notifType = "";
  private assessmentSchedulingDetailId = "";
  private session = "";
  private campusList: Array<ISetupCampus> = [];
  private programDetailList: Array<IProgramDetail> = [];
  private assessmentSchemeList: Array<VWAssessmentSectionMap> = [];
  private assessmentNameList: Array<IAssessmentNames> = [];
  private levelList: Array<ILevel> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private attendanceStatusList: Array<IAttendanceAttendenceStatus> = [];
  private attendanceMaster: IAttendanceAttendenceMaster;
  private attendanceDetailList: Array<IAttendanceAttendanceDetail> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];
  private campusCityList: Array<ICampusCityVM> = [];
  private examTypeList: Array<IExaminationExamType> = [];

  //private statusList1 : Array<string> = ['Approved' , 'Mareked' , 'Scheduled']

  private statusList: Array<object> = [
    { idd: 6, text: "Approved" },
    { idd: 7, text: "Marked" },
    { idd: 8, text: "Scheduled" },
  ];

  private sectionRepo: RegistrationSectionCourseLinkService;
  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];
  // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private courseList: Array<ICourseSection> = [];
  // private data: Array<IExamApproval> = [];//
  private examTypeId = "";

  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
    this.$store
  );
  private examTypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(
    this.$store
  );

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(
    this.$store
  );
  private repo: AssessmentScheduleService = new AssessmentScheduleService(
    this.$store
  );
  private examDetailRepo: ExaminationExamDetailService = new ExaminationExamDetailService(
    this.$store
  );
  private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(
    this.$store
  );
  private examMasterRepo: ExaminationExamMasterService = new ExaminationExamMasterService(
    this.$store
  );
  private classRepo: SetupClassService = new SetupClassService(this.$store);
  private classList: Array<VWClassLevel> = [];
  private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(
    this.$store
  );

  private courseLists: Array<RegistrationProgramCourseLinkVM> = [];

  private classLevelList: Array<IAssessmentClassLevel> = [];

  private columns = [
    { key: "sectionName", caption: "Section" },
    { key: "assessmentName", caption: "Exam Name" },
    { key: "failCriteria", caption: "Fail Criteria" },
    { key: "gradingCriteria", caption: "Grading Criteria" },
    { key: "weightage", caption: "Weightage" },
    { key: "month", caption: "Month" },
    { key: "assessmentStatus", caption: "Status" },
    { key: "action", caption: "Action", width: 120 },
  ];

  private programId = "";
  examName: string;

  created() {
    this.statusList = [
      { idd: 6, text: "Approved" },
      { idd: 7, text: "Marked" },
      { idd: 8, text: "Scheduled" },
    ];
    this.repository = new SetupBloodGroupService(this.$store);
    this.assessmentRepository = new AssessmentCategoryService(this.$store);
    this.reposadmission = new AdmissionAdmissionFormService(this.$store);
    this.repoStaff = new HumanResourceStaffService(this.$store);
    this.loadSession();
    this.id1 = "";
    this.datestring =
      this.date.getFullYear() +
      "-" +
      ("0" + (this.date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.date.getDate()).slice(-2);
  }

  mounted() {
    this.validatePage();
    this.loadSession();

    // this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
  }

  getstaff() {
    this.staffModel = [];
    this.repoStaff
      .GetFindBy("e => e.StatusId!=2")
      .then(
        (response) => (this.staffModel = response as Array<IHumanResourceStaff>)
      );
  }

  loadlevel2() {
    this.levelList = [];
    console.log("Loading");
    this.repoStaff
      .GetFindByLevel("e => e.StatusId!=2")
      .then((response) => (this.levelList = response as Array<ILevel>));
  }

  loadProgramDetail() {
    debugger;
    var key = this.sessionId + "?" + this.campusId + "?" + this.levelId;
    this.repoStaff
      .GetProgramDetail(key)
      .then(
        (response) =>
          (this.programDetailList = response as Array<IProgramDetail>)
      );
  }

  loadProgramsOfCampus() {
    this.campusProgramLinkList = [];
    var key = this.sessionId + "?" + this.campusId;
    this.campusProgramLinkRepo.GetAllVM(key).then((r) => {
      this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
    });
  }

  loadClassesOfLevelProgramClassMap() {
    debugger;
    this.classLevelList = [];
    this.programId = this.programDetailList.find(
      (e) => e.programDetailId == this.programDetailId
    ).programId;

    var key = this.levelId + "?" + this.campusId + "?" + this.programId;
    this.repo.GetClassesOfLevelProgramMap(key).then((r) => {
      this.classLevelList = r as Array<IAssessmentClassLevel>;
    });
  }
  getAdmissionform() {
    this.AdmissionformModel = [];
    this.reposadmission
      .GetFindBy("e => e.StatusId!=2")
      .then(
        (response) =>
          (this.AdmissionformModel = response as Array<
            IAdmissionAdmissionFormVM
          >)
      );
  }

  // get canSave(){
  //     for(let i=0;i <this.data.length; i++){
  //         if(this.data[i].isApproved){
  //             return true;
  //             break;
  //         }
  //     }
  //     return false;

  // }
  // checkAll() {
  //     if (this.isCheckedAll) {
  //         this.data.forEach(e => {
  //             e.isApproved = true;
  //         })
  //     }
  //     else {
  //         this.data.forEach(e => {
  //             e.isApproved = false;
  //         })
  //     }

  // }
  // loadProgramsOfCampus() {
  //     if (this.campusId.length > 0) {
  //         this.ddl = [];
  //         this.programDDL = [];
  //         let oldObj: ISetupCampusProgramVM;
  //         var key = this.sessionId + "?" + this.campusId;
  //         this.campusProgramLinkRepo.GetAllVM(key).then(r => {
  //             this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
  //         });
  //     }
  // }

  loadAssessmentScheme() {
    debugger;

    this.assessmentSchedulingDetailId = "";
    var key = this.programId + "?" + this.classId;
    this.campusRepo.GetAssessmentOnClass(key).then((r) => {
      this.assessmentSchemeList = r as Array<VWAssessmentSectionMap>;
    });
    this.loadSectionCourse();
  }
  loadSectionCourse() {
    this.courseLists = [];
    // this.programDetailId = this.campusProgramLinkList.find(e => e.programId == this.programId).programDetailId;
    if (this.programDetailId.length > 0 && this.classId.length > 0) {
      var key = this.programDetailId + "?" + this.classId;
      this.programCourseRepo.GetAllFilterData(key).then((r) => {
        this.courseLists = r as Array<RegistrationProgramCourseLinkVM>;
      });
    }
  }

  addParam() {
    console.log(this.checkProgram);
    if (this.checkProgram === true) {
      this.assessmentSectionMapId = "";
    }
  }
  checkStatusData() {
    console.log(this.checkStatus);
    if (this.checkStatus === true) {
      this.id1 = "";
    }
  }
  loadAssessment() {
    var key = this.assessmentSchemeMasterId + "?";
    this.repoStaff.GetAssessmentNames(key).then((r) => {
      this.assessmentNameList = r as Array<IAssessmentNames>;
      console.log("AssessmentName", this.assessmentNameList);
      //var st = this.assessmentNameList[0].
    });
  }

  loadAssessmentSections() {
    var key =
      this.sessionId +
      "?" +
      this.campusId +
      "?" +
      this.programDetailId +
      "?" +
      this.classId +
      "?" +
      this.assessmentSchemeMasterId;
    this.repoStaff.GetAssessmentSections(key).then((r) => {
      this.assessmentSectionList = r as Array<VWAssessmentSectionMap>;
    });
    this.getvalue();
    this.refreshData();
  }
  getvalue() {
    this.checkProgram;

    var assmentsectionmap = this.assessmentSectionMapId;
    this.examName = this.assessmentNameList.find(
      (e) => e.assessmentSchedulingDetailId == this.assessmentSchedulingDetailId
    ).examName;
  }
  // loadProgramDetail() {
  //     if (this.levelId.length > 0) {
  //         this.ddl = [];
  //         this.programDDL = [];
  //         this.programDetailList = [];
  //         let oldObj: ISetupCampusProgramVM;
  //         var key = this.sessionId + "?" + this.campusId + "?" + this.programId;
  //         this.repoStaff.GetProgramDetail(key).then(r => {
  //             this.programDetailList = r as Array<IProgramDetail>;
  //         });
  //     }
  // }

  loadCityCampus() {
    if (this.sessionId.length > 0) {
      this.campusddl = [];
      this.cityDDL = [];
      let oldObj: ICampusCityVM;
      this.campusRepo.GetCityVM().then((r) => {
        this.campusCityList = r as Array<ICampusCityVM>;
      });
    }
  }

  loadCampus() {
    this.campusRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.campusList = r as Array<ISetupCampus>;
    });
  }

  loadClass() {
    if (this.programId.length > 0) {
      var key = this.programId + "?" + this.levelId;

      this.repoStaff.GetClassName(key).then((r) => {
        this.classList = r as Array<VWClassLevel>;
      });
    }
    // this.loadAssessmentScheme();
  }

  loadSection() {
    if (this.classId.length > 0) {
      this.data = [];
      this.sectionCourseLinkId = "";
      var cmid = this.campusProgramLinkList.find(
        (s) =>
          s.campusId == this.campusId &&
          s.programDetailId == this.programDetailId &&
          s.sessionId == this.sessionId
      ).campusProgramId;
      var key = this.campusId + "?" + cmid + "?" + this.classId;
      this.sectionRepo
        .GetSectionData(key)
        .then(
          (response) =>
            (this.sectionList = response as Array<
              IRegistrationSectionCourseLinkVM
            >)
        );
    }
  }

  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  loadSections(key: string) {
    this.enrollmentRepo.GetSectionList(key).then((r) => {
      this.courseList = r as Array<ICourseSection>;

      // console.log(this.sectionList==null)
      //alert(this.courseList.length)
      if (this.courseList.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Section not Defined",
          title: "warning",
          messageTypeId: PayloadMessageTypes.warning,
        });
      }
    });
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("assessmentSchedule" in this.user.claims == true) {
        if (this.user.claims["assessmentSchedule"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["assessmentSchedule"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["assessmentSchedule"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["assessmentSchedule"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }
  ids: string = "";
  refreshData() {
    console.log(this.id1);
    this.data = [];
    this.Scheduleture = false;

    this.msgShow = "";
    if (
      this.assessmentSchemeMasterId.length > 0 &&
      this.assessmentSchedulingDetailId
    ) {
      this.ids = "";
      var key =
        this.sessionId +
        "?" +
        this.campusId +
        "?" +
        this.programDetailId +
        "?" +
        this.classId +
        "?" +
        this.assessmentSchemeMasterId +
        "?" +
        this.assessmentSchedulingDetailId +
        "?" +
        this.assessmentSectionMapId +
        "?" +
        this.ids;
      console.log("Key", key);
      this.assessmentRepository.GetAssessmentListVie(key).then((response) => {
        this.data = response as Array<AssessmentViewList>;
        this.dataList = response as Array<AssessmentViewList>;

        debugger;
        if (this.id1 != undefined || this.id1 != "" || this.id1 != "") {
          if (this.id1.length > 0) {
            this.ids = this.id1.toString();
            this.data = this.data.filter((e) =>
              this.id1.includes(e.assessmentStatus.toString())
            );
            // var key = this.assessmentSchemeMasterId + '?' + this.assessmentSchedulingDetailId + '?' + this.assessmentSectionMapId + '?' + this.ids;
          }
        }
      });
    }
  }

  insertModel() {
    this.$modal.show("ExamSchedule-add-edit-model", {
      model: {
        programDetailId: this.programDetailId,
        chekallsection: this.checkProgram,
        sectionlistdata: this.assessmentSectionList,
        assessmentSectionMapId: this.assessmentSectionMapId,
        examDate: new Date(),
        statusId: 1,
        examTypeId: "",
        campusProgramId: this.campusProgramId,
        classId: this.classId,
        failMasterId: "",
        gradingMasterId: "",
        sectionCourseLinkId: this.sectionCourseLinkId,
        totalMarks: 0,
        fullName: "",
        month: "",
        courseName: "",
        examName: this.examName,
        assessmentSchemeMasterId: this.assessmentSchemeMasterId,
        assessmentSchedulingDetailId: this.assessmentSchedulingDetailId,
      },
      IsNewRecord: true,
      sectionList: this.sectionCourseLinkId,
      assessmentSectionMapId: this.assessmentSectionMapId,
      programdetailid: this.programDetailId,
      sessionid: this.sessionId,
      campusId: this.campusId,
      sectionlistdata: this.assessmentSectionList,
      AllData: this.dataList,
    });
  }

  editModel(model: IAssessmentCategory2) {
    debugger;
    console.log("...........", model);
    if (model.assessmentStatus === 6) {
      this.Scheduleture = true;
      this.msgShow =
        "The approved assessment cannot be edited, please un-approve the assessment to edit it";
    } else {
      this.Scheduleture = false;
      this.$modal.show("ExamSchedule-add-edit-model", {
        model: model,
        examName: this.examName,
        assessmentSchemeMasterId: this.assessmentSchemeMasterId,
        programDetailId: this.programDetailId,
        classId: this.classId,
        IsNewRecord: false,
      });
    }
  }

  deleteModel(model: IAssessmentCategory2) {
    //     if (this.AdmissionformModel.filter(e => e.bloodGroupId == model.bloodGroupId).length > 0) {
    //         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //             text: "This Parent Child Relation Cannot be Deleted",
    //             title: "Success",
    //             messageTypeId: PayloadMessageTypes.success
    //         });
    //     }
    //    else if (this.staffModel.filter(e => e.bloodGroupId == model.bloodGroupId).length > 0) {
    //         this.$store.dispatch(StoreTypes.updateStatusBar, {
    //             text: "This Parent Child Relation Cannot be Deleted",
    //             title: "Success",
    //             messageTypeId: PayloadMessageTypes.success
    //         });
    //     }
    //     else{
    if (model.assessmentStatus === 6) {
      this.Scheduleture = true;
      this.msgShow =
        "The approved assessment cannot be Deleted, please un-approve the assessment to Deleted it";
    } else {
      this.$modal.show("delete-model", {
        model: model,
        assessmentSchedulingDetailId: this.assessmentSchedulingDetailId,
        assessmentSectionMapId: this.assessmentSectionMapId,
      });
      // }
    }
  }
}
