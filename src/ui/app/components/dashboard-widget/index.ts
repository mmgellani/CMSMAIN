import Vue from "vue";
import Component from "vue-class-component";
import { RolePrevilagesService } from "../../root/application/service";
import { IRoleDashboardfilter } from "../../root/application/models";
import { IUser, PayloadMessageTypes } from "../../model";
import { IRootStoreState } from "../../root/store";
import { State } from "vuex-class";
import { StoreTypes } from "../../store";

@Component({
  name: 'dashboard-widget',
  template: require("./index.html")
})
export class DashboardWidget extends Vue {
  @State((state: IRootStoreState) => state.common.user) user: IUser;
  private rolePrivilagesRepo: RolePrevilagesService = null;
  private roleDashboardList: Array<IRoleDashboardfilter> = [];
  private heldVsUnheld: boolean = false;
  private approvedVsUnapproved: boolean = false;
  private formcollectionsingle: boolean = false;
  private concessionGraph: boolean = false;
  private revenueGraph: boolean = false;
  private yearlyAdmission: boolean = false;
  private admissionTrend: boolean = false;
  private dashboardwidget: boolean = false;
  private todolist: boolean = false;
  private admissionCountWidget: boolean = false;
  created() {
    this.rolePrivilagesRepo = new RolePrevilagesService(this.$store);
    this.loadDashboardData();
  }
  loadcheck(key) {
    var ace = this.roleDashboardList.find(e => e.moduleId == key).roleDasboardId;
    var list = ace + "?" + this.user.userId;
    this.rolePrivilagesRepo.insertUserDashboard(list)
      .then(response => {
        response as any
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Widget successfully added!',
          title: 'Success',
          messageTypeId: PayloadMessageTypes.success
        })

        this.$emit("componentAdded", true);
      });

  }

  closeDashboardWidget() {
    this.$emit('closeDashboardWidget', false);
  }

  loadDashboardData() {
    this.roleDashboardList = [];
    this.rolePrivilagesRepo.GetAllRoleDashboard()
      .then(response => {
        this.roleDashboardList = (response as Array<IRoleDashboardfilter>)
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'heldVsUnheld') {
            this.heldVsUnheld = true;
          }
        });
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'approvedVsUnapproved') {
            this.approvedVsUnapproved = true;
          }
        });
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'form-collection-single') {
            this.formcollectionsingle = true;
          }
        });
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'concessionGraph') {
            this.concessionGraph = true;
          }
        });
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'revenueGraph') {
            this.revenueGraph = true;
          }
        });
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'dashboardwidget') {
            this.dashboardwidget = true;
          }
        });
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'todolist') {
            this.todolist = true;
          }
        });
        this.roleDashboardList.forEach(element => {
          if (element.moduleId == 'admissionCountWidget') {
            this.admissionCountWidget = true;
          }
        });

      });
  }
}
