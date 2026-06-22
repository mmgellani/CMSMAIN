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

type ValidateSessionBoardFee = { data: ISessionBoardFee; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateSessionBoardFee> = {
  data: {
    sessionId: { required },
    boardId: { required },
    feeHeadId: { required },
    // challanTypeId: { required },
    amount: { required }
  }
};

@Component({
  mixins: [validationMixin],
  validations: customValidation,
  name: 'add-edit-model',
  template: require('./index.html')
})
export class SessionBoardFeeAddEdit extends Vue {
  feeHeadList: Array<IFeeFeeHead> = [];
  repoFeeHead: FeeFeeHeadService = new FeeFeeHeadService(this.$store);
  private challanTypeId: string = '';

  challanTypeList: Array<IFeeChallanType> = [];
  repoChallanType: FeeChallanTypeService = new FeeChallanTypeService(this.$store);
  private repository: SessionBoardFeeService;
  private sessionrepo: SetupSessionService = new SetupSessionService(this.$store)
  private boardrepo: SetupBoardService = new SetupBoardService(this.$store);
  private boardList: Array<ISetupBoard> = [];
  private SessionList: Array<ISetupSession> = [];

  isActive: boolean = true;
  private data: ISessionBoardFee = {
    sessionBoardFeeId: "",
    sessionId: "",
    boardId: "",
    amount: 0,
    statusId: 0,
    feeHeadId: ""
  };
  private IsNewRecord: boolean = true;
  private title: string = "";

  created() {
    this.repository = new SessionBoardFeeService(this.$store);
  }

  beforeModalOpen(event) {
    this.$v.$reset();
    this.IsNewRecord = event.params.IsNewRecord;
    this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
    Object.assign(this.data, event.params.model);
    this.loadSession();
    this.loadBoard();
    this.loadChallanTypeList();
    if (this.IsNewRecord == true) {
     this.challanTypeId = "";
    }
    else{
      this.challanTypeId = event.params.CHALLANTYPEID;
      this.repoFeeHead.GetFindBy('s=>s.ChallanTypeId.ToString()=="' + this.challanTypeId + '"')
        .then(r => {
          this.feeHeadList = r as Array<IFeeFeeHead>
        })
    }
  }
  loadSession() {
    this.SessionList = [];
    this.sessionrepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.SessionList = r as Array<ISetupSession>

      })
  }
  loadBoard() {
    this.boardList = [];
    this.boardrepo.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.boardList = r as Array<ISetupBoard>
      })
  }
  loadChallanTypeList() {
    this.challanTypeList = [];
    this.repoChallanType.GetFindBy('s=>s.StatusId==1')
      .then(r => {
        this.challanTypeList = r as Array<IFeeChallanType>
        var index1 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')))
        this.challanTypeList.splice(index1, 1);
        var index2 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('trans')))

        this.challanTypeList.splice(index2, 1);

      })
  }
  loadFeeHeads() {
    if (this.challanTypeId.length > 0) {
      this.feeHeadList = [];
      this.repoFeeHead.GetFindBy('s=>s.ChallanTypeId.ToString()=="' + this.challanTypeId + '"')
        .then(r => {
          this.feeHeadList = r as Array<IFeeFeeHead>
        })

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
        this.data.sessionBoardFeeId = helper.newGuid();
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
