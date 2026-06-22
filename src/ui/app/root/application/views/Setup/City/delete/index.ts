/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupCity } from "../../../../models";
import { SetupCityService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupCityDelete extends Vue {
  private repository: SetupCityService;
  private data: ISetupCity = {
    cityId: "",
    fullName: "",
    cityCode: "",
    statusId: 0,
    loggerId: "",
    provinceId: "",
    zoneId: ""
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SetupCityService(this.$store);
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
