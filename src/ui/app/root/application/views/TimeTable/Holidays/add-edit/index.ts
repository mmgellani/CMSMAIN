/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { HolidayType } from "../../../../models";
import { HolidayTypeService } from "../../../../service/AcademicCalendar/holidaytype";

import * as helper from "../../../../helper";
import { IHolidays } from "../../../../models/academiccalendar/holidays";
import { HolidayService } from "../../../../service/AcademicCalendar/holiday";
import moment from "moment";
type ValidateHoliday = { data: IHolidays, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateHoliday> = {
  data: {
    description: { required },
    dates: { required },
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "holidaytype-add-edit-model",
  template: require("./index.html"),
})
export class HolidaysAddEdit extends Vue {
  repository: HolidayService = new HolidayService(this.$store);
  private data: IHolidays = {
    holidayId: "",
    holidayTypeId: "",
    description: "",
    statusId: 1,
    dates: new Date(),
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;
  holidaytypelist: Array<HolidayType> = [];

  created() {
    this.loadHolidayType();
  }

  loadHolidayType() {
    this.repository.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.holidaytypelist = r as Array<HolidayType>;
    });
  }

  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";

    if (this.IsNewRecord == true) {
      Object.assign(this.data, event.params.model);
      this.data.holidayTypeId = event.params.holidayTypeId;
    }

    if (this.IsNewRecord == false) {
      this.data.holidayId = event.params.model.holidayId;
      this.data.description = event.params.model.description;
      this.data.holidayTypeId = event.params.model.holidayTypeId;
      this.data.dates = event.params.model.dates;
      this.data.statusId = event.params.model.statusId;
    }

    if (this.data.statusId == 1) {
      this.isActive = true;
    } else if (this.data.statusId == 0) {
      this.isActive = false;
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("holidays-add-edit-model");
  }

  saveModel() {

    this.$v.$touch();
    if (!this.$v.$invalid) {

      this.data.dates = new Date(moment(this.data.dates).format('YYYY-MM-DD'));
      if (this.IsNewRecord) {
        this.data.holidayId = helper.newGuid();
        this.data.statusId = 1;
        console.log(JSON.stringify(this.data));
        this.repository.AddOne(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successful",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success,
          });
          this.cancel();
        });
      } else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successful",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success,
          });

          this.cancel();
        });
      }

      this.cancel();
    }
  }
  $v: any;
}
