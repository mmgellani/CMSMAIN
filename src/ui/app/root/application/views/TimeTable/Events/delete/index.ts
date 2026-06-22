/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import * as helper from "../../../../helper";
import { IEvents } from "../../../../models/academiccalendar/events";
import { AcademicCalendarEventService } from "../../../../service/AcademicCalendar/event";

@Component({
  name: "delete-modal",
  template: require("./index.html"),
})
export class DeleteEvents extends Vue {
  repository: AcademicCalendarEventService = new AcademicCalendarEventService(this.$store);
  private data: IEvents = {
    eventId: "",
    holidayTypeId: "",
    academicCalendarMasterId: "",
    description: "",
    statusId: 1,
    fromDate: new Date(),
    toDate: new Date(),
  };

  private title: string = "";

  created() {}

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
        text: "Record has been Deleted successful",
        title: "Deleted",
        messageTypeId: PayloadMessageTypes.warning,
      });
      this.cancel();
    });

    this.cancel();
  }
}
