import * as helper from '../../../helper';

import { DDLGroupModel, DDLModel, FeeDefaultEx, IFeeFeeHead, IRegistrationSectionCourseLinkVM, ISetupAdmissionType, ISetupCampusProgramVM, ISetupCity, ISetupClass, ISetupCollector, ISetupGender, ISetupProgram, ISetupProgramDetails, ISetupSection, ISetupShift, ITransportationRouteDetailInfo, CitySubCity } from "../../../models";
import { FeeFeeHeadService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCityService, SetupClassService, SetupCollectorService, SetupProgramService, SetupSectionService, SetupShiftService, TransportationRouteDetailInfoService, FeeStudentFeeStructureService, SetupSubCityService } from "../../../service";

import { GroupModel, GeneralModel } from "../../../models/general";
import { ICampusCityVM, ISetupCampus, ICampusCityData } from "../../../models/Setup/Campus";
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
export class FeeReports extends Vue {
  private session: string = "";
  checkpaidtran = false;
  private campus: string = "";
  private repository: FeeReportsService;
  CollectorList: Array<ISetupCollector> = [];
  private sessionModel: Array<ISetupSession> = [];
  private sessionRepo: SetupSessionService;
  private campusModel: Array<ISetupCampus> = [];
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  programDDL: Array<DDLGroupModel> = [];
  programDetailId: string = "";

  private termModel: Array<GeneralModel> = [];
  ddl: Array<DDLModel> = [];
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private campusProgramLinkListnew: Array<ISetupCampusProgramVM> = [];

  private sessionId: string = "";
  private campusId: string = "";
  private subCityId: string = "";
  private item: string = "";
  private campusCityList: Array<ICampusCityVM> = []
  private campusCityListExx: Array<ICampusCityData> = []
  private campusCityListEx: Array<ICampusCityVM> = []
  private campusRepo: SetupCampusService;
  private genderModel: Array<ISetupGender> = [];
  private genderRepo: SetupGenderService;
  private programModel: Array<ISetupProgramDetails> = [];
  private programRepo: SetupProgramDetailsService;
  private admissionReport: Array<IFeeReports> = [];
  private reportData: any = [];
     private feeHeadId: any = [];
    // private lastFeeHeadId: any = [];
  private filteredList : any = [];
  private report: String = "";
  private idCampus: string = "";
  private idSession: String = "";
  private campusProgramId: string = "";
  private idGender: string = "";
  private idProgram: string = "";
  private Programsp: boolean = false;
  private checkStdRevenueExy: boolean = false;
  private checksessionM: boolean = true;
  private check: string = "";
  private fromDate = new Date();
  private toDate = new Date();
  private checkProg: boolean = false;
  private checkGen: boolean = false;
  private checkbutton: boolean = false;
  private checkbutton2: boolean = false;
  private checkbutton6: boolean = false;
  private checkbutton7: boolean = false;
  private checkdateDis: boolean = false;


  checkroute = false;
  private checkbutton9: boolean = false;
  checktranport: boolean = false;
  checkButt: boolean = false;
  private checkinstPaid: boolean = false;
  checkbutton55: boolean = false;
  checkbutton56: boolean = false;
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

  private checkSectionEx: boolean = false;
  private checkgender: boolean = false;
  private chechkfeehead: boolean = false;
  // private sectionRepo: SetupSectionService;
  private sectionRepo: RegistrationSectionCourseLinkService;
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private collectorList: Array<ISetupCollector> = [];
  private collectorRepository: SetupCollectorService = null;
  private checkcollector: boolean = false;
  routedetailId = '';

  private dueDate: string;
  private paidDate: string;
  private currentDate = new Date();
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store);;
  private shiftId: string = "";
  private classId: string = "";
  private sectionId: string = "";
  private collectorId: string = "";
 // private feeHeadId: string = "";
  private subCityList: Array<CitySubCity> = [];
  private feeHeadList: Array<IFeeFeeHead> = [];
  private feeHeadRepository: FeeFeeHeadService = new FeeFeeHeadService(this.$store);
  private orderby = 'ChallanNo'
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  private studentfeestructure: FeeStudentFeeStructureService = null;
  private installNo: number = 1;
  private concessReport: Array<IConcessionReportModel> = [];
  private checkcity: boolean = false;
  private checkcity2: boolean = false;

  private checkbutton3: boolean = true;
  private checkbutton4: boolean = false;
  private checkbutton4Ex: boolean = false;


  private checkbutton10: boolean = false;
  private checkbutton5: boolean = false;
  private checkinstall: boolean = false;
