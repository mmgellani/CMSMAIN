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

import { ISetupTerm, ISetupSession } from "../../../../models";
import { SetupTermService, SetupSessionService } from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupTerm = { data: ISetupTerm; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupTerm> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(100)
    },
    code: {
      required,
      maxLength: maxLength(10)
    },
    sessionId: {
      required
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class SetupTermAddEdit extends Vue {
  private repository: SetupTermService;
  private SessionList: Array<ISetupSession> = [];
  private SessionRepo: SetupSessionService = null;
  isActive: boolean = true;
  private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
  private sessionList: Array<ISetupSession> = [];
  private sessionId = "";


  private data: ISetupTerm = {
    termId: "",
    fullName: "",
    sessionId: "",
    code: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupTermService(this.$store);
    this.SessionRepo = new SetupSessionService(this.$store);
    // this.SessionRepo.GetFindBy("s=>s.StatusId==1")
    //   .then()
    //   .then(res => {
    //     this.SessionList = res as Array<ISetupSession>;
    //   });
  }

  loadSession() {
    this.sessionRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.sessionList = r as Array<ISetupSession>;
    });
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.loadSession();
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
    this.$modal.hide("add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.termId = helper.newGuid();
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

      this.cancel();
    }
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
