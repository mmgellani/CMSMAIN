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
import { BoardProgramCampusService } from "../../../../service/Board/ProgramCampus";
import { IBoardProgramCampus } from "../../../../models/Board/ProgramCampus";
import { max } from "moment";

type ValidateBoardProgramCampus = { data: IBoardProgramCampus; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateBoardProgramCampus> = {
  data: {
    title: {
      required,
      maxLength: maxLength(50)
    },
    description: {
      required,
      maxLength: maxLength(100)
    }
  }
};
@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'add-edit-model',
  template: require('./index.html')
})
export class BoardProgramCampusAddEdit extends Vue {
  private repository: BoardProgramCampusService;
  isActive: boolean = true;
  private data: IBoardProgramCampus = {
    programCampusId: "",
    title: "",
    description: "",
    programId: "",
    statusId: 0
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new BoardProgramCampusService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    if (this.data.statusId == 1) {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
  }

  cancel() {
    this.$emit("submit");
    this.$modal.hide('add-edit-model');
  }

  saveModel() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      if (this.IsNewRecord) {
        this.data.programCampusId = helper.newGuid();
        this.data.statusId = 1;
        this.data.programId = this.data.programId;
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

      // this.cancel();
    }
  }
  get allowSubmit() {
    return (
      this.data.title.length > 0 && this.data.description.length > 0
    );
  }
  $v: any;
}
