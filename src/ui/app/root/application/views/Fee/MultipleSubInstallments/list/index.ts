/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import { State } from "vuex-class";
import Component from "vue-class-component";

import { IUser } from "../../../../../../model";
import { IRootStoreState } from "../../../../../store";

import {
  IFeeStudentChallan,
  IFeeStudentChallanVM,
  IFeeStudentFeeStructureVM,
  ISetupCampus,
  ISetupSession,
  DDLGroupModel,
  DDLModel,
  ISetupCampusProgramVM,
  IFeeSubinstallmentVM,
  ICampusCityVM,
  IGetStudentsVM
} from "../../../../models";
import {
  FeeStudentChallanService,
  FeeStudentFeeStructureService,
  SetupCampusService,
  SetupSessionService,
  SetupCampusProgramLinkService,
  FeeConcessionDetailService
} from "../../../../service";

import { FeeStudentChallanAddEdit } from "../add-edit";
import { FeeStudentChallanDelete } from "../delete";
import { FeeStudentChallanApplyConcession } from "../apply-concession";
import { FeeStudentSubInstallmentAddEdit } from "../../SubInstallment/add-edit";
import { FeeStudentExemptionAddEdit } from "../../feeExemption/add-edit";


@Component({
  name: "feeSubInstallment",
  template: require("./index.html"),
  components: {
    "student-challan-add-edit-model": FeeStudentChallanAddEdit,
    "delete-model": FeeStudentChallanDelete,
    "student-sub-installment-add-edit-model": FeeStudentSubInstallmentAddEdit,
    "fee-student-exemption-add-edit-model": FeeStudentExemptionAddEdit,
    "apply-concession-model": FeeStudentChallanApplyConcession
  }
})
export class FeeMultipleSubInstallments extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;

  private repository: FeeStudentChallanService;
  private concessionRepository: FeeConcessionDetailService;
  private feeRepository: FeeStudentChallanService;
  private Campusepository: SetupCampusService = null;
  private Sessionrepository: SetupSessionService;
  private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
  private StudentFeerepository: FeeStudentFeeStructureService;
  private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
  private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);

  private data: Array<IFeeStudentFeeStructureVM> = [];
  private datas: Array<IGetStudentsVM> = [];
  private searchdata: Array<IFeeStudentFeeStructureVM> = [];
  private Tempdata: Array<IFeeStudentFeeStructureVM> = [];
  private campusList: Array<ISetupCampus> = [];
  private sessionList: Array<ISetupSession> = [];
  private campusId: string = "";
  private sessionId: string = "";
  private campusProgramId: string = "";

  private modelVM: Array<IFeeSubinstallmentVM> = [];
  private programDDL: Array<DDLGroupModel> = [];
  private ddl: Array<DDLModel> = [];

  private campusCityList: Array<ICampusCityVM> = [];

  private cityDDL: Array<DDLGroupModel> = [];
  private campusddl: Array<DDLModel> = [];

  private ChallanNoList: Array<String> = [];
  private TempChallandata: Array<IFeeStudentChallan> = [];
  private iData: Array<IFeeSubinstallmentVM> = [];
  private RefrenceNo: string = '';
  private studentName: string = '';
  private exemptionAmount: number = 0;
  private program: string = '';

  private Challandata: Array<IFeeSubinstallmentVM> = [];
  private filterString: string = "";

  private canRead: boolean = false;
  private canAdd: boolean = false;
  private canEdit: boolean = false;
  private canDelete: boolean = false;
  private search = '';
  private columns = [
    { key: "refferenceNo", caption: "ReferenceNo" },
    { key: "fullName", caption: "StudentName" },
    { key: "fatherName", caption: "ParentName" },
    { key: "description", caption: "Program" },
    // { key: 'statusId', caption: 'Status'  },
    { key: "action", caption: "Action", width: 120 }
  ];

  created() {
    this.concessionRepository = new FeeConcessionDetailService(this.$store);
    this.feeRepository = new FeeStudentChallanService(this.$store);
    this.repository = new FeeStudentChallanService(this.$store);
    this.StudentFeerepository = new FeeStudentFeeStructureService(this.$store);
    this.Campusepository = new SetupCampusService(this.$store);
    this.Sessionrepository = new SetupSessionService(this.$store);
    // this.getCampus();
    this.getSession();
    // this.$watch('sessionId', this.loadCityCampus);
    // this.$watch('campusId', this.loadProgramsOfCampus);
    // this.$watch('campusProgramId', this.GetAllFilterData)
  }

  mounted() {
    this.validatePage();
  }
  find() {
    this.StudentFeerepository.SearchStudent(this.search + '?' + this.user.userId)
      .then(r => {
        this.searchdata = r as Array<IFeeStudentFeeStructureVM>
      })
  }
  getCampus() {
    // this.Campusepository.GetFindBy("e=>e.StatusId==1").then(res => {
    //   this.campusList = res as Array<ISetupCampus>;
    // });
    this.loadCityCampus();
  }

  getSession() {
    this.Sessionrepository.GetFindBy("e=>e.StatusId==1").then(res => {
      this.sessionList = res as Array<ISetupSession>;
    });
  }

  loadCityCampus() {
    if (this.sessionId.length > 0) {
      this.campusddl = [];
      this.cityDDL = [];
      let oldObj: ICampusCityVM;
      this.campusRepo.GetCityVM().then(r => {
        this.campusCityList = r as Array<ICampusCityVM>;
      });
    }

  }

  loadProgramsOfCampus() {
    if (this.campusId.length > 0) {
      this.ddl = [];
      this.programDDL = [];
      let oldObj: ISetupCampusProgramVM;
      var key = this.sessionId + "?" + this.campusId;
      this.campusProgramLinkRepo.GetAllVM(key).then(r => {
        this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
      });
    }

  }

  validatePage() {
    if (this.user.roles.indexOf("admin") >= 0) {
      this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
    } else {
      if ("mulitplesubinstallments" in this.user.claims == true) {
        if (this.user.claims["mulitplesubinstallments"].indexOf("R") >= 0) {
          this.canRead = true;
        }
        if (this.user.claims["mulitplesubinstallments"].indexOf("C") >= 0) {
          this.canAdd = true;
        }
        if (this.user.claims["mulitplesubinstallments"].indexOf("U") >= 0) {
          this.canEdit = true;
        }
        if (this.user.claims["mulitplesubinstallments"].indexOf("D") >= 0) {
          this.canDelete = true;
        }
      } else {
        this.$router.push("Home");
      }
    }
  }

