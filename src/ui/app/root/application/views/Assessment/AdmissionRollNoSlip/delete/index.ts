/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupBuilding } from "../../../../models";
import { SetupBuildingService } from "../../../../service";
import { AssessmentSchedulingDeatilService } from "../../../../service/Assessment/AssessmentSchedulingDeatil";
import { IAssessmentSchedulingDetail, IAssessmentSchedulingList } from "../../../../models/Assessment/AssessmentSchedulingDetail";
import { AssessmentSchedulingMasterService } from "../../../../service/Assessment/AssessmentSchedulingMaster";
import { Console } from "console";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class AssessmentSchedulingDelete extends Vue {
  private repository: AssessmentSchedulingMasterService;
  private repositoryDetail: AssessmentSchedulingDeatilService;
  private dataEx: Array<IAssessmentSchedulingDetail> = [];

  private data: IAssessmentSchedulingList = {
    assessmentSchedulingMasterId:"",
    assessmentSchemeMasterId: "",
    assessmentName: "",
    totalWeightage: 0,
    failCriteris: "",
    gradingPolicy: "",
    statusId: 0
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new AssessmentSchedulingMasterService(this.$store);
    this.repositoryDetail = new AssessmentSchedulingDeatilService(this.$store);

  }

  beforeModalOpen(event) {
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  deleteModel() {
 
    var key= JSON.stringify(this.data);
   this.repositoryDetail.DeleteAssessmentSchedulingData(key).then(r=>{
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: "Record has been Deleted successfully",
      title: "Deleted",
      messageTypeId: PayloadMessageTypes.warning
    });
    this.cancel();
   });
 

    }
}
