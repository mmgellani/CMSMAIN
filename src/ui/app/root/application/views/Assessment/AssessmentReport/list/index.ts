import Vue from "vue";
import Component from "vue-class-component";
// import { ReportEngine } from "../../../../../components";

import { ISetupGender, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupCampusProgramVM, ISetupProgram, ISetupShift, ISetupClass, ISetupSection, ISetupCollector, ISetupAdmissionType, IFeeFeeHead, IRegistrationSectionCourseLink, IRegistrationSectionCourseLinkVM, ISetupBoard, ISetupReligion, ITimeTableTimeTableVM, RegistrationProgramCourseLinkVM, IExaminationExamType, StaffHODData, IExamScheduleName,ISetupDegree } from "../../../../models";
import { SetupProgramDetailsService } from "../../../../service/Setup/ProgramDetails";


import { SetupProgramService, SetupShiftService, SetupClassService, SetupSectionService, SetupCollectorService, SetupAdmissionTypeService, FeeFeeHeadService, RegistrationSectionCourseLinkService, SetupBoardService, SetupReligionService, TimeTableTimeTableService, RegistrationProgramCourseLinkService, ExaminationExamTypeService, HumanResourceStaffService, RegistrationEnrollmentsService, ExaminationExamMasterService ,SetupDegreeService} from "../../../../service";
import { IVWCampusBaseProgram } from "../../../../models/Setup/CampusBaseProgram";
import { IRootStoreState, RootStoreTypes } from "../../../../../store";
import { StoreTypes } from "../../../../../../store";

// import { PayloadMessageTypes, IUser } from "../../../../../model";
import * as helper from '../../../../helper';
import { State } from "vuex-class";
import { filter, keys } from "lodash";
import moment from "moment";
import { debug } from "console";
import { truncate } from "fs";
import { trim } from "jquery";
import { SetupCampusProgramLinkService } from "../../../../service/Setup/CampusProgramLink";
import { ICampusCityVM, ISetupCampus, ISetupSession } from "../../../../models";
import { SetupCampusService } from "../../../../service/Setup/Campus";
import { IFeeReports } from "../../../../models/Reports/FeeReports";
import { SetupSessionService } from "../../../../service/Setup/Session";
import { ExaminationExamScheduleService } from "../../../../service/Examination/ExamSchedule";
import { ExaminationReportsService } from "../../../../service/Reports/ExaminationReports";
import { SetupGenderService } from "../../../../service/Setup/Gender";
import { IUser, PayloadMessageTypes } from "../../../../../../model";

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
export class AssessmentReport extends Vue {
  private session: string = "";
  private campus: string = "";
  private degreeRepo: SetupDegreeService = new SetupDegreeService(this.$store);

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
  private AssessmentData: any = [];

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
  private checkCou: boolean = false;
  private checkbutton33: boolean = false;
  private checkbutton: boolean = false;
  private checkbutton2: boolean = false;
  private keyAll = "";
  private keyProg = "";
  private keyGen = "";
  private keyComp = "";
  private checkDiv: boolean = false;
  private paramList: Array<IQueryParam> = [];
  private checkprogram: boolean = false;
  private checkassessment: boolean = false;
  private checkPercentage: boolean = false;

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
  private checkExamSch: boolean = false;
  private checkExamSchedule: boolean = false;
  private remarksArray: any = [];
  private remarks = ''
  private CAMPUSNAME = '';
  private CLASSNAME = '';
  private boardcheck: boolean = false;
  private checkreligion: boolean = false;
  private checkcourse: boolean = false;
  private checkcourse2: boolean = false;
  private checkdegree: boolean = false;
  private religioncheck: boolean = false;
  private checkboard: boolean = false;
  private chechkfeehead: boolean = false;
  private checkDate: boolean = false;
  private checkRemarks: boolean = false;
  private remarkscheck: boolean = false;
  private checkSection: boolean = false;
  private checkGender: boolean = false;
  private checkhod: boolean = false;
  private checkmonth: boolean = false;
  private isCourseMandatory = false;
  private isprogramDetailMandatory = false;

  private isClassMandatory = false;

  private isSectionMandatory = false;

  //private isCourseMandatory=false;
  //private isCourseMandatory=false;

  private checksectionsumry: boolean = false;
  private checkIndividualSummary: boolean = false;



  private sectionRepo: RegistrationSectionCourseLinkService;
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private collectorList: Array<ISetupCollector> = [];
  private collectorRepository: SetupCollectorService = null;
  private examTypeList: Array<IExaminationExamType> = [];
  private examscheduleList: Array<IExamScheduleName> = [];

  private checkcollector: boolean = false;
  private shiftId: string = "";
  private classId: string = "";
  private sectionId: string = "";
  private examName: string = "";
  private examScheduleId: string = "";
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
  private examScheduleRepo: ExaminationExamScheduleService = new ExaminationExamScheduleService(this.$store)
  private examMasterRepo: ExaminationExamMasterService = new ExaminationExamMasterService(this.$store)
  private degreeList: Array<ISetupDegree> = [];

  private programCourseLinkId = ''
  private religionList: Array<ISetupReligion> = [];
  private ReligionRepo: SetupReligionService = new SetupReligionService(this.$store);
  private timeTableId = ''
  private courseId = ''
  private degreeId=''
  private camid=''
  private orderby = 'ChallanNo'
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private timeTableRepo: TimeTableTimeTableService = new TimeTableTimeTableService(this.$store)
  private staffService: HumanResourceStaffService = null;

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  isDepartmentWiseMandatory: boolean = false;

  private showProgram = false;
  private showProgramDetail = false;
  private showClass = false;
  private showSection = false;
  private showAssesmnt=false;
  private showPercentage=false;