private checkbutton555: boolean = false;
  private checkrefsession: boolean = false;
  private checkcity1: boolean = false;
  private checksubcity: boolean = false;
  private checksubcityEx: boolean = false;
  private showFee: boolean = true;
  private checkClass1: boolean = false;
  private checkCollector: boolean = false;

  private checkclassEnr: boolean = false;
  private checkinstallment: boolean = false;
  private checkinstallments: boolean = false;
  private checkRevenue: boolean = false;
  private checkStdRevenue: boolean = false;
  private checkStdRevenueEx: boolean = false;
  private shiftIdA: string;
  private Collectorrepository: SetupCollectorService = new SetupCollectorService(this.$store);
  private collector: string;
  private checkdate: boolean = false;
  private checkdateEx: boolean = false;
  private showgenderondailyreport: boolean = false;


  private checkStatus: boolean = false;
  private Transprepository: TransportationRouteDetailInfoService = new TransportationRouteDetailInfoService(this.$store);
  Transporlist: Array<ITransportationRouteDetailInfo> = [];
  private statuscheck: string = "2";
  private checkdatebutton: boolean = false;
  private checkSection: boolean = false;
  cityId: string = "";
  private cityList: Array<ISetupCity> = []
  private cityRepo: SetupCityService = new SetupCityService(this.$store)

  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private checksession: boolean = false;
  private canRead: boolean = false;
  private checkbuttonrefund: boolean = false;
  private checkbuttonteacher: boolean = false;

  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkcampus: boolean = false;
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }]
  Status = [{ item: 1, show: 'Paid' }, { item: 2, show: 'Unpaid' }]

  mounted() {
    this.validatePage();
  }

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('feeReports' in this.user.claims) == true) {

        if (this.user.claims['feeReports'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['feeReports'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['feeReports'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['feeReports'].indexOf('D') >= 0) {
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
    this.getGender();
    this.loadShift();
    this.loadSession1();
    this.loadClass();
    this.loadClass1();
    this.getGender();
    this.loadFeeHead();
    this.loadCity();
    this.loadCityCampus();
    this.$watch('programId', this.loadProgramsOfCampus);
        this.$watch('shiftId', this.loadShifProgram);

    this.$watch('classId', this.loadSection);
    this.$watch('programDetailId', this.loadSection)
    this.$watch("check", this.reset);
    this.$watch('campusId', this.loadPrograms);
    this.$watch('cityId', this.loadCityCampus);
    this.$watch('checkGen', this.getGender);

    // this.loadProgramsOfCampuses();
    // this.loadPrograms();
    // this.loadCollector();
  }
  reset() {
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
    this.shiftId = '';
    this.statuscheck = '';
    this.shiftList = [];
    this.classId = '';
    this.classList = [];
    this.collectorId = '';
    this.collectorList = [];
    this.feeHeadId = '';
    this.feeHeadList = [];
    this.loadShift();
    this.loadClass();
    this.loadTransport();
    // this.loadSection();
    this.loadFeeHead();
    this.loadPrograms();
  }


  ngOnInit() {
    debugger;
  // Load data once
  this.campusProgramLinkList = this.campusProgramLinkListnew;
}
loadShifProgram() {
  debugger;
  console.log("Selected Shift:", this.shiftId);
          this.campusProgramLinkList = this.campusProgramLinkListnew;

  this.campusProgramLinkList = this.campusProgramLinkList.filter(item => 
    item.shiftId === this.shiftId
  );

  console.log("Filtered List:", this.campusProgramLinkList);
}
  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }


    // enableCheckbox() {


    //     if (this.forAllSection == true) {

    //         this.sectionCourseLinkId = "";
    //         this.forAllSectionId = "";
    //         this.sectionCourseLinkList.forEach(e => {
    //             this.forAllSectionId = this.forAllSectionId + e.sectionCourseLinkId + ',';

    //         });
    //         if (this.forAllSectionId.length > 0) {
    //             this.forAllSectionId = this.forAllSectionId.substring(0, this.forAllSectionId.length - 1);
    //         }
    //     }
    //     else {
    //         this.forAllSectionId = "";
    //     }
    // }
  loadSession1() {
    this.cityId = "";
    this.subCityId = "";
    this.classId = "";
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.termModel = r;
    });
  }

  loadCity1() {
    if (this.sessionId.length > 0) {
      this.subCityId = "";
      this.classId = "";
      this.cityRepo.GetAllEx().then((r) => {
        this.cityList = r as Array<ISetupCity>;
        this.cityList = this.cityList.sort((one, two) =>
          one.fullName < two.fullName ? -1 : 1
        );
      });
      this.$store.dispatch(StoreTypes.loadingState, true);
    }
  }
  loadCity() {
    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }

  loadTransport() {
    this.Transporlist = [];
    this.Transprepository.GetFindBy('e=>e.StatusId==1').then(r => {
      this.Transporlist = r as Array<ITransportationRouteDetailInfo>
    })
  }
  loadCityCampus() {
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
  loadCityCampusEx() {
    
    // this.campusddl = [];
    // this.cityDDL = [];
    let oldObj: ICampusCityData;
    if (this.cityId.length > 0) {
      this.campusRepo.GetCampusAgainstCity(this.cityId).then(r => {
        this.campusCityListExx = r as Array<ICampusCityData>;
      });
    }

  }
  getGender() {
    this.addParam(this.checkgender, 'genderId')
    this.genderRepo
      .GetAll()
      .then(response => (this.genderModel = response as Array<ISetupGender>));
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
    this.loadCollector();

  }
  loadShift() {
    this.addParam(this.checkshift, 'shiftId');
    this.shiftRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.shiftList = r as Array<ISetupShift>
      })
  }
