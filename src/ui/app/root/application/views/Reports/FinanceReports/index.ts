import * as helper from '../../../helper';

import { DDLGroupModel, DDLModel, FeeDefaultEx, IFeeFeeHead, IRegistrationSectionCourseLinkVM, ISetupAdmissionType, ISetupCampusProgramVM, ISetupCity, ISetupClass, ISetupCollector, ISetupGender, ISetupProgram, ISetupProgramDetails, ISetupSection, ISetupShift, ITransportationRouteDetailInfo, IVWStudentsProfileEx1, IVWStudentsProfileEx1new, IVWCityFinanceData, IVWCampusFinanceData, IVWProgramFinanceData, CitySubCity } from "../../../models";
import {
  FeeFeeHeadService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCityService, SetupClassService, SetupCollectorService, SetupProgramService, SetupSectionService, SetupShiftService, TransportationRouteDetailInfoService, SetupSubCityService,
} from "../../../service";
import { ICampusCityVM, ISetupCampus } from "../../../models/Setup/Campus";
import { IConcessionReportModel, IFeeReports } from "../../../models/Reports/FeeReports";
import { IRootStoreState, RootStoreTypes } from "../../../../store";
import { IUser, PayloadMessageTypes } from "../../../../../model";

import Component from "vue-class-component";
import { FeeReportsService } from "../../../service/Reports/FeeReports";
import { ISetupSession } from "../../../models/Setup/Session";
import { IVWCampusBaseProgram } from "../../../models/Setup/CampusBaseProgram";
import { SetupCampusProgramLinkService } from "../../../service/Setup/CampusProgramLink";
import { SetupCampusService } from "../../../service/Setup/Campus";
import { SetupGenderService } from "../../../service/Setup/Gender";
import { SetupProgramDetailsService } from "../../../service/Setup/ProgramDetails";
import { SetupSessionService } from "../../../service/Setup/Session";
import { State } from "vuex-class";
import { StoreTypes } from "../../../../../store";
import Vue from "vue";
import { and } from "vuelidate/lib/validators";
import { Console } from 'console';

// import { ReportEngine } from "../../../../../components";
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
export class FinanceReports extends Vue {
  private flage1 = false;
  private flage88 = false;
  private flage3 = false;
  private flage33 = false;

  private flage55 = false;
  private flage = false;
  private checkbutton25 = false;
  private checkexcel = false;
  private checkStdexcel = false;
  private checkStddifferenceexcel = false;
  private checkbusnes = false;
  private citycondil = false;
  private checkbankexcel = false;
  private checkcamp = false;
  private checkstudcamp = false;


  private checkprogm = false;

  private checkprogmlatest = false;
  private checkfromDate = false;
  private checkDated = false;

  private checktoDate = false;
  private showSection = false;
  private sectionCourseLinkId = '';
  private datas: Array<IVWStudentsProfileEx1> = [];
  private studentRecord: any = [];
  private studentRecordnew: Array<IVWStudentsProfileEx1new> = [];
  private CityFinance: Array<IVWCityFinanceData> = [];
  private CampusFinance: Array<IVWCampusFinanceData> = [];

  private ProgramFinance: Array<IVWProgramFinanceData> = [];

  private FinanceDated: any = [];
  private CityFinanceDated: any = [];

  private reposstudent: string = '';
  private sesionid: string = '';
  private cityid: string = '';
  private campusid: string = '';
  private programid: string = '';

  private classid: string = '';
  private sectionid: string = '';
  private genderid: string = '';
  datestring2 = new Date();
  datestring1 = new Date();
  todatestring2 = new Date();
  todatestring = new Date();


  private filterString: string = '';
  private fullName: string = '';
  private sessionName: string = '';
  private session: string = "";
  private StudentFinance: string = "";
  checkpaidtran = false;
  private campus: string = "";
  private repository: FeeReportsService;

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
  private campusCityListEx: Array<ICampusCityVM> = []
  private campusRepo: SetupCampusService;
  private genderModel: Array<ISetupGender> = [];
  private genderRepo: SetupGenderService;
  private programModel: Array<ISetupProgramDetails> = [];
  private programRepo: SetupProgramDetailsService;
  private admissionReport: Array<IFeeReports> = [];
  private reportData: any = [];
  private busniesswiseData: any = [];
  private bankswiseData: any = [];

  private citydifferentformat: any = [];

