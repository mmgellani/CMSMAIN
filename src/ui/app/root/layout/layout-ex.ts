import Vue from "vue";
import Component from "vue-class-component";
import { State, Action } from "vuex-class";
import { TokenExpiry, ReportEngine, DashboardWidget } from "../../components";

import { AreaFooter } from "./footer/footer";
import { AreaSidebar } from "./navigation/sidebar";
import { AreaHeader } from "./header";
import { MobileArea } from "./mobile";

import { RootStoreTypes, IRootStoreState } from "../store";

@Component({
  components: {
    AreaSidebar,
    TokenExpiry,
    AreaHeader,
    AreaFooter,
    MobileArea,
    "report-engine": ReportEngine,
    "dashboard-widget": DashboardWidget
  },
  template: require("./layout-ex.html")
})
export class AreaLayoutEx extends Vue {
  @State((state: IRootStoreState) => state.reportOperation) report: ReportModel;
  dashboardVisible: boolean = false;
  viewCard = "";

  created() {
     

    this.$watch("report", this.reportOperation, { deep: true });

    this.$store.dispatch(RootStoreTypes.reportOperation, { data: null, path: '', show: false });
    // this.openDashboardWidget();
  }

  setAnswer(answer) {
    this.viewCard = answer;
  }

  openDashboardWidget() {
    this.dashboardVisible = true;
  }

  closeDashboardWidget() {
    this.dashboardVisible = false;
  }

  toggleDashboardWidget(event) {
    if (event) {
      this.openDashboardWidget();
    }
    else {
      this.closeDashboardWidget();
    }
  }

  componentAdded() {
    var com: any = this.$refs.routerContent;
    com.refreshData();
  }

  documentClicked(ev) {
    var windowWidth = window.screen.width;
    var mousePositionX = ev.clientX;
    var dashboardWidgetWidth = 350;
    if (ev.target.id != 'customize-button' && mousePositionX < (windowWidth - dashboardWidgetWidth)) {
      this.closeDashboardWidget();
    }
  }

  reportOperation() {
    if (this.report.show === true) {
      this.$modal.show("report-viewer-eng");
    } else {
      this.$modal.hide("report-viewer-eng");
    }
  }
}

interface ReportModel {
  data: any;
  path: string;
  show: boolean;
}
