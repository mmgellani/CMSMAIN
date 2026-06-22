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

import { ISetupMedium, ISetupBoard, ISetupSession, IFeeFeeHead, IFeeChallanType } from "../../../../models";
import { SetupMediumService, SetupBoardService, SetupSessionService, FeeFeeHeadService, FeeChallanTypeService } from "../../../../service";

import * as helper from "../../../../helper";
import { BoardBoardCampusService } from "../../../../service/Board/BoardCampus";
import { IBoardBoardCampus } from "../../../../models/Board/BoardCampus";
import { SessionBoardFeeService } from "../../../../service/Board/sessionboardfee";
import { ISessionBoardFee } from "../../../../models/Board/sessionboardfee";
import { IBoardExamType } from "../../../../models/Board/BoardExamType";
import { SessionBoardExamTypeService } from "../../../../service/Board/BoardExamType";
import { ReturnTypeService } from "../../../../service/Board/ReturnType";
import { IReturnType } from "../../../../models/Board/ReturnType";

type ValidateSessionBoardFee = { data: IReturnType; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSessionBoardFee> = {
  data: {
    fullName: { required },
    description: { required }

  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'add-edit-model',
  template: require('./index.html')
})
export class BoardReturnTypeAddEdit extends Vue {

  isActive: boolean = true;
  private repository: ReturnTypeService;
  private data: IReturnType = {
    returnTypeId: "",
    fullName: "",
    description: "",
    statusId: 0,

  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new ReturnTypeService(this.$store);

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
        this.data.returnTypeId = helper.newGuid();
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
    }
  }
  get allowSubmit() {
    let error = this.$v.data.$error || this.$v.data.$invalid;
    return !error;
  }
  $v: any;
}
