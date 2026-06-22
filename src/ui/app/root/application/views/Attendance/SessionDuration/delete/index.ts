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

// import { SessionDurationService } from "../../../../service/Examination/CampusFailCriteriaMapping";
// import { ISessionDuration } from "../../../../models/Examination/CampusFailCriteriaMapping";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class SessionDurationDelete extends Vue {
  private repository: SessionDurationService;
  private data: ISessionDuration = {
    sessionDurationId: "",
    campusProgramId: "",
    classId: "",
    startDate: new Date(),
    endDate: new Date(),
    statusId: 0,
    
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SessionDurationService(this.$store);
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
