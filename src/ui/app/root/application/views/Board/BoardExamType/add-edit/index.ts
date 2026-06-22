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

type ValidateSessionBoardFee = { data: ISessionBoardFee; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSessionBoardFee> = {
  data: {
    // sessionId: { required },
    // boardId: { required },
    // feeHeadId: { required }
    fullName: {
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
export class BoardExamTypeAddEdit extends Vue {
  feeHeadList: Array<IFeeFeeHead> = [];
  repoFeeHead: FeeFeeHeadService = new FeeFeeHeadService(this.$store);
  challanTypeId: string = '';
  challanTypeList: Array<IFeeChallanType> = [];
  repoChallanType: FeeChallanTypeService = new FeeChallanTypeService(this.$store);
  private repository: SessionBoardExamTypeService;
  private sessionrepo: SetupSessionService = new SetupSessionService(this.$store)
  private boardrepo: SetupBoardService = new SetupBoardService(this.$store);
  boardList: Array<ISetupBoard> = [];
  SessionList: Array<ISetupSession> = [];




  isActive: boolean = true;
  private data: IBoardExamType = {
    examTypeId: "",
    fullName: "",
    description: "",
    statusId: 0,

  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SessionBoardExamTypeService(this.$store);

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
        this.data.examTypeId = helper.newGuid();
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

      // this.cancel();
    }
  }
  // get allowSubmit() {
  //   return (
  //     this.data.fullName.length > 0 &&
  //     this.data.abbrevation.length > 0
  //   );
  // }
  $v: any;
}
