/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { IAdmissionBulitanSale } from "../../../../models";
import { AdmissionBulitanSaleService } from "../../../../service";
import { AdmissionInquiryService } from "../../../../service/Admission/Inquiry";
import { IAdmissionInquiry } from "../../../../models/Admission/Inquiry";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class AdmissionInquiryDelete extends Vue {
  private repository: AdmissionInquiryService;
  private data: IAdmissionInquiry = {
    inquiryId: "",
        campusProgramId: "",
        inquiryNo: 0,
        dated: new Date(),
        reference: "",
        fullName: "",
        fatherName: "",
        institution: "",
        email: "",
        area: "",
        academicInfo: "",
        statusId: 0,
        contact: ""
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new AdmissionInquiryService(this.$store);
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
    this.repository.Update(this.data).then(() => {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record has been Deleted successfully",
        title: "Deleted",
        messageTypeId: PayloadMessageTypes.warning
      });
      this.cancel();
    });

    this.cancel();
  }
}
