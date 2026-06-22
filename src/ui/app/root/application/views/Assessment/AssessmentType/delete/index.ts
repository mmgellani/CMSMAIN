/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";
import { IAssessmentType,IAssessmentTypeAdd,IAssessmentCategory } from '../../../../models/Setup/AssessmentType';

import { ISetupBusinessUnit } from "../../../../models";
import { SetupBusinessUnitService } from "../../../../service";
import { AssessmentTypeService } from '../../../../service/Setup/AssessmentType';

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class DeleteAssessmentTypeAdd extends Vue {
  private repository: AssessmentTypeService;
  private data: IAssessmentTypeAdd = {
    assessmentTypeId : "",
	assessmentCategoryId : "",
	examTypeId : "", 
  code :"",
	statusId : 0
  };
  private title: string = "Delete Record";

  created() {
    
    this.repository = new AssessmentTypeService(this.$store);
  }

  beforeModalOpen(event) {
    
    Object.assign(this.data, event.params.model);
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  deleteModel() {
    
    this.data.statusId = 2;
    this.repository.Update(this.data).then(() => {
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: "Record has been Deleted successfully",
        title: "Deleted",
        messageTypeId: PayloadMessageTypes.success
      });
      this.cancel();
    });

    this.cancel();
  }
}
