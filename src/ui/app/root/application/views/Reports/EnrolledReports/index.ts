import Vue from "vue";
import Component from "vue-class-component";
import { ReportEngine } from "../../../../../components";
import { FeeReportsService } from "../../../service/Reports/FeeReports";
import { IFeeReports } from "../../../models/Reports/FeeReports";
import { ISetupSession } from "../../../models/Setup/Session";
import { SetupSessionService } from "../../../service/Setup/Session";
import { ISetupCampus, ICampusCityVM } from "../../../models/Setup/Campus";
import { SetupCampusService } from "../../../service/Setup/Campus";
import { ISetupGender, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupCampusProgramVM, ISetupProgram, ISetupShift, ISetupClass, ISetupSection, ISetupCollector, ISetupAdmissionType, IFeeFeeHead, IRegistrationSectionCourseLink, IRegistrationSectionCourseLinkVM, ISetupBoard, ISetupReligion, ISetupProgramDetailsVM } from "../../../models";
import { SetupGenderService } from "../../../service/Setup/Gender";
import { SetupProgramDetailsService } from "../../../service/Setup/ProgramDetails";
import { SetupCampusProgramLinkService } from "../../../service/Setup/CampusProgramLink";
import { SetupProgramService, SetupShiftService, SetupClassService, SetupSectionService, SetupCollectorService, SetupAdmissionTypeService, FeeFeeHeadService, RegistrationSectionCourseLinkService, SetupBoardService, SetupReligionService, RegistrationEnrollmentsService } from "../../../service";
import { EnrolledReportsService } from "../../../service/Reports/EnrolledReports";
import { IVWCampusBaseProgram } from "../../../models/Setup/CampusBaseProgram";
import { State } from "vuex-class";
import { IRootStoreState, RootStoreTypes } from "../../../../store";
import { IUser, PayloadMessageTypes } from "../../../../../model";
import { StoreTypes } from "../../../../../store";
import moment from "moment";
import { MessageService } from "../../../service/Message/message-service";
interface IQueryParam {
  param: string;
  value: string;
  name: string;
}
@Component({
  name: "models-form-list",
  template: require("./index.html"),
  // components: {
  //   // "report-engine": ReportEngine
  // }
})
export class EnrolledReports extends Vue {
  private session: string = "";
  service: MessageService = new MessageService(this.$store);

  private campus: string = "";
  private repository: EnrolledReportsService;
  private sessionModel: Array<ISetupSession> = [];
  private sessionRepo: SetupSessionService;
  private campusModel: Array<ISetupCampus> = [];
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  programDDL: Array<DDLGroupModel> = [];
  programDetailId: string = "";
  ddl: Array<DDLModel> = [];
  sectioncourselinkId='';
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private sessionId: string = "";
private ProvidedString: string ="";


  private campusId: string = "";
  private campusCityList: Array<ICampusCityVM> = []
  private campusCityListStep: Array<ICampusCityVM> = []

  private campusRepo: SetupCampusService;
  private genderModel: Array<ISetupGender> = [];
  private genderRepo: SetupGenderService;
  private programModel: Array<ISetupProgramDetails> = [];
  private programRepo: SetupProgramDetailsService;
  private admissionReport: Array<IFeeReports> = [];

  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  datestring = new Date();

  private reportData: any = [];
  private report: String = "";
  private idCampus: string = "";
  private showsms=false;
    private showstep=false;
private showCampus=true;
  private idSession: String = "";
  private campusProgramId: string = "";
  private idGender: string = "";
  private board: string = "";
  private fullName: string = "";
  private religionId: string = "";
  private idProgram: string = "";
  private check: string = "";
  private fromDate = new Date();
  private toDate = new Date();
  private checkProg: boolean = false;
  private checkGen: boolean = false;
  private checkbutton: boolean = false;
  private checkbutton2: boolean = false;
  private checkSectionEx: boolean = false;
  private keyAll = "";
  private keyProg = "";
  private keyGen = "";
  private keyComp = "";
  private collegeCode = "";
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
  private checksection: boolean = false;
  private boardcheck: boolean = false;
  private checkreligion: boolean = false;
  private religioncheck: boolean = false;
  private checkboard: boolean = false;
  private chechkfeehead: boolean = false;
  private sectionRepo: RegistrationSectionCourseLinkService;
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private collectorList: Array<ISetupCollector> = [];
  private collectorRepository: SetupCollectorService = null;
  private checkcollector: boolean = false;
  private shiftId: string = "";
  private classId: string = "";
  private sectionId: string = "";
  private collectorId: string = "";
  private feeHeadId: string = "";
  private programDetailList: Array<ISetupProgramDetailsVM> = [];

