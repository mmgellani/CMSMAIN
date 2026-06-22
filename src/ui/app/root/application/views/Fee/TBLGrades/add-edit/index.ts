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
import { IFeeTBLGrades } from "../../../../models/Fee/TBLGrades";
import { FeeTBLGradesService } from "../../../../service/Fee/TBLGrades";
import VueJSModal from "vue-js-modal";

type ValidateFeeTBLGrades = { data: IFeeTBLGrades; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeTBLGrades> = {
  data: {
    grades: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'TBLGrades-add-edit-model',
  template: require('./index.html')
})
export class FeeTBLGradesAddEdit extends Vue {
  private repository: FeeTBLGradesService;
  isActive: boolean = true;
  // private grade: string = "";
  private data: IFeeTBLGrades = {
    scholarshipTypeId: "",
    grades: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new FeeTBLGradesService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();

    // this.data = {
    //   scholarshipTypeId: "",
    //   grades: "",
    //   statusId: 0,
    //   loggerId: ""
    // };
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide('TBLGrades-add-edit-model');
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.scholarshipTypeId = helper.newGuid();
        this.data.statusId = 1;
        this.data.loggerId = helper.newGuid();
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
    }
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any
}
