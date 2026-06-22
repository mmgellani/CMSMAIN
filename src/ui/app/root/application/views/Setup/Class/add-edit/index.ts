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

import { ISetupClass } from "../../../../models";
import { SetupClassService } from "../../../../service";

import * as helper from "../../../../helper";

type ValidateSetupClass = { data: ISetupClass; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupClass> = {
  data: {
    fullName: {
      required,
      maxLength: maxLength(50)
    },
    description: {
      required,
      maxLength: maxLength(50)
    },
    classCode: {
      required,
      maxLength: maxLength(20)
    },
    isAdmissionTest: { required },
    isInterview: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'Class-add-edit-model',
  template: require('./index.html')
})
export class SetupClassAddEdit extends Vue {
  private repository: SetupClassService;
  private data: ISetupClass = {
    classId: "",
    fullName: "",
    description: "",
    classCode: "",
    isAdmissionTest: null,
    isInterview: null,
    statusId: 0,
    loggerId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";
  private isActive: boolean = true;
  private isTrue: boolean = true;
  private isAdmission: boolean = true;
  private classModel: Array<ISetupClass> = [];

  created() {
    this.repository = new SetupClassService(this.$store);
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
    if (this.data.isAdmissionTest == 1) {
      this.isAdmission = true;
    }
    else {
      this.isAdmission = false;
    }

    if (this.data.isInterview == 1) {
      this.isTrue = true;
    }
    else {
      this.isTrue = false;
    }
    this.repository.GetAll().then(
      res => {
        this.classModel = res as Array<ISetupClass>
      }
    )
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide('Class-add-edit-model');
  }


  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {

      if (this.IsNewRecord) {
        this.data.classId = helper.newGuid();
        this.data.loggerId = helper.newGuid();
        this.data.statusId = 1;
        // if (this.classModel.find(e => e.fullName == this.data.fullName)) {
        //   this.$store.dispatch(StoreTypes.updateStatusBar, {
        //     text: "Record already exist",
        //     title: "Error",
        //     messageTypeId: PayloadMessageTypes.error
        //   });
        // }
        // else {
        if (this.isTrue == true) {
          this.data.isInterview = 1;
        } else {
          this.data.isInterview = 0;
        }
        if (this.isAdmission == true) {
          this.data.isAdmissionTest = 1;
        } else {
          this.data.isAdmissionTest = 0;
        }
        this.repository.AddOne(this.data).then(() => {
          this.$store.dispatch(StoreTypes.updateStatusBar, {
            text: "Record has been inserted successfully",
            title: "Success",
            messageTypeId: PayloadMessageTypes.success
          });
          this.cancel();
        });
        // }
      } else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        if (this.isTrue == true) {
          this.data.isInterview = 1;
        } else {
          this.data.isInterview = 0;
        }
        if (this.isAdmission == true) {
          this.data.isAdmissionTest = 1;
        } else {
          this.data.isAdmissionTest = 0;
        }
        this.repository.Update(this.data).then(() => {
          // if (this.classModel.find(e => e.fullName == this.data.fullName)) {
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
