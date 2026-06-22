import * as helper from '../../../helper';

import { CitySubCity, DDLGroupModel, DDLModel, ISetupAdmissionType, ISetupCampusProgramVM, ISetupCity, ISetupProgram, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSubCity, ISetupClass } from "../../../models";
import { ICampusCityVM, ISetupCampus } from "../../../models/Setup/Campus";
import { IRootStoreState, RootStoreTypes } from "../../../../store";
import { IUser, PayloadMessageTypes } from "../../../../../model";
import {
  SetupAdmissionTypeService,
  SetupCampusProgramLinkService,
  SetupCampusService,
  SetupCityService,
  SetupProgramDetailsService,
  SetupProgramService,
  SetupSubCityService,
  SetupClassService,
  AdmissionAdmissionFormService
} from "../../../service";

import Component from "vue-class-component";
import { ISetupGender } from "../../../models/Setup/Gender";
import { ISetupSection } from "../../../models/Setup/Section";
import { ISetupSession } from "../../../models/Setup/Session";
import { IVWCampusBaseProgram } from "../../../models/Setup/CampusBaseProgram";
import { ReportsService } from "../../../service/Reports/AdmissionReports";
import { SetupGenderService } from "../../../service/Setup/Gender";
import { SetupSectionService } from "../../../service/Setup/Section";
import { SetupSessionService } from "../../../service/Setup/Session";
import { State } from "vuex-class";
import { StoreTypes } from "../../../../../store";
import Vue from "vue";
import moment from 'moment';

// import { ReportEngine } from "../../../../../components";














//import moment from "moment";




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


