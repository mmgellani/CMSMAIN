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
import { BoardProgramCampusService } from "../../../../service/Board/ProgramCampus";
import { IBoardProgramCampus } from "../../../../models/Board/ProgramCampus";
import { IRegistrationCode } from "../../../../models/Board/RegistrationBoard";
import { RegistrationCodeService } from "../../../../service/Board/registrationCode";

@Component({
  name: "delete-modal",
  template: require("./index.html")
})
export class BoardProgramCampusDelete extends Vue {
 // private repository: BoardProgramCampusService;
  private repository: RegistrationCodeService;
  private data: IRegistrationCode = {
    registrationCodeId: "",
    title: "",
    description: "",
    programId: "",
    boardId: "",
    statusId: 0
  };
  private title: string = "Delete Record";

  created() {
    this.repository = new RegistrationCodeService(this.$store);
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

    this.cancel();
  }
}
