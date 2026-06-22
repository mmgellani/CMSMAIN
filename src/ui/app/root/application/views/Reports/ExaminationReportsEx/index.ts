import Vue from "vue";
import Component from "vue-class-component";
// import { ReportEngine } from "../../../../../components";
import { FeeReportsService } from "../../../service/Reports/FeeReports";
import { IFeeReports } from "../../../models/Reports/FeeReports";
import { ISetupSession } from "../../../models/Setup/Session";
import { SetupSessionService } from "../../../service/Setup/Session";
import { ISetupCampus, ICampusCityVM } from "../../../models/Setup/Campus";
import { SetupCampusService } from "../../../service/Setup/Campus";
import { ISetupGender, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupCampusProgramVM, ISetupProgram, ISetupShift, ISetupClass, ISetupSection, ISetupCollector, ISetupAdmissionType, IFeeFeeHead, IRegistrationSectionCourseLink, IRegistrationSectionCourseLinkVM, ISetupBoard, ISetupReligion, ITimeTableTimeTableVM, RegistrationProgramCourseLinkVM, IExaminationExamType, StaffHODData } from "../../../models";
import { SetupGenderService } from "../../../service/Setup/Gender";
import { SetupProgramDetailsService } from "../../../service/Setup/ProgramDetails";
import { SetupCampusProgramLinkService } from "../../../service/Setup/CampusProgramLink";
import { SetupProgramService, SetupShiftService, SetupClassService, SetupSectionService, SetupCollectorService, SetupAdmissionTypeService, FeeFeeHeadService, RegistrationSectionCourseLinkService, SetupBoardService, SetupReligionService, TimeTableTimeTableService, RegistrationProgramCourseLinkService, ExaminationExamTypeService, HumanResourceStaffService, RegistrationEnrollmentsService } from "../../../service";
import { EnrolledReportsService } from "../../../service/Reports/EnrolledReports";
import { IVWCampusBaseProgram } from "../../../models/Setup/CampusBaseProgram";
import { StoreTypes } from "../../../../../store";
import { PayloadMessageTypes, IUser } from "../../../../../model";
import { ExaminationReportsService } from "../../../service/Reports/ExaminationReports";
import * as helper from '../../../helper';
import { State } from "vuex-class";
import { IRootStoreState, RootStoreTypes } from "../../../../store";
import { filter, keys } from "lodash";
import moment from "moment";

interface IQueryParam {
  param: string;
  value: string;
  name: string;
}
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    // "report-engine": ReportEngine
  }
})
export class ExaminationReportsEx extends Vue {
  private session: string = "";
  private campus: string = "";
  private repository: ExaminationReportsService;
  private Courserepository: RegistrationProgramCourseLinkService;
  private sessionModel: Array<ISetupSession> = [];
  private sessionRepo: SetupSessionService;
  private campusModel: Array<ISetupCampus> = [];
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  programDDL: Array<DDLGroupModel> = [];
  programDetailId: string = "";
  ddl: Array<DDLModel> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private sessionId: string = "";
  private campusId: string = "";
  private campusCityList: Array<ICampusCityVM> = []
  private campusRepo: SetupCampusService;
  private genderModel: Array<ISetupGender> = [];
  private genderRepo: SetupGenderService;
  private programModel: Array<ISetupProgramDetails> = [];
  private programRepo: SetupProgramDetailsService;
  private admissionReport: Array<IFeeReports> = [];
  private Staffhodlist: Array<StaffHODData> = [];
  private reportData: any = [];
  private report: String = "";
  private idCampus: string = "";
  private idSession: String = "";
  private campusProgramId: string = "";
  private idGender: string = "";
  private board: string = "";
  private fullName: string = "";
  private religionId: string = "";
  private idProgram: string = "";
  private check: string = "";
  private filterString: string = '';
  private fromDate = new Date();
  private toDate = new Date();
  private checkProg: boolean = false;
  private checkbutton3: boolean = false;
  private checkGen: boolean = false;
  private checkbutton33: boolean = false;
  private checkCou: boolean = false;

  private checkbutton: boolean = false;
  private checkbutton2: boolean = false;
  private keyAll = "";
  private keyProg = "";
  private keyGen = "";
  private keyComp = "";
  private checkDiv: boolean = false;
  private paramList: Array<IQueryParam> = [];
  private checkprogram: boolean = false;
  programId: string = "";
  private programList: Array<IVWCampusBaseProgram> = [];
  private programSRepo: SetupProgramService = new SetupProgramService(this.$store);
  private shiftList: Array<ISetupShift> = [];
  private shiftRepo: SetupShiftService = new SetupShiftService(this.$store);
  private checkshift: boolean = false;
  private classRepository: SetupClassService = null;
  private classList: Array<ISetupClass> = [];
  private checkclass: boolean = false;
  private checkAll: boolean = true;
  private checkAll2: boolean = true;
  private checkIndividual: boolean = false;
  private checksection: boolean = false;
  private checkExam: boolean = false;
  private remarksArray: any = [];
  private remarks = ''

  private boardcheck: boolean = false;
  private checkreligion: boolean = false;
  private checkcourse: boolean = false;
  private religioncheck: boolean = false;
  private checkboard: boolean = false;
  private chechkfeehead: boolean = false;
  private checkDate: boolean = false;
  private checkRemarks: boolean = false;
  private remarkscheck: boolean = false;
  private checkSection: boolean = false;
  private checkGender: boolean = false;
  private checkhod: boolean = false;

  private checksectionsumry: boolean = false;
  private checkIndividualSummary: boolean = false;



  private sectionRepo: RegistrationSectionCourseLinkService;
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private collectorList: Array<ISetupCollector> = [];
  private collectorRepository: SetupCollectorService = null;
  private examTypeList: Array<IExaminationExamType> = [];

  private checkcollector: boolean = false;
  private shiftId: string = "";
  private classId: string = "";
  private sectionId: string = "";
  private collectorId: string = "";
  private examTypeId = '';
  private sectionCourseLinkId = '';
  private hodId = '';

  private feeHeadId: string = "";
  private date: Date = new Date();
  private datestring: Date = new Date();
  private programCourseList: Array<RegistrationProgramCourseLinkVM> = [];

