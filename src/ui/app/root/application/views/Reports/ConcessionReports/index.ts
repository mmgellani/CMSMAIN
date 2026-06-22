import * as helper from '../../../helper';

import { DDLGroupModel, DDLModel, IFeeFeeHead, IFeeSubinstallmentVM, IRegistrationSectionCourseLinkVM, ISetupAdmissionType, ISetupCampusProgramVM, ISetupClass, ISetupCollector, ISetupGender, ISetupProgram, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSection, ISetupShift } from "../../../models";
import { FeeFeeHeadService, RegistrationEnrollmentsService, RegistrationSectionCourseLinkService, SetupAdmissionTypeService, SetupClassService, SetupCollectorService, SetupProgramService, SetupSectionService, SetupShiftService } from "../../../service";
import { ICampusCityVM, ISetupCampus } from "../../../models/Setup/Campus";

import Component from "vue-class-component";
import { FeeReportsService } from "../../../service/Reports/FeeReports";
import { IFeeReports } from "../../../models/Reports/FeeReports";
import { ISetupSession } from "../../../models/Setup/Session";
import { IVWCampusBaseProgram } from "../../../models/Setup/CampusBaseProgram";
import { PayloadMessageTypes } from "../../../../../model";
import { RootStoreTypes } from "../../../../store";
import { SetupCampusProgramLinkService } from "../../../service/Setup/CampusProgramLink";
import { SetupCampusService } from "../../../service/Setup/Campus";
import { SetupGenderService } from "../../../service/Setup/Gender";
import { SetupProgramDetailsService } from "../../../service/Setup/ProgramDetails";
import { SetupSessionService } from "../../../service/Setup/Session";
import { StoreTypes } from "../../../../../store";
import Vue from "vue";

// import { ReportEngine } from "../../../../../components";















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
export class ConcessionReports extends Vue {
  private session: string = "";
  private campus: string = "";
  private repository: FeeReportsService;
  private sessionModel: Array<ISetupSession> = [];
  private sessionRepo: SetupSessionService;
  private campusModel: Array<ISetupCampus> = [];
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  programDDL: Array<DDLGroupModel> = [];
  programDetailId: string = "";
  programDetailId2: string = "";
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
  private checkbutton4: boolean = true;
  private checkbutton5: boolean = false;
  private checkbutton44: boolean = true;
  private checkclassEnr: boolean = false;
  private checkbuttoncampus: boolean = true;
  private checkbuttonprogram: boolean = true;
  private checkbuttonprogramdetail: boolean = true;
  private checkbuttonclass: boolean = true;
  private checkbuttonshift: boolean = true;
  private checkbuttonsgender: boolean = true;




  private keyAll = "";
  private keyProg = "";
  private keyGen = "";
  private keyComp = "";
  private checkDiv: boolean = false;
  private paramList: Array<IQueryParam> = [];
  private checkprogram: boolean = false;
  programId: string = "";
  // private programList: Array<ISetupProgram> = [];
  private programSRepo: SetupProgramService = new SetupProgramService(this.$store);
  private shiftList: Array<ISetupShift> = [];
  private shiftRepo: SetupShiftService = new SetupShiftService(this.$store);
  private checkshift: boolean = false;
  private classRepository: SetupClassService = null;
  private classList: Array<ISetupClass> = [];
  private checkclass: boolean = false;
  private checksection: boolean = false;
  private chechkfeehead: boolean = false;
  private sectionRepo: RegistrationSectionCourseLinkService;
  private sectionList: Array<ISetupSection> = [];
  private collectorList: Array<ISetupCollector> = [];
  private collectorRepository: SetupCollectorService = null;
  private checkcollector: boolean = false;
  private shiftId: string = "";
  private classId: string = "";
  private sectionId: string = "";
  private collectorId: string = "";
  private feeHeadId: string = "";
  private feeHeadList: Array<IFeeFeeHead> = [];
  private installNo: number = 1;
  private data: Array<IFeeSubinstallmentVM> = [];
  private programList: Array<IVWCampusBaseProgram> = [];
  private programDetailList: Array<ISetupProgramDetailsVM> = [];
  private feeHeadRepository: FeeFeeHeadService = new FeeFeeHeadService(this.$store);

  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
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

  
   