  private report: String = "";
  private idCampus: string = "";
  private idSession: String = "";
  private campusProgramId: string = "";
  private idGender: string = "";
  private idProgram: string = "";
  private Programsp: boolean = false;
  private check: string = "";
  private fromDate = new Date();
  private toDate = new Date();
  private checkProg: boolean = false;
  private checkGen: boolean = false;
  private checkbutton: boolean = false;
  private checkbutton2: boolean = false;
  private checkbutton6: boolean = false;
  private checkbutton7: boolean = false;
  private showdata: boolean = false;
  checkroute = false;
  private flage59: boolean = false;
  private checkbutton9: boolean = false;
  checktranport: boolean = false;
  checkButt: boolean = false;
  private checkinstPaid: boolean = false;
  checkbutton55: boolean = false;
  checkGender: boolean = false;
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
  private genderId = '';
  private checksection: boolean = false;
  private checkgender: boolean = false;
  private chechkfeehead: boolean = false;
  // private sectionRepo: SetupSectionService;
  private sectionRepo: RegistrationSectionCourseLinkService;
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private collectorList: Array<ISetupCollector> = [];
  private collectorRepository: SetupCollectorService = null;
  private checkcollector: boolean = false;
  routedetailId = '';
  private shiftId: string = "";
  private classId: string = "";
  private sectionId: string = "";
  private collectorId: string = "";
  private feeHeadId: string = "";
  private feeHeadList: Array<IFeeFeeHead> = [];
  private feeHeadRepository: FeeFeeHeadService = new FeeFeeHeadService(this.$store);
  private orderby = 'ChallanNo'
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)

  private installNo: number = 1;
  private concessReport: Array<IConcessionReportModel> = [];
  private checkcity: boolean = false;
  private checksubcity: boolean = false;

  private checkbutton3: boolean = false;
  private checkbutton4: boolean = false;
  private checkbutton10: boolean = false;
  private checkbutton5: boolean = false;
  private checkinstall: boolean = false;
  private checkclassEnr: boolean = false;
  private checkinstallment: boolean = false;
  private checkinstallments: boolean = false;
  private checkRevenue: boolean = false;
  private checkStdRevenue: boolean = false;
  private checkStdRevenueEx: boolean = false;
  private shiftIdA: string;
  private checkdate: boolean = false;
  private Transprepository: TransportationRouteDetailInfoService = new TransportationRouteDetailInfoService(this.$store);
  Transporlist: Array<ITransportationRouteDetailInfo> = [];

  private checkdatebutton: boolean = false;
  private checkSection: boolean = false;
  cityId: string = "";
  subCityId: string = "";

  private cityList: Array<ISetupCity> = []
  private cityRepo: SetupCityService = new SetupCityService(this.$store)

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private subCityList: Array<CitySubCity> = [];
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkcampus: boolean = false;
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }]

  mounted() {
    this.validatePage();
  }


  private columns = [
    { key: 'ref_No', caption: 'Refference No' },
    { key: 'Reg_No', caption: 'Roll No' },
    { key: 'student_Name', caption: 'Student Name' },
    { key: 'father_Name', caption: 'Father Name' },
    { key: 'program', caption: 'Description' },
    { key: 'action', caption: 'Action', width: 120 }
  ];

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('financeReports' in this.user.claims) == true) {

        if (this.user.claims['financeReports'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['financeReports'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['financeReports'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['financeReports'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push('Home');
      }
    }
  }

  created() {
    this.repository = new FeeReportsService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.genderRepo = new SetupGenderService(this.$store);
    this.programRepo = new SetupProgramDetailsService(this.$store);
    this.classRepository = new SetupClassService(this.$store);
    this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
    this.collectorRepository = new SetupCollectorService(this.$store);
    this.loadSession();
    //this.loadCityCampus();
    this.getGender();
    this.loadClass();

    this.loadCity();
    this.$watch('campusId', this.loadPrograms);
    this.$watch('programId', this.loadProgramsOfCampus);
    this.$watch("check", this.reset);

    // this.$watch('subCityId', this.loadCityCampus);
    this.$watch('classId', this.loadSection);

    // this.loadProgramsOfCampuses();
    // this.loadPrograms();
    // this.loadCollector();
  }
  reset() {
    this.getstudents();
    this.sessionId = '';
    this.cityId = '';
    this.subCityId = '';
    this.campusId = '';
    this.sectionId = '';
    this.sectionList = [];
    this.programId = '';
    this.programList = [];
    this.programDetailId = '';
    this.campusProgramLinkList = [];
    this.chechkfeehead = false;
    this.checkProg = false;
    this.checkcampus = false;
    this.checkclass = false;
    this.checkcollector = false;
    this.checkprogram = false;
    this.checksection = false;
    this.checkgender = false;
    this.checkroute = false;
    this.checkshift = false;
    this.checkcity = false;
    this.checksubcity = false;
    this.shiftId = '';
    this.shiftList = [];
    this.classId = '';
    this.classList = [];
    this.collectorId = '';
    this.collectorList = [];
    this.feeHeadId = '';
    this.feeHeadList = [];
    this.loadCityCampus();

    this.loadClass();

    // this.loadSection();

    this.loadPrograms();
  }



  loadSubCity() {
    debugger
    this.addParam(this.checksubcity, 'subCityId');

    if (this.cityId.length > 0) {
      this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
        this.subCityList = r as Array<CitySubCity>;
        debugger
      });
    }
  }


  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM().then(r => {
      this.campusCityList = r as Array<ICampusCityVM>;
      if (this.subCityId.length > 0) {
        this.campusCityListEx = this.campusCityList.filter(e => e.subCityId == this.subCityId);
      }

    });
  }
  getGender() {
    debugger;
    this.checkgender = true;
    this.addParam(this.checkgender, 'genderId')
    this.genderRepo
      .GetAll()
      .then(response => (this.genderModel = response as Array<ISetupGender>));
  }

  loadSection() {
    this.sectionList = [];

    var cmid = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programId == this.programId).campusProgramId;

    if (cmid.length > 0 && this.classId.length > 0) {
      var key = cmid + '?' + this.classId
      this.enrollmentRepo.GetSectionList(key)
        .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
    }

  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }
  loadCity() {
    this.addParam(this.checkcity, 'cityId');

    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })

  }
  loadPrograms() {
    this.programId = '';
    this.programDetailId = '';
    this.addParam(this.checkProg, 'programId');
    if (this.campusId.length > 0) {
      this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
        .then(r => {
          this.programList = r as Array<IVWCampusBaseProgram>
        })
    }


  }


  loadClass() {
    this.addParam(this.checkclass, 'classId');
    this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.classList = r as Array<ISetupClass>;
    });
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
    if (this.check == 'Daily Fee Statement') {
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
      if (param == 'CollectorId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.find(s => s.name == 'CollectorId').value = this.collectorId;
          } else {
            this.paramList.push({ param: "AND cv.\"CollectorId\"", value: this.collectorId, name: 'CollectorId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CollectorId'), 1);
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
      if (param == 'FeeHeadId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.find(s => s.name == 'FeeHeadId').value = this.feeHeadId;
          } else {
            this.paramList.push({ param: "AND cv.\"FeeHeadId\"", value: this.feeHeadId, name: 'FeeHeadId' });
          }
        } else {
          this.sectionId = '';
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'FeeHeadId'), 1);
          }
        }
      }

    }
    else if (this.check == 'Daily Fee Statement (Track History)') {
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
      if (param == 'CollectorId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.find(s => s.name == 'CollectorId').value = this.collectorId;
          } else {
            this.paramList.push({ param: "AND cv.\"CollectorId\"", value: this.collectorId, name: 'CollectorId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CollectorId'), 1);
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
      if (param == 'FeeHeadId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.find(s => s.name == 'FeeHeadId').value = this.feeHeadId;
          } else {
            this.paramList.push({ param: "AND cv.\"FeeHeadId\"", value: this.feeHeadId, name: 'FeeHeadId' });
          }
        } else {
          this.sectionId = '';
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'FeeHeadId'), 1);
          }
        }
      }

    }



    // else if (this.check == "Campus Wise Student  Finance Report(Difference Format)") {
    //   const jsonObj: any = {
    //     sessionid: this.sessionId,
    //     campusid: this.campusId
    //   };


    //   if (this.checkprogram && this.programId) {
    //     jsonObj.programid = this.programId;
    //   }

    //   if (this.checkProg && this.programDetailId) {
    //     jsonObj.programdetailid = this.programDetailId;
    //   }

    //   if (this.checkclass && this.classId) {
    //     jsonObj.classid = this.classId;
    //   }

    //   if (this.checksection && this.sectioncourselinkId) {
    //     jsonObj.sectioncourselinkid = this.sectioncourselinkId;
    //   }

    //   if (this.checkGen && this.idGender) {
    //     jsonObj.genderId = this.idGender;
    //   }


    //   this.paramList.forEach(e => {
    //     const cleanKey = e.param
    //       .toLowerCase()
    //       .replace(/and\s+/g, '')         
    //       .replace(/cv\./g, '')           
    //       .replace(/["\\]/g, '')         
    //       .trim();

    //     // Avoid overriding already-set keys
    //     if (!(cleanKey in jsonObj)) {
    //       jsonObj[cleanKey] = e.value;
    //     }
    //   });

    //   const providedString = JSON.stringify(jsonObj);
    //   this.getStepEnrollmentReport(providedString);
    // }


    else if (this.check == 'Campus Wise Student  Finance Report(Difference Format)') {
      debugger;
      if (param == 'cityId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'cityId')) {
            this.paramList.find(s => s.name == 'cityId').value = this.cityId;
          } else {
            this.paramList.push({ param: "AND cv.\"cityId\"", value: this.campusId, name: 'cityId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'cityId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'cityId'), 1);
          }
        }
      }


      if (param == 'subCityId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'subCityId')) {
            this.paramList.find(s => s.name == 'subCityId').value = this.subCityId;
          } else {
            this.paramList.push({ param: "AND cv.\"subCityId\"", value: this.subCityId, name: 'subCityId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'subCityId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'subCityId'), 1);
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
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.find(s => s.name == 'ClassId').value = this.classId;
          } else {
            this.paramList.push({ param: "cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }

      if (param == 'genderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'genderId')) {
            this.paramList.find(s => s.name == 'genderId').value = this.genderId;
          } else {
            this.paramList.push({ param: "cv.\"genderId\"", value: this.genderId, name: 'genderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'genderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'genderId'), 1);
          }
        }
      }
      if (param == 'InstallmentNo') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
            this.paramList.push({ param: "cv.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          } else {
            this.paramList.push({ param: "cv.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
          }
        }
      }

    }
    else if (this.check == 'Daily Fee Statement history') {
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
      if (param == 'CollectorId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.find(s => s.name == 'CollectorId').value = this.collectorId;
          } else {
            this.paramList.push({ param: "AND cv.\"CollectorId\"", value: this.collectorId, name: 'CollectorId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CollectorId'), 1);
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
      if (param == 'FeeHeadId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.find(s => s.name == 'FeeHeadId').value = this.feeHeadId;
          } else {
            this.paramList.push({ param: "AND cv.\"FeeHeadId\"", value: this.feeHeadId, name: 'FeeHeadId' });
          }
        } else {
          this.sectionId = '';
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'FeeHeadId'), 1);
          }
        }
      }

    }
    else if (this.check == 'Step Concession Count Report' || this.check == 'Step Count Report') {
      if (param == 'CityId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CityId')) {
            this.paramList.find(s => s.name == 'CityId').value = this.cityId;
          } else {
            this.paramList.push({ param: "AND scit.\"CityId\"", value: this.cityId, name: 'CityId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CityId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CityId'), 1);
          }
        }
      }
      if (param == 'CampusId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CampusId')) {
            this.paramList.find(s => s.name == 'CampusId').value = this.campusId;
          } else {
            this.paramList.push({ param: "AND sc.\"CampusId\"", value: this.campusId, name: 'CampusId' });
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
            this.paramList.push({ param: "AND sp.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.push({ param: "AND spd.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }

    }

    else if (this.check == 'Fee Defaulter Summary Report') {


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
            this.paramList.push({ param: "AND cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
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

      // if (param == 'InstallmentNo') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'InstallmentNo')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
      //       this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
      //     } else {
      //       this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'InstallmentNo')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
      //     }
      //   }
      // }

    }



    else if (this.check == 'Installement Exemption Report') {


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
            this.paramList.push({ param: "AND cv.\"ClassId\"", value: this.classId, name: 'ClassId' });
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

      if (param == 'InstallmentNo') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          } else {
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
          }
        }
      }

    }


    else if (this.check == 'Daily Fee Report' || this.check == 'Program Wise Fee Report' || this.check == 'Fee Defaulter Report' || this.check == 'Fee Defaulter Report Enrolled' || this.check == 'Student Challan Status' || this.check == 'Scholarship Student' || this.check == 'Final Dues List' || this.check == 'Average Revenue' || this.check == 'Transport Route Data') {
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
            this.paramList.push({ param: "AND \"VWCampusProgramLink\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND \"VWCampusProgramLink\".\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.push({ param: "AND \"VWCampusProgramLink\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
          } else {
            this.paramList.push({ param: "AND \"VWCampusProgramLink\".\"ShiftId\"", value: this.shiftId, name: 'ShiftId' });
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
            this.paramList.push({ param: "AND \"StudentChallan\".\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND \"StudentChallan\".\"ClassId\"", value: this.classId, name: 'ClassId' });
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
      if (param == 'CollectorId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CollectorId'), 1)
            this.paramList.push({ param: "AND \"Collector\".\"CollectorId\"", value: this.collectorId, name: 'CollectorId' });
          } else {
            this.paramList.push({ param: "AND \"Collector\".\"CollectorId\"", value: this.collectorId, name: 'CollectorId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'CollectorId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'CollectorId'), 1);
          }
        }
      }
      // if (param == 'InstallmentNo') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'InstallmentNo')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
      //       this.paramList.push({ param: "AND \"StudentChallan\".\"InstallmentNo\"", value: this.installNo.toString() , name: 'CollectorId' });
      //     } else {
      //       this.paramList.push({ param: "AND \"StudentChallan\".\"InstallmentNo\"", value: this.installNo.toString() , name: 'CollectorId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'InstallmentNo')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
      //     }
      //   }
      // }
      if (param == 'GenderId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.genderId.toString();
          } else {
            this.paramList.push({ param: "AND \"gd\".\"GenderId\"", value: this.genderId.toString(), name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
      if (param == 'RouteDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'RouteDetailId')) {
            this.paramList.find(s => s.name == 'RouteDetailId').value = this.routedetailId.toString();
          } else {
            this.paramList.push({ param: "AND \"rsl\".\"RouteDetailId\"", value: this.routedetailId.toString(), name: 'RouteDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'RouteDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'RouteDetailId'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND \"VWCampusProgramLink\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND \"VWCampusProgramLink\".\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }
      if (param == 'FeeHeadId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'FeeHeadId'), 1)
            this.paramList.push({ param: "AND \"FeeHead\".\"FeeHeadId\"", value: this.feeHeadId, name: 'FeeHeadId' });
          } else {
            this.paramList.push({ param: "AND \"FeeHead\".\"FeeHeadId\"", value: this.feeHeadId, name: 'FeeHeadId' });
          }
        } else {
          this.sectionId = '';
          if (this.paramList.find(s => s.name == 'FeeHeadId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'FeeHeadId'), 1);
          }
        }
      }
    }

    else if (this.check == 'Installment Paid Student') {
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
      if (param == 'ClassId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND sc.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND sc.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }


      if (param == 'InstallmentNo') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
            this.paramList.push({ param: "AND sc.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          } else {
            this.paramList.push({ param: "AND sc.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
          }
        }
      }
    }
    else if (this.check == 'Course Wise Revenue List') {

      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            // console.log('found')
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND t1.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND t1.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND t1.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND t1.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }


      if (param == 'InstallmentNo') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          } else {
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
          }
        }
      }
    }
    else if (this.check == 'Student Wise Revenue List') {

      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            // console.log('found')
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND t1.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND t1.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND t1.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND t1.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }


      if (param == 'InstallmentNo') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          } else {
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND t1.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND t1.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }

    }
    else if (this.check == 'Student Wise Revenue List Sub') {

      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            // console.log('found')
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND t1.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND t1.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND t1.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND t1.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }


      if (param == 'InstallmentNo') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          } else {
            this.paramList.push({ param: "AND t1.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND t1.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND t1.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }

    }


    else if (this.check == 'Student Wise Revenue List With Exemption') {

      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            // console.log('found')
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
            this.paramList.push({ param: "AND pgd.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
            //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
          } else {
            this.paramList.push({ param: "AND pgd.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
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
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
            this.paramList.push({ param: "AND sfs.\"ClassId\"", value: this.classId, name: 'ClassId' });
          } else {
            this.paramList.push({ param: "AND sfs.\"ClassId\"", value: this.classId, name: 'ClassId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ClassId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
          }
        }
      }


      if (param == 'InstallmentNo') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
            this.paramList.push({ param: "AND sfs.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          } else {
            this.paramList.push({ param: "AND sfs.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'InstallmentNo')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
          }
        }
      }
      if (param == 'ProgramDetailId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
            this.paramList.push({ param: "AND cpl.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          } else {
            this.paramList.push({ param: "AND cpl.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
          }
        }
      }

    }


    // else if (this.check == 'Installement Exemption Report') {

    //   if (param == 'ProgramId') {
    //     if (isChecked) {
    //       // alert(this.programId)
    //       if (this.paramList.find(s => s.name == 'ProgramId')) {
    //         // console.log('found')
    //         this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1)
    //         this.paramList.push({ param: "AND pgd.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
    //         //   this.paramList.find(s => s.name == 'ProgramId').value = this.programId;
    //       } else {
    //         this.paramList.push({ param: "AND pgd.\"ProgramId\"", value: this.programId, name: 'ProgramId' });
    //       }
    //     } else {
    //       if (this.paramList.find(s => s.name == 'ProgramId')) {
    //         this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramId'), 1);
    //       }
    //     }
    //   }

    //   if (param == 'ClassId') {
    //     if (isChecked) {
    //       if (this.paramList.find(s => s.name == 'ClassId')) {
    //         this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1)
    //         this.paramList.push({ param: "AND sfs.\"ClassId\"", value: this.classId, name: 'ClassId' });
    //       } else {
    //         this.paramList.push({ param: "AND sfs.\"ClassId\"", value: this.classId, name: 'ClassId' });
    //       }
    //     } else {
    //       if (this.paramList.find(s => s.name == 'ClassId')) {
    //         this.paramList.splice(this.paramList.findIndex(s => s.name == 'ClassId'), 1);
    //       }
    //     }
    //   }


    //   if (param == 'InstallmentNo') {
    //     if (isChecked) {
    //       if (this.paramList.find(s => s.name == 'InstallmentNo')) {
    //         this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1)
    //         this.paramList.push({ param: "AND sfs.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
    //       } else {
    //         this.paramList.push({ param: "AND sfs.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
    //       }
    //     } else {
    //       if (this.paramList.find(s => s.name == 'InstallmentNo')) {
    //         this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
    //       }
    //     }
    //   }
    //   // if (param == 'ProgramDetailId') {
    //   //   if (isChecked) {
    //   //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
    //   //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1)
    //   //       this.paramList.push({ param: "AND cpl.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
    //   //     } else {
    //   //       this.paramList.push({ param: "AND cpl.\"ProgramDetailId\"", value: this.programDetailId, name: 'ProgramDetailId' });
    //   //     }
    //   //   } else {
    //   //     if (this.paramList.find(s => s.name == 'ProgramDetailId')) {
    //   //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'ProgramDetailId'), 1);
    //   //     }
    //   //   }
    //   // }

    // }



    else if (this.check == 'Transport Fee Defaulter Report') {

      if (param == 'ProgramId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'ProgramId')) {
            // console.log('found')
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
      }
      if (param == 'SectionId') {
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



    }
  }



  selectReport() {

    //alert('alert');



    if (this.check == "Student Finance Report") {
      this.showdata = true;
      this.flage88 = false;
      this.flage1 = true;
      this.checkexcel = false;
      this.checkbutton3 = false;
      this.flage3 = false;
      this.checkbusnes = false;

      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkcamp = false;
      this.checkfromDate = false;
      this.checktoDate = false;
      this.checkprogm = false;
      this.checkprogmlatest = false;
      this.checkStdRevenueEx = false;
      this.checkstudcamp = false;
      this.checkStdexcel = false;
      this.checkDated = false;
      this.citycondil = false;
      this.flage55 = false;
      this.flage = false;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;
      this.flage33 = false;
      this.checkbankexcel = false;


    }
    else if (this.check == "City Wise  Finance Report") {
      this.checkbusnes = false;
this.filterString='';

      this.flage1 = false;
      this.checkbutton3 = false;
      this.flage3 = false;
      this.showdata = false;

      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = true;
      this.checkcamp = false;
      this.checkfromDate = true;
      this.checktoDate = true;
      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkstudcamp = false;
      this.checkStdexcel = false;
      this.checkDated = false;

      this.citycondil = false;
      this.flage = true;
      this.flage59 = true;
            this.flage55 = false;

      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;
      this.flage33 = false;
      this.checkbankexcel = false;

    }


    else if (this.check == "City wise Consolidated API Collection Report") {
this.filterString='';

      this.checkbusnes = false;
      this.checkDated = true;
      this.citycondil = true;
      this.flage1 = false;
      this.checkbutton3 = false;
      this.flage3 = false;
      this.showdata = false;

      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkStdexcel = false;


      this.checkcamp = false;
      this.checkfromDate = false;
      this.checktoDate = false;
      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkstudcamp = false;
      this.checkbusnes = false;

      this.flage55 = false;
      this.flage = false;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;
      this.flage33 = false;
      this.checkbankexcel = false;

    }

    else if (this.check == "City wise Bank Consolidated API Collection Report") {
this.filterString='';

      this.checkbusnes = false;
      this.checkDated = true;
      this.flage33 = true;
      this.flage3 = false;
      this.checkbankexcel = true;
      this.citycondil = false;
      this.flage1 = false;
      this.checkbutton3 = false;
      this.showdata = false;

      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkStdexcel = false;


      this.checkcamp = false;
      this.checkfromDate = false;
      this.checktoDate = false;
      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkstudcamp = false;
      this.checkbusnes = false;

      this.flage55 = false;
      this.flage = false;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;

    }

    else if (this.check == "Business Unit wise  Finance Report") {

      this.checkDated = true;
      this.flage33 = false;
this.filterString='';

      this.flage1 = false;
      this.checkbutton3 = false;
      this.flage3 = false;
      this.showdata = false;

      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkStdexcel = false;
      this.checkbusnes = true;

      this.checkbankexcel = false;

      this.checkcamp = false;
      this.checkfromDate = false;
      this.checktoDate = false;
      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkstudcamp = false;
      this.citycondil = false;
      this.flage55 = false;
      this.flage = false;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;


    }
    else if (this.check == "City Wise Student Finance Report") {
      this.flage33 = false;
this.filterString='';
      this.flage1 = false;
      this.checkbutton3 = false;
      this.flage3 = false;
      this.showdata = false;

      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkStdexcel = true;
      this.checkbusnes = false;
      this.checkbankexcel = false;

      this.checkcamp = false;
      this.checkfromDate = true;
      this.checktoDate = true;
      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkstudcamp = false;
      this.citycondil = false;

      this.checkDated = false;
      this.flage = true;
        this.flage59 = true;
            this.flage55 = false;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;

    }
    else if (this.check == "Campus Wise  Finance Report") {
this.filterString='';

      this.flage1 = false;
      this.checkbutton3 = true;
      this.flage3 = false;
      this.showdata = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkfromDate = true;
      this.checktoDate = true;
      this.checkcamp = true;
      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkstudcamp = false;
      this.checkStdexcel = false;
      this.citycondil = false;
      this.checkDated = false;
      this.flage = true;
      this.flage55 = true;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;
      this.checkbusnes = false;
      this.flage33 = false;
      this.checkbankexcel = false;

    }


    else if (this.check == "Campus Wise Student  Finance Report(Difference Format)") {
      this.filterString='';

      this.flage55 = true;
      this.flage = true;
      this.checkStddifferenceexcel = true;
      this.checkbutton25 = true;
      this.checkinstPaid = true;
      this.flage1 = false;
      this.checkbutton3 = false
      this.flage3 = false;
      this.showdata = false;
      this.checkbutton4 = false
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = true;
      this.checkexcel = false;
      this.checkfromDate = true;
      this.checktoDate = true;
      this.checkcamp = false;
      this.checkstudcamp = false;
      this.checkStdexcel = false;
      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkDated = false;
      this.citycondil = false;
      this.checkbusnes = false;
      this.flage33 = false;
      this.checkbankexcel = false;

    }

    else if (this.check == "Campus Wise Student  Finance Report") {
this.filterString='';

      this.flage1 = false;
      this.checkbutton3 = true;
      this.flage3 = false;
      this.showdata = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkfromDate = true;
      this.checktoDate = true;
      this.checkcamp = false;
      this.checkstudcamp = true;
      this.checkStdexcel = false;
      this.checkbusnes = false;
      this.checkbankexcel = false;

      this.checkprogm = false;
      this.checkprogmlatest = false;

      this.checkStdRevenueEx = false;
      this.checkDated = false;
      this.citycondil = false;
      this.flage = true;
      this.flage55 = true;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;
      this.flage33 = false;

    }


    else if (this.check == "Program Wise  Finance Report") {
this.filterString='';

      this.flage1 = false;
      this.checkbutton3 = true;
      this.flage3 = false;
      this.checkstudcamp = false;
      this.checkbusnes = false;
      this.showdata = false;
      this.checkbutton4 = true;
      this.checkbutton5 = true;
      this.checkStdRevenueEx = true;
      this.checkclassEnr = true;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkfromDate = true;
      this.checktoDate = true;
      this.checkcamp = false;
      this.checkprogm = true;
      this.checkprogmlatest = false;
      this.checkStdexcel = false;
      this.checkDated = false;
      this.citycondil = false;
      this.flage = true;
      this.flage55 = true;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;
      this.flage33 = false;
      this.checkbankexcel = false;

    }

    else if (this.check == "Program_Wise Student Register Report") {
this.filterString='';

      this.flage1 = false;
      this.checkbutton3 = true;
      this.flage3 = false;
      this.checkstudcamp = false;
      this.checkbusnes = false;
      this.showdata = false;
      this.checkbutton4 = true;
      this.checkbutton5 = true;
      this.checkStdRevenueEx = true;
      this.checkclassEnr = true;
      this.showSection = false;
      this.checktranport = false;
      this.checkexcel = false;
      this.checkfromDate = true;
      this.checktoDate = true;
      this.checkcamp = false;
      this.checkprogm = false;
      this.checkprogmlatest = true;
      this.checkStdexcel = false;
      this.checkDated = false;
      this.citycondil = false;
      this.flage = true;
      this.flage55 = true;
      this.checkbutton25 = false;
      this.checkinstPaid = false;
      this.checkStddifferenceexcel = false;
      this.flage33 = false;
      this.checkbankexcel = false;

    }

  }
  concession_generate() {

    var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

    this.paramList.forEach(e => {

      where = where + " " + e.param + "=''" + e.value + "''";

    })
    var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`

    this.getFeeConcessionDetails(where)
  }

  generatedefaulter() {

    var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("StudentChallan".\"InstallmentNo\" <= ''` + this.installNo + `'')`;

    this.paramList.forEach(e => {

      where = where + " " + e.param + "=''" + e.value + "''";

    })
    // var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
    this.getFeeFinalDuesListDefaulter(where)




  }


  generate() {
    if (this.check == "Average Revenue") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getFeeAverageRevenue(where)

    }
    else if (this.check == "Installment Paid Student") {
      var where = `AND (cpl.\"SessionId\" = ''` + this.sessionId + `'') AND (ct.\"CityId\" = ''` + this.cityId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      if (this.checkdatebutton) {
        var where = where + ` AND (sc.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND sc.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      }
      this.getInstallmentwise(where)

    }
    else if (this.check == "Course Wise Revenue List") {
      var where = `(t1.\"SessionId\" = ''` + this.sessionId + `'') AND (t1.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })

      this.getRevenuewise(where)

    }
    else if (this.check == "Student Wise Revenue List") {
      var where = `(t1.\"SessionId\" = ''` + this.sessionId + `'') AND (t1.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })

      this.getStudentRevenuewise(where)

    } else if (this.check == "Student Wise Revenue List Sub") {
      var where = `(t1.\"SessionId\" = ''` + this.sessionId + `'') AND (t1.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })

      this.getStudentRevenuewiseEx(where)

    } else if (this.check == "Student Wise Revenue List With Exemption") {
      var where = `(cpl.\"SessionId\" = ''` + this.sessionId + `'') AND (cpl.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })


      this.getStudentRevenuewiseExy(where)

    } else if (this.check == "Installement Exemption Report") {
      var where = `(cpl.\"SessionId\" = ''` + this.sessionId + `'') AND (cpl.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })




      this.getStudentRevenuewiseExy(where)

    }
    else if (this.check == "Daily Fee Report") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getFeeDetails(where)
    }
    else if (this.check == "Fee Defaulter Report") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("StudentChallan".\"InstallmentNo\" = ''` + this.installNo + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      //var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
      this.getFeeDefaulter(where)
    }
    else if (this.check == "Fee Statistics Report") {
      var where = this.sessionId + "?" + this.campusId + "?" + this.installNo
      //var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
      this.getFeeStat(where)
    }

    else if (this.check == "Fee Defaulter Report Enrolled") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("StudentChallan".\"InstallmentNo\" = ''` + this.installNo + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      //var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
      this.getFeeDefaulterEnrolled(where)
    }

    else if (this.check == "Fee Defaulter Summary Report") {

      var where = `AND (cpl.\"SessionId\" = ''` + this.sessionId + `'') AND (cpl.\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      //var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`

      var key = where + "?" + this.installNo
      this.getFeeDefaulterEx(key)

      // if (this.sessionId.length > 0 && this.campusId.length > 0) {
      //   var key = this.sessionId + "?" + this.campusId + "?" + this.installNo
      //   this.getFeeDefaulterEx(key)
      // }
    }

    else if (this.check == "Program Wise Fee Report") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getFeeDetailProgramWise(where)
    }

    else if (this.check == "Final Dues List") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("StudentChallan".\"InstallmentNo\" <= ''` + this.installNo + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
      this.getFeeFinalDuesList(where)
    }
    else if (this.check == "Transport Route Data") {
      var where = `AND ("cpl".\"SessionId\" = ''` + this.sessionId + `'') AND ("cpl".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("sc".\"InstallmentNo\" = ''` + this.installNo + `'')`;

      this.paramList.forEach(e => {
        if (e.param == 'AND "VWCampusProgramLink"."ProgramId"') {
          e.param = 'And "cpl"."ProgramId"'
        }
        if (e.param == 'AND "VWCampusProgramLink"."ProgramDetailId"') {
          e.param = 'And "cpl"."ProgramDetailId"'
        }
        if (e.param == 'AND "StudentChallan"."ClassId"') {
          e.param = 'And "sc"."ClassId"'
        }
        if (e.param == 'AND "VWCampusProgramLink"."ShiftId"') {
          e.param = 'And "cpl"."ShiftId"'
        }
        if (e.param == 'AND "Gender"."GenderId"') {
          e.param = 'And "gd"."GenderId"'
        }

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
      this.getTransportlist(where)
    }

    else if (this.check == "Student Challan Status") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getStudentChallanStatus(where)
    }

    else if (this.check == "Scholarship Student") {
      var where = `AND ("Session".\"SessionId\" = ''` + this.sessionId + `'') AND ("VWCampusProgramLink".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND (\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.getScholashipStudents(where)
    }

    else if (this.check == "Daily Fee Statement") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'' ORDER BY cv."` + this.orderby + `" ASC`
      this.getDailyFeeStatementEnrolled2(where)

    }
    else if (this.check == "Daily Fee Statement (Track History)") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'' ORDER BY cv."` + this.orderby + `" ASC`
      this.getDailyFeeStatementEnrolled2TrackHistory(where)

    }
    else if (this.check == "Campus Wise Student  Finance Report(Difference Format)") {
      debugger;

      // Start building WHERE clause
      let where = `WHERE  cv."CityId" = '${this.cityId}' AND cv."SubCityId" = '${this.subCityId}'`;

      // Add additional parameters if any



      // this.paramList.forEach(e => {
      //   where += ` AND ${e.param}='${e.value}'`;
      // });

      // Append date range after the WHERE clause
      const fullKey = where + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);

      // Pass final key to method
      this.getcityDifferentFormat(fullKey);
    }

    else if (this.check == "Daily Fee Statement history") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'' ORDER BY cv."` + this.orderby + `" ASC`
      this.getDailyFeeStatementEnrolledEx(where)

    }
    else if (this.check == "Step Concession Count Report") {
      var where = `AND sses.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND af.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND af.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.getConcessCountReport(where)

    }
    else if (this.check == "Step Count Report") {
      var where = `AND sses.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // var where = where + ` AND af.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND af.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.getStepCount(where)

    } else if (this.check == "Transport Fee Defaulter Report") {
      var where = `AND ("cv".\"SessionId\" = ''` + this.sessionId + `'') AND ("cv".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // var where = where + ` AND (\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.GetTransportDefaultReport(where)
    }

  }

  getFeeDetails(key) {

    this.reportData = [];
    // this.reportData.push({ fromDate: this.fromDate, toDate: this.toDate })
    this.repository.GetFeeDetail(key).then(response => {
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
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/Daily-Fee-Report.xml',
          show: true
        });
      }
    })
  }

  getFeeConcessionDetails(key) {
    this.reportData = [];
    this.reportData.push({ fromDate: this.fromDate, toDate: this.toDate })
    this.repository.GetFeeConcessionDetails(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Concession-Detail-Report.xml',
          show: true
        });
      }
    });
  }
  getFeeConcessionDetailsVM(key) {

    this.reportData = [];
    this.reportData.push({ fromDate: this.fromDate, toDate: this.toDate })
    this.repository.GetFeeConcessionDetailsVM(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Concession-Detail-Report.xml',
          show: true
        });
      }
    });
  }
  getFeeConcessionDetailsOnly(key) {

    this.reportData = [];
    this.reportData.push({ fromDate: this.fromDate, toDate: this.toDate })
    this.repository.getFeeConcessionDetailsOnly(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Concession-Detail-Report.xml',
          show: true
        });
      }
    });
  }

  getFeeConcessionStrength() {
    if (this.checkProg == true && this.checkGen == true) {
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.idGender + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
      this.repository.GetFeeConcessionStrength(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Concession-Strength-Report.xml',
            show: true
          });
        }
      });
    }
    else if (this.checkProg == false && this.checkGen == true) {
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
      this.repository.GetFeeConcessionStrengthVM(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Concession-Strength-Report.xml',
            show: true
          });
        }
      });
    }
    //getFeeConcessionStrengthOnly
    else if (this.checkProg == false && this.checkGen == false) {
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
      this.repository.GetFeeConcessionStrengthOnly(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Concession-Strength-Report.xml',
            show: true
          });
        }
      });
    }
  }
  getFeeConcessionStrengthSummary() {
    if (this.checkProg == true && this.checkGen == true) {
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.idGender + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
      this.repository.GetFeeConcessionStrengthSummary(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Concession-Strength-Summary.xml',
            show: true
          });
        }
      });
    }
    else if (this.checkProg == true && this.checkGen == false) {
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
      this.repository.GetFeeConcessionStrengthSummaryVM(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Concession-Strength-Summary.xml',
            show: true
          });
        }
      });
    }
    //getFeeConcessionStrengthSummaryOnly
    else if (this.checkProg == false && this.checkGen == false) {
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
      this.repository.GetFeeConcessionStrengthSummaryOnly(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Concession-Strength-Summary.xml',
            show: true
          });
        }
      });
    }

  }
  getinstallmentExamption() {


    if (this.checkButt == true && this.checkGen == false) {
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.shiftId + "?" + this.installNo;
      this.repository.GetInstallemntexamption(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Installment-Examption-Report.xml',
            show: true
          });
        }


      });
    }


    else if (this.checkButt == true && this.checkGender == true) {
      debugger;
      this.reportData = [];
      var key = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.shiftId + "?" + this.installNo + "?" + this.idGender;
      this.repository.GetInstallemntexamption2(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/Installment-Examption-Report.xml',
            show: true
          });
        }


      });
    }



  }

  getFeeDefaulter(key) {
    this.reportData = [];
    this.repository.GetFeeDefaulterDetail(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Fee-Defaulter-Report.xml',
          show: true
        });
      }
    });
  }

  getFeeStat(key) {
    this.reportData = [];
    this.repository.GetFeeStat(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/fee-statistics.xml',
          show: true
        });
      }
    });
  }

  getFeeDefaulterEnrolled(key) {
    this.reportData = [];
    this.repository.GetFeeDefaulterDetailEnr(key + "?" + this.classId).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Fee-Defaulter-Report.xml',
          show: true
        });
      }
    });
  }

  getFeeDefaulterEx(key) {
    this.reportData = [];
    this.repository.GetFeeDefaulterSummary(key).then(response => {

      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as Array<FeeDefaultEx>;
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/fee-defaulter-ex.xml',
          show: true
        });
      }
      if (this.checkprogram == true && this.programId.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please select Program",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      if (this.checkclass == true && this.classId.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please select Class",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      if (this.checkProg == true && this.programDetailId.length == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please select Program Detail",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
    });
  }

  getFeeFinalDuesList(key) {
    this.reportData = [];
    this.repository.GetFeeDetailFinal(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Dues-List.xml',
          show: true
        });
      }
    });
  }
  getTransportlist(key) {

    this.reportData = [];

    this.repository.Transportdata(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/TransportReport.xml',
          show: true
        });
      }
    });
  }

  getFeeFinalDuesListDefaulter(key) {
    this.reportData = [];
    this.repository.GetFeeDetailFinalDefaulter(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Dues-List.xml',
          show: true
        });
      }
    });
  }
  getScholashipStudents(key) {
    this.reportData = [];
    this.repository.GetScholarshipReport(key).then(response => {
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
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/ScholarshipStudents.xml',
          show: true
        });
      }
    });
  }
  GetTransportDefaultReport(key) {
    this.reportData = [];
    this.repository.GetTransportDefaultReport(key).then(response => {
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
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/transportdefaulterfee.xml',
          show: true
        });
      }
    });
  }
  getStudentChallanStatus(key) {
    this.reportData = [];
    this.repository.GetFeeDetail(key).then(response => {
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
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/Student-Challan-Status.xml',
          show: true
        });
      }
    });
  }

  getFeeDetailProgramWise(key) {
    this.reportData = [];
    this.repository.GetFeeDetail(key).then(response => {
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
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/Program-Wise-Fee-Report.xml',
          show: true
        });
      }
    });
  }

  getDailyFeeStatement(key) {

    this.reportData = [];
    this.repository.GetDailyFeeStatement(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        console.log(this.reportData)
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/daily-feestatement.xml',
          show: true
        });
      }
    });
  }
  getDailyFeeStatementVM(key) {
    this.reportData = [];
    this.repository.GetDailyFeeStatementVM(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/daily-feestatement.xml',
          show: true
        });
      }
    });
  }
  getDailyFeeStatementOnly(key) {

    this.reportData = [];
    this.repository.GetDailyFeeStatementOnly(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/daily-feestatement.xml',
          show: true
        });
      }
    });
  }

  getConcessCountReport(key) {
    this.reportData = [];
    this.concessReport = [];
    this.repository.GetConcessCountReport(key).then(response => {
      this.reportData = response as any;
      this.reportData.forEach(element => {
        if (this.concessReport.filter(e => e.ncity == element.cityName).length == 0) {
          var Candidates = this.reportData.filter(e => e.concessionName == 'Candidate' && e.cityName == element.cityName);
          var nCandidates = this.reportData.filter(e => e.concessionName == 'Non Candidate' && e.cityName == element.cityName);

          console.log(nCandidates);
          console.log(Candidates);

          this.concessReport.push({
            ncity: element.cityName,

            nTotal: nCandidates.length > 0 ? nCandidates[0].totalCount : 0,
            nEnrolled: nCandidates.length > 0 ? nCandidates[0].enrolledCount : 0,
            nPaid: nCandidates.length > 0 ? nCandidates[0].feePaid : 0,

            pTotal: Candidates.length > 0 ? Candidates[0].totalCount : 0,
            pEnrolled: Candidates.length > 0 ? Candidates[0].enrolledCount : 0,
            pPaid: Candidates.length > 0 ? Candidates[0].feePaid : 0,
          })

        }
      });

      this.reportData = this.concessReport;

      if (this.reportData) {
        if (this.reportData.length > 0) {
          this.reportData.fromDate = helper.formateDate(this.fromDate);
          this.reportData.toDate = helper.formateDate(this.toDate);
        }
      }

      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Fee/student-concession-count.xml',
        show: true
      });

      // console.log(JSON.stringify(this.concessReport));
      // this.report = "/assets/Reports/Resource/Fee/student-concession-count.xml";
      // this.$modal.show("report-viewer-eng");
    });
  }
  getStepCount(where) {

    this.reportData = [];
    var key = where + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetStepCountReport(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        if (this.reportData) {
          if (this.reportData.length > 0) {
            this.reportData.fromDate = helper.formateDate(this.fromDate);
            this.reportData.toDate = helper.formateDate(this.toDate);
          }
        }
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/step-count-report.xml',
          show: true
        });
      }
    });
  }

  getDailyFeeStatementEnrolled(key) {

    // this.reportData = [];
    // this.repository.GetDailyFeeStatementEnrolled(key).then(response => {
    //   this.reportData = response as any;
    //   this.$store.dispatch(RootStoreTypes.reportOperation, {
    //     data: this.reportData as any,
    //     path: '/assets/Reports/Resource/Fee/daily-feestatement.xml',
    //     show: true
    //   });
    // });
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      if (this.orderby == "RollNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolled(key).then(response => {
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
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
          // this.$modal.show("report-viewer-eng");
        });
      } else if (this.orderby == "RefferenceNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolled(key).then(response => {
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
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml";
          // this.$modal.show("report-viewer-eng");
        });
      } else if (this.orderby == "ChallanNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolled(key).then(response => {
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
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
          // this.$modal.show("report-viewer-eng");
        });
      }
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select the required Data",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });
    }


  }
  getDailyFeeStatementEnrolled2(key) {

    // this.reportData = [];
    // this.repository.GetDailyFeeStatementEnrolled(key).then(response => {
    //   this.reportData = response as any;
    //   this.$store.dispatch(RootStoreTypes.reportOperation, {
    //     data: this.reportData as any,
    //     path: '/assets/Reports/Resource/Fee/daily-feestatement.xml',
    //     show: true
    //   });
    // });
    key = key + "?" + `cv."` + this.orderby + `"`;
    console.log("key ..." + key)
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      if (this.orderby == "RollNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolled2(key).then(response => {
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
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
          // this.$modal.show("report-viewer-eng");
        });

      } else if (this.orderby == "RefferenceNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolled2(key).then(response => {
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
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml";
          // this.$modal.show("report-viewer-eng");
        });
      } else if (this.orderby == "ChallanNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolled2(key).then(response => {
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
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
          // this.$modal.show("report-viewer-eng");
        });
      }
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select the required Data",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });
    }


  }
  getDailyFeeStatementEnrolled2TrackHistory(key) {


    key = key + "?" + `cv."` + this.orderby + `"`;
    console.log("key ..." + key)
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      if (this.orderby == "RollNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolledTrackHistory(key).then(response => {
          if (response == null || response == [] || response == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "No Record Found",
              title: "Warning",
              messageTypeId: PayloadMessageTypes.warning
            });
          }
          else {
            console.log(this.reportData)
            this.reportData = response as any;
            this.reportData.forEach(element => {
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
          // this.$modal.show("report-viewer-eng");
        });

      } else if (this.orderby == "RefferenceNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolledTrackHistory(key).then(response => {
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
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml";
          // this.$modal.show("report-viewer-eng");
        });
      } else if (this.orderby == "ChallanNo") {
        this.reportData = [];
        this.repository.GetDailyFeeStatementEnrolledTrackHistory(key).then(response => {
          if (response == null || response == [] || response == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "No Record Found",
              title: "Warning",
              messageTypeId: PayloadMessageTypes.warning
            });
          }
          else {

            this.reportData = response as any;
            console.log(this.reportData)
            this.reportData.forEach(element => {
              element.fromDate = this.fromDate
              element.toDate = this.toDate
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.reportData as any,
              path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
              show: true
            });
          }
          // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
          // this.$modal.show("report-viewer-eng");
        });
      }
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select the required Data",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });
    }


  }

  getDailyFeeStatementEnrolledEx(key) {

    // this.reportData = [];
    // this.repository.GetDailyFeeStatementEnrolled(key).then(response => {
    //   this.reportData = response as any;
    //   this.$store.dispatch(RootStoreTypes.reportOperation, {
    //     data: this.reportData as any,
    //     path: '/assets/Reports/Resource/Fee/daily-feestatement.xml',
    //     show: true
    //   });
    // });
    if (this.orderby == "RollNo") {
      this.reportData = [];
      this.repository.GetDailyFeeStatementEnrolledEx(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
            show: true
          });
        }
        // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
        // this.$modal.show("report-viewer-eng");
      });
    } else if (this.orderby == "RefferenceNo") {
      this.reportData = [];
      this.repository.GetDailyFeeStatementEnrolledEx(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml',
            show: true
          });
        }
        // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-reffer.xml";
        // this.$modal.show("report-viewer-eng");
      });
    } else if (this.orderby == "ChallanNo") {
      this.reportData = [];
      this.repository.GetDailyFeeStatementEnrolledEx(key).then(response => {
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
            path: '/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml',
            show: true
          });
        }
        // this.report = "/assets/Reports/Resource/Fee/daily-feestatement-rollno.xml";
        // this.$modal.show("report-viewer-eng");
      });
    }


  }

  getInstallmentwise(key) {
    this.reportData = [];
    this.repository.GetFeeInstallment(key).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        if (this.checkdatebutton) {
          this.reportData.forEach(element => {
            element.fromDate = this.fromDate
            element.toDate = this.toDate
          });
        }
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/fee-installment-paid.xml',
          show: true
        });
      }
    });
  }

  getRevenuewise(key) {
    this.reportData = [];
    this.repository.GetFeeRevenueWise(key + '?' + helper.formateDate(this.fromDate) + '?' + helper.formateDate(this.toDate)).then(response => {
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
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });

        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/fee-revenue-paid.xml',
          show: true
        });
      }
    });
  }

  getStudentRevenuewise(key) {
    this.reportData = [];
    this.repository.GetStudentRevenueWise(key + '?' + helper.formateDate(this.fromDate) + '?' + helper.formateDate(this.toDate)).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        // console.log(JSON.stringify(this.reportData))
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/student-course-revenue.xml',
          show: true
        });
      }
    });
  }

  getStudentRevenuewiseEx(key) {
    this.reportData = [];
    var campusprogramid = this.campusProgramLinkList.find(e => e.programDetailId == this.programDetailId).campusProgramId;
    this.repository.GetStudentRevenueWiseEx(key + '?' + helper.formateDate(this.fromDate) + '?' + helper.formateDate(this.toDate) + '?' + campusprogramid).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        // console.log(JSON.stringify(this.reportData))
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/student-course-revenue-exx.xml',
          show: true
        });
      }
    });
  }

  getStudentRevenuewiseExy(key) {
    this.reportData = [];
    var campusprogramid = this.campusProgramLinkList.find(e => e.programDetailId == this.programDetailId).campusProgramId;
    this.repository.GetStudentRevenueWiseExy(key + '?' + helper.formateDate(this.fromDate) + '?' + helper.formateDate(this.toDate) + '?' + campusprogramid).then(response => {
      if (response == null || response == [] || response == 0) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
      }
      else {
        this.reportData = response as any;
        // console.log(JSON.stringify(this.reportData))
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/StudentLedgerReport',
          show: true
        });
      }
    });
  }




  loadcsv(admissionformid: any) {

    if (this.studentRecord.length > 0) {
      debugger
      helper.exportToCsv('studentRecord.csv', this.studentRecord.filter(e => e.admissionFormId == admissionformid || '00000000-0000-0000-0000-000000000000'));
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Data Found',
        title: 'warning',
        messageTypeId: PayloadMessageTypes.warning
      });

    }
  }

  getstudent() {
    // this.showdata = true;
    this.studentRecord = [];
    if (this.filterString.length > 0 && this.classId.length > 0) {
      this.repository.GetStudentFinanceReport(this.filterString + "?" + this.classId)
        .then(response => {
          this.studentRecord = response

          if (this.studentRecord.length > 0) {
            debugger
            this.sessionName = this.studentRecord[0].session;
            this.fullName = this.studentRecord[0].student_Name;


          }
        }
        )
        ;



    }

  }

  getstudentsty(refNo) {
    debugger;
    this.showdata = true;
    this.studentRecord = [];
    if (this.filterString.length > 0) {
      this.repository.GetStudentFinanceReport(refNo)
        .then(response => {
          this.studentRecord = response
          console.log('response.data', response.data)

          console.log('response.data', response.data)
          console.log('this.studentRecord', this.studentRecord)

          if (this.studentRecord.length > 0) {
            debugger
            this.sessionName = this.studentRecord[0].session;
            this.fullName = this.studentRecord[0].student_Name;
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.studentRecord as any,
              path: '/assets/Reports/Resource/Fee/studentLedgerReport.xml',
              show: true
            });

          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }
        }
        )
        ;



    }

  }


  getstudents() {

    // this.showdata = true;
    debugger;
    this.studentRecordnew = [];
    if (this.filterString.length > 0) {
      this.repository.GetStudentFinanceData(this.filterString)
        .then(response => {
          this.studentRecordnew = (response as Array<IVWStudentsProfileEx1new>)

        }
        );



    }

  }



  getcitystudentfinance() {


    this.CityFinanceDated = [];

    const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";
  const hasToDate = this.toDate && helper.formateDate(this.toDate) !== "";

  
if(this.subCityId.length <= 0 || this.checkshift==false)
{
this.subCityId='00000000-0000-0000-0000-000000000000'
}

    if (this.cityId.length > 0 &&this.subCityId.length > 0  && hasFromDate && hasToDate)  {
      debugger
      this.repository.GetCityWiseFinanceData(this.cityId + "?" + this.subCityId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
        //+ "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.sectionCourseLinkId + "?" + this.genderId)
        .then(response => {

          this.CityFinanceDated = response

          if (this.CityFinanceDated.length > 0) {
            debugger
this.CityFinanceDated.forEach(element => {
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.CityFinanceDated as any,
              path: '/assets/Reports/Resource/Fee/CityWiseStudentFinanceReport.xml',
              show: true
            });

          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }


        }
        )
        ;



    }
else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Please Select all Required Fields',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }


  }
  // getcityDifferentFormat(key)
  // {
  //   debugger;
  //     let classIdParam = null;
  // let genderIdParam = null;
  // let installmentNoParam = null;

  // this.paramList.forEach(p => {
  //   if (p.name === 'ClassId') classIdParam = p.value;
  //   if (p.name === 'genderId') genderIdParam = p.value;
  //   if (p.name === 'InstallmentNo') installmentNoParam = parseInt(p.value); // int expected
  // });


  //  let filteredWhere = 'WHERE 1=1';
  //   this.paramList.forEach(p => {
  //     if (!['ClassId', 'genderId', 'InstallmentNo'].includes(p.name)) {
  //       filteredWhere += ` AND ${p.param}='${p.value}'`;
  //     }
  //   });

  //   // Add date range or other fixed parts here if needed
  //   filteredWhere += ` AND cv."PaidDate" >= '${helper.formateDate(this.fromDate)}' AND cv."PaidDate" <= '${helper.formateDate(this.toDate)}'`;

  //   // Prepare final key2 string with additional params
  // var key2 =key+ "?" + classIdParam+ "?" + genderIdParam+ "?" +installmentNoParam
  //     this.repository.GetcamuswiseWiseDifferentFormat(key2)
  //       //+ "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.sectionCourseLinkId + "?" + this.genderId)
  //         .then(response => {

  //           this.citydifferentformat = response

  //           if (this.citydifferentformat.length > 0) {
  //             debugger

  //             this.$store.dispatch(RootStoreTypes.reportOperation, {
  //               data: this.citydifferentformat as any,
  //               path: '/assets/Reports/Resource/Fee/CampusWiseDifferentFormat.xml',
  //               show: true
  //             });

  //           }
  //           else {
  //             this.$store.dispatch(StoreTypes.updateStatusBar, {
  //               text: 'No Data Found',
  //               title: 'warning',
  //               messageTypeId: PayloadMessageTypes.warning
  //             });

  //           }


  //         }
  //         )
  //         ;


  // }
  getcityDifferentFormat(key) {
    debugger;
    let classIdParam = null;
    let genderIdParam = null;
    let installmentNoParam = null;

        const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";
  const hasToDate = this.toDate && helper.formateDate(this.toDate) !== "";

  if (this.cityId.length > 0 &&this.subCityId.length > 0  && hasFromDate && hasToDate) {
    if (this.checkgender) {
      genderIdParam = this.genderId && this.genderId !== '' ? this.genderId : null;

    }
    else {
      genderIdParam = null;

    }
    if (this.checkclass) {
      classIdParam = this.classId && this.classId !== '' ? this.classId : null;

    }
    else {
      classIdParam = null;

    }

    if (this.checkinstallment) {
      installmentNoParam = this.installNo
    }

    else {
      installmentNoParam = null
    }
    let key2 = key + "?" + classIdParam + "?" + genderIdParam + "?" + installmentNoParam;

    this.repository.GetcamuswiseWiseDifferentFormat(key2)
      .then(response => {
           
        this.citydifferentformat = response;

        if (this.citydifferentformat.length > 0) {
          debugger;
this.citydifferentformat.forEach(element => {
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
            });
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.citydifferentformat as any,
            path: '/assets/Reports/Resource/Fee/CampusWiseDifferentFormat.xml',
            show: true
          });
        } else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'No Data Found',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });
        }
      });

         }