changedate() {

    if (this.toDate < this.fromDate) {
      this.toDate = null
    }
  }

 
  loadClass() {
    this.addParam(this.checkclass, 'classId');
    this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.classList = r as Array<ISetupClass>;
    });
  }

  loadClass1() {
    if (
      this.sessionId.length > 0 &&
      this.cityId.length > 0
      //  &&
      // this.subCityId.length > 0
    ) {
      this.classRepository.GetFindBy("e=>e.StatusId==1").then((r) => {
        this.classList = r as Array<ISetupClass>;
      });
    }
  }

  // loadSection() {
  //   this.addParam(this.checksection, 'sectionId');
  //   this.sectionRepo.GetFindBy("e=>e.StatusId==1")
  //     .then(response => (this.sectionList = response as Array<ISetupSection>));
  // }

  // loadSection() {
  //   if (this.campusProgramLinkList.length > 0) {
  //     var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
  //     this.addParam(this.checksection, 'sectionId');
  //     this.sectionRepo.GetSectionBycampusprogramid(cmid)
  //       .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
  //   }


  // }

  loadSection() {
    this.sectionList = [];
    var cmid = this.campusProgramLinkList.find(s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
    this.addParam(this.checksection, 'sectionId');
    if (cmid.length > 0 && this.classId.length > 0) {
      var key = cmid + '?' + this.classId
      this.enrollmentRepo.GetSectionList(key)
        .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
    }

  }

  loadCollector() {
    this.addParam(this.checkcollector, 'collectorId');
    this.collectorRepository.GetFindBy('e=>e.CampusId.ToString()=="' + this.campusId + '"')
      .then(
        res => {
          this.collectorList = res as Array<ISetupCollector>
        })
  }
  loadSubCity() {
    
    if (this.sessionId.length > 0 && this.cityId.length > 0) {
      this.classId = "";
      this.subCityRepo.GetFindByEx(this.cityId).then((r) => {
        this.subCityList = r as Array<CitySubCity>;
        
      });
    }
  }

  loadCollector1() {
    if (
      this.sessionId.length > 0 &&
      this.cityId.length > 0 &&
      // this.subCityId.length > 0 &&
      this.classId.length > 0
    ) {
      
      //this.collector = "Head Office";
      this.collector = "Head Office";
      this.Collectorrepository.GetFindBy(
        'e=>e.Description =="' + this.collector + '" && e.StatusId == 4'
      ).then((res) => {
        this.CollectorList = res as Array<ISetupCollector>;
        this.collectorId = this.CollectorList[0].collectorId;
      });
    }
    //this.Getdata();
  }
  // Getdata() {
  //   this.dueDate=this.currentDate.toString();
  //   if (
  //     this.sessionId.length > 0 &&
  //     this.cityId.length > 0 &&
  //     this.subCityId.length > 0 &&
  //     this.classId.length > 0
  //   ) {
  //     this.collector = "Head Office";
  //     var key=this.sessionId+'?'+this.cityId+'?'+this.subCityId+'?'+this.classId;
  //     this.studentfeestructure.StudentCreditNotes(key).then((res) => { 
  //       this.data = res as Array<IStudentCreditNotes>;
  //       console.log(this.data);

  //     });
  //   }
  //   this.chkall=false;
  //   this.isDisabled=false;
  // }



  handleFeeHeadInput(value){
debugger;
    // agar 4th select ho
    // if(value.length > 3){
    //   // previous state par wapas
    //   this.feeHeadId = [...this.lastFeeHeadId];
    //   return;
    // }

    // // save current state
    // this.feeHeadId = [...value];
    // this.lastFeeHeadId = [...value];

    this.addParam(this.chechkfeehead,'FeeHeadId');
  }
  // handleFeeHeadInput(value){
  // debugger;
  // if(value.length > 3){
  //     value.pop();
  //     return;
  //   }    
  //   this.addParam(this.chechkfeehead,'FeeHeadId');
  // }

  // checkFeeHeadLimit(value){
  //     debugger;

  //   if(value.length > 3){
  //     value.pop();
  //     return;
  //   }
  //   this.feeHeadId = value;
  // }
  loadFeeHead() {
    this.feeHeadRepository.GetFindBy("s=>s.StatusId==1").then(r => {
      this.feeHeadList = r as Array<IFeeFeeHead>;
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
             this.campusProgramLinkListnew=this.campusProgramLinkList;


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
      // if (param == 'FeeHeadId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'FeeHeadId')) {
      //       this.paramList.find(s => s.name == 'FeeHeadId').value = this.feeHeadId;
      //     } else {
      //       this.paramList.push({ param: "AND cv.\"FeeHeadId\"", value: this.feeHeadId, name: 'FeeHeadId' });
      //     }
      //   } else {
      //     this.sectionId = '';
      //     if (this.paramList.find(s => s.name == 'FeeHeadId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'FeeHeadId'), 1);
      //     }
      //   }
      // }
if (param == 'FeeHeadId') {
  if (isChecked) {

    const feeHeadValue = this.feeHeadId
      .map(x => `''${x}''`)
      .join(",");

    if (this.paramList.find(s => s.name == 'FeeHeadId')) {

      this.paramList.find(s => s.name == 'FeeHeadId').param = `AND cv."FeeHeadId" IN`;
      this.paramList.find(s => s.name == 'FeeHeadId').value = feeHeadValue;

    } else {

      this.paramList.push({
        param: `AND cv."FeeHeadId" IN`,
        value: feeHeadValue,
        name: 'FeeHeadId'
      });

    }

  } else {

    const index = this.paramList.findIndex(s => s.name == 'FeeHeadId');
    if (index !== -1) this.paramList.splice(index, 1);

  }
}
      if (param == 'GenderId') {
        if (isChecked) {
          // alert(this.programId)
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.find(s => s.name == 'GenderId').value = this.genderId;
          } else {
            this.paramList.push({ param: "AND cv.\"GenderId\"", value: this.genderId, name: 'GenderId' });
          }
        } else {
          if (this.paramList.find(s => s.name == 'GenderId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'GenderId'), 1);
          }
        }
      }
    }

    else if (this.check == 'Teacher Wise Attendance Status Report') {
      
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



     else if (this.check == 'Revenue Report (Program Wise)') {

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

      // if (param == 'SectionId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'SectionId')) {
      //       this.paramList.find(s => s.name == 'SectionId').value = this.sectionId;
      //     } else {
      //       this.paramList.push({ param: "AND cv.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'SectionId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
      //     }
      //   }
      // }

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

      // if (param == 'SectionId') {
      //   if (isChecked) {
      //     if (this.paramList.find(s => s.name == 'SectionId')) {
      //       this.paramList.find(s => s.name == 'SectionId').value = this.sectionId;
      //     } else {
      //       this.paramList.push({ param: "AND cv.\"SectionId\"", value: this.sectionId, name: 'SectionId' });
      //     }
      //   } else {
      //     if (this.paramList.find(s => s.name == 'SectionId')) {
      //       this.paramList.splice(this.paramList.findIndex(s => s.name == 'SectionId'), 1);
      //     }
      //   }
      // }

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
    if (this.check == "Concession_Report") {
      this.paramList = [];
      this.showgenderondailyreport = false;
      this.checksessionM = true;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = false;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkbutton9 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkclassEnr = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkButt = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;

      this.checkrefsession = false;

      this.Programsp = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;
    } else if (this.check == "Daily Fee Report") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkbutton = false;
      this.checkcity2 = false;
      this.checkbutton2 = true;
      this.checkinstall = false;
      this.checkbutton3 = true;
      this.checkclassEnr = false;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkbutton9 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkButt = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;

      this.checkrefsession = false;

    } else if (this.check == "Concession Strength") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkbutton = true;
      this.checkcity2 = false;
      this.checkbutton2 = false;
      this.checkinstall = false;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkbutton9 = false;
      this.checkclassEnr = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;

      this.checkrefsession = false;

    } else if (this.check == "Fee Defaulter Report") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkclassEnr = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkbutton9 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkButt = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;

      this.checkrefsession = false;
    }
    else if (this.check == "Fee Statistics Report") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton4 = false;
      this.checkclassEnr = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = true;
      this.checkbutton9 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;

    }
    else if (this.check == "Fee Defaulter Report Enrolled") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkbutton = false;
      this.checkcity2 = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkbutton9 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkclassEnr = true;
      this.checkButt = false;

      this.Programsp = false;
      this.checkclassEnr = false;

      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;

      this.checkrefsession = false;
    }





    else if (this.check == "Fee Defaulter Summary Report") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkbutton = false;
      this.checkcity2 = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = true;
      this.checkbutton9 = false;
      this.checkbutton10 = true;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkclassEnr = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;

      this.checkrefsession = false;

      this.checkButt = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;


    }



    else if (this.check == "Final Dues List") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton9 = true;
      this.checkbutton4 = false;
      this.checkclassEnr = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
            this.checkbutton555 = false;

      this.Programsp = false;

      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;

    }

    else if (this.check == "Transport Route Data") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = true;
      this.checkSection = false;
      this.checkbutton9 = true;
      this.checkbutton4 = false;
      this.checkclassEnr = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = true;
      this.checkStdRevenueEx = false;
      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
                  this.checkbutton555 = false;


    } else if (this.check == "Program Wise Fee Report") {
      this.paramList = [];
      this.checksessionM = true;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = false;
      this.checkclassEnr = false;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton9 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
                  this.checkbutton555 = false;


    } else if (this.check == "Student Challan Status") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkclassEnr = false;
      this.checkinstall = false;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
                  this.checkbutton555 = false;


    } else if (this.check == "Scholarship Student") {
      this.paramList = [];
      this.checksessionM = true;
            this.checkbutton56= false;

      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = false;
      this.checkbutton9 = false;
      this.checkclassEnr = false;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.Programsp = false;


      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
                  this.checkbutton555 = false;


    } else if (this.check == "Average Revenue") {
      this.paramList = [];
      this.checkbutton = false;
            this.checkbutton56= false;

      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton2 = true;
      this.checkinstall = false;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton9 = false;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
                  this.checkbutton555 = false;


    } else if (this.check == "Daily Fee Statement") {
      this.paramList = [];
      this.checksessionM = true;
            this.checkbutton56= false;

      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkbutton2 = true;
      this.checkbutton3 = true;
      this.checkSection = false;
      this.checkbutton4 = false;
      this.checkbutton9 = false;
      this.checkbutton5 = true;
      this.checkbutton6 = true;
      this.checkclassEnr = false;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;





      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;
            this.checkbutton555 = false;


    }
    else if (this.check == "Daily Fee Statement (Track History)") {
      this.paramList = [];
      this.showgenderondailyreport = true;
      this.checkbutton = false;
      this.checkbutton56= false;
      this.checkcity2 = false;
      this.checksessionM = true;
      this.checkinstall = false;
      this.checkbutton2 = true;
      this.checkbutton3 = true;
      this.checkclassEnr = false;
      this.checkSection = false;
      this.checkbutton4 = false;
      this.checkbutton9 = false;
      this.checkbutton555 = true;
            this.checkbutton5 = false;

      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;


      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;
      this.checkSectionEx = false;

    }



    else if (this.check == "Daily Fee Statement history") {
      this.paramList = [];
      this.checksessionM = true;
            this.checkbutton56= false;

      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkbutton2 = true;
      this.checkbutton3 = true;
      this.checkSection = false;
      this.checkbutton4 = false;
      this.checkclassEnr = false;
      this.checkbutton9 = false;
      this.checkbutton5 = true;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;
            this.checkbutton555 = false;


      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;
      this.checkSectionEx = false;

      this.checkrefsession = false;

    } else if (this.check == "Step Concession Count Report" || this.check == "Step Count Report") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
            this.checkbutton56= false;
            this.checkbutton555 = false;

      this.checkbutton = false;
      this.checkinstall = false;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = true;
      this.checkbutton5 = false;
      this.checkclassEnr = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = true;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;
      this.checkSectionEx = false;

      this.checkrefsession = false;

    } else if (this.check == "Installment Paid Student") {
      this.paramList = [];
      this.checkcity = true;
            this.checkbutton56= false;
            this.checkbutton555 = false;

      this.showgenderondailyreport = false;
      this.checksessionM = true;
      this.checkcity2 = true;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkclassEnr = false;
      this.checkinstPaid = true;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;
      this.checkSectionEx = false;

      this.checkrefsession = false;

    } else if (this.check == "Course Wise Revenue List") {
      this.paramList = [];
      this.checksessionM = true;
            this.checkbutton56= false;

      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkclassEnr = false;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = true;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;
            this.checkbutton555 = false;



      this.checkGender = false;
      this.checkinstallments = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkSectionEx = false;

      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkrefsession = false;

    } else if (this.check == "Student Wise Revenue List") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkbutton2 = true;
      this.checkclassEnr = false;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = true;
      this.checkStdRevenue = true;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;
            this.checkbutton56= false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;


      this.checkGender = false;
      this.checkinstallments = false;
      this.checkSectionEx = false;
            this.checkStdRevenueExy= false;



      this.checkrefsession = false;
    } else if (this.check == "Student Wise Revenue List Sub") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkclassEnr = false;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = true;
      this.checkinstallment = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkbutton55 = false;
            this.checkbutton56= false;
            this.checkbutton555 = false;

      this.checkGender = false;
      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkdate = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;

      this.checkSectionEx = false;

      this.checkinstallments = false;

      this.checkrefsession = false;
            this.checkStdRevenueExy= false;

    }

       else if (this.check == "Revenue Report (Program Wise)") {
      this.paramList = [];
      this.checksessionM = true;
      this.checkStdRevenue=true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton3=false;
      this.checkbutton55=false;
      this.checkbutton56=true;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkclassEnr = false;
      this.checkbutton2 = true;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = true;
      this.checkinstallments = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkGender = false;
      this.checkSectionEx = true;
      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkdate = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;
      this.checkStdRevenueExy= false;
            this.checkbutton555 = false;

      this.checkrefsession = false;
    }
    else if (this.check == "Student Wise Revenue List With Exemption") {
      this.paramList = [];
      this.checksessionM = true;
      this.checkStdRevenueExy= true;
      this.checkStdRevenue=false;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
      this.checkbutton3=false;
      this.checkbutton55=false;
      this.checkbutton56=false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkclassEnr = false;
      this.checkbutton2 = true;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = true;
      this.checkinstallments = false;
      this.Programsp = false;
      this.checkclassEnr = false;
      this.checkGender = false;
      this.checkSectionEx = true;
      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkdate = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkButt = false;
            this.checkbutton555 = false;

      this.checkrefsession = false;
    }
    else if (this.check == "Installement Exemption Report") {
      this.paramList = [];
      this.checksessionM = true;
      this.showgenderondailyreport = false;
      this.checkcity2 = false;
            this.checkbutton56= false;

      this.checkbutton = false;
      //this.checkbutton2 = true;
      this.checkinstallments = true;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = true;
      this.checkbutton9 = false;
      //this.checkbutton10 = true;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      // this.checkclassEnr = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;
      this.checkbutton2 = false;
      this.Programsp = true;
      this.checkclassEnr = true;
      this.checkButt = true;
      this.checkbutton55 = true;
      this.checkGender = true;
      this.checkSectionEx = false;

      this.checkcity1 = false;
      this.checksubcity = false;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkdate = false;
      this.checkStatus = false;
      this.checkbuttonrefund = false;

      this.checkrefsession = false;

    }

    else if (this.check == "Fees Refund Statement  Report") {
      this.checkSectionEx = false;
      this.showgenderondailyreport = false;
      this.Programsp = false;
            this.checkbutton56= false;

      this.checkcity2 = false;
      this.checkclassEnr = false;
      this.checkbutton2 = false;
      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;
      this.checkcity2 = false;
      this.checkButt = false;
      this.checksessionM = false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkclassEnr = false;
      this.checkbutton2 = false;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.checksession = false;
      this.checkcity1 = true;
      this.checksubcity = true;
      this.checkClass1 = true;
      this.checkCollector = true;
      this.checkdate = true;
      this.checkStatus = true;
      this.checkbuttonrefund = true;

      this.checkrefsession = true;
      // this.showFee = true;


    }

    else if (this.check == "Teacher Wise Attendance Status Report") {
      this.checkSectionEx = false;
      this.showgenderondailyreport = false;
      this.Programsp = false;
      this.checkcity2 = false;
            this.checkbutton56= false;

      this.checkclassEnr = false;
      this.checkbutton2 = false;
      this.checkbutton55 = false;
      this.checkGender = false;
      this.checkinstallments = false;
      this.checkcity2 = false;
      this.checkButt = false;
      this.checksessionM = false;
      this.checkbutton = false;
      this.checkinstall = false;
      this.checkclassEnr = false;
      this.checkbutton2 = false;
      this.checkbutton3 = false;
      this.checkSection = false;
      this.checkbutton9 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = false;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkStdRevenueEx = false;

      this.checksession = false;
      this.checkcity1 = true;
      this.checksubcity = false;
      this.checksubcityEx = true;
      this.checkbutton4 = false;
      this.checkbutton4Ex = true;
      this.checkClass1 = false;
      this.checkCollector = false;
      this.checkdate = false;
      this.checkdateEx = true
      this.checkStatus = false;
      this.checkbuttonrefund = false;
      this.checkbuttonteacher = true;

      this.checkrefsession = true;
      // this.showFee = true;


    }



    // else if (this.check == "Installement Exemption Report") {
    //   this.paramList = [];
    //   this.checkbutton = false;
    //   this.checkinstall = false;
    //   this.checkclassEnr = false;
    //   this.checkbutton2 = true;
    //   this.checkbutton3 = false;
    //   this.checkSection = false;
    //   this.checkbutton9 = false;
    //   this.checkbutton4 = false;
    //   this.checkbutton5 = false;
    //   this.checkbutton6 = false;
    //   this.checkbutton7 = false;
    //   this.checkdate = false;
    //   this.checkinstPaid = false;
    //   this.checkRevenue = false;
    //  this.checkStdRevenue = false;
    //  this.checktranport = false;
    //   this.checkStdRevenueEx = true;

    // }
    else if (this.check == "Transport Fee Defaulter Report") {
      this.paramList = [];
      this.checkcity2 = false;
      this.showgenderondailyreport = false;
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = false;
      this.checkbutton9 = false;
      this.checkbutton3 = true;
      this.checkSection = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkclassEnr = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport = false;
      this.checkSectionEx = false;
            this.checkbutton56= false;


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

  generateteacherrep() {
    
    var where = `AND cpl.\"SessionId\" = ''` + this.sessionId + `'' AND sbc.\"CityId\" = ''` + this.cityId + `'' AND cmp.\"SubCityId\" = ''` + this.subCityId + `''`;

    this.paramList.forEach(e => {

      where = where + " " + e.param + "=''" + e.value + "''";

    })
    var where = where + '?' + helper.formateDate(this.fromDate)
    this.getteacherreport(where)
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
      // var where = `AND (cpl.\"SessionId\" = ''` + this.sessionId + `'')AND (ct.\"cityId\" = ''` + this.cityId + `'')`;
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

    }

    else if (this.check == "Revenue Report (Program Wise)") {
      var where = `(cpl.\"SessionId\" = ''` + this.sessionId + `'') AND (cpl.\"CampusId\" = ''` + this.campusId + `'') AND (shf.\"ShiftId\" = ''` + this.shiftId + `'')`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })


      this.getStudentRevenuewiseExyNew(where)

    } 
    
    else if (this.check == "Installement Exemption Report") {
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


    else if (this.check == "Teacher Wise Attendance Status Report") {
      
      var where = `cpl.\"SessionId\" = ''` + this.sessionId + `'' AND sbc.\"CityId\" = ''` + this.cityId + `'' AND cmp.\"SubCityId\" = ''` + this.subCityId + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + helper.formateDate(this.fromDate)
      this.getteacherreport(where)

    }
    else if (this.check == "Daily Fee Statement (Track History)") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''`;
debugger;
      // this.paramList.forEach(e => {

      //   where = where + " " + e.param + "=''" + e.value + "''";

      // })

       this.paramList.forEach(e => {
    if(e.param.includes("IN")) {
      // IN clause ke liye
      where += ` ${e.param} (${e.value})`;
    } else {
      // normal equality
      where = where + " " + e.param + "=''" + e.value + "''";
    }
  });
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'' ORDER BY cv."` + this.orderby + `" ASC`
      this.getDailyFeeStatementEnrolled2TrackHistory(where)

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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
              element.fromDate = helper.formateDate(this.fromDate).toString()
              element.toDate = helper.formateDate(this.toDate).toString()
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
    if (this.checkcampus == true || this.checkclass == true) {
      if (this.campusId == '' || this.classId == '') {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please select Value",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
        return;
      }
    }



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
            element.fromDate = helper.formateDate(this.fromDate).toString()
            element.toDate = helper.formateDate(this.toDate).toString()
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/student-course-revenue-exx.xml',
          show: true
        });
      }
    });
  }


    getStudentRevenuewiseExyNew(key) {
      debugger;
    console.log('check button',this.checkProg);
    this.reportData = [];
    let campusprogramid = "";

  if (this.checkProg === false) {
    campusprogramid = this.campusProgramLinkList.filter(e => e.shiftId === this.shiftId).map(e => e.campusProgramId).join(",");                                         
  }

  
  else {
    campusprogramid = this.campusProgramLinkList
      .find(e => e.programDetailId == this.programDetailId)
      .campusProgramId;
  }

   if (this.shiftId.length == 0 || this.sessionId.length == 0||this.campusId.length == 0||this.programId.length == 0|| !this.fromDate || !this.toDate ||
    !this.toDate) {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please select all Mandatory Fields",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
        return;
      }

         

  console.log("Final CampusProgramIds:", campusprogramid);
    //var campusprogramid = this.campusProgramLinkList.find(e => e.programDetailId == this.programDetailId).campusProgramId;
    this.repository.GetStudentRevenueWiseExyNew(key + '?' + helper.formateDate(this.fromDate) + '?' + helper.formateDate(this.toDate) + '?' + campusprogramid).then(response => {
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/student-course-revenue-exynew.xml',
          show: true
        });
      }
    });
  }
  getStudentRevenuewiseExy(key) {
    debugger;
    console.log('check button',this.checkProg);
    this.reportData = [];

  console.log("Final CampusProgramIds:", campusprogramid);
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/student-course-revenue-exy.xml',
          show: true
        });
      }
    });
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
          element.fromDate = helper.formateDate(this.fromDate).toString()
          element.toDate = helper.formateDate(this.toDate).toString()
        });
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Fee/Average-Revenue-Report.xml',
          show: true
        });
      }
    });
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
  checkValue(e) {

    if (e == 2) {
      //alert('dfads')
      this.checkdateDis = true;
    }
    else {
      this.checkdateDis = false;
    }
  }


  getteacherreport(key) {
    

    //var key = this.sessionId + "?" + this.cityId + "?" + this.subCityId + "?" + helper.formateDate(this.fromDate)
    console.log(key);
    this.reportData = [];
    this.repository.TeacherReport(key).then(response => {
      if (response == null || response == 0) {
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
          path: '/assets/Reports/Resource/Fee/teacher_attendance_report.xml',
          show: true
        });
      }
    });
  }
  getFeeRefund() {

    if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {

      if (this.checkbuttonrefund == true && this.checkshift == true) {
        if (this.subCityId == '') {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Please select Subcity",
            title: "Warning",
            messageTypeId: PayloadMessageTypes.warning
          });
          return;
        }
        this.reportData = [];
        
        var key = this.sessionId + "?" + this.cityId + "?" + this.subCityId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.statuscheck;
        this.repository.StudentRefundFee(key).then(response => {
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
              path: '/assets/Reports/Resource/Fee/refundReportDetail.xml',
              show: true
            });
          }
        });
      }

      else if (this.checkshift == false) {
        this.reportData = [];
        
        var key = this.sessionId + "?" + this.cityId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.statuscheck;
        this.repository.StudentRefundFeeEx(key).then(response => {
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
              path: '/assets/Reports/Resource/Fee/refundReportDetail.xml',
              show: true
            });
          }
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
}
