import Vue from "vue";
import Component from "vue-class-component";
// import { ReportEngine } from "../../../../../components";
import { AttendanceReportsService } from "../../../service/Reports/AttendanceReports";
import { ISetupCampus, ICampusCityVM } from "../../../models/Setup/Campus";
import moment from "moment";

import {
  SetupCampusService,
  SetupProgramDetailsService,
  SetupClassService,
  RegistrationCourseService,
  AttendanceAttendanceDetailService,
  SetupCampusProgramLinkService,
  RegistrationProgramCourseLinkService,
  SetupProgramService,
  SetupShiftService,
  RegistrationSectionCourseLinkService,
  AdmissionStudentsService,
  RegistrationEnrollmentsService,
  SetupSubCityService,
  SetupCityService
} from "../../../service";
import { ISetupSession } from "../../../models/Setup/Session";
import { SetupSessionService } from "../../../service/Setup/Session";
import { SetupGenderService } from "../../../service/Setup/Gender";
import { ISetupGender } from "../../../models/Setup/Gender";
import { ISetupProgramDetails, ISetupClass, ICourseSection, IRegistrationCourse, ISetupCampusProgramVM, ITimeTableTimeTableVM, IAttendanceAttendanceReport, DDLModel, DDLGroupModel, IAttendenceData, RegistrationProgramCourseLinkVM, ISetupProgram, ISetupShift, IRegistrationSectionCourseLinkVM, VWStudentSectionProfile, IAttendanceAttendanceIndividSummary, ISetupProgramDetailsVM, IStudentOfSection, CitySubCity, ISetupCity, } from "../../../models";
import { ISetupSection } from "../../../models/Setup/Section";
import { SetupSectionService } from "../../../service/Setup/Section";
import { StoreTypes } from "../../../../../store";
import { PayloadMessageTypes, IUser } from "../../../../../model";
import { IVWCampusBaseProgram } from "../../../models/Setup/CampusBaseProgram";
import { State } from "vuex-class";
import { IRootStoreState, RootStoreTypes } from "../../../../store";
import * as helper from '../../../helper';
import { debug } from "console";
import { FeeReportsService } from "../../../service/Reports/FeeReports";
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
export class AttendanceReports extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private datas: Array<IAttendenceData> = [];
  private checkbutton: boolean = false;
  private checkbutton20: boolean = true;
  private checkcity: boolean = true;
  
  private checkbutton2: boolean = true;
  private checkbutton25: boolean = false;
  private checkbutton22: boolean = true;


  

  
  private checkbutton3: boolean = false;
  private checkbutton4: boolean = false;
  private checkbutton11: boolean = false;
  private checkbutton4Ex : boolean = false;
  private checkbutton19: boolean = false;
