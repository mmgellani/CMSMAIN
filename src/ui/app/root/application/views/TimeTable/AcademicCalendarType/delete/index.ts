/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { AcademicCalendarTypeService } from "../../../../service/AcademicCalendar/AcademicCalendarType";
import { IAcademicCalendarType } from "../../../../models/academiccalendar/academicCalendarType";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class AcademicCalendarTypeDelete extends Vue {
  private repository: AcademicCalendarTypeService;
  private data: IAcademicCalendarType = {
    academicCalendarTypeId: "",
    fullName: "",
    code: "",
    statusId: 0,
    isHoliday: true
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new AcademicCalendarTypeService(this.$store);
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
