/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { ISetupZone } from "../../../../models";
import { PayloadMessageTypes } from "../../../../../../model";
import { SetupZoneService } from "../../../../service";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

type ValidateSetupZone = { data: ISetupZone; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupZone> = {
  data: {
    fullName: {
       required,
       maxLength: maxLength(100)
       },
    description: { 
      required,
      maxLength: maxLength(100)
     }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Zone-add-edit-model",
  template: require("./index.html")
})
export class SetupZoneAddEdit extends Vue {
  private repository: SetupZoneService;
  private data: ISetupZone = {
    zoneId: "",
    fullName: "",
    description: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;
  private zoneModel: Array<ISetupZone> = [];

  created() {
    this.repository = new SetupZoneService(this.$store);
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
    this.repository.GetAll().then(
      res => {
        this.zoneModel = res as Array<ISetupZone>
      }
    )
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("Zone-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {

      if (this.IsNewRecord) {
        this.data.zoneId = helper.newGuid();
        this.data.loggerId = helper.newGuid();
        this.data.statusId = 1;

        if (this.zoneModel.find(e => e.fullName == this.data.fullName)) {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record already exist",
            title: "Error",
            messageTypeId: PayloadMessageTypes.error
          });
        }
        else {
          this.repository.AddOne(this.data).then(() => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been inserted successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            });
            this.cancel();
          });
        }
      } else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        this.repository.Update(this.data).then(() => {

          if (this.zoneModel.find(e => e.fullName == this.data.fullName)) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record already exist",
              title: "Error",
              messageTypeId: PayloadMessageTypes.error
            });
          }
          else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
              text: "Record has been updated successfully",
              title: "Success",
              messageTypeId: PayloadMessageTypes.success
            });
          }
          this.cancel();
        });
      }

      this.cancel();
    }
  }
  // get allowSubmit() {
  //     let error = this.$v.data.$error || this.$v.data.$invalid;
  //     return !error;
  //   }
  $v: any;
}