  private feeHeadList: Array<IFeeFeeHead> = [];
  private feeHeadRepository: FeeFeeHeadService = new FeeFeeHeadService(this.$store);

  private BoardList: Array<ISetupBoard> = [];
  private BoardRepository: SetupBoardService = new SetupBoardService(this.$store);

  private religionList: Array<ISetupReligion> = [];
  private ReligionRepo: SetupReligionService = new SetupReligionService(this.$store);

  private orderby = 'RollNo'
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)

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
      if (('enrolledReports' in this.user.claims) == true) {

        if (this.user.claims['enrolledReports'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['enrolledReports'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['enrolledReports'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['enrolledReports'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push('Home');
      }
    }
  }

  created() {
    this.repository = new EnrolledReportsService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.genderRepo = new SetupGenderService(this.$store);
    this.programRepo = new SetupProgramDetailsService(this.$store);
    this.classRepository = new SetupClassService(this.$store);
    this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
    this.collectorRepository = new SetupCollectorService(this.$store);
    this.loadSession();
    // this.getGender();
    // this.loadPrograms();
    // this.loadCityCampus();
    // this.loadShift();
    // this.loadClass();
    this.loadBoard();
    this.loadReligion();
    this.validatePage();

    this.loadClass();
    // this.loadSection();
    // this.loadProgramsOfCampuses();
    this.$watch('sessionId', this.loadCityCampus);
    this.$watch('sessionId', this.loadCityCampusStep);

    
    this.$watch('campusId', this.loadPrograms);
    this.$watch('programId', this.loadProgramsOfCampus);
    this.$watch('programDetailId', this.loadSection);
    this.$watch('classId', this.loadSection);
    this.$watch('checkGen', this.getGender);
    // this.$watch('sessionId',this.loadCityCampus);
  }

  changeProgram() {
    this.addParam(this.checkprogram, 'ProgramId');
    this.loadProgramsOfCampus();
  }
  allowsubmit() {

    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      return false;
    }

    else {
      return true;
    }
  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }
  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
    });
  }


  loadCityCampusStep() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetStepCityVM().then(r => {
      this.campusCityListStep = r as Array<ICampusCityVM>;
    });
  }
  getGender() {
    this.genderRepo
      .GetFindBy('e => e.StatusId == 1')
      .then(response => (this.genderModel = response as Array<ISetupGender>));
  }

  loadPrograms() {
    this.addParam(this.checkProg, 'programId');
    this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
      .then(r => {
        this.programList = r as Array<IVWCampusBaseProgram>
        this.loadSection();
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

  loadSection() {
    this.sectionList = [];
    if (this.campusId.length > 0 && this.programDetailId.length > 0) {
      var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
      this.addParam(this.checksection, 'sectionId');
      if (cmid.length > 0 && this.classId.length > 0) {
        var key = cmid + '?' + this.classId
        this.enrollmentRepo.GetSectionList(key)
          .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
      }
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

  loadProgramsOfCampus() {
    this.addParam(this.checkprogram, 'ProgramId');
    this.programDetailId = ''
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
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


  // loadProgramsOfCampus() {
  //   this.addParam(this.checkprogram, 'ProgramId');
  //   this.programDetailId = ''
  //   this.ddl = [];
  //   this.programDDL = [];
  //   let oldObj: ISetupProgramDetailsVM;
  //   var key = this.sessionId + '?' + this.campusId + '?' + this.programId
  //   this.campusProgramLinkRepo.ProgDetailByProgram(key)
  //     .then(r => {
  //       this.programDetailList = r as Array<ISetupProgramDetailsVM>
  //     })
  // }

  addParam(isChecked: boolean, param: string) {

    if (this.check == "Admission WithDrawl Register") {

      if (param == 'ProgramId') {
        debugger;
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND pgd.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
          }
        }
      }


      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.find(s => s.name == 'ProgramDetailId').value = this.programDetailId;
          } else {
            this.paramList.push({ param: "AND cpl.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
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
            this.paramList.push({ param: "AND scl.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }

      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.idGender;
          } else {
            this.paramList.push({ param: "AND std.\"GenderId\"", value: this.idGender, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }

    }
    else {

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
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.find(s => s.name == 'SectionId').value = this.sectioncourselinkId;
          } else {
            this.paramList.push({ param: "AND cv.\"SectionCourseLinkId\"", value: this.sectioncourselinkId, name: 'SectionId' });
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
      if (param == 'ReligionId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ReligionId')) {
            this.paramList.find(s => s.name == 'ReligionId').value = this.religionId;
          } else {
            this.paramList.push({ param: "AND cv.\"ReligionId\"", value: this.religionId, name: 'ReligionId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ReligionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ReligionId'), 1);
          }
        }
      }
      if (param == 'Board') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'Board')) {
            this.paramList.find(s => s.name == 'Board').value = '"' + this.board + '"';
            this.paramList.find(s => s.name == 'Board').param = "AND cv.\"Board\"";

          } else {
            this.paramList.push({ param: "AND cv.\"Board\"", value: '"' + this.board + '"', name: 'Board' });
          }
        } else {
          // if (this.paramList.find(s => s.name == 'Board')) {
          //   this.paramList.find(s => s.name == 'Board').value = '"'+this.board+'"';
          //   this.paramList.find(s => s.name == 'Board').param = "AND cv.\"Board\"";

          // } else {
          //   this.paramList.push({ param: "AND cv.\"Board\"", value: '"'+this.board+'"', name: 'Board' });
          // }
          if (this.paramList.find(s => s.name == 'Board')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'Board'), 1);
          }
        }
      }
    }
  }


  // selectReport() {
  //   if (this.check == "Enrolled Students") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = false;
  //   } else if (this.check == "Student Contact List") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = false;
  //   } else if (this.check == "Student Contact List Address Wise") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = false;
  //   } else if (this.check == "Student Count Section Wise") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = false;
  //   } else if (this.check == "Enrolled Students with Ref No") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = false;
  //   } else if (this.check == "Enrolled Students Board Wise") {
  //     this.checkbutton = true;
  //     this.boardcheck = true;
  //     this.checkreligion = false;
  //   } else if (this.check == "Enrolled Students Religion Wise") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = true;
  //   } else if (this.check == "Enrolled Students Marks Wise") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = false;
  //   }else if (this.check == "Student Username and Password") {
  //     this.checkbutton = true;
  //     this.boardcheck = false;
  //     this.checkreligion = false;
  //   }
  // }

  selectReport() {
    // this.addParam(false,'Board')
    if (this.check == "Enrolled Students") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
      this.showCampus=true;

      this.showstep=false;
    } else if (this.check == "Student Contact List") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
      this.showCampus=true;

    } else if (this.check == "Student Contact List Address Wise") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;

    }
    else if (this.check == "Mailing Labels Report") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
      this.showCampus=true;


    }
    else if (this.check == "College Card Report") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;

      this.showCampus=true;

    }
    else if (this.check == "Step Enrolled Detail Report") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=true;
            this.showCampus=false;


    } else if (this.check == "Student Count Section Wise") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
      this.showCampus=true;

    } else if (this.check == "Enrolled Students with Ref No") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
      this.showCampus=true;

    } else if (this.check == "Enrolled Students Board Wise") {
      this.checkbutton = true;
      this.boardcheck = true;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
      this.showCampus=true;

    } else if (this.check == "Enrolled Students Religion Wise") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = true;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
      this.showCampus=true;

    } else if (this.check == "Enrolled Students Marks Wise") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
      this.showCampus=true;

    } else if (this.check == "Student Username and Password") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;
                  this.showCampus=true;


    } else if (this.check == "Struck Off Students") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = true;
      this.showsms=false;
            this.showstep=false;

    }
    else if (this.check == "Admission WithDrawl Register") {
      this.checkbutton = true;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = false;
      this.showsms=false;
            this.showstep=false;

    }
    else if (this.check == "Sms Summary Report") {
      this.checkbutton = false;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = false;
      this.showsms=true;
            this.showstep=false;

     
    }
    else if (this.check == "Sms Delivery Report") {
      this.checkbutton = false;
      this.boardcheck = false;
      this.checkreligion = false;
      this.checkSectionEx = false;
      this.showsms=true;
            this.showstep=false;

     
    }

   
  }


  generate() {

    if (this.check == "Enrolled Students") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudents(where)
    }
    else if (this.check == "Student Contact List") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudentsContact(where)

    }
    else if (this.check == "Student Contact List Address Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudentsContactAdrress(where)

    }
    else if (this.check == "Mailing Labels Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getMailingAdrress(where)

    }
    else if (this.check == "College Card Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getCollegeCardReport(where)

    }



