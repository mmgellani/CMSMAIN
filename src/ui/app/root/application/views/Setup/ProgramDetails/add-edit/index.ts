/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import * as helper from "../../../../helper";

import {
  ISetupMedium,
  ISetupProgramDetails,
  ISetupShift
} from "../../../../models";
import {
  SetupMediumService,
  SetupProgramDetailsService,
  SetupShiftService
} from "../../../../service";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";
import { maxLength, required } from "vuelidate/lib/validators";

import Component from "vue-class-component";
import { PayloadMessageTypes } from "../../../../../../model";
import { SetupMediumAddEdit } from "../../Medium/add-edit";
import { SetupShiftAddEdit } from "../../Shift/add-edit";
import { StoreTypes } from "../../../../../../store";
import Vue from "vue";

type ValidateSetupProgramDetails = {
  data: ISetupProgramDetails;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupProgramDetails> = {
  data: {
    description: { 
      required,
      maxLength: maxLength(100)
     },
    code: { 
      required,
      maxLength: maxLength(10)
     },
    shiftId: { required },
    mediumId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html"),
  components: {
    Shift: SetupShiftAddEdit,
    Medium: SetupMediumAddEdit
  }
})
export class SetupProgramDetailsAddEdit extends Vue {
  private isActive: boolean = true;
  private repository: SetupProgramDetailsService;

  private mediumList: Array<ISetupMedium> = [];
  private shiftList: Array<ISetupShift> = [];

  private mediumRepo: SetupMediumService = new SetupMediumService(this.$store);
  private shiftRepo: SetupShiftService = new SetupShiftService(this.$store);
  private data: ISetupProgramDetails = {
    programDetailId: "",
    description: "",
    code: "",
    programId: "",
    shiftId: "",
    mediumId: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupProgramDetailsService(this.$store);
    this.loadMedium();
    this.loadShift();
  }

  addNewShift() {
    this.$modal.show("Shift-add-edit-model", { IsNewRecord: true });
  }
  loadShift() {
    this.shiftRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.shiftList = r as Array<ISetupShift>;
    });
  }

  addNewMedium() {
    this.$modal.show("Medium-add-edit-model", { IsNewRecord: true });
  }
  loadMedium() {
    this.mediumRepo.GetFindBy("e=>e.StatusId==1").then(r => {
      this.mediumList = r as Array<ISetupMedium>;
    });
  }
  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    var sp = this.data.description.split("(");
    this.data.description = sp[0];
    if (this.IsNewRecord) {
    } else {
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
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
        this.data.loggerId = helper.newGuid();
        this.data.programDetailId = helper.newGuid();
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
    return (
      this.data.code.length > 0 &&
      this.data.shiftId.length > 0 &&
      this.data.mediumId.length > 0 &&
      this.data.description.length > 0
    );
  }
  $v: any;
}
