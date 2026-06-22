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

import { ISetupMedium } from "../../../../models";
import { SetupMediumService } from "../../../../service";

import * as helper from "../../../../helper";
import { BoardBoardCampusService } from "../../../../service/Board/BoardCampus";
import { IBoardBoardCampus } from "../../../../models/Board/BoardCampus";

type ValidateBoardBoardCampus = { model: IBoardBoardCampus; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateBoardBoardCampus> = {
  model: {
    fullName: { required },
    abbrevation: { required }
  }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'BoardCampus-add-edit-model',
    template: require('./index.html')
})
export class BoardBoardCampusAddEdit extends Vue {
  private repository: BoardBoardCampusService;
  isActive: boolean = true;
  private data: IBoardBoardCampus = {
    boardCampusId: "",
    abbrevation: "",
    fullName: "",
    boardId: "",
    statusId: 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new BoardBoardCampusService(this.$store);
  }

  beforeModalOpen(event) {
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
  }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('BoardCampus-add-edit-model');
    }

  saveModel() {
    if (this.IsNewRecord) {
      this.data.boardCampusId = helper.newGuid();
      this.data.statusId = 1;
      this.repository.AddOne(this.data).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been inserted successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    } else {
      if (this.isActive == true) {
        this.data.statusId = 1;
      } else {
        this.data.statusId = 0;
      }

      this.repository.Update(this.data).then(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: "Record has been updated successfully",
          title: "Success",
          messageTypeId: PayloadMessageTypes.success
        });
        this.cancel();
      });
    }

    this.cancel();
  }
  get allowSubmit() {
    return (
      this.data.fullName.length > 0 &&
      this.data.abbrevation.length > 0
    );
  }
  $v: Vuelidate<any>;
}
