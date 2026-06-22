import Vue from "vue";
import Component from "vue-class-component";
import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";
import { ISetupFranchise } from "../../../../models/Setup/Franchise";
import { SetupFranchiseService } from "../../../../service/Setup/Franchise";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class FranchiseDelete extends Vue {
  private service: SetupFranchiseService = null;
  private data: ISetupFranchise = {
    franchiseId: "",
    description: "",
    companyOperated: false,
    statusId: 2,
    loggerId: ""
  };
  private title: string = "Delete Record";

  created() {
    this.service = new SetupFranchiseService(this.$store);
  }

  beforeModalOpen(event) {
    this.data = event.params.model as ISetupFranchise;
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide("delete-model");
  }

  deleteData() {
   // this.data.statusId = 2;
    this.service.Update(this.data).then(() => {
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
