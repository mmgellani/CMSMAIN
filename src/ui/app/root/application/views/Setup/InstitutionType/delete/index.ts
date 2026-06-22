/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupInstitutionType } from "../../../../models";
import { SetupInstitutionTypeService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupInstitutionTypeDelete extends Vue {
  private repository: SetupInstitutionTypeService;
  private data: ISetupInstitutionType = {
    institutionTypeID: "",
    name: "",
    description: "",
    statusId: 0,
    loggerId: ""
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SetupInstitutionTypeService(this.$store);
  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  deleteModel() {
    this.repository.Delete(this.data).then(() => {
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
