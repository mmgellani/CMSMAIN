/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupZone } from "../../../../models";
import { SetupZoneService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupZoneDelete extends Vue {
  private repository: SetupZoneService;
  private data: ISetupZone = {
    zoneId: "",
    fullName: "",
    description: "",
    statusId: 0,
    loggerId: ""
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SetupZoneService(this.$store);
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
