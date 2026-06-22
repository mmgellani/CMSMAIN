/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, email, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupBusinessGroup } from "../../../../models";
import { SetupBusinessGroupService } from "../../../../service";

import * as helper from "../../../../helper";
import { validations } from "../../../../../../admin/users/signup/signup-validate";

type ValidateSetupBusinessGroup = {
  data: ISetupBusinessGroup;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupBusinessGroup> = {
  data: {
    fullName: { required },
    slogan: { required },
    url: {
      required,
      maxLength: maxLength(30)
    },
    uan: { required },
    email: {
      required,
      email,
      maxLength: maxLength(35)
    }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "BusinessGrp-add-edit-model",
  template: require("./index.html"),
})
export class SetupBusinessGroupAddEdit extends Vue {
  private isActive: boolean = false;
  private repository: SetupBusinessGroupService = null;

  private data: ISetupBusinessGroup = {
    businessGroupId: "",
    fullName: "",
    url: "",
    uan: "",
    email: "",
    logo: "",
    slogan: "",
    statusId: 1,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SetupBusinessGroupService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";

    Object.assign(this.data, event.params.model);

    if (!this.IsNewRecord)
      if (this.data.statusId == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("BusinessGrp-add-edit-model");
  }

  onFileChange(e) {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.createImage(files[0]);
  }

  createImage(file) {
    var $this = this;
    helper.resizeImage({ file: file, maxSize: 120 }).then(resizeImage => {
      $this.data.logo = resizeImage as string;
    });
  }

  removeImage() {
    if (this.data.logo.length != 0) {
      this.data.logo = "";
    }
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {

      if (this.IsNewRecord) {
        this.data.loggerId = helper.newGuid();
        this.data.businessGroupId = helper.newGuid();
        this.data.statusId = 1;
        // this.data.logo = this.image

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

  $v: any;
}
