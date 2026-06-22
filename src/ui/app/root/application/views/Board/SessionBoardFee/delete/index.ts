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
import { ISessionBoardFee } from "../../../../models/Board/sessionboardfee";
import { SessionBoardFeeService } from "../../../../service/Board/sessionboardfee";

@Component({
  name: "delete-model",
  template: require("./index.html")
})
export class SessionBoardFeeDelete extends Vue {
  private repository: SessionBoardFeeService;
  private data: ISessionBoardFee = {
    sessionBoardFeeId: "",
    sessionId: "",
    boardId: "",
    feeHeadId: "",
    amount: 0,
    statusId: 0
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new SessionBoardFeeService(this.$store);
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
