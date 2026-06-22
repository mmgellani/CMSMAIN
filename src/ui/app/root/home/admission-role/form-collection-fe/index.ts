import Vue from "vue";
import Component from "vue-class-component";

import Highcharts from "highcharts";
import loadMap from "highcharts/modules/map.js";
import { genComponent } from "vue-highcharts";
import { ISetupProgram, IFeeStudentChallan, IAdmissionAdmissionForm, IRegistrationEnrollments, IStudentFeeCountVM } from "../../../application/models";
import { SetupProgramService, AdmissionAdmissionFormService, FeeStudentChallanService, RegistrationEnrollmentsService } from "../../../application/service";
import WidgetBox from "../../widget-box";
import { PublicVWDashBoardVMService } from "../../../application/service/DashBoard/DashBoard";

loadMap(Highcharts);

@Component({
  template: require("./index.html"),
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    Highmaps: genComponent("Highmaps", Highcharts),
    'widget-box': WidgetBox
  }
})
export class FormCollectionWidgetFe extends Vue {


  public model: Array<IStudentFeeCountVM> = [];
  public data: Array<IStudentFeeCountVM> = [];
  public service: PublicVWDashBoardVMService = null;
  private shift: string = "Morning";
  private paidAmount: string = '';
  private average: string = '';
  private totalStudents = 0;



  created() {
    this.service = new PublicVWDashBoardVMService(this.$store);
  }

  refreshData() {
    this.totalStudents = 0;
    this.model = [];
    this.data = [];
    // alert(JSON.stringify(this.shift))
    this.service.GetFeeCount().then(response => {
      this.model = (response as Array<IStudentFeeCountVM>);
      this.data = this.model.filter(e => e.shift == this.shift)
      this.totalStudents = this.data[0].totalStudents;
      this.paidAmount = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 }).format(this.data[0].paidAmount)
      this.average = new Intl.NumberFormat('en-us', { minimumFractionDigits: 0 }).format(this.data[0].average)

    });
  }





  mounted() {
    this.refreshData();

  }




}
