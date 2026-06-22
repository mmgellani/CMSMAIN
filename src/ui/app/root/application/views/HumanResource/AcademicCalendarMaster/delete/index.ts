/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { IAcademicCalendarMaster, ISetupMedium } from "../../../../models";
import { AcademicCalendarMasterService, SetupMediumService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class AcademicCalendarMasterDelete extends Vue {
  private repository: AcademicCalendarMasterService;
  private data: IAcademicCalendarMaster = {
    academicCalendarMasterId: '',
  sessionId: '',
  subCityId: '',
  classId: '',
  boardId: '',
  fullName: '',
  fromDate: new Date(),
  toDate: new Date(),
  weeks: 1,
  statusId: 1,
  isApproved: null,
  
};
  private title: string = "Delete Record";

  created() {
    this.repository = new AcademicCalendarMasterService(this.$store);
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
