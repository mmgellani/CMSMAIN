/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupCampusProgramLink, IAdmissionAdmissionFormVM } from "../../../../models";
import { SetupCampusProgramLinkService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupCampusProgramLinkDelete extends Vue {
  private repository: SetupCampusProgramLinkService;
  private data: ISetupCampusProgramLink = {
    campusProgramId: "",
    campusId: "",
    programDetailId: "",
    statusId: 0,
    loggerId: "",
    sessionId: ""
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SetupCampusProgramLinkService(this.$store);
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
  }
}
