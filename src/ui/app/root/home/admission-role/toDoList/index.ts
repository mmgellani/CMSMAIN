import Vue from "vue";
import Component from "vue-class-component";

import Highcharts from "highcharts";
import loadMap from "highcharts/modules/map.js";
import { genComponent } from "vue-highcharts";
import { ISetupProgram, IFeeStudentChallan, IAdmissionAdmissionForm, IRegistrationEnrollments, AdmissionsCount, FeeStudentChallanCount, EnrollmentsCount, ISetupCity, ISetupSubCity } from "../../../application/models";
import { SetupProgramService, AdmissionAdmissionFormService, FeeStudentChallanService, RegistrationEnrollmentsService, SetupCityService, SetupSubCityService } from "../../../application/service";
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
export class ToDoListWidget extends Vue {


  //TO do code
  private toDoList = [{ name: 'one', isDone: false }, { name: 'two', isDone: false }];
  listItem = ''

  insertToList() {
    this.toDoList.push({ name: this.listItem, isDone: false });
  }

  created() {

  }



  mounted() {


  }




}
