/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupAddress, ISetupCity } from "../../../../models";
import { SetupAddressService, SetupCityService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupAddressDelete extends Vue {
  private repository: SetupAddressService;

  private data: ISetupAddress = {
    addressId: "",
    address: "",
    phoneNo: "",
    postalCode: "",
    cityId: "",
    statusId: 0,
    loggerId: "",
    subCityId:""
  };
  private title: string = "Delete Record";
  private refresh: Array<ISetupAddress> = [];


  created() {
    this.repository = new SetupAddressService(this.$store);
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
