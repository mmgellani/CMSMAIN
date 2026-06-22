/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupZone, HolidayType } from "../../../../models";
import { SetupZoneService } from "../../../../service";
import { HolidayTypeService } from "../../../../service/AcademicCalendar/holidaytype";
import * as helper from "../../../../helper";
import { IHolidays } from "../../../../models/academiccalendar/holidays";
import { HolidayService } from "../../../../service/AcademicCalendar/holiday";

@Component({
  name: "delete-modal",
  template: require("./index.html"),
})
export class DeleteHolidays extends Vue {
  repository: HolidayService = new HolidayService(this.$store);
  private data: IHolidays = {
    holidayId: "",
    holidayTypeId: "",
    description: "",
    statusId: 1,
    dates: new Date(),
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
