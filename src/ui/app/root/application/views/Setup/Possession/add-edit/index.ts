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

import { ISetupPossession, ISetupPossessionType } from "../../../../models";
import {
  SetupPossessionService,
  SetupPossessionTypeService
} from "../../../../service";

import * as helper from "../../../../helper";

import { SetupPossessionTypeAddEdit } from "../../PossessionType/add-edit";
type ValidateSetupPossession = {
  data: ISetupPossession;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupPossession> = {
  data: {
    fullName: { required },
    description: { required },
    possessionTypeId: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "Possession-add-edit-model",
  template: require("./index.html"),
  components: {
    PossessionType: SetupPossessionTypeAddEdit
  }
})
export class SetupPossessionAddEdit extends Vue {
  private repository: SetupPossessionService;
  private possessionTyperepository: SetupPossessionTypeService = null;
  isActive: boolean = true;
  possessionTypeList: Array<ISetupPossessionType> = [];
  private data: ISetupPossession = {
    possessionId: "",
    fullName: "",
    description: "",
    statusId: 0,
    loggerId: "",
    possessionTypeId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupPossessionService(this.$store);
    this.possessionTyperepository = new SetupPossessionTypeService(this.$store);
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
    this.possessionTyperepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.possessionTypeList = res as Array<ISetupPossessionType>;
    });
  }

  addNewPossessionType() {
    this.$modal.show("PossessionType-add-edit-model", { IsNewRecord: true });
  }
  loadPossessionType() {
    this.possessionTyperepository.GetFindBy("s=>s.StatusId==1").then(res => {
      this.possessionTypeList = res as Array<ISetupPossessionType>;
    });
  }

  cancel() {
    this.$modal.hide("Possession-add-edit-model");
    this.$emit("submit");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.loggerId = helper.newGuid();
        this.data.possessionId = helper.newGuid();
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
  $v: any
}