  private showExamTypes = false;
  private showMonth = false;
  private showCourse = false;
  private showHod = false;
  private showSession = false;
  private showCampus = false;
  private showSearchBox = false;
  private checkbuttongrade=false;
  private isProgram = false;
  private showProgramOptional = false;
  private showProgramDetailOptional = false;
  private showClassOptional = false;
  private showSectionOptional = false;
  private showExamTypeOptional = false;
  private showMonthOptional = false;
  private showCourseOptional = false;
  private showHodOptional = false;
  showExamSchedule: boolean = false
  showExamScheduleOptional: boolean = false;
  private typeId = ''
  private listId= 0 // Assuming this is your v-model

  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;
  // private isProgram=false;

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('examinationReports2' in this.user.claims) == true) {
        if (this.user.claims['examinationReports2'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['examinationReports2'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['examinationReports2'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['examinationReports2'].indexOf('D') >= 0) {
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
  parcetageList =[
    { listId: 49, sectionName: 'Less Than 50%' },
    { listId: 50, sectionName: 'Greater than and Equal to 50%' },
  ]
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
    this.loadDegree();
    //this.loadRemarks();
    this.$watch('classId', this.loadCourses)
    this.$watch('programId', this.loadProgramsOfCampus)

    this.$watch('classId', this.loadSection)
    this.$watch("check", this.reset);
    this.$watch("checkExam", this.resetexam);
    this.$watch("check", this.selectReport);
    this.$watch("programCourseLinkId", this.loadHodList);
    this.$watch("programDetailId", this.loadRemarks);
    this.$watch("sectionCourseLinkId", this.loadExamSchedule);
    this.$watch('classId', this.loadExamTypeName)


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
    this.loadDegree();
    this.courseId = '';

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
    var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;

    this.repository.CheckRemarks(cmid).then(response => {
      this.remarksArray = response as any;
    });
  }


  loadDegree() {
        
    this.degreeRepo.GetFindBy("s=>s.StatusId==1"  ).then(r => {
        this.degreeList = r as Array<ISetupDegree>;
        this.degreeList = this.degreeList.filter(function (r) {
    return r.fullName !=='Ninth' && r.fullName !=='Supply' && r.fullName !=='O-Level' && 
    r.fullName !=='A-Level'&& r.fullName !=='Bachelor' && r.fullName !=='Eight' && r.fullName !=='No Result' && r.fullName !=='Matric';
  });
  console.log(this.degreeList);
    });
}

  loadExamType() {
    this.addParam(this.checkExam, 'examTypeId');
    this.examTypeRepo.GetFindBy('s=>s.StatusId==1')
      .then(r => { this.examTypeList = r as Array<IExaminationExamType> });
  }
  loadExamSchedule() {
    this.examTypeList = [];
    if (this.check == "Section Wise Award List") {
      var camid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
      if (this.sectionCourseLinkId.length > 0) {
        var key = this.sessionId + '?' + this.campusId + '?' + this.programId + '?' + camid + '?' + this.classId + '?' + this.sectionCourseLinkId;
        this.examMasterRepo.GetExamTypeNameEx(key)
          .then(r => {
            this.examTypeList = r as Array<IExaminationExamType>
          });
        console.log(this.examTypeList);
      }
    }
    else {
      if (this.sectionCourseLinkId.length > 0) {
        this.examMasterRepo.GetExamScheduleName(this.sectionCourseLinkId)
          .then(r => {
            this.examscheduleList = r as Array<IExamScheduleName>
          });
      }
    }
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
    this.examTypeList = [];
    if (this.campusId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0 && this.programCourseLinkId.length > 0) {
      var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
      this.courseId = this.programCourseList.find(s => s.programCourseLinkId == this.programCourseLinkId).courseId
      var key = cmid + '?' + this.programDetailId + '?' + this.courseId + '?' + this.classId;
      this.staffService.GetHODDataEx(key).then(r => {
        this.Staffhodlist = r as Array<StaffHODData>
      });
    }
    if (this.check == "Department Wise Evaluation Report") {
      debugger
      var camid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
      debugger
      if (this.courseId.length > 0) {
        var key = this.sessionId + '?' + this.campusId + '?' + this.programId + '?' + camid + '?' + this.classId + '?' + this.courseId;
        this.examMasterRepo.GetExamTypeNameCourse(key)
          .then(r => {
            this.examTypeList = r as Array<IExaminationExamType>
          });
        debugger
        console.log(this.examTypeList);
      }
    }

    // if (this.check == "Subject Wise Grade Point Report") {
    //   debugger
    //   var camid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
    //   debugger
    //   if (this.courseId.length > 0) {
    //     var key = this.sessionId + '?' + this.campusId + '?' + this.programId + '?' + camid + '?' + this.classId + '?' + this.courseId;
    //     this.examMasterRepo.GetExamTypeNameCourse(key)
    //       .then(r => {
    //         this.examTypeList = r as Array<IExaminationExamType>
    //       });
    //     debugger
    //     console.log(this.examTypeList);
    //   }
    // }
  }
  loadExamTypeName() {
    if (this.check == "Student Academic Analysis Exam Type Report") {
      debugger
      if (this.classId.length > 0) {
        var key = this.classId;
        this.examMasterRepo.GetExamTypeNameClass(key)
          .then(r => {
            this.examTypeList = r as Array<IExaminationExamType>
          });
        debugger
        console.log(this.examTypeList);
      }
    }
  }
  loadAssmentTypeName() {
    if (this.check == "Section Wise Individual Exam") {
      debugger
      if (this.sectionCourseLinkId.length > 0) {
        var key = this.sectionCourseLinkId;
        this.repository.ExamAssessmentList(key)
          .then(r => {
            this.AssessmentData = r as any
          });
        debugger
        console.log(this.AssessmentData);
      }
    }
  }

  addParamdata() {

     if (this.checkassessment === true) {
        this.fullName = '';
    }
    console.log(this.fullName,'testjkj')

}
  addpercentageList() {
debugger;
     if (this.checkPercentage === true) {
        this.listId = 0;
    }
 
}
  loadSection() {
    this.sectionList = [];
    var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
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

    if (this.check == 'Subject Wise Award List') {
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

      if (param == 'CourseId') {
        this.courseId = this.programCourseList.find(s => s.programCourseLinkId == this.programCourseLinkId).courseId
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

    }
    else if (this.check == "Two Column Award List") {
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
    else if (this.check == 'Student Wise Analysis Report BLANK') {
      debugger;
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
    else if (this.check == 'Section Wise Award List') {
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

  }

  get getDate() {
    var month = (this.datestring.getMonth() + 1);

    return this.datestring.getFullYear() + '-' + (month < 10 ? '0' + month : month);
  }

  selectReport() {

    if (this.check == "Subject Wise Award List") {
      this.checkbutton3 = false
      this.checkAll = false;
      this.checkSection = false;
      this.checkGender = false;
      this.checkAll2 = false;
      this.checkIndividual = false;
      this.checkExamSchedule = false;
      this.checkbutton = false;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = false;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;

      this.showSearchBox = false;

      this.checkbutton = true;
      this.showSession = true;
      this.showCampus = true;
      this.showProgram = true;
      this.showProgramDetail = true;
      this.showClass = true;
      this.showSection = true;
      this.showExamTypes = false;
      this.showMonth = false;
      this.showCourse = true;
      this.showHod = false;
      this.isProgram = true;
      this.showProgramOptional = false;
      this.showProgramDetailOptional = false;
      this.showClassOptional = false;
      this.showSectionOptional = false;
      this.showExamTypeOptional = false;
      this.showMonthOptional = false;
      this.showCourseOptional = false;
      this.showHodOptional = false;
      this.checkcourse2 = false;
    }
    else if (this.check == "Section Wise Award List") {
      this.checkbutton3 = false
      this.checkAll = false;
      this.checkSection = false;
      this.checkGender = false;
      this.checkAll2 = false;
      this.checkIndividual = false;
      this.checkExamSchedule = false;
      this.checkbutton = false;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = false;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;

      this.showSearchBox = false;

      this.checkbutton = true;
      this.showSession = true;
      this.showCampus = true;
      this.showProgram = true;
      this.showProgramDetail = true;
      this.showClass = true;
      this.showSection = true;
      this.showExamTypes = false;
      this.showMonth = false;
      this.showCourse = false;
      this.showHod = false;
      this.isProgram = true;
      this.showProgramOptional = false;
      this.showProgramDetailOptional = false;
      this.showClassOptional = false;
      this.showSectionOptional = false;
      this.showExamTypeOptional = true;
      this.showMonthOptional = true;
      this.showCourseOptional = false;
      this.showHodOptional = false;
      this.checkcourse2 = false;
    } else if (this.check == "Exam Individual Summary Detail") {
      this.checkbutton3 = true
      this.checkAll = false;
      this.checkSection = false;
      this.checkGender = false;
      // this.checkbutton33 = false
      this.checkAll2 = false;
      this.checkIndividual = false;
      this.checkExamSchedule = false;
      this.checkbutton = true;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = true;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;
      this.showSearchBox = false;
      this.checkcourse2 = false;

    } else if (this.check == "Exam Subject Wise") {
      this.checkbutton3 = false
      this.checkAll = true;
      this.checkSection = true;
      this.checkGender = true;
      this.checkAll2 = true;
      this.checkExamSchedule = false;
      this.checkIndividual = false;
      this.checkbutton = true;
      this.checkcourse = true;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = true;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = true;
      this.showSearchBox = false;
      this.checkcourse2 = false;

    }
    else if (this.check == "Combined Subject Exam") {
      this.checkbutton3 = false
      this.checkAll = true;
      this.checkSection = true;
      this.checkGender = true;
      this.checkAll2 = true;
      this.checkIndividual = false;
      this.checkbutton = true;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkExamSchedule = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = true;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;
      this.showSearchBox = false;
      this.checkcourse2 = false;
    }
    else if (this.check == "Section Wise Individual Exam") {
      this.checkbutton3 = false
      this.checkAll = false;
      this.checkSection = false;
      this.checkGender = false;
      this.checkAll2 = false;
      this.checkIndividual = false;
      this.checkExamSchedule = false;
      this.checkbutton = false;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = false;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;

      this.showSearchBox = false;

      this.checkbutton = true;
      this.showSession = true;
      this.showCampus = true;
      this.showProgram = true;
      this.showProgramDetail = true;
      this.showClass = true;
      this.showSection = true;
      this.showAssesmnt=true;
      this.showPercentage=true;
      this.showExamTypes = false;
      this.showMonth = false;
      this.showCourse = false;
      this.showHod = false;
      this.isProgram = true;
      this.showExamSchedule = false;
      this.showProgramOptional = false;
      this.showProgramDetailOptional = false;
      this.showClassOptional = false;
      this.showSectionOptional = false;
      this.showExamTypeOptional = false;
      this.showMonthOptional = false;
      this.showCourseOptional = false;
      this.showHodOptional = false;
      this.showExamScheduleOptional = false;
      this.checkcourse2 = false;
    }
    else if (this.check == "Section Wise Individual Exam Provisional") {
      // this.checkbutton3 = false;
      // this.checkAll = true;
      // this.checkSection = true;
      // // this.checkbutton33 = false
      // this.checkExamSchedule = true;
      // this.checkGender = false;
      // this.checkAll2 = false;
      // this.checkIndividual = false;
      // this.checkbutton = true;
      // this.checkcourse = false;
      // this.checkRemarks = false;
      // this.checkhod = false;
      // this.checksectionsumry = false;
      // this.showExamType=false;
      // this.checkIndividualSummary = false;
      // this.checkmonth = false;
      // this.isCourseMandatory=false;

      this.checkbutton3 = false
      this.checkAll = false;
      this.checkSection = false;
      this.checkGender = false;
      this.checkAll2 = false;
      this.checkIndividual = false;
      this.checkExamSchedule = false;
      this.checkbutton = false;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = false;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;

      this.showSearchBox = false;

      this.checkbutton = true;
      this.showSession = true;
      this.showCampus = true;
      this.showProgram = true;
      this.showProgramDetail = true;
      this.showClass = true;
      this.showSection = true;
      this.showExamTypes = false;
      this.showMonth = false;
      this.showCourse = false;
      this.showHod = false;
      this.isProgram = true;
      this.showExamSchedule = true;
      this.showProgramOptional = false;
      this.showProgramDetailOptional = false;
      this.showClassOptional = false;
      this.showSectionOptional = false;
      this.showExamTypeOptional = false;
      this.showMonthOptional = false;
      this.showCourseOptional = false;
      this.showHodOptional = false;
      this.showExamScheduleOptional = false;
      this.checkcourse2 = false;
    }
    else if (this.check == "Student Exam Report") {
      // this.checkbutton3 = false;
      // this.checkAll = true;
      // this.checkSection = true;
      // // this.checkbutton33 = false
      // this.checkExamSchedule = true;
      // this.checkGender = false;
      // this.checkAll2 = false;
      // this.checkIndividual = false;
      // this.checkbutton = true;
      // this.checkcourse = false;
      // this.checkRemarks = false;
      // this.checkhod = false;
      // this.checksectionsumry = false;
      // this.showExamType=false;
      // this.checkIndividualSummary = false;
      // this.checkmonth = false;
      // this.isCourseMandatory=false;


      this.checkbutton3 = true;
      this.checkAll = false;
      this.checkSection = true;
      this.checkGender = false;
      this.checkAll2 = false;
      // this. checkbutton33=false;
      this.checkIndividual = false;
      this.checkExamSchedule = true;
      this.checkbutton = false;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = false;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;

      this.showSearchBox = false;

      this.checkbutton = true;
      this.showSession = true;
      this.showCampus = true;
      this.showProgram = true;
      this.showProgramDetail = true;
      this.showClass = true;
      this.showSection = true;
      this.showExamTypes = false;
      this.showMonth = false;
      this.showCourse = false;
      this.showHod = false;
      this.isProgram = true;
      this.showExamSchedule = true;
      this.showProgramOptional = false;
      this.showProgramDetailOptional = false;
      this.showClassOptional = false;
      this.showSectionOptional = false;
      this.showExamTypeOptional = false;
      this.showMonthOptional = false;
      this.showCourseOptional = false;
      this.showHodOptional = false;
      this.showExamScheduleOptional = true;
      this.checkcourse2 = false;
    }
    else if (this.check == "Student Exam Report Individual") {
      // this.checkbutton3 = false;
      // this.checkAll = true;
      // this.checkSection = true;
      // // this.checkbutton33 = false
      // this.checkExamSchedule = true;
      // this.checkGender = false;
      // this.checkAll2 = false;
      // this.checkIndividual = false;
      // this.checkbutton = true;
      // this.checkcourse = false;
      // this.checkRemarks = false;
      // this.checkhod = false;
      // this.checksectionsumry = false;
      // this.showExamType=false;
      // this.checkIndividualSummary = false;
      // this.checkmonth = false;
      // this.isCourseMandatory=false;


      this.checkbutton3 = true;
      this.checkAll = false;
      this.checkSection = false;
      this.checkGender = false;
      this.checkAll2 = false;
      this.checkIndividual = false;
      this.checkExamSchedule = false;
      this.checkbutton = false;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = true;
      this.showExamType = false;
      this.checkIndividualSummary = true;
      this.checkmonth = false;
      this.isCourseMandatory = false;

      this.showSearchBox = false;

      this.checkbutton = true;
      this.showSession = false;
      this.showCampus = false;
      this.showProgram = false;
      this.showProgramDetail = false;
      this.showClass = false;
      this.showSection = false;
      this.showExamTypes = false;
      this.showMonth = false;
      this.showCourse = false;
      this.showHod = false;
      this.isProgram = false;
      this.showExamSchedule = false;
      this.showProgramOptional = false;
      this.showProgramDetailOptional = false;
      this.showClassOptional = false;
      this.showSectionOptional = false;
      this.showExamTypeOptional = false;
      this.showMonthOptional = false;
      this.showCourseOptional = false;
      this.showHodOptional = false;
      this.showExamScheduleOptional = false;
      this.checkcourse2 = false;
    }
    else if (this.check == "Exam Individual Summary") {
      this.checkbutton3 = true;
      this.checkAll = true;
      this.checkSection = true;
      // this.checkbutton33 = false
      this.checkExamSchedule = true;
      this.checkGender = false;
      this.checkAll2 = false;
      this.checkIndividual = false;
      this.checkbutton = true;
      this.checkcourse = false;
      this.checkRemarks = false;
      this.checkhod = false;
      this.checksectionsumry = false;
      this.showExamType = false;
      this.checkIndividualSummary = false;
      this.checkmonth = false;
      this.isCourseMandatory = false;
      this.showSearchBox = false;
      this.checkcourse2 = false;

    } else
      if (this.check == "Department Wise Evaluation Report") {
        this.checkbutton3 = false
        this.checkAll = false;
        this.checkSection = false;
        this.checkGender = false;
        this.checkAll2 = false;
        this.checkIndividual = false;
        this.checkExamSchedule = false;
        this.checkbutton = false;
        this.checkcourse = false;
        this.checkRemarks = false;
        this.checkhod = false;
        this.checksectionsumry = true;
        this.showExamType = false;
        this.checkIndividualSummary = true;
        this.checkmonth = false;
        this.isCourseMandatory = false;

        this.showSearchBox = false;
    
        this.checkbutton = true;
        this.showSession = true;
        this.showCampus = true;
        this.showProgram = true;
        this.showProgramDetail = true;
        this.showClass = true;
        this.showSection = false;
        this.showExamTypes = true;
        this.showMonth = true;
        this.showCourse = true;
        this.showHod = true;
        this.showProgramOptional = false;
        this.showProgramDetailOptional = false;
        this.showClassOptional = false;
        this.showSectionOptional = false;
        this.showExamTypeOptional = false;
        this.showMonthOptional = false;
        this.showCourseOptional = false;
        this.showHodOptional = false;
        this.checkcourse2 = false;

      }

      else
      if (this.check == "Subject Wise Grade Point Report") {
        
        this.checkbutton3 = false
        this.checkAll = false;
        this.checkSection = false;
        this.checkGender = false;
        this.checkAll2 = false;
        this.checkIndividual = false;
        this.checkExamSchedule = false;
        this.checkbutton = false;
        this.checkcourse = false;
        this.checkRemarks = false;
        this.checkhod = false;
        this.checksectionsumry = true;
        this.showExamType = false;
        this.checkIndividualSummary = true;
        this.checkmonth = false;
        this.isCourseMandatory = false;

        this.showSearchBox = false;
        this.checkbuttongrade=true;
        this.checkbutton = false;
        this.showSession = true;
        this.showCampus = true;
        this.showProgram = true;
        this.showProgramDetail = true;
        this.showClass = true;
        this.showSection = false;
        this.showExamTypes = false;
        this.showMonth = false;
        this.showCourse = true;
        this.showHod = true;
        this.showProgramOptional = false;
        this.showProgramDetailOptional = false;
        this.showClassOptional = false;
        this.showSectionOptional = false;
        this.showExamTypeOptional = false;
        this.showMonthOptional = false;
        this.showCourseOptional = false;
        this.showHodOptional = false;
        this.checkcourse2 = false;
        this.checkdegree=true;

      }
      else if (this.check == "Exam Summary Report") {
        // this.checkbutton3 = false
        // this.checkAll = true;
        // this.checkSection = true;
        // this.checkGender = true;
        // this.checkExamSchedule = false;
        // // this.checkbutton33 = false
        // this.checkAll2 = true;
        // this.checkIndividual = false;
        // this.checkbutton = true;
        // this.checkcourse = false;
        // this.checkRemarks = false;
        // this.checkhod = false;
        // this.checksectionsumry = false;
        // this.showExamType=false;
        // this.checkIndividualSummary = true;
        // this.checkmonth = true;
        // this.isCourseMandatory=false;

        this.checkbutton3 = false
        this.checkAll = false;
        this.checkSection = false;
        this.checkGender = false;
        this.checkAll2 = false;
        this.checkIndividual = false;
        this.checkExamSchedule = false;
        this.checkbutton = false;
        this.checkcourse = false;
        this.checkRemarks = false;
        this.checkhod = false;
        this.checksectionsumry = true;
        this.showExamType = false;
        this.checkIndividualSummary = true;
        this.checkmonth = false;
        this.isCourseMandatory = false;

        this.showSearchBox = false;

        this.showExamSchedule = false;
        this.checkbutton = true;
        this.showSession = true;
        this.showCampus = true;
        this.showProgram = true;
        this.showProgramDetail = true;
        this.showClass = true;
        this.showSection = true;
        this.showExamTypes = false;
        this.showMonth = true;
        this.showCourse = false;
        this.showHod = false;
        this.isProgram = true;
        this.showProgramOptional = false;
        this.showProgramDetailOptional = false;
        this.showClassOptional = false;
        this.showSectionOptional = false;
        this.showExamTypeOptional = false;
        this.showMonthOptional = false;
        this.showCourseOptional = false;
        this.showHodOptional = false;
        this.checkcourse2 = false;
      } else if (this.check == "Student Academic Analysis Report") {
        this.checkbutton3 = false
        this.checkAll = false;
        this.checkSection = false;
        this.checkGender = false;
        this.checkAll2 = false;
        this.checkIndividual = false;
        this.checkExamSchedule = false;
        this.checkbutton = false;
        this.checkcourse = false;
        this.checkRemarks = false;
        this.checkhod = false;
        this.checksectionsumry = true;
        this.showExamType = false;
        this.checkIndividualSummary = true;
        this.checkmonth = false;
        this.isCourseMandatory = false;
        this.showMonthOptional = true;
        this.showSearchBox = true;
        this.checkbutton = true;
        this.showSession = false;
        this.showCampus = false;
        this.showProgram = false;
        this.showProgramDetail = false;
        this.showClass = true;
        this.showSection = false;
        this.showExamTypes = false;
        this.showMonthOptional = true;
        this.showMonth = false;
        this.showCourse = false;
        this.showHod = false;
        this.showProgramOptional = false;
        this.showProgramDetailOptional = false;
        this.showClassOptional = false;
        this.showSectionOptional = false;
        this.showExamTypeOptional = false;
        //this.showMonthOptional = false;
        this.showCourseOptional = false;
        this.showHodOptional = false;
        this.checkcourse2 = false;
        this.showExamSchedule = false;


      } else if (this.check == "Student Academic Analysis Exam Type Report") {

        this.checkbutton3 = false
        this.checkAll = false;
        this.checkSection = false;
        this.checkGender = false;
        this.checkAll2 = false;
        this.checkIndividual = false;
        this.checkExamSchedule = false;
        this.checkbutton = false;
        this.checkcourse = false;
        this.checkRemarks = false;
        this.checkhod = false;
        this.checksectionsumry = true;
        this.showExamType = false;
        this.checkIndividualSummary = true;
        this.checkmonth = false;
        this.isCourseMandatory = false;

        this.showSearchBox = true;
        this.checkbutton = true;
        this.showSession = false;
        this.showCampus = false;
        this.showProgram = false;
        this.showProgramDetail = false;
        this.showClass = true;
        this.showSection = false;
        this.showExamTypes = true;
        this.showMonth = false;
        this.showCourse = false;
        this.showHod = false;
        this.showProgramOptional = false;
        this.showProgramDetailOptional = false;
        this.showClassOptional = false;
        this.showSectionOptional = false;
        this.showExamTypeOptional = false;
        this.showMonthOptional = false;
        this.showCourseOptional = false;
        this.showHodOptional = false;
        // this.checkAll2 = false;
        this.checkcourse2 = false;
      }
      else if (this.check == "Two Column Award List") {
        this.checkbutton3 = false
        this.checkAll = true;
        this.checkSection = true;
        this.checkbutton33 = false
        this.checkGender = true;
        this.checkAll2 = true;
        this.checkIndividual = false;
        this.checkbutton = true;
        this.checkcourse = false;
        this.checkcourse2 = true;
        this.checkRemarks = false;
        this.checkhod = false;
        this.checksectionsumry = true;
        this.checkIndividualSummary = true;

        //this.checkbutton = false;
        this.showSession = false;
        this.showCampus = false;
        this.showProgram = false;
        this.showProgramDetail = false;
        this.showClass = false;
        this.showSection = false;
        this.showExamTypes = false;
        this.showMonth = false;
        this.showCourse = false;
        this.showHod = false;
        this.checkIndividual = false;
        this.checkExamSchedule = false;
        this.showSearchBox = false;
        this.checkmonth = false;
        this.showExamSchedule = false;
        this.showMonthOptional = false;

        //this.checksectionsumry = false;
        this.showExamType = false;
        this.checkIndividualSummary = false;
        this.showExamTypeOptional = false;
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
          this.checkcourse = false;
          this.checkcourse2 = true;
          this.checkRemarks = false;
          this.checkhod = false;
          this.checksectionsumry = true;
          this.checkIndividualSummary = true;

          //this.checkbutton = false;
          this.showSession = false;
          this.showCampus = false;
          this.showProgram = false;
          this.showProgramDetail = false;
          this.showClass = false;
          this.showSection = false;
          this.showExamTypes = false;
          this.showMonth = false;
          this.showCourse = false;
          this.showHod = false;
          this.checkIndividual = false;
          this.checkExamSchedule = false;
          this.showSearchBox = false;
          this.checkmonth = false;
          // this.checksectionsumry = false;
          this.showExamType = false;
          this.checkIndividualSummary = false;
          this.showExamSchedule = false;
          this.showExamTypes = false;
          this.showExamTypeOptional = false;
          this.showMonthOptional = false;

        }

  }
  showExamType = false;
  generate() {

    if (this.check == "Subject Wise Award List") {
      var where = `(em.\"SectionCourseLinkId\" = ''` + this.sectionCourseLinkId + `'') AND (em.\"ProgramCourseLinkId\" = ''` + this.programCourseLinkId + `'')`;
      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      if (this.sectionCourseLinkId.length > 0 && this.programCourseLinkId.length > 0) {
        where = where + "?" + this.sectionCourseLinkId + "?" + this.programCourseLinkId
        this.GetExamTypeWise2Report(where)
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Please select Section',
          title: 'warning',
          messageTypeId: PayloadMessageTypes.warning
        });
      }
    } else if (this.check == "Exam Individual Summary") {
      if (this.filterString.length > 0) {
        this.getExamIndividSummary()
      } else {
        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
        // this.typeId = this.examScheduleList.find(e => e.examTypeId == this.examTypeId).fullName;
        var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?" + this.examName + "?" + this.examTypeId + "?" + this.sectionCourseLinkId;

        // this.paramList.forEach(e => {

        //   where = where + " " + e.param + "=''" + e.value + "''";

        // })
        console.log(this.sectionCourseLinkId);
        this.getExamIndividSummarySection(where)
      }

      // else if (this.check == "Two Column Award List") {
      //   var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      //   this.paramList.forEach(e => {

      //     where = where + " " + e.param + "=''" + e.value + "''";

      //   })
      //   this.getAwardListTwo(where)
      // }


    }


    else if (this.check == "Section Wise Individual Exam") {

      this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
      var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" +   this.sectionCourseLinkId + "?" +   this.fullName + "?" +   this.listId;

      // this.paramList.forEach(e => {

      //   where = where + " " + e.param + "=''" + e.value + "''";

      // })
      console.log(this.sectionCourseLinkId);
      this.getExamSecWiseAssesmentIndividReport(where)


    }
    else if (this.check == "Section Wise Individual Exam Provisional") {

      this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
      this.typeId = this.examscheduleList.find(e => e.examName == this.examTypeId).examTypeId;
      var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?" + this.examTypeId + "?" + this.typeId + "?" + this.sectionCourseLinkId;

      // this.paramList.forEach(e => {

      //   where = where + " " + e.param + "=''" + e.value + "''";

      // })
      console.log(this.sectionCourseLinkId);
      this.getExamSecWiseIndividReportProvisional(where)


    }

    else if (this.check == "Student Exam Report") {
      debugger;
      if (this.filterString.length > 0 && this.classId.length > 0 && this.examTypeId.length > 0) {
        this.getStudentResultReport();

      }
      else if (this.classId.length == 0 || this.examTypeId.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Please select Required Selection',
          title: 'warning',
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      //  if (this.filterString.length > 0) {
      //   this.getStudentResultReport()
      // }


      else {
        this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
        this.typeId = this.examscheduleList.find(e => e.examName == this.examTypeId).examTypeId;
        var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?" + this.examTypeId + "?" + this.typeId + "?" + this.sectionCourseLinkId;
        console.log(this.sectionCourseLinkId);
        this.getStudentExamReport(where)
      }

    } else if (this.check == "Student Exam Report Individual") {

      if (this.filterString.length > 0) {
        this.getStudentExamReport2()
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
    else if (this.check == "Exam Individual Summary Detail") {
      this.getExamIndividSummaryDetail()

    }
    else if (this.check == "Section Wise Award List") {
      var where = `(em.\"SectionCourseLinkId\" = ''` + this.sectionCourseLinkId + `'')`;
      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      if (this.sectionCourseLinkId.length > 0) {
        where = where + "?" + this.sectionCourseLinkId

        this.GetSectionWiseExam2(where)
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Please select Section',
          title: 'warning',
          messageTypeId: PayloadMessageTypes.warning
        });
      }
    } else if (this.check == "Department Wise Evaluation Report") {

      this.getEvaluateStudentsEx()
    }
    else if (this.check == "Exam Summary Report") {
      this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
      var where = `AND ("sess".\"SessionId\" = ''` + this.sessionId + `'') AND ("cp".\"CampusId\" = ''` + this.campusId + `'') AND "pds"."ProgramId"=''` + this.programId + `'' AND "pds"."ProgramDetailId"=''` + this.programDetailId + `'' AND "cls"."ClassId"=''` + this.classId + `'' AND "sec"."SectionId"=''` + this.sectionId + `'' AND LEFT("exm"."Dated"::TEXT,7)=''` + moment(this.datestring).format('YYYY-MM') + `''`;

      // this.paramList.forEach(e => {

      //   where = where + " " + e.param + "=''" + e.value + "''";

      // })
      this.getExamMonthlyExx(where)
    }
    else if (this.check == "Student Academic Analysis Report") {
      if (this.filterString.length > 0 && this.classId.length > 0) {
        this.getStudentAcademicAnalysisReport();

      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Please Fill the Required Data',
          title: 'warning',
          messageTypeId: PayloadMessageTypes.warning
        });
      }
    } else if (this.check == "Student Academic Analysis Exam Type Report") {
      if (this.filterString.length > 0 && this.classId.length > 0 && this.examTypeId.length > 0) {
        this.GetStudentAcademicAnalysisReportExamTypeWiseExm2Ex3()
      } else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Please select Section',
          title: 'warning',
          messageTypeId: PayloadMessageTypes.warning
        });
      }
    }
    else if (this.check == "Two Column Award List") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getAwardListTwo(where)
    }
    else if (this.check == "Student Wise Analysis Report BLANK") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudents(where)
    }

  }

  getStudentAcademicAnalysisReport() {

    if (this.checkDate == false) {
      debugger
      if (this.classId == '8931d744-acc9-4776-a03a-2b705038ea48') {
        var key = this.filterString + "?" + this.classId
        debugger

        this.reportData = [];
        this.repository.GetStudentAcademicAnalysisReport1styearExam(key).then(response => {
          if (response == null || response == [] || response == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "No Record Found",
              title: "Warning",
              messageTypeId: PayloadMessageTypes.warning
            });
          }
          else {
            this.reportData = response as any;

            console.log(JSON.stringify(this.reportData));
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Examination/exam-studentAcadamicAnalysisEx.xml',
              show: true
            });
          }
        });
      }

      else {
        var key = this.filterString + "?" + this.classId
        debugger

        this.reportData = [];
        this.repository.GetStudentAcademicAnalysisReportExm2Ex5(key).then(response => {
          if (response == null || response == [] || response == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "No Record Found",
              title: "Warning",
              messageTypeId: PayloadMessageTypes.warning
            });
          }
          else {
            this.reportData = response as any;

            console.log(JSON.stringify(this.reportData));
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Examination/exam-studentAcadamicAnalysis.xml',
              show: true
            });
          }
        });
      }
    }
    else {
      if (this.classId == '8931d744-acc9-4776-a03a-2b705038ea48') {
      var key = this.filterString + "?" + this.classId + "?" + moment(this.datestring).format('YYYY-MM-DD')

      debugger
      this.reportData = [];
      this.repository.GetStudentAcademicAnalysisReport1styearDate(key).then(response => {
        if (response == null || response == [] || response == 0) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "No Record Found",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        }
        else {
          this.reportData = response as any;

          console.log(JSON.stringify(this.reportData));
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/exam-studentAcadamicAnalysisEx.xml',
            show: true
          });
        }
      });
    }

    else
    {

      var key = this.filterString + "?" + this.classId + "?" + moment(this.datestring).format('YYYY-MM-DD')

      debugger
      this.reportData = [];
      this.repository.GetStudentAcademicAnalysisReportExm2Ex3(key).then(response => {
        if (response == null || response == [] || response == 0) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "No Record Found",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
        }
        else {
          this.reportData = response as any;

          console.log(JSON.stringify(this.reportData));
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/exam-studentAcadamicAnalysis.xml',
            show: true
          });
        }
      });

    }
  }
  

  }

  GetStudentAcademicAnalysisReportExamTypeWiseExm2Ex3() {
    var key = this.filterString + "?" + this.classId + "?" + this.examTypeId
    // + moment(this.datestring).format('YYYY-MM-DD') + "?" 
    this.reportData = [];
    this.repository.GetStudentAcademicAnalysisReportExamTypeWiseExm2Ex3(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;

        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/exam-reportExExamTypeWise.xml',
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
  getExamIndividSummaryDetail() {

    this.reportData = [];
    var key = this.filterString;
    this.displayList = []
    this.repository.GetExamIndividSummaryExm2(key).then(response => {
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

      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }

    });
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
          element.courseName = this.programCourseList.find(e => e.courseId == this.courseId).courseName

        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/student-result-sheet.xml',
          show: true
        });
      }
    });
  }
  getCombinedSubjectExam(key) {
    this.reportData = [];
    this.repository.GetCombinedSubjectExam2(key).then(response => {
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


  getExamSubjectWise(key) {
    this.reportData = [];
    this.repository.GetExamSubjectWiseExm2(key).then(response => {
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
  private displayList = []
  getExamIndividSummary() {

    this.reportData = [];
    var key = this.filterString;
    this.displayList = []
    this.repository.GetExamIndividSummaryExm2(key).then(response => {
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
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
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
  getExamIndividSummarySection(key) {
    this.reportData = [];
    this.repository.GetExamIndividSummarySectionExm2(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        // this.reportData.forEach(element => {
        //   element.result = JSON.parse(element.result)

        // });


        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/exam-result-report-all.xml',
          show: true
        });
      }
    });
  }

  getStudentExamReport2() {

    this.reportData = [];
    var key = this.filterString;
    this.displayList = []
    this.repository.GetExamIndividSummarySectionExmEx(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        //  this.displayList=this.reportData;
        var oldObj = this.reportData[0];
        this.displayList.push(oldObj);
        this.reportData.forEach(e => {
          // console.log(e.rollNo + 'hehe')
          if (e.rollNo != oldObj.rollNo) {
            this.displayList.push(e);
          }
          e.monthNumber = e.monthNumber.toString()
          oldObj = e;
        })
      }
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
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


  getStudentExamReport(key) {

    this.reportData = [];
    this.repository.GetExamIndividSummarySectionExm2(key).then(response => {
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
          element.na = 'N/A'

        });

        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/exam-result-report-all.xml',
          show: true
        });
      }
    });
  }
  getExamSecWiseIndividReport(key) {

    this.reportData = [];
    this.repository.ExamSecWiseIndividReport(key).then(response => {
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
          element.na = 'N/A'

        });

        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/section-wise-individual-exam.xml',
          show: true
        });
      }
    });
  }

  getExamSecWiseAssesmentIndividReport(key) {
debugger;
    this.reportData = [];
    this.repository.ExamAssessmentSecWiseIndividReport(key).then(response => {
      if (response == null || response == [] || response.data1.length === 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/assessmentReport.xml',
          show: true
        });
      }
    });
  }
  getExamSecWiseIndividReportProvisional(key) {

    this.reportData = [];
    this.repository.ExamSecWiseIndividReportProvisional(key).then(response => {
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
          element.na = 'N/A'

        });

        console.log(JSON.stringify(this.reportData));
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Examination/section-wise-individual-exam.xml',
          show: true
        });
      }
    });
  }
  GetExamTypeWise2Report(key) {
    this.reportData = [];
    this.repository.GetExamTypeWiseReport2(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        // this.reportData.data.campusName= "HEllo";
        debugger
        if (this.reportData.data.length > 0) {

          this.CAMPUSNAME = this.reportData.data[5].campusName;
          this.CLASSNAME = this.reportData.data[5].class_;
          this.reportData.data[0].class_ = this.CLASSNAME;
          this.reportData.data[0].campusName = this.CAMPUSNAME;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/examTypeWise2.xml',
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

  GetSectionWiseExam2(key) {

    this.reportData = [];
    this.repository.GetSectionWiseExam2(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }

      else {
        this.reportData = response as any;
        //this.reportData.forEach(element => {
        // element.na = 'N/A'
        //  });

        console.log(JSON.stringify(this.reportData))
        if (this.reportData.data.length > 0) {
          console.log('kjdf')
          //this.reportData.data[0].staffName="Sikandar"
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Examination/sectionWiseExam2.xml',
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
  //////
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

  getStudentResultReport() {
    debugger;
    this.displayList = []
    this.reportData = [];
    this.sectionId = this.sectionList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId;
    this.typeId = this.examscheduleList.find(e => e.examName == this.examTypeId).examTypeId;
    var key = this.filterString + "?" + this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?" + this.examTypeId + "?" + this.typeId + "?" + this.sectionCourseLinkId;

    // var key = this.filterString;

    this.repository.GetStudentResultReport(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        //  this.displayList=this.reportData;
        var oldObj = this.reportData[0];
        this.displayList.push(oldObj);
        this.reportData.forEach(e => {
          //console.log(e.rollNo + 'hehe')
          if (e.rollNo != oldObj.rollNo) {
            this.displayList.push(e);
          }
          e.month = e.month.toString()
          e.na = 'N/A'
          oldObj = e;


        })
      }

    });
  }
  ///////
  getEvaluateStudentsEx() {
    debugger;
    this.reportData = [];
    if (this.campusId.length > 0 && this.programId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0 && this.hodId.length > 0 && this.examTypeId.length > 0 && this.datestring.toString() != '' && this.courseId.length > 0) {
      var key = this.campusId + "?" + this.hodId + "?" + this.examTypeId + "?" + (this.datestring.getFullYear() + '-' + ((this.datestring.getMonth() + 1).toString().length == 1 ? '0' + (this.datestring.getMonth() + 1) : (this.datestring.getMonth() + 1)) + '?' + this.programCourseLinkId);

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


  getStudentsGradesEx() {
    debugger;
    this.reportData = [];
    if (this.campusId.length > 0 && this.programId.length > 0 && this.programDetailId.length > 0 && this.classId.length > 0 && this.hodId.length > 0 && this.degreeId.length > 0 && this.courseId.length > 0) {
      this.camid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
      var key = this.camid + "?" + this.courseId + "?" + this.hodId + "?" + this.classId + "?" + this.degreeId ;
      //  alert(key)
      this.repository.GetGradeStudents(trim(key.toString())).then(response => {
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
            path: '/assets/Reports/Resource/Examination/subjectwisegradegpareport.xml',
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

    } else if (this.check == "Academic Performance Report") {
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
    else if (this.check == "Student Exam Report") {

      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: datas as any,
        path: '/assets/Reports/Resource/Examination/exam-result-report-all.xml',
        show: true
      });


    }

    



  }

}
