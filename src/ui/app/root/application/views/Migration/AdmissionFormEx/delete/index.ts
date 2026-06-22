/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { IAdmissionAdmissionForm } from "../../../../models";
import { AdmissionAdmissionFormService } from "../../../../service";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class AdmissionAdmissionFormDelete extends Vue {
  private repository: AdmissionAdmissionFormService;
  private data: IAdmissionAdmissionForm = {
    admissionFormId: "",
    campusProgramId: "",
    studentId: "",
    admissionTypeId: "",
    admissionDate: new Date,
    rollNo: "",
    refferenceNo: "",
    statusId: 0,
    loggerId: "",
    studentType:"",formNo:"",operation:""
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new AdmissionAdmissionFormService(this.$store);
  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$modal.hide("delete-model");
    this.$emit("submit");
  }

  deleteModel() {
    this.data.statusId = 2;
    this.repository.Update(this.data).then(() =>
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record has been Deleted successfully",
        title: "Deleted",
        messageTypeId: PayloadMessageTypes.warning
      })
    );

    this.cancel();
  }
}