private checkbuttonteacher: boolean = false;

  private checkbutton12: boolean = false;
  private checkbutton15 = false;
  private repository: AttendanceAttendanceDetailService;
  private sessionModel: Array<ISetupSession> = [];
  private campusModel: Array<ISetupCampus> = [];
  private campusRepo: SetupCampusService;
  private programSRepo: SetupProgramService = new SetupProgramService(this.$store);
  private sectionRepo: RegistrationSectionCourseLinkService;
  private sessionRepo: SetupSessionService;
  private classRepo: SetupClassService;
  private checkshift: boolean = false;
  private checksection: boolean = false;
  cityId: string = "";
  private cityList: Array<ISetupCity> = []
  private repositoryex: FeeReportsService;

  private checkclass: boolean = false;
  private sectionList: Array<ISetupSection> = [];
  private classRepository: SetupClassService = null;
  private shiftRepo: SetupShiftService = new SetupShiftService(this.$store);
  private programRepo: SetupProgramDetailsService;
  private programModel: Array<ISetupProgramDetails> = [];
  private classModel: Array<ISetupClass> = [];
  private sectionModel: Array<ISetupSection> = [];
  private paramList: Array<IQueryParam> = [];
  private shiftId: string = "";
  private courseModel: Array<IRegistrationCourse> = [];
  private courseRepo: RegistrationCourseService;
  private shiftList: Array<ISetupShift> = [];
  private genderModel: Array<ISetupGender> = [];
  private genderRepo: SetupGenderService;
  private programList: Array<IVWCampusBaseProgram> = [];
  private reportData: any = [];
  private courseList: Array<RegistrationProgramCourseLinkVM> = []

  private admissionformid: string = '';

  private report: String = "";
  private idCampus: string = "";
  private idSession: String = "";
  private idGender: string = "";
  private idProgram: string = "";
  private idClass: string = "";
  private idSection: string = "";
  private idCourse: string = "";
  private fromDate = new Date();
  private toDate = new Date();
  private eldate = new Date();
  private sectionId: string = "";
  private campusProgramId = '';
  private check = '';
  private checkdatebutton: boolean = false;
  private checkstatus: boolean = false;
  private filterString: string = '';
  private courseid = '';
  private subCityRepo: SetupSubCityService = new SetupSubCityService (this.$store);
  private checkcity1: boolean= false;
  private checksubcityEx: boolean= false;

  

  // enrollmentRepo: any;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)

  private checkprogram: boolean = false;
  programDetailId: string = "";
  data: any[];
  ddl: Array<DDLModel> = [];
  programDDL: Array<DDLGroupModel> = [];
  sessionId: string = "";
  campusId: string = "";
  courseId: string = "";
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private courseLists: Array<RegistrationProgramCourseLinkVM> = [];
  private cityRepo: SetupCityService = new SetupCityService(this.$store)

  classList: Array<ISetupClass> = [];
  date: Date;
  private programDetailList: Array<ISetupProgramDetailsVM> = [];
  classId: string = "";
  programId: string = "";
  datestring: string;
  timeTableRepo: any;
  private campusCityListEx: Array<ICampusCityVM> = []
  private checkcampus: boolean = false;

  programCourseList: any[];
  private checkProg: boolean = false;
  private checkButton: boolean = false;
  private campusCityList: Array<ICampusCityVM> = []

  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []

  attendanceBulkList: Array<IAttendanceAttendanceIndividSummary> = [];
  private stdservice: AdmissionStudentsService = null;

  private subCityId: string = "";

  private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store)

  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private attendanceDetailRepo: AttendanceAttendanceDetailService = new AttendanceAttendanceDetailService(this.$store)
  private subCityList: Array<CitySubCity> = [];

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private columns = [
    { key: 'rollNo', caption: 'Roll No' },
    { key: 'fullName', caption: 'Student Name' },
    { key: 'className', caption: 'Class Name' },
    { key: 'action', caption: 'Action', width: 120 }
  ];
  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('attendanceReports' in this.user.claims) == true) {

        if (this.user.claims['attendanceReports'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['attendanceReports'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['attendanceReports'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['attendanceReports'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push('Home');
      }
    }
  }
  created() {
    this.repository = new AttendanceAttendanceDetailService(this.$store);
    this.repositoryex = new FeeReportsService(this.$store);

    this.sessionRepo = new SetupSessionService(this.$store);
    this.stdservice = new AdmissionStudentsService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.programRepo = new SetupProgramDetailsService(this.$store);
    this.classRepo = new SetupClassService(this.$store);
    this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
    this.courseRepo = new RegistrationCourseService(this.$store);
    this.genderRepo = new SetupGenderService(this.$store);
    this.classRepository = new SetupClassService(this.$store);
this.loadCity();
    this.loadSession();
    // this.getGender();
     this.loadPrograms();
    this.loadCityCampus();
    this.loadCityofCampus();
    this.loadShift();
    this.loadClass();
    this.$watch("check", this.reset);
    this.$watch('programId', this.loadProgramsOfCampus);
    this.$watch('campusId', this.loadPrograms);

    this.$watch('programId', this.loadSection);
    this.$watch('programDetailId', this.loadSection);
    this.$watch('classId', this.loadSection);
    this.$watch('sectionId', this.loadSectionCourse);
    this.$watch('cityId', this.loadCityofCampus);





    // this.$watch('classId', this.loadSection);

    this.validatePage();
    // this.loadSection();
  }
  reset() {
    this.programId = '';
    this.programList = [];
    this.programDetailId = '';
    this.campusProgramLinkList = [];
    this.shiftId = '';
    this.classId = '';
    this.classList = [];
    this.sectionId = '';
    this.sectionList = [];
    this.loadPrograms();
    this.loadShift();
    this.loadClass();
      this.checkcampus = false;

  }

  private displayList: Array<IStudentOfSection> = [];
  getAttendanceIndividSummary() {

    this.reportData = [];
    var key = this.filterString + "?" + this.user.userId;
    this.displayList = []
    this.stdservice.GetStudentsByRollNo(key).then(r => {

      this.displayList = r as any;
    })
  }
  viewReport(item) {
    debugger;
    this.reportData = [];
    var key = item.rollNo + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + item.classId;

    this.stdservice.GetStudentDetails(key).then(r => {

      // this.attendanceBulkList=r as Array<IAttendanceAttendanceIndividSummary>;
      this.reportData = r as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Attendance/Attendance-Summary-Individual.xml',
        show: true
      });

    })

  }
  // getAttendanceIndividSummary(key) {

  //   this.reportData = [];
  //   this.repository.GetStudentDetails(this.filterString).then(response => {
  //     this.reportData = response as any;
  //     this.report = "/assets/Reports/Resource/Attendance/Attendance-Summary.xml";
  //     this.$modal.show("report-viewer-eng");
  //   });
  // }

  // changeProram() {
  //   this.addParam(this.checkprogram,'ProgramId');
  //   this.loadProgramsOfCampus();
  // }

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
    this.addParam(this.checkclass, 'ClassId');
    this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.classList = r as Array<ISetupClass>;
    });
  }
  loadSectionCourse() {
    this.courseLists = [];
    if (this.programDetailId.length > 0 && this.classId.length > 0) {
      var key = this.programDetailId + "?" + this.classId
      this.programCourseRepo.GetAllFilterData(key)
        .then(r => {
          this.courseLists = r as Array<RegistrationProgramCourseLinkVM>

        });
    }

  }

  // loadSection() {
  //   this.addParam(this.checkclass, 'ClassId');
  //   var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
  //   this.addParam(this.checksection, 'sectionId');
  //   // alert(cmid); 
  //   this.sectionRepo.GetSectionBycampusprogramid(cmid)
  //     .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));

  // }


  loadSection() {
    this.sectionList = [];
    if (this.campusId.length > 0 && this.programDetailId.length > 0 && this.sessionId.length > 0) {
      var cmid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
      this.addParam(this.checkclass, 'ClassId');
      if (cmid.length > 0 && this.classId.length > 0) {
        var key = cmid + '?' + this.classId
        this.enrollmentRepo.GetSectionList(key)
          .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
      }
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
    if (this.check == 'Attendance Detail Report' || this.check == 'Teacher Marked Attendance') {

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
        // console.log('in program')
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND cv.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
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
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ShiftId'), 1)
            this.paramList.push({ param: "AND cv.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND cv.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
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
            this.paramList.push({ param: "AND cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
        // alert('ClassId'+this.classId)
      }
      if (param == 'SectionId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1)
            this.paramList.push({ param: "AND cv.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          } else {
            this.paramList.push({ param: "AND cv.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
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
            this.paramList.push({ param: "AND cv.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND cv.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
    }
    else if (this.check == 'Teacher Wise Attendance Status Report') {
      debugger;
            if (param == 'cityId') {
              if (isChecked) {
                if (this.paramList.find(s => s.name == 'cityId')) {
                  this.paramList.find(s => s.name == 'cityId').value = this.cityId;
                } else {
                  this.paramList.push({ param: "AND sbc.\"cityId\"", value: this.cityId, name: 'cityId' });
                }
              } else {
                if (this.paramList.find(s => s.name == 'cityId')) {
                  this.paramList.splice(this.paramList.findIndex(s => s.name == 'cityId'), 1);
                }
              }
            }
            if (param == 'subCityId') {
              if (isChecked) {
                if (this.paramList.find(s => s.name == 'subCityId')) {
                  this.paramList.find(s => s.name == 'subCityId').value = this.subCityId;
                } else {
                  this.paramList.push({ param: "AND cmp.\"subCityId\"", value: this.subCityId, name: 'subCityId' });
                }
              } else {
                if (this.paramList.find(s => s.name == 'subCityId')) {
                  this.paramList.splice(this.paramList.findIndex(s => s.name == 'subCityId'), 1);
                }
              }
            }
            if (param == 'CampusId') {
              if (isChecked) {
                if (this.paramList.find(s => s.name == 'CampusId')) {
                  this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
                } else {
                  this.paramList.push({ param: "AND cpl.\"CampusId\"", value: this.campusId, name: 'CampusId' });
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
            
          }
    else if (this.check == 'Attendance Summary' || this.check == 'Attendance Status Report' || this.check == 'Student Attendance Status' || this.check == 'Student Attendance Status Subject Wise' || this.check == 'Attendance Report' || this.check == 'El Attendance Report' || this.check == 'Subject Wise Attendance Report') {
      // console.log('else if')

      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND \"Campus\".\"CampusId\"", value: this.campusId, name: 'CampusId' });
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
            // console.log('found')
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND \"Program\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND \"Program\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.push({ param: "AND \"Shift\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"Shift\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
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
            this.paramList.push({ param: "AND \"Class\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"Class\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }

        console.log(JSON.stringify(this.paramList))
      }
      if (param == 'SectionId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SectionId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1)
            this.paramList.push({ param: "AND \"Section\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          } else {
            this.paramList.push({ param: "AND \"Section\".\"SectionId\"", value: this.sectionId, name: 'SectionId' });
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
            this.paramList.push({ param: "AND \"ProgramDetails\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"ProgramDetails\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
    }
    else if (this.check == 'Attendance Register') {
      // console.log('else if')

      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND cpl.\"CampusId\"", value: this.campusId, name: 'CampusId' });
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
            // console.log('found')
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND sp.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND sp.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.push({ param: "AND sss.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND sss.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
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
            this.paramList.push({ param: "AND ssc.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND ssc.\"ClassId\"", value: this.classId, name: 'ClassId' });
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
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1)
            this.paramList.push({ param: "AND ssec.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          } else {
            this.paramList.push({ param: "AND ssec.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
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
            this.paramList.push({ param: "AND spd.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND spd.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
    }
    else if (this.check == 'Attendance Register Absent') {
      // console.log('else if')

      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND cpl.\"CampusId\"", value: this.campusId, name: 'CampusId' });
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
            // console.log('found')
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND sp.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND sp.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.push({ param: "AND sss.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND sss.\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
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
            this.paramList.push({ param: "AND ssc.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND ssc.\"ClassId\"", value: this.classId, name: 'ClassId' });
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
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1)
            this.paramList.push({ param: "AND ssec.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
          } else {
            this.paramList.push({ param: "AND ssec.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
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
            this.paramList.push({ param: "AND spd.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND spd.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
    }
  }
  selectReport() {

    if (this.check == "Attendance Detail Report") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkstatus = false;
      this.checkbutton2 = true;
      this.checkbutton25=false;
     this.checkcity1=false;
     this.checkbuttonteacher=false;

     this.checksubcityEx=false;
    } 
    else if (this.check == "Teacher Wise Attendance Status Report") {
      this.checkbutton = false;
      this.checkbutton2 = true;
       this.checkbutton25=true;
       this.checkbutton22=false;
      this.checkcity1=true;
      this.checkbuttonteacher=true;

      this.checksubcityEx=true;
      this.checkbutton20=false;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbutton19 = true;
      this.checkbutton11 = false;
this.checkbutton4Ex=true;
this.checkcity=false;
this.checkbutton=false;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkstatus = false;
      this.checkbuttonteacher=true;
    } 
    else if (this.check == "Attendance Report") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkstatus = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
 
      this.checksubcityEx=false;
    }
    else if (this.check == "El Attendance Report") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbutton11 = false;
      this.checkbutton12 = true;
      this.checkbutton15 = false;
      this.checkstatus = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;

    } else if (this.check == "Attendance Register") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbutton11 = true;
      this.checkstatus = false;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;

    } else if (this.check == "Attendance Register Absent") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkstatus = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;
    }
    else if (this.check == "Attendance Status Report") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkstatus = true;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;
    } else if (this.check == "Teacher Marked Attendance") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkstatus = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;
    } else if (this.check == "Student Attendance Status") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbutton11 = true;
      this.checkstatus = false;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;

    }
    else if (this.check == "Student Attendance Status Subject Wise") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkstatus = false;
      this.checkbutton4 = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton15 = true;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;
    } else if (this.check == "Subject Wise Attendance Report") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkstatus = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;

    } else if (this.check == "Attendance Summary") {
      this.checkbutton = true;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkstatus = false;
      this.checkbutton4 = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton15 = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;
    } 
    
    
    
    else if (this.check == "Attendance Individual Summary") {
      this.checkbutton = true;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkbutton4 = true;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkstatus = false;
      this.checkbutton15 = false;
      this.checkbutton25=false;
      this.checkcity1=false;
      this.checkbuttonteacher=false;
      this.checksubcityEx=false;
    }
    console.log(this.checkbutton3)
    if (this.checkbutton3 == false) {
      this.displayList = []
    }
  }
  generate() {
    if (this.check == "Attendance Detail Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"Dated\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.getAttendanceDetailReport(where)

    } 
    else if (this.check == "Attendance Report") {
      
        // this.typeId = this.examScheduleList.find(e => e.examTypeId == this.examTypeId).fullName;
       // var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?"+helper.formateDate(this.fromDate) +"?" + helper.formateDate(this.toDate) ;
        // this.paramList.forEach(e => {
        //   where = where + " " + e.param + "=''" + e.value + "''";
        // })
      //var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

     // this.paramList.forEach(e => {

       // where = where + " " + e.param + "=''" + e.value + "''";
     // var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      //this.getAttendanceReport(where)
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";})
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
     this.getAttendanceReport(where)
    }
    else if (this.check == "El Attendance Report") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getAttendanceElReport(where)

    } else if (this.check == "Attendance Status Report") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      if (this.checkdatebutton) {
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      }
      this.getAttendanceStatusReport(where)

    } else if (this.check == "Teacher Marked Attendance") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"Dated\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.getDirectlyMarkedAttendanceReport(where)

    } else if (this.check == "Student Attendance Status") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getAbsentLeaveReport(where)

    } else if (this.check == "Student Attendance Status Subject Wise") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      where = where + `AND (pcl.\"CourseId\" = ''` + this.courseid + "'')"

      this.generate3(where)

    }





    else if (this.check == "Subject Wise Attendance Report") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getSubjectWiseReport(where)

    } else if (this.check == "Attendance Summary") {
      // var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("Campus".\"CampusId\" = ''` + this.campusId + `'')`;

      // this.paramList.forEach(e => {

      //   where = where + " " + e.param + "=''" + e.value + "''";

      // })
      // var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      var where = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?"+helper.formateDate(this.fromDate) +"?" + helper.formateDate(this.toDate) ;
        
      this.getAttendanceSummary(where)

    } else if (this.check == "Attendance Individual Summary") {
      this.getAttendanceIndividSummary()

    }
    else if (this.check == "Attendance Register") {
      var where = `AND (ss.\"SessionId\" = ''` + this.sessionId + `'') AND (cpl.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getAttendanceRegister(where)

    }
    else if (this.check == "Attendance Register Absent") {
      var where = `AND ats.\"FullName\"=''Absent''  AND (ss.\"SessionId\" = ''` + this.sessionId + `'') AND (cpl.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getAttendanceRegisterAbsent(where)

    }

    // console.log(where);

  }
  // showButton()
  // {
  //   if(this.sessionId != null && this.campusId !=null && this.programDetailId != null && this.classId != null && this.idSection != null && this.fromDate != null && this.toDate != null)
  //   {
  //     this.checkButton = true;
  //   }

  // }
  getAttendanceDetailReport(key) {

    this.reportData = [];
    this.repository.GetAttendanceReport(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/attendance-Detail-Report.xml',
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
  
  ///////////////////////////////////////
  getAttendanceReport(key) {
debugger;
    this.reportData = [];
//var key =item.sessionId+"?"+item.campusid+"?"+ item.programid +"?" +item.programDetailId +"?" +item.classId+ "?" +item.sectionId +"?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" ;
    this.repository.GetAttendanceReports(key).then(response => {
      this.reportData = response as any; 
      
      console.log('-------------' + JSON.stringify(this.reportData));

      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/studantattendance-report.xml',
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
  generateteacherrep()
  {
    debugger;
    var where = `AND cpl.\"SessionId\" = ''` + this.sessionId + `'' AND sbc.\"CityId\" = ''` + this.cityId + `'' AND cmp.\"SubCityId\" = ''` + this.subCityId + `''`;

    this.paramList.forEach(e => {

      where = where + " " + e.param + "=''" + e.value + "''";

    })
    var where = where +'?'+  helper.formateDate(this.fromDate) 
    this.getteacherreport(where)
  }
  getAttendanceElReport(key) {
    var keyys = this.sessionId + '?' + this.campusId + '?' + this.programId + '?' + this.programDetailId + '?' + this.classId + '?' + this.sectionId + '?' + helper.formateDate(this.eldate)

    this.reportData = [];
    this.repository.GetAttendanceElReports(keyys).then(response => {
      this.reportData = response as any;

      console.log(this.reportData);

      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/attendance-report-el.xml',
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
  getAttendanceRegister(key) {
    key=key+"?"+moment(this.fromDate).format("YYYY/MM/DD")+"?"+moment(this.toDate).format("YYYY/MM/DD");
    console.log(key)
    var campus = this.campusCityList.find(e => e.campusId == this.campusId).campusName;
    this.reportData = [];
    this.repository.GetAttendanceRegister(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
          element.campustitle = campus;
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/Attendance-Register.xml',
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
  loadCityofCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
      if (this.cityId.length > 0) {
        this.campusCityListEx = this.campusCityList.filter(e => e.cityId == this.cityId);
      }

    });
  }
  getAttendanceRegisterAbsent(key) {
    key=key+"?"+moment(this.fromDate).format("YYYY/MM/DD")+"?"+moment(this.toDate).format("YYYY/MM/DD");
    var campus = this.campusCityList.find(e => e.campusId == this.campusId).campusName;
    this.reportData = [];
    this.repository.GetAttendanceRegister(key).then(response => {
      this.reportData = response as any;
      // alert(JSON.stringify(this.reportData))
      if (this.reportData.length > 0) {
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
          element.campustitle = campus;

        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/Attendance-Register-absent.xml',
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
  getAttendanceStatusReport(key) {

    this.reportData = [];
    this.repository.GetAttendanceReportsEx(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        // this.$store.dispatch(RootStoreTypes.reportOperation, {
        //   data: this.reportData as any,
        //   path: '/assets/Reports/Resource/Attendance/Absent-Leave-Report.xml',
        //   show: true
        // });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/Attendance-Status-Report.xml',
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

  loadSubCity() {
    debugger
    if (this.sessionId.length > 0 && this.cityId.length > 0) {
      this.classId = "";
      this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
        this.subCityList = r as Array<CitySubCity>;
        debugger
      });
    }
  }
  loadCity() {
    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }

  generate3(key) {

    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.courseid.length > 0) {

      this.reportData = [];
      this.repository.GenerateAttendenceStatusSubjectWise(key).then(response => {
        this.reportData = response as any;
        console.log(JSON.stringify(this.reportData))
        if (this.reportData.length > 0) {
          this.reportData.forEach(element => {
            element.fromDate = this.fromDate
            element.toDate = this.toDate
          });
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Attendance/Absent-Leave-Report-Subject-Wise.xml',
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
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select Compulsory Dropdowns",
        title: "Success",
        messageTypeId: PayloadMessageTypes.warning
      });

    }

  }



  getAbsentLeaveReport(key) {

    this.reportData = [];
    this.repository.GetAttendanceReportsExx(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/Absent-Leave-Report.xml',
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
  getAttendanceSummary(key) {
  debugger;
    this.reportData = [];
    this.repository.GetAttendanceSummary(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/Attendance-Summary.xml',
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


  getSubjectWiseReport(key) {

    this.reportData = [];
    this.repository.GetSubjectWiseReport(key).then(response => {
      this.reportData = response as any;
      if (this.reportData) {
        if (this.reportData.length > 0) {
          this.reportData[0].datedParam = 'From Date ' + helper.formateDate(this.fromDate) + ' to Date ' + helper.formateDate(this.toDate);
          // alert(this.reportData[0].datedParam);
        }
      }
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Attendance/Attendance-Subject-Wise.xml',
        show: true
      });
    });
  }
  getDirectlyMarkedAttendanceReport(key) {

    this.reportData = [];
    this.repository.GetDirectlyMarkedAttendanceReport(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {

        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Attendance/Directly-Marked-Attendance.xml',
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
  getteacherreport(key){
    debugger;

     //var key = this.sessionId + "?" + this.cityId + "?" + this.subCityId + "?" + helper.formateDate(this.fromDate)
    console.log(key);
this.reportData=[];
    this.repositoryex.TeacherReport(key).then(response => {
      if (response == null ||  response == 0) {
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
          path: '/assets/Reports/Resource/Attendance/teacher_attendance_report.xml',
          show: true
        });
      }
    });
  }
  
  // getAdmissionReport() {
  //   if (this.checkProg == true) {
  //     this.reportData = [];
  //     var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + this.idSection + "?" + this.courseId + "?" + helper.formateDate(this.fromDate) + "?" + this.toDate;
  //     this.report =
  //       "/assets/Reports/Resource/Attendance/attendance-Report.xml";
  //     this.repository.GetAttendanceReportVM(key).then(response => {
  //       this.reportData = response as any;
  //       this.$modal.show("report-viewer-eng");

  //     });
  //   }
  //   else {
  //     this.reportData = [];
  //     var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + this.idSection + "?" + helper.formateDate(this.fromDate) + "?" + this.toDate;
  //     this.report =
  //       "/assets/Reports/Resource/Attendance/attendance-Report.xml";
  //     this.repository.GetAttendanceReportWithoutCourseVM(key).then(response => {
  //       this.reportData = response as any;
  //       this.$modal.show("report-viewer-eng");
  //     });
  //   }
  // }
}