else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Please Select all Required Fields',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }
  }



  getbusniessunitfinance() {


    this.busniesswiseData = [];

const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";

if(hasFromDate ){

    debugger
    this.repository.GetBusniessUnitFinanceData(helper.formateDate(this.fromDate))
      //+ "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.sectionCourseLinkId + "?" + this.genderId)
      .then(response => {

        this.busniesswiseData = response

        if (this.busniesswiseData.length > 0) {
          debugger

          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.busniesswiseData as any,
            path: '/assets/Reports/Resource/Fee/BusinessUnitwiseFinanceReport.xml',
            show: true
          });

        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'No Data Found',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }


      }
      )
      ;

}

  else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Please Select all Required Fields',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }



  }
  getbankcitycondilfinance() {


    this.bankswiseData = [];

const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";

if(this.cityId.length >0 && hasFromDate ){
    debugger
    this.repository.GetBankCitywiseConsolidatedData(this.cityId + "?" + helper.formateDate(this.fromDate))
      //+ "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.sectionCourseLinkId + "?" + this.genderId)
      .then(response => {

        this.bankswiseData = response

        if (this.bankswiseData.length > 0) {
          debugger

          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.bankswiseData as any,
            path: '/assets/Reports/Resource/Fee/CitywiseBankConsolidatedAPICollectionReport.xml',
            show: true
          });

        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'No Data Found',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }


      }
      )
      ;
    }

 else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Please Select all Required Fields',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }


  }

  getcitycondilfinance() {


    this.busniesswiseData = [];

const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";

if(hasFromDate ){
    debugger
    this.repository.GetCitywiseConsolidatedData(helper.formateDate(this.fromDate))
      //+ "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.sectionCourseLinkId + "?" + this.genderId)
      .then(response => {

        this.busniesswiseData = response

        if (this.busniesswiseData.length > 0) {
          debugger

          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.busniesswiseData as any,
            path: '/assets/Reports/Resource/Fee/CitywiseConsolidatedAPICollectionReport.xml',
            show: true
          });

        }
        else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'No Data Found',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }


      }
      )
      ;

    } 

    
 else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: 'Please Select all Required Fields',
            title: 'warning',
            messageTypeId: PayloadMessageTypes.warning
          });

        }


  }
  getcityfinance() {


    this.CityFinanceDated = [];

    const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";
  const hasToDate = this.toDate && helper.formateDate(this.toDate) !== "";

if(this.subCityId.length <= 0 || this.checkshift==false)
{
this.subCityId='00000000-0000-0000-0000-000000000000'
}

    if (this.cityId.length > 0 &&this.subCityId.length > 0  && hasFromDate && hasToDate) {
      debugger
      this.repository.GetCityWiseFinanceData(this.cityId + "?" + this.subCityId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
        //+ "?" + this.campusId + "?" + this.programId + "?" + this.classId + "?" + this.sectionCourseLinkId + "?" + this.genderId)
        .then(response => {

          this.CityFinanceDated = response

          if (this.CityFinanceDated.length > 0) {
            debugger
  this.CityFinanceDated.forEach(element => {
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.CityFinanceDated as any,
              path: '/assets/Reports/Resource/Fee/cityWiseFinanceReport.xml',
              show: true
            });

          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }


        }
        )
        ;



    }

    else
    {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'Please Select all Required Fields',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }


  }

  loadcsv1() {
    console.log('f', this.CityFinance);
    if (this.CityFinance.length > 0) {
      helper.exportToCsv('CityFinance.csv', this.CityFinance);
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Data Found',
        title: 'warning',
        messageTypeId: PayloadMessageTypes.warning
      });

    }
  }


  getcampusfinance() {


    this.FinanceDated = [];

    const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";
  const hasToDate = this.toDate && helper.formateDate(this.toDate) !== "";

    if (this.cityId.length > 0 &&this.subCityId.length >  0  &&this.campusId.length >0  && hasFromDate && hasToDate)
 {
      this.repository.GetCampusWiseFinanceData(this.cityId + "?" + this.subCityId + "?" + this.campusId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
        .then(response => {

          this.FinanceDated = response

          if (this.FinanceDated.length > 0) {
            debugger

              this.FinanceDated.forEach(element => {
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
            });

            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.FinanceDated as any,
              path: '/assets/Reports/Resource/Fee/CampusWiseFinanceReport.xml',
              show: true
            });

          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }

        }
        )
        ;


    }

    else
    {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'Please Select all Required Fields',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }


  }

  getcampusstudentfinance() {


    this.FinanceDated = [];

    const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";
  const hasToDate = this.toDate && helper.formateDate(this.toDate) !== "";

    if (this.cityId.length > 0 &&this.subCityId.length >  0  &&this.campusId.length >0  && hasFromDate && hasToDate)
       {
      this.repository.GetCampusWiseFinanceData(this.cityId + "?" + this.subCityId + "?" + this.campusId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
        .then(response => {

          this.FinanceDated = response

          if (this.FinanceDated.length > 0) {
            debugger
              this.FinanceDated.forEach(element => {
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.FinanceDated as any,
              path: '/assets/Reports/Resource/Fee/CampusWiseStudentFinanceReport.xml',
              show: true
            });

          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }

        }
        )
        ;


    }

    else
    {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'Please Select all Required Fields',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }

  }

  loadcsv2() {
    console.log('f', this.CityFinance);
    if (this.CampusFinance.length > 0) {
      helper.exportToCsv('CampusFinance.csv', this.CampusFinance);
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Data Found',
        title: 'warning',
        messageTypeId: PayloadMessageTypes.warning
      });

    }
  }





  getprogramfinancelatest() {


    this.FinanceDated = [];
    debugger;
    const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";
  const hasToDate = this.toDate && helper.formateDate(this.toDate) !== "";

    if (this.sessionId.length > 0 && this.cityId.length > 0 &&this.subCityId.length >  0  &&this.campusId.length >0  && this.programDetailId.length > 0 && this.classId.length >0  && hasFromDate && hasToDate) {
      this.repository.GetProgramWiseFinanceDataLatest(this.sessionId + "?" + this.cityId + "?" + this.subCityId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
        .then(response => {

          //this.ProgramFinance = (response as Array<IVWProgramFinanceData>)

          this.FinanceDated = response

          if (this.FinanceDated.length > 0) {
            debugger
this.FinanceDated.forEach(element => {
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
            });
            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.FinanceDated as any,
              path: '/assets/Reports/Resource/Fee/Programwiselatest.xml',
              show: true
            });

          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }
        }
        )
        ;



    }

    else
    {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'Please Select all Required Fields',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }

  }
  getprogramfinance() {


    this.FinanceDated = [];
    debugger;
    const hasFromDate = this.fromDate && helper.formateDate(this.fromDate) !== "";
  const hasToDate = this.toDate && helper.formateDate(this.toDate) !== "";

    if (this.sessionId.length > 0 && this.cityId.length > 0 &&this.subCityId.length >  0  &&this.campusId.length >0  && this.programDetailId.length > 0 && this.classId.length > 0 && hasFromDate && hasToDate) {
      this.repository.GetProgramWiseFinanceData(this.sessionId + "?" + this.cityId + "?" + this.subCityId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate))
        .then(response => {

          //this.ProgramFinance = (response as Array<IVWProgramFinanceData>)

          this.FinanceDated = response

          if (this.FinanceDated.length > 0) {
            debugger

            console.log(this.FinanceDated)
            this.FinanceDated = response as any;
            this.FinanceDated.forEach(element => {
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
            });


            this.$store.dispatch(RootStoreTypes.reportOperation, {
              data: this.FinanceDated as any,
              path: '/assets/Reports/Resource/Fee/ProgramWiseFinanceReport.xml',
              show: true
            });

          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'No Data Found',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }
        }
        )
        ;



    }
    else
    {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: 'Please Select all Required Fields',
              title: 'warning',
              messageTypeId: PayloadMessageTypes.warning
            });

          }

  }

  loadcsv3() {
    console.log('f', this.ProgramFinance);
    if (this.ProgramFinance.length > 0) {
      helper.exportToCsv('ProgramFinance.csv', this.ProgramFinance);
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Data Found',
        title: 'warning',
        messageTypeId: PayloadMessageTypes.warning
      });

    }
  }






  getFeeAverageRevenue(key) {
    this.reportData = [];
    this.repository.GetFeeDetail(key).then(response => {
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
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/Average-Revenue-Report.xml',
          show: true
        });
      }
    });
  }


  changedate() {

    if (this.toDate < this.fromDate) {
      this.toDate = null
    }
  }
  genSum() {
    this.keyComp = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);

  }

  genDetail() {
    this.keyAll = this.idSession + "?" + this.campusId + "?" + "?" + helper.formateDate(this.toDate);
    this.keyComp = this.idSession + "?" + this.campusId + "?" + this.programDetailId + "?" + this.idGender + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.keyGen = this.idSession + "?" + this.campusId + "?" + this.idGender + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.keyProg = this.idSession + "?" + this.campusId + "?" + this.programDetailId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
  }
}