export class AdmissionReports extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private repository: ReportsService;
  private campusModel: Array<ISetupCampus> = [];
  private campusList: Array<ISetupCampus> = []
  private campusRepo: SetupCampusService;
  private campusRepos: SetupCampusService = new SetupCampusService(this.$store)
  private sessionModel: Array<ISetupSession> = [];
  private sessionRepo: SetupSessionService;
  private genderModel: Array<ISetupGender> = [];
  private genderRepo: SetupGenderService;
  private programModel: Array<ISetupProgramDetails> = [];
  private programRepo: SetupProgramDetailsService;
  private programSRepo: SetupProgramService = new SetupProgramService(this.$store);
  private admissionRepository: AdmissionAdmissionFormService;
  private sectionModel: Array<ISetupSection> = [];
  private cityDDL: Array<DDLGroupModel> = []
  private campusddl: Array<DDLModel> = []
  private campusCityList: Array<ICampusCityVM> = []
  private paramList: Array<IQueryParam> = [];
  private programDetailList: Array<ISetupProgramDetailsVM> = [];
  programDDL: Array<DDLGroupModel> = [];
  programDetailId: string = "";
  showfilter=false;
  admissionTypeId: string = "";
  admissionTypeIdNew: string = "";
  sessionId: string = "";
  cityId: string = "";
  campusId: string = "";
  programId: string = "";
  subCityId: string = "";
  ddl: Array<DDLModel> = [];
  campusProgramLinkList: any[];
  private cityList: Array<ISetupCity> = []
  private subCityList: Array<CitySubCity> = []
  private programList: Array<IVWCampusBaseProgram> = [];
  private admissionTypeList: Array<ISetupAdmissionType> = [];
  private sectionRepo: SetupSectionService;
  private reportData: any = [];
  private report: String = "";
  private idCampus: string = "";
  private idSession: String = "";
  private idGender: string = "";
  private idProgram: string = "";
  private zoneId = '';
  private fromDate = new Date();
  private toDate = new Date();
  private checkProg: boolean = false;
  private checkReport: boolean = false;
  private checkGen: boolean = false;
  private checkstudenttype: boolean = false;
  private checkcampus: boolean = false;
  private checksubcity: boolean = false;
  private checkcity: boolean = false;
  private checkprogram: boolean = false;
  private checkbutton: boolean = false;
  private checkbutton2: boolean = false;
  private checkbutton3: boolean = true;
  private checkbutton4: boolean = true;
  private checkbutton7: boolean = false;
  private checkbutton11: boolean = false;
  private checkbutton12: boolean = false;
  private checkbutton13: boolean = false;
  private checkbutton14: boolean = false;
  private checkbuttonPre: boolean = false;
  private checkbuttonOrder: boolean = false;
  private checkAdmissionData: boolean = false;
  private checkSOI: boolean = false;

  private checkOrder: string = '';
  private checkbutton8: boolean = false;


  private classList: Array<ISetupClass> = [];

  private check: string = "";
  private checkAdmission: string = "";
  private keyAll = "";
  private keyProg = "";
  private keyGen = "";
  private keyComp = "";
  private selectedYear = "";
  private classId: string = "";

  private isEnrolled: boolean = false;
  private indexId: number = 0;

  private currentYear = new Date().getFullYear();

  private year: any = [];
  private passingYearCheck = false;

  private classRepository: SetupClassService = null;

  private admisisonTypeRepo: SetupAdmissionTypeService = new SetupAdmissionTypeService(this.$store);
  private cityRepo: SetupCityService = new SetupCityService(this.$store)
  private subCityRepo: SetupSubCityService = new SetupSubCityService(this.$store)
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(this.$store);
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }]
  private checkinstall: boolean = false;
  private installNo: number = 1;
  private admissionDate  = "1";


  created() {
    this.repository = new ReportsService(this.$store);
    this.campusRepo = new SetupCampusService(this.$store);
    this.sessionRepo = new SetupSessionService(this.$store);
    this.genderRepo = new SetupGenderService(this.$store);
    this.programRepo = new SetupProgramDetailsService(this.$store);
    this.sectionRepo = new SetupSectionService(this.$store);
    this.classRepository = new SetupClassService(this.$store);
    this.admissionRepository = new AdmissionAdmissionFormService(this.$store);


    this.loadSession();
    this.loadClass();
    this.loadCity();

    this.$watch('checkcity', this.loadCity);
    this.$watch('cityId', this.loadSubCity);
    this.$watch('subCityId', this.loadCityCampus);
    this.$watch('campusId', this.loadPrograms);
    this.$watch('programId', this.loadProgramsOfCampus);
    this.$watch('checkGen', this.getGender);
    this.$watch('checkstudenttype', this.loadAdmissionType);
  }
  mounted() { }

  loadClass() {
    this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
      this.classList = r as Array<ISetupClass>;
    });
  }

  refreshData() {

    if (this.check == "Detail And Summary report" || this.check == "Detail And Summary Fee Paid report" || this.check == "Form Collection Summary" || this.check == " Step Form Collection Summary" || this.check == " Admission Statics City Wise" || this.check == "Admission Form Checklist" || this.check == "Detail Report Board Wise" || this.check == "Detail Report Passing Year Wise" || this.check == "Detail report Address Wise") {

      this.year = [];
      var i = 10;
      for (i; i > 0; i--) {
        this.year.push({ year: this.currentYear.toString() });
        this.currentYear--
      }
      // this.paramList.push({ param: "cv.\"EnrollmentNo\"", value: " < 2 ", name: 'EnrollmentNo' });
    }
  }

  addParam(isChecked: boolean, param: string) {
    if (this.check == 'Admission Report') {
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
      if (param == 'SubCityId') {
        if (isChecked) {
          if (this.paramList.find(s => s.name == 'SubCityId')) {
            if (this.subCityId.length > 0) {
              this.paramList.find(s => s.name == 'SubCityId').value = this.subCityId;
            }
          } else {
            if (this.subCityId.length > 0) {
              this.paramList.push({ param: "AND ssub.\"SubCityId\"", value: this.subCityId, name: 'SubCityId' });
            }
          }
        } else {
          if (this.paramList.find(s => s.name == 'SubCityId')) {
            this.paramList.splice(this.paramList.findIndex(s => s.name == 'SubCityId'), 1);
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
    else {
    if (param == 'CityId') {
      if (isChecked) {
        if (this.paramList.find(s => s.name == 'CityId')) {
          if (this.cityId.length > 0) {
            this.paramList.find(s => s.name == 'CityId').value = this.cityId;
          }
        } else {
          if (this.cityId.length > 0) {
            this.paramList.push({ param: "AND cv.\"CityId\"", value: this.cityId, name: 'CityId' });
          }
        }
      } else {
        if (this.paramList.find(s => s.name == 'CityId')) {
          this.paramList.splice(this.paramList.findIndex(s => s.name == 'CityId'), 1);
        }
      }
    }

    if (param == 'SubCityId') {
      if (isChecked) {
        if (this.paramList.find(s => s.name == 'SubCityId')) {
          if (this.subCityId.length > 0) {
            this.paramList.find(s => s.name == 'SubCityId').value = this.subCityId;
          }
        } else {
          if (this.subCityId.length > 0) {
            this.paramList.push({ param: "AND cv.\"SubCityId\"", value: this.subCityId, name: 'SubCityId' });
          }
        }
      } else {
        if (this.paramList.find(s => s.name == 'SubCityId')) {
          this.paramList.splice(this.paramList.findIndex(s => s.name == 'SubCityId'), 1);
        }
      }
    }

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
    if (param == 'AdmissionTypeId') {
      if (isChecked) {
        console.log(this.admissionTypeId);
debugger;
      //   if(this.admissionTypeId=='815c3958-4bed-4a55-813a-681852b63c1a'){
      //     this.admissionTypeIdNew=this.admissionTypeId;
      //     this.admissionTypeId='0becb36d-3cfb-49ac-ad3e-9af692a1a558';
      //     if (this.paramList.find(s => s.name == 'AdmissionTypeId')) {
      //       this.paramList.find(s => s.name == 'AdmissionTypeId').value = this.admissionTypeId;
      //     } else {
      //       this.paramList.push({ param: "AND cv.\"AdmissionTypeId\"", value: this.admissionTypeId, name: 'AdmissionTypeId' });
      //     }
      // }
      //  else{
        this.admissionTypeIdNew=this.admissionTypeId;
        if (this.paramList.find(s => s.name == 'AdmissionTypeId')) {
          this.paramList.find(s => s.name == 'AdmissionTypeId').value = this.admissionTypeId;
        } else {
          this.paramList.push({ param: "AND cv.\"AdmissionTypeId\"", value: this.admissionTypeId, name: 'AdmissionTypeId' });
        }
       //}
    } else {
        if (this.paramList.find(s => s.name == 'AdmissionTypeId')) {
          this.paramList.splice(this.paramList.findIndex(s => s.name == 'AdmissionTypeId'), 1);
        }
      }
    }
    if (param == 'Year') {
      if (isChecked) {
        if (this.paramList.find(s => s.name == 'Year')) {
          this.paramList.find(s => s.name == 'Year').value = this.selectedYear;
        } else {
          this.paramList.push({ param: "AND cv.\"Year\"", value: this.selectedYear, name: 'Year' });
        }
      } else {
        if (this.paramList.find(s => s.name == 'Year')) {
          this.paramList.splice(this.paramList.findIndex(s => s.name == 'Year'), 1);
        }
      }
    }
    if (param == 'EnrollmentNo') {
      // if (this.check == "Form Report" || this.check == "Form Report Summary") {
      //   if (this.paramList.find(s => s.name == 'EnrollmentNo')) {
      //     this.paramList.splice(this.paramList.findIndex(s => s.name == 'EnrollmentNo'), 1);
      //   }
      //   if (this.isEnrolled) {
      //     this.paramList.push({ param: "cv.\"EnrollmentNo\"", value: " > 2", name: 'EnrollmentNo' });

      //   }

      // }
      // else {
      if (this.paramList.find(s => s.name == 'EnrollmentNo')) {
        this.paramList.splice(this.paramList.findIndex(s => s.name == 'EnrollmentNo'), 1);
      }
      if (this.isEnrolled) {
        this.paramList.push({ param: "cv.\"EnrollmentNo\"", value: " > 2", name: 'EnrollmentNo' });

      }
      //   else {
      //     this.paramList.push({ param: "cv.\"EnrollmentNo\"", value: " < 2 ", name: 'EnrollmentNo' });
      //   }
      // }
    }
  }
  }
  genOnline() {
    if (this.check == "Form Report") {

      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })

      //where = this.loadParamsEx(where);

      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetFormReport(where)
        .then(r => {
          this.getFormReport(r)
        })
    }
    else if (this.check == "Form Report Summary") {

      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })

      //where = this.loadParamsEx(where);

      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetFormReport(where)
        .then(r => {
          this.getFormReportSummary(r)
        })
    }

  }

  genOverall() {
    if (this.check == "Form Report") {

      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })

      ////where = this.loadParamsEx(where);

      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetFormReportEx(where)
        .then(r => {
          this.getFormReport(r)
        })
    }
    else if (this.check == "Form Report Summary") {

      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })

      ////where = this.loadParamsEx(where);

      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetFormReportEx(where)
        .then(r => {
          this.getFormReportSummary(r)
        })
    }

  }

  genDetail() {
 
    if(this.check == "Detail And Summary report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;
      if(this.admissionTypeIdNew=='815c3958-4bed-4a55-813a-681852b63c1a'){
          where = where +` AND cv.\"FormNo\" = ''` + 'Online' + `''`;
      }
      else {
           where =where +` AND cv.\"FormNo\" != ''` + 'Online' + `''`;
      }
      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })

      //where = this.loadParamsEx(where);

      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetAdmissionDetailGen(where)
        .then(r => {
          this.getCellectionGenDetailReport(r)
        })
    }

    else if
      (this.check == "Detail And Summary Fee Paid report") {

      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })

       where = this.loadParamsEx(where);

      if(this.admissionDate=='1')
      {
        var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`

      }
      if(this.admissionDate=='2')
      {
        var where = where + ` AND cv.\"PaidDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"PaidDate\" <= ''` + helper.formateDate(this.toDate) + `''`

      }

      this.repository.GetAdmissionDetailFee(where+'?'+this.admissionDate)
        .then(r => {
          this.getCellectionGenDetailFee(r)
        })
    }






    else if (this.check == "Admission Form Checklist") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })

      //where = this.loadParamsEx(where);
      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetAdmissionDetailGen(where)
        .then(r => {
          this.getCellectionGenDetailReportEx(r)
        })
    }

    else if (this.check == "Admission Report") {
      if(this.checkAdmission.length>0){
      if(this.checkAdmission == "Pre Admission Report"){
        var where = `AND sses.\"SessionId\" = ''` + this.sessionId + `''`;

        this.paramList.forEach(e => {

          where = where + " " + e.param + "=''" + e.value + "''";

        })
        // var where = where + ` AND af.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND af.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
        this.getPreAdmissionReport(where)
      }
      else  if(this.checkAdmission == "Undergraduate Admission Report"){
        var where = `AND sses.\"SessionId\" = ''` + this.sessionId + `''`;

        this.paramList.forEach(e => {

          where = where + " " + e.param + "=''" + e.value + "''";

        })
        // var where = where + ` AND af.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND af.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
        this.getUndergraduateAdmissionReport(where)
      }
      else if(this.checkAdmission == "Regular Admission Report"){
          var where = `AND sses.\"SessionId\" = ''` + this.sessionId + `''`;

        this.paramList.forEach(e => {

          where = where + " " + e.param + "=''" + e.value + "''";

        })
        // var where = where + ` AND af.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND af.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
        this.getRegularAdmissionReport(where)
      }

      }else{
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Select Report First",
          title: "Error",
          messageTypeId: PayloadMessageTypes.error
        });
      }
      

    }
    // else if (this.check == "Regular Admission Report") {
      
    // }

    else if (this.check == "Admission Aging Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;
      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // //where = this.loadParamsEx(where);
      // var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      // this.repository.GetMatricPercReport(where)
      //   .then(r => {
      //     this.getMatricPercReport(r)
      //   })
      where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`

      this.admissionRepository
        .GetadmissionAging(where + "?" + this.user.userId)
        .then(
          response => {
            this.getAdmissionAgingReport(response)
          }
        );

    }
    else if (this.check == "Admission Aginga Report") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;
      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // //where = this.loadParamsEx(where);
      // var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      // this.repository.GetMatricPercReport(where)
      //   .then(r => {
      //     this.getMatricPercReport(r)
      //   })
      where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`

      this.admissionRepository
        .GetadmissionAging(where + "?" + this.user.userId)
        .then(
          response => {
            this.getAdmissionAgingaReport(response)
          }
        );

    }
    this.admissionTypeIdNew='';
  }
  genSum() {
    var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;
    if(this.admissionTypeIdNew=='815c3958-4bed-4a55-813a-681852b63c1a'){
      where = where +` AND cv.\"FormNo\" = ''` + 'Online' + `''`;
  }
  else { 
    if(this.admissionTypeId.length>0)
    where =where +` AND cv.\"FormNo\" != ''` + 'Online' + `''`;
  }
    this.paramList.forEach(e => {
      if (e.name.indexOf('EnrollmentNo') >= 0) {
        where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
      } else {
        where = where + " " + e.param + "=''" + e.value + "''";
      }
    })
    //where = this.loadParamsEx(where);
    var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
    this.repository.GetAdmissionDetailGen(where)
      .then(r => {
        this.getAdmissionSummaryComp(r);


      })
      this.admissionTypeIdNew='';
  }
  genStepDetaill(option: any) {

    var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

    this.paramList.forEach(e => {
      if (e.name.indexOf('EnrollmentNo') >= 0) {
        where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
      } else {
        where = where + " " + e.param + "=''" + e.value + "''";
      }
    })
    //where = this.loadParamsEx(where);
    var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
    var z = where + '?' + option;
    console.log(z);
    this.repository.GetStepDetailGen(z)
      .then(r => {
        this.getAdmissionSummaryComp(r);


      })
  }


  loadParamsEx(where) {
    if (where.indexOf('CityId') > 0) {
      where += ` AND cv."CityId" = ANY (SELECT "Id" FROM "Role"."VWUserRights" WHERE "UserId" = ` + this.user.userId + `)`
    }
    if (where.indexOf('SubCityId') > 0) {
      where += ` AND cv."SubCityId" = ANY (SELECT "Id" FROM "Role"."VWUserRights" WHERE "UserId" = ` + this.user.userId + `)`
    }
    if (where.indexOf('CampusId') > 0) {
      where += ` AND cv."CampusId" = ANY (SELECT "Id" FROM "Role"."VWUserRights" WHERE "UserId" = ` + this.user.userId + `)`
    }
    if (where.indexOf('ProgramId') > 0) {
      where += ` AND cv."ProgramId" = ANY (SELECT "Id" FROM "Role"."VWUserRights" WHERE "UserId" = ` + this.user.userId + `)`
    }

    return where;
  }

  cities = [];
  loadCities(city) {
    if (this.campusCityList) {
      if (this.campusCityList.length > 0) {
        return this.campusCityList.filter(e => e.cityName == city);
      }
    }
  }

  loadCityCampus() {
    this.addParam(this.checkcampus, 'campusId');
    this.campusddl = [];
    this.cityDDL = [];
    let oldObj: ICampusCityVM;
    this.campusRepo.GetCityVM()
      .then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
        this.campusCityList = this.campusCityList.filter(e => e.subCityId == this.subCityId);
        this.cities = [];
        this.campusCityList.forEach(element => {
          if (this.cities.indexOf(element.cityName) == -1) {
            this.cities.push(element.cityName);
          }
        });
      })
  }

  loadSession() {
    this.sessionRepo.GetFindBy('e=>e.StatusId==1')
      .then(r => {
        this.sessionModel = r as Array<ISetupSession>
      })
  }

  getGender() {
    this.genderRepo
      .GetAll()
      .then(response => (this.genderModel = response as Array<ISetupGender>));
  }
  loadCity() {
    this.cityRepo.GetAllEx()
      .then(r => {
        this.cityList = r as Array<ISetupCity>

      })
  }
  loadSubCity() {
    this.addParam(this.checkcity, 'CityId');
    this.subCityRepo.GetFindByEx(this.cityId)
      .then(r => {
        this.subCityList = r as Array<CitySubCity>
      })

  }
  loadPrograms() {
    //this.addParam(this.checkProg, 'programId');
    this.programSRepo
      .ProgramByCampus(
        'e=>e.CampusId.ToString()=="' +
          this.campusId +
          '" && e.SessionId.ToString()=="' +
          this.sessionId +
          '"'
      )
      .then((r) => {
        this.programList = r as Array<IVWCampusBaseProgram>;
        if (
          this.check == "Admission Report" &&
          this.checkAdmission == "Regular Admission Report"
        ) {
          this.programList = this.programList.filter((e) => {
            if (
              e.programName.includes("ADA") ||
              e.programName.includes("ADC") ||
              e.programName.includes("ADS") ||
              e.programName.includes("Pre")
            ) {
              return false;
            } else {
              return e.programName;
            }
          });
        }
        if (
          this.check == "Admission Report" &&
          this.checkAdmission == "Pre Admission Report"
        ) {
          this.programList = this.programList.filter((e) =>
            e.programName.includes("Pre")
          );
        }
      });
  }
  loadAdmissionType() {
    this.admisisonTypeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
      this.admissionTypeList = r as Array<ISetupAdmissionType>;
    });
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

  getSection() {
    this.sectionRepo
      .GetAll()
      .then(response => (this.sectionModel = response as Array<ISetupSection>));
  }

  //*********************************************/
  //*************For Summary*************
  getFormCollectionReport(key) {
    this.reportData = [];
    this.report =
      "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";
    this.repository.GetAdmissionDetail(key).then(response => {
      this.reportData = response as any;
      this.$modal.show("report-viewer-eng");
    });
  }

  getCellectionGenReport(key) {
    this.reportData = [];
    this.repository.GetAdmissionDetailGen(key).then(response => {
      this.reportData = response as any;
      this.report =
        "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";
      if (this.reportData.length > 0) {
        this.$modal.show("report-viewer-eng");
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });

      }

    });
  }

  getAdmissionProgramReport(key) {
    this.reportData = [];
    this.report =
      "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";
    this.repository.GetAdmissionDetailProg(key).then(response => {
      this.reportData = response as any;
      this.$modal.show("report-viewer-eng");
    });
  }

  getAdmissionSummaryComp(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";

    this.reportData = key as any;
    // this.$modal.show("report-viewer-eng");

    if (this.reportData.length > 0) {
      this.reportData.forEach(element => {
        // element.fromDate = this.fromDate
        // element.toDate = this.toDate
        element.fromDate = moment(this.fromDate).format('YYYY-MM-DD'); // ya koi aur format
    element.toDate = moment(this.toDate).format('YYYY-MM-DD');
      });

      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml',
        show: true
      });
    }
    else {

      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "No Record Found",
        title: "Warning",
        messageTypeId: PayloadMessageTypes.warning
      });


    }


  }

  //*********************************************/
  //*************For Detail*************
  getFormCollectionDetailReport(key) {
    this.reportData = [];
    this.report =
      "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    this.repository.GetAdmissionDetail(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$modal.show("report-viewer-eng");
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });


      }
    });
  }

  getCellectionGenDetailReport(data) {

    this.reportData = [];

    this.reportData = data as any;


    if (this.reportData.length > 0) {
      this.reportData.forEach(element => {
        element.fromDate = helper.formateDate(this.fromDate).toString()
        element.toDate = helper.formateDate(this.toDate).toString()
      });
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetail.xml',
        show: true
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "No Record Exist",
        title: "",
        messageTypeId: PayloadMessageTypes.warning
      });
    }



  }

  getCellectionGenDetailFee(data) {
    this.reportData = [];

    this.reportData = data as any;
    if (this.reportData.length > 0) {
      this.reportData.forEach(element => {
        element.fromDate = helper.formateDate(this.fromDate).toString()
        element.toDate = helper.formateDate(this.toDate).toString()
      });
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailFee.xml',
        show: true
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Record Exist',
        title: '',
        messageTypeId: PayloadMessageTypes.warning
      });


    }
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    // this.$modal.show("report-viewer-eng");


  }
  getFormReport(data) {
    this.reportData = [];

    this.reportData = data as any;
    if (this.reportData.length > 0) {
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/form-report.xml',
        show: true
      });

    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Record Exist',
        title: '',
        messageTypeId: PayloadMessageTypes.warning
      });


    }


  }


  getFormReportSummary(data) {
    this.reportData = [];

    this.reportData = data as any;
    if (this.reportData.length > 0) {
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/form-report-summary.xml',
        show: true
      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'No Record Exist',
        title: '',
        messageTypeId: PayloadMessageTypes.warning
      });


    }



  }
  getCellectionGenDetailReportEx(data) {
    this.reportData = [];

    var arr = data as any
    arr.forEach(element => {
      if (+element.total > 0) {
        element.percentage = Math.round((+element.obtained) / (+element.total) * 100)
      }
      else {
        element.total = 1;
        element.percentage = Math.round((+element.obtained) / (+element.total) * 100)
      }

    });

    console.log((arr))

    if (this.checkOrder == '1') {

      arr.sort((n2, n1) => {
        if (n1.refferenceNo > n2.refferenceNo) {
          return 1;
        }

        if (n1.refferenceNo < n2.refferenceNo) {
          return -1;
        }

      });
    }

    else {

      arr.sort((n2, n1) => {
        if (n1.percentage > n2.percentage) {
          return 1;
        }

        if (n1.percentage < n2.percentage) {
          return -1;
        }

      });


    }

    console.log((arr))

    // this.reportData = data as any;
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    // this.$modal.show("report-viewer-eng");
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: arr as any,
      path: '/assets/Reports/Resource/Admission/admissionReportDetailwithFormNo.xml',
      show: true
    });


  }

  getAddressWiseReport(data) {
    this.reportData = [];

    this.reportData = data as any;
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    // this.$modal.show("report-viewer-eng");
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: this.reportData as any,
      path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
      show: true
    });

  }
  getPassingYearWiseReport(data) {
    this.reportData = [];

    this.reportData = data as any;
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: this.reportData as any,
      path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
      show: true
    });
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    // this.$modal.show("report-viewer-eng");

  }
  getBoardWiseReport(data) {
    this.reportData = [];
    this.reportData = data as any;

    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: this.reportData as any,
      path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
      show: true
    });
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    // this.$modal.show("report-viewer-eng");

  }

  getAdmissionProgramDetailReport(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    this.repository.GetAdmissionDetailProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetail.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }

  getAdmissionSummaryDetailComp(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    this.repository.GetAllAdmissionDetailComp(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetail.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }

  //*********************************************/
  //*************For Summary Enrolled*************
  getFormCollectionReportEnrolled(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";
    this.repository.GetAdmissionDetailEnrolled(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }

  getCellectionGenReportEnrolled(key) {
    this.reportData = [];
    this.repository.GetAdmissionDetailGenEnrolled(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml',
        show: true
      });
      // this.report =
      //   "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";
      // this.$modal.show("report-viewer-eng");
    });
  }

  getAdmissionProgramReportEnrolled(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";
    this.repository.GetAdmissionDetailProgEnrolled(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }

  getAdmissionSummaryCompEnrolled(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml";
    this.repository.GetAllAdmissionDetailCompEnrolled(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/form-Collection-Summary-All.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  //*********************************************/
  //*************For Detail Enrolled*************
  getFormCollectionDetailReportEnrolled(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    this.repository.GetAdmissionDetailEnrolled(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetail.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }

  getCellectionGenDetailReportEnrolled(key) {
    this.reportData = [];
    this.repository.GetAdmissionDetailGenEnrolled(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetail.xml',
        show: true
      });
      // this.report =
      //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
      // this.$modal.show("report-viewer-eng");
    });
  }

  getAdmissionProgramDetailReportEnrolled(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    this.repository.GetAdmissionDetailProgEnrolled(key).then(response => {
      this.reportData = response as any;
      if (this.reportData) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Admission/admissionReportDetail.xml',
          show: true
        });
      }
      else {
        alert('No')


      }
      // this.$modal.show("report-viewer-eng");
    });

  }

  getAdmissionSummaryDetailCompEnrolled(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetail.xml";
    this.repository.GetAllAdmissionDetailCompEnrolled(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetail.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }

  selectReport() {
    if (this.check == "Detail And Summary report") {
      this.paramList = [];
      this.checkbutton = true;
      this.checkbutton7 = false;
      this.checkReport = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkbuttonPre = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;

      this.refreshData();

    }
    else if (this.check == "Detail And Summary Fee Paid report") {
      this.paramList = [];
      this.checkbutton = true;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkReport = false;
      this.checkbuttonPre = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=true;


      this.refreshData();

    }
    else if (this.check == "Form Report") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkReport = false;
      this.checkbuttonPre = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }

    else if (this.check == "Form Report Summary") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbuttonPre = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkReport = false;
      this.checkbutton11 = true;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }


    else if (this.check == "Form Collection Summary") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = true;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkbutton4 = true;
      this.checkbuttonPre = false;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkReport = false;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }
    else if (this.check == "Step Form Collection Summary") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkReport = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = true;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkbuttonPre = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }
    else if (this.check == "Admission Statics City Wise") {
      this.paramList = [];
      this.checkAdmissionData = true;
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkReport = false;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = false;
      this.checkbuttonPre = false;
      this.checkbutton14 = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


    }

    else if (this.check == "Source of Information Report") {
      this.paramList = [];
      this.checkAdmissionData = false;
      this.checkbutton = false;
      this.checkReport = false;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = false;
      this.checkbutton14 = false;
      this.checkbuttonPre = false;
      this.checkinstall = false;
      this.checkSOI = true;
      this.showfilter=false;


    }



    else if (this.check == "Admission Form Checklist") {
      this.paramList = [];
      this.checkbutton = true;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkbutton4 = true;
      this.checkbuttonOrder = true;
      this.checkReport = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbuttonPre = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }

    else if (this.check == "Admission Report") {
      this.sessionId = '356d8f98-b830-45df-b5cd-a090c5c7685a';
      this.fromDate = new Date('07/01/2021');
      this.paramList = [];
      this.checkbutton = true;
      this.checkReport = true;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbuttonPre = true;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }

    // else if (this.check == "Regular Admission Report") {
    //   this.sessionId = '356d8f98-b830-45df-b5cd-a090c5c7685a';
    //   this.fromDate = new Date('07/01/2021');
    //   this.paramList = [];
    //   this.checkbutton = true;
    //   this.checkbutton7 = false;
    //   this.checkbutton2 = false;
    //   this.checkbutton3 = false;
    //   this.checkbutton4 = true;
    //   this.checkbuttonOrder = false;
    //   this.checkbutton11 = false;
    //   this.checkbutton12 = false;
    //   this.checkbutton8 = false;
    //   this.checkbuttonPre = true;
    //   this.checkbutton13 = true;
    //   this.checkbutton14 = false;
    //   this.checkAdmissionData = false;
    //   this.checkinstall = false;
    //   this.checkSOI = false;
    //   this.showfilter=false;


    //   this.refreshData();
    // }
    else if (this.check == "Detail Report Board Wise") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = true;
      this.checkbutton3 = true;
      this.checkReport = false;
      this.checkbuttonPre = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;



      this.refreshData();
    } else if (this.check == "Detail Report Passing Year Wise") {
      this.paramList = [];
      this.checkReport = false;
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = true;
      this.checkbuttonPre = false;
      this.checkbutton3 = true;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;



      this.refreshData();
    } else if (this.check == "Detail report Address Wise") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = true;
      this.checkbutton3 = true;
      this.checkbutton4 = true;
      this.checkReport = false;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbuttonPre = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;



      this.refreshData();
    } else if (this.check == "Student Matric Marks") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbuttonPre = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkReport = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;



    } else if (this.check == "Student Marks Percentage") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkReport = false;
      this.checkbutton2 = true;
      this.checkbutton3 = false;
      this.checkbuttonPre = false;
      this.checkbutton4 = false;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;



    } else if (this.check == "Student GenderWise Count") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbuttonPre = false;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = false;
      this.checkbutton4 = false;
      this.checkReport = false;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = false;
      this.checkbutton14 = true;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;



    } else if (this.check == "Concession GenderWise Count") {
      this.paramList = [];
      this.checkbutton = false;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = false;
      this.checkbuttonPre = false;
      this.checkReport = false;
      this.checkbutton4 = false;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = false;
      this.checkbutton14 = true;
      this.checkAdmissionData = false;
      this.checkinstall = true;
      this.checkSOI = false;
      this.showfilter=false;



    } else if (this.check == "Admission Aging Report") {
      this.paramList = [];
      this.checkbutton = true;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkReport = false;
      this.checkbuttonPre = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }
    else if (this.check == "Admission Aginga Report") {
      this.paramList = [];
      this.checkbuttonPre = false;
      this.checkbutton = true;
      this.checkbutton7 = false;
      this.checkbutton2 = false;
      this.checkbutton3 = true;
      this.checkReport = false;
      this.checkbutton4 = true;
      this.checkbuttonOrder = false;
      this.checkbutton11 = false;
      this.checkbutton12 = false;
      this.checkbutton8 = false;
      this.checkbutton13 = true;
      this.checkbutton14 = false;
      this.checkAdmissionData = false;
      this.checkinstall = false;
      this.checkSOI = false;
      this.showfilter=false;


      this.refreshData();
    }


  }

  ToggleSubcity() {
    if (this.checksubcity == false)
      this.subCityId = '';
  }
  getAdmissionReportBoardWiseGen(key) {
    this.reportData = [];
    this.repository.GetAdmissionReportBoardWiseGen(key).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
          show: true
        });
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });

      }

    });
  }

  genGenderReport() {
    this.reportData = [];
    if (this.checkinstall == true) {
      if (this.sessionId.length > 0 && this.cityId.length > 0 && this.subCityId.length > 0 && this.classId.length > 0) {
        var key = this.sessionId + "?" + this.cityId + "?" + this.subCityId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.installNo
        this.repository.GetGenderConCount(key).then(response => {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Admission/gender-conwise-report.xml',
            show: true
          });
        });
      }
      else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
        var key = this.sessionId + "?" + this.cityId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate) + "?" + this.installNo
        this.repository.GetGenderConCountEx(key).then(response => {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Admission/gender-conwise-report.xml',
            show: true
          });
        });
      }
    }
    else {
      if (this.sessionId.length > 0 && this.cityId.length > 0 && this.subCityId.length > 0 && this.classId.length > 0) {
        var key = this.sessionId + "?" + this.cityId + "?" + this.subCityId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate)
        this.repository.GetGenderCount(key).then(response => {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Admission/gender-wise-report.xml',
            show: true
          });
        });
      }
      else if (this.sessionId.length > 0 && this.cityId.length > 0 && this.classId.length > 0) {
        var key = this.sessionId + "?" + this.cityId + "?" + this.classId + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate)
        this.repository.GetGenderCountEx(key).then(response => {
          this.reportData = response as any;
          this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.reportData as any,
            path: '/assets/Reports/Resource/Admission/gender-wise-report.xml',
            show: true
          });
        });
      }
    }
  }






  GetStaticsData2() {
    this.checkAdmissionData = true;
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionCityWise(this.sessionId).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Admission/admission-statics-city.xml',
          show: true
        });
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });

      }

    });



  }

  genSOI() {
    this.reportData = [];
    this.repository.GetAdmissionSOI(helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate)).then(response => {
      this.reportData = response as any;
      if (this.reportData.length > 0) {
        this.reportData.forEach(element => {
          element.fromDate = this.fromDate
          element.toDate = this.toDate
        });


        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Admission/admission-soi.xml',
          show: true
        });
      }
      else {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "No Record Found",
          title: "Warning",
          messageTypeId: PayloadMessageTypes.warning
        });

      }

    });



  }

  getAdmissionReportYearWiseGen(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportYearWiseGen(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportAddressWiseGen(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportAddressWiseGen(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportBoardWiseProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    this.repository.GetAdmissionReportBoardWiseProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportYearWiseProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportYearWiseProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportAddressWiseProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportAddressWiseProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportBoardWise(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    this.repository.GetAdmissionReportBoardWise(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportYearWise(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportYearWise(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportAddressWise(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportAddressWise(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportBoardWiseGenProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    this.repository.GetAdmissionReportBoardWiseGenProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportYearWiseGenProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportYearWiseGenProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportAddressWiseGenProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportAddressWiseGenProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledBoardWiseGen(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    this.repository.GetAdmissionReportEnrolledBoardWiseGen(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledYearWiseGen(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportEnrolledYearWiseGen(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledAddressWiseGen(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportEnrolledAddressWiseGen(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledBoardWiseProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    this.repository.GetAdmissionReportEnrolledBoardWiseProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledYearWiseProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportEnrolledYearWiseProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledAddressWiseProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportEnrolledAddressWiseProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledBoardWise(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    this.repository.GetAdmissionReportEnrolledBoardWise(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledYearWise(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportEnrolledYearWise(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledAddressWise(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportEnrolledAddressWise(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledBoardWiseGenProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml";
    this.repository.GetAdmissionReportEnrolledBoardWiseGenProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailBoardWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledYearWiseGenProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml";
    this.repository.GetAdmissionReportEnrolledYearWiseGenProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailPassingWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getAdmissionReportEnrolledAddressWiseGenProg(key) {
    this.reportData = [];
    // this.report =
    //   "/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml";
    this.repository.GetAdmissionReportEnrolledAddressWiseGenProg(key).then(response => {
      this.reportData = response as any;
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: this.reportData as any,
        path: '/assets/Reports/Resource/Admission/admissionReportDetailAddressWise.xml',
        show: true
      });
      // this.$modal.show("report-viewer-eng");
    });
  }
  getMatricMarksReport(data) {
    this.reportData = [];

    this.reportData = data as any;
    this.reportData.forEach(element => {
      element.displayName = this.user.displayName

    });

    // console.log(JSON.stringify(this.reportData));
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: this.reportData as any,
      path: '/assets/Reports/Resource/Admission/student-matric-marks-report.xml',
      show: true
    });
    // this.report =
    //   "/assets/Reports/Resource/Admission/student-matric-marks-report.xml";
    // this.$modal.show("report-viewer-eng");

  }

  getMatricPercReport(data) {
    this.reportData = [];

    this.reportData = data as any;
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: this.reportData as any,
      path: '/assets/Reports/Resource/Admission/student-matric-marks-perc-report.xml',
      show: true
    });

    // this.report =
    //   "/assets/Reports/Resource/Admission/student-matric-marks-perc-report.xml";
    // this.$modal.show("report-viewer-eng");

  }
  getPreAdmissionReport(where) {

    this.reportData = [];
    var key = where + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetPreAdmissionReport(key).then(response => {
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
          this.reportData.forEach(element => {
            element.fromDate =  helper.formateDate(this.fromDate)
            element.toDate =  helper.formateDate(this.toDate)
          });
        }
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Admission/pre-admission-report.xml',
          show: true
        });
      }
    });
  }
  getUndergraduateAdmissionReport(where) {

    this.reportData = [];
    var key = where + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetUndergraduateAdmissionReport(key).then(response => {
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
          this.reportData.forEach(element => {
            element.fromDate =  helper.formateDate(this.fromDate)
            element.toDate =  helper.formateDate(this.toDate)
          });
        }
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Admission/Undergraduate-admission-report.xml',
          show: true
        });
      }
    });
  }
  getRegularAdmissionReport(where) {

    this.reportData = [];
    var key = where + "?" + helper.formateDate(this.fromDate) + "?" + helper.formateDate(this.toDate);
    this.repository.GetRegularAdmissionReport(key).then(response => {
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
          this.reportData.forEach(element => {
            element.fromDate =  helper.formateDate(this.fromDate)
            element.toDate =  helper.formateDate(this.toDate)
            element.toDate =  helper.formateDate(this.toDate)
          });
        }
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: this.reportData as any,
          path: '/assets/Reports/Resource/Admission/regular-admission-report.xml',
          show: true
        });
      }
    });
  }
  getAdmissionAgingReport(data) {
    this.reportData = [];

    this.reportData = data as any;
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: this.reportData as any,
      path: '/assets/Reports/Resource/Admission/AdmissionAgingReport.xml',
      show: true
    });


    // this.report =
    //   "/assets/Reports/Resource/Admission/student-matric-marks-perc-report.xml";
    // this.$modal.show("report-viewer-eng");

  }
  getAdmissionAgingaReport(data) {
    this.reportData = [];

    this.reportData = data as any;
    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: this.reportData as any,
      path: '/assets/Reports/Resource/Admission/AdmissionAgingaReport.xml',
      show: true
    });


    // this.report =
    //   "/assets/Reports/Resource/Admission/student-matric-marks-perc-report.xml";
    // this.$modal.show("report-viewer-eng");

  }

  //*********************************************/
  //*************CHECKERS*************
  generate() {
    if (this.check == "Detail Report Board Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })
      ////where = this.loadParamsEx(where);
      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetAdmissionDetailGen(where)
        .then(r => {
          this.getBoardWiseReport(r)
        })
    } else if (this.check == "Detail Report Passing Year Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })
      //where = this.loadParamsEx(where);
      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetAdmissionDetailGen(where)
        .then(r => {
          this.getPassingYearWiseReport(r)
        })
    } else if (this.check == "Detail report Address Wise") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })
      //where = this.loadParamsEx(where);
      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetAdmissionDetailGen(where)
        .then(r => {
          this.getAddressWiseReport(r)
        })
    } else if (this.check == "Student Matric Marks") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;

      this.paramList.forEach(e => {
        if (e.name.indexOf('EnrollmentNo') >= 0) {
          where = where + " AND LENGTH(COALESCE(" + e.param + ", ''0''))" + e.value;
        } else {
          where = where + " " + e.param + "=''" + e.value + "''";
        }
      })
      //where = this.loadParamsEx(where);
      var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetMatricMarksReport(where)
        .then(r => {
          this.getMatricMarksReport(r)
        })
    } else if (this.check == "Student Marks Percentage") {
      var where = `cv.\"SessionId\" = ''` + this.sessionId + `''`;
      this.paramList.forEach(e => {

        where = where + " " + e.param + "=''" + e.value + "''";

      })
      // //where = this.loadParamsEx(where);
      // var where = where + ` AND cv.\"AdmissionDate\" >= ''` + helper.formateDate(this.fromDate) + `'' AND cv.\"AdmissionDate\" <= ''` + helper.formateDate(this.toDate) + `''`
      this.repository.GetMatricPercReport(where)
        .then(r => {
          this.getMatricPercReport(r)
        })
    }
  }
}
