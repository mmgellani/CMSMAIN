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

import { ISetupCollector } from "../../../../models";
import { SetupCollectorService } from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupCollector = {
  data: ISetupCollector;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupCollector> = {
  data: {
    description: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class SetupCollectorAddEdit extends Vue {
  private isActive: boolean = true;
  private repository: SetupCollectorService;
  private data: ISetupCollector = {
    collectorId: "",
    description: "",
    campusId: "",
    statusId: 0,
    loggerId: ""
  };
  private campusId: '';
  private IsNewRecord: boolean = true;
  private collectorModel: Array<ISetupCollector> = [];
  private title: string = "";

  created() {
    this.repository = new SetupCollectorService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    this.campusId= event.params.model.campusId
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    } else {
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

        this.collectorModel = [];
        // var key = this.campusId;
        this.repository.GetFindBy('e => e.CampusId.ToString() == "' + this.campusId + '"')
          .then(response => {
            this.collectorModel = (response as Array<ISetupCollector>)
            // alert(JSON.stringify(this.datas));
            var dupData = 0;
            dupData = this.collectorModel.filter(s => s.description == this.data.description).length;
            if (dupData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            } else {
              this.data.loggerId = helper.newGuid();
              this.data.collectorId = helper.newGuid();
              this.data.statusId = 1;
              this.repository.AddOne(this.data).then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                  text: "Record has been inserted successfully",
                  title: "Success",
                  messageTypeId: PayloadMessageTypes.success
                });
                this.cancel();
              });
            }
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
