/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { between, maxLength, maxValue, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { ISetupSession } from "../../../../models";
import { PayloadMessageTypes } from "../../../../../../model";
import { SetupSessionService } from "../../../../service";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

type ValidateSetupSession = { data: ISetupSession; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupSession> = {
  data: {
    code: {
      required,
      maxLength: maxLength(3)
    },
    fullName: {
      required,
      maxLength: maxLength(4)
    },
    description: { required },
    workingDays: {
      required,
      between: between(1, 365)
    }
  }
};

@Component({
  mixins: [validationMixin],
  name: "Session-add-edit-model",
  template: require("./index.html"),
  validations: customValidation,
})
export class SetupSessionAddEdit extends Vue {
  private repository: SetupSessionService;
  isActive: boolean = true;
  private data: ISetupSession = {
    sessionId: "",
    code: "",
    fullName: "",
    description: "",
    workingDays: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private sessionModel: Array<ISetupSession> = [];

  created() {
    this.sessionModel=[];
    this.repository = new SetupSessionService(this.$store);
    this.repository.GetFindBy('e=>e.StatusId==1').then(r=>{
      this.sessionModel=r as Array<ISetupSession>
    })
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
    this.$modal.hide("Session-add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {

      if (this.IsNewRecord) {
        this.data.loggerId = helper.newGuid();
        this.data.sessionId = helper.newGuid();
        this.data.statusId = 1;
        if (this.sessionModel.find(e => e.fullName == this.data.fullName)) {
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
          if (this.sessionModel.find(e => e.fullName == this.data.fullName && e.code == this.data.code && e.description == this.data.description && e.workingDays == this.data.workingDays)) {
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
    }
  }

  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any
}
