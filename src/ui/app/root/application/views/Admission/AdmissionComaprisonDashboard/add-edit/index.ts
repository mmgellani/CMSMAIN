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

import { ISetupSection, DeviceInfoEx } from "../../../../models";
import { SetupSectionService } from "../../../../service";

import * as helper from "../../../../helper";
import { StudntListEx, IAttendenceDashboard } from "../../../../models/Attendance/attendenceDashboard";

type ValidateSetupSection = { model: ISetupSection; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSetupSection> = {
  model: {
    fullName: { required },
    description: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'add-edit-model',
  template: require('./index.html')
})
export class StudentList extends Vue {
  private repository: SetupSectionService;
  isActive: boolean = true;
  // private data: StudntListEx = {
  //   admissionFormId: "",
  //   rollNo: "",
  //   fullName: "",
  //   status: ""
  // };

  private data: Array<StudntListEx> = [];

  private Status: Array<IAttendenceDashboard> = [];

  private DeviceInfo: Array<DeviceInfoEx>;



  private IsNewRecord: boolean = true;
  private title: string = "";
  private Info: string = "";
  created() {
    this.repository = new SetupSectionService(this.$store);
  }

  beforeModalOpen(event) {
    this.Info = "";
    this.data = [];
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = 'Attendance Record';
    Object.assign(this.data, event.params.model);
    Object.assign(this.Status, event.params.Status);
    this.DeviceInfo = event.params.DeviceInfo
    //Object.assign(this.DeviceInfo, event.params.DeviceInfo);
    //console.log(JSON.stringify(this.DeviceInfo))
    var obj = JSON.parse(this.DeviceInfo[0].operation)

    this.Info = obj.browserInfo;

  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide('add-edit-model');
  }


  saveModel() {
    // if (this.IsNewRecord) {
    //   this.data.loggerId = helper.newGuid();
    //   this.data.sectionId = helper.newGuid();
    //   this.data.statusId = 1;
    //   this.repository.AddOne(this.data).then(() => {
    //     this.$store.dispatch(StoreTypes.updateStatusBar, {
    //       text: "Record has been inserted successfully",
    //       title: "Success",
    //       messageTypeId: PayloadMessageTypes.success
    //     });
    //     this.cancel();
    //   });
    // } else {
    //   if (this.isActive == true) {
    //     this.data.statusId = 1;
    //   } else {
    //     this.data.statusId = 0;
    //   }
    //   this.repository.Update(this.data).then(() => {
    //     this.$store.dispatch(StoreTypes.updateStatusBar, {
    //       text: "Record has been updated successfully",
    //       title: "Success",
    //       messageTypeId: PayloadMessageTypes.success
    //     });
    //     this.cancel();
    //   });
    // }

    // this.cancel();
  }
  get allowSubmit() {
    return this.data[0].fullName.length > 0;
  }
  $v: Vuelidate<any>;
}
