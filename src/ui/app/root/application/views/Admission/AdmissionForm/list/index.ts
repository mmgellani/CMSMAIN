/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser, PayloadMessageTypes } from "../../../../../../model";
import { IRootStoreState, RootStoreTypes } from "../../../../../store";

import {
  IAdmissionAdmissionForm,
  ISetupCampus,
  ISetupSession,
  ISetupCampusProgramLinkVM,
  IAdmissionAdmissionFormVM,
  IAdmissionAdmissionFormCplVM,
  ICampusCityVM,
  DDLGroupModel,
  DDLModel,
  IExaminationExamDetailVM,
  IFeeSubinstallmentVM,
  IGetStudentsVM,
  IAdmissionAdmissionFormCpl4VM,
  ISetupCampusProgramVM,
  ISetupProgram
} from "../../../../models";
import {
  AdmissionAdmissionFormService,
  SetupCampusService,
  SetupSessionService,
  SetupProgramDetailsService,
  SetupCampusProgramLinkService,
  ExaminationExamDetailService,
  FeeStudentChallanService,
  FeeConcessionDetailService,
  SetupProgramService
} from "../../../../service";

import { AdmissionAdmissionFormAddEdit } from "../add-edit";
import { AdmissionAdmissionFormDelete } from "../delete";
import { StoreTypes } from "../../../../../../store";
// import { ReportEngine } from '../../../../../../components/report/report-engine';
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { FeeStudentChallanAddEdit } from "../../../Fee/StudentChallan/add-edit";
import { FeeStudentChallanApplyConcession } from "../../../Fee/StudentChallan/apply-concession";
import { FeeStudentSubInstallmentAddEdit } from "../../../Fee/SubInstallment/add-edit";
import { FeeStudentExemptionAddEdit } from "../../../Fee/FeeExemption/add-edit";
import { Helper } from "../../../Fee/Helper";

import * as hlp from "../../../../helper";
import { GroupModel, GeneralModel } from "../../../../models/general";
import { IVWCampusBaseProgram } from "../../../../models/Setup/CampusBaseProgram";

