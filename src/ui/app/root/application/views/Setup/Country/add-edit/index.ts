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

import { ISetupCountry } from "../../../../models";
import { SetupCountryService } from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupCountry = { data: ISetupCountry; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupCountry> = {
  data: {
    nationality: {
      required,
      maxLength: maxLength(50)
    },
    fullName: {
      required,
      maxLength: maxLength(100)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Country-add-edit-model",
  template: require("./index.html")
})
export class SetupCountryAddEdit extends Vue {
  private repository: SetupCountryService;
  private data: ISetupCountry = {
    countryId: "",
    fullName: "",
    statusId: 0,
    loggerId: "",
    nationality: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive = false;

  created() {
    this.repository = new SetupCountryService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("Country-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.countryId = helper.newGuid();
        this.data.loggerId = helper.newGuid();
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
  // get allowSubmit() {
  //   let error = this.$v.data.$error || this.$v.data.$invalid;
  //   return !error;
  // }
  $v: any;
}