  private feeHeadList: Array<IFeeFeeHead> = [];
  private feeHeadRepository: FeeFeeHeadService = new FeeFeeHeadService(this.$store);
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)


  private BoardList: Array<ISetupBoard> = [];
  private BoardRepository: SetupBoardService = new SetupBoardService(this.$store);
  private examTypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(this.$store)


  private religionList: Array<ISetupReligion> = [];
  private ReligionRepo: SetupReligionService = new SetupReligionService(this.$store);
  private timeTableId = ''
  private courseId = ''
  private orderby = 'ChallanNo'
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private timeTableRepo: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store)
  private staffService: HumanResourceStaffService = null;

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('examinationReports' in this.user.claims) == true) {
        if (this.user.claims['examinationReports'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['examinationReports'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['examinationReports'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['examinationReports'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push('Home');
      }
    }
  }
  private columns = [
    { key: 'rollNo', caption: 'Roll No' },
    { key: 'studentName', caption: 'Student Name' },
    { key: 'action', caption: 'Action', width: 120 }
  ];
  private columns2 = [
    { key: 'rollNo', caption: 'Roll No' },
    { key: 'studentName', caption: 'Student Name' },
    { key: 'className', caption: 'Class Name' },
    { key: 'action', caption: 'Action', width: 120 }
  ];
  created() {
    this.repository = new ExaminationReportsService(this.$store);
    this.Courserepository = new RegistrationProgramCourseLinkService(this.$store);


    this.campusRepo = new SetupCampusService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.genderRepo = new SetupGenderService(this.$store);
    this.programRepo = new SetupProgramDetailsService(this.$store);
    this.classRepository = new SetupClassService(this.$store);
    this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
    this.collectorRepository = new SetupCollectorService(this.$store);
    this.staffService = new HumanResourceStaffService(this.$store);
    this.addParam(this.checkDate, 'Dated');
    this.datestring = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    this.loadSession();
    this.getGender();
    // this.loadPrograms();
    this.loadCityCampus();
    this.getGender();
    this.loadShift();
    this.loadClass();
    this.loadBoard();
    this.loadReligion();
    this.loadExamType();
    this.$watch('classId', this.loadCourses)
    this.$watch('programId', this.loadProgramsOfCampus)

    this.$watch('classId', this.loadSection)
    this.$watch("check", this.reset);
    this.$watch("checkExam", this.resetexam);
    this.$watch("check", this.selectReport);
    this.$watch("courseId", this.loadHodList);
    this.$watch("programDetailId", this.loadRemarks);


    this.validatePage();
  }
  reset() {
    this.sectionId = '';
    this.sectionList = [];
    this.programId = '';
    this.programList = [];
    this.programDetailId = '';
    this.campusProgramLinkList = [];
    this.shiftId = '';
    this.shiftList = [];
    this.classId = '';
    this.classList = [];
    this.idGender = '';
    this.genderModel = [];
    this.sectionCourseLinkId = '';
    this.sectionList = [];
    this.courseId = '';
    this.programCourseList = [];
    this.examTypeId = '';
    this.examTypeList = [];
    this.getGender();
    this.loadShift();
    this.loadClass();
    this.loadBoard();
    this.loadReligion();
    this.loadExamType();
    this.loadPrograms();

    this.datestring = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }
  resetexam() {
    this.examTypeId = '';
  }
  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }

  loadRemarks() {
    if (this.campusId.length > 0 && this.programDetailId.length > 0 && this.sessionId.length > 0) {
      var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;

      this.repository.CheckRemarks(cmid).then(response => {
        this.remarksArray = response as any;
      });
    }

  }

  loadExamType() {
    this.addParam(this.checkExam, 'examTypeId');
    this.examTypeRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => { this.examTypeList = r as Array<IExaminationExamType> });
  }
  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }
  getGender() {
    this.genderRepo
      .GetAll()
      .then(response => (this.genderModel = response as Array<ISetupGender>));
  }

  loadPrograms() {
    this.addParam(this.checkProg, 'programId');
    this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
      .then(r => {
        this.programList = r as Array<IVWCampusBaseProgram>
        this.loadRemarks()
      })
  }
  loadShift() {
    this.addParam(this.checkshift, 'shiftId');
    this.shiftRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.shiftList = r as Array<ISetupShift>
      })
  }

  loadClass() {
    this.addParam(this.checkclass, 'classId');
    this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.classList = r as Array<ISetupClass>;
    });
  }

  loadHodList() {
    if (this.campusId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0 && this.courseId.length > 0) {

      var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
      var key = cmid + '?' + this.programDetailId + '?' + this.courseId + '?' + this.classId;
      this.staffService.GetHODDataEx(key).then(r => {

        this.Staffhodlist = r as Array<StaffHODData>
      });
    }
  }

  //   loadSection() {
  //     if (this.campusId.length > 0 && this.programDetailId.length > 0) {

  //       var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
  // ;
  //       this.sectionRepo.GetSectionBycampusprogramid(cmid)
  //         .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
  //     }

  // }

  loadSection() {
    this.sectionList = [];
    var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
    // this.addParam(this.checksection, 'sectionId');
    if (cmid.length > 0 && this.classId.length > 0) {
      var key = cmid + '?' + this.classId
      this.enrollmentRepo.GetSectionList(key)
        .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
    }

  }

  loadBoard() {
    this.addParam(this.checkboard, 'board');
    this.BoardRepository.GetFindBy("s=>s.StatusId==1").then(r => {
      this.BoardList = r as Array<ISetupBoard>;
    });
  }

  loadReligion() {
    this.addParam(this.checkreligion, 'religionId');
    this.ReligionRepo.GetFindBy("s=>s.StatusId==1").then(r => {
      this.religionList = r as Array<ISetupReligion>;
    });
  }
  loadCourses() {
    this.addParam(this.checkCou, 'courseId');
    this.date = new Date();
    if (this.programDetailId.length > 0 && this.date != null && this.classId.length > 0) {

      // var key = this.sessionId + '?' + this.campusId + '?' + this.programDetailId + '?' + this.classId + '?' + this.datestring;
      var key = this.programDetailId + '?' + this.classId;
      // alert(key);
      this.Courserepository.GetAllFilterData(key)
        .then(response => {
          this.programCourseList = (response as Array<RegistrationProgramCourseLinkVM>);
          if (this.programCourseList.length == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'Courses not Defined',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });
          }
          // console.log(JSON.stringify(data))
          // if (this.datas.length > 0) {
          //     this.loadSections(key);
          // }

        });
    }
  }
  // courseName(option) {
  //   return '<strong>' + option.sectionName + '-' + option.fullName + '</strong>' + ' <i>' + option.startTime + '-' + option.endTime + '</i>'
  // }
  loadProgramsOfCampus() {
    this.addParam(this.checkprogram, 'ProgramId');
    this.programDetailId = ''
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programId.length > 0) {
      var key = this.sessionId + '?' + this.campusId + '?' + this.programId
      this.campusProgramLinkRepo.ProgDetailByProgram(key)
        .then(r => {
          this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>

          oldObj = this.campusProgramLinkList[0]
          this.campusProgramLinkList.forEach(e => {

            if (e.programId == oldObj.programId) {

              this.ddl.push({ id: e.programDetailId, text: e.description })
            }
            else {

              this.programDDL.push({ title: this.campusProgramLinkList[this.campusProgramLinkList.indexOf(e) - 1].programName, group: this.ddl })
              this.ddl = []
              this.ddl.push({ id: e.programDetailId, text: e.description })
            }
            oldObj = e;
          })
          this.programDDL.push({ title: oldObj.programName, group: this.ddl })

        })
    }
  }

  addParam(isChecked: boolean, param: string) {
    // this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
    if (this.check == "One Column Award List" || this.check == "Two Column Award List") {
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND cv.\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND cv.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.find(s => s.name == 'ShiftId').value = this.shiftId;
          } else {
            this.paramList.push({ param: "AND cv.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.find(s => s.name == 'ProgramDetailId').value = this.programDetailId;
          } else {
            this.paramList.push({ param: "AND cv.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.find(s => s.name == 'ClassId').value = this.classId;
          } else {
            this.paramList.push({ param: "AND cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        // alert(param)
        // alert(JSON.stringify(this.sectionCourseLinkId))
        // alert(JSON.stringify(this.sectionList))



        // alert(JSON.stringify(this.sectionId))
        if (isChecked) {
          if (this.sectionCourseLinkId.length > 0) {
            this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

            if (this.paramList.find(s => s.name == 'SectionId')) {
              this.paramList.find(s => s.name == 'SectionId').value = this.sectionId;
            } else {
              this.paramList.push({ param: "AND cv.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
            }
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
          }
        }
      }
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND cv.\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
    }
    else if (this.check == 'Exam Remarks Report') {
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND cv.\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }

      // if (param == 'FailDetailId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'FailDetailId')) {
      //       this.paramList.find(s => s.name == 'FailDetailId').value = this.failDetailId;
      //     } else {
      //       this.paramList.push({ param: "AND cv.\"FailDetailId\"", value: this.failDetailId, name: 'FailDetailId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'FailDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'FailDetailId'), 1);
      //     }
      //   }
      // }
      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND cv.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.find(s => s.name == 'ShiftId').value = this.shiftId;
          } else {
            this.paramList.push({ param: "AND cv.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.find(s => s.name == 'ProgramDetailId').value = this.programDetailId;
          } else {
            this.paramList.push({ param: "AND cv.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.find(s => s.name == 'ClassId').value = this.classId;
          } else {
            this.paramList.push({ param: "AND cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {


        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.find(s => s.name == 'SectionId').value = this.sectionId;
          } else {
            this.paramList.push({ param: "AND cv.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
          }
        }
      }
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND cv.\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND cv.\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND cv.\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }
      // if (param == 'Dated') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'Dated')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
      //       this.paramList.push({ param: "AND cv.\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
      //     } else {
      //       this.paramList.push({ param: "AND cv.\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'Dated')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
      //     }
      //   }
      // }

      if (param == 'Dated') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND LEFT(cv.\"Dated\"::TEXT, 7)", value: (this.datestring.getFullYear() + '-' + ((this.datestring.getMonth() + 1).toString().length == 1 ? '0' + (this.datestring.getMonth() + 1) : (this.datestring.getMonth() + 1))), name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND LEFT(cv.\"Dated\"::TEXT, 7)", value: (this.datestring.getFullYear() + '-' + ((this.datestring.getMonth() + 1).toString().length == 1 ? '0' + (this.datestring.getMonth() + 1) : (this.datestring.getMonth() + 1))), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
    else if (this.check == 'Exam Monthly Report') {
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND \"s\".\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"cp\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"pds\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });

          } else {
            this.paramList.push({ param: "AND \"pds\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND \"pds\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"pds\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND \"cls\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"cls\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1)
            this.paramList.push({ param: "AND \"sec\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          } else {
            this.paramList.push({ param: "AND \"sec\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"pds\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"pds\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"ext\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"ext\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }
      if (param == 'Dated') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            //this.paramList.push({ param: "AND \"exm\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
            this.paramList.push({ param: "AND LEFT(\"exm\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });

          } else {
            this.paramList.push({ param: "AND LEFT(\"exm\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
            //this.paramList.push({ param: "AND \"exm\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
    else if (this.check == 'Exam Summary Report') {
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND \"s\".\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"cp\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"pds\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });

          } else {
            this.paramList.push({ param: "AND \"pds\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND \"pds\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"pds\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND \"cls\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"cls\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1)
            this.paramList.push({ param: "AND \"sec\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          } else {
            this.paramList.push({ param: "AND \"sec\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"pds\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"pds\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"ext\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"ext\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }
      if (param == 'Dated') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            //this.paramList.push({ param: "AND \"exm\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
            this.paramList.push({ param: "AND LEFT(\"exm\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });

          } else {
            this.paramList.push({ param: "AND LEFT(\"exm\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
            //this.paramList.push({ param: "AND \"exm\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
    else if (this.check == 'Student Wise Analysis Report BLANK') {
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND cv.\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND cv.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.find(s => s.name == 'ShiftId').value = this.shiftId;
          } else {
            this.paramList.push({ param: "AND cv.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.find(s => s.name == 'ProgramDetailId').value = this.programDetailId;
          } else {
            this.paramList.push({ param: "AND cv.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.find(s => s.name == 'ClassId').value = this.classId;
          } else {
            this.paramList.push({ param: "AND cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.find(s => s.name == 'SectionId').value = this.sectionId;
          } else {
            this.paramList.push({ param: "AND cv.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
          }
        }
      }
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND cv.\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CourseId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1)
            this.paramList.push({ param: "AND \"cv\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          } else {
            this.paramList.push({ param: "AND \"cv\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1);
          }
        }
      }
    }
    else if (this.check == "Combined Subject Exam") {
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND cpp.\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND pd.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.find(s => s.name == 'ShiftId').value = this.shiftId;
          } else {
            this.paramList.push({ param: "AND pd.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.find(s => s.name == 'ProgramDetailId').value = this.programDetailId;
          } else {
            this.paramList.push({ param: "AND pd.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.find(s => s.name == 'ClassId').value = this.classId;
          } else {
            this.paramList.push({ param: "AND cl.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {


        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.find(s => s.name == 'SectionId').value = this.sectionId;
          } else {
            this.paramList.push({ param: "AND se.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
          }
        }
      }
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND st.\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'ExamTypeId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }
      if (param == 'Dated') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND \"em\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }

    else if (this.check == 'Exam Gazette Report') {
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND \"ms\".\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"ms\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });

          } else {
            this.paramList.push({ param: "AND \"ms\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      // if (param == 'SectionId') {
      //   this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'SectionId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1)
      //       this.paramList.push({ param: "AND \"ms\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
      //     } else {
      //       this.paramList.push({ param: "AND \"ms\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'SectionId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
      //     }
      //   }
      // }
      if (param == 'SectionId') {
        // this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1);
          }
        }
      }


      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }
      if (param == 'Dated') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND LEFT(\"ms\".\"Dte\"::TEXT, 7)", value: this.getDate, name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND LEFT(\"ms\".\"Dte\"::TEXT, 7)", value: this.getDate, name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }

    }
    else if (this.check == 'Exam Subject Wise') {
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND \"st\".\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"cpp\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });

          } else {
            this.paramList.push({ param: "AND \"pd\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"pd\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND \"cl\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"cl\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        // this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1)
            this.paramList.push({ param: "AND \"em\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      // if (param == 'ProgramDetailId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     } else {
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
      //     }
      //   }
      // }


      if (param == 'CourseId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1)
            this.paramList.push({ param: "AND \"pcl\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          } else {
            this.paramList.push({ param: "AND \"pcl\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }


      if (param == 'Dated') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND LEFT(\"em\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND LEFT(\"em\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
    else if (this.check == 'Subject-wise Award List') {
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND \"st\".\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"cpp\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });

          } else {
            this.paramList.push({ param: "AND \"pd\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"pd\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND \"cl\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"cl\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        // this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1)
            this.paramList.push({ param: "AND \"em\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      // if (param == 'ProgramDetailId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     } else {
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
      //     }
      //   }
      // }


      if (param == 'CourseId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1)
            this.paramList.push({ param: "AND \"pcl\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          } else {
            this.paramList.push({ param: "AND \"pcl\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }


      if (param == 'Dated') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND LEFT(\"em\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND LEFT(\"em\".\"Dated\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
    ////atten
    else if (this.check == 'Exam Resultt Report') {
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND \"ms\".\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"ms\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });

          } else {
            this.paramList.push({ param: "AND \"ms\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        // this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      // if (param == 'ProgramDetailId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     } else {
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
      //     }
      //   }
      // }


      if (param == 'CourseId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"ms\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"ms\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }


      if (param == 'Dated') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND LEFT(\"ms\".\"Dte\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND LEFT(\"ms\".\"Dte\"::TEXT,7)", value: moment(this.datestring).format('YYYY-MM'), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
    else if (this.check == 'Student Wise Analysis Report') {
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND \"st\".\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"cpp\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CampusId'), 1);
          }
        }
      }
      if (param == 'ProgramId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });

          } else {
            this.paramList.push({ param: "AND \"pd\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }

      if (param == 'ShiftId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"pd\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ShiftId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1);
          }
        }
      }
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND \"cl\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"cl\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }
      if (param == 'SectionId') {
        // this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1)
            this.paramList.push({ param: "AND \"em\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"SectionCourseLinkId\"", value: this.sectionCourseLinkId, name: 'SectionCourseLinkId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'SectionCourseLinkId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionCourseLinkId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      // if (param == 'ProgramDetailId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     } else {
      //       this.paramList.push({ param: "AND \"pd\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
      //     }
      //   }
      // }


      if (param == 'CourseId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1)
            this.paramList.push({ param: "AND \"pcl\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          } else {
            this.paramList.push({ param: "AND \"pcl\".\"CourseId\"", value: this.courseId, name: 'CourseId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CourseId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CourseId'), 1);
          }
        }
      }

      if (param == 'ExamTypeId') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }


      if (param == 'Dated') {

        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND \"em\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND \"em\".\"Dated\"", value: helper.formateDate(this.datestring), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
    else if (this.check == 'ExamTypeWise') {
      if (param == 'ExamTypeId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1)
            this.paramList.push({ param: "AND \em\.\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          } else {
            this.paramList.push({ param: "AND \em\.\"ExamTypeId\"", value: this.examTypeId, name: 'ExamTypeId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ExamTypeId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ExamTypeId'), 1);
          }
        }
      }

      if (param == 'Dated') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1)
            this.paramList.push({ param: "AND LEFT(em.\"Dated\"::TEXT, 7)", value: (this.datestring.getFullYear() + '-' + ((this.datestring.getMonth() + 1).toString().length == 1 ? '0' + (this.datestring.getMonth() + 1) : (this.datestring.getMonth() + 1))), name: 'Dated' });
          } else {
            this.paramList.push({ param: "AND LEFT(em.\"Dated\"::TEXT, 7)", value: (this.datestring.getFullYear() + '-' + ((this.datestring.getMonth() + 1).toString().length == 1 ? '0' + (this.datestring.getMonth() + 1) : (this.datestring.getMonth() + 1))), name: 'Dated' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'Dated')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Dated'), 1);
          }
        }
      }
    }
  }

  get getDate() {
    var month = (this.datestring.getMonth() + 1);

    return this.datestring.getFullYear() + '-' + (month < 10 ? '0' + month : month);
  }

  selectReport() {
    if (this.check == "One Column Award List") {
      this.checkbutton3 = false
      this.checkbutton33 = false
      this.checkAll = true;
      this.checkSection = true;
      this.checkGender = true;
      this.checkAll2 = true;
      this.checkIndividual = false;
      this.checkbutton = true;
      this.checkcourse = true;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.checkIndividualSummary = true;
    } else
      if (this.check == "Two Column Award List") {
        this.checkbutton3 = false
        this.checkAll = true;
        this.checkSection = true;
        this.checkbutton33 = false
        this.checkGender = true;
        this.checkAll2 = true;
        this.checkIndividual = false;
        this.checkbutton = true;
        this.checkcourse = true;
        this.checkRemarks = false;
        this.checkhod = false;
        this.checksectionsumry = true;
        this.checkIndividualSummary = true;
      } else
        if (this.check == "Exam Subject Wise") {
          this.checkbutton3 = false
          this.checkAll = true;
          this.checkSection = true;
          this.checkGender = true;
          this.checkbutton33 = false
          this.checkAll2 = true;
          this.checkIndividual = false;
          this.checkbutton = true;
          this.checkcourse = true;
          this.checkRemarks = false;
          this.checkhod = false;
          this.checksectionsumry = true;
          this.checkIndividualSummary = true;
        }
        else
          if (this.check == "Subject-wise Award List") {
            this.checkbutton3 = false
            this.checkAll = true;
            this.checkSection = true;
            this.checkGender = true;
            this.checkAll2 = true;
            this.checkIndividual = false;
            this.checkbutton = true;
            this.checkbutton33 = false
            this.checkcourse = true;
            this.checkRemarks = false;
            this.checkhod = false;
            this.checksectionsumry = true;
            this.checkIndividualSummary = true;
          }
          else
            if (this.check == "Student Wise Analysis Report") {
              this.checkbutton3 = false
              this.checkAll = true;
              this.checkSection = true;
              this.checkGender = true;
              this.checkAll2 = false;
              this.checkIndividual = false;
              this.checkbutton = true;
              this.checkcourse = true;
              this.checkRemarks = false;
              this.checkbutton33 = false
              this.checkhod = false;
              this.checksectionsumry = true;
              this.checkIndividualSummary = true;
            }
            else
              if (this.check == "Student Wise Analysis Report BLANK") {
                this.checkbutton3 = false
                this.checkAll = true;
                this.checkSection = true;
                this.checkGender = true;
                this.checkAll2 = false;
                this.checkIndividual = false;
                this.checkbutton33 = false
                this.checkbutton = true;
                this.checkcourse = true;
                this.checkRemarks = false;
                this.checkhod = false;
                this.checksectionsumry = true;
                this.checkIndividualSummary = true;
              }
              else
                if (this.check == "Student Wise Evaluation Report") {
                  this.checkbutton3 = false
                  this.checkAll = true;
                  this.checkSection = true;
                  this.checkbutton33 = false
                  this.checkGender = true;
                  this.checkAll2 = false;
                  this.checkIndividual = false;
                  this.checkbutton = true;
                  this.checkcourse = true;
                  this.checkRemarks = false;
                  this.checkhod = false;
                  this.checksectionsumry = true;
                  this.checkIndividualSummary = true;
                }
                else
                  if (this.check == "Department Wise Evaluation Report") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkSection = false;
                    this.checkbutton33 = false
                    this.checkGender = false;
                    this.checkAll2 = true;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = true;
                    this.checkRemarks = false;
                    this.checkhod = true;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;


                  }
                  else if (this.check == "Exam Individual Report") {
                    this.checkbutton3 = true
                    this.checkAll = false;
                    this.checkbutton33 = false
                    this.checkSection = false;
                    this.checkGender = false;
                    this.checkAll2 = false;
                    this.checkIndividual = true;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  }
                  else if (this.check == "Exam Individual Summary") {


                    this.checkbutton3 = true;
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkbutton33 = false
                    this.checkGender = false;
                    this.checkAll2 = false;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = false;
                    this.checkIndividualSummary = false;

                  } else if (this.check == "Exam Individual Summary Detail") {
                    this.checkbutton3 = true
                    this.checkAll = false;
                    this.checkSection = false;
                    this.checkGender = false;
                    this.checkbutton33 = false
                    this.checkAll2 = false;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  } else if (this.check == "Academic Performance Report") {
                    this.checkbutton3 = false;
                    this.checkbutton33 = true
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkGender = false;
                    this.checkAll2 = false;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = false;
                    this.checkIndividualSummary = false;
                  }
                  else if (this.check == "Exam Monthly Report") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkbutton33 = false
                    this.checkGender = true;
                    this.checkAll2 = true;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  }
                  else if (this.check == "Exam Summary Report") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkGender = true;
                    this.checkbutton33 = false
                    this.checkAll2 = true;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = false;
                    this.checkIndividualSummary = true;
                  }
                  else if (this.check == "Exam Remarks Report") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkGender = true;
                    this.checkAll2 = true;
                    this.checkbutton33 = false
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = true;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  }

                  else if (this.check == "Exam Resultt Report") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkbutton33 = false
                    this.checkSection = true;
                    this.checkGender = true;
                    this.checkAll2 = true;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = true;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  }
                  else if (this.check == "Section wise Award List") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkbutton33 = false
                    this.checkGender = false;
                    this.checkAll2 = false;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;

                  }
                  else if (this.check == "ExamTypeWise") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkbutton33 = false
                    this.checkGender = true;
                    this.checkAll2 = true;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  }
                  else if (this.check == "Combined Subject Exam") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkSection = true;
                    this.checkbutton33 = false
                    this.checkGender = true;
                    this.checkAll2 = true;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  }
                  else if (this.check == "Exam Gazette Report") {
                    this.checkbutton3 = false
                    this.checkAll = true;
                    this.checkbutton33 = false
                    this.checkSection = true;
                    this.checkGender = true;
                    this.checkAll2 = true;
                    this.checkIndividual = false;
                    this.checkbutton = true;
                    this.checkcourse = false;
                    this.checkRemarks = false;
                    this.checkhod = false;
                    this.checksectionsumry = true;
                    this.checkIndividualSummary = true;
                  }
  }

  generate() {

    if (this.check == "One Column Award List") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getAwardList(where)

    } else if (this.check == "Two Column Award List") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getAwardListTwo(where)
    } else if (this.check == "Exam Monthly Report") {
      var where = `AND ("sess".\"SessionId\" = ''` + this.sessionId + `'') AND ("cp".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getExamMonthly(where)
    } else if (this.check == "Exam Summary Report") {
      this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
      var where = `AND ("sess".\"SessionId\" = ''` + this.sessionId + `'') AND ("cp".\"CampusId\" = ''` + this.campusId + `'') AND "pds"."ProgramId"=''` + this.programId + `'' AND "pds"."ProgramDetailId"=''` + this.programDetailId + `'' AND "cls"."ClassId"=''` + this.classId + `'' AND "sec"."SectionId"=''` + this.sectionId + `'' AND LEFT("exm"."Dated"::TEXT,7)=''` + moment(this.datestring).format('YYYY-MM') + `''`;

      // this.paramList.forEach(e => {

      //   where = where + " " + e.param + "=''" + e.value + "''";

      // })
      this.getExamMonthlyExx(where)
    }
    else if (this.check == "Exam Remarks Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      });

      if (this.remarks != '') {
        this.remarks = `''` + this.remarks.toString().replace(/[,]/g, "'',''") + `''`

        where = where.concat(` AND cv.\"OverAllRemark\" IN (` + this.remarks + `)`);
      }

      this.getExamRemarks(where)
      console.log(where);
    }

    else if (this.check == "Exam Resultt Report") {

      var where = `AND ("ms".\"SessionId\" = ''` + this.sessionId + `'') AND ("ms".\"CampusId\" = ''` + this.campusId + `'')`;
      //alert("fail/pass")
      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      if (this.remarks != '') {
        this.remarks = `''` + this.remarks.toString().replace(/[,]/g, "'',''") + `''`
        //UPPER (ms."OverAllResult")
        where = where.concat(` AND  LOWER("ms".\"OverAllResult\") IN (LOWER(` + this.remarks + `))`);

      }
      this.remarks = "";
      this.remarksArray = [];
      this.loadRemarks();
      // this.getExamSubjectWiseAtten(where)
      this.GetGazetteAttendData(where)

    }
    else if (this.check == "Section wise Award List") {

      var where = `AND ("ms".\"SessionId\" = ''` + this.sessionId + `'') AND ("ms".\"CampusId\" = ''` + this.campusId + `'') AND ("ms".\"ProgramId\" = ''` + this.programId + `'') AND ("ms".\"ProgramDetailId\" = ''` + this.programDetailId + `'') AND ("ms".\"ClassId\" = ''` + this.classId + `'') AND ("ms".\"SectionCourseLinkId\" = ''` + this.sectionCourseLinkId + `'')`;
      // this.paramList.forEach(e => {
      //   where = where + " " + e.param + "=''" + e.value + "''";
      // })

      this.GetExamSectiontestwiseReport(where)

    }
    else if (this.check == "Exam Individual Report") {
      this.getExamIndividReport()

    } else if (this.check == "Exam Individual Summary") {
      if (this.filterString.length > 0) {
        this.getExamIndividSummary()
      } else {
        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
        var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId;

        // this.paramList.forEach(e => {

        //   where = where + " " + e.param + "=''" + e.value + "''";

        // })
        this.getExamIndividSummarySection(where)
      }

    } else if (this.check == "Exam Individual Summary Detail") {
      this.getExamIndividSummaryDetail()

    } else if (this.check == "Academic Performance Report") {
      // this.getAcademicPerformance()
      
      if (this.filterString.length > 0) {
        this.getAcademicPerformance()
      } else {
        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
        var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId;

        // this.paramList.forEach(e => {

        //   where = where + " " + e.param + "=''" + e.value + "''";

        // })
        this.getAcademicPerReport(where)
      }

    }
    else if (this.check == "ExamTypeWise") {
      var where = `(em.\"SectionCourseLinkId\" = '` + this.sectionCourseLinkId + `')`;
      this.paramList.forEach(e => {

        where = where + " " + e.param + "='" + e.value + "'";

      })
      if (this.sectionCourseLinkId.length > 0) {
        this.GetExamTypeWiseReport(where)
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Please select Section',
          title: 'warning',
          messageTypeId: PayloadMessageTypes.warning
        });
      }
    }
    else if (this.check == "Combined Subject Exam") {
      var where = `AND ("ss".\"SessionId\" = ''` + this.sessionId + `'') AND ("cpp".\"CampusId\" = ''` + this.campusId + `'') AND ("em".\"ExamTypeId\" = ''` + this.examTypeId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getCombinedSubjectExam(where)
    }
    else if (this.check == "Exam Subject Wise") {
      var where = `AND ("ss".\"SessionId\" = ''` + this.sessionId + `'') AND ("cpp".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getExamSubjectWise(where)
    }
    else if (this.check == "Subject-wise Award List") {
      var where = `AND ("ss".\"SessionId\" = ''` + this.sessionId + `'') AND ("cpp".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getSubjectWiseAwardList(where)
    }
    else if (this.check == "Student Wise Analysis Report") {
      var where = `AND ("ss".\"SessionId\" = ''` + this.sessionId + `'') AND ("cpp".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getExamSubjectWiseEx(where)
    }
    else if (this.check == "Student Wise Analysis Report BLANK") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudents(where)
    }
    else if (this.check == "Student Wise Evaluation Report") {

      this.getEvaluateStudents()
    }
    else if (this.check == "Department Wise Evaluation Report") {

      this.getEvaluateStudentsEx()
    }
    else if (this.check == "Exam Gazette Report") {
      var where = `AND ("ms".\"SessionId\" = ''` + this.sessionId + `'') AND ("ms".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.GetGazetteData(where)
    }
  }
  getExamIndividSummaryDetail() {

    this.reportData = [];
    var key = this.filterString;
    this.displayList = []
    this.repository.GetExamIndividSummary(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        //  this.displayList=this.reportData;
        var oldObj = this.reportData[0];
        this.displayList.push(oldObj);
        this.reportData.forEach(e => {
          console.log(e.rollNo + 'hehe')
          if (e.rollNo != oldObj.rollNo) {
            this.displayList.push(e);
          }
          oldObj = e;
        })
      }

    });
  }
  getAcademicPerReport(key){
    this.reportData = [];
    this.repository.GetAcademicPerReport(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.reportData.forEach(element => {
          element.result = JSON.parse(element.result)

        });




        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/academic-performance-report-ex.xml',
          show: true
        });
      }
    });
  }
  getAcademicPerformance() {

    this.reportData = [];
    var key = this.filterString;
    this.displayList = []
    this.repository.GetAcademicPerformance(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        //  this.displayList=this.reportData;
        var oldObj = this.reportData[0];
        this.displayList.push(oldObj);
        this.reportData.forEach(e => {
          console.log(e.rollNo + 'hehe')
          if (e.rollNo != oldObj.rollNo || e.className != oldObj.className) {
            this.displayList.push(e);
          }
          oldObj = e;
        })
      }

    });
  }
  private displayList = []
  getExamIndividSummary() {

    this.reportData = [];
    var key = this.filterString;
    this.displayList = []
    this.repository.GetExamIndividSummary(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        //  this.displayList=this.reportData;
        var oldObj = this.reportData[0];
        this.displayList.push(oldObj);
        this.reportData.forEach(e => {
          console.log(e.rollNo + 'hehe')
          if (e.rollNo != oldObj.rollNo) {
            this.displayList.push(e);
          }
          e.monthNumber = e.monthNumber.toString()
          oldObj = e;
        })
      }
      // this.reportData = response as any;
      // // this.reportData.forEach(element => { element.displayName = this.user.displayName
      // // });
      // this.$store.dispatch(RootStoreTypes.reportOperation, {
      //   data: this.reportData as any,
      //   path: '/assets/Reports/Resource/Examination/exam-individual-summary.xml',
      //   show: true
      // });
    });
  }
  viewReport(item) {
    var datas = this.reportData.filter(s => s.rollNo == item.rollNo);
    console.log(datas)
    if (this.check == "Exam Individual Summary") {
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: datas as any,
        path: '/assets/Reports/Resource/Examination/exam-individual-summary.xml',
        show: true
      });

    } else if (this.check == "Exam Individual Summary Detail") {
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: datas as any,
        path: '/assets/Reports/Resource/Examination/exam-individual-summary-detail.xml',
        show: true
      });

    }  else if (this.check == "Academic Performance Report") {
    var datasss = this.reportData.filter(s => s.rollNo == item.rollNo && s.className == item.className);
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: datasss as any,
        path: '/assets/Reports/Resource/Examination/academic-performance-report.xml',
        show: true
      });

    } else if (this.check == "Exam Individual Report") {

      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: datas as any,
        path: '/assets/Reports/Resource/Examination/exam-result-report.xml',
        show: true
      });


    }
    //this.reportData = response as any;
    // this.reportData.forEach(element => { element.displayName = this.user.displayName
    // });



  }
  getExamIndividReport() {

    this.reportData = [];
    this.displayList = [];
    if (this.examTypeId.length > 0 && this.filterString.length > 0 && this.classId.length > 0) {

      this.reportData = [];
      var key = this.filterString + "?" + this.examTypeId + "?" + this.datestring.getFullYear() + '-' + (this.datestring.getMonth() + 1) + '-' + '01' + '?' + this.classId;
      //alert(key)
      this.displayList = []
      this.repository.GetExamIndiviReport(key).then(response => {
        this.reportData = response as any;
        if (this.reportData.length > 0) {
          //  this.displayList=this.reportData;
          var oldObj = this.reportData[0];
          this.displayList.push(oldObj);
          this.reportData.forEach(e => {
            console.log(e.rollNo + 'hehe')
            if (e.rollNo != oldObj.rollNo) {
              this.displayList.push(e);
            }
            oldObj = e;
          })
        }

      });
    } else if (this.filterString.length > 0 && this.classId.length > 0) {
      this.reportData = [];
      var key = this.filterString + "?" + this.datestring.getFullYear() + '-' + (this.datestring.getMonth() + 1) + '-' + '01' + '?' + this.classId;

      this.repository.GetExamIndiviReportExamtype(key).then(response => {
        this.reportData = response as any;
        if (this.reportData.length > 0) {
          //  this.displayList=this.reportData;
          var oldObj = this.reportData[0];
          this.displayList.push(oldObj);
          this.reportData.forEach(e => {
            console.log(e.rollNo + 'hehe')
            if (e.rollNo != oldObj.rollNo) {
              this.displayList.push(e);
            }
            oldObj = e;
          })
        }
        // this.$store.dispatch(RootStoreTypes.reportOperation, {
        //   data: this.reportData as any,
        //   path: '/assets/Reports/Resource/Examination/exam-result-report.xml',
        //   show: true
        // });
      });
    }
  }
  getEnrolledStudents(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContactEx(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.reportData.forEach(element => {
          element.courseName = this.programCourseList.find(e=> e.courseId == this.courseId).courseName

        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/student-result-sheet.xml',
          show: true
        });
      }
    });
  }
  getEvaluateStudents() {
    this.reportData = [];
    var key = this.sectionCourseLinkId + "?" + this.courseId;
    // alert(key)
    this.repository.GetEvaluateStudents(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/sectionwise-evaluation-report.xml',
          show: true
        });
      }
    });
  }
  getEvaluateStudentsEx() {
    this.reportData = [];
    if (this.campusId.length > 0 && this.programId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0 && this.hodId.length > 0 && this.examTypeId.length > 0 && this.datestring.toString() != '' && this.courseId.length > 0) {
      var key = this.campusId + "?" + this.hodId + "?" + this.examTypeId + "?" + (this.datestring.getFullYear() + '-' + ((this.datestring.getMonth() + 1).toString().length == 1 ? '0' + (this.datestring.getMonth() + 1) : (this.datestring.getMonth() + 1)));

      //  alert(key)
      this.repository.GetEvaluateStudentsEx(key).then(response => {
        if (response == null || response == [] || response == 0) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "No Record Found",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        }
        else {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/department-evaluation-report.xml',
            show: true
          });
        }
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'Please Select All DropDowns First!',
        title: 'warning',
        messageTypeId: PayloadMessageTypes.warning
      });

    }
  }
  getAwardList(key) {
    this.reportData = [];
    this.repository.GetAwardList(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/Award-List-One-Column.xml',
          show: true
        });
      }
    });
  }
  getAwardListTwo(key) {
    this.reportData = [];
    this.repository.GetAwardList(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/Award-List-Two-Column.xml',
          show: true
        });
      }
    });
  }
  getExamSubjectWise(key) {
    this.reportData = [];
    this.repository.GetExamSubjectWise(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          //path: '/assets/Reports/Resource/Examination/examsubjectwise.xml',
          path: '/assets/Reports/Resource/Examination/examsubjectwise-percent.xml',
          show: true
        });
      }
    });
  }

  getSubjectWiseAwardList(key) {

    this.reportData = [];
    this.repository.GetExamSubjectWiseEx(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        console.log(JSON.stringify(this.reportData))
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/examsubjectwiseEX.xml',
          show: true
        });
      }
    });


  }

  getExamSubjectWiseEx(key) {
    this.reportData = [];
    this.repository.GetExamSubjectWise(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/examsubjectwisea3.xml',
          show: true
        });
      }
    });
  }
  getCombinedSubjectExam(key) {
    this.reportData = [];
    this.repository.GetCombinedSubjectExam(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/combined-subject-exam.xml',
          show: true
        });
      }
    })
  }

  GetGazetteData(key) {
    //    if (this.examTypeId.length > 0) {
    if (this.sectionCourseLinkId.length > 0) {

      this.reportData = [];
      this.repository.GetGazetteData(key).then(response => {
        if (response == null || response == [] || response == 0) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "No Record Found",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        }
        else {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/exam-result-scheet.xml',
            show: true
          });
        }
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Section is Mandatory Paramter",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });
    }
  }
  GetGazetteAttendData(key) {
    if (this.sectionCourseLinkId.length > 0) {

      this.reportData = [];
      this.repository.GetGazetteData(key).then(response => {
        if (response == null || response == [] || response == 0) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "No Record Found",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        }
        else {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/exam-result-scheet-atten.xml',
            show: true
          });
        }
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Select Mandatory Paramters",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });
    }

  }
  GetExamSectiontestwiseReport(key) {
    if (this.sectionCourseLinkId.length > 0) {
      this.reportData = [];
      this.repository.ExamSectiontestwise(key).then(response => {
        if (response == null || response == [] || response == 0) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "No Record Found",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        }
        else {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/examsectionwiseTestreport.xml',
            show: true
          });
        }
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Select Mandatory Paramters",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });
    }
  }
  getExamMonthly(key) {
    this.reportData = [];
    this.repository.GetExamMonthly(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/exam-result-report.xml',
          show: true
        });
      }
    });
  }

  getExamMonthlyExx(key) {
    this.reportData = [];
    this.repository.GetExamMonthlyExy(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        // this.reportData = this.reportData.toString().replace(/\\/g, "");
        this.reportData.forEach(element => {
          element.result = JSON.parse(element.result)

        });

        this.reportData.forEach(element => {
          element.fromDate = moment(this.datestring).format('MMMM') + ' - ' + moment(this.datestring).format('YYYY')

        });
        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/exam-section-summary-exam2.xml',
          show: true
        });
      }
    });
  }
  getExamIndividSummarySection(key) {
    this.reportData = [];
    this.repository.GetExamIndividSummarySection(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.reportData.forEach(element => {
          element.result = JSON.parse(element.result)

        });




        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/exam-individual-summary-all.xml',
          show: true
        });
      }
    });

    // this.reportData = [];
    // this.displayList = []
    // this.repository.GetExamIndividSummarySection(key).then(response => {
    //   this.reportData = response as any;
    //   if (this.reportData.length > 0) {
    //     //  this.displayList=this.reportData;
    //     var oldObj = this.reportData[0];
    //     this.displayList.push(oldObj);
    //     this.reportData.forEach(e => {
    //       console.log(e.rollNo + 'hehe')
    //       if (e.rollNo != oldObj.rollNo) {
    //         this.displayList.push(e);
    //       }
    //       oldObj = e;
    //     })
    //   }
    // this.reportData = response as any;
    // // this.reportData.forEach(element => { element.displayName = this.user.displayName
    // // });
    // this.$store.dispatch(RootStoreTypes.reportOperation, {
    //   data: this.reportData as any,
    //   path: '/assets/Reports/Resource/Examination/exam-individual-summary.xml',
    //   show: true
    // });
    // });
  }
  getExamRemarks(key) {
    this.reportData = [];
    this.repository.GetExamRemarks(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/exam-remarks.xml',
          show: true
        });
      }
      this.remarks = "";
      this.remarksArray = [];
      this.loadRemarks();
      // this.report = "/assets/Reports/Resource/Examination/exam-remarks.xml";
      // this.$modal.show("report-viewer-eng");
    });
  }

  getExamSubjectWiseAtten(key) {

    this.reportData = [];
    this.repository.GetExamSubjectWiseAtten(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {

        this.reportData = response as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/examsubjectwiseAtten.xml',
          show: true
        });
      }
    });
  }


  GetExamTypeWiseReport(key) {
    this.reportData = [];
    this.repository.GetExamTypeWiseReport(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        if (this.reportData.length > 0) {
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/examTypeWise.xml',
            show: true
          });
        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Record Not found',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });
        }
      }
    });
  }


}
