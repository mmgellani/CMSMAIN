/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ExaminationCampusFailCriteriaMappingService } from "../../../../service/Examination/CampusFailCriteriaMapping";
import { IExaminationCampusFailCriteriaMapping } from "../../../../models/Examination/CampusFailCriteriaMapping";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class ExaminationCampusFailCriteriaMappingDelete extends Vue {
  private repository: ExaminationCampusFailCriteriaMappingService;
  private data: IExaminationCampusFailCriteriaMapping = {
    campusFailCriteriaId: "",
    campusProgramId: "",
    failMasterId: "",
    statusId: 0,
    loggerId: "",
    examTypeId: "",
    month: new Date()
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new ExaminationCampusFailCriteriaMappingService(this.$store);
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
