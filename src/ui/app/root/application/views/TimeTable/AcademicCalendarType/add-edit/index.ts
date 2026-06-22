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


import * as helper from "../../../../helper";
import { IAcademicCalendarType } from "../../../../models/academiccalendar/academicCalendarType";
import { AcademicCalendarTypeService } from "../../../../service/AcademicCalendar/AcademicCalendarType";

type ValidateAcademicCalendarType = { data: IAcademicCalendarType; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAcademicCalendarType> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(50)
    },
    code: {
      required,
      maxLength: maxLength(20)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'add-edit-model',
  template: require('./index.html')
})
export class AcademicCalendarTypeAddEdit extends Vue {
  private repository: AcademicCalendarTypeService;
  private data: IAcademicCalendarType = {
    academicCalendarTypeId: "",
    fullName: "",
    code: "",
    statusId: 0,
    isHoliday: true
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;
  private isTrue: boolean = true;
  private isAdmission: boolean = true;

  created() {
    this.repository = new AcademicCalendarTypeService(this.$store);
  }

  
  beforeModalOpen(event) {
    this.$v.$reset();

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
    this.$emit("submit");
    this.$modal.hide('add-edit-model');
  }


  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.academicCalendarTypeId = helper.newGuid();
        this.data.statusId = 1;
        this.repository.AddOne(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
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
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
