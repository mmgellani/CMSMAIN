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

import { ISetupProgram } from "../../../../models";
import { SetupProgramService } from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupProgram = { data: ISetupProgram; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupProgram> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    description: {
      required,
      maxLength: maxLength(100)
    },
    code: {
      required,
      maxLength: maxLength(10)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Program-add-edit-model",
  template: require("./index.html")
})
export class SetupProgramAddEdit extends Vue {
  private repository: SetupProgramService;
  isActive: boolean = true;
  private data: ISetupProgram = {
    programId: "",
    fullName: "",
    description: "",
    code: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private programModel: Array<ISetupProgram> = [];

  created() {
    this.repository = new SetupProgramService(this.$store);
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
        this.programModel = res as Array<ISetupProgram>
      }
    )
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("Program-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {

      if (this.IsNewRecord) {
        this.data.loggerId = helper.newGuid();
        this.data.programId = helper.newGuid();
        this.data.statusId = 1;
        // if (this.programModel.find(e => e.fullName == this.data.fullName)) {
        //   this.$store.dispatch(StoreTypes.updateStatusBar, {
        //     text: "Record has been updated successfully",
        //     title: "Error",
        //     messageTypeId: PayloadMessageTypes.error
        //   });
        // }
        // else {
        this.repository.AddOne(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });

          this.cancel();
        });
        // }
      }
      else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        this.repository.Update(this.data).then(() => {

          // if (this.programModel.find(e => e.fullName == this.data.fullName)) {
          //   this.$store.dispatch(StoreTypes.updateStatusBar, {
          //     text: "Record already exist",
          //     title: "Error",
          //     messageTypeId: PayloadMessageTypes.error
          //   });
          // }
          // else {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been updated successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          // }
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
