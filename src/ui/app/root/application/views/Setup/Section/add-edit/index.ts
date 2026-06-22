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

import { ISetupSection } from "../../../../models";
import { SetupSectionService } from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupSection = { data: ISetupSection; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupSection> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(30)
    },
    description: {
      required,
      maxLength: maxLength(50)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'Section-add-edit-model',
  template: require('./index.html')
})
export class SetupSectionAddEdit extends Vue {
  private repository: SetupSectionService;
  isActive: boolean = true;
  private data: ISetupSection = {
    sectionId: "",
    fullName: "",
    description: "",
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private datas: Array<ISetupSection> = [];

  created() {
    this.repository = new SetupSectionService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
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
    this.$modal.hide('Section-add-edit-model');
  }
  test() {
    this.datas = [];
    this.repository.GetFindBy('e => e.StatusId!=2')
      .then(response => {
        this.datas = (response as Array<ISetupSection>)
      });
  }
  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.datas = [];
        this.repository.GetFindBy('e => e.StatusId!=2')
          .then(response => {
            this.datas = (response as Array<ISetupSection>)
            var dupData = 0;
            dupData = this.datas.filter(e => e.fullName.toLowerCase() == this.data.fullName.toLowerCase()).length
            if (dupData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            }
            else {
              this.data.loggerId = helper.newGuid();
              this.data.sectionId = helper.newGuid();
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
  $v: any;
}
