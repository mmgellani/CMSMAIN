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
import { IEvents } from "../../../../models/academiccalendar/events";
import { AcademicCalendarEventService } from "../../../../service/AcademicCalendar/event";
type ValidateEvent = { data: IEvents, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateEvent> = {
  data: {

    holidayTypeId: {
      required,
    },
    description: {
      required,
    },
    fromDate: {
      required,
    },
    toDate: {
      required,
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "holidaytype-add-edit-model",
  template: require("./index.html"),
})
export class EventsAddEdit extends Vue {
  repository: AcademicCalendarEventService = new AcademicCalendarEventService(
    this.$store
  );
  repositoryHolidayType: HolidayTypeService = new HolidayTypeService(
    this.$store
  );
  private data: IEvents = {
    eventId: "",
    holidayTypeId: "",
    academicCalendarMasterId: "",
    description: "",
    statusId: 1,
    fromDate: new Date(),
    toDate: new Date(),
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;
  holidaytypelist: Array<HolidayType> = [];
  private masterFrom = "";
  private masterTo = ""

  created() {
    this.loadHolidayType();
  }

  loadHolidayType() {
    this.repositoryHolidayType.GetFindBy("e=>e.StatusId==1").then((r) => {
      this.holidaytypelist = r as Array<HolidayType>;
      this.holidaytypelist = this.holidaytypelist.filter(
        (e) => e.holidayTypeId != "fc478956-b943-482c-8c0d-8c5d9829cf5e"
      );
    });
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.loadHolidayType();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";

    this.masterFrom = event.params.masterFrom;
    this.masterTo = event.params.masterTo;
    if (this.IsNewRecord == true) {
      Object.assign(this.data, event.params.model);
      this.data.academicCalendarMasterId =
        event.params.academicCalendarMasterId;

    }

    if (this.IsNewRecord == false) {
      this.data.eventId = event.params.model.eventId;
      this.data.description = event.params.model.description;
      this.data.holidayTypeId = event.params.model.holidayTypeId;
      this.data.academicCalendarMasterId =
        event.params.model.academicCalendarMasterId;
      this.data.fromDate = event.params.model.fromDate;
      this.data.toDate = event.params.model.toDate;
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
    this.$modal.hide("events-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      this.data.fromDate = new Date(
        moment(this.data.fromDate).format("YYYY-MM-DD")
      );
      this.data.toDate = new Date(moment(this.data.toDate).format("YYYY-MM-DD"));
      if (this.IsNewRecord) {
        this.data.eventId = helper.newGuid();
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
  $v: any
}