//  refreshData () {
//     this.data = [];
//     this.StudentFeerepository.GetAllVM().then(res => {
//       this.data = res as Array<IFeeStudentFeeStructureVM>;
//     });
//   }

  insertModel() {
    this.$modal.show("student-challan-add-edit-model", {
      model: {
        studentChallanId: "",
        admissionFormId: "",
        classId: "",
        installmentNo: 0,
        challanNo: "",
        feeAmount: 0,
        dueDate: new Date(),
        paidDate: new Date(),
        statusId: 0,
        loggerId: ""
      },
      IsNewRecord: true
    });
  }

  editModel(referenceNo: string) {
    this.Challandata = [];
    this.repository.GetFeeByRefrenceNo(referenceNo).then(res => {
      this.Challandata = res as Array<IFeeSubinstallmentVM>;

      Object.assign(this.modelVM, this.Challandata);

      this.$modal.show("student-challan-add-edit-model", { modelVM: this.modelVM });
    });
  }

  installmentModel(referenceNo: string) {
    this.Challandata = [];
    this.repository.GetFeeByRefrenceNo(referenceNo)
      .then(res => {
        this.Challandata = res as Array<IFeeSubinstallmentVM>

        Object.assign(this.modelVM, this.Challandata)
        this.$modal.show("student-sub-installment-add-edit-model", { modelVM: this.modelVM })
      })
  }
  feeExemptionModel(referenceNo: string) {
    this.Challandata = [];
    this.repository.GetFeeByRefrenceNo(referenceNo).then(res => {
      this.Challandata = res as Array<IFeeSubinstallmentVM>;

      Object.assign(this.modelVM, this.Challandata);

      this.$modal.show("fee-student-exemption-add-edit-model", {
        sessionid: this.sessionId,
        campusid: this.campusId,
        modelVM: this.modelVM
      });
    });
  }

  concessionModel(referenceNo: string) {
    this.datas = [];
    this.concessionRepository.StudentByRef(referenceNo)
      .then(res => {
        this.datas = res as Array<IGetStudentsVM>

        Object.assign(this.modelVM, this.datas)
        this.$modal.show("apply-concession-model", { modelVM: this.modelVM })
      })
  }


  GetAllFilterData() {
    if (this.campusProgramId.length > 0) {
      var ProgramDetialid = this.campusProgramLinkList.find(
        s => s.sessionId == this.sessionId && s.campusId == this.campusId && s.campusProgramId == this.campusProgramId).programDetailId;
      var key = this.sessionId + "," + this.campusId + "," + ProgramDetialid;
      this.StudentFeerepository.GetAllFilterData(key).then(res => {
        this.data = res as Array<IFeeStudentFeeStructureVM>;
      });
    }

  }
  deleteModel(model: IFeeStudentChallan) {
    this.$modal.show("delete-model", { model: model });
  }
}
