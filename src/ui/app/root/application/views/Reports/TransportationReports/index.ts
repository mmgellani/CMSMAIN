import * as helper from '../../../helper';

import { DDLGroupModel, DDLModel, FeeDefaultEx, IFeeFeeHead, IRegistrationSectionCourseLinkVM, ISetupAdmissionType, ISetupCampusProgramVM, ISetupCity, ISetupClass, ISetupCollector, ISetupGender, ISetupProgram, ISetupProgramDetails, ISetupSection, ISetupShift, ITransportationRouteDetailInfo } from "../../../models";
import { FeeFeeHeadService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupCityService, SetupClassService, SetupCollectorService, SetupProgramService, SetupSectionService, SetupShiftService, TransportationRouteDetailInfoService } from "../../../service";
import { ICampusCityVM, ISetupCampus } from "../../../models/Setup/Campus";
import { IConcessionReportModel, IFeeReports } from "../../../models/Reports/FeeReports";
import { IRootStoreState, RootStoreTypes } from "../../../../store";
import { IUser, PayloadMessageTypes } from "../../../../../model";

import Component from "vue-class-component";
// import { FeeReportsService } from "../../../service/Reports/FeeReports";
import { TransportationReportsService } from "../../../service/Reports/TransportReports";
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
import { FeeReportsService } from '../../../service/Reports/FeeReports';

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
export class TransportationReports extends Vue {
  private session: string = "";
  private campus: string = "";
  private repository: TransportationReportsService;
  private repository2: FeeReportsService= new FeeReportsService(this.$store);

  
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
  private report: String = "";
  private idCampus: string = "";
  private idSession: String = "";
  private campusProgramId: string = "";
  private idGender: string = "";
  private idProgram: string = "";
  private check: string = "";
  private fromDate = new Date();
  private toDate = new Date();
  private checkProg: boolean = false;
  private checkGen: boolean = false;
  private checkbutton: boolean = false;
  private checkbutton2: boolean = false;
  private checkbutton6: boolean = false;
  private checkbutton7: boolean = false;
  checkroute=false;
  private checkbutton9: boolean = false;
  checktranport:boolean=false;

  private checkinstPaid: boolean = false;

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
  private genderId='';
  private checksection: boolean = false;
  private checkgender: boolean = false;
  private chechkfeehead: boolean = false;
  // private sectionRepo: SetupSectionService;
  private sectionRepo: RegistrationSectionCourseLinkService;
  private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
  private collectorList: Array<ISetupCollector> = [];
  private collectorRepository: SetupCollectorService = null;
  private checkcollector: boolean = false;
  routedetailId='';
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
  private checkbutton3: boolean = true;
  private checkbutton4: boolean = false;
  private checkbutton5: boolean = false;
  private checkinstall: boolean = false;
  private checkinstallment: boolean = false;
  private checkRevenue: boolean = false;
  private checkStdRevenue: boolean = false;

  private checkdate: boolean = false;
  private Transprepository: TransportationRouteDetailInfoService =new TransportationRouteDetailInfoService(this.$store);
  Transporlist:Array<ITransportationRouteDetailInfo>=[];

