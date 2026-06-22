import Vue from "vue";
import Component from "vue-class-component";

import Highcharts from "highcharts";
import loadMap from "highcharts/modules/map.js";
import { genComponent } from "vue-highcharts";
import { ISetupProgram, IFeeStudentChallan, IAdmissionAdmissionForm, IRegistrationEnrollments, AdmissionsCount, FeeStudentChallanCount, EnrollmentsCount, StudentPaidCountData } from "../../../application/models";
import { SetupProgramService, AdmissionAdmissionFormService, FeeStudentChallanService, RegistrationEnrollmentsService } from "../../../application/service";
import WidgetBox from "../../widget-box";
import { ContentService } from "../../../services";

loadMap(Highcharts);

@Component({
  template: require("./index.html"),
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    Highmaps: genComponent("Highmaps", Highcharts),
    'widget-box': WidgetBox
  }
})
export class FormCollectionWidgetCp extends Vue {

  private svc: ContentService = null;
  private admissionRepository: AdmissionAdmissionFormService;
  private FeeChallanrepository: FeeStudentChallanService = null;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  private paidData: Array<StudentPaidCountData> = [];
  private data: Array<IAdmissionAdmissionForm> = [];
  private EnrollData: Array<IRegistrationEnrollments> = [];
  private admissionCount: number = 0;
  private paidChallanCount: number = 0;
  private EnrollmentCount: number = 0;
  private feeCount: number = 0;
  private totalCount: number = 0;
  private percentageCountA: number = 0;
  private percentageCountB: number = 0;
  private lastPeriodActual: number = 0;
  private lastPeriodBudgeted: number = 0;
  private check: string = "";

 

  created() {
    this.admissionRepository = new AdmissionAdmissionFormService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);

  }

  refreshData() {

    this.paidData = [];
    this.feeCount = 0;
    this.totalCount = 30000;
    this.percentageCountA = 0;
    this.percentageCountB = 0;
    this.lastPeriodActual = 19104;
    this.lastPeriodBudgeted = 21000;
    this.FeeChallanrepository.GetStudentPaidCount()
      .then(response => {
        this.paidData = (response as Array<StudentPaidCountData>)
        this.feeCount = this.paidData[0].feeCount;
        this.percentageCountA = (this.feeCount / 19104) * 100;
        this.percentageCountB = (this.feeCount / 21000) * 100;
      });
  }

 



  mounted() {
    this.refreshData();



   
  }




}
