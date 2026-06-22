/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import { ISetupMedium } from "../../../../models";
import { SetupMediumService } from "../../../../service";
import { BoardBoardCampusService } from "../../../../service/Board/BoardCampus";
import { IBoardBoardCampus } from "../../../../models/Board/BoardCampus";
import { IBoardExamType } from "../../../../models/Board/BoardExamType";
import { SessionBoardExamTypeService } from "../../../../service/Board/BoardExamType";
import { ReturnTypeService } from "../../../../service/Board/ReturnType";
import { IReturnType } from "../../../../models/Board/ReturnType";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class BoardReturnTypeDelete extends Vue {
  private repository: ReturnTypeService;
  private data: IReturnType = {
    returnTypeId: "",
    fullName: "",
    description: "",
    statusId: 0,

  };
  private title: string = "Delete Record";

  created() {
    this.repository = new ReturnTypeService(this.$store);
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
        messageTypeId: PayloadMessageTypes.warning
      });
      this.cancel();
    });
  }
}
