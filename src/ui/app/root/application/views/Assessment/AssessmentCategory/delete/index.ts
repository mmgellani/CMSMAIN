/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";
import { SessionDurationService } from "../../../../service/Attendance/SessionDuration";
import { ISessionDuration } from "../../../../models/Attendance/SessionDuration";
import { AssessmentCategoryService } from "../../../../service";
import { IAssessmentCategory } from "../../../../models/Assessment/AssessmentCategory";

// import { SessionDurationService } from "../../../../service/Examination/CampusFailCriteriaMapping";
// import { ISessionDuration } from "../../../../models/Examination/CampusFailCriteriaMapping";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class AssessmentCategoryDelete extends Vue {
  private repository: AssessmentCategoryService;
  private data: IAssessmentCategory = {
    assessmentCategoryId: "",
   
   
   fullName: "",
   code: "",

    statusId: 0,
    
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new AssessmentCategoryService(this.$store);
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
        messageTypeId: PayloadMessageTypes.success
      });
      this.cancel();
    });
  }
}
