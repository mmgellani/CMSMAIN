import Vue from "vue";
import Component from "vue-class-component";
import { validationMixin } from "vuelidate";
import { IFeeStudentFeeStructure } from "../../../../models/Fee/StudentFeeStructure";
import {
  FeeStudentFeeStructureService,
  SetupClassService
} from "../../../../service";
import { ISetupClass } from "../../../../models/Setup/Class";
import { FeeFeeHeadService } from "../../../../service/Fee/FeeHead";
import { IFeeFeeHead } from "../../../../models";
import { FeeConcessionDetailService } from "../../../../service/Fee/ConcessionDetail";
import { IFeeConcessionDetailVM } from "../../../../models/Fee/ConcessionDetail";
import { PayloadMessageTypes } from "../../../../../../model";
import { StoreTypes } from "../../../../../../store";
import { ReportEngine } from "../../../../../../components/report/report-engine";
import { AdmissionReports } from "../../../Reports/AdmissionReports/index";
import { ReportsService } from "../../../../service/Reports/AdmissionReports";
import { FeeStudentChallanService } from "../../../../service/Fee/StudentChallan";

@Component({
  mixins: [validationMixin],
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    // "report-engine": ReportEngine
  }
})
export class CustomFeeEdit extends Vue {
  private tempModel: IFeeStudentFeeStructure = {
    studentFeeStructureId: "",
    admissionFormId: "",
    classId: "",
    installmentNo: 1,
    feeHeadId: "",
    feeAmount: 0,
    concessionDetailId: "",
    payableAmount: 0,
    statusId: 1,
    loggerId: ""
  };
  private service: FeeStudentFeeStructureService;
  private model: Array<IFeeStudentFeeStructure>;
  private amount: number = 0;
  private classService: SetupClassService;
  private classModel: Array<ISetupClass> = [];
  private classid: string = "";
  private feeheadService: FeeFeeHeadService;
  private feeheadModel: Array<IFeeFeeHead> = [];
  private feeHead: string = "";
  private concessionService: FeeConcessionDetailService;
  private concessionModel: Array<IFeeConcessionDetailVM> = [];
  private installment: number = 0;
  private admissionFormId = "";
  private reportService: FeeStudentChallanService;
  private reportData: any = [];
  private report: String = "";
  created() {
    this.service = new FeeStudentFeeStructureService(this.$store);
    this.classService = new SetupClassService(this.$store);
    this.feeheadService = new FeeFeeHeadService(this.$store);
    this.loadClass();
    this.loadFeeHead();
  }

  beforeModalOpen(event) {
    this.admissionFormId = event.params.admissionFormId;
    // Object.assign(this.admissionFormId, id.params.admissionFormId) as;
  }

  loadFeeHead() {
    this.feeheadService
      .GetFindBy('e=>e.StatusId==1')
      .then(response => (this.feeheadModel = response as Array<IFeeFeeHead>));
  }

  loadClass() {
    this.classService
      .GetFindBy('e=>e.StatusId==1')
      .then(response => (this.classModel = response as Array<ISetupClass>));
  }

  save() {
    this.tempModel.studentFeeStructureId = this.genGuid();
    this.tempModel.admissionFormId = this.admissionFormId;
    this.tempModel.classId = this.classid;
    this.tempModel.feeHeadId = this.feeHead;
    this.tempModel.feeAmount = this.amount;
    this.tempModel.payableAmount = this.amount;
    this.tempModel.installmentNo = this.installment;
    this.tempModel.statusId = 1;
    this.tempModel.loggerId = this.genGuid();
    this.service.AddOne(this.tempModel).then(() => {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record has been inserted successfully",
        title: "Success",
        messageTypeId: PayloadMessageTypes.success
      });
      this.cancel();
    });
  }

  genGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  cancel() {
    this.$modal.hide("add-edit-model");
    this.$emit("submit");
  }
}