  private checkdatebutton: boolean = false;
  private checkSection: boolean = false;
  cityId: string = "";
  private cityList: Array<ISetupCity> = []
  private cityRepo: SetupCityService = new SetupCityService(this.$store)

  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private checkcampus: boolean = false;
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }]

  mounted() {
    this.validatePage();
  }

  validatePage() {
    if (this.user.roles.indexOf('admin') >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    }
    else {
      if (('transportationReports' in this.user.claims) == true) {

        if (this.user.claims['transportationReports'].indexOf('R') >= 0) {
          this.canRead = true;
        }
        if (this.user.claims['transportationReports'].indexOf('C') >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims['transportationReports'].indexOf('U') >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims['transportationReports'].indexOf('D') >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push('Home');
      }
    }
  }

  created() {
    this.repository = new TransportationReportsService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.genderRepo = new SetupGenderService(this.$store);
    this.programRepo = new SetupProgramDetailsService(this.$store);
    this.classRepository = new SetupClassService(this.$store);
    this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
    this.collectorRepository = new SetupCollectorService(this.$store);
    this.loadSession();
    this.getGender();
    this.loadCityCampus();
    this.loadShift();
    this.loadClass();
     this.getGender();
    this.loadFeeHead();
    this.loadCity();
    this.$watch('programId', this.loadProgramsOfCampus);
    this.$watch('classId', this.loadSection);
    this.$watch("check", this.reset);
    this.$watch('campusId', this.loadPrograms);
    this.$watch('cityId', this.loadCityCampus);


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
    this.checkgender=false;
    this.checkroute=false;
    this.checkshift = false;
    this.checkcity = false;
    this.shiftId = '';
    this.shiftList = [];
    this.classId = '';
    this.classList = [];
    this.collectorId = '';
    this.collectorList = [];
    this.feeHeadId = '';
    this.feeHeadList = [];
    this.loadCityCampus();
    this.loadShift();
    this.loadClass();
    this.loadTransport();
    // this.loadSection();
    this.loadFeeHead();
    this.loadPrograms();
  }


  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }
  loadCity() {
    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }

  loadTransport()
  {
    this.Transporlist=[];
    this.Transprepository.GetFindBy('e=>e.StatusId==1').then(r=>{
      this.Transporlist= r as Array<ITransportationRouteDetailInfo>
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
  getGender() {
    this.addParam(this.checkgender,'genderId')
    this.genderRepo
      .GetAll()
      .then(response => (this.genderModel = response as Array<ISetupGender>));
  }

 
  loadPrograms() {
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

  loadClass() {
    this.addParam(this.checkclass, 'classId');
    this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.classList = r as Array<ISetupClass>;
    });
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
     if (this.check == 'Transport Fee Defaulter Report' ||  this.check=='Transport Route Data' || this.check=='Transport Fee Detail Report') {
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
if(param == 'RouteDetailId')


if (isChecked) {
  if (this.paramList.find(s => s.name == 'RouteDetailId')) {
    this.paramList.find(s => s.name == 'RouteDetailId').value = this.routedetailId;
  } else {
    this.paramList.push({ param: "AND cv.\"RouteDetailId\"", value: this.routedetailId, name: 'RouteDetailId' });
  }
} else {
  if (this.paramList.find(s => s.name == 'RouteDetailId')) {
    this.paramList.splice(this.paramList.findIndex(s => s.name == 'RouteDetailId'), 1);
  }
}

    }
  }



  selectReport() {
    if (this.check == "Transport Fee Defaulter Report") {
      this.paramList = [];
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
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport=false;

    }
    else if (this.check == "Transport Route Data") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = true;
      this.checkSection = false;
      this.checkbutton9 = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport=true;
      

    }
    else if (this.check == "Transport Fee Detail Report") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton2 = true;
      this.checkinstall = true;
      this.checkbutton3 = true;
      this.checkSection = false;
      this.checkbutton9 = true;
      this.checkbutton4 = false;
      this.checkbutton5 = false;
      this.checkbutton6 = true;
      this.checkbutton7 = false;
      this.checkdate = false;
      this.checkinstPaid = false;
      this.checkRevenue = false;
      this.checkStdRevenue = false;
      this.checktranport=true;
      

    }
  }
  


  generate() {
     if (this.check == "Transport Fee Defaulter Report") {
      var where = `AND ("cv".\"SessionId\" = ''` + this.sessionId + `'') AND ("cv".\"CampusId\" = ''` + this.campusId + `'')`;

      this.paramList.forEach(e => {
        if(e.param=='AND "VWCampusProgramLink"."ShiftId"')
        {
          e.param='And cv."ShiftId"'
        }

        where = where + " " + e.param + "=''" + e.value + "''";

      })
     // var where = where + ` AND (\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND \"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `'')`
      this.GetTransportDefaultReport(where)
    }
    else if (this.check == "Transport Route Data") {
      var where = `AND ("cpl".\"SessionId\" = ''` + this.sessionId + `'') AND ("cpl".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("sc".\"InstallmentNo\" = ''` + this.installNo + `'')`;

      this.paramList.forEach(e => {
        if(e.param=='AND cv."ProgramId"')
        {
          e.param='And "cpl"."ProgramId"'
        }
        if(e.param=='AND cv."ProgramDetailId"')
        {
          e.param='And "cpl"."ProgramDetailId"'
        }
        if(e.param=='AND cv."ClassId"')
        {
          e.param='And "sc"."ClassId"'
        }
        if(e.param=='AND "VWCampusProgramLink"."ShiftId"')
        {
          e.param='And "cpl"."ShiftId"'
        }
        if(e.param=='AND "Gender"."GenderId"')
        {
          e.param='And "gd"."GenderId"'
        }

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
      this.getTransportlist(where)
    }
    else if (this.check == "Transport Fee Detail Report") {
      var where = `AND ("cpl".\"SessionId\" = ''` + this.sessionId + `'') AND ("cpl".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("sc".\"InstallmentNo\" = ''` + this.installNo + `'')`;

      this.paramList.forEach(e => {
        if(e.param=='AND cv."ProgramId"')
        {
          e.param='And "cpl"."ProgramId"'
        }
        if(e.param=='AND cv."ProgramDetailId"')
        {
          e.param='And "cpl"."ProgramDetailId"'
        }
        if(e.param=='AND cv."ClassId"')
        {
          e.param='And "sc"."ClassId"'
        }
        if(e.param=='AND "VWCampusProgramLink"."ShiftId"')
        {
          e.param='And "cpl"."ShiftId"'
        }
        if(e.param=='AND "Gender"."GenderId"')
        {
          e.param='And "gd"."GenderId"'
        }

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // var where = where + ` AND (\"DueDate\" >= ''` + this.fromDate + `'' AND \"DueDate\" <= ''` + this.toDate + `'')`
      this.GetTransportFeeDetailReport(where)

    }
    

  }

  getTransportlist(key) {
 
    this.reportData = [];
  
    this.repository2.Transportdata(key).then(response => {
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
  


  GetTransportFeeDetailReport(key){
    //alert("test")
    this.reportData = [];
    this.repository.GetTransportFeeDetailReport(key).then(response => {
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

      //  alert(this.reportData)
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Transportation/transportfeedata.xml',
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
          path: '/assets/Reports/Resource/Transportation/transportdefaulterfee.xml',
          show: true
        });
      }
    });
  }
 
  


  



  

  



  
}
