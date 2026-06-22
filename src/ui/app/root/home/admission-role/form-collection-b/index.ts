import Vue from "vue";
import Component from "vue-class-component";

import Highcharts from "highcharts";
import loadMap from "highcharts/modules/map.js";
import loadDrilldown from "highcharts/modules/drilldown.js";

import { genComponent } from "vue-highcharts";
import { ISetupProgram } from "../../../application/models/Setup/Program";
import { SetupProgramService } from "../../../application/service";
import { IPublicVWDashBoardVM } from "../../../application/models";
import { PublicVWDashBoardVMService } from "../../../application/service/DashBoard/DashBoard";
import collapsibleWidget from '../../../../components/collapsibleWidget';

import * as chartPerser from '../index';

loadMap(Highcharts);
loadDrilldown(Highcharts);

@Component({
  template: require("./index.html"),
  components: {
    Highcharts: genComponent("Highcharts", Highcharts),
    collapsibleWidget
  }
})
export class FormCollectionBarWidget extends Vue {

  public model: Array<IPublicVWDashBoardVM> = [];
  public service: PublicVWDashBoardVMService = null;

  private isProcessed: boolean = false;

  created() {
    this.isProcessed = false;
    this.service = new PublicVWDashBoardVMService(this.$store);
  }

  mounted() {
    this.isProcessed = false;
    this.getData();
  }

  sum(items, property) {
    return items.reduce((a, b) => {
      return a + b[property];
    }, 0)
  }

  getData() {

    this.isProcessed = false;
    this.service.GetAll().then(response => {
      this.model = (response as Array<IPublicVWDashBoardVM>);
      this.options = chartPerser.getChartJson(this.model, 'column');
      this.isProcessed = true;
    });
  }
  options = {
    title: { text: "" },
    colors:
      ['#39B54A', '#25ABE2', '#262262', '#9F1F63', '#5A4A42', '#BF1E2D', '#F7941D', '#FFF200', '#EE207C', '#27368E']  
    ,
  };
}
