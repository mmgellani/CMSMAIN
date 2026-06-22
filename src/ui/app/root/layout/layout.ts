import Vue from "vue";
import Component from "vue-class-component";
import { State, Action } from "vuex-class";
import { TokenExpiry, ReportEngine, DashboardWidget } from "../../components";

import { AreaFooter } from "./footer/footer";
import { AreaSidebar } from "./navigation/sidebar";
import { AreaHeader } from "./header";
import { MobileArea } from "./mobile";

import { bus } from './../root'

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
  template: require("./layout.html")
})
export class AreaLayout extends Vue {
  @State((state: IRootStoreState) => state.reportOperation) report: ReportModel;
  dashboardVisible: boolean = false;
  sidebarVar: boolean = false
  viewCard = "";

  created() {
    document.body.className =
      "kt-tasks__aside--left kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed";

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

    var windowWidth1 = window.innerWidth;
    var windowWidth = window.screen.width;
    var mousePositionX = ev.clientX;
    var dashboardWidgetWidth = 350;
    var sidebarWidth = 265;
    if (ev.target.id != 'customize-button' && mousePositionX < (windowWidth - dashboardWidgetWidth)) {
      this.closeDashboardWidget();
    }
    if (windowWidth1 <= 1030 && mousePositionX > (sidebarWidth)) {
      bus.$emit('updated', this.sidebarVar);
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
