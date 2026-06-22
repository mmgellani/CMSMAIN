import Vue from "vue";
import Component from "vue-class-component";
import { State, Action } from "vuex-class";
import { TokenExpiry, ReportEngine } from "../../components";

import { AreaFooter } from "./footer/footer";
import { AreaSidebar } from "./navigation/sidebar";
import { AreaHeader } from "./header";
import { MobileArea } from "./mobile";

@Component({
  components: {
    AreaSidebar,
    TokenExpiry,
    AreaHeader,
    AreaFooter,
    MobileArea,
    "report-engine": ReportEngine
  },
  template: require("./layout.html")
})
export class AreaLayout extends Vue {
  created() {
    document.body.className =
      "kt-tasks__aside--left kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed";
  }
}

interface ReportModel {
  data: any;
  path: string;
  show: boolean;
}
