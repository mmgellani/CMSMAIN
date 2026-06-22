/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupMedium, ISurveyMaster } from "../../../../models";
import {  } from "../../../../service";
import { SurveyDashboardMasterService } from "../../../../service/DashBoard/dashboardsurveymaster";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupMediumDelete extends Vue {
  private repository: SurveyDashboardMasterService;
  private data: ISurveyMaster = {
    surveyMasterId: '',
    name:'',
    description: '',

    statusId:1
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SurveyDashboardMasterService(this.$store);
  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  deleteModel() {
    this.data.statusId = 2;
    this.repository.Update(this.data).then(() => {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record has been Deleted successfully",
        title: "Deleted",
        messageTypeId: PayloadMessageTypes.warning
      });
      this.cancel();
    });

    this.cancel();
  }
}
