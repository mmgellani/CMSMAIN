/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupBloodGroup } from "../../../../models";
import { SetupBloodGroupService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupBloodGroupDelete extends Vue {
  private repository: SetupBloodGroupService;
  private data: ISetupBloodGroup = {
    bloodGroupId: "",
    fullName: "",
    statusId: 0,
    loggerId: ""
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SetupBloodGroupService(this.$store);
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
