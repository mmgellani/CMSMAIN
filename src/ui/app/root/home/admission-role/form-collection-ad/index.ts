import Vue from "vue";
import Component from "vue-class-component";

import Highcharts from "highcharts";
import loadMap from "highcharts/modules/map.js";
import { genComponent } from "vue-highcharts";
import { ISetupProgram, IFeeStudentChallan, IAdmissionAdmissionForm, IRegistrationEnrollments, FeeStudentChallanCount, AdmissionsCount, EnrollmentsCount } from "../../../application/models";
import { SetupProgramService, AdmissionAdmissionFormService, FeeStudentChallanService, RegistrationEnrollmentsService } from "../../../application/service";
import WidgetBox from "../../widget-box";

loadMap(Highcharts);

@Component({
  template: require("./index.html"),
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    Highmaps: genComponent("Highmaps", Highcharts),
    'widget-box': WidgetBox
  }
})
export class FormCollectionWidgetAd extends Vue {
 

  private admissionRepository: AdmissionAdmissionFormService;
  private FeeChallanrepository: FeeStudentChallanService = null;
  private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
  private paidData: Array<FeeStudentChallanCount> = [];
  private data: Array<AdmissionsCount> = [];
  private EnrollData: Array<EnrollmentsCount> = [];
  // private paidData: Array<IFeeStudentChallan> = [];
  // private data: Array<IAdmissionAdmissionForm> = [];
  // private EnrollData: Array<IRegistrationEnrollments> = [];
  private admissionCount: number = 0;
  private paidChallanCount: number = 0;
  private enrollmentCount: number = 0;
  private date : Date = new Date();
  private datestring = '';


  created() {
    this.admissionRepository = new AdmissionAdmissionFormService(this.$store);
    this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
  }

  refreshData() {
    this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);
     this.admissionWidgetData();
  }

  admissionWidgetData() {
    this.data = [];
    this.paidData = [];
    this.EnrollData = [];
    this.admissionCount = 0;
    this.paidChallanCount = 0;
    this.enrollmentCount = 0;
    this.admissionRepository.GetAdmissionDateWise(this.datestring)
      .then(r => {
        this.data = r.admissionForm as Array<AdmissionsCount>;
        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
        this.admissionCount = this.data[0].admissionCount;
        this.paidChallanCount = this.paidData[0].paidChallanCount;
         this.enrollmentCount = this.EnrollData[0].enrollmentCount;


        // this.data = r.admissionForm as Array<IAdmissionAdmissionForm>;
        // this.paidData = r.studentChallan as Array<IFeeStudentChallan>;
        // this.EnrollData = r.enrollments as Array<IRegistrationEnrollments>;

        // this.admissionCount = this.data.length;
        // this.paidChallanCount = this.paidData.length;
        // this.EnrollmentCount = this.EnrollData.length;
      })
  }



  mounted() {
    this.refreshData();

  }




}