    this.$watch('sessionId', this.loadCityCampus);
    this.$watch('campusId', this.loadPrograms);
    this.$watch('programId', this.loadProgramsOfCampus);
    this.$watch('checkshift', this.loadShift);
    this.$watch('programDetailId', this.loadClass);
        this.$watch('programId', this.loadClass);

    this.$watch('checkclass', this.loadClass);
    this.$watch('checkGen', this.getGender);
    // this.getGender();
    // this.loadPrograms();
    // this.loadCityCampus();
    // this.loadShift();
    // this.loadClass();
    // this.loadSection();
    // this.loadCollector();
    // this.loadFeeHead();
    // this.loadProgramsOfCampuses();
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
  getGender() {
    this.genderRepo
      .GetAll()
      .then(response => (this.genderModel = response as Array<ISetupGender>));
  }

  // loadPrograms() {
  //   this.addParam(this.checkProg, 'programId');
  //   this.programSRepo.GetFindBy('e=>e.StatusId==1')
  //     .then(r => {
  //       this.programList = r as Array<ISetupProgram>
  //     })
  // }


  loadPrograms() {
    this.addParam(this.checkProg, 'programId');
    this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
      .then(r => {
        this.programList = r as Array<IVWCampusBaseProgram>
        this.loadProgramsOfCampus2();

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

  // loadSection() {
  //   this.addParam(this.checksection, 'sectionId');
  //   this.sectionRepo.GetFindBy("e=>e.StatusId==1")
  //     .then(response => (this.sectionList = response as Array<ISetupSection>));
  // }

  // loadSection() {
  //   var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId).campusProgramId;
  //   this.addParam(this.checksection, 'sectionId');
  //   this.sectionRepo.GetSectionBycampusprogramid(cmid)
  //     .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));

  // }

  loadSection() {

    this.sectionList = [];
    var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
    this.addParam(this.checksection, 'sectionId');
    if (cmid.length > 0 && this.classId.length > 0) {
      var key = cmid + '?' + this.classId
      this.enrollmentRepo.GetSectionList(key)
        .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
    }

  }


  loadCollector() {
    this.addParam(this.checkcollector, 'collectorId');
    this.collectorRepository.GetFindBy("e=>e.StatusId == 1")
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
  loadProgramsOfCampus2() {
    this.programDetailId2 = ''
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupCampusProgramVM;
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + '?' + this.campusId
      this.campusProgramLinkRepo.GetAllVM(key)
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

  selectReport() {


    if (this.check == "Detail Report Full Fee Students") {
    //  this.paramList = [];
      this.checkbutton4 = false;
      this.checkbuttoncampus =false;
      this.checkbuttonprogram =false;
      this.checkbuttonprogramdetail =false;
      this.checkbuttonclass =false;
      this.checkbuttonshift = false;
      this.checkbuttonsgender = false;
   }
    else
    {
      this.checkbuttoncampus =true;
      this.checkbuttonprogram =true;
      this.checkbuttonprogramdetail =true;
      this.checkbuttonclass =true;
      this.checkbuttonshift = true;
      this.checkbuttonsgender = true;
    if (this.check == "Concession Strength Unpaid") {
      this.checkbutton4 = false;
    }
    else { this.checkbutton4 = true; }
  }

   if (this.check == "Program Wise Concession Detail Report") {
    //  this.paramList = [];
      this.checkbutton4 = false;
            this.checkbutton5 = true;
this.checkclassEnr=true;
      this.checkbuttoncampus =true;
      this.checkbuttonprogram =false;
      this.checkbuttonprogramdetail =false;
      this.checkbuttonclass =false;
      this.checkbuttonshift = false;
      this.checkbuttonsgender = false;
      this.checkbutton44= false;
   }
}


  loadProgramsOfCampus() {
    this.addParam(this.checkprogram, 'ProgramId');
    this.programDetailId = ''
    this.ddl = [];
    this.programDDL = [];
    let oldObj: ISetupProgramDetailsVM;
    var key = this.sessionId + '?' + this.campusId + '?' + this.programId
    this.campusProgramLinkRepo.ProgDetailByProgram(key)
      .then(r => {
        this.programDetailList = r as Array<ISetupProgramDetailsVM>
      })
  }

  get maxInstallments() {
    if (this.data) {
      if (this.data.length > 0) {
        return this.data.reduce((a, b) => Number(a.installmentNo) > Number(b.installmentNo) ? a : b).installmentNo;
      }
    }

    return 0;
  }

  addParam(isChecked: boolean, param: string) {

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
    if (param == 'InstallmentNo') {
      if (isChecked) {
        if (this.paramList.find(s => s.name == 'InstallmentNo')) {
          this.paramList.find(s => s.name == 'InstallmentNo').value = this.installNo.toString();
        } else {
          this.paramList.push({ param: "AND cv.\"InstallmentNo\"", value: this.installNo.toString(), name: 'InstallmentNo' });
        }
      } else {
        if (this.paramList.find(s => s.name == 'InstallmentNo')) {
          this.paramList.splice(this.paramList.findIndex(s => s.name == 'InstallmentNo'), 1);
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
        if (this.paramList.find(s => s.name == 'FeeHeadId')) {
          this.paramList.splice(this.paramList.findIndex(s => s.name == 'FeeHeadId'), 1);
        }
      }
    }
  }

  concession_generate() {
     if (this.check == "Concession_Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''` + ` AND cv.\"InstallmentNo\" = ''` + this.installNo + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getFeeConcessionDetails(where)
    }
    else if (this.check == "Concession Strength") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''` + ` AND cv.\"InstallmentNo\" = ''` + this.installNo + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getFeeConcessionStrength(where)
    }

    else if (this.check == "Concession Strength Unpaid") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''` + ` AND cv.\"InstallmentNo\" = ''` + this.installNo + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
     // var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getFeeConcessionStrengthUnpaid(where)
    }
   
  }
  //Report Concession Refined Function 
  getFeeConcessionDetails(key) {

    this.reportData = [];
    this.reportData.push({ fromDate: helper.formateDate(this.fromDate), toDate: helper.formateDate(this.toDate) })
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

  getFeeConcessionStrength(key) {
    this.reportData = [];
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



 getFeeConcessionDetailReport() {
  debugger;
    this.reportData = [];
    if(this.sessionId.length >0 && this.campusId.length > 0 && this.programId.length >0 && this.classId.length > 0)
    {

       var key = this.sessionId + "?" + this.campusId + "?" + this.programId + "?" + this.classId ;
    
    this.repository.GetProgramWiseConcessionReport(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/ProgramWiseConcessionReport.xml',
          show: true
        });
      }
    });
  }
  else
  {
       this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Please select all mandatory fields",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });
  }
  }

  getFeeConcessionStrengthUnpaid(key) {
    this.reportData = [];
    this.repository.GetFeeConcessionStrengthUnpaid(key).then(response => {
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
  genSum() {
    this.keyComp = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + helper.formateDate(this.fromDate) + "?" + this.toDate;

  }

  genDetail() {
    this.keyAll = this.idSession + "?" + this.campusId + "?" + "?" + helper.formateDate(this.toDate);
    this.keyComp = this.idSession + "?" + this.campusId + "?" + this.programDetailId + "?" + this.idGender + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.keyGen = this.idSession + "?" + this.campusId + "?" + this.idGender + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.keyProg = this.idSession + "?" + this.campusId + "?" + this.programDetailId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
  }
  generate() {
    
    if (this.check == "Detail Report Full Fee Students") {
    
      var where = ` AND cpl.\"SessionId\" = ''` + this.sessionId + `'' AND sc.\"InstallmentNo\" = ''` + this.installNo + `''`;

      // this.paramList.forEach(e => {

      //   where = where + " " + e.param + "=''" + e.value + "''";

      // })
     // var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getDetailReportFullFeeStudents(where)
    }
    else if (this.check == "Concession_Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''` + ` AND cv.\"InstallmentNo\" = ''` + this.installNo + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getFeeConcessionDetails(where)
    }
    else if (this.check == "Concession Strength") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''` + ` AND cv.\"InstallmentNo\" = ''` + this.installNo + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getFeeConcessionStrength(where)
    }
    else if (this.check == "Concession Strength Unpaid") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `'' AND cv.\"CampusId\" = ''` + this.campusId + `''` + ` AND cv.\"InstallmentNo\" = ''` + this.installNo + `''`;

      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
     // var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getFeeConcessionStrengthUnpaid(where)
    }
        else if (this.check == "Program Wise Concession Detail Report") {
  
     // var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`;
      this.getFeeConcessionDetailReport()
    }
    else if (this.check == "Concession Detail With Percentage") {
      //alert("testingfee2")
      var z= `AND (CP.\"SessionId\" = ''` + this.sessionId + `'')   AND (CP.\"CampusId\" = ''` + this.campusId + `'')`+ ` AND (AM.\"Dated\" >= ''` + helper.formateDate(this.fromDate) + `'' AND AM.\"Dated\" <= ''` + helper.formateDate(this.toDate) + `'')`;
      var z1=` AND SFS.\"InstallmentNo\"=`+this.installNo;
      var z3='';
    
     
      // var where = `AND ("cp".\"SessionId\" = ''` + this.sessionId + `'') AND ("cp".\"CampusId\" = ''` + this.campusId + `'')` + ` AND ("StudentFeeStructure".\"InstallmentNo\" = ''` + this.installNo + `'')`;

      this.paramList.forEach(e => {
       
        if(e.param=='AND cv."ProgramId"')
        {
          z=z+`AND (pd.\"ProgramId\" = ''` + this.programId + `'')`;
          
         }
        if(e.param=='AND cv."ProgramDetailId"')
        {
          z=z+`AND (pd.\"ProgramDetailId\" = ''` + this.programDetailId + `'')`;
        }
        if(e.param=='AND cv."ClassId"')
        {
          z=z+`AND (CL.\"ClassId\"=''` + this.classId + `'')`;
         
        }
        if(e.param=='AND cv."ShiftId"')
        {
          z=z+`AND (pd.\"ShiftId\"=''` + this.shiftId + `'')`;
      
        }
        if(e.param=='AND cv."GenderId"')
        {
         z3=`AND (s.\"GenderId\"=''` + this.idGender + `'')`;
        
        }
        // if(e.param=='AND cv."InstallmentNo"')

        // {
          
        //   e.param='And "InstallmentNo"'

        // }
       // where = where + " " + e.param + "=''" + e.value + "''";
        

      

       })
      var where =z+'?'+z1+'?'+z3;
     
      this.getConceWithPercentage(where)
    }

  }
  getConceWithPercentage(key) {
    this.reportData = [];
    this.repository.GetConceWithPercentage(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/Concession-Detail-Report-Percentage.xml',
          show: true
        });
      }
    });
  }
  getDetailReportFullFeeStudents(key) {
    this.reportData = [];
    this.repository.GetFullFeeStudentDetail(key).then(response => {
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
          path: '/assets/Reports/Resource/Fee/DetailFullFeeStudentst.xml',
          show: true
        });
      }
    });
  }
}