@Component({
  name: "models-form-list",
  template: require("./index.html"),
  components: {
    "add-edit-model": AdmissionAdmissionFormAddEdit,
    "delete-model": AdmissionAdmissionFormDelete,
    // // "report-engine": ReportEngine,
    "student-challan-add-edit-model": FeeStudentChallanAddEdit,
    "apply-concession-model": FeeStudentChallanApplyConcession,
    "student-sub-installment-add-edit-model": FeeStudentSubInstallmentAddEdit,
    "fee-student-exemption-add-edit-model": FeeStudentExemptionAddEdit,
    "helper-modal": Helper
  }
})
export class AdmissionAdmissionFormList extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private studentInfo: any = {};
  private indexId: number = 0;
  private locck: boolean = false;
  private programRepository: SetupProgramService;
  private programList: Array<IVWCampusBaseProgram> = [];
  private repository: AdmissionAdmissionFormService;
  private studentExemptionRepository: FeeStudentChallanService;
  private reportRepo: ReportsService;
  private data: Array<IAdmissionAdmissionFormCpl4VM> = [];
  private filterString: string = "";
  private programSRepo: SetupProgramService = new SetupProgramService(this.$store);

  private campusId = "";
  private programId = "";
  private sessionId = "";
  private campusProgramId = "";
  private reportDate: any = [];
  private report: String = "";

  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusCityList: Array<ICampusCityVM> = [];

  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];

  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private sessionRepo: SetupSessionService = new SetupSessionService(
    this.$store
  );
  private programDetailRepo: SetupProgramDetailsService = new SetupProgramDetailsService(
    this.$store
  );

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
  private programDDL: Array<DDLGroupModel> = []
  private ddl: Array<DDLModel> = []
  ischecked = false;

  private examDetailModel: Array<IExaminationExamDetailVM> = [];
  private repositoryExamDetail: ExaminationExamDetailService;
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)


  private Challandata: Array<IFeeSubinstallmentVM> = [];
  private studentChallanRepository: FeeStudentChallanService;
  private modelVM: Array<IFeeSubinstallmentVM> = [];

  private datas: Array<IGetStudentsVM> = [];
  private concessionRepository: FeeConcessionDetailService;
  private programData: Array<ISetupProgram> = [];

  private subInstallmentRepository: FeeStudentChallanService;
  childKey: string = "";
  title: string = "";

  private columns = [
    { key: "refferenceNo", caption: "Reference No.", sort: true },
    { key: "rollNo", caption: "Roll No.", sort: true },
    { key: "fullName", caption: "Student Name" },
    { key: "formNo", caption: "Form No" },
    { key: "fatherName", caption: "Father Name" },
    { key: "admissionStatus", caption: "Status", sort: true },
    { key: "action", caption: "Action", width: 150 }
  ];

  created() {
    this.programRepository = new SetupProgramService(this.$store);
    this.repository = new AdmissionAdmissionFormService(this.$store);
    this.studentChallanRepository = new FeeStudentChallanService(this.$store);
    this.concessionRepository = new FeeConcessionDetailService(this.$store);
    this.subInstallmentRepository = new FeeStudentChallanService(this.$store);
    this.studentExemptionRepository = new FeeStudentChallanService(this.$store);

    // this.loadCampus();
    this.loadSession();
    //this.$watch('campusId', this.loadProgramsOfCampus);

    this.title = "";

    // this.loadCityCampus();
    this.reportRepo = new ReportsService(this.$store);
    this.repositoryExamDetail = new ExaminationExamDetailService(this.$store);

    //this.$watch(() => this.childKey, e => { this.getAdmissionSlip(this.childKey) });

    this.$store.dispatch(RootStoreTypes.reportOperation, {
      data: null,
      path: "",
      show: false
    });
  }

  loadProgram() {
    this.programId = "";
    this.campusProgramId = "";
    this.programData = [];
    this.repository.GetFindByProgram('e => e.StatusId!=2')
      .then(response => this.programData = (response as Array<ISetupProgram>));
  }

  loadPrograms() {
    this.programId = "";
    this.campusProgramId = "";
    this.programList = [];
    this.programSRepo.ProgramByCampus('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.SessionId.ToString()=="' + this.sessionId + '"')
      .then(r => {
        this.programList = r as Array<IVWCampusBaseProgram>
      })
  }

  cities = [];
  loadCities(city) {
    if (this.campusCityList) {
      if (this.campusCityList.length > 0) {
        return this.campusCityList.filter(e => e.cityName == city);
      }
    }
  }

  private campusSubCityModel: Array<GroupModel> = [];
  private termModel: Array<GeneralModel> = [];

  loadCityCampus() {
    this.campusddl = [];
    this.cityDDL = [];
    this.campusId = "";
    this.programId = "";
    this.campusProgramId = "";
    let oldObj: ICampusCityVM;
    if (this.sessionId.length > 0) {
      this.campusRepo.GetCityVM().then(r => {
        this.campusSubCityModel = r;
      });
    }

  }
  loadSession() {
    this.campusId = "";
    this.programId = "";
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.termModel = r;
    });
  }

  mounted() {
    this.validatePage();
  }
  // loadProgramsOfCampus() {
  //   this.campusProgramId = "";
  //   this.ddl = [];
  //   this.programDDL = [];
  //   this.campusProgramLinkList = [];
  //   let oldObj: ISetupCampusProgramVM;
  //   if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programId) {
  //     var key = this.sessionId + "?" + this.campusId + "?" + this.programId;
  //     this.campusProgramLinkRepo.ProgDetailByProgram(key).then(r => {
  //       debugger
  //       this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
  //       this.campusProgramLinkList = this.campusProgramLinkList.filter(f => f.programId === this.programId);
  //       this.refreshDatabyProgram();
  //     });
  //   }

  // }

  loadProgramsOfCampus() {
    this.campusProgramId = ""; 
    this.ddl = [];
    this.programDDL = [];
    this.campusProgramLinkList = [];
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
      this.refreshDatabyProgram();
    }
  }

  getExamDetail() {
    this.examDetailModel = [];
    this.repositoryExamDetail
      .GetFindBy("e => e.StatusId!=2")
      .then(
        response =>
          (this.examDetailModel = response as Array<IExaminationExamDetailVM>)
      );
  }

  getAdmissionSlip(sessionId, campusId, admissionFormId, refferenceNo) {
    // console.log(refferenceNo)
    var z = refferenceNo.split("");

    var key = sessionId + "?" + campusId + "?" + admissionFormId;
    this.reportRepo.GetAllAdmissionSlipEx(key).then(response => {
      var arr = response as any
      arr.forEach(element => {
        element.percentage = (+element.obtained) / (+element.total) * 100

      });
      // console.log(arr)
      this.$store.dispatch(RootStoreTypes.reportOperation, {
        data: arr,
        path: "assets/Reports/Resource/Admission/admissionReport.xml",
        show: true
      });
    });

    // if (z.length > 0) {
    //   if (z[0] == "S") {
    //     var key = sessionId + "?" + campusId + "?" + student;
    //     this.reportRepo.GetAdmissionSlip(key).then(response => {
    //       this.$store.dispatch(RootStoreTypes.reportOperation, {
    //         data: response as any,
    //         path: "assets/Reports/Resource/Admission/Scholorship_Report.xml",
    //         show: true
    //       });
    //     });
    //   } else {
    //     var key = sessionId + "?" + campusId + "?" + student;
    //     this.reportRepo.GetAdmissionSlip(key).then(response => {
    //       var arr = response as any
    //       arr.forEach(element => {
    //         element.percentage = Math.round((+element.obtained) / (+element.total) * 100)

    //       });
    //       // console.log(arr)
    //       this.$store.dispatch(RootStoreTypes.reportOperation, {
    //         data: arr,
    //         path: "assets/Reports/Resource/Admission/admissionReport.xml",
    //         show: true
    //       });
    //     });
    //   }
    // }
  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("admissionAdmissionForm" in this.user.claims == true) {
        if (this.user.claims["admissionAdmissionForm"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["admissionAdmissionForm"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["admissionAdmissionForm"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["admissionAdmissionForm"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

  refreshData(params) {
    //this.loadProgramsOfCampus();

    // if (params.report) {
    //   this.$store.dispatch(RootStoreTypes.reportOperation, {
    //     data: params.data as any,
    //     path: params.report,
    //     show: true
    //   });
    // }

    this.data = [];
    if (this.sessionId.length > 0 && this.campusId.length > 0) {
      var key = this.sessionId + "?" + this.campusId;
      this.repository.GetAllVM(key).then(response => {
        //setTimeout(this.loadProgramsOfCampus,5)
        this.data = response as Array<IAdmissionAdmissionFormCpl4VM>;
      });
    }

  }

  refreshDatabyProgram() {
    this.data = [];
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programId.length && this.campusProgramId.length > 0) {
      var key = this.sessionId + "?" + this.campusId + '?' + this.campusProgramId;
      this.repository.GetAllVMByProgram(key).then(response => {
        this.data = response as (Array<IAdmissionAdmissionFormCpl4VM>);
      });
    }
    else if (this.sessionId.length > 0 && this.campusId.length > 0 && this.programId.length > 0 && this.campusProgramId.length == 0) {
      var key = this.sessionId + "?" + this.campusId + '?' + this.programId;
      this.repository.GetAllVMBySelectedProgram(key).then(response => {
        this.data = response as (Array<IAdmissionAdmissionFormCpl4VM>);
      });
    }
  }


  refreshData2() {
    this.refreshDatabyProgram();
    // if (this.ischecked == true) {
    //   this.refreshDatabyProgram();
    // }
    // else {
    //   this.refreshData('5');
    // }
  }

  insertModel() {
    //lock the program and campus in edit Admisson Form
    this.locck = false;
    if (this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0) {
      this.$modal.show("add-edit-model", {
        model: {
          admissionFormId: "",
          campusProgramId: this.campusProgramId,
          studentId: "",
          admissionTypeId: "0becb36d-3cfb-49ac-ad3e-9af692a1a558",
          rollNo: "",
          refferenceNo: "",
          academicInfo: "",
          statusId: 0,
          loggerId: ""
        },

        IsNewRecord: true,
        sessionId: this.sessionId,
        campusId: this.campusId,
        campusProgramId: this.campusProgramId,

        LOCK: this.locck


      });
    }
    else {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Please Select Session and Campus and Program",
        title: "Success",
        messageTypeId: PayloadMessageTypes.error
      })



    }
  }

  editModel(model: IAdmissionAdmissionFormCpl4VM) {
    debugger
    //lock the program and campus in edit Admisson Form
    this.locck = false;
    if (model.admissionStatus == 'Enrolled' || model.admissionStatus == 'Fee Paid') {
      this.locck = true;
    }
    else {

      this.locck = false;
    }


    this.$modal.show("add-edit-model", {
      model: model,
      IsNewRecord: false,
      sessionId: this.sessionId,
      campusId: this.campusId,
      campusProgramId: this.campusProgramId,
      LOCK: this.locck
    });
  }

  deleteModel(model: IAdmissionAdmissionForm) {
    this.$modal.show("delete-model", { model: model });
  }

  feePreviewModel(referenceNo: string) {
    this.Challandata = [];
    this.studentChallanRepository.GetFeeByRefrenceNo(referenceNo).then(res => {
      this.Challandata = res as Array<IFeeSubinstallmentVM>;

      Object.assign(this.modelVM, this.Challandata);
      this.report = "assets/Reports/Resource/Admission/Report1.xml";
      // this.$modal.show("report-viewer-eng");
      this.$modal.show("student-challan-add-edit-model", {
        modelVM: this.modelVM
      });
    });
  }

  concessionModel(referenceNo: string) {
    this.datas = [];
    this.concessionRepository.StudentByRef(referenceNo).then(res => {
      this.datas = res as Array<IGetStudentsVM>;

      Object.assign(this.modelVM, this.datas);
      this.$modal.show("apply-concession-model", { modelVM: this.modelVM });
    });
  }
  installmentModel(referenceNo: string) {
    debugger;
    this.Challandata = [];
    this.subInstallmentRepository.GetFeeByRefrenceNo(referenceNo).then(res => {
      this.Challandata = res as Array<IFeeSubinstallmentVM>;

      Object.assign(this.modelVM, this.Challandata);
      this.$modal.show("student-sub-installment-add-edit-model", {
        modelVM: this.modelVM
      });
    });
  }

  feeExemptionModel(referenceNo: string) {
    this.Challandata = [];
    this.studentExemptionRepository
      .GetFeeByRefrenceNo(referenceNo)
      .then(res => {
        this.Challandata = res as Array<IFeeSubinstallmentVM>;

        Object.assign(this.modelVM, this.Challandata);

        this.$modal.show("fee-student-exemption-add-edit-model", {
          sessionid: this.sessionId,
          campusid: this.campusId,
          modelVM: this.modelVM
        });
      });
  }

  helper(dta) {

    this.$store.dispatch(RootStoreTypes.changeFeeStudentInfo, dta);

    this.studentInfo = dta;
    this.$modal.show("helper-modal");
  }

  fireChallan(params) {
    if (params) {
      if (params.report) {
        this.$store.dispatch(RootStoreTypes.reportOperation, {
          data: params.data as any,
          path: params.report,
          show: true
        });
      }
    }
  }
}
