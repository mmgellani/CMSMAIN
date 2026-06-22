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
import { SetupConcessionRemarksService } from "../../../../service/Setup/ConcessionRemarks";
import { ISetupConcessoinRemarks, IVWConcessionRemarksVM } from "../../../../models/Setup/ConcessionRemarks";
import { timingSafeEqual } from "crypto";

type ValidateSetupConcessionRemarks = { data: ISetupConcessoinRemarks; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupConcessionRemarks> = {
  data: {
    remarks: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'Concession-Remarks-add-edit-model',
  template: require('./index.html')
})
export class SetupConcessionRemarksAddEdit extends Vue {
  private repository: SetupConcessionRemarksService;
  isActive: boolean = true;
  private data: ISetupConcessoinRemarks = {
    concessionRemarksId: '',
    campusId: '',
    remarks: '',
    statusId: 0,
    loggerId: '',
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private campusId: '';
  private datas: Array<IVWConcessionRemarksVM> = [];

  created() {
    this.repository = new SetupConcessionRemarksService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    this.campusId = event.params.model.campusId;
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
    this.$modal.hide('Concession-Remarks-add-edit-model');
  }

  refreshData() {
    this.datas = [];
    var key = this.campusId;
    this.repository.GetAllActive(key)
      .then(response => this.datas = (response as Array<IVWConcessionRemarksVM>));
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.datas = [];
        var key = this.campusId;
        this.repository.GetAllActive(key)
          .then(response => {
            this.datas = (response as Array<IVWConcessionRemarksVM>)
            var dupData = 0;
            dupData = this.datas.filter(s => s.remarks.toLowerCase() == this.data.remarks.toLowerCase()).length;
            if (dupData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            } else {
              this.data.concessionRemarksId = helper.newGuid();
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
            }
          });
        // debugger;
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
