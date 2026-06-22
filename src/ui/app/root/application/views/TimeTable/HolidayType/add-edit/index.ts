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
import { HolidayTypeService } from '../../../../service/AcademicCalendar/holidaytype';

import * as helper from "../../../../helper";
type ValidateHolidayType = { data: HolidayType, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateHolidayType> = {
  data: {
    name: { required },
    description: { required },
  }
};


@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "holidaytype-add-edit-model",
  template: require("./index.html")
})
export class HolidayTypeAddEdit extends Vue {
  repository: HolidayTypeService = new HolidayTypeService(this.$store);
  private data: HolidayType = {
    holidayTypeId: "",
    name: "",
    description: "",
    statusId: 0,
    isRecursive: false
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;


  created() {

  }

  beforeModalOpen(event) {

    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);


    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else if (this.data.statusId == 0) {
      this.isActive = false;
    }

  }

  cancel() {

    this.$modal.hide("holidaytype-add-edit-model");
  }

  saveModel() {

    this.$v.$touch();
    if (!this.$v.$invalid) {

      if (this.IsNewRecord) {
        this.data.holidayTypeId = helper.newGuid();

        this.data.statusId = 1;


        this.repository.AddOne(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
          this.$emit('submit');
        });
      }
      else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }

        this.repository.Update(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });

          this.cancel();
        });
      }
      this.cancel();
    }
  }

  $v: any;

}
