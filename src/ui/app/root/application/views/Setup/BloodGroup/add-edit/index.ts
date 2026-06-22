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

import { ISetupBloodGroup } from "../../../../models";
import { SetupBloodGroupService } from "../../../../service";

import * as helper from "../../../../helper";
import { Model } from "vue-property-decorator";

type ValidateSetupBloodGroup = {
  data: ISetupBloodGroup;
  validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSetupBloodGroup> = {
  data: {
    // bloodGroupId: { required },
    fullName: {
      required,
      maxLength: maxLength(15)
    }
    // statusId: { required },
    // loggerId: { required },
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: "add-edit-model",
  template: require("./index.html")
})
export class SetupBloodGroupAddEdit extends Vue {
  private repository: SetupBloodGroupService;
  isActive: boolean = true;

  private data: ISetupBloodGroup = {
    bloodGroupId: "",
    fullName: "",
    statusId: 0,
    loggerId: ""
  };

  private datas: Array<ISetupBloodGroup> = [];

  private IsNewRecord: boolean = true;
  private title: string = "";
  private bloodGroupModel: Array<ISetupBloodGroup> = [];

  bloodGroupList = [{ item: "A+" }, { item: "A-" }, { item: "B+" }, { item: "B-" }, { item: "AB+" }, { item: "AB-" }, { item: "O+" }, { item: "O-" }];


  created() {
    this.repository = new SetupBloodGroupService(this.$store);
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
        this.bloodGroupModel = res as Array<ISetupBloodGroup>
      }
    )
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("add-edit-model");
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.datas = [];
        this.repository.GetAllActive()
          .then(response => {
            this.datas = (response as Array<ISetupBloodGroup>)
            var dupData = 0;
            dupData = this.datas.filter(s => s.fullName.toLowerCase() == this.data.fullName.toLowerCase()).length;
            if (dupData > 0) {
              this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Already Exists",
                title: "Warning",
                messageTypeId: PayloadMessageTypes.warning
              });
            } else {
              this.data.bloodGroupId = helper.newGuid();
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
        // this.data.bloodGroupId = helper.newGuid();
        // this.data.statusId = 1;
        // this.data.loggerId = helper.newGuid();
        // this.repository.AddOne(this.data).then(() => {
        //   this.$store.dispatch(StoreTypes.updateStatusBar, {
        //     text: "Record has been inserted successfully",
        //     title: "Success",
        //     messageTypeId: PayloadMessageTypes.success
        //   });
        // });

        // this.cancel();
      }
      else {
        if (this.isActive == true) {
          this.data.statusId = 1;
        } else {
          this.data.statusId = 0;
        }
        this.repository.Update(this.data).then(() => {
          if (this.bloodGroupModel.find(e => e.fullName == this.data.fullName)) {
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
      // this.cancel();
    }
  }
  get allowSubmit() {
    return this.data.fullName.length > 0;
  }
  $v: any;
}