//  else if (this.check == "Step Enrolled Detail Report") {
//   const jsonObj: any = {
//     sessionid: this.sessionId,
//     campusid: this.campusId
//   };

//   if (this.programId) {
//     jsonObj.programid = this.programId;
//   }

//   if (this.programDetailId) {
//     jsonObj.programdetailid = this.programDetailId;
//   }

//   if (this.classId) {
//     jsonObj.classid = this.classId;
//   }

//   if (this.sectioncourselinkId) {
//     jsonObj.sectioncourselinkid  = this.sectioncourselinkId;
//   }

// if(this.idGender)
//  {
//     jsonObj.genderId = this.idGender;
//   }

  
//  this.paramList.forEach(e => {
//   const cleanKey = e.param
//     .toLowerCase()
//     .replace(/and\s+/g, '')         
//     .replace(/cv\./g, '')           
//     .replace(/["\\]/g, '')         
//     .trim();

//   // Avoid overriding manually set keys
//   if (!(cleanKey in jsonObj)) {
//     jsonObj[cleanKey] = e.value;
//   }
// });



//   const providedString = JSON.stringify(jsonObj);

//   this.getStepEnrollmentReport(providedString);
// }



else if (this.check == "Step Enrolled Detail Report") {
  const jsonObj: any = {
    sessionid: this.sessionId,
    campusid: this.campusId
  };

  
  if (this.checkprogram && this.programId) {
    jsonObj.programid = this.programId;
  }

  if (this.checkProg && this.programDetailId) {
    jsonObj.programdetailid = this.programDetailId;
  }

  if (this.checkclass && this.classId) {
    jsonObj.classid = this.classId;
  }

  if (this.checksection && this.sectioncourselinkId) {
    jsonObj.sectioncourselinkid = this.sectioncourselinkId;
  }

  if (this.checkGen && this.idGender) {
    jsonObj.genderId = this.idGender;
  }

  
  this.paramList.forEach(e => {
    const cleanKey = e.param
      .toLowerCase()
      .replace(/and\s+/g, '')         
      .replace(/cv\./g, '')           
      .replace(/["\\]/g, '')         
      .trim();

    // Avoid overriding already-set keys
    if (!(cleanKey in jsonObj)) {
      jsonObj[cleanKey] = e.value;
    }
  });

  const providedString = JSON.stringify(jsonObj);
  this.getStepEnrollmentReport(providedString);
}






    else if (this.check == "Student Count Section Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudentsCount(where)

    }
    else if (this.check == "Enrolled Students with Ref No") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudentsRef(where)

    }
    else if (this.check == "Enrolled Students Board Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      console.log(where)
      this.getEnrolledStudentsBoard(where)

    }
    else if (this.check == "Enrolled Students Religion Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudentsReligion(where)

    }
    else if (this.check == "Enrolled Students Marks Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getEnrolledStudentsMarks(where)

    }
    else if (this.check == "Student Username and Password") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getStudentsUsernameAndPassword(where)

    }
    else if (this.check == "Struck Off Students") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      this.getStudentsStruckOff(where)

    }

    else if (this.check == "Admission WithDrawl Register") {
      var where = `AND cpl.\"SessionId\" = ''` + this.sessionId + `'' AND cpl.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var there = ` cv.\"PaidDate\" is not null ORDER BY cv."` + this.orderby + `" ASC`;
      this.getWithDrawllist(where, there)

    }

  }
  getStudentsStruckOff(key) {
    this.reportData = [];
    this.repository.GetStudentsStruckOff(key).then(response => {
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
          path: '/assets/Reports/Resource/Enrolled/Enrolled-StruckOff-Students.xml',
          show: true
        });
      }
      // this.report = "/assets/Reports/Resource/Enrolled/Enrolled-StruckOff-Students.xml";
      // this.$modal.show("report-viewer-eng");
    });
  }
  generate2() {
    if(this.check == "Sms Summary Report"){
    var key = moment(this.datestring).format("YYYY/MM/DD");
    this.service.GetSmsReport(key).then(r => {
        this.reportData = r as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Enrolled/sms-summary.xml',
            show: true
        });

    })
  }
  else if(this.check == "Sms Delivery Report"){
    var key = moment(this.datestring).format("YYYY/MM/DD");
    this.service.GetSmsDeliveryReport(key).then(r => {
        this.reportData = r as any;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Enrolled/sms-delivery.xml',
            show: true
        });

    })
  }
}

  getWithDrawllist(key, key2) {
    if (this.collegeCode.length > 0) {
      this.reportData = [];
      this.repository.GetWithDrawllist(key + "?" + this.collegeCode + "?" + key2).then(response => {
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
            path: '/assets/Reports/Resource/Enrolled/admission-withdrawl.xml',
            show: true
          });
        }
        // this.report = "/assets/Reports/Resource/Enrolled/Enrolled-StruckOff-Students.xml";
        // this.$modal.show("report-viewer-eng");
      });
    }
  }
  getStudentsUsernameAndPassword(key) {
    this.reportData = [];
    this.repository.GetStudentsUsernameAndPassword(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Username-Password.xml',
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
  getEnrolledStudents(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Enrolled-Students.xml',
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
  getEnrolledStudentsContact(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Student-Contact-List.xml',
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
  getEnrolledStudentsContactAdrress(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Student-Contact-List-Address-Wise.xml',
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

  getMailingAdrress(key) {
    this.reportData = [];
    this.repository.GetStdMailingLabel(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/std-mailing-report.xml',
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
  getCollegeCardReport(key) {
    this.reportData = [];
    this.repository.GetStdMailingLabel(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/std-College-card-report.xml',
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





  // getStepEnrollmentReport(key) {
  //   this.reportData = [];
  //   this.repository.GetStepEnrollmentReport(key).then(response => {
  //     this.reportData = response as any;
  //     if (this.reportData.length > 0) {
  //       this.$store.dispatch(RootStoreTypes.reportOperation, {
  //         data: this.reportData as any,
  //         path: '/assets/Reports/Resource/Enrolled/StepEnrollmentReport.xml',
  //         show: true
  //       });
  //     }
  //     else {

  //       this.$store.dispatch(StoreTypes.updateStatusBar, {
  //         text: "Sorry No Record Found",
  //         title: "Success",
  //         messageTypeId: PayloadMessageTypes.warning
  //       });



  //     }
  //   });
  // }

getStepEnrollmentReport(providedString: string) {
  this.reportData = [];

  this.repository.GetStepEnrollmentReport({ ProvidedString: providedString }).then(response => {
    this.reportData = response as any;

    if (this.reportData.length > 0) {
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData,
        path: '/assets/Reports/Resource/Enrolled/StepEnrollmentReport.xml',
        show: true
      });
    } else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Sorry No Record Found",
        title: "Success",
        messageTypeId: PayloadMessageTypes.warning
      });
    }
  });
}





  getEnrolledStudentsCount(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/StudentCountSectionWise.xml',
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
  getEnrolledStudentsRef(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Reference-Enrolled-Students.xml',
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
  getEnrolledStudentsBoard(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Enrolled-Student-Board-Wise.xml',
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
  getEnrolledStudentsReligion(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Enrolled-Student-Religion-Wise.xml',
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
  getEnrolledStudentsMarks(key) {
    this.reportData = [];
    this.repository.GetEnrolledStudentsContact(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Enrolled/Enrolled-Student-Marks-Wise.xml',
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
