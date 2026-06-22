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
import { SetupExtraCourseService } from "../../../../service/Setup/ExtraCourse";
import { ISetupExtraCourse } from "../../../../models/Setup/ExtraCourse";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SetupExtraCourseDelete extends Vue {
  private repository: SetupExtraCourseService;
  private data: ISetupExtraCourse = {
    extraCourseId: "",
    sessionId: "",
    campusId: "",
    courseId: "",
    statusId: 0
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SetupExtraCourseService(this.$store);
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
